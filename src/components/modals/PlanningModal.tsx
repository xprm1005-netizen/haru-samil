"use client";

import { useState } from "react";
import { DayIndex } from "@/types";
import { useHaruSamilStore } from "@/store/useHaruSamilStore";

interface Props {
  onClose: () => void;
}

const DAY_COLORS: Record<DayIndex, string> = {
  1: "var(--day-1)",
  2: "var(--day-2)",
  3: "var(--day-3)",
};

type DayPlan = {
  goal: string;
  tasks: string[];
};

export default function PlanningModal({ onClose }: Props) {
  const { cycle, bulkPlan } = useHaruSamilStore();

  const [plans, setPlans] = useState<Record<DayIndex, DayPlan>>(() => {
    const init: Record<DayIndex, DayPlan> = {
      1: { goal: "", tasks: [] },
      2: { goal: "", tasks: [] },
      3: { goal: "", tasks: [] },
    };
    cycle?.parts.forEach((p) => {
      init[p.index] = {
        goal: p.goal,
        tasks: p.tasks.map((t) => t.text),
      };
    });
    return init;
  });

  const [addingTask, setAddingTask] = useState<DayIndex | null>(null);
  const [taskDraft, setTaskDraft] = useState("");

  const updateGoal = (index: DayIndex, goal: string) => {
    setPlans((prev) => ({ ...prev, [index]: { ...prev[index], goal } }));
  };

  const addTask = (index: DayIndex) => {
    if (taskDraft.trim()) {
      setPlans((prev) => ({
        ...prev,
        [index]: { ...prev[index], tasks: [...prev[index].tasks, taskDraft.trim()] },
      }));
      setTaskDraft("");
    } else {
      setAddingTask(null);
    }
  };

  const removeTask = (index: DayIndex, i: number) => {
    setPlans((prev) => ({
      ...prev,
      [index]: { ...prev[index], tasks: prev[index].tasks.filter((_, j) => j !== i) },
    }));
  };

  const handleStart = () => {
    bulkPlan(
      ([1, 2, 3] as DayIndex[]).map((idx) => ({
        index: idx,
        goal: plans[idx].goal,
        tasks: plans[idx].tasks,
      }))
    );
    onClose();
  };

  if (!cycle) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
    >
      <div
        className="w-full max-w-[430px] flex flex-col slide-up max-h-[92vh] overflow-y-auto"
        style={{
          backgroundColor: "var(--surface)",
          borderTop: "1px solid var(--line-2)",
          borderRadius: "12px 12px 0 0",
        }}
      >
        {/* handle */}
        <div className="flex justify-center pt-4 pb-1 flex-shrink-0">
          <div className="w-8 h-[3px] rounded-full" style={{ backgroundColor: "var(--text-3)" }} />
        </div>

        <div className="flex flex-col gap-6 px-6 pt-3 pb-10">
          <div className="flex items-center justify-between">
            <span className="mono text-[10px] tracking-[0.18em] uppercase" style={{ color: "var(--text-3)" }}>
              오늘 하루 계획
            </span>
            <button
              onClick={onClose}
              className="mono text-[11px] transition-opacity active:opacity-50"
              style={{ color: "var(--text-3)" }}
            >
              닫기
            </button>
          </div>

          {([1, 2, 3] as DayIndex[]).map((idx) => {
            const part = cycle.parts.find((p) => p.index === idx)!;
            const plan = plans[idx];
            const color = DAY_COLORS[idx];

            return (
              <div
                key={idx}
                className="flex flex-col gap-3 pb-5"
                style={{ borderBottom: idx < 3 ? "1px solid var(--line)" : undefined }}
              >
                {/* header */}
                <div className="flex items-center gap-2">
                  <div className="w-[5px] h-[5px] rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                    {idx}일차
                  </span>
                  <span className="mono text-[11px]" style={{ color: "var(--text-3)" }}>
                    {part.startTime} — {part.endTime}
                  </span>
                </div>

                {/* goal input */}
                <input
                  type="text"
                  value={plan.goal}
                  onChange={(e) => updateGoal(idx, e.target.value)}
                  placeholder={`${idx}일차 핵심 목표`}
                  maxLength={60}
                  className="w-full text-[15px] bg-transparent pb-1.5"
                  style={{
                    color: "var(--text)",
                    borderBottom: "1px solid var(--line-2)",
                    caretColor: "var(--text)",
                  }}
                />

                {/* tasks */}
                <div className="flex flex-col gap-2 pl-1">
                  {plan.tasks.map((t, i) => (
                    <div key={i} className="flex items-center gap-2.5 group">
                      <div
                        className="flex-shrink-0 w-[14px] h-[14px]"
                        style={{ border: "1px solid var(--line-2)", borderRadius: "3px" }}
                      />
                      <span className="flex-1 text-[13px]" style={{ color: "var(--text-2)" }}>{t}</span>
                      <button
                        onClick={() => removeTask(idx, i)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity active:opacity-50"
                        style={{ color: "var(--text-3)" }}
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  {addingTask === idx ? (
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex-shrink-0 w-[14px] h-[14px]"
                        style={{ border: "1px dashed var(--line-2)", borderRadius: "3px" }}
                      />
                      <input
                        type="text"
                        value={taskDraft}
                        onChange={(e) => setTaskDraft(e.target.value)}
                        placeholder="할 일"
                        maxLength={60}
                        className="flex-1 text-[13px] bg-transparent"
                        style={{ color: "var(--text)", caretColor: "var(--text)" }}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") { addTask(idx); }
                          if (e.key === "Escape") { setTaskDraft(""); setAddingTask(null); }
                        }}
                        onBlur={() => { addTask(idx); setAddingTask(null); }}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => { setAddingTask(idx); setTaskDraft(""); }}
                      className="flex items-center gap-2.5 text-left transition-opacity active:opacity-50"
                    >
                      <div
                        className="flex-shrink-0 w-[14px] h-[14px] flex items-center justify-center"
                        style={{ border: "1px dashed var(--line)", borderRadius: "3px" }}
                      >
                        <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                          <path d="M3.5 1V6M1 3.5H6" stroke="var(--text-3)" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <span className="text-[12px]" style={{ color: "var(--text-3)" }}>추가</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          <button
            onClick={handleStart}
            className="w-full h-[52px] font-semibold tracking-wide transition-opacity active:opacity-70"
            style={{
              backgroundColor: "var(--text)",
              color: "var(--bg)",
              borderRadius: "4px",
              fontSize: "15px",
            }}
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
