"use client";

import { useState } from "react";
import { DayIndex } from "@/types";
import { useHaruSamilStore } from "@/store/useHaruSamilStore";

interface Props {
  goal: string;
  dayIndex: DayIndex;
  onSave: (goal: string) => void;
}

export default function CurrentGoal({ goal, dayIndex, onSave }: Props) {
  const { history, settings, setRepeatGoal, clearRepeatGoal } = useHaruSamilStore();
  const [editing, setEditing] = useState(!goal);
  const [draft, setDraft] = useState(goal);

  const repeatGoal = settings.repeatGoals?.[dayIndex];
  const recentGoals = history.recentGoals ?? [];

  const handleSave = () => {
    if (draft.trim()) {
      onSave(draft.trim());
      setEditing(false);
    }
  };

  const handleRepeatToggle = () => {
    if (repeatGoal) {
      clearRepeatGoal(dayIndex);
    } else if (draft.trim()) {
      setRepeatGoal(dayIndex, draft.trim());
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <span
        className="mono text-[10px] tracking-[0.18em] uppercase"
        style={{ color: "var(--text-3)" }}
      >
        목표
      </span>

      {editing ? (
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="이번 하루에 하나만."
            maxLength={60}
            className="w-full text-[18px] font-medium bg-transparent pb-2"
            style={{
              color: "var(--text)",
              borderBottom: "1px solid var(--line-2)",
              caretColor: "var(--text)",
            }}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") { setDraft(goal); setEditing(false); }
            }}
          />

          {/* recent goal chips */}
          {recentGoals.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="mono text-[10px] tracking-[0.12em] uppercase" style={{ color: "var(--text-3)" }}>
                최근 목표
              </span>
              <div className="flex flex-wrap gap-1.5">
                {recentGoals.slice(0, 6).map((g) => (
                  <button
                    key={g}
                    onClick={() => setDraft(g)}
                    className="px-3 py-1.5 text-[12px] transition-all duration-100 active:opacity-50"
                    style={{
                      color: draft === g ? "var(--text)" : "var(--text-2)",
                      border: `1px solid ${draft === g ? "var(--text-3)" : "var(--line)"}`,
                      borderRadius: "3px",
                      backgroundColor: draft === g ? "var(--surface-2)" : "transparent",
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="mono text-[11px] tracking-[0.12em] uppercase transition-opacity active:opacity-50"
                style={{ color: "var(--text)" }}
              >
                저장 ↵
              </button>
              {goal && (
                <button
                  onClick={() => { setDraft(goal); setEditing(false); }}
                  className="mono text-[11px] tracking-[0.12em] uppercase transition-opacity active:opacity-50"
                  style={{ color: "var(--text-3)" }}
                >
                  취소
                </button>
              )}
            </div>

            {/* repeat toggle */}
            <button
              onClick={handleRepeatToggle}
              className="mono text-[11px] tracking-[0.08em] transition-opacity active:opacity-50"
              style={{
                color: repeatGoal ? "var(--day-1)" : "var(--text-3)",
              }}
            >
              {repeatGoal ? "매일 반복 중 · 해제" : "반복으로 설정"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => { setDraft(goal); setEditing(true); }}
            className="text-left text-[18px] font-medium leading-snug transition-opacity active:opacity-60"
            style={{ color: goal ? "var(--text)" : "var(--text-3)" }}
          >
            {goal || "목표를 입력하세요"}
          </button>
          {repeatGoal && (
            <span className="mono text-[10px]" style={{ color: "var(--day-1)" }}>
              ∞ 매일 반복
            </span>
          )}
        </div>
      )}
    </div>
  );
}
