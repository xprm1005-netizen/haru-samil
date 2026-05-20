"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useHaruSamilStore } from "@/store/useHaruSamilStore";
import { getCurrentDayPart } from "@/lib/time/getCurrentDayPart";
import { getRemainingTime } from "@/lib/time/getRemainingTime";
import DayHeader from "@/components/today/DayHeader";
import TimeRemaining from "@/components/today/TimeRemaining";
import CurrentGoal from "@/components/today/CurrentGoal";
import TaskList from "@/components/today/TaskList";
import PrimaryActions from "@/components/today/PrimaryActions";
import ThreeDayTimeline from "@/components/today/ThreeDayTimeline";
import DayOpener from "@/components/today/DayOpener";
import DaySummary from "@/components/today/DaySummary";
import CheckInModal from "@/components/modals/CheckInModal";
import RestartModal from "@/components/modals/RestartModal";
import BottomNav from "@/components/ui/BottomNav";

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function calcProgress(startTime: string, endTime: string): number {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const start = timeToMinutes(startTime);
  let end = timeToMinutes(endTime);
  if (end <= start) end += 24 * 60;
  const cur = nowMin < start ? nowMin + 24 * 60 : nowMin;
  return Math.min(100, Math.max(0, ((cur - start) / (end - start)) * 100));
}

export default function TodayPage() {
  const router = useRouter();
  const {
    settings,
    cycle,
    history,
    activeModal,
    modalTargetIndex,
    showDayOpener,
    dayOpenerIsRestart,
    showDaySummary,
    setGoal,
    openModal,
    activateCurrent,
    markDayOpenerSeen,
    closeDaySummary,
    addTask,
    toggleTask,
    deleteTask,
  } = useHaruSamilStore();

  const [remaining, setRemaining] = useState("00:00:00");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!settings.hasCompletedOnboarding) {
      router.replace("/onboarding");
    }
  }, [settings.hasCompletedOnboarding, router]);

  useEffect(() => {
    if (cycle) activateCurrent();
  }, []);

  useEffect(() => {
    if (!cycle) return;
    const update = () => {
      const part = getCurrentDayPart(cycle);
      if (!part) return;
      setRemaining(getRemainingTime(part.endTime));
      setProgress(calcProgress(part.startTime, part.endTime));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [cycle]);

  if (!settings.hasCompletedOnboarding || !cycle) return null;

  const currentPart = getCurrentDayPart(cycle);
  if (!currentPart) return null;

  const showAccum = history.totalDays >= 2;

  return (
    <div
      className="min-h-screen w-full flex justify-center dot-grid"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="w-full max-w-[430px] flex flex-col min-h-screen pb-24 fade-in">
        <div className="flex-1 flex flex-col px-6 pt-16 gap-10">
          <DayHeader part={currentPart} />

          <TimeRemaining
            remaining={remaining}
            dayIndex={currentPart.index}
            progressPercent={progress}
          />

          <div style={{ borderBottom: "1px solid var(--line)" }} />

          <CurrentGoal
            goal={currentPart.goal}
            dayIndex={currentPart.index}
            onSave={(g) => setGoal(currentPart.index, g)}
          />

          <TaskList
            tasks={currentPart.tasks ?? []}
            dayIndex={currentPart.index}
            onAdd={(text) => addTask(currentPart.index, text)}
            onToggle={(id) => toggleTask(currentPart.index, id)}
            onDelete={(id) => deleteTask(currentPart.index, id)}
          />

          <div style={{ borderBottom: "1px solid var(--line)" }} />

          <PrimaryActions
            dayIndex={currentPart.index}
            onComplete={() => openModal("checkin", currentPart.index)}
            onRestart={() => openModal("restart", currentPart.index)}
          />

          <div className="pb-2">
            <ThreeDayTimeline
              parts={cycle.parts}
              currentIndex={currentPart.index}
            />
          </div>

          {/* accumulated identity */}
          {showAccum && (
            <div className="flex items-center gap-3 pb-4">
              <span
                className="mono text-[10px] tracking-[0.1em]"
                style={{ color: "var(--text-3)" }}
              >
                {history.totalDays}일째
              </span>
              <span style={{ color: "var(--text-3)", fontSize: "10px" }}>·</span>
              <span
                className="mono text-[10px] tracking-[0.1em]"
                style={{ color: "var(--text-3)" }}
              >
                총 {history.totalDayParts}개의 하루
              </span>
              {history.totalRestarts > 0 && (
                <>
                  <span style={{ color: "var(--text-3)", fontSize: "10px" }}>·</span>
                  <span
                    className="mono text-[10px] tracking-[0.1em]"
                    style={{ color: "var(--text-3)" }}
                  >
                    {history.totalRestarts}번 재시작
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* overlays */}
      {showDayOpener && (
        <DayOpener
          dayIndex={currentPart.index}
          startTime={currentPart.startTime}
          endTime={currentPart.endTime}
          isRestart={dayOpenerIsRestart}
          onDismiss={markDayOpenerSeen}
        />
      )}

      {showDaySummary && (
        <DaySummary
          cycle={cycle}
          totalDays={history.totalDays}
          onClose={closeDaySummary}
        />
      )}

      {activeModal === "checkin" && modalTargetIndex && (
        <CheckInModal dayIndex={modalTargetIndex} />
      )}
      {activeModal === "restart" && modalTargetIndex && (
        <RestartModal
          dayIndex={modalTargetIndex}
          currentGoal={
            cycle.parts.find((p) => p.index === modalTargetIndex)?.goal ?? ""
          }
        />
      )}

      <BottomNav active="today" />
    </div>
  );
}
