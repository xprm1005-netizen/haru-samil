"use client";

import { useState } from "react";
import { CycleSnapshot, DayIndex, DayStatus } from "@/types";

interface Props {
  cycleHistory: Record<string, CycleSnapshot[]>;
  today: string;
}

const STATUS_COLOR: Record<DayStatus, string> = {
  completed: "var(--day-1)",
  endured:   "var(--day-3)",
  missed:    "var(--line-2)",
  active:    "var(--day-2)",
  waiting:   "transparent",
};

function getLast7Days(today: string): string[] {
  const result: string[] = [];
  const base = new Date(today);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    result.push(d.toISOString().slice(0, 10));
  }
  return result;
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function WeeklyGrid({ cycleHistory, today }: Props) {
  const [tooltip, setTooltip] = useState<{ date: string; index: DayIndex } | null>(null);
  const days = getLast7Days(today);

  const getStatus = (date: string, index: DayIndex): DayStatus | null => {
    const snapshot = cycleHistory[date];
    if (!snapshot) return null;
    return snapshot.find((p) => p.index === index)?.status ?? null;
  };

  const getGoal = (date: string, index: DayIndex): string => {
    return cycleHistory[date]?.find((p) => p.index === index)?.goal ?? "";
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="mono text-[10px] tracking-[0.18em] uppercase" style={{ color: "var(--text-3)" }}>
        지난 7일
      </span>

      {/* date headers */}
      <div className="flex gap-1.5">
        {days.map((date) => (
          <div key={date} className="flex-1 flex justify-center">
            <span
              className="mono text-[9px]"
              style={{ color: date === today ? "var(--text-2)" : "var(--text-3)" }}
            >
              {formatShortDate(date)}
            </span>
          </div>
        ))}
      </div>

      {/* 3 rows — one per day-part */}
      {([1, 2, 3] as DayIndex[]).map((index) => (
        <div key={index} className="flex gap-1.5 items-center">
          <div className="flex gap-1.5 flex-1">
            {days.map((date) => {
              const status = getStatus(date, index);
              const isToday = date === today;
              const isActive = tooltip?.date === date && tooltip?.index === index;

              return (
                <button
                  key={date}
                  className="flex-1 transition-all duration-150 active:opacity-70"
                  style={{
                    height: "22px",
                    borderRadius: "3px",
                    backgroundColor: status ? STATUS_COLOR[status] : "var(--surface)",
                    border: isToday
                      ? "1px solid var(--text-3)"
                      : isActive
                      ? "1px solid var(--text-3)"
                      : "1px solid transparent",
                    opacity: status === "waiting" || !status ? 0.4 : 1,
                  }}
                  onClick={() =>
                    setTooltip(
                      isActive ? null : status ? { date, index } : null
                    )
                  }
                />
              );
            })}
          </div>
          <span className="mono text-[9px] w-6 text-right flex-shrink-0" style={{ color: "var(--text-3)" }}>
            {index}일
          </span>
        </div>
      ))}

      {/* tooltip */}
      {tooltip && (
        <div
          className="fade-in px-3 py-2.5 flex flex-col gap-0.5"
          style={{
            backgroundColor: "var(--surface-2)",
            borderRadius: "4px",
            border: "1px solid var(--line)",
          }}
        >
          <span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>
            {tooltip.date} {tooltip.index}일차
          </span>
          <span className="text-[13px]" style={{ color: "var(--text-2)" }}>
            {getGoal(tooltip.date, tooltip.index) || "목표 없음"}
          </span>
        </div>
      )}

      {/* legend */}
      <div className="flex gap-4 pt-1">
        {[
          { label: "해냄", color: "var(--day-1)" },
          { label: "버팀", color: "var(--day-3)" },
          { label: "놓침", color: "var(--line-2)" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
            <span className="mono text-[9px]" style={{ color: "var(--text-3)" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
