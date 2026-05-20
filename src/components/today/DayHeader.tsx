"use client";

import { DayIndex, DayPart } from "@/types";

const DAY_COLORS: Record<DayIndex, string> = {
  1: "var(--day-1)",
  2: "var(--day-2)",
  3: "var(--day-3)",
};

interface Props {
  part: DayPart;
}

export default function DayHeader({ part }: Props) {
  const color = DAY_COLORS[part.index];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div
          className="w-[5px] h-[5px] rounded-full"
          style={{ backgroundColor: color }}
        />
        <span
          className="mono text-[10px] tracking-[0.18em] uppercase"
          style={{ color: "var(--text-3)" }}
        >
          {part.index}일차
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <h1
          className="mono text-[32px] font-bold leading-none tracking-tight"
          style={{ color: "var(--text)" }}
        >
          {part.startTime}
          <span style={{ color: "var(--text-3)" }}> — </span>
          {part.endTime}
        </h1>
        <p
          className="text-sm"
          style={{ color: "var(--text-2)" }}
        >
          {part.role}
        </p>
      </div>
    </div>
  );
}
