"use client";

import { useState } from "react";
import { TaskItem, DayIndex } from "@/types";

interface Props {
  tasks: TaskItem[];
  dayIndex: DayIndex;
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const DAY_COLORS: Record<DayIndex, string> = {
  1: "var(--day-1)",
  2: "var(--day-2)",
  3: "var(--day-3)",
};

export default function TaskList({ tasks, dayIndex, onAdd, onToggle, onDelete }: Props) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const doneCount = tasks.filter((t) => t.done).length;
  const color = DAY_COLORS[dayIndex];

  const handleAdd = () => {
    if (draft.trim()) {
      onAdd(draft.trim());
      setDraft("");
    } else {
      setAdding(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span
          className="mono text-[10px] tracking-[0.18em] uppercase"
          style={{ color: "var(--text-3)" }}
        >
          할 일
        </span>
        {tasks.length > 0 && (
          <span className="mono text-[10px]" style={{ color: "var(--text-3)" }}>
            {doneCount}/{tasks.length}
          </span>
        )}
      </div>

      {/* task items */}
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-3 group"
        >
          {/* checkbox */}
          <button
            onClick={() => onToggle(task.id)}
            className="flex-shrink-0 w-[16px] h-[16px] flex items-center justify-center transition-all duration-150 active:scale-90"
            style={{
              border: `1px solid ${task.done ? color : "var(--line-2)"}`,
              borderRadius: "3px",
              backgroundColor: task.done ? color : "transparent",
            }}
          >
            {task.done && (
              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                <path d="M1 3.5L3.5 6L8 1" stroke="var(--bg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          {/* text */}
          <span
            className="flex-1 text-[14px] leading-snug transition-all duration-150"
            style={{
              color: task.done ? "var(--text-3)" : "var(--text-2)",
              textDecoration: task.done ? "line-through" : "none",
            }}
          >
            {task.text}
          </span>

          {/* delete — long-press hint via opacity on hover */}
          <button
            onClick={() => onDelete(task.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 active:opacity-50 flex-shrink-0"
            style={{ color: "var(--text-3)" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}

      {/* inline add */}
      {adding ? (
        <div className="flex items-center gap-3">
          <div
            className="flex-shrink-0 w-[16px] h-[16px]"
            style={{ border: "1px solid var(--line-2)", borderRadius: "3px" }}
          />
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="할 일을 입력하세요"
            maxLength={60}
            className="flex-1 text-[14px] bg-transparent"
            style={{ color: "var(--text)", caretColor: "var(--text)" }}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
              if (e.key === "Escape") { setDraft(""); setAdding(false); }
            }}
            onBlur={handleAdd}
          />
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-3 w-full text-left transition-opacity active:opacity-50"
        >
          <div
            className="flex-shrink-0 w-[16px] h-[16px] flex items-center justify-center"
            style={{ border: "1px dashed var(--line-2)", borderRadius: "3px" }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M4 1V7M1 4H7" stroke="var(--text-3)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-[13px]" style={{ color: "var(--text-3)" }}>
            할 일 추가
          </span>
        </button>
      )}
    </div>
  );
}
