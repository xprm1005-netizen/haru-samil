"use client";

import { useEffect, useState } from "react";
import { DayIndex } from "@/types";
import { useHaruSamilStore } from "@/store/useHaruSamilStore";
import { getCheckInPrompt, getCheckInResultCopy } from "@/lib/copy";

interface Props {
  dayIndex: DayIndex;
}

type CheckStatus = "missed" | "endured" | "completed";
type ModalStep = "reflection" | "choice" | "result";

const OPTIONS: { value: CheckStatus; label: string }[] = [
  { value: "missed",    label: "놓쳤다" },
  { value: "endured",   label: "버텼다" },
  { value: "completed", label: "해냈다" },
];

const goal_from_cycle = (cycle: ReturnType<typeof useHaruSamilStore.getState>["cycle"], index: DayIndex) =>
  cycle?.parts.find((p) => p.index === index)?.goal ?? "";

export default function CheckInModal({ dayIndex }: Props) {
  const { cycle, checkIn, closeModal } = useHaruSamilStore();
  const goal = goal_from_cycle(cycle, dayIndex);

  const tasks = cycle?.parts.find((p) => p.index === dayIndex)?.tasks ?? [];
  const doneTasks = tasks.filter((t) => t.done).length;

  const [step, setStep] = useState<ModalStep>("reflection");
  const [selected, setSelected] = useState<CheckStatus | null>(null);
  const [energy, setEnergy] = useState<1 | 2 | 3 | null>(null);
  const [note, setNote] = useState("");
  const [resultCopy, setResultCopy] = useState("");
  const [visible, setVisible] = useState(true);

  // auto-advance from reflection to choice
  useEffect(() => {
    if (step === "reflection") {
      const t = setTimeout(() => setStep("choice"), 1400);
      return () => clearTimeout(t);
    }
  }, [step]);

  // after result shown, close modal
  useEffect(() => {
    if (step === "result") {
      const t = setTimeout(() => {
        setVisible(false);
        setTimeout(closeModal, 300);
      }, 1600);
      return () => clearTimeout(t);
    }
  }, [step]);

  const handleSubmit = () => {
    if (!selected) return;
    const copy = getCheckInResultCopy(selected);
    setResultCopy(copy);
    checkIn(dayIndex, selected, note.trim() || undefined, energy ?? undefined);
    setStep("result");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget && step === "choice") closeModal();
      }}
    >
      <div
        className="w-full max-w-[430px] flex flex-col slide-up"
        style={{
          backgroundColor: "var(--surface)",
          borderTop: "1px solid var(--line-2)",
          borderRadius: "12px 12px 0 0",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease-out",
        }}
      >
        {/* handle */}
        <div className="flex justify-center pt-4 pb-1">
          <div className="w-8 h-[3px] rounded-full" style={{ backgroundColor: "var(--text-3)" }} />
        </div>

        {/* ── STEP: reflection ── */}
        {step === "reflection" && (
          <div className="flex flex-col gap-5 px-6 py-8">
            <span
              className="mono text-[10px] tracking-[0.18em] uppercase"
              style={{ color: "var(--text-3)" }}
            >
              잠깐.
            </span>
            <div className="flex flex-col gap-2">
              <p className="text-[16px]" style={{ color: "var(--text-2)" }}>
                {getCheckInPrompt(dayIndex)}
              </p>
              {goal && (
                <p className="text-[20px] font-semibold leading-snug" style={{ color: "var(--text)" }}>
                  "{goal}"
                </p>
              )}
              <p className="text-[14px]" style={{ color: "var(--text-3)" }}>
                를 하려 했습니다.
              </p>
              {tasks.length > 0 && (
                <p className="mono text-[12px]" style={{ color: "var(--text-3)" }}>
                  할 일 {tasks.length}개 중 {doneTasks}개 완료
                </p>
              )}
            </div>
            {/* subtle loading bar */}
            <div className="h-[1px] w-full overflow-hidden" style={{ backgroundColor: "var(--line)" }}>
              <div
                className="h-full"
                style={{
                  backgroundColor: "var(--text-2)",
                  animation: "barFill 1.4s linear forwards",
                }}
              />
            </div>
          </div>
        )}

        {/* ── STEP: choice ── */}
        {step === "choice" && (
          <div className="flex flex-col gap-6 px-6 pt-5 pb-9">
            <div className="flex flex-col gap-1">
              <span
                className="mono text-[10px] tracking-[0.18em] uppercase"
                style={{ color: "var(--text-3)" }}
              >
                체크인 — {dayIndex}일차
              </span>
              <h2
                className="text-[22px] font-bold tracking-tight"
                style={{ color: "var(--text)" }}
              >
                {dayIndex}일차를 어떻게 살았나요?
              </h2>
            </div>

            <div className="flex gap-2">
              {OPTIONS.map((opt) => {
                const isSelected = selected === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setSelected(opt.value)}
                    className="flex-1 py-4 text-[15px] font-semibold transition-all duration-150"
                    style={{
                      borderRadius: "4px",
                      border: isSelected
                        ? "1px solid var(--text)"
                        : "1px solid var(--line-2)",
                      backgroundColor: isSelected ? "var(--surface-2)" : "transparent",
                      color: isSelected ? "var(--text)" : "var(--text-2)",
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* energy level */}
            <div className="flex flex-col gap-2">
              <span className="mono text-[10px] tracking-[0.12em] uppercase" style={{ color: "var(--text-3)" }}>
                집중도 (선택)
              </span>
              <div className="flex gap-2">
                {([
                  { level: 1 as const, label: "흘려보냄" },
                  { level: 2 as const, label: "적당히" },
                  { level: 3 as const, label: "몰입" },
                ]).map(({ level, label }) => (
                  <button
                    key={level}
                    onClick={() => setEnergy(energy === level ? null : level)}
                    className="flex-1 py-3 text-[13px] font-medium transition-all duration-150"
                    style={{
                      borderRadius: "4px",
                      border: energy === level ? "1px solid var(--text)" : "1px solid var(--line-2)",
                      backgroundColor: energy === level ? "var(--surface-2)" : "transparent",
                      color: energy === level ? "var(--text)" : "var(--text-3)",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="pb-2"
              style={{ borderBottom: "1px solid var(--line)" }}
            >
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="한 줄 기록 (선택)"
                maxLength={80}
                className="w-full text-[14px] py-1"
                style={{ color: "var(--text)", caretColor: "var(--text)" }}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selected}
              className="w-full h-[52px] font-semibold tracking-wide transition-opacity disabled:opacity-20 active:opacity-70"
              style={{
                backgroundColor: "var(--text)",
                color: "var(--bg)",
                borderRadius: "4px",
                fontSize: "15px",
              }}
            >
              {dayIndex}일차 마감
            </button>
          </div>
        )}

        {/* ── STEP: result ── */}
        {step === "result" && (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-16">
            {resultCopy.split("\n").map((line, i) => (
              <p
                key={i}
                className={i === 0 ? "text-[24px] font-bold" : "text-[15px]"}
                style={{
                  color: i === 0 ? "var(--text)" : "var(--text-2)",
                  textAlign: "center",
                }}
              >
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
