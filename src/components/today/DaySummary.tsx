"use client";

import { useState } from "react";
import { DailyCycle, DayIndex, DayStatus } from "@/types";
import { getDaySummaryCopy, getDaySummaryButton } from "@/lib/copy";

const DAY_COLORS: Record<DayIndex, string> = {
  1: "var(--day-1)",
  2: "var(--day-2)",
  3: "var(--day-3)",
};

const STATUS_LABEL: Record<DayStatus, string> = {
  waiting:   "—",
  active:    "진행",
  completed: "해냄",
  missed:    "놓침",
  endured:   "버팀",
};

interface Props {
  cycle: DailyCycle;
  totalDays: number;
  onClose: () => void;
}

export default function DaySummary({ cycle, totalDays, onClose }: Props) {
  const [visible, setVisible] = useState(true);

  const doneCount = cycle.parts.filter(
    (p) => p.status === "completed" || p.status === "endured"
  ).length;

  const summaryCopy = getDaySummaryCopy(doneCount, totalDays);
  const buttonCopy = getDaySummaryButton(doneCount);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 350);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center"
      style={{
        backgroundColor: "rgba(0,0,0,0.85)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.35s ease-out",
      }}
    >
      <div
        className="w-full max-w-[430px] flex flex-col px-6 pt-6 pb-12"
        style={{
          backgroundColor: "var(--surface)",
          borderTop: "1px solid var(--line-2)",
          borderRadius: "12px 12px 0 0",
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "transform 0.35s cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        {/* handle */}
        <div className="flex justify-center py-2 mb-4">
          <div className="w-8 h-[3px] rounded-full" style={{ backgroundColor: "var(--text-3)" }} />
        </div>

        {/* title */}
        <div className="flex flex-col gap-1 mb-8">
          <span className="mono text-[10px] tracking-[0.18em] uppercase" style={{ color: "var(--text-3)" }}>
            오늘 마감
          </span>
          <h2 className="text-[22px] font-bold tracking-tight" style={{ color: "var(--text)" }}>
            오늘을 마칩니다.
          </h2>
        </div>

        {/* 3-day list */}
        <div className="flex flex-col mb-8">
          {cycle.parts.map((part, i) => {
            const color = DAY_COLORS[part.index];
            const isDone = part.status === "completed" || part.status === "endured";
            const isMissed = part.status === "missed";

            return (
              <div
                key={part.index}
                className="flex items-start gap-3 py-4"
                style={{ borderBottom: i < 2 ? "1px solid var(--line)" : undefined }}
              >
                <div
                  className="w-[5px] h-[5px] rounded-full mt-[7px] flex-shrink-0"
                  style={{
                    backgroundColor: isDone ? color : "var(--text-3)",
                    opacity: isMissed ? 0.4 : 1,
                  }}
                />
                <div className="flex-1 flex flex-col gap-0.5">
                  <div className="flex items-baseline justify-between">
                    <span
                      className="text-[14px] font-medium"
                      style={{ color: isDone ? "var(--text)" : "var(--text-3)" }}
                    >
                      {part.index}일차
                    </span>
                    <span
                      className="mono text-[11px]"
                      style={{ color: isDone ? color : "var(--text-3)" }}
                    >
                      {STATUS_LABEL[part.status]}
                    </span>
                  </div>
                  {part.goal && (
                    <p
                      className="text-[13px]"
                      style={{ color: isDone ? "var(--text-2)" : "var(--text-3)" }}
                    >
                      {part.goal}
                    </p>
                  )}
                  {part.note && (
                    <p className="text-[12px] italic" style={{ color: "var(--text-3)" }}>
                      "{part.note}"
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* summary copy */}
        <div className="flex flex-col gap-1 mb-8">
          {summaryCopy.split("\n").map((line, i) => (
            <p
              key={i}
              className={i === 0 ? "text-[15px]" : "text-[13px]"}
              style={{ color: i === 0 ? "var(--text-2)" : "var(--text-3)" }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* close button */}
        <button
          onClick={handleClose}
          className="w-full h-[52px] font-semibold tracking-wide transition-opacity active:opacity-70"
          style={{
            backgroundColor: "var(--text)",
            color: "var(--bg)",
            borderRadius: "4px",
            fontSize: "15px",
          }}
        >
          {buttonCopy}
        </button>
      </div>
    </div>
  );
}
