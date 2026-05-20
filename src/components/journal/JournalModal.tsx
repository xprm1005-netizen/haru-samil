"use client";

import { useState } from "react";
import { StickerType, DailyJournal } from "@/types";
import { useHaruSamilStore } from "@/store/useHaruSamilStore";

interface Props {
  date: string;
  existing?: DailyJournal | null;
  daySummary: { index: number; goal: string; status: string }[];
  onClose: () => void;
}

const STICKERS: { key: StickerType; label: string }[] = [
  { key: "great",   label: "잘했어" },
  { key: "tired",   label: "힘들었어" },
  { key: "focused", label: "집중했어" },
  { key: "calm",    label: "잔잔했어" },
  { key: "tough",   label: "버텼어" },
  { key: "proud",   label: "뿌듯해" },
];

export default function JournalModal({ date, existing, daySummary, onClose }: Props) {
  const { saveJournal, setJournalAiComment } = useHaruSamilStore();
  const [sticker, setSticker] = useState<StickerType | null>(existing?.sticker ?? null);
  const [text, setText] = useState(existing?.text ?? "");
  const [aiComment, setAiComment] = useState(existing?.aiComment ?? "");
  const [loadingAi, setLoadingAi] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleAiComment = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/journal-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journal: text, sticker, daySummary }),
      });
      const data = await res.json();
      if (data.comment) {
        setAiComment(data.comment);
      }
    } catch {
      setAiComment("AI 멘트를 불러오지 못했습니다.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSave = () => {
    saveJournal(date, text, sticker);
    if (aiComment) setJournalAiComment(date, aiComment);
    setSaved(true);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-[430px] flex flex-col slide-up max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: "var(--surface)",
          borderTop: "1px solid var(--line-2)",
          borderRadius: "12px 12px 0 0",
        }}
      >
        {/* handle */}
        <div className="flex justify-center pt-4 pb-1 flex-shrink-0">
          <div className="w-8 h-[3px] rounded-full" style={{ backgroundColor: "var(--text-3)" }} />
        </div>

        <div className="flex flex-col gap-6 px-6 pt-4 pb-10">
          {/* header */}
          <div className="flex flex-col gap-0.5">
            <span className="mono text-[10px] tracking-[0.18em] uppercase" style={{ color: "var(--text-3)" }}>
              오늘의 일기
            </span>
            <span className="mono text-[12px]" style={{ color: "var(--text-3)" }}>{date}</span>
          </div>

          {/* stickers */}
          <div className="flex flex-col gap-2.5">
            <span className="mono text-[10px] tracking-[0.12em] uppercase" style={{ color: "var(--text-3)" }}>
              오늘 어땠어?
            </span>
            <div className="grid grid-cols-3 gap-2">
              {STICKERS.map((s) => {
                const isSelected = sticker === s.key;
                return (
                  <button
                    key={s.key}
                    onClick={() => setSticker(isSelected ? null : s.key)}
                    className="py-3 text-[13px] font-medium transition-all duration-150"
                    style={{
                      borderRadius: "4px",
                      border: isSelected ? "1px solid var(--text)" : "1px solid var(--line)",
                      backgroundColor: isSelected ? "var(--surface-2)" : "transparent",
                      color: isSelected ? "var(--text)" : "var(--text-3)",
                    }}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* textarea */}
          <div
            className="flex flex-col gap-2"
            style={{ borderTop: "1px solid var(--line)", paddingTop: "20px" }}
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="오늘 하루를 적어보세요"
              maxLength={200}
              rows={4}
              className="w-full text-[14px] leading-[1.7] resize-none bg-transparent"
              style={{
                color: "var(--text)",
                caretColor: "var(--text)",
                outline: "none",
              }}
            />
            <span className="mono text-[10px] text-right" style={{ color: "var(--text-3)" }}>
              {text.length}/200
            </span>
          </div>

          {/* AI comment button */}
          <button
            onClick={handleAiComment}
            disabled={loadingAi || (!text.trim() && !sticker)}
            className="w-full h-[48px] font-medium transition-opacity disabled:opacity-20 active:opacity-70"
            style={{
              border: "1px solid var(--line-2)",
              borderRadius: "4px",
              fontSize: "14px",
              color: "var(--text-2)",
            }}
          >
            {loadingAi ? (
              <span className="flex items-center justify-center gap-1.5">
                <AiDots />
              </span>
            ) : (
              "AI 멘트 받기"
            )}
          </button>

          {/* AI comment result */}
          {aiComment && !loadingAi && (
            <div
              className="fade-in px-4 py-4 flex flex-col gap-1"
              style={{
                backgroundColor: "var(--surface-2)",
                borderRadius: "4px",
                border: "1px solid var(--line)",
              }}
            >
              <span className="mono text-[10px] tracking-[0.12em] uppercase" style={{ color: "var(--text-3)" }}>
                AI
              </span>
              <p className="text-[14px] leading-[1.7]" style={{ color: "var(--text-2)" }}>
                {aiComment}
              </p>
            </div>
          )}

          {/* save */}
          <button
            onClick={handleSave}
            disabled={!text.trim() && !sticker}
            className="w-full h-[52px] font-semibold tracking-wide transition-opacity disabled:opacity-20 active:opacity-70"
            style={{
              backgroundColor: saved ? "var(--day-1)" : "var(--text)",
              color: "var(--bg)",
              borderRadius: "4px",
              fontSize: "15px",
            }}
          >
            {saved ? "저장됨" : "저장하기"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AiDots() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: "var(--text-3)",
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            display: "inline-block",
          }}
        />
      ))}
    </>
  );
}
