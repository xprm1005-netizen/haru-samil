"use client";

import { useState } from "react";
import { useHaruSamilStore } from "@/store/useHaruSamilStore";
import { addHours } from "@/lib/time/formatTimeRange";
import { getDeletionCopy } from "@/lib/copy";
import BottomNav from "@/components/ui/BottomNav";
import { useRouter } from "next/navigation";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = ["00", "30"];

export default function SettingsPage() {
  const router = useRouter();
  const { settings, history, updateStartTime, toggleNotifications, resetOnboarding } =
    useHaruSamilStore();

  // compute best energy day-part
  const energyLog = history.energyLog ?? {};
  const bestEnergyPart = ([1, 2, 3] as const).reduce<{ index: number; score: number }>(
    (best, idx) => {
      const log = energyLog[idx];
      if (!log) return best;
      const score = (log[1] ?? 0) * 1 + (log[2] ?? 0) * 2 + (log[3] ?? 0) * 3;
      const count = (log[1] ?? 0) + (log[2] ?? 0) + (log[3] ?? 0);
      const avg = count > 0 ? score / count : 0;
      return avg > best.score ? { index: idx, score: avg } : best;
    },
    { index: 0, score: 0 }
  );
  const hasEnergyInsight = history.totalDayParts >= 7 && bestEnergyPart.index > 0;

  const [hour, setHour]     = useState(settings.startTime.split(":")[0]);
  const [minute, setMinute] = useState(settings.startTime.split(":")[1]);
  const [saved, setSaved]   = useState(false);
  const [showResetWarning, setShowResetWarning] = useState(false);

  const handleSaveTime = () => {
    updateStartTime(`${hour}:${minute}`);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleResetRequest = () => {
    if (history.totalDays >= 7) {
      setShowResetWarning(true);
    } else {
      if (confirm("모든 데이터를 초기화할까요?")) {
        resetOnboarding();
        router.push("/onboarding");
      }
    }
  };

  const handleConfirmReset = () => {
    resetOnboarding();
    router.push("/onboarding");
  };

  const parts = [1, 2, 3].map((i) => ({
    label: `${i}일차`,
    start: addHours(`${hour}:${minute}`, (i - 1) * 8),
    end: addHours(`${hour}:${minute}`, i * 8),
  }));

  return (
    <div
      className="min-h-screen w-full flex justify-center dot-grid"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="w-full max-w-[430px] flex flex-col pb-24 fade-in">
        <div className="px-6 pt-16 flex flex-col gap-10">

          <div className="flex flex-col gap-1">
            <span className="mono text-[10px] tracking-[0.18em] uppercase" style={{ color: "var(--text-3)" }}>
              설정
            </span>
            <h1 className="text-[30px] font-bold tracking-tight" style={{ color: "var(--text)" }}>
              하루삼일
            </h1>
          </div>

          {/* start time */}
          <section className="flex flex-col gap-5">
            <span className="mono text-[10px] tracking-[0.18em] uppercase" style={{ color: "var(--text-3)" }}>
              하루 시작 시간
            </span>
            <div
              className="flex items-center py-4"
              style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
            >
              <select
                value={hour}
                onChange={(e) => { setHour(e.target.value); setSaved(false); }}
                className="mono text-[44px] font-bold appearance-none bg-transparent flex-1 text-center"
                style={{ color: "var(--text)", cursor: "pointer" }}
              >
                {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
              <span className="mono text-[44px] font-bold" style={{ color: "var(--text-3)" }}>:</span>
              <select
                value={minute}
                onChange={(e) => { setMinute(e.target.value); setSaved(false); }}
                className="mono text-[44px] font-bold appearance-none bg-transparent flex-1 text-center"
                style={{ color: "var(--text)", cursor: "pointer" }}
              >
                {MINUTES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              {parts.map((p) => (
                <div key={p.label} className="flex items-center justify-between">
                  <span className="mono text-[11px]" style={{ color: "var(--text-3)" }}>{p.label}</span>
                  <span className="mono text-[11px]" style={{ color: "var(--text-2)" }}>{p.start} — {p.end}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleSaveTime}
              className="w-full h-[52px] font-semibold tracking-wide transition-all active:opacity-70"
              style={{
                backgroundColor: saved ? "var(--day-1)" : "transparent",
                color: saved ? "var(--bg)" : "var(--text)",
                border: `1px solid ${saved ? "var(--day-1)" : "var(--line-2)"}`,
                borderRadius: "4px",
                fontSize: "15px",
              }}
            >
              {saved ? "저장됨" : "저장"}
            </button>
          </section>

          <div style={{ borderBottom: "1px solid var(--line)" }} />

          {/* notifications */}
          <section className="flex flex-col gap-4">
            <span className="mono text-[10px] tracking-[0.18em] uppercase" style={{ color: "var(--text-3)" }}>
              알림
            </span>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px]" style={{ color: "var(--text)" }}>하루 시작/종료 알림</span>
                <span className="mono text-[11px]" style={{ color: "var(--text-3)" }}>MVP에서는 UI only</span>
              </div>
              <button
                onClick={toggleNotifications}
                className="relative transition-all duration-200"
                style={{
                  width: "44px", height: "26px", borderRadius: "13px",
                  backgroundColor: settings.notificationsEnabled ? "var(--text)" : "var(--line-2)",
                  border: "1px solid var(--line-2)",
                }}
              >
                <div
                  className="absolute top-[3px] w-[18px] h-[18px] rounded-full transition-all duration-200"
                  style={{
                    left: settings.notificationsEnabled ? "calc(100% - 21px)" : "3px",
                    backgroundColor: settings.notificationsEnabled ? "var(--bg)" : "var(--text-3)",
                  }}
                />
              </button>
            </div>
          </section>

          <div style={{ borderBottom: "1px solid var(--line)" }} />

          {/* stats (if any) */}
          {history.totalDays > 0 && (
            <>
              <section className="flex flex-col gap-4">
                <span className="mono text-[10px] tracking-[0.18em] uppercase" style={{ color: "var(--text-3)" }}>
                  기록
                </span>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "사용일수", value: `${history.totalDays}일` },
                    { label: "총 일차", value: `${history.totalDayParts}개` },
                    { label: "재시작", value: `${history.totalRestarts}번` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="mono text-[12px]" style={{ color: "var(--text-3)" }}>{label}</span>
                      <span className="mono text-[12px]" style={{ color: "var(--text-2)" }}>{value}</span>
                    </div>
                  ))}
                  {hasEnergyInsight && (
                    <p className="text-[13px] leading-[1.6] pt-1" style={{ color: "var(--text-3)" }}>
                      당신은 주로{" "}
                      <span style={{ color: "var(--text-2)" }}>{bestEnergyPart.index}일차</span>에 가장 몰입합니다.
                    </p>
                  )}
                </div>
              </section>
              <div style={{ borderBottom: "1px solid var(--line)" }} />
            </>
          )}

          {/* reset */}
          <section className="flex flex-col gap-4">
            <span className="mono text-[10px] tracking-[0.18em] uppercase" style={{ color: "var(--text-3)" }}>
              초기화
            </span>
            <button
              onClick={handleResetRequest}
              className="w-full h-[52px] font-medium transition-opacity active:opacity-50"
              style={{
                color: "var(--danger)",
                border: "1px solid var(--line-2)",
                borderRadius: "4px",
                fontSize: "15px",
              }}
            >
              처음부터 다시 시작
            </button>
          </section>
        </div>
      </div>

      <BottomNav active="settings" />

      {/* deletion warning overlay */}
      {showResetWarning && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
        >
          <div className="w-full max-w-[360px] flex flex-col gap-8 text-center fade-in">
            <div className="flex flex-col gap-4">
              <span className="mono text-[10px] tracking-[0.18em] uppercase" style={{ color: "var(--text-3)" }}>
                잠깐.
              </span>
              <div>
                {getDeletionCopy(history.totalDays, history.totalDayParts)
                  .split("\n")
                  .map((line, i) => (
                    <p
                      key={i}
                      className={i === 0 ? "text-[26px] font-bold leading-tight" : "text-[26px] font-bold leading-tight"}
                      style={{ color: "var(--text)" }}
                    >
                      {line}
                    </p>
                  ))}
              </div>
              <p className="text-[14px] leading-[1.7]" style={{ color: "var(--text-2)" }}>
                이 기록은 사라지지만,<br />
                하루를 3번 사는 감각은 남습니다.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => setShowResetWarning(false)}
                className="w-full h-[52px] font-semibold transition-opacity active:opacity-70"
                style={{
                  backgroundColor: "var(--text)",
                  color: "var(--bg)",
                  borderRadius: "4px",
                  fontSize: "15px",
                }}
              >
                돌아가기
              </button>
              <button
                onClick={handleConfirmReset}
                className="w-full h-[52px] font-medium transition-opacity active:opacity-50"
                style={{
                  color: "var(--text-3)",
                  border: "1px solid var(--line-2)",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              >
                그래도 초기화
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
