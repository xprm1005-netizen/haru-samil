import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `당신은 하루삼일 앱의 AI 설계사입니다.
하루삼일은 하루를 3개의 6시간 블록으로 나누는 앱입니다.
1일차(시작~+6h)는 하루를 여는 시간, 2일차(+6h~+12h)는 핵심 활동, 3일차(+12h~+18h)는 마무리입니다.

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
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("lifestyle-setup error: ANTHROPIC_API_KEY is not set");
    return NextResponse.json(
      { error: "서버 설정 오류입니다. 관리자에게 문의해주세요." },
      { status: 500 }
    );
  }

  const client = new Anthropic({ apiKey });

  try {
    const { lifestyle, startTime } = await req.json();

    const userContent = `라이프스타일 목표: ${lifestyle}\n하루 시작 시간: ${startTime}`;

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });

    const raw = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("lifestyle-setup: no JSON in response:", raw);
      throw new Error("Invalid response format");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("lifestyle-setup error:", message);
    return NextResponse.json(
      { error: "AI 설계에 실패했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
