import { create } from "zustand";
import { CycleSnapshot, DailyCycle, DailyJournal, DayIndex, DayStatus, StickerType, TaskItem, UserHistory, UserSettings } from "@/types";
import { createDailyCycle } from "@/lib/time/createDailyCycle";
import { getCurrentDayPart } from "@/lib/time/getCurrentDayPart";
import { loadState, saveState, loadHistory, saveHistory, loadJournals, saveJournals } from "@/lib/storage/persist";

type ModalType = "checkin" | "restart" | null;

interface PersistedState {
  settings: UserSettings;
  cycle: DailyCycle | null;
  lastSeenDayIndex: DayIndex | null;
}

interface HaruSamilState {
  // persisted — main
  settings: UserSettings;
  cycle: DailyCycle | null;
  lastSeenDayIndex: DayIndex | null;

  // persisted — history
  history: UserHistory;

  // ui (ephemeral)
  activeModal: ModalType;
  modalTargetIndex: DayIndex | null;
  showDaySummary: boolean;
  showDayOpener: boolean;
  dayOpenerIsRestart: boolean;

  // actions — settings
  updateStartTime: (time: string) => void;
  toggleNotifications: () => void;
  completeOnboarding: (startTime: string, firstGoal: string) => void;
  completeOnboardingWithAiPlan: (startTime: string, plans: { index: DayIndex; goal: string; tasks: string[] }[]) => void;
  resetOnboarding: () => void;

  // actions — today
  setGoal: (index: DayIndex, goal: string) => void;
  setRepeatGoal: (index: DayIndex, goal: string) => void;
  clearRepeatGoal: (index: DayIndex) => void;
  checkIn: (index: DayIndex, status: DayStatus, note?: string, energyLevel?: 1 | 2 | 3) => void;
  restartDay: (index: DayIndex, newGoal?: string) => void;
  activateCurrent: () => void;
  markDayOpenerSeen: () => void;
  closeDaySummary: () => void;

  // actions — tasks
  addTask: (index: DayIndex, text: string) => void;
  toggleTask: (index: DayIndex, taskId: string) => void;
  deleteTask: (index: DayIndex, taskId: string) => void;
  bulkPlan: (plans: { index: DayIndex; goal: string; tasks: string[] }[]) => void;

  // actions — journal
  journals: Record<string, DailyJournal>;
  saveJournal: (date: string, text: string, sticker: StickerType | null) => void;
  setJournalAiComment: (date: string, comment: string) => void;

  // actions — ui
  openModal: (type: ModalType, index?: DayIndex) => void;
  closeModal: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  startTime: "06:00",
  notificationsEnabled: true,
  dayRoles: { 1: "시작하는 나", 2: "실행하는 나", 3: "마무리하는 나" },
  hasCompletedOnboarding: false,
  repeatGoals: {},
};

const DEFAULT_HISTORY: UserHistory = {
  totalDays: 0,
  totalDayParts: 0,
  totalRestarts: 0,
  dailyLog: {},
  recentGoals: [],
  energyLog: {},
  cycleHistory: {},
};

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function persistMain(state: HaruSamilState) {
  const data: PersistedState = {
    settings: state.settings,
    cycle: state.cycle,
    lastSeenDayIndex: state.lastSeenDayIndex,
  };
  saveState(data);
}

function persistHist(history: UserHistory) {
  saveHistory(history);
}

function bumpDayCount(history: UserHistory, date: string): UserHistory {
  if (history.dailyLog[date]) return history;
  return {
    ...history,
    totalDays: history.totalDays + 1,
    dailyLog: { ...history.dailyLog, [date]: { doneCount: 0, restartCount: 0 } },
  };
}

export const useHaruSamilStore = create<HaruSamilState>((set, get) => {
  const saved = loadState<PersistedState>();
  const savedHistory = loadHistory<UserHistory>();
  const savedJournals = loadJournals<Record<string, DailyJournal>>();

  const initialSettings = {
    ...DEFAULT_SETTINGS,
    ...(saved?.settings ?? {}),
    repeatGoals: saved?.settings?.repeatGoals ?? {},
  };
  const initialHistory = {
    ...DEFAULT_HISTORY,
    ...(savedHistory ?? {}),
    recentGoals: savedHistory?.recentGoals ?? [],
    energyLog: savedHistory?.energyLog ?? {},
    cycleHistory: savedHistory?.cycleHistory ?? {},
  };
  let initialCycle = saved?.cycle ?? null;
  let initialLastSeen = saved?.lastSeenDayIndex ?? null;

  // if saved cycle is from a different day, start fresh
  if (initialCycle && initialCycle.date !== todayString()) {
    initialCycle = null;
    initialLastSeen = null;
  }

  return {
    settings: initialSettings,
    cycle: initialCycle,
    lastSeenDayIndex: initialLastSeen,
    history: initialHistory,

    journals: savedJournals ?? {},

    activeModal: null,
    modalTargetIndex: null,
    showDaySummary: false,
    showDayOpener: false,
    dayOpenerIsRestart: false,

    updateStartTime(time) {
      set((s) => {
        const next = {
          ...s,
          settings: { ...s.settings, startTime: time },
          cycle: s.cycle
            ? createDailyCycle(time, s.cycle.date, s.settings.dayRoles)
            : null,
        };
        persistMain(next);
        return next;
      });
    },

    toggleNotifications() {
      set((s) => {
        const next = {
          ...s,
          settings: { ...s.settings, notificationsEnabled: !s.settings.notificationsEnabled },
        };
        persistMain(next);
        return next;
      });
    },

    completeOnboarding(startTime, firstGoal) {
      set((s) => {
        const today = todayString();
        const cycle = createDailyCycle(startTime, today, s.settings.dayRoles);
        cycle.parts[0].goal = firstGoal;
        cycle.parts[0].status = "active";

        const newHistory = bumpDayCount(s.history, today);
        persistHist(newHistory);

        const next = {
          ...s,
          settings: { ...s.settings, startTime, hasCompletedOnboarding: true },
          cycle,
          history: newHistory,
          // show opener for first day-part
          showDayOpener: true,
          dayOpenerIsRestart: false,
          lastSeenDayIndex: null,
        };
        persistMain(next);
        return next;
      });
    },

    completeOnboardingWithAiPlan(startTime, plans) {
      set((s) => {
        const today = todayString();
        const cycle = createDailyCycle(startTime, today, s.settings.dayRoles);

        // apply AI-designed goals and tasks to all 3 day parts
        cycle.parts.forEach((p) => {
          const plan = plans.find((pl) => pl.index === p.index);
          if (!plan) return;
          p.goal = plan.goal;
          p.tasks = plan.tasks
            .filter((t) => t.trim())
            .map((t) => ({
              id: Date.now().toString(36) + Math.random().toString(36).slice(2) + p.index,
              text: t.trim(),
              done: false,
            }));
        });

        // first part is active
        cycle.parts[0].status = "active";

        // update recentGoals with AI-designed goals
        const aiGoals = plans.map((pl) => pl.goal).filter(Boolean);
        const prev = s.history.recentGoals ?? [];
        const recentGoals = [...aiGoals, ...prev.filter((g) => !aiGoals.includes(g))].slice(0, 10);
        const newHistory = { ...bumpDayCount(s.history, today), recentGoals };
        persistHist(newHistory);

        const next = {
          ...s,
          settings: { ...s.settings, startTime, hasCompletedOnboarding: true },
          cycle,
          history: newHistory,
          showDayOpener: true,
          dayOpenerIsRestart: false,
          lastSeenDayIndex: null as DayIndex | null,
        };
        persistMain(next);
        return next;
      });
    },

    resetOnboarding() {
      const next = {
        settings: { ...DEFAULT_SETTINGS },
        cycle: null as DailyCycle | null,
        lastSeenDayIndex: null as DayIndex | null,
        history: { ...DEFAULT_HISTORY, recentGoals: [], energyLog: {}, cycleHistory: {} },
        journals: {} as Record<string, DailyJournal>,
        activeModal: null as ModalType,
        modalTargetIndex: null as DayIndex | null,
        showDaySummary: false,
        showDayOpener: false,
        dayOpenerIsRestart: false,
      };
      saveState({ settings: next.settings, cycle: null, lastSeenDayIndex: null });
      saveHistory(next.history);
      saveJournals({});
      set((s) => ({ ...s, ...next }));
    },

    setGoal(index, goal) {
      set((s) => {
        if (!s.cycle) return s;
        const parts = s.cycle.parts.map((p) => p.index === index ? { ...p, goal } : p);
        const trimmed = goal.trim();
        const prev = s.history.recentGoals ?? [];
        const deduped = [trimmed, ...prev.filter((g) => g !== trimmed)].slice(0, 10);
        const newHistory: UserHistory = { ...s.history, recentGoals: deduped };
        persistHist(newHistory);
        const next = { ...s, cycle: { ...s.cycle, parts }, history: newHistory };
        persistMain(next);
        return next;
      });
    },

    setRepeatGoal(index, goal) {
      set((s) => {
        const repeatGoals = { ...s.settings.repeatGoals, [index]: goal };
        const next = { ...s, settings: { ...s.settings, repeatGoals } };
        persistMain(next);
        return next;
      });
    },

    clearRepeatGoal(index) {
      set((s) => {
        const repeatGoals = { ...s.settings.repeatGoals };
        delete repeatGoals[index];
        const next = { ...s, settings: { ...s.settings, repeatGoals } };
        persistMain(next);
        return next;
      });
    },

    checkIn(index, status, note, energyLevel) {
      set((s) => {
        if (!s.cycle) return s;

        const finalStatus: DayStatus =
          status === "completed" ? "completed"
          : status === "endured" ? "endured"
          : "missed";

        const isDone = finalStatus === "completed" || finalStatus === "endured";
        const today = todayString();

        // update parts
        let parts = s.cycle.parts.map((p) =>
          p.index === index ? { ...p, status: finalStatus, note, energyLevel } : p
        );

        // activate next part
        const nextIndex = (index % 3) + 1 as DayIndex;
        parts = parts.map((p) =>
          p.index === nextIndex && p.status === "waiting"
            ? { ...p, status: "active" as DayStatus }
            : p
        );

        // update history
        const log = s.history.dailyLog[today] ?? { doneCount: 0, restartCount: 0 };
        const newLog = { ...log, doneCount: log.doneCount + (isDone ? 1 : 0) };

        // update energyLog
        const energyLog = { ...s.history.energyLog };
        if (energyLevel) {
          const prev = energyLog[index] ?? { 1: 0, 2: 0, 3: 0 };
          energyLog[index] = { ...prev, [energyLevel]: prev[energyLevel] + 1 };
        }

        // snapshot cycleHistory
        const snapshot: CycleSnapshot[] = parts.map((p) => ({
          index: p.index,
          goal: p.goal,
          status: p.status,
          note: p.note,
          energyLevel: p.energyLevel,
        }));
        const rawHistory = { ...s.history.cycleHistory, [today]: snapshot };
        // keep only last 30 days
        const sortedDates = Object.keys(rawHistory).sort().slice(-30);
        const cycleHistory = Object.fromEntries(sortedDates.map((d) => [d, rawHistory[d]]));

        const newHistory: UserHistory = {
          ...s.history,
          totalDayParts: s.history.totalDayParts + 1,
          dailyLog: { ...s.history.dailyLog, [today]: newLog },
          energyLog,
          cycleHistory,
        };
        persistHist(newHistory);

        // check if all 3 done
        const allDone = parts.every(
          (p) => p.status !== "waiting" && p.status !== "active"
        );

        // show opener for next day-part if available
        const nextPart = parts.find((p) => p.index === nextIndex && p.status === "active");
        const showOpener = !!nextPart;

        const next = {
          ...s,
          cycle: { ...s.cycle, parts },
          history: newHistory,
          activeModal: null as ModalType,
          showDaySummary: allDone,
          showDayOpener: showOpener && !allDone,
          dayOpenerIsRestart: false,
          lastSeenDayIndex: showOpener ? s.lastSeenDayIndex : s.lastSeenDayIndex,
        };
        persistMain(next);
        return next;
      });
    },

    restartDay(index, newGoal) {
      set((s) => {
        if (!s.cycle) return s;
        const today = todayString();

        const parts = s.cycle.parts.map((p) => {
          if (p.index !== index) return p;
          return { ...p, status: "active" as DayStatus, goal: newGoal !== undefined ? newGoal : p.goal, note: undefined };
        });

        const log = s.history.dailyLog[today] ?? { doneCount: 0, restartCount: 0 };
        const newHistory: UserHistory = {
          ...s.history,
          totalRestarts: s.history.totalRestarts + 1,
          dailyLog: { ...s.history.dailyLog, [today]: { ...log, restartCount: log.restartCount + 1 } },
        };
        persistHist(newHistory);

        const next = {
          ...s,
          cycle: { ...s.cycle, parts },
          history: newHistory,
          activeModal: null as ModalType,
          showDayOpener: true,
          dayOpenerIsRestart: true,
          lastSeenDayIndex: null,
        };
        persistMain(next);
        return next;
      });
    },

    activateCurrent() {
      set((s) => {
        if (!s.cycle) return s;
        const current = getCurrentDayPart(s.cycle);
        if (!current) return s;

        const today = todayString();
        const newHistory = bumpDayCount(s.history, today);
        persistHist(newHistory);

        const repeatGoal = s.settings.repeatGoals?.[current.index];
        const parts = s.cycle.parts.map((p) => {
          if (p.index !== current.index || p.status !== "waiting") return p;
          return {
            ...p,
            status: "active" as DayStatus,
            ...(repeatGoal && !p.goal ? { goal: repeatGoal } : {}),
          };
        });

        // show opener if user hasn't seen this day index yet
        const shouldShowOpener = s.lastSeenDayIndex !== current.index;

        const next = {
          ...s,
          cycle: { ...s.cycle, parts },
          history: newHistory,
          showDayOpener: shouldShowOpener,
          dayOpenerIsRestart: false,
        };
        persistMain(next);
        return next;
      });
    },

    markDayOpenerSeen() {
      set((s) => {
        if (!s.cycle) return { ...s, showDayOpener: false };
        const current = getCurrentDayPart(s.cycle);
        const next = {
          ...s,
          showDayOpener: false,
          lastSeenDayIndex: current?.index ?? s.lastSeenDayIndex,
        };
        persistMain(next);
        return next;
      });
    },

    closeDaySummary() {
      set((s) => ({ ...s, showDaySummary: false }));
    },

    addTask(index, text) {
      set((s) => {
        if (!s.cycle) return s;
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
        const task: TaskItem = { id, text: text.trim(), done: false };
        const parts = s.cycle.parts.map((p) =>
          p.index === index ? { ...p, tasks: [...(p.tasks ?? []), task] } : p
        );
        const next = { ...s, cycle: { ...s.cycle, parts } };
        persistMain(next);
        return next;
      });
    },

    toggleTask(index, taskId) {
      set((s) => {
        if (!s.cycle) return s;
        const parts = s.cycle.parts.map((p) =>
          p.index === index
            ? { ...p, tasks: p.tasks.map((t) => t.id === taskId ? { ...t, done: !t.done } : t) }
            : p
        );
        const next = { ...s, cycle: { ...s.cycle, parts } };
        persistMain(next);
        return next;
      });
    },

    deleteTask(index, taskId) {
      set((s) => {
        if (!s.cycle) return s;
        const parts = s.cycle.parts.map((p) =>
          p.index === index
            ? { ...p, tasks: p.tasks.filter((t) => t.id !== taskId) }
            : p
        );
        const next = { ...s, cycle: { ...s.cycle, parts } };
        persistMain(next);
        return next;
      });
    },

    bulkPlan(plans) {
      set((s) => {
        if (!s.cycle) return s;
        const parts = s.cycle.parts.map((p) => {
          const plan = plans.find((pl) => pl.index === p.index);
          if (!plan) return p;
          const newTasks: TaskItem[] = plan.tasks
            .filter((t) => t.trim())
            .map((t) => ({
              id: Date.now().toString(36) + Math.random().toString(36).slice(2) + plan.index,
              text: t.trim(),
              done: false,
            }));
          return {
            ...p,
            goal: plan.goal.trim() || p.goal,
            tasks: newTasks.length > 0 ? newTasks : p.tasks,
          };
        });
        const next = { ...s, cycle: { ...s.cycle, parts } };
        persistMain(next);
        return next;
      });
    },

    saveJournal(date, text, sticker) {
      set((s) => {
        const existing = s.journals[date];
        const entry: DailyJournal = {
          date,
          text,
          sticker,
          aiComment: existing?.aiComment ?? null,
          updatedAt: new Date().toISOString(),
        };
        const journals = { ...s.journals, [date]: entry };
        saveJournals(journals);
        return { ...s, journals };
      });
    },

    setJournalAiComment(date, comment) {
      set((s) => {
        const existing = s.journals[date];
        if (!existing) return s;
        const entry: DailyJournal = { ...existing, aiComment: comment };
        const journals = { ...s.journals, [date]: entry };
        saveJournals(journals);
        return { ...s, journals };
      });
    },

    openModal(type, index) {
      set({ activeModal: type, modalTargetIndex: index ?? null });
    },

    closeModal() {
      set({ activeModal: null, modalTargetIndex: null });
    },
  };
});
