export default {
    async fetch(request, env, context) {
        return onRequest({
            request,
            env,
            waitUntil: context.waitUntil.bind(context),
        });
    },
};

const SESSION_COOKIE = "dr_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const BILLING_TOKEN_TTL_SECONDS = 60 * 60 * 24;
const MAX_SUPPORT_ATTACHMENT_BYTES = 1500 * 1024;
const MAX_SUPPORT_REQUEST_BODY_BYTES = 2200 * 1024;
const MAX_PREVIEW_DOCX_BASE64_LENGTH = 14 * 1024 * 1024;
const MAX_PDF_TOOL_BASE64_LENGTH = 70 * 1024 * 1024;
const SERVER_PDF_TOOL_TYPES = new Set(["compress", "ocr", "wordPdf"]);
const MAX_PROFILE_AVATAR_BYTES = 350 * 1024;
const DEFAULT_DAILY_DOCUMENT_LIMIT = 30;
const DEFAULT_DAILY_PDF_TOOL_LIMIT = 5;
const DAILY_DOCUMENT_RESET_HOUR = 4;
const DAILY_DOCUMENT_RESET_MINUTE = 0;
const DAILY_DOCUMENT_TIME_ZONE = "America/Sao_Paulo";
// Cloudflare Workers limita PBKDF2 a no máximo 100000 iterações.
const PASSWORD_ITERATIONS = 100000;
const PASSWORD_ALGORITHM = "PBKDF2";
const PASSWORD_HASH = "SHA-256";
const MERCADO_PAGO_API_BASE = "https://api.mercadopago.com";
const CORS_ALLOWED_ORIGINS = new Set([
    "https://codebykaua.github.io",
    "https://kaualucasfranca.github.io",
    "https://gerador-documentos-rurais.pages.dev",
    "https://docspace-web.pages.dev",
    "https://docspace-api.kaualucas9773.workers.dev",
    "https://tiny-bread-b482gerador-documentos-rurais-api.kauatech-dev.workers.dev",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]);
const BILLING_PROVIDER = "mercado_pago";

function mercadoPagoCredentialMode(value) {
    const normalized = String(value || "").trim().toUpperCase();
    if (normalized.startsWith("TEST-")) return "test";
    if (normalized.startsWith("APP_USR-")) return "production";
    return "unknown";
}

const BILLING_PLAN_PRICES = {
    basic30: {
        amount: 79.90,
        currency: "BRL",
        title: "DocSpace - Plano Basico 30 dias",
    },
    test10c: {
        amount: 0.10,
        currency: "BRL",
        title: "DocSpace - Teste Mercado Pago R$ 0,10",
    },
    proMax365: {
        amount: 590.99,
        currency: "BRL",
        title: "DocSpace - Plano Pro Max 365 dias",
    },
};
let schemaReady = false;
let lastExpirySweepAt = 0;
const EXPIRY_SWEEP_INTERVAL_MS = 5 * 60 * 1000;
const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_BLOCK_DURATION_MS = 15 * 60 * 1000;
const LOGIN_MAX_FAILED_ATTEMPTS = 5;
const SUPPORT_MESSAGE_HOURLY_LIMIT = 10;

const PLANS = {
    test3min: {
        label: "3 minutos para teste",
        minutes: 3,
    },
    test10c: {
        label: "Teste Mercado Pago - R$ 0,10",
        days: 30,
    },
    basic30: {
        label: "30 dias plano Básico",
        days: 30,
    },
    proMax365: {
        label: "365 dias plano Pro Max",
        days: 365,
    },
};

const PLAN_ALIASES = {
    teste3min: "test3min",
    "3-minutos": "test3min",
    test10c: "test10c",
    teste10c: "test10c",
    teste10centavos: "test10c",
    "teste-10-centavos": "test10c",
    "teste-mercado-pago": "test10c",
    test15min: "basic30",
    test5min: "basic30",
    trial15: "basic30",
    trial7: "basic30",
    monthly30: "basic30",
    annual365: "proMax365",
    basico30: "basic30",
    basic: "basic30",
    plus: "basic30",
    plus90: "basic30",
    pro: "basic30",
    pro180: "basic30",
    proMax: "proMax365",
    "pro-max": "proMax365",
    pro_max: "proMax365",
};

const LIMITED_DOCUMENT_PLANS = new Set(["test3min", "test10c", "basic30"]);
const DOCUMENT_GENERATION_TYPES = new Set([
    "Autodeclaracao - COM REPRESENTACAO",
    "Autodeclaracao - SEM REPRESENTACAO",
    "autodeclaracao-rural",
    "autorizacao_cadastro_orgaos_publicos",
    "autorizacao_ligacao_agua_rural",
    "autorizacao_ligacao_energia_rural",
    "autorizacao_menor",
    "autorizacao_passagem",
    "autorizacao_personalizada",
    "autorizacao_uso_imagem",
    "autorizacao_uso_imovel_rural",
    "autorizacao_viagem",
    "cadastro-confrontantes",
    "cadastro_confrontantes_template(1)",
    "carta_apresentacao",
    "carta_cobranca",
    "cessao_direitos_possessorios",
    "comodato",
    "contrato-arrendamento-rural",
    "contrato-comodato-equipamentos",
    "contrato-compra-venda-imovel",
    "contrato-compra-venda-veiculo",
    "contrato-honorarios-50",
    "contrato-parceria-rural",
    "contrato-prev-30",
    "contrato-prev-40",
    "contrato_arrendamento_rural_template",
    "contrato_comodato",
    "contrato_comodato_equipamentos_template",
    "contrato_compra_venda_rural",
    "contrato_compra_venda_template_sistema_negrito",
    "contrato_compra_venda_veiculo_bem_movel_template",
    "contrato_honorarios_50",
    "contrato_parceria_rural_template",
    "contrato_prev_30",
    "contrato_prev_40",
    "controle-producao-anual",
    "controle-rebanho",
    "controle_producao_anual_template(1)",
    "controle_rebanho_template(1)",
    "declaracao-agricultura-familiar",
    "declaracao-atividade-rural",
    "declaracao-autenticidade-documentos",
    "declaracao-baixa-renda",
    "declaracao-convivencia-familiar",
    "declaracao-dependencia-economica",
    "declaracao-nao-possuir-renda",
    "declaracao-posse-mansa-pacifica",
    "declaracao-residencia",
    "declaracao-tempo-trabalho-rural",
    "declaracao-uniao-estavel",
    "declaracao_atividade_rural_template",
    "declaracao_autenticidade_documentos_template",
    "declaracao_baixa_renda_template",
    "declaracao_benfeitorias",
    "declaracao_benfeitorias_rurais",
    "declaracao_confrontantes",
    "declaracao_confrontantes_rural",
    "declaracao_convivencia_familiar_template",
    "declaracao_dependencia_economica_template",
    "declaracao_estado_civil",
    "declaracao_exercicio_agricultura_familiar_template",
    "declaracao_exercicio_atividade",
    "declaracao_inexistencia_debitos",
    "declaracao_nao_possuir_renda_template",
    "declaracao_personalizada",
    "declaracao_posse_mansa_pacifica_template",
    "declaracao_posso",
    "declaracao_quitacao",
    "declaracao_renda_comum",
    "declaracao_renda_membros",
    "declaracao_residencia_template",
    "declaracao_responsabilidade",
    "declaracao_segurado_especial",
    "declaracao_segurado_especial_previdenciaria",
    "declaracao_tempo_trabalho_rural_template",
    "declaracao_testemunha",
    "declaracao_trabalho",
    "declaracao_ufba_membros",
    "declaracao_uniao_estavel_template",
    "declaracao_vinculo_dependencia_previdenciaria",
    "inventario-producao-rural",
    "inventario_producao_rural_template",
    "justificativa_documentos_inss",
    "notificacao_extrajudicial",
    "oficio",
    "pedido_acerto_cadastral",
    "pedido_aposentadoria_rural",
    "pedido_beneficio",
    "pedido_certidao",
    "pedido_correcao_cadastral",
    "pedido_revisao_inss",
    "posse",
    "procuracao-consumidor",
    "procuracao-normal",
    "procuracao_bancaria",
    "procuracao_cartorio",
    "procuracao_consumidor",
    "procuracao_imovel",
    "procuracao_inss",
    "procuracao_inss_previdenciaria",
    "procuracao_judicial",
    "procuracao_movimentacao_conta",
    "procuracao_normal",
    "procuracao_prefeitura_orgaos_publicos",
    "procuracao_receber_valores",
    "procuracao_veiculo",
    "recibo_compra_venda",
    "recibo_compra_venda_rural",
    "recibo_pagamento",
    "recibo_simples",
    "recurso_administrativo_inss",
    "renda-membros",
    "requerimento_administrativo_inss",
    "requerimento_banco",
    "requerimento_cartorio",
    "requerimento_companhia_agua",
    "requerimento_companhia_energia",
    "requerimento_geral",
    "requerimento_prefeitura",
    "requerimento_rural",
    "revogacao_procuracao",
    "solicitacao_formal",
    "termo_acordo",
    "termo_autorizacao_cultivo",
    "termo_cessao_area",
    "termo_ciencia",
    "termo_compromisso",
    "termo_confrontacao",
    "termo_consentimento",
    "termo_desistencia",
    "termo_entrega",
    "termo_ocupacao_rural",
    "termo_quitacao",
    "termo_recebimento",
    "termo_responsabilidade",
    "ufba-membros",
]);
const USER_DOCUMENT_ACCESS_TYPES = new Set([...DOCUMENT_GENERATION_TYPES, "pdf-local"]);
const PDF_TOOL_TYPES = new Set([
    "compress",
    "splitSize",
    "clean",
    "merge",
    "split",
    "extract",
    "remove",
    "organize",
    "reverse",
    "rotate",
    "blank",
    "duplicate",
    "oddEven",
    "images",
    "wordPdf",
    "ocr",
    "number",
    "watermark",
    "stamp",
    "headerFooter",
    "pdfImages",
    "crop",
    "resizeA4",
    "metadata",
]);
const AI_ACTIONS = new Set(["assist", "draft", "review", "extract-fields", "office-word", "office-excel", "office-powerpoint"]);
const AI_DEFAULT_TIMEOUT_MS = 60_000;
const AI_MAX_PROMPT_LENGTH = 24_000;
const AI_MAX_HISTORY_MESSAGES = 14;
const AI_MAX_HISTORY_MESSAGE_LENGTH = 4_000;
const AI_REFERENCE_TIME_ZONE = "America/Sao_Paulo";
const AI_MAX_IMAGES = 6;
const AI_MAX_IMAGE_BYTES = 6 * 1024 * 1024;
const AI_MAX_TOTAL_IMAGE_BYTES = 20 * 1024 * 1024;

export async function onRequest(context) {
    const { request, env } = context;

    if (request.method === "OPTIONS") {
        return createCorsPreflightResponse(request, env);
    }

    try {
        const response = await handleRequest(request, env);
        return withCors(request, response, env);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = status === 500 ? "Erro interno da API." : error.message;
        return withCors(request, json({ message }, status, error.headers), env);
    }
}

async function handleRequest(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);

    if (request.method === "GET" && path.length === 0) {
        const publicAppUrl = String(env.PUBLIC_APP_URL || "").trim();
        if (publicAppUrl) return Response.redirect(publicAppUrl, 302);
        return json({ service: "DocSpace API", status: "online", message: "Configure PUBLIC_APP_URL para abrir o site pela URL do Worker." });
    }

    if (request.method === "GET" && match(path, ["setup-admin"])) {
        return html(getSetupAdminPage());
    }

    if (!env.DB) {
        return json({ message: "Banco D1 nao configurado. Confira o binding DB no Cloudflare." }, 500);
    }

    await ensureDatabaseSchema(env);
    await expireOverdueUsersIfDue(env);

    if (request.method === "GET" && match(path, ["version"])) {
        return json({ service: "DocSpace API", version: "1.57", build: 157, database: "d1" });
    }

    if (request.method === "GET" && match(path, ["setup", "status"])) {
        const firstAdmin = await env.DB.prepare("SELECT id FROM users WHERE is_admin = 1 LIMIT 1").first();
        return json({
            adminExists: Boolean(firstAdmin),
            publicAppUrl: String(env.PUBLIC_APP_URL || "").trim() || null,
        });
    }

    if (request.method === "POST" && match(path, ["setup"])) {
        return setupFirstAdmin(request, env);
    }

    if (request.method === "POST" && match(path, ["auth", "login"])) {
        return login(request, env);
    }

    if (request.method === "GET" && match(path, ["public", "checkout", "config"])) {
        const publicKey = String(env.MERCADO_PAGO_PUBLIC_KEY || "").trim();
        const accessToken = String(env.MERCADO_PAGO_ACCESS_TOKEN || "").trim();
        const publicKeyMode = mercadoPagoCredentialMode(publicKey);
        const accessTokenMode = mercadoPagoCredentialMode(accessToken);
        const credentialModeMatch = publicKeyMode === "unknown" || accessTokenMode === "unknown" || publicKeyMode === accessTokenMode;
        return json({
            provider: "mercado_pago",
            accessTokenConfigured: Boolean(accessToken),
            publicKeyConfigured: Boolean(publicKey),
            publicKeyMode,
            accessTokenMode,
            credentialModeMatch,
            embeddedCheckout: Boolean(publicKey && accessToken && credentialModeMatch),
            pixEnabled: Boolean(accessToken),
            webhookConfigured: Boolean(String(env.MERCADO_PAGO_WEBHOOK_URL || "").trim()),
        });
    }

    if (request.method === "POST" && match(path, ["public", "checkout", "start"])) {
        return startPublicCheckout(request, env);
    }

    if (request.method === "POST" && match(path, ["auth", "logout"])) {
        return logout(request, env);
    }

    if (request.method === "GET" && match(path, ["session"])) {
        const session = await requireSession(request, env);
        return json({
            user: publicUser(session.user),
            message: buildAccessMessage(session.user),
            renewalWarning: buildRenewalWarning(session.user),
            documentUsage: await getDocumentUsageSummary(env, session.user),
            pdfToolUsage: await getPdfToolUsageSummary(env, session.user),
        });
    }

    if (request.method === "GET" && match(path, ["ai", "status"])) {
        await requireSession(request, env);
        const apiKeyConfigured = Boolean(env.AI_API_KEY || env.OPENROUTER_API_KEY || env.OPENAI_API_KEY);
        const clock = getAiReferenceClock();
        return json({
            prepared: true,
            enabled: String(env.AI_ENABLED || "").toLowerCase() === "true" && apiKeyConfigured,
            configured: apiKeyConfigured,
            credentialConnected: apiKeyConfigured,
            provider: env.AI_PROVIDER || "openrouter",
            model: env.AI_MODEL || null,
            endpointHost: safeEndpointHost(env.AI_API_URL),
            serverClock: clock,
        });
    }

    if (request.method === "GET" && match(path, ["media", "search"])) {
        await requireSession(request, env);
        return searchPresentationMedia(request);
    }

    if (request.method === "GET" && match(path, ["media", "image"])) {
        return proxyPresentationMedia(request);
    }

    if (request.method === "POST" && match(path, ["ai", "actions"])) {
        const session = await requireSession(request, env);
        return processAiAction(request, env, session.user);
    }

    if (request.method === "POST" && match(path, ["ai", "export-pdf"])) {
        const session = await requireSession(request, env);
        return exportAiDocumentPdf(request, env, session.user);
    }

    if (request.method === "GET" && match(path, ["documents", "usage"])) {
        const session = await requireSession(request, env);
        return json({ documentUsage: await getDocumentUsageSummary(env, session.user) });
    }

    if (request.method === "GET" && match(path, ["pdf-tools", "usage"])) {
        const session = await requireSession(request, env);
        return json({ pdfToolUsage: await getPdfToolUsageSummary(env, session.user) });
    }

    if (request.method === "PUT" && match(path, ["profile", "avatar"])) {
        const session = await requireSession(request, env);
        return updateProfileAvatar(request, env, session.user);
    }

    if (request.method === "POST" && match(path, ["documents", "usage"])) {
        return consumeDocumentUsage(request, env);
    }

    if (request.method === "POST" && match(path, ["pdf-tools", "usage"])) {
        return consumePdfToolUsage(request, env);
    }

    if (request.method === "POST" && match(path, ["pdf-tools", "process"])) {
        const session = await requireSession(request, env);
        return processPdfToolWithRender(request, env, session.user);
    }

    if (request.method === "POST" && match(path, ["support", "messages"])) {
        return createSupportMessage(request, env);
    }

    if (request.method === "GET" && match(path, ["support", "messages"])) {
        const identity = await requireSupportIdentity(request, env);
        return json({ messages: await listSupportMessages(env, identity.user) });
    }

    if (request.method === "POST" && match(path, ["billing", "payment-proofs"])) {
        return createPaymentProof(request, env);
    }

    if (request.method === "POST" && match(path, ["billing", "checkout"])) {
        return createBillingCheckout(request, env);
    }

    if (request.method === "POST" && match(path, ["billing", "pix"])) {
        return createBillingPixPayment(request, env);
    }

    if (request.method === "POST" && match(path, ["billing", "brick-payment"])) {
        return createMercadoPagoBrickPayment(request, env);
    }

    if (request.method === "GET" && path.length === 3 && path[0] === "billing" && path[1] === "payments") {
        return getBillingPaymentStatus(request, env, path[2]);
    }

    if (request.method === "POST" && match(path, ["billing", "mercadopago", "webhook"])) {
        return handleMercadoPagoWebhook(request, env);
    }

    if (request.method === "GET" && path.length === 3 && path[0] === "support" && path[1] === "attachments") {
        return downloadSupportAttachment(request, env, path[2]);
    }

    if (request.method === "GET" && match(path, ["admin", "users"])) {
        const session = await requireAdmin(request, env);
        const users = await listUsers(env);
        await logAction(env, session.user.id, "list_users", null);
        return json({ users });
    }

    if (request.method === "GET" && path.length === 4 && path[0] === "admin" && path[1] === "users" && path[3] === "document-usage") {
        await requireAdmin(request, env);
        const user = await getUserById(env, path[2]);

        if (!user) {
            throw httpError(404, "Usuario nao encontrado.");
        }

        return json({ user: publicUser(user), documentUsage: await getDocumentUsageSummary(env, user) });
    }

    if (request.method === "GET" && path.length === 4 && path[0] === "admin" && path[1] === "users" && path[3] === "pdf-usage") {
        await requireAdmin(request, env);
        const user = await getUserById(env, path[2]);

        if (!user) {
            throw httpError(404, "Usuario nao encontrado.");
        }

        return json({ user: publicUser(user), pdfToolUsage: await getPdfToolUsageSummary(env, user) });
    }

    if (request.method === "GET" && path.length === 4 && path[0] === "admin" && path[1] === "users" && path[3] === "history") {
        await requireAdmin(request, env);
        const user = await getUserById(env, path[2]);

        if (!user) {
            throw httpError(404, "Usuario nao encontrado.");
        }

        return json({ user: publicUser(user), history: await listUserHistory(env, user.id) });
    }

    if (request.method === "GET" && match(path, ["admin", "support", "messages"])) {
        await requireAdmin(request, env);
        return json({ messages: await listAdminSupportMessages(env) });
    }

    if (request.method === "POST" && match(path, ["admin", "support", "messages"])) {
        const session = await requireAdmin(request, env);
        return createAdminSupportMessage(request, env, session.user);
    }

    if (request.method === "POST" && match(path, ["admin", "users"])) {
        const session = await requireAdmin(request, env);
        const body = await readJson(request);
        const user = await createManagedUser(env, body, session.user, request);
        return json({ user, message: "Login criado com sucesso." }, 201);
    }

    if (request.method === "PUT" && path.length === 3 && path[0] === "admin" && path[1] === "users") {
        const session = await requireAdmin(request, env);
        const body = await readJson(request);
        const user = await updateManagedUser(env, path[2], body, session.user, request);
        return json({ user, message: "Login atualizado com sucesso." });
    }

    if (request.method === "POST" && path.length === 4 && path[0] === "admin" && path[1] === "users" && path[3] === "actions") {
        const session = await requireAdmin(request, env);
        const body = await readJson(request);
        const user = await runUserAction(env, path[2], body.action, session.user, body, request);
        return json({ user, message: "Acesso atualizado com sucesso." });
    }

    if (request.method === "POST" && match(path, ["documents", "preview-pdf"])) {
        const session = await requireSession(request, env);
        return previewDocumentAsPdf(request, env, session.user);
    }

    // ── Product features: share links and administrative templates ──
    if (request.method === "GET" && match(path, ["share", "links"])) {
        const session = await requireSession(request, env);
        return json({ links: await listShareLinks(env, session.user.id) });
    }
    if (request.method === "POST" && match(path, ["share", "links"])) {
        const session = await requireSession(request, env);
        const link = await createShareLink(env, session.user.id, await readJson(request));
        return json({ link, message: "Link de preenchimento criado." }, 201);
    }
    if (request.method === "DELETE" && path.length === 3 && path[0] === "share" && path[1] === "links") {
        const session = await requireSession(request, env);
        await closeShareLink(env, session.user.id, path[2]);
        return json({ message: "Link encerrado." });
    }
    if (request.method === "GET" && path.length === 3 && path[0] === "share" && path[1] === "public") {
        return getPublicShareLink(env, path[2]);
    }
    if (request.method === "POST" && path.length === 3 && path[0] === "share" && path[1] === "public") {
        return submitPublicShareLink(env, path[2], await readJson(request));
    }

    if (request.method === "GET" && match(path, ["templates"])) {
        const session = await requireSession(request, env);
        return json(await getTemplatesCatalog(env, session.user));
    }
    if (request.method === "GET" && match(path, ["admin", "templates"])) {
        await requireAdmin(request, env);
        return json(await getTemplatesCatalog(env, null, true));
    }
    if (request.method === "POST" && match(path, ["admin", "templates"])) {
        const session = await requireAdmin(request, env);
        const template = await createCustomTemplate(env, session.user, await readJson(request));
        return json({ template, message: "Modelo customizado criado." }, 201);
    }
    if (request.method === "PUT" && path.length === 3 && path[0] === "admin" && path[1] === "templates") {
        const session = await requireAdmin(request, env);
        const template = await updateCustomTemplate(env, session.user, path[2], await readJson(request));
        return json({ template, message: "Modelo atualizado." });
    }
    if (request.method === "POST" && match(path, ["admin", "templates", "settings"])) {
        const session = await requireAdmin(request, env);
        const settings = await setTemplateSetting(env, session.user, await readJson(request));
        return json({ settings, message: "Visibilidade do modelo atualizada." });
    }
    if (request.method === "DELETE" && path.length === 3 && path[0] === "admin" && path[1] === "templates") {
        const session = await requireAdmin(request, env);
        await deleteCustomTemplate(env, session.user, path[2]);
        return json({ message: "Modelo customizado removido." });
    }

    return json({ message: "Rota nao encontrada." }, 404);
}

async function setupFirstAdmin(request, env) {
    const body = await readJson(request);
    const configuredToken = String(env.SETUP_TOKEN || "").trim();

    if (!configuredToken || body.setupToken !== configuredToken) {
        throw httpError(403, "Token de configuracao invalido.");
    }

    const count = await env.DB.prepare("SELECT COUNT(*) AS total FROM users").first();

    if (Number(count?.total || 0) > 0) {
        throw httpError(409, "O primeiro administrador ja foi criado.");
    }

    const user = await createManagedUser(env, {
        name: body.name,
        email: body.email,
        password: body.password,
        plan: "proMax365",
        status: "active",
        isAdmin: true,
        notes: "Primeiro administrador criado pelo setup seguro.",
    }, null);

    return json({ user, message: "Primeiro administrador criado com sucesso." }, 201);
}


async function startPublicCheckout(request, env) {
    const body = await readJson(request);
    const name = String(body.name || "").trim().replace(/\s+/g, " ");
    const email = normalizeEmail(body.email);
    const cpf = String(body.cpf || "").replace(/\D/g, "");
    const planId = normalizePlanId(body.plan || "basic30");

    if (name.split(/\s+/).filter(Boolean).length < 2) {
        throw httpError(400, "Informe o nome completo.");
    }
    if (!email) {
        throw httpError(400, "Informe um e-mail valido.");
    }
    if (!isValidBrazilianCpf(cpf)) {
        throw httpError(400, "Informe um CPF valido.");
    }
    if (!["basic30", "proMax365"].includes(planId) || !BILLING_PLAN_PRICES[planId]) {
        throw httpError(400, "Plano indisponivel para compra publica.");
    }

    let user = await getUserByEmail(env, email);
    let temporaryPassword = "";
    const created = !user;

    if (user) {
        throw httpError(409, "Ja existe uma conta com este e-mail. Entre no DocSpace para renovar ou alterar o plano com seguranca.");
    }

    temporaryPassword = generateTemporaryPassword();
    await createManagedUser(env, {
        name,
        email,
        password: temporaryPassword,
        plan: planId,
        status: "expired",
        isAdmin: false,
        isVerified: true,
        allowPdfTools: true,
        dailyDocumentLimit: DEFAULT_DAILY_DOCUMENT_LIMIT,
        pdfToolDailyLimit: DEFAULT_DAILY_PDF_TOOL_LIMIT,
        notes: "Cadastro criado automaticamente pelo checkout publico. Aguardando confirmacao do Mercado Pago.",
    }, null);
    user = await getUserByEmail(env, email);

    await env.DB.prepare(`
        UPDATE users
        SET name = ?, billing_name = ?, billing_document = ?, plan = ?, plan_label = ?, updated_at = ?
        WHERE id = ?
    `).bind(name, name, cpf, planId, getPlan(planId).label, new Date().toISOString(), user.id).run();
    user = await getUserById(env, user.id);

    const billingToken = await createBillingToken(env, user);
    await logAction(env, user.id, created ? "public_checkout_account_created" : "public_checkout_started", user.id, {
        email,
        plan: planId,
    });

    if (created && temporaryPassword) {
        await sendNotificationEmail(env, {
            to: email,
            subject: "Seu acesso ao DocSpace foi criado",
            text: [
                `Olá, ${name}.`,
                "",
                "Seu acesso ao DocSpace foi criado e ficará liberado automaticamente após a confirmação do pagamento.",
                `E-mail: ${email}`,
                `Senha provisória: ${temporaryPassword}`,
                `Plano escolhido: ${getPlan(planId).label}`,
                "",
                `Acesso: ${String(env.PUBLIC_APP_URL || "https://docspace-web.pages.dev")}`,
                "Guarde esta senha. Você poderá alterá-la posteriormente pelo atendimento."
            ].join("\n"),
            html: buildSupportEmailHtml("Seu acesso ao DocSpace foi criado", [
                `Olá, ${name}.`,
                "Seu acesso foi criado e será liberado após a confirmação do pagamento.",
                `E-mail: ${email}`,
                `Senha provisória: ${temporaryPassword}`,
                `Plano: ${getPlan(planId).label}`,
            ].join("\n")),
        });
    }

    return json({
        message: "Cadastro reservado. Escolha a forma de pagamento para ativar o plano.",
        billingToken,
        temporaryPassword,
        existingUser: false,
        user: publicUser(user),
    }, created ? 201 : 200);
}

function generateTemporaryPassword() {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$";
    const bytes = new Uint8Array(14);
    crypto.getRandomValues(bytes);
    let password = "Ds!";
    for (const byte of bytes) password += alphabet[byte % alphabet.length];
    return password.slice(0, 14);
}

function isValidBrazilianCpf(value) {
    const cpf = String(value || "").replace(/\D/g, "");
    if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
    const calculate = (length) => {
        let sum = 0;
        for (let index = 0; index < length; index += 1) sum += Number(cpf[index]) * (length + 1 - index);
        const digit = (sum * 10) % 11;
        return digit === 10 ? 0 : digit;
    };
    return calculate(9) === Number(cpf[9]) && calculate(10) === Number(cpf[10]);
}

async function ensureDatabaseSchema(env) {
    if (schemaReady) {
        return;
    }

    const statements = [
        `CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE COLLATE NOCASE,
            password_hash TEXT NOT NULL,
            plan TEXT NOT NULL,
            plan_label TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'active',
            expires_at TEXT NOT NULL,
            is_admin INTEGER NOT NULL DEFAULT 0,
            is_verified INTEGER NOT NULL DEFAULT 0,
            allow_liquid_glass INTEGER NOT NULL DEFAULT 0,
            daily_document_limit INTEGER NOT NULL DEFAULT 30,
            daily_quota_renewal_enabled INTEGER NOT NULL DEFAULT 1,
            allow_pdf_tools INTEGER NOT NULL DEFAULT 0,
            pdf_tool_daily_limit INTEGER NOT NULL DEFAULT 5,
            pdf_tool_quota_renewal_enabled INTEGER NOT NULL DEFAULT 1,
            allowed_document_types TEXT NOT NULL DEFAULT '',
            avatar_data_url TEXT NOT NULL DEFAULT '',
            notes TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            last_login_at TEXT
        )`,
        "CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)",
        "CREATE INDEX IF NOT EXISTS idx_users_status ON users(status)",
        "CREATE INDEX IF NOT EXISTS idx_users_expires_at ON users(expires_at)",
        `CREATE TABLE IF NOT EXISTS audit_logs (
            id TEXT PRIMARY KEY,
            actor_user_id TEXT,
            action TEXT NOT NULL,
            target_user_id TEXT,
            details TEXT NOT NULL DEFAULT '{}',
            ip_address TEXT NOT NULL DEFAULT '',
            user_agent TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL
        )`,
        "CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at)",
        "CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_user_id ON audit_logs(actor_user_id)",
        "CREATE INDEX IF NOT EXISTS idx_audit_logs_target_user_id ON audit_logs(target_user_id)",
        `CREATE TABLE IF NOT EXISTS support_messages (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            customer_name TEXT NOT NULL,
            customer_email TEXT NOT NULL COLLATE NOCASE,
            sender_type TEXT NOT NULL,
            category TEXT NOT NULL DEFAULT 'support',
            message TEXT NOT NULL DEFAULT '',
            plan TEXT NOT NULL DEFAULT '',
            attachment_name TEXT NOT NULL DEFAULT '',
            attachment_type TEXT NOT NULL DEFAULT '',
            attachment_data TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL
        )`,
        "CREATE INDEX IF NOT EXISTS idx_support_messages_email ON support_messages(customer_email)",
        "CREATE INDEX IF NOT EXISTS idx_support_messages_created_at ON support_messages(created_at)",
        `CREATE TABLE IF NOT EXISTS auth_login_attempts (
            attempt_key TEXT PRIMARY KEY,
            failed_count INTEGER NOT NULL DEFAULT 0,
            window_started_at TEXT NOT NULL,
            blocked_until TEXT NOT NULL DEFAULT '',
            updated_at TEXT NOT NULL
        )`,
        "CREATE INDEX IF NOT EXISTS idx_auth_login_attempts_updated_at ON auth_login_attempts(updated_at)",
        `CREATE TABLE IF NOT EXISTS billing_payments (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            plan TEXT NOT NULL,
            mode TEXT NOT NULL DEFAULT 'renew',
            amount REAL NOT NULL DEFAULT 0,
            currency TEXT NOT NULL DEFAULT 'BRL',
            status TEXT NOT NULL DEFAULT 'pending',
            provider TEXT NOT NULL DEFAULT 'mercado_pago',
            external_reference TEXT NOT NULL UNIQUE,
            mercado_pago_preference_id TEXT NOT NULL DEFAULT '',
            mercado_pago_payment_id TEXT NOT NULL DEFAULT '',
            init_point TEXT NOT NULL DEFAULT '',
            sandbox_init_point TEXT NOT NULL DEFAULT '',
            raw_response TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            approved_at TEXT
        )`,
        "CREATE INDEX IF NOT EXISTS idx_billing_payments_user ON billing_payments(user_id)",
        "CREATE INDEX IF NOT EXISTS idx_billing_payments_status ON billing_payments(status)",
        "CREATE INDEX IF NOT EXISTS idx_billing_payments_external_reference ON billing_payments(external_reference)",
        "CREATE INDEX IF NOT EXISTS idx_billing_payments_mp_payment ON billing_payments(mercado_pago_payment_id)",
        `CREATE TABLE IF NOT EXISTS document_generation_usage (
            user_id TEXT NOT NULL,
            document_type TEXT NOT NULL,
            usage_date TEXT NOT NULL,
            generated_count INTEGER NOT NULL DEFAULT 0,
            updated_at TEXT NOT NULL,
            PRIMARY KEY (user_id, document_type, usage_date)
        )`,
        "CREATE INDEX IF NOT EXISTS idx_document_generation_usage_user_date ON document_generation_usage(user_id, usage_date)",
        `CREATE TABLE IF NOT EXISTS document_quota_balances (
            user_id TEXT NOT NULL,
            document_type TEXT NOT NULL,
            available_count INTEGER NOT NULL DEFAULT 0,
            last_renewal_key TEXT NOT NULL DEFAULT '',
            updated_at TEXT NOT NULL,
            PRIMARY KEY (user_id, document_type)
        )`,
        "CREATE INDEX IF NOT EXISTS idx_document_quota_balances_user ON document_quota_balances(user_id)",
        `CREATE TABLE IF NOT EXISTS pdf_tool_quota_balances (
            user_id TEXT NOT NULL,
            tool_type TEXT NOT NULL,
            available_count INTEGER NOT NULL DEFAULT 0,
            last_renewal_key TEXT NOT NULL DEFAULT '',
            updated_at TEXT NOT NULL,
            PRIMARY KEY (user_id, tool_type)
        )`,
        "CREATE INDEX IF NOT EXISTS idx_pdf_tool_quota_balances_user ON pdf_tool_quota_balances(user_id)",
        `CREATE TABLE IF NOT EXISTS share_fill_links (
            id TEXT PRIMARY KEY,
            token TEXT NOT NULL UNIQUE,
            owner_user_id TEXT NOT NULL,
            document_type TEXT NOT NULL,
            title TEXT NOT NULL DEFAULT '',
            form_data TEXT NOT NULL DEFAULT '{}',
            allowed_fields TEXT NOT NULL DEFAULT '[]',
            status TEXT NOT NULL DEFAULT 'open',
            expires_at TEXT NOT NULL,
            submitted_at TEXT,
            submitter_name TEXT NOT NULL DEFAULT '',
            submitter_email TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )`,
        "CREATE INDEX IF NOT EXISTS idx_share_fill_links_owner ON share_fill_links(owner_user_id, created_at)",
        "CREATE INDEX IF NOT EXISTS idx_share_fill_links_token ON share_fill_links(token)",
        `CREATE TABLE IF NOT EXISTS custom_document_templates (
            id TEXT PRIMARY KEY,
            slug TEXT NOT NULL UNIQUE,
            title TEXT NOT NULL,
            description TEXT NOT NULL DEFAULT '',
            category TEXT NOT NULL DEFAULT 'outros',
            fields_json TEXT NOT NULL DEFAULT '[]',
            model_path TEXT NOT NULL DEFAULT '',
            model_base64 TEXT NOT NULL DEFAULT '',
            is_active INTEGER NOT NULL DEFAULT 1,
            created_by TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )`,
        "CREATE INDEX IF NOT EXISTS idx_custom_templates_active ON custom_document_templates(is_active)",
        `CREATE TABLE IF NOT EXISTS template_settings (
            template_id TEXT PRIMARY KEY,
            is_active INTEGER NOT NULL DEFAULT 1,
            updated_at TEXT NOT NULL,
            updated_by TEXT
        )`,
    ];

    for (const statement of statements) {
        try {
            await env.DB.prepare(statement).run();
        } catch (error) {
            // Tabelas antigas / índices opcionais não podem derrubar a API inteira
            console.warn("ensureDatabaseSchema statement skipped:", String(error.message || error).slice(0, 200));
        }
    }

    await ensureUserColumn(env, "is_verified", "INTEGER NOT NULL DEFAULT 0");
    await ensureUserColumn(env, "allow_liquid_glass", "INTEGER NOT NULL DEFAULT 0");
    await ensureUserColumn(env, "daily_document_limit", `INTEGER NOT NULL DEFAULT ${DEFAULT_DAILY_DOCUMENT_LIMIT}`);
    await ensureUserColumn(env, "daily_quota_renewal_enabled", "INTEGER NOT NULL DEFAULT 1");
    await ensureUserColumn(env, "allow_pdf_tools", "INTEGER NOT NULL DEFAULT 0");
    await ensureUserColumn(env, "pdf_tool_daily_limit", `INTEGER NOT NULL DEFAULT ${DEFAULT_DAILY_PDF_TOOL_LIMIT}`);
    await ensureUserColumn(env, "pdf_tool_quota_renewal_enabled", "INTEGER NOT NULL DEFAULT 1");
    await ensureUserColumn(env, "allowed_document_types", "TEXT NOT NULL DEFAULT ''");
    await ensureUserColumn(env, "avatar_data_url", "TEXT NOT NULL DEFAULT ''");
    await ensureUserColumn(env, "billing_document", "TEXT NOT NULL DEFAULT ''");
    await ensureUserColumn(env, "billing_name", "TEXT NOT NULL DEFAULT ''");
    await ensureTableColumn(env, "audit_logs", "ip_address", "TEXT NOT NULL DEFAULT ''");
    await ensureTableColumn(env, "audit_logs", "user_agent", "TEXT NOT NULL DEFAULT ''");

    schemaReady = true;
}

async function ensureTableColumn(env, tableName, columnName, definition) {
    const safeTable = String(tableName || "").replace(/[^a-z0-9_]/gi, "");
    if (!safeTable) return;
    const result = await env.DB.prepare(`PRAGMA table_info(${safeTable})`).all();
    const columns = result.results || [];
    if (columns.some((column) => column.name === columnName)) return;
    try {
        await env.DB.prepare(`ALTER TABLE ${safeTable} ADD COLUMN ${columnName} ${definition}`).run();
    } catch (error) {
        if (!String(error.message || "").toLowerCase().includes("duplicate column")) {
            throw error;
        }
    }
}

async function ensureUserColumn(env, columnName, definition) {
    const result = await env.DB.prepare("PRAGMA table_info(users)").all();
    const columns = result.results || [];

    if (columns.some((column) => column.name === columnName)) {
        return;
    }

    try {
        await env.DB.prepare(`ALTER TABLE users ADD COLUMN ${columnName} ${definition}`).run();
    } catch (error) {
        if (!String(error.message || "").toLowerCase().includes("duplicate column")) {
            throw error;
        }
    }
}

async function login(request, env) {
    const body = await readJson(request);
    const email = normalizeEmail(body.email);
    const password = String(body.password || "");

    if (!email || !password) {
        throw httpError(400, "Informe e-mail e senha.");
    }

    const attemptKey = await createLoginAttemptKey(request, email);
    await assertLoginAttemptAllowed(env, attemptKey);

    const user = await getUserByEmail(env, email);

    if (!user || !(await verifyPassword(password, user.password_hash))) {
        await recordFailedLoginAttempt(env, attemptKey);
        throw httpError(401, "E-mail ou senha incorretos.");
    }

    await clearLoginAttempts(env, attemptKey);

    const access = evaluateAccess(user);

    if (!access.allowed) {
        const billingToken = await createBillingToken(env, user);
        return json({
            code: "PAYMENT_REQUIRED",
            message: "Seu login esta bloqueado por falta de pagamento. Renove ou altere seu plano para solicitar a liberacao.",
            billingToken,
            user: publicUser(user),
        }, 403);
    }

    const now = new Date().toISOString();
    await env.DB.prepare("UPDATE users SET last_login_at = ?, updated_at = ? WHERE id = ?")
        .bind(now, now, user.id)
        .run();
    await logAction(env, user.id, "login", user.id, { email: user.email }, request);

    const token = await createSessionToken(env, user);
    const headers = new Headers();
    headers.append("Set-Cookie", buildSessionCookie(request, token));

    return json({
        user: publicUser(user),
        message: buildAccessMessage(user),
        renewalWarning: buildRenewalWarning(user),
        documentUsage: await getDocumentUsageSummary(env, user),
        pdfToolUsage: await getPdfToolUsageSummary(env, user),
        sessionToken: token,
    }, 200, headers);
}

async function logout(request, env) {
    try {
        const session = await requireSession(request, env);
        await logAction(env, session.user.id, "logout", session.user.id, {}, request);
    } catch (_) {
        // O cookie ainda deve ser removido mesmo quando a sessão já expirou.
    }
    const headers = new Headers();
    headers.append("Set-Cookie", clearSessionCookie(request));
    return json({ message: "Sessao encerrada." }, 200, headers);
}

async function requireAdmin(request, env) {
    const session = await requireSession(request, env);

    if (!session.user.is_admin) {
        throw httpError(403, "Este login nao tem permissao de administrador.");
    }

    return session;
}

async function requireSession(request, env) {
    const token = getBearerToken(request) || getCookie(request, SESSION_COOKIE);

    if (!token) {
        throw httpError(401, "Sessao expirada. Entre novamente.");
    }

    const payload = await verifySessionToken(env, token);
    const user = await getUserById(env, payload.uid);

    if (!user) {
        throw httpError(401, "Usuario nao encontrado.");
    }

    const access = evaluateAccess(user);

    if (!access.allowed) {
        throw httpError(403, access.message);
    }

    return { user };
}

async function consumeDocumentUsage(request, env) {
    const session = await requireSession(request, env);
    const user = session.user;
    const body = await readJson(request);
    const documentType = String(body.documentType || "").trim();

    if (!DOCUMENT_GENERATION_TYPES.has(documentType)) {
        throw httpError(400, "Documento invalido para controle de geracao.");
    }

    assertDocumentAccessAllowed(user, documentType);

    return json({ documentUsage: await consumeDocumentUsageForUser(env, user, documentType, request) });
}

async function consumeDocumentUsageForUser(env, user, documentType, request = null) {
    assertDocumentAccessAllowed(user, documentType);

    if (!isDocumentUsageLimited(user)) {
        await logAction(env, user.id, "generate_document", user.id, { documentType }, request);
        return getDocumentUsageSummary(env, user);
    }

    const usageCycle = getUsageCycle();
    const dailyLimit = getDailyDocumentLimit(user);
    const renewalEnabled = isDailyQuotaRenewalEnabled(user);
    const now = new Date().toISOString();
    const query = renewalEnabled
        ? `INSERT INTO document_generation_usage (user_id, document_type, usage_date, generated_count, updated_at)
           SELECT ?, ?, ?, 1, ?
           WHERE (SELECT COALESCE(SUM(generated_count), 0) FROM document_generation_usage WHERE user_id = ? AND usage_date = ?) < ?
           ON CONFLICT(user_id, document_type, usage_date)
           DO UPDATE SET generated_count = generated_count + 1, updated_at = excluded.updated_at`
        : `INSERT INTO document_generation_usage (user_id, document_type, usage_date, generated_count, updated_at)
           SELECT ?, ?, ?, 1, ?
           WHERE (SELECT COALESCE(SUM(generated_count), 0) FROM document_generation_usage WHERE user_id = ?) < ?
           ON CONFLICT(user_id, document_type, usage_date)
           DO UPDATE SET generated_count = generated_count + 1, updated_at = excluded.updated_at`;
    const statement = env.DB.prepare(query);
    const result = renewalEnabled
        ? await statement.bind(user.id, documentType, usageCycle.date, now, user.id, usageCycle.date, dailyLimit).run()
        : await statement.bind(user.id, documentType, usageCycle.date, now, user.id, dailyLimit).run();
    const changes = Number(result.meta?.changes ?? result.changes ?? 0);

    if (changes === 0) {
        throw createDailyDocumentLimitError(renewalEnabled);
    }

    await logAction(env, user.id, "generate_document", user.id, { documentType }, request);
    return getDocumentUsageSummary(env, user);
}

async function assertDocumentUsageAvailable(env, user, documentType) {
    assertDocumentAccessAllowed(user, documentType);

    if (!isDocumentUsageLimited(user)) return;

    const usage = await getDocumentUsageSummary(env, user);
    if (Number(usage.totalRemaining || 0) <= 0) {
        throw createDailyDocumentLimitError(isDailyQuotaRenewalEnabled(user));
    }
}

function createDailyDocumentLimitError(renewalEnabled = true) {
    const message = renewalEnabled
        ? `Limite diário de gerações atingido. A cota total será renovada às ${formatDailyDocumentResetTime()} de Brasília.`
        : "Limite total de gerações atingido. Peça ao administrador para alterar ou renovar a cota.";
    return httpError(429, message, { "X-Error-Code": "DAILY_DOCUMENT_LIMIT" });
}

async function getDocumentUsageSummary(env, user) {
    const limited = isDocumentUsageLimited(user);
    const usageCycle = getUsageCycle();
    const dailyLimit = getDailyDocumentLimit(user);
    const renewalEnabled = isDailyQuotaRenewalEnabled(user);

    if (!limited) {
        return {
            date: usageCycle.date,
            nextResetAt: usageCycle.nextResetAt,
            nextRenewalAt: usageCycle.nextResetAt,
            resetHour: DAILY_DOCUMENT_RESET_HOUR,
            resetMinute: DAILY_DOCUMENT_RESET_MINUTE,
            unlimited: true,
            limit: null,
            totalUsed: 0,
            totalRemaining: null,
            dailyAdd: null,
            renewalEnabled: true,
            documents: {},
        };
    }

    const result = renewalEnabled
        ? await env.DB.prepare(`
            SELECT document_type, SUM(generated_count) AS generated_count
            FROM document_generation_usage
            WHERE user_id = ? AND usage_date = ?
            GROUP BY document_type
        `).bind(user.id, usageCycle.date).all()
        : await env.DB.prepare(`
            SELECT document_type, SUM(generated_count) AS generated_count
            FROM document_generation_usage
            WHERE user_id = ?
            GROUP BY document_type
        `).bind(user.id).all();

    const usedByType = new Map((result.results || []).map((row) => [row.document_type, Math.max(0, Number(row.generated_count || 0))]));
    const totalUsed = [...usedByType.values()].reduce((sum, value) => sum + value, 0);
    const totalRemaining = Math.max(0, dailyLimit - totalUsed);
    const documents = {};

    DOCUMENT_GENERATION_TYPES.forEach((documentType) => {
        documents[documentType] = {
            used: usedByType.get(documentType) || 0,
            remaining: totalRemaining,
            available: totalRemaining,
            blocked: totalRemaining === 0,
            lastRenewalKey: usageCycle.date,
        };
    });

    return {
        date: usageCycle.date,
        nextResetAt: usageCycle.nextResetAt,
        nextRenewalAt: renewalEnabled ? usageCycle.nextResetAt : null,
        resetHour: DAILY_DOCUMENT_RESET_HOUR,
        resetMinute: DAILY_DOCUMENT_RESET_MINUTE,
        unlimited: false,
        limit: dailyLimit,
        totalUsed,
        totalRemaining,
        dailyAdd: renewalEnabled ? dailyLimit : 0,
        renewalEnabled,
        documents,
    };
}

async function ensureDocumentQuotaBalances() {
    // Mantida como no-op para compatibilidade com rotas antigas. A v1.43 usa cota total
    // em document_generation_usage, e não um saldo separado para cada modelo.
}

function isDocumentUsageLimited(user) {
    return !user?.is_admin && getDailyDocumentLimit(user) > 0;
}

function getDailyDocumentLimit(user) {
    const limit = Number(user?.daily_document_limit);
    return Number.isInteger(limit) && limit >= 1 ? limit : DEFAULT_DAILY_DOCUMENT_LIMIT;
}

function isDailyQuotaRenewalEnabled(user) {
    if (!user || user.daily_quota_renewal_enabled === undefined || user.daily_quota_renewal_enabled === null) {
        return true;
    }

    return Boolean(user.daily_quota_renewal_enabled);
}

function getUsageDate(date = new Date()) {
    return getUsageCycle(date).date;
}

function getUsageCycle(date = new Date()) {
    const parts = getBahiaDateParts(date);
    const cycleDate = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));

    const beforeReset = parts.hour < DAILY_DOCUMENT_RESET_HOUR
        || (parts.hour === DAILY_DOCUMENT_RESET_HOUR && parts.minute < DAILY_DOCUMENT_RESET_MINUTE);

    if (beforeReset) {
        cycleDate.setUTCDate(cycleDate.getUTCDate() - 1);
    }

    const nextCycleDate = new Date(cycleDate);
    nextCycleDate.setUTCDate(nextCycleDate.getUTCDate() + 1);

    return {
        date: formatUsageDateKey(cycleDate),
        nextResetAt: new Date(Date.UTC(
            nextCycleDate.getUTCFullYear(),
            nextCycleDate.getUTCMonth(),
            nextCycleDate.getUTCDate(),
            DAILY_DOCUMENT_RESET_HOUR + 3,
            DAILY_DOCUMENT_RESET_MINUTE,
            0,
            0
        )).toISOString(),
    };
}

function getBahiaDateParts(date) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: DAILY_DOCUMENT_TIME_ZONE,
        hourCycle: "h23",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).formatToParts(date);
    const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
    return {
        year: Number(values.year),
        month: Number(values.month),
        day: Number(values.day),
        hour: Number(values.hour),
        minute: Number(values.minute),
    };
}

function formatUsageDateKey(date) {
    const dateKey = [
        date.getUTCFullYear(),
        String(date.getUTCMonth() + 1).padStart(2, "0"),
        String(date.getUTCDate()).padStart(2, "0"),
    ].join("-");

    return `${dateKey}-${String(DAILY_DOCUMENT_RESET_HOUR).padStart(2, "0")}${String(DAILY_DOCUMENT_RESET_MINUTE).padStart(2, "0")}`;
}

function countUsageCyclesBetween(previousKey, currentKey) {
    const previousDate = parseUsageCycleDate(previousKey);
    const currentDate = parseUsageCycleDate(currentKey);

    if (!currentDate) {
        return 0;
    }

    if (!previousDate) {
        return 1;
    }

    return Math.max(0, Math.floor((currentDate.getTime() - previousDate.getTime()) / (24 * 60 * 60 * 1000)));
}

function parseUsageCycleDate(value) {
    const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (!match) {
        return null;
    }

    return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
}

function formatDailyDocumentResetTime() {
    return `${String(DAILY_DOCUMENT_RESET_HOUR).padStart(2, "0")}:${String(DAILY_DOCUMENT_RESET_MINUTE).padStart(2, "0")}`;
}

async function consumePdfToolUsage(request, env) {
    const session = await requireSession(request, env);
    const user = session.user;
    const body = await readJson(request);
    const toolType = String(body.toolType || "").trim();

    if (!PDF_TOOL_TYPES.has(toolType)) {
        throw httpError(400, "Ferramenta PDF invalida para controle de uso.");
    }

    assertPdfToolAccessAllowed(user, toolType);

    return json({ pdfToolUsage: await consumePdfToolUsageForUser(env, user, toolType, request) });
}

async function consumePdfToolUsageForUser(env, user, toolType, request = null) {
    assertPdfToolAccessAllowed(user, toolType);

    if (user.is_admin) {
        await logAction(env, user.id, "use_pdf_tool", user.id, { toolType }, request);
        return getPdfToolUsageSummary(env, user);
    }

    await ensurePdfToolQuotaBalances(env, user);
    const now = new Date().toISOString();
    const result = await env.DB.prepare(`
        UPDATE pdf_tool_quota_balances
        SET available_count = available_count - 1, updated_at = ?
        WHERE user_id = ?
          AND tool_type = ?
          AND available_count > 0
    `).bind(now, user.id, toolType).run();
    const changes = Number(result.meta?.changes ?? result.changes ?? 0);

    if (changes === 0) {
        throw createPdfToolLimitError(toolType);
    }

    await logAction(env, user.id, "use_pdf_tool", user.id, { toolType }, request);
    return getPdfToolUsageSummary(env, user);
}

function createPdfToolLimitError() {
    return httpError(429, `Sem usos disponiveis para esta ferramenta PDF. A renovacao diaria adiciona saldo as ${formatDailyDocumentResetTime()} de Brasilia.`, {
        "X-Error-Code": "PDF_TOOL_LIMIT",
    });
}

async function getPdfToolUsageSummary(env, user) {
    const usageCycle = getUsageCycle();
    const allowed = userCanUsePdfTools(user);
    const dailyLimit = getPdfToolDailyLimit(user);
    const renewalEnabled = isPdfToolQuotaRenewalEnabled(user);

    if (!allowed) {
        return {
            allowed: false,
            date: usageCycle.date,
            nextResetAt: usageCycle.nextResetAt,
            nextRenewalAt: usageCycle.nextResetAt,
            resetHour: DAILY_DOCUMENT_RESET_HOUR,
            resetMinute: DAILY_DOCUMENT_RESET_MINUTE,
            unlimited: false,
            limit: 0,
            dailyAdd: 0,
            renewalEnabled: false,
            tools: {},
        };
    }

    if (user.is_admin) {
        return {
            allowed: true,
            date: usageCycle.date,
            nextResetAt: usageCycle.nextResetAt,
            nextRenewalAt: usageCycle.nextResetAt,
            resetHour: DAILY_DOCUMENT_RESET_HOUR,
            resetMinute: DAILY_DOCUMENT_RESET_MINUTE,
            unlimited: true,
            limit: null,
            dailyAdd: null,
            renewalEnabled: true,
            tools: {},
        };
    }

    await ensurePdfToolQuotaBalances(env, user, usageCycle);

    const result = await env.DB.prepare(`
        SELECT tool_type, available_count, last_renewal_key
        FROM pdf_tool_quota_balances
        WHERE user_id = ?
    `).bind(user.id).all();
    const tools = {};

    PDF_TOOL_TYPES.forEach((toolType) => {
        tools[toolType] = {
            used: 0,
            remaining: 0,
            available: 0,
            blocked: true,
            lastRenewalKey: usageCycle.date,
        };
    });

    (result.results || []).forEach((row) => {
        if (!PDF_TOOL_TYPES.has(row.tool_type)) {
            return;
        }

        const remaining = Math.max(0, Number(row.available_count || 0));
        tools[row.tool_type] = {
            used: Math.max(0, dailyLimit - Math.min(dailyLimit, remaining)),
            remaining,
            available: remaining,
            blocked: remaining === 0,
            lastRenewalKey: row.last_renewal_key || usageCycle.date,
        };
    });

    return {
        allowed: true,
        date: usageCycle.date,
        nextResetAt: usageCycle.nextResetAt,
        nextRenewalAt: usageCycle.nextResetAt,
        resetHour: DAILY_DOCUMENT_RESET_HOUR,
        resetMinute: DAILY_DOCUMENT_RESET_MINUTE,
        unlimited: false,
        limit: dailyLimit,
        dailyAdd: dailyLimit,
        renewalEnabled,
        tools,
    };
}

async function ensurePdfToolQuotaBalances(env, user, usageCycle = getUsageCycle()) {
    if (!userCanUsePdfTools(user) || user.is_admin) {
        return;
    }

    const dailyLimit = getPdfToolDailyLimit(user);
    const renewalEnabled = isPdfToolQuotaRenewalEnabled(user);
    const now = new Date().toISOString();
    const currentKey = usageCycle.date;
    const result = await env.DB.prepare(`
        SELECT tool_type, available_count, last_renewal_key
        FROM pdf_tool_quota_balances
        WHERE user_id = ?
    `).bind(user.id).all();
    const balances = new Map((result.results || [])
        .filter((row) => PDF_TOOL_TYPES.has(row.tool_type))
        .map((row) => [row.tool_type, row]));

    for (const toolType of PDF_TOOL_TYPES) {
        const row = balances.get(toolType);

        if (!row) {
            await env.DB.prepare(`
                INSERT INTO pdf_tool_quota_balances (
                    user_id, tool_type, available_count, last_renewal_key, updated_at
                )
                VALUES (?, ?, ?, ?, ?)
            `).bind(user.id, toolType, renewalEnabled ? dailyLimit : 0, currentKey, now).run();
            continue;
        }

        const lastKey = String(row.last_renewal_key || "");

        if (!renewalEnabled) {
            if (lastKey !== currentKey) {
                await env.DB.prepare(`
                    UPDATE pdf_tool_quota_balances
                    SET last_renewal_key = ?, updated_at = ?
                    WHERE user_id = ? AND tool_type = ?
                `).bind(currentKey, now, user.id, toolType).run();
            }
            continue;
        }

        const missingDays = countUsageCyclesBetween(lastKey, currentKey);

        if (missingDays <= 0) {
            continue;
        }

        await env.DB.prepare(`
            UPDATE pdf_tool_quota_balances
            SET available_count = MAX(0, available_count) + ?,
                last_renewal_key = ?,
                updated_at = ?
            WHERE user_id = ? AND tool_type = ?
        `).bind(missingDays * dailyLimit, currentKey, now, user.id, toolType).run();
    }
}

function userCanUsePdfTools(user) {
    return Boolean(user?.is_admin || user?.allow_pdf_tools);
}

function getPdfToolDailyLimit(user) {
    const limit = Number(user?.pdf_tool_daily_limit);
    return Number.isInteger(limit) && limit >= 1 ? limit : DEFAULT_DAILY_PDF_TOOL_LIMIT;
}

function isPdfToolQuotaRenewalEnabled(user) {
    if (!user || user.pdf_tool_quota_renewal_enabled === undefined || user.pdf_tool_quota_renewal_enabled === null) {
        return true;
    }

    return Boolean(user.pdf_tool_quota_renewal_enabled);
}

function assertPdfToolAccessAllowed(user, toolType) {
    if (!PDF_TOOL_TYPES.has(toolType)) {
        throw httpError(400, "Ferramenta PDF invalida.");
    }

    assertDocumentAccessAllowed(user, "pdf-local");

    if (!userCanUsePdfTools(user)) {
        throw httpError(403, "Ferramentas PDF nao liberadas para este login.");
    }
}


async function processPdfToolWithRender(request, env, user) {
    const body = await readJson(request);
    const toolType = String(body.toolType || "").trim();
    const fileBase64 = String(body.fileBase64 || "").trim();
    const defaultName = toolType === "wordPdf" ? "documento.docx" : "documento.pdf";
    const fileName = String(body.fileName || defaultName).trim();
    const options = body.options && typeof body.options === "object" ? body.options : {};

    if (!SERVER_PDF_TOOL_TYPES.has(toolType)) {
        throw httpError(400, "Ferramenta PDF do servidor invalida.");
    }

    if (!fileBase64 || fileBase64.length > MAX_PDF_TOOL_BASE64_LENGTH) {
        throw httpError(400, toolType === "wordPdf"
            ? "Arquivo DOCX invalido ou grande demais para conversao."
            : "Arquivo PDF invalido ou grande demais para processamento no servidor.");
    }

    if (toolType === "wordPdf" && !/\.docx$/i.test(fileName)) {
        throw httpError(400, "A ferramenta Word para PDF aceita apenas arquivos .docx.");
    }

    assertPdfToolAccessAllowed(user, toolType);

    const renderApiUrl = env.RENDER_API_URL || "https://gerador-de-documentos-1.onrender.com";
    const renderPath = toolType === "compress"
        ? "/api/pdf/compress"
        : toolType === "ocr"
            ? "/api/pdf/ocr"
            : "/api/convert-docx-to-pdf";
    const headers = { "Content-Type": "application/json" };

    if (env.RENDER_API_SECRET) {
        headers["X-Render-Secret"] = env.RENDER_API_SECRET;
    }

    const payload = toolType === "wordPdf"
        ? {
            docxBase64: fileBase64,
            fileName,
        }
        : {
            fileBase64,
            fileName,
            level: options.level || "balanced",
            language: options.language || "por",
        };

    try {
        const response = await fetch(`${renderApiUrl}${renderPath}`, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => "");
            let detail = errorText;
            try {
                const errJson = JSON.parse(errorText);
                detail = errJson.error || errJson.message || errorText;
            } catch (_) {}
            console.error(`Erro do Render PDF ${toolType}: ${response.status} - ${detail}`);
            const friendly = toolType === "compress"
                ? "Servico de compressao falhou. Tente novamente ou use o modo local no app."
                : toolType === "wordPdf"
                    ? "A conversao real do Word para PDF falhou. Verifique o servico LibreOffice."
                    : "Servico de PDF pesquisavel falhou. Tente novamente.";
            throw httpError(502, detail ? `${friendly} (${String(detail).slice(0, 180)})` : friendly);
        }

        const result = await response.json();

        if (!result.success || !result.pdfBase64) {
            throw httpError(500, result?.error || result?.message || "Servico de PDF retornou dados invalidos.");
        }

        const pdfToolUsage = await consumePdfToolUsageForUser(env, user, toolType, request);
        await logAction(env, user.id, "process_pdf_tool", user.id, {
            toolType,
            strategy: result.strategy || (toolType === "wordPdf" ? "libreoffice" : null),
            originalBytes: result.originalBytes || null,
            outputBytes: result.outputBytes || null,
            hadText: result.hadText === true,
        }, request);

        return json({
            success: true,
            pdfBase64: result.pdfBase64,
            fileName: result.fileName || (toolType === "wordPdf"
                ? fileName.replace(/\.docx$/i, ".pdf")
                : `${toolType}.pdf`),
            message: result.message || (toolType === "wordPdf"
                ? "Word convertido para PDF preservando o documento original."
                : "PDF processado com sucesso."),
            strategy: result.strategy || (toolType === "wordPdf" ? "libreoffice" : null),
            originalBytes: result.originalBytes || null,
            outputBytes: result.outputBytes || null,
            hadText: result.hadText === true,
            pdfToolUsage,
        });
    } catch (error) {
        if (error.status) {
            throw error;
        }

        console.error("Erro ao chamar Render para ferramenta PDF:", error);
        throw httpError(502, toolType === "wordPdf"
            ? "Nao foi possivel converter o arquivo Word para PDF no servidor."
            : "Nao foi possivel processar o PDF no servidor.");
    }
}

async function previewDocumentAsPdf(request, env, user) {
    const body = await readJson(request);
    const templatePath = String(body.templatePath || "").trim();
    const docxBase64 = String(body.docxBase64 || "").trim();

    if (!templatePath || !DOCUMENT_GENERATION_TYPES.has(templatePath)) {
        throw httpError(400, "Documento invalido para visualizacao.");
    }

    if (!docxBase64 || docxBase64.length > MAX_PREVIEW_DOCX_BASE64_LENGTH) {
        throw httpError(400, "Arquivo DOCX invalido para conversao.");
    }

    await assertDocumentUsageAvailable(env, user, templatePath);

    const renderApiUrl = env.RENDER_API_URL || "https://gerador-de-documentos-1.onrender.com";

    try {
        const headers = { "Content-Type": "application/json" };

        if (env.RENDER_API_SECRET) {
            headers["X-Render-Secret"] = env.RENDER_API_SECRET;
        }

        const response = await fetch(`${renderApiUrl}/api/convert-docx-to-pdf`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                docxBase64,
                fileName: `${templatePath}.docx`,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error(`Erro do Render: ${response.status} - ${error}`);
            throw httpError(502, "Servico de conversao falhou ao gerar o PDF. Tente novamente.");
        }

        const result = await response.json();

        if (!result.success || !result.pdfBase64 || result.protected !== true) {
            throw httpError(500, "Conversao PDF protegida retornou dados invalidos.");
        }

        const documentUsage = await consumeDocumentUsageForUser(env, user, templatePath, request);
        await logAction(env, user.id, "preview_pdf", null, { documentType: templatePath }, request);

        return json({
            success: true,
            protected: true,
            pdfBase64: result.pdfBase64,
            fileName: result.fileName || `${templatePath}.pdf`,
            message: "PDF gerado com sucesso.",
            documentUsage,
        });
    } catch (error) {
        if (error.status) {
            throw error;
        }

        console.error("Erro ao chamar Render:", error);
        throw httpError(503, "Servico de conversao indisponivel. Tente novamente em alguns instantes.");
    }
}

async function requireSupportIdentity(request, env) {
    const sessionToken = getBearerToken(request) || getCookie(request, SESSION_COOKIE);

    if (sessionToken) {
        try {
            const payload = await verifySessionToken(env, sessionToken);
            const user = await getUserById(env, payload.uid);

            if (user) {
                return { user, mode: "session" };
            }
        } catch (error) {
            console.warn("Sessao normal indisponivel para suporte.", error.message);
        }
    }

    const billingToken = request.headers.get("X-Billing-Token") || "";

    if (billingToken) {
        const payload = await verifyBillingToken(env, billingToken);
        const user = await getUserById(env, payload.uid);

        if (user) {
            return { user, mode: "billing" };
        }
    }

    throw httpError(401, "Entre com seu login para enviar mensagens ou comprovantes.");
}

async function getOptionalSupportIdentity(request, env) {
    try {
        return await requireSupportIdentity(request, env);
    } catch (error) {
        return null;
    }
}

async function createSupportMessage(request, env) {
    assertRequestBodyLimit(request, MAX_SUPPORT_REQUEST_BODY_BYTES);
    const identity = await requireSupportIdentity(request, env);
    const body = await readJson(request);
    const user = identity.user;
    await assertSupportMessageRateLimit(env, user.id);
    const customerName = String(user.name || "").trim();
    const customerEmail = normalizeEmail(user.email);
    const message = String(body.message || "").trim();
    const attachment = normalizeSupportAttachment(body.attachment);

    if (!customerName || !customerEmail) {
        throw httpError(400, "Informe nome e e-mail validos para falar com o suporte.");
    }

    if (!message && !attachment) {
        throw httpError(400, "Digite uma mensagem ou anexe um comprovante.");
    }

    const saved = await insertSupportMessage(env, {
        userId: user.id,
        customerName,
        customerEmail,
        senderType: "customer",
        category: "support",
        message,
        plan: normalizePlanId(user?.plan),
        attachment,
    });

    await notifyAdminsAboutSupportMessage(env, saved, attachment);
    return json({ message: "Mensagem enviada ao suporte.", supportMessage: saved }, 201);
}

async function createPaymentProof(request, env) {
    const identity = await requireSupportIdentity(request, env);
    const body = await readJson(request);
    const user = identity.user;
    await assertSupportMessageRateLimit(env, user.id);
    const attachment = normalizeSupportAttachment(body.attachment, { required: true });
    const planId = normalizePlanId(body.plan || user.plan);

    if (!PLANS[planId]) {
        throw httpError(400, "Plano invalido.");
    }

    const saved = await insertSupportMessage(env, {
        userId: user.id,
        customerName: user.name,
        customerEmail: user.email,
        senderType: "customer",
        category: "payment_proof",
        message: String(body.message || "Comprovante enviado para analise.").trim(),
        plan: planId,
        attachment,
    });

    await logAction(env, user.id, "send_payment_proof", user.id, { plan: planId });
    await notifyAdminsAboutSupportMessage(env, saved, attachment);
    return json({ message: "Comprovante enviado. A liberacao sera analisada pelo administrador.", supportMessage: saved }, 201);
}

async function createBillingCheckout(request, env) {
    const identity = await requireSupportIdentity(request, env);
    const body = await readJson(request);
    const user = identity.user;
    const planId = normalizePlanId(body.plan || user.plan);
    const modeValue = String(body.mode || "renew").trim().toLowerCase();
    const mode = ["alterar", "change"].includes(modeValue) ? "change" : "renew";
    const plan = getPlan(planId);
    const price = BILLING_PLAN_PRICES[planId];

    if (planId === "test10c" && !user.is_admin) {
        throw httpError(404, "Plano indisponivel.");
    }

    if (!plan || !price || price.amount <= 0) {
        throw httpError(400, "Plano indisponivel para pagamento integrado.");
    }

    const now = new Date().toISOString();
    const paymentId = crypto.randomUUID();
    const externalReference = `docspace:${paymentId}:${user.id}:${planId}`;
    const localPayment = {
        id: paymentId,
        userId: user.id,
        plan: planId,
        mode,
        amount: price.amount,
        currency: price.currency,
        status: "pending",
        provider: BILLING_PROVIDER,
        externalReference,
        createdAt: now,
        updatedAt: now,
    };

    await insertBillingPayment(env, localPayment);

    if (!env.MERCADO_PAGO_ACCESS_TOKEN) {
        await logAction(env, user.id, "billing_checkout_pending_config", user.id, { paymentId, plan: planId, mode });
        return json({
            integrationPending: true,
            message: "Pagamento preparado. Configure MERCADO_PAGO_ACCESS_TOKEN no Worker para gerar o checkout real.",
            payment: publicBillingPayment(localPayment),
        }, 200);
    }

    const preference = await createMercadoPagoPreference(request, env, user, localPayment, plan, price);
    const configuredPublicKey = String(env.MERCADO_PAGO_PUBLIC_KEY || "").trim();
    const publicKeyMode = mercadoPagoCredentialMode(configuredPublicKey);
    const accessTokenMode = mercadoPagoCredentialMode(env.MERCADO_PAGO_ACCESS_TOKEN);
    const credentialModeMatch = publicKeyMode === "unknown" || accessTokenMode === "unknown" || publicKeyMode === accessTokenMode;
    const mercadoPagoPublicKey = credentialModeMatch ? configuredPublicKey : "";
    await updateBillingPayment(env, paymentId, {
        mercado_pago_preference_id: String(preference.id || ""),
        init_point: String(preference.init_point || ""),
        sandbox_init_point: String(preference.sandbox_init_point || ""),
        raw_response: safeJsonStringify(preference),
        updated_at: new Date().toISOString(),
    });

    await logAction(env, user.id, "billing_checkout_created", user.id, { paymentId, plan: planId, mode, preferenceId: preference.id });

    return json({
        message: mercadoPagoPublicKey
            ? "Pagamento criado. Finalize dentro do DocSpace. A renovacao sera feita automaticamente apos a confirmacao."
            : (!credentialModeMatch
                ? "Pagamento criado, mas a Public Key e o Access Token pertencem a ambientes diferentes. Use ambos de teste ou ambos de producao."
                : "Pagamento criado. Configure MERCADO_PAGO_PUBLIC_KEY para exibir o pagamento dentro do DocSpace."),
        checkoutUrl: preference.init_point || preference.sandbox_init_point || "",
        publicKey: mercadoPagoPublicKey,
        preferenceId: String(preference.id || ""),
        paymentBrick: Boolean(mercadoPagoPublicKey),
        payment: {
            ...publicBillingPayment(localPayment),
            mercadoPagoPreferenceId: String(preference.id || ""),
            status: "pending",
        },
    }, 201);
}

async function createBillingPixPayment(request, env) {
    const identity = await requireSupportIdentity(request, env);
    const body = await readJson(request);
    const user = identity.user;
    const planId = normalizePlanId(body.plan || user.plan);
    const modeValue = String(body.mode || "renew").trim().toLowerCase();
    const mode = ["alterar", "change"].includes(modeValue) ? "change" : "renew";
    const plan = getPlan(planId);
    const price = BILLING_PLAN_PRICES[planId];

    if (planId === "test10c" && !user.is_admin) {
        throw httpError(404, "Plano indisponivel.");
    }

    if (!plan || !price || price.amount <= 0) {
        throw httpError(400, "Plano indisponivel para Pix integrado.");
    }

    if (!env.MERCADO_PAGO_ACCESS_TOKEN) {
        throw httpError(500, "MERCADO_PAGO_ACCESS_TOKEN nao configurado no Worker.");
    }

    const now = new Date().toISOString();
    const paymentId = crypto.randomUUID();
    const externalReference = `docspace:${paymentId}:${user.id}:${planId}`;
    const localPayment = {
        id: paymentId,
        userId: user.id,
        plan: planId,
        mode,
        amount: price.amount,
        currency: price.currency,
        status: "pending",
        provider: BILLING_PROVIDER,
        externalReference,
        createdAt: now,
        updatedAt: now,
    };

    await insertBillingPayment(env, localPayment);

    const mercadoPagoPayload = buildMercadoPagoPixPayload(request, env, user, localPayment, plan, price);
    const response = await fetch(`${MERCADO_PAGO_API_BASE}/v1/payments`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
            "X-Idempotency-Key": `docspace-pix-${paymentId}`,
        },
        body: JSON.stringify(mercadoPagoPayload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message = data.message || data.error || data.cause?.[0]?.description || "Nao foi possivel gerar o Pix no Mercado Pago.";
        await updateBillingPayment(env, paymentId, {
            status: "error",
            raw_response: safeJsonStringify(data),
            updated_at: new Date().toISOString(),
        });
        throw httpError(502, message);
    }

    await processMercadoPagoPayment(env, data);
    const current = await getBillingPaymentById(env, paymentId) || localPayment;
    const transactionData = data?.point_of_interaction?.transaction_data || {};
    const qrCode = String(transactionData.qr_code || "").trim();
    const qrCodeBase64 = String(transactionData.qr_code_base64 || "").trim();
    const qrCodeImage = qrCodeBase64
        ? (qrCodeBase64.startsWith("data:image") ? qrCodeBase64 : `data:image/png;base64,${qrCodeBase64}`)
        : "";

    if (!qrCode && !qrCodeImage) {
        console.warn("Mercado Pago nao retornou QR Code Pix para o pagamento", { paymentId, mercadoPagoId: data?.id });
    }

    await logAction(env, user.id, "billing_pix_created", user.id, {
        paymentId,
        mercadoPagoPaymentId: data?.id || "",
        plan: planId,
        mode,
    });

    return json({
        message: "Pix gerado. Escaneie o QR Code ou copie o codigo Pix. A renovacao sera automatica apos a confirmacao.",
        pix: {
            qrCode,
            qrCodeBase64,
            qrCodeImage,
            expiresAt: transactionData.date_of_expiration || data.date_of_expiration || "",
        },
        payment: {
            ...publicBillingPayment(rowToBillingPayment(current)),
            mercadoPagoPaymentId: String(data?.id || current.mercado_pago_payment_id || ""),
            status: normalizeMercadoPagoStatus(data?.status || current.status || "pending"),
        },
    }, 201);
}

function buildMercadoPagoPixPayload(request, env, user, payment, plan, price) {
    const email = String(user.email || "").trim();

    if (!email) {
        throw httpError(400, "E-mail do pagador nao informado.");
    }

    const nameParts = String(user.name || "").trim().split(/\s+/).filter(Boolean);
    const firstName = nameParts.shift() || "Cliente";
    const lastName = nameParts.join(" ") || "DocSpace";

    return {
        transaction_amount: Number(price.amount),
        description: price.title || `DocSpace - ${plan?.label || payment.plan}`,
        payment_method_id: "pix",
        payer: {
            email,
            first_name: firstName,
            last_name: lastName,
            ...(String(user.billing_document || "").replace(/\D/g, "").length === 11 ? {
                identification: { type: "CPF", number: String(user.billing_document).replace(/\D/g, "") },
            } : {}),
        },
        external_reference: payment.externalReference,
        metadata: {
            local_payment_id: payment.id,
            user_id: payment.userId,
            plan: payment.plan,
            mode: payment.mode,
        },
        notification_url: buildMercadoPagoWebhookUrl(request, env),
        statement_descriptor: "DOCSPACE",
    };
}

async function createMercadoPagoBrickPayment(request, env) {
    const identity = await requireSupportIdentity(request, env);
    const user = identity.user;

    if (!env.MERCADO_PAGO_ACCESS_TOKEN) {
        throw httpError(500, "MERCADO_PAGO_ACCESS_TOKEN nao configurado no Worker.");
    }

    const body = await readJson(request);
    const paymentId = String(body.paymentId || "").trim();
    const formData = body.formData && typeof body.formData === "object" ? body.formData : {};

    if (!paymentId) {
        throw httpError(400, "Pagamento local nao informado.");
    }

    const row = await getBillingPaymentById(env, paymentId);

    if (!row || row.user_id !== user.id) {
        throw httpError(404, "Pagamento nao encontrado.");
    }

    if (row.plan === "test10c" && !user.is_admin) {
        throw httpError(404, "Pagamento nao encontrado.");
    }

    if (row.status === "approved") {
        return buildBillingPaymentStatusResponse(request, env, user, row, "Pagamento ja aprovado. Seu plano esta liberado.");
    }

    const mercadoPagoPayload = buildMercadoPagoBrickPaymentPayload(request, env, user, row, formData);
    const response = await fetch(`${MERCADO_PAGO_API_BASE}/v1/payments`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
            "X-Idempotency-Key": `docspace-brick-${paymentId}-${crypto.randomUUID()}`,
        },
        body: JSON.stringify(mercadoPagoPayload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message = data.message || data.error || data.cause?.[0]?.description || "Nao foi possivel processar o pagamento no Mercado Pago.";
        throw httpError(502, message);
    }

    await processMercadoPagoPayment(env, data);
    const current = await getBillingPaymentById(env, paymentId) || row;

    const boletoUrl = String(data?.transaction_details?.external_resource_url || data?.point_of_interaction?.transaction_data?.ticket_url || "").trim();
    const boletoLine = String(
        data?.barcode?.content ||
        data?.point_of_interaction?.transaction_data?.digitable_line ||
        data?.point_of_interaction?.transaction_data?.barcode_content ||
        ""
    ).trim();

    return buildBillingPaymentStatusResponse(
        request,
        env,
        user,
        current,
        current.status === "approved"
            ? "Pagamento aprovado. Seu plano foi renovado e o acesso foi liberado."
            : "Pagamento enviado ao Mercado Pago. Aguarde a confirmacao automatica.",
        boletoUrl || boletoLine ? { ticket: { url: boletoUrl, digitableLine: boletoLine } } : {}
    );
}

function buildMercadoPagoBrickPaymentPayload(request, env, user, row, formData) {
    const paymentMethodId = String(formData.payment_method_id || formData.paymentMethodId || "").trim();

    if (!paymentMethodId) {
        throw httpError(400, "Meio de pagamento nao informado pelo checkout.");
    }

    const plan = getPlan(row.plan);
    const price = BILLING_PLAN_PRICES[row.plan] || {};
    const payerFromBrick = formData.payer && typeof formData.payer === "object" ? formData.payer : {};
    const billingCpf = String(user.billing_document || "").replace(/\D/g, "");
    const payer = {
        ...payerFromBrick,
        email: String(payerFromBrick.email || user.email || "").trim(),
        ...(!payerFromBrick.identification && billingCpf.length === 11 ? {
            identification: { type: "CPF", number: billingCpf },
        } : {}),
    };

    if (!payer.email) {
        throw httpError(400, "E-mail do pagador nao informado.");
    }

    const payload = {
        transaction_amount: Number(row.amount),
        description: price.title || `DocSpace - ${plan?.label || row.plan}`,
        payment_method_id: paymentMethodId,
        payer,
        external_reference: row.external_reference,
        metadata: {
            local_payment_id: row.id,
            user_id: row.user_id,
            plan: row.plan,
            mode: row.mode,
        },
        notification_url: buildMercadoPagoWebhookUrl(request, env),
        statement_descriptor: "DOCSPACE",
    };

    if (formData.token) {
        payload.token = String(formData.token);
    }

    if (formData.issuer_id) {
        payload.issuer_id = String(formData.issuer_id);
    }

    if (formData.installments) {
        payload.installments = Number(formData.installments);
    }

    if (formData.additional_info && typeof formData.additional_info === "object") {
        payload.additional_info = formData.additional_info;
    }

    return payload;
}

async function buildBillingPaymentStatusResponse(request, env, user, row, message, extra = {}) {
    const headers = new Headers();
    let sessionToken = "";
    let publicUserData = null;

    if (row.status === "approved") {
        const refreshedUser = await getUserById(env, user.id);
        if (refreshedUser) {
            sessionToken = await createSessionToken(env, refreshedUser);
            headers.append("Set-Cookie", buildSessionCookie(request, sessionToken));
            publicUserData = publicUser(refreshedUser);
        }
    }

    return json({
        message,
        payment: publicBillingPayment(rowToBillingPayment(row)),
        user: publicUserData,
        sessionToken,
        ...extra,
    }, 200, headers);
}

async function getBillingPaymentStatus(request, env, paymentId) {
    const identity = await requireSupportIdentity(request, env);
    const row = await getBillingPaymentById(env, paymentId);

    if (!row || row.user_id !== identity.user.id) {
        throw httpError(404, "Pagamento nao encontrado.");
    }

    let current = row;

    if (env.MERCADO_PAGO_ACCESS_TOKEN && row.mercado_pago_payment_id && row.status !== "approved") {
        const mercadoPagoPayment = await fetchMercadoPagoPayment(env, row.mercado_pago_payment_id);
        await processMercadoPagoPayment(env, mercadoPagoPayment);
        current = await getBillingPaymentById(env, paymentId) || row;
    }

    const approved = current.status === "approved";
    const headers = new Headers();
    let sessionToken = "";
    let publicUserData = null;

    if (approved) {
        const refreshedUser = await getUserById(env, identity.user.id);
        if (refreshedUser) {
            sessionToken = await createSessionToken(env, refreshedUser);
            headers.append("Set-Cookie", buildSessionCookie(request, sessionToken));
            publicUserData = publicUser(refreshedUser);
        }
    }

    return json({
        message: approved
            ? "Pagamento aprovado. Seu plano foi renovado e o acesso foi liberado."
            : "Pagamento ainda nao confirmado. Aguarde alguns instantes e verifique novamente.",
        payment: publicBillingPayment(rowToBillingPayment(current)),
        user: publicUserData,
        sessionToken,
    }, 200, headers);
}

async function handleMercadoPagoWebhook(request, env) {
    let payload = {};

    try {
        payload = await request.json();
    } catch (error) {
        payload = {};
    }

    const url = new URL(request.url);

    const paymentId =
        payload?.data?.id ||
        url.searchParams.get("data.id") ||
        url.searchParams.get("id");

    const type =
        payload?.type ||
        url.searchParams.get("type");

    const action =
        payload?.action ||
        url.searchParams.get("action");

    console.log("Webhook Mercado Pago recebido:", {
        paymentId,
        type,
        action,
        payload,
    });

    if (type && type !== "payment") {
        return json({
            received: true,
            ignored: true,
            message: "Evento ignorado porque não é pagamento.",
        });
    }

    if (!paymentId) {
        return json({
            received: true,
            ignored: true,
            message: "Webhook recebido sem ID de pagamento.",
        });
    }

    const webhookSecret = String(env.MERCADO_PAGO_WEBHOOK_SECRET || "").trim();
    if (!webhookSecret) {
        throw httpError(503, "Webhook do Mercado Pago ainda nao configurado.");
    }

    if (!(await verifyMercadoPagoWebhookSignature(request, String(paymentId), webhookSecret))) {
        throw httpError(401, "Assinatura do webhook invalida.");
    }

    try {
        const mercadoPagoPayment = await fetchMercadoPagoPayment(env, paymentId);
        const result = await processMercadoPagoPayment(env, mercadoPagoPayment);

        return json({
            received: true,
            processed: true,
            paymentId,
            result,
            message: result?.message || "Pagamento processado com sucesso.",
        });
    } catch (error) {
        console.error("Erro ao processar pagamento Mercado Pago:", error);

        return json({
            received: true,
            processed: false,
            paymentId,
            message: "Webhook recebido, mas o pagamento ainda não foi processado.",
            error: error.message,
        });
    }
}

async function createMercadoPagoPreference(request, env, user, payment, plan, price) {
    const response = await fetch(`${MERCADO_PAGO_API_BASE}/checkout/preferences`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            items: [{
                title: price.title || `DocSpace - ${plan.label}`,
                quantity: 1,
                currency_id: price.currency,
                unit_price: Number(price.amount),
            }],
            payer: {
                name: user.name,
                email: user.email,
                ...(String(user.billing_document || "").replace(/\D/g, "").length === 11 ? {
                    identification: { type: "CPF", number: String(user.billing_document).replace(/\D/g, "") },
                } : {}),
            },
            external_reference: payment.externalReference,
            metadata: {
                local_payment_id: payment.id,
                user_id: user.id,
                plan: payment.plan,
                mode: payment.mode,
            },
            notification_url: buildMercadoPagoWebhookUrl(request, env),
            back_urls: buildMercadoPagoBackUrls(request, env),
            auto_return: "approved",
            statement_descriptor: "DOCSPACE",
        }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw httpError(502, data.message || data.error || "Nao foi possivel criar o pagamento no Mercado Pago.");
    }

    return data;
}

async function fetchMercadoPagoPayment(env, paymentId) {
    const response = await fetch(`${MERCADO_PAGO_API_BASE}/v1/payments/${encodeURIComponent(paymentId)}`, {
        headers: {
            "Authorization": `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw httpError(502, data.message || data.error || "Nao foi possivel consultar o pagamento no Mercado Pago.");
    }

    return data;
}

async function processMercadoPagoPayment(env, mercadoPagoPayment) {
    const externalReference = String(mercadoPagoPayment.external_reference || "").trim();
    const mercadoPagoPaymentId = String(mercadoPagoPayment.id || "").trim();
    const status = normalizeMercadoPagoStatus(mercadoPagoPayment.status);
    const row = externalReference
        ? await getBillingPaymentByExternalReference(env, externalReference)
        : await getBillingPaymentByMercadoPagoId(env, mercadoPagoPaymentId);

    if (!row) {
        return { message: "Pagamento Mercado Pago recebido, mas sem cobranca local correspondente.", status };
    }

    const now = new Date().toISOString();
    await updateBillingPayment(env, row.id, {
        status,
        mercado_pago_payment_id: mercadoPagoPaymentId,
        raw_response: safeJsonStringify(mercadoPagoPayment),
        updated_at: now,
        approved_at: status === "approved" ? (row.approved_at || now) : row.approved_at,
    });

    if (status !== "approved") {
        return { message: `Pagamento atualizado com status ${status}.`, status };
    }

    if (row.status !== "approved") {
        await renewUserPlanAfterPayment(env, row.user_id, row.plan, row.id, mercadoPagoPaymentId);
    }

    return { message: "Pagamento aprovado. Plano renovado automaticamente.", status: "approved" };
}

async function renewUserPlanAfterPayment(env, userId, planId, localPaymentId, mercadoPagoPaymentId) {
    const plan = getPlan(planId);

    if (!plan) {
        throw httpError(400, "Plano de pagamento invalido.");
    }

    const now = new Date().toISOString();
    await env.DB.prepare(`
        UPDATE users
        SET status = 'active',
            plan = ?,
            plan_label = ?,
            expires_at = ?,
            updated_at = ?
        WHERE id = ?
    `).bind(planId, plan.label, calculateExpiration(planId), now, userId).run();

    const renewedUser = await getUserById(env, userId);
    await resetUserQuotasAfterPlanRenewal(env, renewedUser || { id: userId, plan: planId });
    await logAction(env, userId, "mercadopago_payment_approved", userId, { paymentId: localPaymentId, mercadoPagoPaymentId, plan: planId });
    await notifyPaymentApproved(env, renewedUser, planId, localPaymentId, mercadoPagoPaymentId);
}


async function notifyPaymentApproved(env, user, planId, localPaymentId, mercadoPagoPaymentId) {
    if (!user?.email) return;
    const payment = await getBillingPaymentById(env, localPaymentId).catch(() => null);
    const amount = Number(payment?.amount || BILLING_PLAN_PRICES[planId]?.amount || 0);
    const formattedAmount = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount);
    const plan = getPlan(planId);
    const subject = "Pagamento confirmado - DocSpace";
    const text = [
        `Olá, ${user.name || "cliente"}.`,
        "",
        "Pagamento confirmado.",
        `Plano: ${plan?.label || planId}`,
        `Valor: ${formattedAmount}`,
        `Identificação do pagamento: ${mercadoPagoPaymentId || localPaymentId}`,
        `Acesso liberado até: ${user.expires_at || "conforme o plano"}`,
        "",
        `Entre no DocSpace: ${String(env.PUBLIC_APP_URL || "https://docspace-web.pages.dev")}`,
        "Este e-mail é uma confirmação de pagamento e ativação de acesso; não substitui documento fiscal quando aplicável."
    ].join("\n");
    await sendNotificationEmail(env, {
        to: user.email,
        subject,
        text,
        html: buildSupportEmailHtml(subject, text),
    });
}

async function resetUserQuotasAfterPlanRenewal(env, user) {
    if (!user?.id) {
        return;
    }

    const now = new Date().toISOString();
    const usageCycle = getUsageCycle();

    if (isDocumentUsageLimited(user)) {
        await env.DB.prepare("DELETE FROM document_generation_usage WHERE user_id = ?").bind(user.id).run();
    }

    if (userCanUsePdfTools(user) && !user.is_admin) {
        const dailyLimit = getPdfToolDailyLimit(user);
        for (const toolType of PDF_TOOL_TYPES) {
            await env.DB.prepare(`
                INSERT INTO pdf_tool_quota_balances (user_id, tool_type, available_count, last_renewal_key, updated_at)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(user_id, tool_type) DO UPDATE SET
                    available_count = excluded.available_count,
                    last_renewal_key = excluded.last_renewal_key,
                    updated_at = excluded.updated_at
            `).bind(user.id, toolType, dailyLimit, usageCycle.date, now).run();
        }
    }
}

async function insertBillingPayment(env, payment) {
    await env.DB.prepare(`
        INSERT INTO billing_payments (
            id, user_id, plan, mode, amount, currency, status, provider, external_reference, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
        payment.id,
        payment.userId,
        payment.plan,
        payment.mode,
        payment.amount,
        payment.currency,
        payment.status,
        payment.provider,
        payment.externalReference,
        payment.createdAt,
        payment.updatedAt
    ).run();
}

async function updateBillingPayment(env, paymentId, fields) {
    const entries = Object.entries(fields).filter(([, value]) => value !== undefined);

    if (entries.length === 0) {
        return;
    }

    await env.DB.prepare(`UPDATE billing_payments SET ${entries.map(([key]) => `${key} = ?`).join(", ")} WHERE id = ?`)
        .bind(...entries.map(([, value]) => value ?? ""), paymentId)
        .run();
}

async function getBillingPaymentById(env, id) {
    return env.DB.prepare("SELECT * FROM billing_payments WHERE id = ?").bind(id).first();
}

async function getBillingPaymentByExternalReference(env, externalReference) {
    return env.DB.prepare("SELECT * FROM billing_payments WHERE external_reference = ?").bind(externalReference).first();
}

async function getBillingPaymentByMercadoPagoId(env, mercadoPagoPaymentId) {
    return env.DB.prepare("SELECT * FROM billing_payments WHERE mercado_pago_payment_id = ?").bind(mercadoPagoPaymentId).first();
}

function rowToBillingPayment(row) {
    return {
        id: row.id,
        userId: row.user_id,
        plan: row.plan,
        mode: row.mode,
        amount: Number(row.amount || 0),
        currency: row.currency,
        status: row.status,
        provider: row.provider,
        externalReference: row.external_reference,
        mercadoPagoPreferenceId: row.mercado_pago_preference_id,
        mercadoPagoPaymentId: row.mercado_pago_payment_id,
        checkoutUrl: row.init_point || row.sandbox_init_point || "",
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        approvedAt: row.approved_at,
    };
}

function publicBillingPayment(payment) {
    return {
        id: payment.id,
        plan: normalizePlanId(payment.plan),
        mode: payment.mode,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        provider: payment.provider,
        checkoutUrl: payment.checkoutUrl || payment.initPoint || "",
        mercadoPagoPreferenceId: payment.mercadoPagoPreferenceId || "",
        mercadoPagoPaymentId: payment.mercadoPagoPaymentId || "",
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
        approvedAt: payment.approvedAt || "",
    };
}

function normalizeMercadoPagoStatus(status) {
    const value = String(status || "pending").trim().toLowerCase();
    if (["approved", "authorized", "pending", "in_process", "rejected", "cancelled", "refunded", "charged_back"].includes(value)) {
        return value;
    }
    return value || "pending";
}

function buildMercadoPagoWebhookUrl(request, env) {
    const configured = String(env.MERCADO_PAGO_WEBHOOK_URL || "").trim();
    if (/^https:\/\//i.test(configured)) {
        return configured;
    }

    const url = new URL(request.url);
    return `${url.origin}/api/billing/mercadopago/webhook`;
}

function buildMercadoPagoBackUrls(request, env) {
    const appUrl = String(env.PUBLIC_APP_URL || request.headers.get("Origin") || new URL(request.url).origin).replace(/\/$/, "");
    return {
        success: `${appUrl}/?payment=success`,
        pending: `${appUrl}/?payment=pending`,
        failure: `${appUrl}/?payment=failure`,
    };
}

async function verifyMercadoPagoWebhookSignature(request, paymentId, secret) {
    const signatureHeader = request.headers.get("x-signature") || "";
    const requestId = request.headers.get("x-request-id") || "";
    const parts = Object.fromEntries(signatureHeader.split(",").map((part) => {
        const [key, value] = part.trim().split("=", 2);
        return [key, value];
    }).filter(([key, value]) => key && value));
    const ts = parts.ts || "";
    const v1 = parts.v1 || "";

    if (!requestId || !ts || !v1) {
        return false;
    }

    const manifest = `id:${paymentId};request-id:${requestId};ts:${ts};`;
    const key = await crypto.subtle.importKey("raw", utf8(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const signature = await crypto.subtle.sign("HMAC", key, utf8(manifest));
    const expected = bytesToHex(new Uint8Array(signature));
    return constantTimeEqual(utf8(expected), utf8(v1.toLowerCase()));
}

function bytesToHex(bytes) {
    return Array.from(bytes).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function safeJsonStringify(value) {
    try {
        const text = JSON.stringify(value || {});
        return text.length > 50000 ? text.slice(0, 50000) : text;
    } catch (error) {
        return "{}";
    }
}

async function createAdminSupportMessage(request, env, admin) {
    const body = await readJson(request);
    const customerEmail = normalizeEmail(body.email);
    const message = String(body.message || "").trim();

    if (!customerEmail || !message) {
        throw httpError(400, "Informe o e-mail da conversa e a mensagem.");
    }

    const user = await getUserByEmail(env, customerEmail);
    const saved = await insertSupportMessage(env, {
        userId: user?.id || null,
        customerName: String(user?.name || body.name || customerEmail).trim(),
        customerEmail,
        senderType: "admin",
        category: "support",
        message,
        plan: normalizePlanId(user?.plan),
        attachment: null,
    });

    await logAction(env, admin.id, "reply_support", user?.id || null, { email: customerEmail });
    await notifyCustomerAboutAdminReply(env, saved, admin);
    return json({ message: "Resposta enviada.", supportMessage: saved }, 201);
}

async function notifyAdminsAboutSupportMessage(env, message, attachment) {
    const recipients = await getAdminNotificationEmails(env);

    if (recipients.length === 0) {
        console.warn("Email de administrador nao configurado para notificacoes de suporte.");
        return;
    }

    const isProof = message.category === "payment_proof";
    const subject = isProof
        ? `Novo comprovante de pagamento - ${message.customerName}`
        : `Nova mensagem de suporte - ${message.customerName}`;
    const planLabel = message.plan ? (getPlan(message.plan)?.label || message.plan) : "Nao informado";
    const text = [
        isProof ? "Novo comprovante recebido." : "Nova mensagem recebida no atendimento.",
        "",
        `Cliente: ${message.customerName}`,
        `E-mail: ${message.customerEmail}`,
        `Plano: ${planLabel}`,
        attachment?.name ? `Anexo: ${attachment.name}` : "Anexo: nenhum",
        "",
        "Mensagem:",
        message.message || "(sem texto)",
        "",
        "Acesse o painel administrador para responder e consultar o historico."
    ].join("\n");

    await sendNotificationEmail(env, {
        to: recipients,
        replyTo: message.customerEmail,
        subject,
        text,
        html: buildSupportEmailHtml(subject, text),
        attachment,
    });
}

async function notifyCustomerAboutAdminReply(env, message, admin) {
    const subject = "Resposta do atendimento - DocSpace";
    const text = [
        `O administrador respondeu sua conversa, ${message.customerName}.`,
        "",
        "Mensagem:",
        message.message,
        "",
        "Voce tambem pode abrir o atendimento no sistema para acompanhar o historico."
    ].join("\n");

    await sendNotificationEmail(env, {
        to: message.customerEmail,
        replyTo: admin?.email,
        subject,
        text,
        html: buildSupportEmailHtml(subject, text),
    });
}

async function getAdminNotificationEmails(env) {
    const configured = parseEmailList(env.SUPPORT_ADMIN_EMAILS || env.SUPPORT_ADMIN_EMAIL || env.ADMIN_EMAILS || env.ADMIN_EMAIL);

    if (configured.length > 0) {
        return configured;
    }

    try {
        const result = await env.DB.prepare(`
            SELECT email
            FROM users
            WHERE is_admin = 1
              AND status != 'blocked'
            ORDER BY email COLLATE NOCASE
        `).all();

        return (result.results || [])
            .map((row) => normalizeEmail(row.email))
            .filter(Boolean);
    } catch (error) {
        console.warn("Nao foi possivel buscar e-mails dos administradores.", error);
        return [];
    }
}

async function sendNotificationEmail(env, options) {
    if (hasEmailJsConfig(env) && await sendEmailJsNotification(env, options)) {
        return true;
    }

    if (!env.EMAIL || typeof env.EMAIL.send !== "function") {
        console.warn("Binding EMAIL nao configurado. Notificacao por e-mail ignorada.");
        return false;
    }

    const fromEmail = normalizeEmail(env.EMAIL_FROM_ADDRESS || env.SUPPORT_EMAIL_FROM || env.EMAIL_FROM);

    if (!fromEmail) {
        console.warn("EMAIL_FROM_ADDRESS nao configurado. Notificacao por e-mail ignorada.");
        return false;
    }

    const recipients = Array.isArray(options.to) ? options.to : [options.to];
    const to = recipients.map(normalizeEmail).filter(Boolean);

    if (to.length === 0) {
        return false;
    }

    const payload = {
        to,
        from: {
            email: fromEmail,
            name: String(env.EMAIL_FROM_NAME || "DocSpace"),
        },
        subject: String(options.subject || "Atendimento - DocSpace").slice(0, 160),
        text: options.text || "Nova atualizacao no atendimento.",
        html: options.html || buildSupportEmailHtml(options.subject, options.text || ""),
    };
    const replyTo = normalizeEmail(options.replyTo);

    if (replyTo) {
        payload.replyTo = replyTo;
    }

    if (options.attachment?.data) {
        payload.attachments = [{
            content: base64Decode(options.attachment.data),
            filename: options.attachment.name || "comprovante",
            type: options.attachment.type || "application/octet-stream",
            disposition: "attachment",
        }];
    }

    try {
        await env.EMAIL.send(payload);
        return true;
    } catch (error) {
        console.warn("Falha ao enviar notificacao por e-mail.", error);
        return false;
    }
}

function hasEmailJsConfig(env) {
    return Boolean(env.EMAILJS_SERVICE_ID && env.EMAILJS_TEMPLATE_ID && env.EMAILJS_PUBLIC_KEY);
}

async function sendEmailJsNotification(env, options) {
    const recipients = (Array.isArray(options.to) ? options.to : [options.to])
        .map(normalizeEmail)
        .filter(Boolean);

    if (recipients.length === 0) {
        return false;
    }

    const recipientList = recipients.join(",");
    const replyTo = normalizeEmail(options.replyTo) || normalizeEmail(env.EMAILJS_REPLY_TO) || normalizeEmail(env.SUPPORT_ADMIN_EMAIL);
    const fromName = String(env.EMAIL_FROM_NAME || "DocSpace");
    const subject = String(options.subject || "Atendimento - DocSpace").slice(0, 160);
    const attachmentName = options.attachment?.name || "";
    const messageText = attachmentName
        ? `${options.text || "Nova atualizacao no atendimento."}\n\nAnexo recebido no sistema: ${attachmentName}\nAcesse o painel administrador para baixar o arquivo salvo no D1.`
        : (options.text || "Nova atualizacao no atendimento.");

    const payload = {
        service_id: String(env.EMAILJS_SERVICE_ID),
        template_id: String(env.EMAILJS_TEMPLATE_ID),
        user_id: String(env.EMAILJS_PUBLIC_KEY),
        template_params: {
            to_email: recipientList,
            to_name: recipientList,
            email: recipientList,
            user_email: recipientList,
            reply_to: replyTo,
            from_email: replyTo,
            from_name: fromName,
            subject,
            title: subject,
            message: messageText,
            html_message: buildSupportEmailHtml(subject, messageText),
        },
    };

    if (env.EMAILJS_PRIVATE_KEY) {
        payload.accessToken = String(env.EMAILJS_PRIVATE_KEY);
    }

    try {
        const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.warn("EmailJS recusou a notificacao.", response.status, await response.text());
            return false;
        }

        return true;
    } catch (error) {
        console.warn("Falha ao enviar notificacao pelo EmailJS.", error);
        return false;
    }
}
function parseEmailList(value) {
    return String(value || "")
        .split(/[;,\s]+/)
        .map(normalizeEmail)
        .filter(Boolean);
}

function buildSupportEmailHtml(title, text) {
    const safeTitle = escapeHtml(title || "Atendimento");
    const safeText = escapeHtml(text || "").replace(/\n/g, "<br>");

    return `<!DOCTYPE html><html lang="pt-BR"><body style="margin:0;background:#f3f6fb;font-family:Arial,sans-serif;color:#102033;"><div style="max-width:620px;margin:0 auto;padding:28px 18px;"><div style="background:#ffffff;border:1px solid #d9e3f0;border-radius:14px;padding:24px;"><p style="margin:0 0 8px;color:#2563eb;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">DocSpace</p><h1 style="margin:0 0 18px;font-size:22px;line-height:1.25;">${safeTitle}</h1><p style="margin:0;font-size:15px;line-height:1.6;">${safeText}</p></div></div></body></html>`;
}

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
async function insertSupportMessage(env, data) {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const attachment = data.attachment || {};

    await env.DB.prepare(`
        INSERT INTO support_messages (
            id, user_id, customer_name, customer_email, sender_type, category,
            message, plan, attachment_name, attachment_type, attachment_data, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
        id,
        data.userId,
        data.customerName,
        data.customerEmail,
        data.senderType,
        data.category,
        data.message,
        data.plan || "",
        attachment.name || "",
        attachment.type || "",
        attachment.data || "",
        createdAt
    ).run();

    return publicSupportMessage({
        id,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        sender_type: data.senderType,
        category: data.category,
        message: data.message,
        plan: data.plan || "",
        attachment_name: attachment.name || "",
        attachment_type: attachment.type || "",
        created_at: createdAt,
    });
}

async function listSupportMessages(env, user) {
    const result = await env.DB.prepare(`
        SELECT id, customer_name, customer_email, sender_type, category, message, plan,
               attachment_name, attachment_type, created_at
        FROM support_messages
        WHERE user_id = ? OR customer_email = ?
        ORDER BY created_at ASC
    `).bind(user.id, user.email).all();

    return (result.results || []).map(publicSupportMessage);
}

async function listAdminSupportMessages(env) {
    const result = await env.DB.prepare(`
        SELECT id, customer_name, customer_email, sender_type, category, message, plan,
               attachment_name, attachment_type, created_at
        FROM support_messages
        ORDER BY created_at DESC
        LIMIT 300
    `).all();

    return (result.results || []).map(publicSupportMessage);
}

async function downloadSupportAttachment(request, env, id) {
    const identity = await requireSupportIdentity(request, env);
    const row = await env.DB.prepare(`
        SELECT user_id, customer_email, attachment_name, attachment_type, attachment_data
        FROM support_messages
        WHERE id = ?
    `).bind(id).first();

    if (!row || !row.attachment_data) {
        throw httpError(404, "Comprovante nao encontrado.");
    }

    if (!identity.user.is_admin && row.user_id !== identity.user.id && row.customer_email !== identity.user.email) {
        throw httpError(403, "Voce nao pode acessar este comprovante.");
    }

    const headers = new Headers();
    headers.set("Content-Type", row.attachment_type || "application/octet-stream");
    headers.set("Content-Disposition", `attachment; filename="${sanitizeFilename(row.attachment_name || "comprovante")}"`);
    headers.set("Cache-Control", "no-store");
    return new Response(base64Decode(row.attachment_data), { status: 200, headers });
}

async function assertSupportMessageRateLimit(env, userId) {
    const cutoff = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const row = await env.DB.prepare(`
        SELECT COUNT(*) AS total
        FROM support_messages
        WHERE user_id = ? AND created_at >= ?
    `).bind(userId, cutoff).first();
    if (Number(row?.total || 0) >= SUPPORT_MESSAGE_HOURLY_LIMIT) {
        throw httpError(429, "Limite de mensagens atingido. Tente novamente em uma hora.");
    }
}

function normalizeSupportAttachment(rawAttachment, options = {}) {
    if (!rawAttachment) {
        if (options.required) {
            throw httpError(400, "Anexe o comprovante de pagamento.");
        }

        return null;
    }

    const name = sanitizeFilename(String(rawAttachment.name || "comprovante"));
    const type = String(rawAttachment.type || "").toLowerCase();
    const data = String(rawAttachment.data || "").replace(/^data:[^;]+;base64,/, "");
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    const estimatedBytes = Math.ceil(data.length * 0.75);

    if (!allowedTypes.includes(type)) {
        throw httpError(400, "Envie o comprovante em JPG, PNG ou PDF.");
    }

    if (!data || estimatedBytes > MAX_SUPPORT_ATTACHMENT_BYTES) {
        throw httpError(400, "O comprovante deve ter no maximo 1,5 MB.");
    }

    return { name, type, data };
}

function sanitizeFilename(value) {
    return String(value || "arquivo").replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100);
}

function publicSupportMessage(row) {
    return {
        id: row.id,
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        senderType: row.sender_type,
        category: row.category,
        message: row.message,
        plan: normalizePlanId(row.plan),
        attachmentName: row.attachment_name || "",
        attachmentType: row.attachment_type || "",
        createdAt: row.created_at,
    };
}

function assertRequestBodyLimit(request, maxBytes) {
    const contentLength = Number(request.headers.get("content-length") || 0);

    if (contentLength && contentLength > maxBytes) {
        throw httpError(413, "A solicitação é muito grande.");
    }
}

async function listUsers(env) {
    // Consulta compatível com bancos antigos: seleciona somente colunas já existentes.
    const schema = await env.DB.prepare("PRAGMA table_info(users)").all();
    const existing = new Set((schema.results || []).map((column) => column.name));
    const desired = [
        "id", "name", "email", "plan", "plan_label", "status", "expires_at",
        "is_admin", "is_verified", "allow_liquid_glass", "daily_document_limit",
        "daily_quota_renewal_enabled", "allow_pdf_tools", "pdf_tool_daily_limit",
        "pdf_tool_quota_renewal_enabled", "allowed_document_types", "avatar_data_url",
        "notes", "created_at", "updated_at", "last_login_at"
    ];
    const columns = desired.filter((column) => existing.has(column));
    if (!columns.includes("id") || !columns.includes("email")) {
        throw httpError(500, "A tabela users do D1 está incompleta.");
    }
    const result = await env.DB.prepare(`SELECT ${columns.join(", ")} FROM users ORDER BY email COLLATE NOCASE`).all();
    return (result.results || []).map(publicUser);
}

async function createManagedUser(env, body, actor, request = null) {
    const clean = cleanUserInput(body, { requirePassword: true });
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const passwordHash = await hashPassword(clean.password);
    const expiresAt = clean.expiresAt || calculateExpiration(clean.plan);
    const plan = getPlan(clean.plan);

    try {
        await env.DB.prepare(`
            INSERT INTO users (
                id, name, email, password_hash, plan, plan_label, status,
                expires_at, is_admin, is_verified, allow_liquid_glass, daily_document_limit,
                daily_quota_renewal_enabled, allow_pdf_tools, pdf_tool_daily_limit,
                pdf_tool_quota_renewal_enabled, allowed_document_types, notes, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            id,
            clean.name,
            clean.email,
            passwordHash,
            clean.plan,
            plan.label,
            clean.status,
            expiresAt,
            clean.isAdmin ? 1 : 0,
            clean.isVerified ? 1 : 0,
            clean.allowLiquidGlass ? 1 : 0,
            clean.dailyDocumentLimit,
            clean.dailyQuotaRenewalEnabled ? 1 : 0,
            clean.allowPdfTools ? 1 : 0,
            clean.pdfToolDailyLimit,
            clean.pdfToolQuotaRenewalEnabled ? 1 : 0,
            JSON.stringify(clean.allowedDocumentTypes),
            clean.notes,
            now,
            now
        ).run();
    } catch (error) {
        if (String(error.message || "").toLowerCase().includes("unique")) {
            throw httpError(409, "Esse e-mail ja esta cadastrado.");
        }

        throw error;
    }

    await logAction(env, actor?.id || null, "create_user", id, { email: clean.email, plan: clean.plan, allowedDocuments: clean.allowedDocumentTypes.length }, request);
    return publicUser(await getUserById(env, id));
}

async function updateManagedUser(env, id, body, actor, request = null) {
    const existing = await getUserById(env, id);

    if (!existing) {
        throw httpError(404, "Usuario nao encontrado.");
    }

    const normalizedBody = Object.prototype.hasOwnProperty.call(body, "isAdmin")
        ? body
        : { ...body, isAdmin: Boolean(existing.is_admin) };
    const clean = cleanUserInput(normalizedBody, { requirePassword: false });

    if (existing.is_admin && !clean.isAdmin) {
        const adminCount = await env.DB.prepare("SELECT COUNT(*) AS total FROM users WHERE is_admin = 1").first();
        if (Number(adminCount?.total || 0) <= 1) {
            throw httpError(409, "Nao e possivel remover o ultimo administrador.");
        }
    }
    const plan = getPlan(clean.plan);
    const now = new Date().toISOString();
    const existingPlanId = normalizePlanId(existing.plan);
    const expiresAt = clean.expiresAt || (clean.plan !== existingPlanId ? calculateExpiration(clean.plan) : existing.expires_at);

    const fields = [
        "name = ?",
        "email = ?",
        "plan = ?",
        "plan_label = ?",
        "status = ?",
        "expires_at = ?",
        "is_admin = ?",
        "is_verified = ?",
        "allow_liquid_glass = ?",
        "daily_document_limit = ?",
        "daily_quota_renewal_enabled = ?",
        "allow_pdf_tools = ?",
        "pdf_tool_daily_limit = ?",
        "pdf_tool_quota_renewal_enabled = ?",
        "allowed_document_types = ?",
        "notes = ?",
        "updated_at = ?",
    ];
    const values = [
        clean.name,
        clean.email,
        clean.plan,
        plan.label,
        clean.status,
        expiresAt,
        clean.isAdmin ? 1 : 0,
        clean.isVerified ? 1 : 0,
        clean.allowLiquidGlass ? 1 : 0,
        clean.dailyDocumentLimit,
        clean.dailyQuotaRenewalEnabled ? 1 : 0,
        clean.allowPdfTools ? 1 : 0,
        clean.pdfToolDailyLimit,
        clean.pdfToolQuotaRenewalEnabled ? 1 : 0,
        JSON.stringify(clean.allowedDocumentTypes),
        clean.notes,
        now,
    ];

    if (clean.password) {
        fields.push("password_hash = ?");
        values.push(await hashPassword(clean.password));
    }

    values.push(id);

    try {
        await env.DB.prepare(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`)
            .bind(...values)
            .run();
    } catch (error) {
        if (String(error.message || "").toLowerCase().includes("unique")) {
            throw httpError(409, "Esse e-mail ja esta cadastrado.");
        }

        throw error;
    }

    await logAction(env, actor.id, "update_user", id, { email: clean.email, plan: clean.plan, status: clean.status, allowedDocuments: clean.allowedDocumentTypes.length }, request);
    return publicUser(await getUserById(env, id));
}

async function runUserAction(env, id, action, actor, options = {}, request = null) {
    const user = await getUserById(env, id);

    if (!user) {
        throw httpError(404, "Usuario nao encontrado.");
    }

    const now = new Date().toISOString();
    const updates = {
        updated_at: now,
    };

    if (action === "block") {
        updates.status = "blocked";
    } else if (action === "unblock") {
        updates.status = "active";

        if (new Date(user.expires_at).getTime() <= Date.now()) {
            updates.expires_at = calculateExpiration(user.plan);
        }
    } else if (action === "renewMonthly") {
        updates.status = "active";
        updates.plan = "basic30";
        updates.plan_label = PLANS.basic30.label;
        updates.expires_at = calculateExpiration("basic30");
    } else if (action === "renewAnnual") {
        updates.status = "active";
        updates.plan = "proMax365";
        updates.plan_label = PLANS.proMax365.label;
        updates.expires_at = calculateExpiration("proMax365");
    } else if (action === "renewCurrent") {
        const planId = normalizePlanId(user.plan);
        const plan = getPlan(planId);
        updates.status = "active";
        updates.plan = planId;
        updates.plan_label = plan.label;
        updates.expires_at = calculateExpiration(planId);
    } else if (action === "resetDocumentQuota") {
        if (isDailyQuotaRenewalEnabled(user)) {
            await env.DB.prepare("DELETE FROM document_generation_usage WHERE user_id = ? AND usage_date = ?")
                .bind(user.id, getUsageCycle().date).run();
        } else {
            await env.DB.prepare("DELETE FROM document_generation_usage WHERE user_id = ?").bind(user.id).run();
        }
        await env.DB.prepare("UPDATE users SET updated_at = ? WHERE id = ?").bind(now, id).run();
        await logAction(env, actor.id, action, id, { dailyLimit: getDailyDocumentLimit(user) }, request);
        return publicUser(await getUserById(env, id));
    } else if (action === "addDocumentQuota") {
        const amount = normalizeQuotaAdjustmentAmount(options.amount);
        const documentType = normalizeQuotaDocumentType(options.documentType);
        await adjustDocumentQuotaNow(env, user, amount, documentType);
        await env.DB.prepare("UPDATE users SET updated_at = ? WHERE id = ?").bind(now, id).run();
        await logAction(env, actor.id, action, id, { amount, documentType }, request);
        return publicUser(await getUserById(env, id));
    } else if (action === "subtractDocumentQuota") {
        const amount = normalizeQuotaAdjustmentAmount(options.amount);
        const documentType = normalizeQuotaDocumentType(options.documentType);
        await adjustDocumentQuotaNow(env, user, -amount, documentType);
        await env.DB.prepare("UPDATE users SET updated_at = ? WHERE id = ?").bind(now, id).run();
        await logAction(env, actor.id, action, id, { amount, documentType }, request);
        return publicUser(await getUserById(env, id));
    } else if (action === "addPdfToolQuota") {
        const amount = normalizeQuotaAdjustmentAmount(options.amount);
        const toolType = normalizeQuotaPdfToolType(options.toolType);
        await adjustPdfToolQuotaNow(env, user, amount, toolType);
        await env.DB.prepare("UPDATE users SET updated_at = ? WHERE id = ?").bind(now, id).run();
        await logAction(env, actor.id, action, id, { amount, toolType }, request);
        return publicUser(await getUserById(env, id));
    } else if (action === "subtractPdfToolQuota") {
        const amount = normalizeQuotaAdjustmentAmount(options.amount);
        const toolType = normalizeQuotaPdfToolType(options.toolType);
        await adjustPdfToolQuotaNow(env, user, -amount, toolType);
        await env.DB.prepare("UPDATE users SET updated_at = ? WHERE id = ?").bind(now, id).run();
        await logAction(env, actor.id, action, id, { amount, toolType }, request);
        return publicUser(await getUserById(env, id));
    } else {
        throw httpError(400, "Acao invalida.");
    }

    const entries = Object.entries(updates);
    await env.DB.prepare(`UPDATE users SET ${entries.map(([key]) => `${key} = ?`).join(", ")} WHERE id = ?`)
        .bind(...entries.map(([, value]) => value), id)
        .run();

    if (["renewMonthly", "renewAnnual", "renewCurrent"].includes(action)) {
        await env.DB.prepare("DELETE FROM document_generation_usage WHERE user_id = ?").bind(id).run();
    }
    await logAction(env, actor.id, action, id, updates, request);
    return publicUser(await getUserById(env, id));
}

function normalizeQuotaAdjustmentAmount(value) {
    const amount = Number(value);

    if (!Number.isInteger(amount) || amount < 1 || amount > 999) {
        throw httpError(400, "Informe uma quantidade inteira entre 1 e 999 para ajustar o saldo.");
    }

    return amount;
}

function normalizeQuotaDocumentType(value) {
    const documentType = String(value || "all").trim();

    if (documentType === "all") {
        return "all";
    }

    if (!DOCUMENT_GENERATION_TYPES.has(documentType)) {
        throw httpError(400, "Documento invalido para ajustar saldo.");
    }

    return documentType;
}

function normalizeQuotaPdfToolType(value) {
    const toolType = String(value || "all").trim();

    if (toolType === "all") {
        return "all";
    }

    if (!PDF_TOOL_TYPES.has(toolType)) {
        throw httpError(400, "Ferramenta PDF invalida para ajustar saldo.");
    }

    return toolType;
}

async function adjustDocumentQuotaNow(env, user, amount, documentType = "all") {
    if (user.is_admin) {
        throw httpError(400, "Administradores nao usam saldo diario de documentos.");
    }

    if (!isDocumentUsageLimited(user)) {
        throw httpError(400, "Este plano nao possui limite de saldo diario para documentos.");
    }

    const usageCycle = getUsageCycle();
    const now = new Date().toISOString();
    await ensureDocumentQuotaBalances(env, user, usageCycle);
    const documentTypes = documentType === "all"
        ? [...DOCUMENT_GENERATION_TYPES]
        : [documentType];

    for (const currentDocumentType of documentTypes) {
        await env.DB.prepare(`
            UPDATE document_quota_balances
            SET available_count = MAX(0, available_count + ?),
                last_renewal_key = ?,
                updated_at = ?
            WHERE user_id = ? AND document_type = ?
        `).bind(amount, usageCycle.date, now, user.id, currentDocumentType).run();
    }
}

async function adjustPdfToolQuotaNow(env, user, amount, toolType = "all") {
    if (user.is_admin) {
        throw httpError(400, "Administradores nao usam saldo diario de PDF.");
    }

    if (!userCanUsePdfTools(user)) {
        throw httpError(400, "Libere as ferramentas PDF para este usuario antes de ajustar o saldo.");
    }

    const usageCycle = getUsageCycle();
    const now = new Date().toISOString();
    await ensurePdfToolQuotaBalances(env, user, usageCycle);
    const toolTypes = toolType === "all"
        ? [...PDF_TOOL_TYPES]
        : [toolType];

    for (const currentToolType of toolTypes) {
        await env.DB.prepare(`
            UPDATE pdf_tool_quota_balances
            SET available_count = MAX(0, available_count + ?),
                last_renewal_key = ?,
                updated_at = ?
            WHERE user_id = ? AND tool_type = ?
        `).bind(amount, usageCycle.date, now, user.id, currentToolType).run();
    }
}

function cleanUserInput(body, options) {
    const planId = normalizePlanId(String(body.plan || "basic30"));
    const status = String(body.status || "active");
    const password = String(body.password || "");
    const dailyDocumentLimit = Number(body.dailyDocumentLimit ?? DEFAULT_DAILY_DOCUMENT_LIMIT);
    const dailyQuotaRenewalEnabled = body.dailyQuotaRenewalEnabled === undefined
        ? true
        : body.dailyQuotaRenewalEnabled === true || body.dailyQuotaRenewalEnabled === 1 || body.dailyQuotaRenewalEnabled === "yes";
    const allowPdfTools = body.allowPdfTools === true || body.allowPdfTools === 1 || body.allowPdfTools === "yes";
    const pdfToolDailyLimit = Number(body.pdfToolDailyLimit ?? DEFAULT_DAILY_PDF_TOOL_LIMIT);
    const pdfToolQuotaRenewalEnabled = body.pdfToolQuotaRenewalEnabled === undefined
        ? true
        : body.pdfToolQuotaRenewalEnabled === true || body.pdfToolQuotaRenewalEnabled === 1 || body.pdfToolQuotaRenewalEnabled === "yes";
    const allowedDocumentTypes = normalizeAllowedDocumentTypes(body.allowedDocumentTypes);

    if (!PLANS[planId]) {
        throw httpError(400, `Plano invalido: ${body.plan || "vazio"}. Use: test3min, test10c, basic30 ou proMax365.`);
    }

    if (!["active", "blocked", "expired"].includes(status)) {
        throw httpError(400, "Status invalido.");
    }

    if (!Number.isInteger(dailyDocumentLimit) || dailyDocumentLimit < 1 || dailyDocumentLimit > 999) {
        throw httpError(400, "O limite diario por documento deve ser um numero inteiro entre 1 e 999.");
    }

    if (!Number.isInteger(pdfToolDailyLimit) || pdfToolDailyLimit < 1 || pdfToolDailyLimit > 999) {
        throw httpError(400, "O limite diario por ferramenta PDF deve ser um numero inteiro entre 1 e 999.");
    }

    if (options.requirePassword && password.length < 6) {
        throw httpError(400, "A senha precisa ter pelo menos 6 caracteres.");
    }

    if (!options.requirePassword && password && password.length < 6) {
        throw httpError(400, "A senha precisa ter pelo menos 6 caracteres.");
    }

    const name = String(body.name || "").trim();
    const email = normalizeEmail(body.email);

    if (!name || !email) {
        throw httpError(400, "Informe nome e e-mail valido.");
    }

    return {
        name,
        email,
        password,
        plan: planId,
        status,
        isAdmin: body.isAdmin === true || body.isAdmin === 1 || body.isAdmin === "yes",
        isVerified: body.isVerified === true || body.isVerified === 1 || body.isVerified === "yes",
        allowLiquidGlass: body.allowLiquidGlass === true || body.allowLiquidGlass === 1 || body.allowLiquidGlass === "yes",
        dailyDocumentLimit,
        dailyQuotaRenewalEnabled,
        allowPdfTools,
        pdfToolDailyLimit,
        pdfToolQuotaRenewalEnabled,
        allowedDocumentTypes,
        notes: String(body.notes || "").trim(),
        expiresAt: normalizeManualExpiration(body.expiresAt, planId),
    };
}

function normalizeAllowedDocumentTypes(value) {
    if (!Array.isArray(value)) {
        return [];
    }

    return [...new Set(value.map((item) => String(item || "").trim()).filter((item) => USER_DOCUMENT_ACCESS_TYPES.has(item)))];
}

function getAllowedDocumentTypes(user) {
    if (!user || user.is_admin) {
        return [];
    }

    if (Array.isArray(user.allowedDocumentTypes)) {
        return normalizeAllowedDocumentTypes(user.allowedDocumentTypes);
    }

    const raw = String(user.allowed_document_types || "").trim();

    if (!raw) {
        return [];
    }

    try {
        return normalizeAllowedDocumentTypes(JSON.parse(raw));
    } catch (error) {
        return normalizeAllowedDocumentTypes(raw.split(","));
    }
}

function assertDocumentAccessAllowed(user, documentType) {
    const allowedTypes = getAllowedDocumentTypes(user);

    if (allowedTypes.length > 0 && !allowedTypes.includes(documentType)) {
        throw httpError(403, "Este documento nao esta liberado para este login.");
    }
}

function evaluateAccess(user) {
    if (user.status === "blocked") {
        return { allowed: false, message: "Seu acesso esta bloqueado. Fale com o administrador." };
    }

    if (!user.is_admin && (!user.expires_at || new Date(user.expires_at).getTime() <= Date.now())) {
        return { allowed: false, message: "Seu teste ou plano venceu. Fale com o administrador para renovar." };
    }

    if (user.status === "expired" && !user.is_admin) {
        return { allowed: false, message: "Seu teste ou plano venceu. Fale com o administrador para renovar." };
    }

    return { allowed: true };
}

async function expireOverdueUsers(env) {
    const now = new Date().toISOString();
    await env.DB.prepare(`
        UPDATE users
        SET status = 'expired', updated_at = ?
        WHERE status = 'active'
          AND is_admin = 0
          AND expires_at <= ?
    `).bind(now, now).run();
    const staleAttempts = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    await env.DB.prepare("DELETE FROM auth_login_attempts WHERE updated_at < ?").bind(staleAttempts).run();
}

async function createLoginAttemptKey(request, email) {
    const ip = String(request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "unknown")
        .split(",")[0]
        .trim();
    const bytes = new TextEncoder().encode(`${String(email).toLowerCase()}|${ip}`);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return bytesToHex(new Uint8Array(digest));
}

async function assertLoginAttemptAllowed(env, attemptKey) {
    const row = await env.DB.prepare("SELECT blocked_until FROM auth_login_attempts WHERE attempt_key = ?")
        .bind(attemptKey)
        .first();
    if (row?.blocked_until && new Date(row.blocked_until).getTime() > Date.now()) {
        throw httpError(429, "Muitas tentativas de login. Aguarde 15 minutos e tente novamente.", {
            "Retry-After": String(Math.ceil((new Date(row.blocked_until).getTime() - Date.now()) / 1000)),
        });
    }
}

async function recordFailedLoginAttempt(env, attemptKey) {
    const nowMs = Date.now();
    const now = new Date(nowMs).toISOString();
    const row = await env.DB.prepare("SELECT failed_count, window_started_at FROM auth_login_attempts WHERE attempt_key = ?")
        .bind(attemptKey)
        .first();
    const windowExpired = !row?.window_started_at || nowMs - new Date(row.window_started_at).getTime() > LOGIN_ATTEMPT_WINDOW_MS;
    const failedCount = windowExpired ? 1 : Number(row.failed_count || 0) + 1;
    const windowStartedAt = windowExpired ? now : row.window_started_at;
    const blockedUntil = failedCount >= LOGIN_MAX_FAILED_ATTEMPTS
        ? new Date(nowMs + LOGIN_BLOCK_DURATION_MS).toISOString()
        : "";

    await env.DB.prepare(`
        INSERT INTO auth_login_attempts (attempt_key, failed_count, window_started_at, blocked_until, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(attempt_key) DO UPDATE SET
            failed_count = excluded.failed_count,
            window_started_at = excluded.window_started_at,
            blocked_until = excluded.blocked_until,
            updated_at = excluded.updated_at
    `).bind(attemptKey, failedCount, windowStartedAt, blockedUntil, now).run();
}

async function clearLoginAttempts(env, attemptKey) {
    await env.DB.prepare("DELETE FROM auth_login_attempts WHERE attempt_key = ?").bind(attemptKey).run();
}

async function expireOverdueUsersIfDue(env) {
    const now = Date.now();
    if (now - lastExpirySweepAt < EXPIRY_SWEEP_INTERVAL_MS) return;
    lastExpirySweepAt = now;
    await expireOverdueUsers(env);
}

function buildAccessMessage(user) {
    if (user.is_admin) {
        return "Acesso de administrador ativo. Voce pode usar o sistema e gerenciar assinaturas.";
    }

    const plan = getPlan(user.plan) || { label: user.plan_label || "plano ativo" };
    const expiresAt = new Date(user.expires_at);
    const diff = expiresAt.getTime() - Date.now();

    if (plan.minutes) {
        const minutes = Math.max(1, Math.ceil(diff / (1000 * 60)));
        return `Parabens! Voce esta com o ${plan.label.toLowerCase()} ativo. Restam ${minutes} minuto${minutes === 1 ? "" : "s"}.`;
    }

    const days = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    return `Parabens! Seu ${plan.label.toLowerCase()} esta ativo. Restam ${days} dia${days === 1 ? "" : "s"}.`;
}

function buildRenewalWarning(user) {
    if (!user || user.is_admin || !user.expires_at) {
        return "";
    }

    const remaining = new Date(user.expires_at).getTime() - Date.now();
    const warningLimit = 3 * 24 * 60 * 60 * 1000;

    if (remaining <= 0 || remaining > warningLimit) {
        return "";
    }

    const plan = getPlan(user.plan);

    if (plan?.minutes) {
        const minutes = Math.max(1, Math.ceil(remaining / (60 * 1000)));
        return `Seu plano de teste expira em ${minutes} minuto${minutes === 1 ? "" : "s"}. Renove pelo Mercado Pago para liberar automaticamente assim que o pagamento for confirmado.`;
    }

    const days = Math.max(1, Math.ceil(remaining / (24 * 60 * 60 * 1000)));
    return `Seu plano expira em ${days} dia${days === 1 ? "" : "s"}. Renove pelo Mercado Pago para liberar automaticamente assim que o pagamento for confirmado.`;
}

async function getUserByEmail(env, email) {
    return env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
}

async function getUserById(env, id) {
    return env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
}

function publicUser(user) {
    const planId = normalizePlanId(user.plan);
    const plan = getPlan(planId);

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: planId,
        planLabel: plan?.label || user.plan_label,
        status: user.status,
        expiresAt: user.expires_at,
        isAdmin: Boolean(user.is_admin),
        isVerified: Boolean(user.is_verified),
        allowLiquidGlass: Boolean(user.is_admin || user.allow_liquid_glass),
        dailyDocumentLimit: getDailyDocumentLimit(user),
        dailyQuotaRenewalEnabled: isDailyQuotaRenewalEnabled(user),
        allowPdfTools: Boolean(user.is_admin || user.allow_pdf_tools),
        pdfToolDailyLimit: getPdfToolDailyLimit(user),
        pdfToolQuotaRenewalEnabled: isPdfToolQuotaRenewalEnabled(user),
        allowedDocumentTypes: getAllowedDocumentTypes(user),
        avatarDataUrl: user.avatar_data_url || "",
        notes: user.notes || "",
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        lastLoginAt: user.last_login_at,
    };
}

function normalizePlanId(planId) {
    const raw = String(planId || "").trim();

    if (!raw) {
        return "";
    }

    const lower = raw.toLowerCase();
    const compact = lower
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");

    const aliasesNormalizados = {
        test3min: "test3min",
        teste3min: "test3min",
        "3minutosparateste": "test3min",
        test10c: "test10c",
        teste10c: "test10c",
        teste10centavos: "test10c",
        teste10centavo: "test10c",
        teste10cent: "test10c",
        teste10: "test10c",
        "testemercadopago": "test10c",
        "testemercadopago10centavos": "test10c",
        test15min: "basic30",
        teste5min: "basic30",
        "5minutosdeteste": "basic30",
        trial15: "basic30",
        trial7: "basic30",
        teste7: "basic30",
        teste7dias: "basic30",
        "7diastestegratis": "basic30",
        monthly30: "basic30",
        annual365: "proMax365",
        basico30: "basic30",
        basic: "basic30",
        basic30: "basic30",
        "30diasplanobasico": "basic30",
        "30diasplanopro": "basic30",
        plus: "basic30",
        plus90: "basic30",
        "90diasplanoplus": "basic30",
        pro: "basic30",
        pro180: "basic30",
        "180diasplanopro": "basic30",
        promax: "proMax365",
        promax365: "proMax365",
        promaximo365: "proMax365",
        "365diasplanopromax": "proMax365",
    };

    const alias = PLAN_ALIASES[raw] || PLAN_ALIASES[lower] || aliasesNormalizados[compact];

    if (alias) {
        return alias;
    }

    const match = Object.keys(PLANS).find((id) => id.toLowerCase() === lower);
    return match || raw;
}

function getPlan(planId) {
    return PLANS[normalizePlanId(planId)];
}

function calculateExpiration(planId) {
    const plan = getPlan(planId) || PLANS.basic30;
    const date = new Date();

    if (plan.minutes) {
        date.setMinutes(date.getMinutes() + plan.minutes);
    } else {
        date.setDate(date.getDate() + plan.days);
    }

    return date.toISOString();
}

function normalizeManualExpiration(value, planId) {
    const plan = getPlan(planId) || PLANS.basic30;
    const raw = String(value || "").trim();

    if (!raw || plan.minutes) {
        return "";
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
        return `${raw}T03:00:00.000Z`;
    }

    const date = new Date(raw);

    if (!Number.isFinite(date.getTime())) {
        return "";
    }

    return date.toISOString();
}

async function hashPassword(password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const hash = await derivePassword(password, salt, PASSWORD_ITERATIONS);
    return `pbkdf2_sha256$${PASSWORD_ITERATIONS}$${base64Encode(salt)}$${base64Encode(hash)}`;
}

async function verifyPassword(password, stored) {
    const parts = String(stored || "").split("$");

    if (parts.length !== 4 || parts[0] !== "pbkdf2_sha256") {
        return false;
    }

    const iterations = Number(parts[1]);
    const salt = base64Decode(parts[2]);
    const expected = base64Decode(parts[3]);
    const actual = await derivePassword(password, salt, iterations);

    return constantTimeEqual(actual, expected);
}

async function derivePassword(password, salt, iterations) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        PASSWORD_ALGORITHM,
        false,
        ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits(
        {
            name: PASSWORD_ALGORITHM,
            hash: PASSWORD_HASH,
            salt,
            iterations,
        },
        key,
        256
    );

    return new Uint8Array(bits);
}

async function createSessionToken(env, user) {
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = user.is_admin
        ? SESSION_TTL_SECONDS
        : Math.max(60, Math.min(SESSION_TTL_SECONDS, Math.floor((new Date(user.expires_at).getTime() - Date.now()) / 1000)));
    const payload = {
        uid: user.id,
        exp: now + expiresIn,
        scope: "session",
    };
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const signature = await sign(env, encodedPayload);
    return `${encodedPayload}.${signature}`;
}

async function createBillingToken(env, user) {
    const payload = {
        uid: user.id,
        exp: Math.floor(Date.now() / 1000) + BILLING_TOKEN_TTL_SECONDS,
        scope: "billing",
    };
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const signature = await sign(env, encodedPayload);
    return `${encodedPayload}.${signature}`;
}

async function verifySessionToken(env, token) {
    const [payload, signature] = String(token || "").split(".");

    if (!payload || !signature) {
        throw httpError(401, "Sessao invalida.");
    }

    const expected = await sign(env, payload);

    if (!constantTimeEqual(utf8(expected), utf8(signature))) {
        throw httpError(401, "Sessao invalida.");
    }

    const data = JSON.parse(base64UrlDecode(payload));

    if (!data.uid || Number(data.exp || 0) <= Math.floor(Date.now() / 1000)) {
        throw httpError(401, "Sessao expirada. Entre novamente.");
    }

    if (data.scope && data.scope !== "session") {
        throw httpError(401, "Sessao invalida.");
    }

    return data;
}

async function verifyBillingToken(env, token) {
    const [payload, signature] = String(token || "").split(".");

    if (!payload || !signature) {
        throw httpError(401, "Acesso de cobranca invalido.");
    }

    const expected = await sign(env, payload);

    if (!constantTimeEqual(utf8(expected), utf8(signature))) {
        throw httpError(401, "Acesso de cobranca invalido.");
    }

    const data = JSON.parse(base64UrlDecode(payload));

    if (!data.uid || data.scope !== "billing" || Number(data.exp || 0) <= Math.floor(Date.now() / 1000)) {
        throw httpError(401, "Acesso de cobranca expirado. Informe seu login novamente.");
    }

    return data;
}

async function sign(env, text) {
    const secret = String(env.APP_SECRET || "");
    if (!secret || secret === "troque-este-segredo-em-producao") {
        throw new Error("APP_SECRET nao configurado. Defina APP_SECRET no Worker com um valor longo e aleatorio.");
    }
    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
    );
    const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(text));
    return base64UrlEncodeBytes(new Uint8Array(signature));
}

async function listUserHistory(env, userId) {
    const result = await env.DB.prepare(`
        SELECT
            logs.id,
            logs.actor_user_id,
            logs.action,
            logs.target_user_id,
            logs.details,
            logs.ip_address,
            logs.user_agent,
            logs.created_at,
            actor.name AS actor_name,
            actor.email AS actor_email,
            target.name AS target_name,
            target.email AS target_email
        FROM audit_logs logs
        LEFT JOIN users actor ON actor.id = logs.actor_user_id
        LEFT JOIN users target ON target.id = logs.target_user_id
        WHERE logs.actor_user_id = ? OR logs.target_user_id = ?
        ORDER BY logs.created_at DESC
        LIMIT 120
    `).bind(userId, userId).all();

    return (result.results || []).map((row) => ({
        id: row.id,
        action: row.action,
        createdAt: row.created_at,
        details: parseJsonObject(row.details),
        ipAddress: row.ip_address || "",
        userAgent: row.user_agent || "",
        actor: {
            id: row.actor_user_id,
            name: row.actor_name || "",
            email: row.actor_email || "",
        },
        target: {
            id: row.target_user_id,
            name: row.target_name || "",
            email: row.target_email || "",
        },
    }));
}

function parseJsonObject(value) {
    try {
        const parsed = JSON.parse(String(value || "{}"));
        return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch (error) {
        return {};
    }
}

function getRequestAuditContext(request) {
    if (!request?.headers) return { ipAddress: "", userAgent: "" };
    return {
        ipAddress: String(request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "").split(",")[0].trim().slice(0, 80),
        userAgent: String(request.headers.get("User-Agent") || "").trim().slice(0, 500),
    };
}

async function logAction(env, actorUserId, action, targetUserId, details = {}, request = null) {
    const context = getRequestAuditContext(request);
    const safeDetails = { ...(details || {}) };
    if (context.ipAddress && !safeDetails.ipAddress) safeDetails.ipAddress = context.ipAddress;
    if (context.userAgent && !safeDetails.userAgent) safeDetails.userAgent = context.userAgent;
    await env.DB.prepare(`
        INSERT INTO audit_logs (id, actor_user_id, action, target_user_id, details, ip_address, user_agent, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
        crypto.randomUUID(),
        actorUserId,
        action,
        targetUserId,
        JSON.stringify(safeDetails),
        context.ipAddress,
        context.userAgent,
        new Date().toISOString()
    ).run();
}

async function readOptionalJson(request) {
    try {
        return await request.json();
    } catch (error) {
        return {};
    }
}

async function readJson(request) {
    try {
        return await request.json();
    } catch (error) {
        throw httpError(400, "Envie um JSON valido.");
    }
}

function json(data, status = 200, extraHeaders) {
    const headers = new Headers(extraHeaders || {});
    headers.set("Content-Type", "application/json; charset=utf-8");
    headers.set("Cache-Control", "no-store");
    return new Response(JSON.stringify(data), { status, headers });
}

function html(content, status = 200) {
    const headers = new Headers();
    headers.set("Content-Type", "text/html; charset=utf-8");
    headers.set("Cache-Control", "no-store");
    return new Response(content, { status, headers });
}

function getSetupAdminPage() {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Criar administrador</title>
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 24px;
            font-family: Arial, sans-serif;
            color: #152238;
            background: #eef3f8;
        }
        main {
            width: min(100%, 460px);
            padding: 30px;
            border-radius: 14px;
            background: #fff;
            box-shadow: 0 18px 45px rgba(21, 34, 56, 0.16);
        }
        p { margin: 0 0 18px; color: #53657d; line-height: 1.5; }
        .eyebrow {
            margin-bottom: 8px;
            color: #1f6feb;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }
        h1 { margin: 0 0 10px; font-size: 28px; }
        label { display: grid; gap: 8px; margin-top: 14px; font-weight: 700; }
        input {
            width: 100%;
            border: 1px solid #c8d4e3;
            border-radius: 8px;
            padding: 13px 14px;
            font: inherit;
        }
        button {
            width: 100%;
            margin-top: 22px;
            border: 0;
            border-radius: 8px;
            padding: 14px 18px;
            color: #fff;
            background: #2563eb;
            font: inherit;
            font-weight: 700;
            cursor: pointer;
        }
        button:disabled { opacity: 0.7; cursor: wait; }
        .message { min-height: 24px; margin-top: 16px; font-weight: 700; }
        .success { color: #0f7b3c; }
        .error { color: #c62828; }
    </style>
</head>
<body>
    <main>
        <p class="eyebrow">Configuração inicial</p>
        <h1>Criar administrador</h1>
        <p>Use esta tela apenas uma vez para criar o primeiro administrador do sistema.</p>
        <p><a href="/" style="color:#2563eb;font-weight:700;text-decoration:none">← Voltar ao site</a></p>
        <form id="setupForm">
            <label>
                Setup token
                <input id="setupToken" type="password" required autocomplete="off">
            </label>
            <label>
                Nome
                <input id="name" type="text" value="Kaua Lucas" required autocomplete="name">
            </label>
            <label>
                E-mail administrador
                <input id="email" type="email" value="kaualucasfrancasantos@gmail.com" required autocomplete="email">
            </label>
            <label>
                Senha para entrar
                <input id="password" type="password" minlength="6" required autocomplete="new-password">
            </label>
            <button id="button" type="submit">Criar administrador</button>
            <p id="message" class="message"></p>
        </form>
    </main>
    <script>
        const form = document.getElementById("setupForm");
        const button = document.getElementById("button");
        const message = document.getElementById("message");

        async function redirectIfConfigured() {
            try {
                const response = await fetch("/setup/status", { cache: "no-store" });
                const data = await response.json();
                if (response.ok && data.adminExists) {
                    window.location.replace(data.publicAppUrl || "/");
                }
            } catch (_) {}
        }

        redirectIfConfigured();

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            message.textContent = "";
            message.className = "message";
            button.disabled = true;
            button.textContent = "Criando...";

            try {
                const response = await fetch("/setup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        setupToken: document.getElementById("setupToken").value.trim(),
                        name: document.getElementById("name").value.trim(),
                        email: document.getElementById("email").value.trim(),
                        password: document.getElementById("password").value,
                    }),
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Não foi possível criar o administrador.");
                }

                message.textContent = "Administrador criado. Redirecionando para o DocSpace...";
                message.className = "message success";
                form.reset();
                setTimeout(() => window.location.replace("/"), 900);
            } catch (error) {
                message.textContent = error.message || "Falha ao conectar com a API.";
                message.className = "message error";
            } finally {
                button.disabled = false;
                button.textContent = "Criar administrador";
            }
        });
    </script>
</body>
</html>`;
}


async function searchPresentationMedia(request) {
    const requestUrl = new URL(request.url);
    const query = String(requestUrl.searchParams.get("q") || "").trim().slice(0, 180);
    if (!query) return json({ images: [] });

    const blockedWords = /\b(logo|icon|coat of arms|flag|map|diagram|chart|symbol|seal|signature|poster|screenshot)\b/i;
    const images = [];
    const seen = new Set();
    const searches = [`${query} filetype:bitmap`, query];

    for (const searchText of searches) {
        if (images.length >= 8) break;
        const api = new URL("https://commons.wikimedia.org/w/api.php");
        api.searchParams.set("action", "query");
        api.searchParams.set("format", "json");
        api.searchParams.set("generator", "search");
        api.searchParams.set("gsrsearch", searchText);
        api.searchParams.set("gsrnamespace", "6");
        api.searchParams.set("gsrlimit", "24");
        api.searchParams.set("prop", "imageinfo");
        api.searchParams.set("iiprop", "url|mime|size|extmetadata");
        api.searchParams.set("iiurlwidth", "1800");

        const response = await fetch(api.toString(), {
            headers: {
                Accept: "application/json",
                "Api-User-Agent": "DocSpace/1.57 presentation-media-search",
            },
        });
        if (!response.ok) continue;
        const data = await response.json();
        const pages = Object.values(data?.query?.pages || {}).sort((a, b) => Number(a?.index || 999) - Number(b?.index || 999));

        for (const page of pages) {
            const info = page?.imageinfo?.[0];
            const originalUrl = String(info?.thumburl || info?.url || "");
            const mime = String(info?.mime || "");
            const title = String(page?.title || "").replace(/^File:/i, "").trim();
            const width = Number(info?.thumbwidth || info?.width || 0);
            const height = Number(info?.thumbheight || info?.height || 0);
            if (!/^https:\/\//i.test(originalUrl) || seen.has(originalUrl)) continue;
            if (!/^image\/(jpeg|png|webp)$/i.test(mime)) continue;
            if (blockedWords.test(title) && !blockedWords.test(query)) continue;
            if (width && height && (width < 700 || width / Math.max(1, height) < 1.05)) continue;
            const artist = stripMediaHtml(info?.extmetadata?.Artist?.value || "");
            const license = stripMediaHtml(info?.extmetadata?.LicenseShortName?.value || "");
            const description = stripMediaHtml(info?.extmetadata?.ImageDescription?.value || "");
            const proxyUrl = new URL("/api/media/image", request.url);
            proxyUrl.searchParams.set("url", originalUrl);
            images.push({
                title: title.slice(0, 180),
                url: originalUrl,
                proxyUrl: proxyUrl.toString(),
                width,
                height,
                description: description.slice(0, 300),
                attribution: [artist, license, "Wikimedia Commons"].filter(Boolean).join(" · ").slice(0, 400),
            });
            seen.add(originalUrl);
            if (images.length >= 8) break;
        }
    }
    return json({ query, images });
}

async function proxyPresentationMedia(request) {
    const requestUrl = new URL(request.url);
    const raw = String(requestUrl.searchParams.get("url") || "").trim();
    let target;
    try { target = new URL(raw); } catch (_) { throw httpError(400, "URL de imagem inválida."); }
    const host = target.hostname.toLowerCase();
    const allowed = host === "upload.wikimedia.org" || host.endsWith(".wikimedia.org");
    if (target.protocol !== "https:" || !allowed) throw httpError(403, "Origem da imagem não permitida.");
    const upstream = await fetch(target.toString(), { headers: { Accept: "image/avif,image/webp,image/png,image/jpeg,*/*" } });
    if (!upstream.ok) throw httpError(502, "Não foi possível carregar a imagem selecionada.");
    const contentType = String(upstream.headers.get("Content-Type") || "");
    if (!/^image\/(jpeg|png|webp|avif)$/i.test(contentType)) throw httpError(415, "O arquivo retornado não é uma imagem compatível.");
    const contentLength = Number(upstream.headers.get("Content-Length") || 0);
    if (contentLength > 12 * 1024 * 1024) throw httpError(413, "A imagem encontrada é grande demais.");
    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Cache-Control", "public, max-age=86400, s-maxage=604800");
    headers.set("X-Content-Type-Options", "nosniff");
    return new Response(upstream.body, { status: 200, headers });
}

function stripMediaHtml(value) {
    return String(value || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim();
}

function createCorsPreflightResponse(request, env) {
    return withCors(request, new Response(null, { status: 204 }), env);
}

function getAllowedCorsOrigin(origin, env) {
    const value = String(origin || "").trim().replace(/\/+$/, "");

    if (!value) {
        return "";
    }

    const configuredOrigins = String(env?.CORS_ALLOWED_ORIGINS || "")
        .split(",")
        .map((item) => item.trim().replace(/\/+$/, ""))
        .filter(Boolean);

    const matchesConfiguredOrigin = configuredOrigins.some((pattern) => {
        if (pattern === value) return true;
        if (!pattern.includes("*")) return false;
        try {
            const originUrl = new URL(value);
            const wildcardUrl = new URL(pattern.replace("*", "docspace-wildcard"));
            const expectedSuffix = wildcardUrl.hostname.replace(/^docspace-wildcard\./, ".");
            return originUrl.protocol === wildcardUrl.protocol && originUrl.hostname.endsWith(expectedSuffix);
        } catch (_) {
            return false;
        }
    });

    if (CORS_ALLOWED_ORIGINS.has(value) || matchesConfiguredOrigin) {
        return value;
    }

    try {
        const url = new URL(value);
        const isLocalDev = ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
        const isProjectPreview =
            url.protocol === "https:" &&
            (url.hostname.endsWith(".gerador-documentos-rurais.pages.dev") ||
                url.hostname === "docspace-web.pages.dev" ||
                url.hostname.endsWith(".docspace-web.pages.dev") ||
                url.hostname.endsWith(".github.io"));

        if (isLocalDev || isProjectPreview) {
            return value;
        }
    } catch (error) {
        return "";
    }

    return "";
}

function withCors(request, response, env) {
    const headers = new Headers(response.headers);
    const origin = getAllowedCorsOrigin(request.headers.get("Origin"), env);

    if (origin) {
        headers.set("Access-Control-Allow-Origin", origin);
        headers.set("Access-Control-Allow-Credentials", "true");
        headers.set("Vary", "Origin");
    }

    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Billing-Token, X-Signature, X-Request-Id");
    headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
}

function httpError(status, message, headers) {
    const error = new Error(message);
    error.status = status;
    error.headers = headers;
    return error;
}



async function exportAiDocumentPdf(request, env, user) {
    const body = await readJson(request);
    const docxBase64 = String(body.docxBase64 || "").trim().replace(/^data:[^;]+;base64,/, "");
    const sourceName = String(body.fileName || "documento-docspace.docx").trim();
    const safeName = sourceName.replace(/[^a-zA-Z0-9À-ÿ._ -]/g, "-").slice(0, 120) || "documento-docspace.docx";
    if (!docxBase64) throw httpError(400, "Envie o documento Word para conversão.");
    if (docxBase64.length > MAX_PREVIEW_DOCX_BASE64_LENGTH) throw httpError(413, "O documento ficou grande demais para conversão.");

    const renderApiUrl = String(env.RENDER_API_URL || "https://gerador-de-documentos-1.onrender.com").replace(/\/+$/, "");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120_000);
    try {
        const response = await fetch(`${renderApiUrl}/api/convert-docx-to-pdf`, {
            method: "POST",
            signal: controller.signal,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ docxBase64, fileName: safeName }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data?.pdfBase64) {
            const detail = String(data?.message || data?.error || "").trim();
            throw httpError(502, detail ? `Falha ao gerar PDF: ${detail}` : "O conversor de documentos não retornou o PDF.");
        }
        const outputName = String(data.fileName || safeName.replace(/\.docx$/i, ".pdf"));
        await logAction(env, user.id, "ai_export_pdf", null, { fileName: outputName }, request);
        return json({
            success: true,
            pdfBase64: data.pdfBase64,
            fileName: outputName,
            protected: data.protected === true,
        });
    } catch (error) {
        if (error?.name === "AbortError") throw httpError(504, "A conversão para PDF demorou demais.");
        throw error;
    } finally {
        clearTimeout(timeout);
    }
}

async function processAiAction(request, env, user) {
    if (String(env.AI_ENABLED || "").toLowerCase() !== "true") {
        throw httpError(503, "A IA está preparada, mas ainda não foi ativada no DocSpace.");
    }

    const endpoint = String(env.AI_API_URL || "").trim();
    const model = String(env.AI_MODEL || "").trim();
    if (!endpoint || !model) {
        throw httpError(503, "Configuração da IA incompleta no backend.");
    }

    const body = await readJson(request);
    const action = String(body.action || "assist").trim();
    if (!AI_ACTIONS.has(action)) throw httpError(400, "Ação de IA inválida.");

    const images = normalizeAiImages(body.images);
    const prompt = String(body.prompt || "").trim() || (images.length
        ? "Analise os documentos anexados, extraia somente os dados legíveis e execute a tarefa solicitada. Use [PREENCHER] para dados ausentes, duvidosos ou ilegíveis."
        : "");
    const context = body.context && typeof body.context === "object" ? body.context : {};
    const history = normalizeAiHistory(body.history);
    if (!prompt) throw httpError(400, "Informe o conteúdo ou anexe um documento para a IA processar.");
    if (prompt.length > AI_MAX_PROMPT_LENGTH) throw httpError(413, "Conteúdo muito extenso para uma única solicitação.");

    const clock = getAiReferenceClock();
    if (!images.length && action === "assist" && isCurrentDateQuestion(prompt)) {
        const content = `Hoje é ${clock.longDate}, ${clock.weekday}. Agora são ${clock.time} no horário de Brasília.`;
        await logAction(env, user.id, "ai_server_date", null, { date: clock.date, time: clock.time }, request);
        return json({
            action,
            content,
            provider: "docspace-server-clock",
            model: "deterministic-date",
            serverClock: clock,
        });
    }

    const systemPrompt = buildAiSystemPrompt(action, { ...context, hasAttachments: images.length > 0, imageCount: images.length, serverClock: clock });
    const apiKey = env.AI_API_KEY || env.OPENROUTER_API_KEY || env.OPENAI_API_KEY;
    if (!apiKey) {
        throw httpError(503, "Chave da IA não configurada no Worker. Cadastre AI_API_KEY, OPENROUTER_API_KEY ou OPENAI_API_KEY.");
    }
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
    };
    if (String(env.AI_PROVIDER || "").toLowerCase() === "openrouter") {
        if (env.PUBLIC_APP_URL) headers["HTTP-Referer"] = String(env.PUBLIC_APP_URL);
        headers["X-OpenRouter-Title"] = String(env.AI_APP_NAME || "DocSpace");
    }

    const controller = new AbortController();
    const timeoutMs = Math.max(10_000, Math.min(Number(env.AI_TIMEOUT_MS || AI_DEFAULT_TIMEOUT_MS), 180_000));
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers,
            signal: controller.signal,
            body: JSON.stringify({
                model,
                messages: [
                    { role: "system", content: systemPrompt },
                    ...history,
                    {
                        role: "user",
                        content: images.length
                            ? [
                                {
                                    type: "text",
                                    text: `${prompt}

Arquivos anexados: ${images.map((image, index) => `${index + 1}. ${image.name}`).join("; ")}. Leia somente o que estiver visível e não complete números por suposição.`,
                                },
                                ...images.map((image) => ({
                                    type: "image_url",
                                    image_url: { url: image.dataUrl, detail: "high" },
                                })),
                            ]
                            : prompt,
                    },
                ],
                temperature: action === "office-powerpoint" ? 0.15 : ["extract-fields", "office-word", "office-excel"].includes(action) ? 0 : 0.2,
                max_tokens: action === "extract-fields" ? 5000 : ["office-word", "office-excel"].includes(action) ? 8000 : 6000,
                ...(["extract-fields", "office-word", "office-excel", "office-powerpoint"].includes(action) ? { response_format: { type: "json_object" } } : {}),
                stream: false,
            }),
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            const providerMessage = String(data?.error?.message || data?.message || "").trim();
            console.error("Falha do provedor de IA", response.status, providerMessage || "sem detalhes");
            if (response.status === 401 || response.status === 403) {
                throw httpError(502, "A chave da IA foi recusada pelo provedor.");
            }
            if (response.status === 402) {
                throw httpError(502, "A conta do provedor de IA está sem créditos.");
            }
            if (response.status === 429) {
                throw httpError(429, "O limite de solicitações da IA foi atingido. Tente novamente em instantes.");
            }
            throw httpError(502, providerMessage ? `Falha no provedor de IA: ${providerMessage}` : "O provedor de IA não conseguiu concluir a solicitação.");
        }

        const content = extractAiContent(data);
        if (!content) throw httpError(502, "O provedor de IA retornou uma resposta vazia.");

        await logAction(env, user.id, `ai_${action}`, null, { imageCount: images.length }, request);
        return json({
            action,
            content,
            provider: env.AI_PROVIDER || "open-source",
            model,
            serverClock: clock,
        });
    } catch (error) {
        if (error?.name === "AbortError") throw httpError(504, "O provedor de IA demorou demais para responder.");
        throw error;
    } finally {
        clearTimeout(timeout);
    }
}

function safeEndpointHost(value) {
    try {
        return new URL(String(value || "")).host || "";
    } catch (_) {
        return "";
    }
}

function getAiReferenceClock(date = new Date()) {
    const parts = Object.fromEntries(new Intl.DateTimeFormat("pt-BR", {
        timeZone: AI_REFERENCE_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        weekday: "long",
    }).formatToParts(date).filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
    const dateLabel = `${parts.day}/${parts.month}/${parts.year}`;
    const timeLabel = `${parts.hour}:${parts.minute}`;
    const longDate = new Intl.DateTimeFormat("pt-BR", {
        timeZone: AI_REFERENCE_TIME_ZONE,
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date);
    return {
        iso: date.toISOString(),
        date: dateLabel,
        time: timeLabel,
        weekday: String(parts.weekday || "").toLowerCase(),
        longDate,
        timeZone: AI_REFERENCE_TIME_ZONE,
    };
}

function isCurrentDateQuestion(value) {
    const normalized = String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    if (!normalized) return false;
    return /^(qual (e|eh) )?(a )?data( de hoje| atual)?$/.test(normalized)
        || /^(que dia (e|eh) hoje|que dia estamos|qual dia (e|eh) hoje)$/.test(normalized)
        || /^(hoje (e|eh) que dia|me diga a data de hoje)$/.test(normalized);
}

function normalizeAiHistory(value) {
    if (!Array.isArray(value)) return [];
    return value
        .slice(-AI_MAX_HISTORY_MESSAGES)
        .map((item) => {
            const role = item?.role === "assistant" ? "assistant" : item?.role === "user" ? "user" : "";
            const content = String(item?.content || "").trim().slice(0, AI_MAX_HISTORY_MESSAGE_LENGTH);
            return role && content ? { role, content } : null;
        })
        .filter(Boolean);
}

function normalizeAiImages(value) {
    if (value == null) return [];
    if (!Array.isArray(value)) throw httpError(400, "O campo images deve ser uma lista.");
    if (value.length > AI_MAX_IMAGES) throw httpError(413, `Envie no máximo ${AI_MAX_IMAGES} imagens por solicitação.`);

    let totalBytes = 0;
    return value.map((item, index) => {
        const rawDataUrl = String(item?.dataUrl || item?.url || "").trim();
        const matchResult = /^data:image\/(jpeg|jpg|png|webp);base64,([a-z0-9+/=\s]+)$/i.exec(rawDataUrl);
        if (!matchResult) throw httpError(400, `O anexo ${index + 1} não é uma imagem JPG, PNG ou WEBP válida.`);
        const subtype = matchResult[1].toLowerCase() === "jpg" ? "jpeg" : matchResult[1].toLowerCase();
        const base64 = matchResult[2].replace(/\s+/g, "");
        const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
        const bytes = Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
        if (!bytes || bytes > AI_MAX_IMAGE_BYTES) throw httpError(413, `O anexo ${index + 1} excede o limite de 6 MB após o processamento.`);
        totalBytes += bytes;
        if (totalBytes > AI_MAX_TOTAL_IMAGE_BYTES) throw httpError(413, "O conjunto de anexos excede o limite total de 20 MB.");
        const name = String(item?.name || `documento-${index + 1}.${subtype === "jpeg" ? "jpg" : subtype}`)
            .replace(/[^a-zA-Z0-9À-ÿ._ -]/g, "-")
            .slice(0, 120);
        return {
            name,
            type: `image/${subtype}`,
            bytes,
            dataUrl: `data:image/${subtype};base64,${base64}`,
        };
    });
}

function buildAiSystemPrompt(action, context) {
    const clock = context?.serverClock || getAiReferenceClock();
    const base = [
        "Você é o assistente interno do DocSpace.",
        `Data oficial desta solicitação: ${clock.longDate} (${clock.date}). Dia da semana: ${clock.weekday}. Hora atual: ${clock.time}. Fuso horário: ${clock.timeZone}.`,
        "Sempre use essa data como referência para palavras como hoje, agora, data atual, nesta data, ontem e amanhã. Nunca use a data do seu treinamento como se fosse a data atual.",
        "Ao preencher data de assinatura ou emissão sem outra data informada, use a data oficial desta solicitação.",
        "Responda em português do Brasil, com linguagem clara e profissional.",
        "Não invente dados pessoais, fatos, leis, números de documentos ou informações ausentes.",
        "Quando houver imagens de RG, CPF, CNH, certidões ou comprovantes, transcreva apenas dados claramente legíveis e preserve a grafia exibida.",
        "Nunca adivinhe dígitos parcialmente ocultos ou ilegíveis. Marque cada informação duvidosa ou ausente como [PREENCHER] e, quando útil, liste o que precisa ser confirmado.",
        "Use os dados anexados somente para executar a solicitação atual e não os reproduza fora do documento pedido.",
        "Quando faltarem informações essenciais, indique exatamente quais dados devem ser solicitados ao usuário.",
        "Não afirme que o documento substitui análise profissional quando a situação exigir revisão especializada.",
    ];

    const instructions = {
        assist: "Ajude o usuário a entender, estruturar ou preencher documentos e tarefas do sistema.",
        draft: "Crie uma minuta completa, profissional e pronta para Word/PDF usando os dados fornecidos e os dados legíveis dos anexos. Marque informações ausentes, duvidosas ou ilegíveis como [PREENCHER].",
        review: "Revise o conteúdo, identifique inconsistências, campos ausentes, repetições e problemas de clareza. Não altere silenciosamente dados objetivos.",
        "office-word": "Você é o Assistente Word do DocSpace. Gere conteúdo completo e pronto para ser inserido diretamente no editor Word. Retorne exclusivamente JSON válido no formato {\"title\":\"nome curto do documento\",\"html\":\"conteúdo HTML\",\"summary\":\"resumo curto\"}. No campo html use somente h1, h2, h3, h4, p, strong, em, u, ul, ol, li, blockquote, table, thead, tbody, tr, th, td, hr e br. Não use markdown, cercas de código, scripts, CSS, comentários ou texto fora do JSON. Preserve fatos fornecidos e marque dados essenciais ausentes como [PREENCHER].",
        "office-excel": "Você é o Assistente Excel do DocSpace. Gere uma planilha utilizável diretamente no editor. Retorne exclusivamente JSON válido no formato {\"fileName\":\"nome curto da planilha\",\"columns\":[\"Coluna 1\",\"Coluna 2\"],\"rows\":[[\"valor 1\",\"valor 2\"]],\"summary\":\"resumo curto\"}. columns contém os cabeçalhos e rows contém apenas as linhas de dados. Use fórmulas iniciadas por = quando forem úteis, preferindo SUM, AVERAGE, MIN, MAX e COUNT. Não use markdown, cercas de código, objetos dentro das células nem texto fora do JSON. Não invente dados objetivos que o usuário não forneceu; use exemplos claramente identificáveis ou [PREENCHER].",
        "office-powerpoint": "Você é o diretor de apresentações do DocSpace. Crie uma apresentação VISUAL de verdade, não um documento dividido em tópicos. Retorne exclusivamente JSON válido no formato {\"fileName\":\"nome curto\",\"theme\":\"executive\",\"slides\":[{\"layout\":\"cover\",\"kicker\":\"CHAMADA CURTA\",\"title\":\"Título forte\",\"subtitle\":\"Subtítulo\",\"body\":\"parágrafo curto quando necessário\",\"bullets\":[],\"cards\":[{\"title\":\"Título\",\"text\":\"Explicação curta\",\"icon\":\"lightbulb\"}],\"metrics\":[{\"value\":\"42%\",\"label\":\"descrição\"}],\"timeline\":[{\"title\":\"Etapa 1\",\"text\":\"descrição\"}],\"quote\":\"citação\",\"author\":\"fonte\",\"imageQuery\":\"English stock photo search phrase\",\"icon\":\"presentation\",\"notes\":\"notas do apresentador\"}]}. Layouts permitidos: cover, image-right, image-left, cards, stats, timeline, quote, section, closing e content. Use pelo menos 4 layouts diferentes e não repita o mesmo layout em slides consecutivos. O primeiro slide deve ser cover. Não transforme todos os slides em listas: no máximo 3 tópicos em um slide e prefira cards, métricas, linha do tempo, imagem com texto, citação e seções. Pelo menos 60% dos slides devem ter imageQuery com termos objetivos EM INGLÊS para encontrar fotografia horizontal real; não use URLs e não peça logotipos, desenhos ou emojis. icon deve ser o nome de um ícone real desta lista: presentation, sparkles, brain-circuit, briefcase-business, chart-no-axes-combined, lightbulb, users, shield-check, target, rocket, globe-2, building-2, laptop, bot, graduation-cap, workflow, circle-check-big, triangle-alert, scale, heart-handshake, database, cloud, image, leaf, landmark, map-pin, wrench, hand-coins, book-open, layout-grid. Nunca use emoji. Use de 5 a 15 slides, ou exatamente a quantidade solicitada. Cada slide deve transmitir uma única ideia, com título forte e pouco texto. Para comparação use cards; para números use stats; para processo use timeline; para abertura use section; para mensagem final use closing. theme deve ser executive, ocean, dark, warm ou minimal. Não use markdown, cercas de código nem texto fora do JSON. Não invente estatísticas, datas, leis, pesquisas ou citações; quando faltar um dado escreva [DADO A INSERIR].",
        "extract-fields": "Faça leitura visual cuidadosa de todos os anexos e extraia somente campos claramente identificáveis. Retorne exclusivamente um objeto JSON no formato {\"fields\":{\"nome_do_campo\":\"valor\"},\"unreadable\":[\"...\"],\"conflicts\":[\"...\"],\"notes\":[\"...\"]}. Use apenas chaves permitidas, valores em texto simples e arrays de strings. Não use markdown, não inclua explicações fora do JSON, não adivinhe dígitos e não troque dados entre pessoas diferentes.",
    };

    base.push(instructions[action]);
    const documentType = String(context.documentType || "").trim();
    if (documentType) base.push(`Tipo de documento informado: ${documentType}.`);
    const templateFields = Array.isArray(context.templateFields) ? context.templateFields.slice(0, 200) : [];
    if (templateFields.length) base.push(`Campos permitidos no modelo: ${templateFields.join(", ")}. Ignore qualquer chave que não esteja nesta lista.`);
    const templateFieldLabels = context.templateFieldLabels && typeof context.templateFieldLabels === "object" ? context.templateFieldLabels : {};
    const labelLines = Object.entries(templateFieldLabels).slice(0, 200).map(([key, label]) => `${key} = ${String(label)}`);
    if (labelLines.length) base.push(`Significado dos campos: ${labelLines.join("; ")}.`);
    const templateChoices = context.templateChoices && typeof context.templateChoices === "object" ? context.templateChoices : {};
    const choiceLines = Object.entries(templateChoices).slice(0, 50).map(([key, options]) => {
        const values = Array.isArray(options) ? options.map((option) => `${String(option?.value || "")} (${String(option?.label || option?.value || "")})`).filter(Boolean) : [];
        return values.length ? `${key}: ${values.join(", ")}` : "";
    }).filter(Boolean);
    if (choiceLines.length) base.push(`Valores válidos para campos de escolha: ${choiceLines.join("; ")}. Se não for possível determinar, deixe o campo ausente no JSON.`);
    const availableTemplates = Array.isArray(context.availableTemplates) ? context.availableTemplates.slice(0, 120) : [];
    if (availableTemplates.length) {
        const names = availableTemplates.map((item) => String(item?.title || item?.id || "").trim()).filter(Boolean).slice(0, 120);
        if (names.length) base.push(`O DocSpace possui estes modelos integrados: ${names.join("; ")}. Quando o pedido corresponder a um deles, siga a estrutura profissional adequada desse tipo de documento.`);
    }
    const outputFormats = Array.isArray(context.outputFormats) ? context.outputFormats.join(", ") : "";
    if (outputFormats) base.push(`A interface permitirá baixar sua resposta nos formatos: ${outputFormats}. Entregue o conteúdo final completo, sem comentários antes ou depois quando o usuário pedir um documento.`);
    if (action === "office-word") {
        const operation = String(context.operation || "replace").slice(0, 30);
        const currentFileName = String(context.currentFileName || "Documento").slice(0, 120);
        const currentContent = String(context.currentContent || "").slice(0, 18000);
        base.push(`Destino: editor Word. Operação solicitada: ${operation}. Nome atual: ${currentFileName}.`);
        if (currentContent) base.push(`Conteúdo atual do documento, para contexto e eventual revisão:\n${currentContent}`);
    }
    if (action === "office-excel") {
        const operation = String(context.operation || "replace").slice(0, 30);
        const currentFileName = String(context.currentFileName || "Planilha").slice(0, 120);
        let currentSheet = "";
        try { currentSheet = JSON.stringify(Array.isArray(context.currentSheet) ? context.currentSheet.slice(0, 120) : []).slice(0, 18000); } catch (_) {}
        base.push(`Destino: editor Excel. Operação solicitada: ${operation}. Nome atual: ${currentFileName}.`);
        if (currentSheet && currentSheet !== "[]") base.push(`Dados atuais da planilha, para contexto:\n${currentSheet}`);
    }
    if (action === "office-powerpoint") {
        const operation = String(context.operation || "replace").slice(0, 30);
        const currentFileName = String(context.currentFileName || "Apresentação").slice(0, 120);
        let currentSlides = "";
        try { currentSlides = JSON.stringify(Array.isArray(context.currentSlides) ? context.currentSlides.slice(0, 20) : []).slice(0, 18000); } catch (_) {}
        base.push(`Destino: editor PowerPoint. Operação solicitada: ${operation}. Nome atual: ${currentFileName}.`);
        base.push("Crie uma narrativa clara: abertura, contexto, desenvolvimento, evidências ou exemplos, conclusão e chamada para ação quando aplicável.");
        if (currentSlides && currentSlides !== "[]") base.push(`Slides atuais, para contexto e eventual continuação:\n${currentSlides}`);
    }
    if (context.hasAttachments) base.push(`Existem ${Number(context.imageCount || 0)} imagem(ns) anexada(s). Examine frente e verso, compare informações repetidas entre páginas e preserve exatamente a grafia e os números visíveis. Um CPF ou RG parcialmente oculto deve ser omitido e registrado em unreadable, nunca completado por padrão.`);
    return base.join("\n");
}

function extractAiContent(data) {
    const openAiContent = data?.choices?.[0]?.message?.content;
    if (typeof openAiContent === "string") return openAiContent.trim();
    if (Array.isArray(openAiContent)) {
        const joined = openAiContent.map((part) => typeof part === "string" ? part : String(part?.text || part?.content || "")).filter(Boolean).join("\n").trim();
        if (joined) return joined;
    }
    if (typeof data?.output_text === "string") return data.output_text.trim();
    if (typeof data?.text === "string") return data.text.trim();
    if (typeof data?.response === "string") return data.response.trim();
    return "";
}

function match(path, expected) {
    return path.length === expected.length && expected.every((part, index) => part === path[index]);
}

function normalizeEmail(email) {
    const value = String(email || "").trim().toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : "";
}

async function updateProfileAvatar(request, env, user) {
    const body = await readJson(request);
    const avatarDataUrl = normalizeProfileAvatar(body.avatarDataUrl);
    const now = new Date().toISOString();

    await env.DB.prepare("UPDATE users SET avatar_data_url = ?, updated_at = ? WHERE id = ?")
        .bind(avatarDataUrl, now, user.id)
        .run();
    await logAction(env, user.id, avatarDataUrl ? "update_profile_avatar" : "remove_profile_avatar", user.id);

    return json({
        user: publicUser(await getUserById(env, user.id)),
        message: avatarDataUrl ? "Foto de perfil atualizada com sucesso." : "Foto de perfil removida.",
    });
}

function normalizeProfileAvatar(value) {
    const dataUrl = String(value || "").trim();

    if (!dataUrl) {
        return "";
    }

    const match = dataUrl.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/i);

    if (!match) {
        throw httpError(400, "Envie uma foto JPG, PNG ou WEBP valida.");
    }

    const encoded = match[2];

    if (encoded.length > Math.ceil(MAX_PROFILE_AVATAR_BYTES * 4 / 3) + 4) {
        throw httpError(413, "A foto de perfil ficou muito grande. Escolha outra imagem.");
    }

    try {
        if (base64Decode(encoded).byteLength > MAX_PROFILE_AVATAR_BYTES) {
            throw httpError(413, "A foto de perfil ficou muito grande. Escolha outra imagem.");
        }
    } catch (error) {
        if (error.status) {
            throw error;
        }

        throw httpError(400, "Envie uma foto JPG, PNG ou WEBP valida.");
    }

    return `data:image/${match[1].toLowerCase()};base64,${encoded}`;
}

function getCookie(request, name) {
    const cookie = request.headers.get("Cookie") || "";
    const parts = cookie.split(";").map((part) => part.trim());
    const found = parts.find((part) => part.startsWith(`${name}=`));
    return found ? decodeURIComponent(found.slice(name.length + 1)) : "";
}

function getBearerToken(request) {
    const authorization = request.headers.get("Authorization") || "";
    const match = authorization.match(/^Bearer\s+(.+)$/i);
    return match ? match[1].trim() : "";
}

function buildSessionCookie(request, token) {
    const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
    return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}${secure}`;
}

function clearSessionCookie(request) {
    const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
    return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}

function base64Encode(bytes) {
    let text = "";
    bytes.forEach((byte) => {
        text += String.fromCharCode(byte);
    });
    return btoa(text);
}

function base64Decode(value) {
    const text = atob(value);
    return Uint8Array.from(text, (char) => char.charCodeAt(0));
}

function base64UrlEncode(text) {
    return base64UrlEncodeBytes(new TextEncoder().encode(text));
}

function base64UrlEncodeBytes(bytes) {
    return base64Encode(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value) {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
    return atob(normalized);
}

function utf8(value) {
    return new TextEncoder().encode(value);
}

function constantTimeEqual(a, b) {
    if (a.length !== b.length) {
        return false;
    }

    let diff = 0;

    for (let index = 0; index < a.length; index += 1) {
        diff |= a[index] ^ b[index];
    }

    return diff === 0;
}

// ═══════════════════════════════════════════════════════════════════════════
// Product features: share links and administrative templates
// ═══════════════════════════════════════════════════════════════════════════

function productNow() {
    return new Date().toISOString();
}

function productParseJson(value, fallback) {
    try {
        if (value == null || value === "") return fallback;
        return typeof value === "object" ? value : JSON.parse(value);
    } catch (_) {
        return fallback;
    }
}

function productStringify(value) {
    return JSON.stringify(value ?? {});
}

function mapShareLink(row, { includeToken = true } = {}) {
    if (!row) return null;
    const item = {
        id: row.id,
        ownerUserId: row.owner_user_id,
        documentType: row.document_type,
        title: row.title || "",
        formData: productParseJson(row.form_data, {}),
        allowedFields: productParseJson(row.allowed_fields, []),
        status: row.status || "open",
        expiresAt: row.expires_at,
        submittedAt: row.submitted_at,
        submitterName: row.submitter_name || "",
        submitterEmail: row.submitter_email || "",
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
    if (includeToken) item.token = row.token;
    return item;
}

async function listShareLinks(env, userId) {
    const rows = await env.DB.prepare(
        "SELECT * FROM share_fill_links WHERE owner_user_id = ? ORDER BY created_at DESC LIMIT 100"
    ).bind(userId).all();
    return (rows.results || []).map((row) => mapShareLink(row));
}

async function createShareLink(env, userId, body) {
    const documentType = String(body.documentType || body.document_type || "").trim();
    if (!documentType) throw httpError(400, "Informe documentType.");
    const days = Math.min(30, Math.max(1, Number(body.expiresInDays || 7) || 7));
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    const id = crypto.randomUUID();
    const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    const now = productNow();
    await env.DB.prepare(
        `INSERT INTO share_fill_links (
            id, token, owner_user_id, document_type, title, form_data, allowed_fields, status, expires_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'open', ?, ?, ?)`
    ).bind(
        id,
        token,
        userId,
        documentType,
        String(body.title || documentType).trim().slice(0, 200),
        productStringify(body.formData || body.form_data || {}),
        productStringify(body.allowedFields || body.allowed_fields || []),
        expiresAt,
        now,
        now
    ).run();
    const row = await env.DB.prepare("SELECT * FROM share_fill_links WHERE id = ?").bind(id).first();
    return mapShareLink(row);
}

async function closeShareLink(env, userId, id) {
    const now = productNow();
    const result = await env.DB.prepare(
        "UPDATE share_fill_links SET status = 'closed', updated_at = ? WHERE id = ? AND owner_user_id = ?"
    ).bind(now, id, userId).run();
    if (!result.meta?.changes) throw httpError(404, "Link nao encontrado.");
}

async function getPublicShareLink(env, token) {
    const row = await env.DB.prepare("SELECT * FROM share_fill_links WHERE token = ?").bind(String(token || "")).first();
    if (!row) throw httpError(404, "Link invalido ou expirado.");
    if (row.status !== "open") throw httpError(410, "Este link ja foi encerrado ou preenchido.");
    if (new Date(row.expires_at).getTime() < Date.now()) throw httpError(410, "Este link expirou.");
    return json({
        link: {
            title: row.title,
            documentType: row.document_type,
            formData: productParseJson(row.form_data, {}),
            allowedFields: productParseJson(row.allowed_fields, []),
            expiresAt: row.expires_at,
            status: row.status,
        },
    });
}

async function submitPublicShareLink(env, token, body) {
    const row = await env.DB.prepare("SELECT * FROM share_fill_links WHERE token = ?").bind(String(token || "")).first();
    if (!row) throw httpError(404, "Link invalido ou expirado.");
    if (row.status !== "open") throw httpError(410, "Este link ja foi encerrado ou preenchido.");
    if (new Date(row.expires_at).getTime() < Date.now()) throw httpError(410, "Este link expirou.");

    const incoming = body.formData || body.form_data || {};
    if (!incoming || typeof incoming !== "object") throw httpError(400, "Envie formData.");
    const allowed = productParseJson(row.allowed_fields, []);
    const merged = { ...productParseJson(row.form_data, {}) };
    Object.entries(incoming).forEach(([key, value]) => {
        if (Array.isArray(allowed) && allowed.length && !allowed.includes(key)) return;
        merged[key] = value;
    });

    const now = productNow();
    // Privacidade: NÃO grava form_data / nome / e-mail do cliente no D1.
    await env.DB.prepare(
        `UPDATE share_fill_links SET form_data='{}', status='submitted', submitted_at=?, submitter_name='', submitter_email='', updated_at=?
         WHERE id=?`
    ).bind(now, now, row.id).run();

    return json({
        message: "Recebido. Por privacidade os dados do formulario NAO sao salvos no servidor. Copie/guarde localmente se precisar.",
        submitted: true,
        // Devolve os dados só na resposta HTTP (não persiste) para o cliente copiar se quiser
        formData: merged,
    });
}

function mapCustomTemplate(row, { includeModel = false } = {}) {
    if (!row) return null;
    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        description: row.description || "",
        category: row.category || "outros",
        fields: productParseJson(row.fields_json, []),
        modelPath: row.model_path || "",
        hasModelFile: Boolean(row.model_base64),
        modelBase64: includeModel ? (row.model_base64 || "") : "",
        isActive: Boolean(row.is_active),
        createdBy: row.created_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        custom: true,
    };
}

async function getTemplatesCatalog(env, user, admin = false) {
    const customRows = await env.DB.prepare(
        admin
            ? "SELECT * FROM custom_document_templates ORDER BY updated_at DESC"
            : "SELECT * FROM custom_document_templates WHERE is_active = 1 ORDER BY title ASC"
    ).all();
    const settingsRows = await env.DB.prepare("SELECT * FROM template_settings").all();
    const settings = {};
    (settingsRows.results || []).forEach((row) => {
        settings[row.template_id] = { isActive: Boolean(row.is_active), updatedAt: row.updated_at };
    });
    // Usuários autenticados precisam do modelBase64 para gerar o DOCX no navegador.
    // No admin listamos com arquivo para edição; no catálogo normal também enviamos o binário.
    return {
        customTemplates: (customRows.results || []).map((row) => mapCustomTemplate(row, { includeModel: true })),
        settings,
    };
}

async function createCustomTemplate(env, adminUser, body) {
    const slug = String(body.slug || body.id || "").trim().toLowerCase().replace(/[^a-z0-9-_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    const title = String(body.title || "").trim();
    if (!slug || !title) throw httpError(400, "Informe slug e title do modelo.");
    const fields = Array.isArray(body.fields) ? body.fields : productParseJson(body.fields_json, []);
    if (!Array.isArray(fields) || !fields.length) throw httpError(400, "Informe ao menos um campo em fields.");
    const modelBase64 = String(body.modelBase64 || body.model_base64 || "").replace(/^data:[^;]+;base64,/, "");
    if (modelBase64 && modelBase64.length > 2.5 * 1024 * 1024) throw httpError(413, "Arquivo do modelo excede 2.5MB (base64).");
    const id = crypto.randomUUID();
    const now = productNow();
    try {
        await env.DB.prepare(
            `INSERT INTO custom_document_templates (
                id, slug, title, description, category, fields_json, model_path, model_base64, is_active, created_by, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            id,
            slug,
            title.slice(0, 180),
            String(body.description || "").trim().slice(0, 500),
            String(body.category || "outros").trim().slice(0, 40) || "outros",
            productStringify(fields),
            String(body.modelPath || body.model_path || "").trim().slice(0, 300),
            modelBase64,
            body.isActive === false ? 0 : 1,
            adminUser.id,
            now,
            now
        ).run();
    } catch (error) {
        if (String(error.message || "").toLowerCase().includes("unique")) {
            throw httpError(409, "Ja existe um modelo com este slug.");
        }
        throw error;
    }
    const row = await env.DB.prepare("SELECT * FROM custom_document_templates WHERE id = ?").bind(id).first();
    return mapCustomTemplate(row, { includeModel: false });
}

async function updateCustomTemplate(env, adminUser, id, body) {
    const existing = await env.DB.prepare("SELECT * FROM custom_document_templates WHERE id = ?").bind(id).first();
    if (!existing) throw httpError(404, "Modelo customizado nao encontrado.");
    const fields = body.fields != null ? (Array.isArray(body.fields) ? body.fields : productParseJson(body.fields_json, [])) : productParseJson(existing.fields_json, []);
    let modelBase64 = existing.model_base64 || "";
    if (body.modelBase64 != null || body.model_base64 != null) {
        modelBase64 = String(body.modelBase64 || body.model_base64 || "").replace(/^data:[^;]+;base64,/, "");
        if (modelBase64 && modelBase64.length > 2.5 * 1024 * 1024) throw httpError(413, "Arquivo do modelo excede 2.5MB (base64).");
    }
    const now = productNow();
    await env.DB.prepare(
        `UPDATE custom_document_templates SET title=?, description=?, category=?, fields_json=?, model_path=?, model_base64=?, is_active=?, updated_at=? WHERE id=?`
    ).bind(
        String(body.title != null ? body.title : existing.title).trim().slice(0, 180),
        String(body.description != null ? body.description : existing.description || "").trim().slice(0, 500),
        String(body.category != null ? body.category : existing.category || "outros").trim().slice(0, 40),
        productStringify(fields),
        String(body.modelPath != null ? body.modelPath : body.model_path != null ? body.model_path : existing.model_path || "").trim().slice(0, 300),
        modelBase64,
        body.isActive === false || body.is_active === 0 ? 0 : 1,
        now,
        id
    ).run();
    const row = await env.DB.prepare("SELECT * FROM custom_document_templates WHERE id = ?").bind(id).first();
    return mapCustomTemplate(row, { includeModel: false });
}

async function deleteCustomTemplate(env, adminUser, id) {
    const result = await env.DB.prepare("DELETE FROM custom_document_templates WHERE id = ?").bind(id).run();
    if (!result.meta?.changes) throw httpError(404, "Modelo customizado nao encontrado.");
    await logAction(env, adminUser.id, "delete_custom_template", null, { templateId: id });
}

async function setTemplateSetting(env, adminUser, body) {
    const templateId = String(body.templateId || body.template_id || "").trim();
    if (!templateId) throw httpError(400, "Informe templateId.");
    const isActive = body.isActive === false || body.is_active === 0 ? 0 : 1;
    const now = productNow();
    await env.DB.prepare(
        `INSERT INTO template_settings (template_id, is_active, updated_at, updated_by) VALUES (?, ?, ?, ?)
         ON CONFLICT(template_id) DO UPDATE SET is_active=excluded.is_active, updated_at=excluded.updated_at, updated_by=excluded.updated_by`
    ).bind(templateId, isActive, now, adminUser.id).run();
    return { templateId, isActive: Boolean(isActive), updatedAt: now };
}
