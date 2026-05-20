"use client";

import { DayIndex } from "@/types";

const DAY_COLORS: Record<DayIndex, string> = {
  1: "var(--day-1)",
  2: "var(--day-2)",
  3: "var(--day-3)",
};

interface Props {
  remaining: string;
  dayIndex: DayIndex;
  progressPercent: number;
}

export default function TimeRemaining({ remaining, dayIndex, progressPercent }: Props) {
  const color = DAY_COLORS[dayIndex];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span
          className="mono text-[64px] font-bold leading-none tracking-tight tabular-nums"
          style={{ color: "var(--text)" }}
        >
          {remaining}
        </span>
        <span
          className="mono text-[10px] tracking-[0.18em] uppercase"
          style={{ color: "var(--text-3)" }}
        >
          남은 시간
        </span>
      </div>

      {/* progress track */}
      <div
        className="h-[2px] w-full rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--line-2)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-linear"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: color,
            opacity: 0.7,
          }}
        />
      </div>
    </div>
  );
}
