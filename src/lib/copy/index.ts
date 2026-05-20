import { DayIndex } from "@/types";

export type CheckStatus = "missed" | "endured" | "completed";

// ─── Day Opener ─────────────────────────────────────────────────────────────

const OPENER_NORMAL: Record<DayIndex, string[]> = {
  1: [
    "오늘의 첫 번째 하루가 열렸습니다.",
    "새 하루의 첫 번째 시작입니다.",
    "오늘도 세 번의 기회가 있습니다.",
  ],
  2: [
    "두 번째 하루가 열렸습니다.",
    "첫 번째 하루는 끝났습니다. 지금 새로 시작합니다.",
    "오전이 어떠했든, 지금 새 하루입니다.",
  ],
  3: [
    "마지막 하루가 열렸습니다.",
    "아직 오늘은 끝나지 않았습니다.",
    "세 번째 기회입니다.",
  ],
};

const OPENER_RESTART: Record<DayIndex, string[]> = {
  1: [
    "같은 하루, 새로운 시작입니다.",
    "방금 전은 두고 오세요. 지금 다시 시작합니다.",
  ],
  2: [
    "같은 하루, 새로운 시작입니다.",
    "방금 전은 이전 장면에 두고 오세요.",
  ],
  3: [
    "마지막 하루를 다시 시작합니다.",
    "방금 전은 두고 오세요.",
  ],
};

export function getDayOpenerCopy(index: DayIndex, isRestart: boolean): string {
  const list = isRestart ? OPENER_RESTART[index] : OPENER_NORMAL[index];
  return list[Math.floor(Math.random() * list.length)];
}

// ─── Check-in ────────────────────────────────────────────────────────────────

const CHECKIN_PROMPT: Record<DayIndex, string> = {
  1: "첫 번째 하루가 지나갔습니다.",
  2: "두 번째 하루가 지나갔습니다.",
  3: "오늘의 마지막 하루가 지나갔습니다.",
};

export function getCheckInPrompt(index: DayIndex): string {
  return CHECKIN_PROMPT[index];
}

const RESULT_COPY: Record<CheckStatus, string[]> = {
  missed: [
    "괜찮습니다.\n다음 하루가 있습니다.",
    "놓쳤어도 기록이 됩니다.\n그것으로 충분합니다.",
    "오늘은 여기까지입니다.",
  ],
  endured: [
    "버텼습니다.\n그것만으로 충분합니다.",
    "버티는 것도 하나의 방식입니다.",
    "쉽지 않았을 텐데, 버텼습니다.",
  ],
  completed: [
    "해냈습니다.",
    "오늘 하나를 해냈습니다.",
    "이런 날이 쌓입니다.",
  ],
};

export function getCheckInResultCopy(status: CheckStatus): string {
  const list = RESULT_COPY[status];
  return list[Math.floor(Math.random() * list.length)];
}

// ─── Day Summary ─────────────────────────────────────────────────────────────

export function getDaySummaryCopy(doneCount: number, totalDays: number): string {
  const dayLine = [
    "오늘 하루를 마칩니다.",
    "오늘은 하루를 시작하지 않았습니다.",
    `오늘은 3일 중 1일을 살았습니다.`,
    `오늘은 3일 중 2일을 살았습니다.`,
    `오늘은 3일 모두 살았습니다.`,
  ][Math.min(doneCount, 4) === 0 ? 0 : doneCount];

  if (totalDays <= 1) return dayLine;
  return `${dayLine}\n${totalDays}일 동안 이렇게 살고 있습니다.`;
}

export function getDaySummaryButton(doneCount: number): string {
  if (doneCount === 3) return "완벽한 하루였습니다.";
  if (doneCount >= 2) return "내일도 세 번의 기회가 있습니다.";
  return "내일 다시 시작합니다.";
}

// ─── Deletion warning ────────────────────────────────────────────────────────

export function getDeletionCopy(totalDays: number, totalDayParts: number): string {
  return `지난 ${totalDays}일 동안\n${totalDayParts}개의 하루를 살았습니다.`;
}
