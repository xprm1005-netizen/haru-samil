export function formatTimeRange(start: string, end: string): string {
  return `${start} - ${end}`;
}

export function addHours(time: string, hours: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h + hours;
  const newH = total % 24;
  return `${String(newH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
