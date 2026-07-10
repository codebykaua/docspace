/**
 * DocSpace Service Worker
 *
 * Regras críticas (PWA / "instalar app"):
 * - Nunca servir index.html no lugar de JS/CSS (isso “corrompe” o app).
 * - Nunca cachear resposta HTML para URLs de asset (.js/.css/etc).
 * - Não interceptar API nem CDN cross-origin.
 * - Navegação: network-first com shell offline.
 * - Assets: network-first com cache por pathname (ignora ?v=).
 */
const CACHE_NAME = "docspace-v132-product-features";

const PRECACHE_URLS = [
    "./",
    "./index.html",
    "./share.html",
    "./style.css",
    "./script.js",
    "./docspace-product.js",
    "./app-config.js",
    "./manifest.webmanifest",
    "./assets/LOGO1.png",
    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png",
];

function isSameOrigin(url) {
    return url.origin === self.location.origin;
}

function isApiRequest(url) {
    return url.pathname === "/api" || url.pathname.startsWith("/api/");
}

function isNavigationRequest(request) {
    if (request.mode === "navigate") return true;
    if (request.destination === "document") return true;
    const accept = request.headers.get("accept") || "";
    return accept.includes("text/html");
}

function assetPathname(url) {
    return url.pathname || "/";
}

function looksLikeStaticAsset(url) {
    return /\.(css|js|mjs|map|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|otf|webmanifest|json|html|docx|pdf)$/i.test(
        url.pathname
    );
}

/**
 * Evita envenenar o cache: HTML (ou tipo errado) nunca grava como .js/.css.
 */
function canCacheResponse(request, response) {
    if (!response || response.status !== 200 || response.type === "opaque") {
        return false;
    }

    // Só cacheia GET same-origin já filtrado no fetch handler
    const url = new URL(request.url);
    const contentType = (response.headers.get("content-type") || "").toLowerCase();
    const path = url.pathname.toLowerCase();

    if (contentType.includes("text/html")) {
        // HTML só pode ser cacheado para navegação / .html
        if (isNavigationRequest(request) || path.endsWith(".html") || path.endsWith("/")) {
            return true;
        }
        return false;
    }

    if (/\.css$/i.test(path) || request.destination === "style") {
        if (contentType && !contentType.includes("text/css") && !contentType.includes("stylesheet")) {
            return false;
        }
    }

    if (/\.(js|mjs)$/i.test(path) || request.destination === "script") {
        if (
            contentType &&
            !contentType.includes("javascript") &&
            !contentType.includes("ecmascript") &&
            !contentType.includes("application/octet-stream") &&
            !contentType.includes("text/plain")
        ) {
            return false;
        }
    }

    return true;
}

function cacheKeyForRequest(request) {
    const url = new URL(request.url);
    // Chave estável sem query (?v=130) — evita duplicar e falhar match
    return url.origin + url.pathname;
}

async function precache() {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(
        PRECACHE_URLS.map(async (url) => {
            try {
                const response = await fetch(url, { cache: "reload" });
                if (response && response.ok) {
                    await cache.put(url, response);
                }
            } catch {
                // Ignora falha individual (ícone opcional etc.)
            }
        })
    );
}

async function clearOldCaches() {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
}

self.addEventListener("install", (event) => {
    self.skipWaiting();
    event.waitUntil(precache());
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            await clearOldCaches();
            await self.clients.claim();
        })()
    );
});

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
    if (event.data && event.data.type === "CLEAR_CACHES") {
        event.waitUntil(
            (async () => {
                const keys = await caches.keys();
                await Promise.all(keys.map((key) => caches.delete(key)));
                await precache();
            })()
        );
    }
});

self.addEventListener("fetch", (event) => {
    const request = event.request;
    if (request.method !== "GET") return;

    let url;
    try {
        url = new URL(request.url);
    } catch {
        return;
    }

    // CDN / terceiros: não interceptar (evita devolver HTML no lugar do script)
    if (!isSameOrigin(url)) return;

    // API: sempre rede pura
    if (isApiRequest(url)) return;

    // Navegação de página (abrir o app)
    if (isNavigationRequest(request)) {
        event.respondWith(networkFirstNavigation(request));
        return;
    }

    // Assets estáticos same-origin
    if (looksLikeStaticAsset(url) || request.destination) {
        event.respondWith(networkFirstAsset(request));
        return;
    }

    // Demais GETs same-origin: rede, sem fallback HTML
    event.respondWith(
        fetch(request).catch(async () => {
            const cached = await caches.match(request, { ignoreSearch: true });
            if (cached) return cached;
            return new Response("Offline", {
                status: 503,
                statusText: "Service Unavailable",
                headers: { "Content-Type": "text/plain; charset=utf-8" },
            });
        })
    );
});

async function networkFirstNavigation(request) {
    try {
        const response = await fetch(request);
        if (canCacheResponse(request, response)) {
            const cache = await caches.open(CACHE_NAME);
            // Shell offline sempre em index.html
            await cache.put("./index.html", response.clone()).catch(() => undefined);
            await cache.put(cacheKeyForRequest(request), response.clone()).catch(() => undefined);
        }
        return response;
    } catch {
        const cached =
            (await caches.match(request, { ignoreSearch: true })) ||
            (await caches.match("./index.html")) ||
            (await caches.match("index.html")) ||
            (await caches.match("./"));
        if (cached) return cached;
        return new Response("DocSpace offline", {
            status: 503,
            headers: { "Content-Type": "text/html; charset=utf-8" },
        });
    }
}

async function networkFirstAsset(request) {
    const key = cacheKeyForRequest(request);

    try {
        const response = await fetch(request);
        if (canCacheResponse(request, response)) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(key, response.clone()).catch(() => undefined);
        }
        // Se a rede devolveu HTML onde deveria ser JS/CSS, não use isso “como asset”
        const url = new URL(request.url);
        const ct = (response.headers.get("content-type") || "").toLowerCase();
        if (/\.(js|mjs|css)$/i.test(url.pathname) && ct.includes("text/html")) {
            const cached =
                (await caches.match(key, { ignoreSearch: true })) ||
                (await caches.match(request, { ignoreSearch: true }));
            if (cached) return cached;
            return new Response("/* asset invalid from network */", {
                status: 502,
                headers: {
                    "Content-Type": /\.css$/i.test(url.pathname)
                        ? "text/css; charset=utf-8"
                        : "application/javascript; charset=utf-8",
                },
            });
        }
        return response;
    } catch {
        const cached =
            (await caches.match(key, { ignoreSearch: true })) ||
            (await caches.match(request, { ignoreSearch: true })) ||
            (await caches.match(assetPathname(new URL(request.url)), { ignoreSearch: true }));

        if (cached) {
            const ct = (cached.headers.get("content-type") || "").toLowerCase();
            const path = new URL(request.url).pathname;
            // Última defesa: nunca devolver HTML cacheado como JS/CSS
            if (/\.(js|mjs|css)$/i.test(path) && ct.includes("text/html")) {
                return new Response("/* cached html rejected */", {
                    status: 503,
                    headers: {
                        "Content-Type": /\.css$/i.test(path)
                            ? "text/css; charset=utf-8"
                            : "application/javascript; charset=utf-8",
                    },
                });
            }
            return cached;
        }

        // CRÍTICO: não cair em index.html aqui
        return new Response("Offline asset unavailable", {
            status: 503,
            statusText: "Service Unavailable",
            headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
    }
}
