"use client";

import { useState } from "react";
import { DayIndex } from "@/types";
import { useHaruSamilStore } from "@/store/useHaruSamilStore";

interface Props {
  dayIndex: DayIndex;
  currentGoal: string;
}

export default function RestartModal({ dayIndex, currentGoal }: Props) {
  const [changingGoal, setChangingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(currentGoal);
  const { restartDay, closeModal } = useHaruSamilStore();

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={(e) => e.target === e.currentTarget && closeModal()}
    >
      <div
        className="w-full max-w-[430px] px-6 pt-5 pb-10 flex flex-col gap-7 slide-up"
        style={{
          backgroundColor: "var(--surface)",
          borderTop: "1px solid var(--line-2)",
          borderRadius: "12px 12px 0 0",
        }}
      >
        {/* handle */}
        <div className="flex justify-center pt-1">
          <div
            className="w-8 h-[3px] rounded-full"
            style={{ backgroundColor: "var(--text-3)" }}
          />
        </div>

        {/* title */}
        <div className="flex flex-col gap-1.5">
          <span
            className="mono text-[10px] tracking-[0.18em] uppercase"
            style={{ color: "var(--text-3)" }}
          >
            재시작 — {dayIndex}일차
          </span>
          <h2
            className="text-[22px] font-bold tracking-tight leading-tight"
            style={{ color: "var(--text)" }}
          >
            {dayIndex}일차를 다시 시작합니다.
          </h2>
          <p
            className="text-[14px] leading-relaxed"
            style={{ color: "var(--text-2)" }}
          >
            방금 전까지는 이전 장면에 두고 오세요.
          </p>
        </div>

        {/* current goal preview */}
        {currentGoal && !changingGoal && (
          <div
            className="px-4 py-3"
            style={{
              backgroundColor: "var(--surface-2)",
              borderRadius: "4px",
              border: "1px solid var(--line)",
            }}
          >
            <p className="text-[13px]" style={{ color: "var(--text-2)" }}>
              현재 목표
            </p>
            <p className="text-[15px] font-medium mt-0.5" style={{ color: "var(--text)" }}>
              {currentGoal}
            </p>
          </div>
        )}

        {changingGoal ? (
          <div className="flex flex-col gap-4">
            <div
              className="pb-2"
              style={{ borderBottom: "1px solid var(--line-2)" }}
            >
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="새 목표를 입력하세요"
                maxLength={60}
                className="w-full text-[18px] font-medium py-1"
                style={{
                  color: "var(--text)",
                  caretColor: "var(--text)",
                }}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newGoal.trim()) restartDay(dayIndex, newGoal.trim());
                }}
              />
            </div>
            <button
              onClick={() => newGoal.trim() && restartDay(dayIndex, newGoal.trim())}
              disabled={!newGoal.trim()}
              className="w-full h-[52px] font-semibold tracking-wide transition-opacity disabled:opacity-20 active:opacity-70"
              style={{
                backgroundColor: "var(--text)",
                color: "var(--bg)",
                borderRadius: "4px",
                fontSize: "15px",
              }}
            >
              이 목표로 재시작
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => restartDay(dayIndex)}
              className="w-full h-[52px] font-semibold tracking-wide transition-opacity active:opacity-70"
              style={{
                backgroundColor: "var(--text)",
                color: "var(--bg)",
                borderRadius: "4px",
                fontSize: "15px",
              }}
            >
              같은 목표로 재시작
            </button>
            <button
              onClick={() => setChangingGoal(true)}
              className="w-full h-[52px] font-medium transition-opacity active:opacity-50"
              style={{
                color: "var(--text-2)",
                border: "1px solid var(--line-2)",
                borderRadius: "4px",
                fontSize: "15px",
              }}
            >
              목표 바꾸기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
