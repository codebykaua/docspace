const CACHE_NAME = "docspace-v125-auditoria-campos";
const STATIC_ASSETS = ["./", "index.html", "style.css?v=120", "script.js?v=120", "app-config.js?v=120", "manifest.webmanifest"];
self.addEventListener("install", (event) => { self.skipWaiting(); event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS).catch(() => undefined))); });
self.addEventListener("activate", (event) => { event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))); self.clients.claim(); });
self.addEventListener("fetch", (event) => { const req = event.request; if (req.method !== "GET") return; event.respondWith(fetch(req).catch(() => caches.match(req).then((cached) => cached || caches.match("index.html")))); });
