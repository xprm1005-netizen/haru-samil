"use client";

import { useState } from "react";

interface Props {
  onNext: (lifestyle: string) => void;
}

const PRESETS = [
  {
    label: "오늘의 에너지 충전하기",
    analyzingLabel: "에너지 충전",
    value: "활기차고 에너지 넘치는 하루. 운동, 생산적 활동, 자기계발.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    label: "나만의 온전한 휴식 설계",
    analyzingLabel: "휴식 설계",
    value: "충분한 휴식과 재충전. 수면, 취미, 심신 안정.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
  {
    label: "업무 몰입과 전문성 강화",
    analyzingLabel: "업무 몰입",
    value: "업무 집중과 전문성 향상. 핵심 업무, 학습, 커리어 성장.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    label: "지속 가능한 건강 루틴",
    analyzingLabel: "건강 루틴",
    value: "건강한 생활 습관. 운동, 식단 관리, 충분한 수면.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

export default function LifestyleSetup({ onNext }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isCustom, setIsCustom] = useState(false);
  const [customText, setCustomText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzingLabel, setAnalyzingLabel] = useState("");

  const startAnalysis = (value: string, label: string) => {
    setAnalyzingLabel(label);
    setAnalyzing(true);
    setTimeout(() => onNext(value), 1500);
  };

  const handleSelect = (value: string, label: string) => {
    setSelected(value);
    setIsCustom(false);
    startAnalysis(value, label);
  };

  const handleCustomToggle = () => {
    setIsCustom(true);
    setSelected(null);
  };

  const handleNext = () => {
    if (!customText.trim()) return;
    startAnalysis(customText.trim(), "라이프스타일");
  };

  if (analyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-8 px-6 fade-in">
        <div className="flex flex-col items-center gap-6">
          <span
            className="mono text-[11px] tracking-[0.22em] uppercase"
            style={{ color: "var(--text-3)" }}
          >
            AI 분석중
          </span>

          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: "var(--text-3)",
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>

          <div className="text-center flex flex-col gap-1.5">
            <p className="text-[17px] leading-[1.7]" style={{ color: "var(--text-3)" }}>
              AI가 사용자의
            </p>
            <p className="text-[20px] font-bold tracking-tight" style={{ color: "var(--text)" }}>
              [{analyzingLabel}]
            </p>
            <p className="text-[17px] leading-[1.7]" style={{ color: "var(--text-3)" }}>
              데이터를 분석중입니다...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between h-full px-6 py-14">
      <div className="flex flex-col gap-8 flex-1 justify-center">

        {/* header */}
        <div className="flex flex-col gap-3">
          <span
            className="mono text-[11px] tracking-[0.22em] uppercase"
            style={{ color: "var(--text-3)" }}
          >
            AI 설계
          </span>
          <h1
            className="text-[26px] font-bold leading-[1.2] tracking-tight"
            style={{ color: "var(--text)" }}
          >
            AI가 제안하는<br />
            당신만의 최적화된 일상
          </h1>
          <p className="text-[14px] leading-[1.6]" style={{ color: "var(--text-3)" }}>
            오늘 당신이 가장 집중하고 싶은<br />가치는 무엇인가요?
          </p>
        </div>

        {/* lifestyle cards */}
        <div className="flex flex-col gap-2">
          {PRESETS.map((preset) => {
            const isActive = selected === preset.value && !isCustom;
            return (
              <button
                key={preset.value}
                onClick={() => handleSelect(preset.value, preset.analyzingLabel)}
                className="w-full text-left px-4 font-medium transition-all duration-150 active:opacity-70"
                style={{
                  height: "58px",
                  borderRadius: "4px",
                  border: isActive ? "1px solid var(--text)" : "1px solid var(--line-2)",
                  backgroundColor: isActive ? "var(--surface-2)" : "transparent",
                  color: isActive ? "var(--text)" : "var(--text-2)",
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span style={{ flexShrink: 0, opacity: isActive ? 1 : 0.5 }}>
                  {preset.icon}
                </span>
                {preset.label}
              </button>
            );
          })}

          {/* custom input toggle */}
          <button
            onClick={handleCustomToggle}
            className="w-full h-[52px] text-left px-4 font-medium transition-all duration-150 active:opacity-70"
            style={{
              borderRadius: "4px",
              border: isCustom ? "1px solid var(--text)" : "1px solid var(--line-2)",
              backgroundColor: isCustom ? "var(--surface-2)" : "transparent",
              color: isCustom ? "var(--text)" : "var(--text-2)",
              fontSize: "15px",
            }}
          >
            직접 입력하기 ↓
          </button>

          {/* custom textarea */}
          {isCustom && (
            <div
              className="fade-in px-4 py-3"
              style={{
                border: "1px solid var(--line-2)",
                borderRadius: "4px",
                backgroundColor: "var(--surface)",
              }}
            >
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="원하는 삶을 자유롭게 적어주세요"
                maxLength={200}
                rows={3}
                className="w-full text-[14px] leading-[1.7] resize-none bg-transparent"
                style={{
                  color: "var(--text)",
                  caretColor: "var(--text)",
                  outline: "none",
                }}
                autoFocus
              />
              <span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>
                {customText.length}/200
              </span>
            </div>
          )}
        </div>

      </div>

      {/* CTA — only shown for custom input */}
      {isCustom && (
        <button
          onClick={handleNext}
          disabled={!customText.trim()}
          className="w-full h-[52px] font-semibold tracking-wide transition-opacity disabled:opacity-20 active:opacity-70 fade-in"
          style={{
            backgroundColor: "var(--text)",
            color: "var(--bg)",
            borderRadius: "4px",
            fontSize: "15px",
          }}
        >
          AI로 하루삼일 만들기
        </button>
      )}
    </div>
  );
}
