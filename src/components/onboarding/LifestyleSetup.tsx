"use client";

import { useState } from "react";

interface Props {
  onNext: (lifestyle: string) => void;
}

const PRESETS = [
  { label: "활기차게 살고 싶어", value: "활기차고 생산적인 삶. 운동, 집중 업무, 자기계발." },
  { label: "여유롭게 살고 싶어", value: "여유롭고 균형 잡힌 삶. 독서, 취미, 휴식." },
  { label: "돈을 모으고 싶어",   value: "재정적 자유를 위한 삶. 절약, 부업, 투자 공부." },
  { label: "커리어를 키우고 싶어", value: "성장 중심의 삶. 학습, 포트폴리오, 네트워킹." },
  { label: "건강해지고 싶어",    value: "건강한 삶. 운동, 식단 관리, 충분한 수면." },
];

export default function LifestyleSetup({ onNext }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isCustom, setIsCustom] = useState(false);
  const [customText, setCustomText] = useState("");

  const canProceed = isCustom ? customText.trim().length > 0 : selected !== null;

  const handleSelect = (value: string) => {
    setSelected(value);
    setIsCustom(false);
  };

  const handleCustomToggle = () => {
    setIsCustom(true);
    setSelected(null);
  };

  const handleNext = () => {
    if (!canProceed) return;
    onNext(isCustom ? customText.trim() : selected!);
  };

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
            className="text-[32px] font-bold leading-[1.1] tracking-tight"
            style={{ color: "var(--text)" }}
          >
            AI가 당신의
            <br />
            <span style={{ color: "var(--text-2)" }}>하루삼일을</span>
            <br />
            설계합니다.
          </h1>
          <p className="text-[14px] leading-[1.6]" style={{ color: "var(--text-3)" }}>
            어떻게 살고 싶으신가요?
          </p>
        </div>

        {/* lifestyle cards */}
        <div className="flex flex-col gap-2">
          {PRESETS.map((preset) => {
            const isActive = selected === preset.value && !isCustom;
            return (
              <button
                key={preset.value}
                onClick={() => handleSelect(preset.value)}
                className="w-full h-[52px] text-left px-4 font-medium transition-all duration-150 active:opacity-70"
                style={{
                  borderRadius: "4px",
                  border: isActive ? "1px solid var(--text)" : "1px solid var(--line-2)",
                  backgroundColor: isActive ? "var(--surface-2)" : "transparent",
                  color: isActive ? "var(--text)" : "var(--text-2)",
                  fontSize: "15px",
                }}
              >
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

          {/* custom textarea — slides in */}
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

      {/* CTA */}
      <button
        onClick={handleNext}
        disabled={!canProceed}
        className="w-full h-[52px] font-semibold tracking-wide transition-opacity disabled:opacity-20 active:opacity-70"
        style={{
          backgroundColor: "var(--text)",
          color: "var(--bg)",
          borderRadius: "4px",
          fontSize: "15px",
        }}
      >
        AI로 하루삼일 만들기
      </button>
    </div>
  );
}
