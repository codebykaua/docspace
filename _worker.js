import { onRequest as handleApiRequest } from "./functions/api/[[path]].js";

export default {
    async fetch(request, env, context) {
        const url = new URL(request.url);

        if (url.pathname.startsWith("/api/")) {
            return handleApiRequest({
                request,
                env,
                waitUntil: context.waitUntil.bind(context),
            });
        }

        return env.ASSETS.fetch(request);
    },
};