const CACHE_NAME = "haru-samil-v1";
const STATIC_ASSETS = ["/", "/report", "/settings"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // skip non-GET and cross-origin
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  // skip API routes
  if (url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/"))
    );
  } else {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
  }
});

// notification scheduling
let notifTimer = null;

self.addEventListener("message", (event) => {
  if (!event.data) return;

  if (event.data.type === "SCHEDULE_NOTIFICATION") {
    const { title, body, delayMs } = event.data;
    if (notifTimer !== null) clearTimeout(notifTimer);
    if (delayMs > 0 && delayMs < 24 * 60 * 60 * 1000) {
      notifTimer = setTimeout(() => {
        self.registration.showNotification(title, {
          body,
          icon: "/icon.svg",
          badge: "/icon.svg",
          tag: "haru-samil-daypart",
          requireInteraction: false,
          silent: false,
        });
        notifTimer = null;
      }, delayMs);
    }
  }

  if (event.data.type === "CANCEL_NOTIFICATIONS") {
    if (notifTimer !== null) {
      clearTimeout(notifTimer);
      notifTimer = null;
    }
  }
});
