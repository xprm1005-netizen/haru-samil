import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const STICKER_LABEL: Record<string, string> = {
  great: "잘했어",
  tired: "힘들었어",
  focused: "집중했어",
  calm: "잔잔했어",
  tough: "버텼어",
  proud: "뿌듯해",
};

const SYSTEM_PROMPT = `당신은 하루삼일 앱의 조용한 동반자입니다.
사용자의 오늘 하루 기록을 읽고, 2~3문장으로 따뜻하게 응답하세요.

규칙:
- 담담하고 짧게. 과장하거나 흥분하지 않는다.
- "실패", "아쉽다", "더 노력" 같은 말을 쓰지 않는다.
- 하루삼일의 철학: 오늘 못했어도 내일 세 번의 기회가 있다.
- 스티커 감정을 반영해서 공감한다.
- 2~3문장 이내. 한국어로만 응답한다.`;

export async function POST(req: NextRequest) {
  try {
    const { journal, sticker, daySummary } = await req.json();

    const stickerText = sticker ? `오늘의 감정: ${STICKER_LABEL[sticker] ?? sticker}` : "";
    const summaryText = daySummary
      ?.map((d: { index: number; goal: string; status: string }) =>
        `${d.index}일차 — ${d.goal || "(목표 없음)"} — ${d.status}`
      )
      .join("\n") ?? "";

    const userContent = [
      stickerText,
      summaryText && `하루 요약:\n${summaryText}`,
      journal && `일기:\n${journal}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userContent }],
    });

    const comment = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    return NextResponse.json({ comment });
  } catch (err) {
    console.error("journal-comment error:", err);
    return NextResponse.json({ error: "AI 멘트를 불러오지 못했습니다." }, { status: 500 });
  }
}
