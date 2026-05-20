export function getRemainingTime(endTime: string): string {
  const now = new Date();
  const [endH, endM] = endTime.split(":").map(Number);

  const endDate = new Date(now);
  endDate.setHours(endH, endM, 0, 0);

  // if end is before now, it's the next day
  if (endDate <= now) {
    endDate.setDate(endDate.getDate() + 1);
  }

  const diffMs = endDate.getTime() - now.getTime();
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].join(":");
}
