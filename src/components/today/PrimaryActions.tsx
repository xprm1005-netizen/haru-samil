"use client";

import { DayIndex } from "@/types";

interface Props {
  dayIndex: DayIndex;
  onComplete: () => void;
  onRestart: () => void;
}

export default function PrimaryActions({ onComplete, onRestart }: Props) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onComplete}
        className="flex-1 h-[52px] text-[15px] font-semibold tracking-wide transition-opacity active:opacity-70"
        style={{
          backgroundColor: "var(--text)",
          color: "var(--bg)",
          borderRadius: "4px",
        }}
      >
        완료
      </button>
      <button
        onClick={onRestart}
        className="h-[52px] px-5 text-[15px] font-medium transition-opacity active:opacity-50"
        style={{
          color: "var(--text-2)",
          border: "1px solid var(--line-2)",
          borderRadius: "4px",
          backgroundColor: "transparent",
        }}
      >
        재시작
      </button>
    </div>
  );
}
