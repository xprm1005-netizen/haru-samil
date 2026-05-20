"use client";

import { DayIndex, DayPart, DayStatus } from "@/types";

const DAY_COLORS: Record<DayIndex, string> = {
  1: "var(--day-1)",
  2: "var(--day-2)",
  3: "var(--day-3)",
};

const STATUS_LABEL: Record<DayStatus, string> = {
  waiting: "대기",
  active:  "진행",
  completed: "해냄",
  missed:  "놓침",
  endured: "버팀",
};

interface Props {
  parts: DayPart[];
  currentIndex: DayIndex;
}

export default function ThreeDayTimeline({ parts, currentIndex }: Props) {
  return (
    <div className="flex items-start gap-0">
      {parts.map((part, i) => {
        const isActive = part.index === currentIndex;
        const isDone = part.status === "completed" || part.status === "endured" || part.status === "missed";
        const color = DAY_COLORS[part.index];

        return (
          <div key={part.index} className="flex items-start flex-1 gap-0">
            <div className="flex flex-col items-center gap-2 flex-1">
              {/* dot */}
              <div
                className="w-[6px] h-[6px] rounded-full mt-1 transition-all duration-300"
                style={{
                  backgroundColor: isActive
                    ? color
                    : isDone
                    ? color
                    : "var(--text-3)",
                  opacity: isDone && !isActive ? 0.5 : 1,
                  boxShadow: isActive ? `0 0 0 3px ${color}22` : undefined,
                }}
              />
              <div className="flex flex-col items-center gap-0.5">
                <span
                  className="mono text-[10px] tracking-[0.1em]"
                  style={{
                    color: isActive ? "var(--text)" : "var(--text-3)",
                  }}
                >
                  {part.index}일차
                </span>
                <span
                  className="mono text-[9px] tracking-[0.08em]"
                  style={{
                    color: isActive ? color : "var(--text-3)",
                    opacity: isActive ? 1 : 0.7,
                  }}
                >
                  {STATUS_LABEL[part.status]}
                </span>
                {part.tasks && part.tasks.length > 0 && (
                  <span
                    className="mono text-[9px]"
                    style={{ color: "var(--text-3)", opacity: 0.8 }}
                  >
                    {part.tasks.filter((t) => t.done).length}/{part.tasks.length}
                  </span>
                )}
              </div>
            </div>

            {/* connector line */}
            {i < parts.length - 1 && (
              <div
                className="h-[1px] flex-shrink-0 mt-[3.5px]"
                style={{
                  width: "100%",
                  backgroundColor: "var(--line-2)",
                  flex: "0 0 24px",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
