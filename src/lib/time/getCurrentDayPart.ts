import { DailyCycle, DayPart } from "@/types";

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function getCurrentDayPart(cycle: DailyCycle): DayPart | null {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  for (const part of cycle.parts) {
    const start = timeToMinutes(part.startTime);
    const end = timeToMinutes(part.endTime);

    if (start < end) {
      if (nowMinutes >= start && nowMinutes < end) return part;
    } else {
      // crosses midnight (e.g., 22:00 - 06:00)
      if (nowMinutes >= start || nowMinutes < end) return part;
    }
  }

  return cycle.parts[0];
}
