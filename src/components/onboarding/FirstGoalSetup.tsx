"use client";

import { useState } from "react";

interface Props {
  onDone: (goal: string) => void;
}

export default function FirstGoalSetup({ onDone }: Props) {
  const [goal, setGoal] = useState("");

  return (
    <div className="flex flex-col justify-between h-full px-6 py-16">
      <div className="flex-1 flex flex-col justify-center gap-12">
        <div className="flex flex-col gap-4">
          <span
            className="mono text-[11px] tracking-[0.22em] uppercase"
            style={{ color: "var(--text-3)" }}
          >
            1일차 목표
          </span>
          <h2
            className="text-[30px] font-bold leading-tight tracking-tight"
            style={{ color: "var(--text)" }}
          >
            이것 하나만<br />해내면 됩니다.
          </h2>
          <p className="text-[14px]" style={{ color: "var(--text-2)" }}>
            나머지 일차 목표는 나중에 설정해도 됩니다.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="목표를 입력하세요"
            maxLength={60}
            className="w-full text-[20px] font-medium bg-transparent py-3"
            style={{
              color: "var(--text)",
              borderBottom: "1px solid var(--line-2)",
              caretColor: "var(--text)",
            }}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && goal.trim()) onDone(goal.trim());
            }}
          />
          <p
            className="mono text-[11px] tracking-[0.1em]"
            style={{ color: "var(--text-3)" }}
          >
            {goal.length} / 60
          </p>
        </div>
      </div>

      <button
        onClick={() => goal.trim() && onDone(goal.trim())}
        disabled={!goal.trim()}
        className="w-full h-[52px] font-semibold tracking-wide transition-opacity disabled:opacity-20 active:opacity-70"
        style={{
          backgroundColor: "var(--text)",
          color: "var(--bg)",
          borderRadius: "4px",
          fontSize: "15px",
        }}
      >
        하루삼일 시작
      </button>
    </div>
  );
}
