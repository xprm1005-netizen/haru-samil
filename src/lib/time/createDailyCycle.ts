import { DailyCycle, DayIndex, DayPart } from "@/types";
import { addHours } from "./formatTimeRange";

const DEFAULT_ROLES: Record<DayIndex, string> = {
  1: "시작하는 나",
  2: "실행하는 나",
  3: "마무리하는 나",
};

export function createDailyCycle(
  startTime: string,
  date: string,
  roles: Record<DayIndex, string> = DEFAULT_ROLES
): DailyCycle {
  const parts: DayPart[] = ([1, 2, 3] as DayIndex[]).map((index) => {
    const start = addHours(startTime, (index - 1) * 6);
    const end = addHours(startTime, index * 6);
    return {
      index,
      label: `${index}일차`,
      role: roles[index],
      startTime: start,
      endTime: end,
      goal: "",
      status: "waiting",
      tasks: [],
    };
  });

  return { date, startTime, parts };
}
