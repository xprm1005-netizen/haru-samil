"use client";

import { addHours } from "@/lib/time/formatTimeRange";

interface Props {
  startTime: string;
  onNext: () => void;
}

const DAY_COLORS = ["var(--day-1)", "var(--day-2)", "var(--day-3)"];
const DAY_ROLES = ["시작하는 나", "실행하는 나", "마무리하는 나"];

export default function ThreeDaysPreview({ startTime, onNext }: Props) {
  const parts = [1, 2, 3].map((i) => ({
    label: `${i}일차`,
    start: addHours(startTime, (i - 1) * 8),
    end: addHours(startTime, i * 8),
    role: DAY_ROLES[i - 1],
    color: DAY_COLORS[i - 1],
  }));

  return (
    <div className="flex flex-col justify-between h-full px-6 py-16">
      <div className="flex-1 flex flex-col justify-center gap-12">
        <div className="flex flex-col gap-4">
          <span
            className="mono text-[11px] tracking-[0.22em] uppercase"
            style={{ color: "var(--text-3)" }}
          >
            미리보기
          </span>
          <h2
            className="text-[30px] font-bold leading-tight tracking-tight"
            style={{ color: "var(--text)" }}
          >
            오늘의 3일
          </h2>
          <p className="text-[14px]" style={{ color: "var(--text-2)" }}>
            {startTime}부터 8시간씩 나뉩니다.
          </p>
        </div>

        <div className="flex flex-col">
          {parts.map((part, i) => (
            <div
              key={part.label}
              className="flex items-center gap-4 py-5"
              style={{
                borderBottom: i < 2 ? "1px solid var(--line)" : undefined,
              }}
            >
              <div
                className="w-[5px] h-[5px] rounded-full flex-shrink-0"
                style={{ backgroundColor: part.color }}
              />
              <div className="flex flex-col gap-0.5 flex-1">
                <div className="flex items-baseline justify-between">
                  <span
                    className="text-[16px] font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {part.label}
                  </span>
                  <span
                    className="mono text-[13px]"
                    style={{ color: "var(--text-2)" }}
                  >
                    {part.start} — {part.end}
                  </span>
                </div>
                <span
                  className="text-[12px]"
                  style={{ color: "var(--text-3)" }}
                >
                  {part.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full h-[52px] font-semibold tracking-wide transition-opacity active:opacity-70"
        style={{
          backgroundColor: "var(--text)",
          color: "var(--bg)",
          borderRadius: "4px",
          fontSize: "15px",
        }}
      >
        좋습니다
      </button>
    </div>
  );
}
