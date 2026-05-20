export type DayIndex = 1 | 2 | 3;

export type DayStatus =
  | "waiting"
  | "active"
  | "completed"
  | "missed"
  | "endured";

export type TaskItem = {
  id: string;
  text: string;
  done: boolean;
};

export type DayPart = {
  index: DayIndex;
  label: string;
  role: string;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  goal: string;
  status: DayStatus;
  note?: string;
  tasks: TaskItem[];
  energyLevel?: 1 | 2 | 3; // 1=흘려보냄, 2=적당히, 3=몰입
};

export type DailyCycle = {
  date: string; // "YYYY-MM-DD"
  startTime: string;
  parts: DayPart[];
};

export type UserSettings = {
  startTime: string; // "HH:MM"
  notificationsEnabled: boolean;
  dayRoles: Record<DayIndex, string>;
  hasCompletedOnboarding: boolean;
  repeatGoals: Partial<Record<DayIndex, string>>;
};

export type CheckInStatus = "missed" | "endured" | "completed";

export type CycleSnapshot = {
  index: DayIndex;
  goal: string;
  status: DayStatus;
  note?: string;
  energyLevel?: 1 | 2 | 3;
};

export type UserHistory = {
  totalDays: number;
  totalDayParts: number;
  totalRestarts: number;
  dailyLog: Record<string, { doneCount: number; restartCount: number }>;
  recentGoals: string[];
  energyLog: Partial<Record<DayIndex, { 1: number; 2: number; 3: number }>>;
  cycleHistory: Record<string, CycleSnapshot[]>; // key = "YYYY-MM-DD"
};

export type StickerType = "great" | "tired" | "focused" | "calm" | "tough" | "proud";

export type DailyJournal = {
  date: string;
  text: string;
  sticker: StickerType | null;
  aiComment: string | null;
  updatedAt: string;
};
