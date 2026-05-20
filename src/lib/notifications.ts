export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register("/sw.js");
    return reg;
  } catch {
    return null;
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator;
}

export function scheduleNextDayPartNotification(
  nextDayIndex: 1 | 2 | 3,
  nextStartTime: string
): void {
  if (typeof window === "undefined") return;
  if (!navigator.serviceWorker?.controller) return;
  if (Notification.permission !== "granted") return;

  const [h, m] = nextStartTime.split(":").map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  const delayMs = target.getTime() - now.getTime();

  navigator.serviceWorker.controller.postMessage({
    type: "SCHEDULE_NOTIFICATION",
    title: `${nextDayIndex}일차가 시작됩니다`,
    body: `하루삼일의 ${nextDayIndex}번째 하루가 열렸습니다. 새 목표를 세워보세요.`,
    delayMs,
  });
}

export function cancelScheduledNotifications(): void {
  if (typeof window === "undefined") return;
  if (!navigator.serviceWorker?.controller) return;
  navigator.serviceWorker.controller.postMessage({ type: "CANCEL_NOTIFICATIONS" });
}
