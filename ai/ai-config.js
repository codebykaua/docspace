(() => {
    "use strict";

    window.DOCSPACE_AI_CONFIG = Object.freeze({
        enabled: true,
        statusEndpoint: "/api/ai/status",
        actionEndpoint: "/api/ai/actions",
        timeoutMs: 60000,
    });
})();
