(() => {
    "use strict";

    const SESSION_TOKEN_KEY = "documentos_rurais_session_token";
    const config = window.DOCSPACE_AI_CONFIG || {};

    function getApiBaseUrl() {
        return String(
            window.DOCSPACE_CONFIG?.AI_API_BASE_URL ||
            window.DOCSPACE_CONFIG?.API_BASE_URL ||
            window.API_BASE_URL ||
            ""
        ).trim().replace(/\/+$/, "");
    }

    function resolveApiUrl(path) {
        const value = String(path || "").trim();
        if (/^https?:\/\//i.test(value)) return value;
        const base = getApiBaseUrl();
        return `${base}${value.startsWith("/") ? value : `/${value}`}`;
    }

    async function request(path, options = {}) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), Number(config.timeoutMs || 60000));
        const token = localStorage.getItem(SESSION_TOKEN_KEY);
        const url = resolveApiUrl(path);

        try {
            const response = await fetch(url, {
                ...options,
                credentials: "include",
                signal: controller.signal,
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    ...(options.headers || {}),
                },
            });

            const text = await response.text();
            let data = {};
            try {
                data = text ? JSON.parse(text) : {};
            } catch (_) {
                data = { message: text };
            }

            if (!response.ok) {
                const error = new Error(data.message || data.error || `Erro HTTP ${response.status}`);
                error.status = response.status;
                error.data = data;
                error.url = url;
                throw error;
            }
            return data;
        } catch (error) {
            if (error?.name === "AbortError") {
                throw new Error("A solicitação da IA excedeu o tempo limite.");
            }
            if (error instanceof TypeError && /fetch|network|load/i.test(String(error.message || ""))) {
                const networkError = new Error(`Não foi possível conectar ao Worker da IA (${url}).`);
                networkError.cause = error;
                networkError.url = url;
                throw networkError;
            }
            throw error;
        } finally {
            clearTimeout(timeout);
        }
    }

    window.DocSpaceAI = Object.freeze({
        isPrepared: true,
        isEnabled: Boolean(config.enabled),
        getApiBaseUrl,
        async getStatus() {
            return request(config.statusEndpoint || "/api/ai/status");
        },
        async run(action, payload = {}) {
            if (!config.enabled) {
                throw new Error("A IA está preparada, mas ainda não foi ativada no DocSpace.");
            }
            return request(config.actionEndpoint || "/api/ai/actions", {
                method: "POST",
                body: JSON.stringify({ action, ...payload }),
            });
        },
    });
})();
