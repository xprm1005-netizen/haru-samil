"use client";

import { useState } from "react";
import { useHaruSamilStore } from "@/store/useHaruSamilStore";
import { DayIndex, DayStatus, StickerType } from "@/types";
import BottomNav from "@/components/ui/BottomNav";
import JournalModal from "@/components/journal/JournalModal";
import WeeklyGrid from "@/components/report/WeeklyGrid";

const DAY_COLORS: Record<DayIndex, string> = {
  1: "var(--day-1)",
  2: "var(--day-2)",
  3: "var(--day-3)",
};

const STATUS_LABEL: Record<DayStatus, string> = {
  waiting:   "대기",
  active:    "진행",
  completed: "해냄",
  missed:    "놓침",
  endured:   "버팀",
};

const STATUS_COLOR: Record<DayStatus, string> = {
  waiting:   "var(--text-3)",
  active:    "var(--day-2)",
  completed: "var(--day-1)",
  missed:    "var(--text-3)",
  endured:   "var(--day-3)",
};

const ENERGY_LABEL: Record<1 | 2 | 3, string> = {
  1: "흘려보냄",
  2: "적당히",
  3: "몰입",
};

const STICKER_LABEL: Record<StickerType, string> = {
  great:   "잘했어",
  tired:   "힘들었어",
  focused: "집중했어",
  calm:    "잔잔했어",
  tough:   "버텼어",
  proud:   "뿌듯해",
};

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export default function ReportPage() {
  const { cycle, journals, history } = useHaruSamilStore();
  const [showJournal, setShowJournal] = useState(false);

  const today = todayString();
  const journal = journals[today] ?? null;

  const doneCount = cycle?.parts.filter(
    (p) => p.status === "completed" || p.status === "endured"
  ).length ?? 0;

  const daySummary = cycle?.parts.map((p) => ({
    index: p.index,
    goal: p.goal,
    status: p.status,
  })) ?? [];

  return (
    <div
      className="min-h-screen w-full flex justify-center dot-grid"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="w-full max-w-[430px] flex flex-col pb-24 fade-in">
        <div className="px-6 pt-16 flex flex-col gap-10">
          {/* header */}
          <div className="flex flex-col gap-2">
            <span
              className="mono text-[10px] tracking-[0.18em] uppercase"
              style={{ color: "var(--text-3)" }}
            >
              오늘의 리포트
            </span>
            <h1
              className="text-[30px] font-bold tracking-tight"
              style={{ color: "var(--text)" }}
            >
              {cycle?.date ?? "—"}
            </h1>
          </div>

          {/* weekly grid */}
          <WeeklyGrid
            cycleHistory={history.cycleHistory ?? {}}
            today={today}
          />

          {/* summary */}
          {cycle && (
            <div
              className="py-5"
              style={{ borderBottom: "1px solid var(--line)" }}
            >
              <p
                className="text-[17px] leading-[1.7]"
                style={{ color: "var(--text-2)" }}
              >
                오늘은 3일 중{" "}
                <span
                  className="font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  {doneCount}일
                </span>
                을 살았습니다.
                <br />
                <span style={{ color: "var(--text-3)" }}>
                  {["", "하나라도 해냈습니다.", "잘 살았습니다.", "완벽한 하루입니다."][doneCount]}
                </span>
              </p>
            </div>
          )}

          {/* day results */}
          {cycle ? (
            <div className="flex flex-col">
              {cycle.parts.map((part, i) => {
                const color = DAY_COLORS[part.index];
                const statusLabel = STATUS_LABEL[part.status];
                const statusColor = STATUS_COLOR[part.status];

                return (
                  <div
                    key={part.index}
                    className="flex flex-col gap-3 py-6"
                    style={{
                      borderBottom: i < 2 ? "1px solid var(--line)" : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-[5px] h-[5px] rounded-full"
                          style={{
                            backgroundColor: color,
                            opacity: part.status === "waiting" ? 0.3 : 1,
                          }}
                        />
                        <span
                          className="text-[15px] font-semibold"
                          style={{ color: "var(--text)" }}
                        >
                          {part.index}일차
                        </span>
                        <span
                          className="mono text-[12px]"
                          style={{ color: "var(--text-3)" }}
                        >
                          {part.startTime} — {part.endTime}
                        </span>
                      </div>
                      <span
                        className="mono text-[11px] tracking-[0.1em]"
                        style={{ color: statusColor }}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    {part.goal && (
                      <p
                        className="text-[14px] pl-[17.5px]"
                        style={{
                          color: part.status === "waiting"
                            ? "var(--text-3)"
                            : "var(--text-2)",
                        }}
                      >
                        {part.goal}
                      </p>
                    )}

                    {part.note && (
                      <p
                        className="text-[13px] pl-[17.5px] italic"
                        style={{ color: "var(--text-3)" }}
                      >
                        "{part.note}"
                      </p>
                    )}

                    {part.energyLevel && (
                      <span
                        className="mono text-[10px] pl-[17.5px]"
                        style={{ color: "var(--text-3)" }}
                      >
                        {ENERGY_LABEL[part.energyLevel]}
                      </span>
                    )}

                    {part.tasks && part.tasks.length > 0 && (
                      <div className="flex flex-col gap-1.5 pl-[17.5px] pt-1">
                        {part.tasks.map((task) => (
                          <div key={task.id} className="flex items-center gap-2">
                            <div
                              className="flex-shrink-0 w-[12px] h-[12px] flex items-center justify-center"
                              style={{
                                border: `1px solid ${task.done ? color : "var(--line-2)"}`,
                                borderRadius: "2px",
                                backgroundColor: task.done ? color : "transparent",
                              }}
                            >
                              {task.done && (
                                <svg width="7" height="6" viewBox="0 0 7 6" fill="none">
                                  <path d="M1 3L2.8 5L6 1" stroke="var(--bg)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <span
                              className="text-[12px]"
                              style={{
                                color: task.done ? "var(--text-3)" : "var(--text-2)",
                                textDecoration: task.done ? "line-through" : "none",
                              }}
                            >
                              {task.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p
              className="text-[15px]"
              style={{ color: "var(--text-3)" }}
            >
              아직 오늘 데이터가 없습니다.
            </p>
          )}

          {/* divider */}
          <div style={{ borderBottom: "1px solid var(--line)" }} />

          {/* journal section */}
          <section className="flex flex-col gap-4 pb-4">
            <span className="mono text-[10px] tracking-[0.18em] uppercase" style={{ color: "var(--text-3)" }}>
              일기
            </span>

            {journal ? (
              <div className="flex flex-col gap-4">
                {/* sticker */}
                {journal.sticker && (
                  <span
                    className="mono text-[12px] tracking-[0.08em]"
                    style={{ color: "var(--text-2)" }}
                  >
                    {STICKER_LABEL[journal.sticker]}
                  </span>
                )}

                {/* text */}
                {journal.text && (
                  <p className="text-[15px] leading-[1.7]" style={{ color: "var(--text)" }}>
                    {journal.text}
                  </p>
                )}

                {/* ai comment */}
                {journal.aiComment && (
                  <div
                    className="px-4 py-4 flex flex-col gap-1"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderRadius: "4px",
                      border: "1px solid var(--line)",
                    }}
                  >
                    <span className="mono text-[10px] tracking-[0.12em] uppercase" style={{ color: "var(--text-3)" }}>
                      AI
                    </span>
                    <p className="text-[13px] leading-[1.7]" style={{ color: "var(--text-2)" }}>
                      {journal.aiComment}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setShowJournal(true)}
                  className="mono text-[11px] tracking-[0.1em] text-left transition-opacity active:opacity-50"
                  style={{ color: "var(--text-3)" }}
                >
                  수정하기 →
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowJournal(true)}
                className="w-full h-[52px] font-medium transition-opacity active:opacity-70"
                style={{
                  border: "1px solid var(--line-2)",
                  borderRadius: "4px",
                  fontSize: "15px",
                  color: "var(--text-2)",
                }}
              >
                오늘의 일기 쓰기 →
              </button>
            )}
          </section>
        </div>
      </div>

      <BottomNav active="report" />

      {showJournal && (
        <JournalModal
          date={today}
          existing={journal}
          daySummary={daySummary}
          onClose={() => setShowJournal(false)}
        />
      )}
    </div>
  );
}
