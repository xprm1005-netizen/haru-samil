"use client";

import { useEffect, useState } from "react";
import { DayIndex } from "@/types";

interface DayPlanItem {
  index: DayIndex;
  goal: string;
  tasks: string[];
}

interface Props {
  lifestyle: string;
  startTime: string;
  onConfirm: (plans: DayPlanItem[]) => void;
  onSkip: () => void;
}

const DAY_COLORS: Record<DayIndex, string> = {
  1: "var(--day-1)",
  2: "var(--day-2)",
  3: "var(--day-3)",
};

export default function AiPlanResult({ lifestyle, startTime, onConfirm, onSkip }: Props) {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<DayPlanItem[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await window.fetch("/api/lifestyle-setup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lifestyle, startTime }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setPlans(data.dayParts);
        setMessage(data.message ?? "");
      } catch (e) {
        setError((e as Error).message ?? "AI 설계에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [lifestyle, startTime]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
        <div className="flex flex-col items-center gap-6">
          <span
            className="mono text-[11px] tracking-[0.22em] uppercase"
            style={{ color: "var(--text-3)" }}
          >
            AI 설계 중
          </span>

          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: "var(--text-3)",
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>

          <div className="text-center flex flex-col gap-1.5">
            <p className="text-[20px] font-bold tracking-tight" style={{ color: "var(--text)" }}>
              AI가 분석 중입니다
            </p>
            <p className="text-[14px] leading-[1.7]" style={{ color: "var(--text-3)" }}>
              당신의 라이프스타일을 읽고
              <br />
              하루삼일을 설계하고 있습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 px-6 text-center">
        <p className="text-[16px]" style={{ color: "var(--text-2)" }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mono text-[12px] tracking-[0.1em] uppercase transition-opacity active:opacity-50"
          style={{ color: "var(--text-3)" }}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full px-6 py-10 fade-in">
      <div className="flex flex-col gap-6 flex-1 overflow-y-auto">

        {/* header */}
        <div className="flex flex-col gap-1">
          <span
            className="mono text-[11px] tracking-[0.22em] uppercase"
            style={{ color: "var(--text-3)" }}
          >
            AI 설계 완료
          </span>
          <h2
            className="text-[26px] font-bold tracking-tight"
            style={{ color: "var(--text)" }}
          >
            당신의 하루삼일
          </h2>
        </div>

        {/* day plans */}
        <div className="flex flex-col gap-0">
          {plans.map((plan, i) => {
            const color = DAY_COLORS[plan.index];
            return (
              <div
                key={plan.index}
                className="flex flex-col gap-2.5 py-5"
                style={{
                  borderBottom: i < plans.length - 1 ? "1px solid var(--line)" : undefined,
                }}
              >
                {/* day header — no time range */}
                <div className="flex items-center gap-2.5">
                  <div className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>
                    {plan.index}일차
                  </span>
                </div>

                {/* goal */}
                <p
                  className="text-[17px] font-medium leading-snug pl-[17px]"
                  style={{ color: "var(--text)" }}
                >
                  {plan.goal}
                </p>

                {/* tasks */}
                <div className="flex flex-col gap-1.5 pl-[17px]">
                  {plan.tasks.map((task, j) => (
                    <div key={j} className="flex items-center gap-2.5">
                      <div
                        className="flex-shrink-0 w-[13px] h-[13px]"
                        style={{ border: "1px solid var(--line-2)", borderRadius: "2px" }}
                      />
                      <span className="text-[13px]" style={{ color: "var(--text-3)" }}>
                        {task}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* AI message */}
        {message && (
          <p
            className="text-[14px] leading-[1.7] fade-in"
            style={{ color: "var(--text-2)" }}
          >
            {message}
          </p>
        )}

      </div>

      {/* CTA */}
      <div className="pt-6 flex flex-col gap-3">
        <button
          onClick={() => onConfirm(plans)}
          className="w-full h-[52px] font-semibold tracking-wide transition-opacity active:opacity-70"
          style={{
            backgroundColor: "var(--text)",
            color: "var(--bg)",
            borderRadius: "4px",
            fontSize: "15px",
          }}
        >
          이 계획으로 시작하기
        </button>
        <button
          onClick={onSkip}
          className="w-full h-[44px] font-medium transition-opacity active:opacity-50"
          style={{
            color: "var(--text-3)",
            border: "1px solid var(--line)",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          사용 안함
        </button>
      </div>
    </div>
  );
}
