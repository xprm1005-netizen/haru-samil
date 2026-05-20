import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `당신은 하루삼일 앱의 AI 설계사입니다.
하루삼일은 24시간을 3개의 8시간 블록으로 나누는 앱입니다.
1일차(시작~+8h)는 하루를 여는 시간, 2일차(+8h~+16h)는 핵심 활동, 3일차(+16h~+24h)는 마무리입니다.

사용자의 라이프스타일 목표를 듣고 하루삼일 계획을 설계하세요.

반드시 다음 JSON 형식으로만 응답하세요 (다른 텍스트 없이):
{
  "dayParts": [
    { "index": 1, "goal": "20자 이내 핵심 목표", "tasks": ["구체적 할 일 1", "구체적 할 일 2", "구체적 할 일 3"] },
    { "index": 2, "goal": "20자 이내 핵심 목표", "tasks": ["구체적 할 일 1", "구체적 할 일 2", "구체적 할 일 3"] },
    { "index": 3, "goal": "20자 이내 핵심 목표", "tasks": ["구체적 할 일 1", "구체적 할 일 2", "구체적 할 일 3"] }
  ],
  "message": "2문장 이내 따뜻한 한국어 코멘트"
}

규칙:
- goal은 20자 이내
- tasks는 일차당 3개, 각 30자 이내, 구체적이고 실행 가능하게
- 1일차: 시작 시간에 맞는 활동 (아침 시작이라면 운동/준비, 오후 시작이라면 집중 업무 등)
- 전체적으로 현실적이고 지속 가능하게
- 한국어로만 응답`;

export async function POST(req: NextRequest) {
  try {
    const { lifestyle, startTime } = await req.json();

    const userContent = `라이프스타일 목표: ${lifestyle}\n하루 시작 시간: ${startTime}`;

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userContent }],
    });

    const raw = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    // extract JSON from response (Claude may wrap in ```json blocks)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("lifestyle-setup error:", err);
    return NextResponse.json(
      { error: "AI 설계에 실패했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
