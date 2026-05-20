"use client";

import { useEffect, useState } from "react";
import { DayIndex } from "@/types";
import { getDayOpenerCopy } from "@/lib/copy";
import { formatTimeRange } from "@/lib/time/formatTimeRange";
import PlanningModal from "@/components/modals/PlanningModal";

const DAY_COLORS: Record<DayIndex, string> = {
  1: "var(--day-1)",
  2: "var(--day-2)",
  3: "var(--day-3)",
};

interface Props {
  dayIndex: DayIndex;
  startTime: string;
  endTime: string;
  isRestart: boolean;
  onDismiss: () => void;
}

export default function DayOpener({
  dayIndex,
  startTime,
  endTime,
  isRestart,
  onDismiss,
}: Props) {
  const [visible, setVisible] = useState(true);
  const [copy] = useState(() => getDayOpenerCopy(dayIndex, isRestart));
  const [showPlanning, setShowPlanning] = useState(false);
  const color = DAY_COLORS[dayIndex];

  const showPlanButton = dayIndex === 1 && !isRestart;

  // auto-dismiss after 3s (skip if planning modal is open)
  useEffect(() => {
    if (showPlanning) return;
    const timer = setTimeout(() => handleDismiss(), 3000);
    return () => clearTimeout(timer);
  }, [showPlanning]);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 350);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{
        backgroundColor: "var(--bg)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.35s ease-out",
      }}
      onClick={handleDismiss}
    >
      <div
        className="flex flex-col items-center gap-8 px-8 text-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-8px)",
          transition: "opacity 0.35s ease-out, transform 0.35s ease-out",
        }}
      >
        {/* day number — large */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-[6px] h-[6px] rounded-full"
            style={{ backgroundColor: color }}
          />
          <span
            className="mono text-[80px] font-bold leading-none"
            style={{ color: "var(--text)" }}
          >
            {dayIndex}
          </span>
          <span
            className="mono text-[11px] tracking-[0.22em] uppercase"
            style={{ color: "var(--text-3)" }}
          >
            일차
          </span>
        </div>

        {/* time range */}
        <span
          className="mono text-[18px]"
          style={{ color: "var(--text-2)" }}
        >
          {formatTimeRange(startTime, endTime)}
        </span>

        {/* copy */}
        <p
          className="text-[16px] leading-[1.8] max-w-[260px]"
          style={{ color: "var(--text-2)" }}
        >
          {copy}
        </p>

        {/* plan button for 1일차 */}
        {showPlanButton ? (
          <button
            onClick={(e) => { e.stopPropagation(); setShowPlanning(true); }}
            className="mono text-[11px] tracking-[0.12em] uppercase transition-opacity active:opacity-50"
            style={{ color }}
          >
            오늘 계획 세우기 →
          </button>
        ) : (
          <span
            className="mono text-[10px] tracking-[0.18em] uppercase"
            style={{ color: "var(--text-3)" }}
          >
            탭하여 시작
          </span>
        )}
      </div>

      {showPlanning && (
        <PlanningModal onClose={() => { setShowPlanning(false); handleDismiss(); }} />
      )}
    </div>
  );
}
