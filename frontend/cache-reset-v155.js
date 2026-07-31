(() => {
    "use strict";

    window.DOCSPACE_BUILD = "1.55";
    document.documentElement.dataset.docspaceBuild = "1.55";

    const marker = "docspace-cache-reset-v155";

    async function clearLegacyRuntimeCaches() {
        let changed = false;

        try {
            if ("serviceWorker" in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                if (registrations.length) changed = true;
                await Promise.all(registrations.map((registration) => registration.unregister()));
            }
        } catch (error) {
            console.warn("Falha ao remover Service Worker antigo", error);
        }

        try {
            if ("caches" in window) {
                const keys = await caches.keys();
                if (keys.length) changed = true;
                await Promise.all(keys.map((key) => caches.delete(key)));
            }
        } catch (error) {
            console.warn("Falha ao limpar caches antigos", error);
        }

        return changed;
    }

    if (sessionStorage.getItem(marker) !== "done") {
        sessionStorage.setItem(marker, "done");
        clearLegacyRuntimeCaches().then((changed) => {
            if (!changed) return;
            const url = new URL(window.location.href);
            url.searchParams.set("build", "155");
            window.location.replace(url.toString());
        });
    }
})();
