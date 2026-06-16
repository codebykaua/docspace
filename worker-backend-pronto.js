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
const MAX_PREVIEW_DOCX_BASE64_LENGTH = 14 * 1024 * 1024;
const MAX_PDF_TOOL_BASE64_LENGTH = 70 * 1024 * 1024;
const SERVER_PDF_TOOL_TYPES = new Set(["compress", "ocr"]);
const MAX_PROFILE_AVATAR_BYTES = 350 * 1024;
const DEFAULT_DAILY_DOCUMENT_LIMIT = 5;
const DEFAULT_DAILY_PDF_TOOL_LIMIT = 5;
const DAILY_DOCUMENT_RESET_HOUR = 4;
const DAILY_DOCUMENT_RESET_MINUTE = 0;
const DAILY_DOCUMENT_TIME_ZONE = "America/Sao_Paulo";
const PASSWORD_ITERATIONS = 100000;
const PASSWORD_ALGORITHM = "PBKDF2";
const PASSWORD_HASH = "SHA-256";
const MERCADO_PAGO_API_BASE = "https://api.mercadopago.com";
const BILLING_PROVIDER = "mercado_pago";
const BILLING_PLAN_PRICES = {
    basic30: {
        amount: 39.90,
        currency: "BRL",
        title: "DocSpace - Plano Basico 30 dias",
    },
    test10c: {
        amount: 0.10,
        currency: "BRL",
        title: "DocSpace - Teste Mercado Pago R$ 0,10",
    },
    proMax365: {
        amount: 490.90,
        currency: "BRL",
        title: "DocSpace - Plano Pro Max 365 dias",
    },
};
let schemaReady = false;

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
    "comodato",
    "ufba-membros",
    "renda-membros",
    "posse",
    "autodeclaracao-rural",
    "procuracao-consumidor",
    "procuracao-normal",
    "contrato-honorarios-50",
    "contrato-prev-40",
    "contrato-prev-30",
    "contrato-compra-venda-imovel",
    "contrato-compra-venda-veiculo",
    "cadastro-confrontantes",
    "controle-producao-anual",
    "controle-rebanho",
    "inventario-producao-rural",
    "contrato-arrendamento-rural",
    "contrato-comodato-equipamentos",
    "contrato-parceria-rural",
    "declaracao-posse-mansa-pacifica",
    "declaracao-residencia",
    "declaracao-nao-possuir-renda",
    "declaracao-agricultura-familiar",
    "declaracao-dependencia-economica",
    "declaracao-convivencia-familiar",
    "declaracao-baixa-renda",
    "declaracao-autenticidade-documentos",
    "declaracao-atividade-rural",
    "declaracao-uniao-estavel",
    "declaracao-tempo-trabalho-rural",
]);
const USER_DOCUMENT_ACCESS_TYPES = new Set([...DOCUMENT_GENERATION_TYPES, "pdf-local"]);
const PDF_TOOL_TYPES = new Set([
    "merge",
    "split",
    "organize",
    "remove",
    "extract",
    "rotate",
    "compress",
    "images",
    "wordPdf",
    "ocr",
]);

async function onRequest(context) {
    const { request, env } = context;

    if (request.method === "OPTIONS") {
        return createCorsPreflightResponse(request);
    }

    try {
        const response = await handleRequest(request, env);
        return withCors(request, response);
    } catch (error) {
        console.error(error);
        const status = error.status || 500;
        const message = status === 500 ? `Erro interno da API: ${error.message}` : error.message;
        return withCors(request, json({ message }, status, error.headers));
    }
}

async function handleRequest(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);

    if (request.method === "GET" && (path.length === 0 || match(path, ["setup-admin"]))) {
        return html(getSetupAdminPage());
    }

    if (!env.DB) {
        return json({ message: "Banco D1 nao configurado. Confira o binding DB no Cloudflare." }, 500);
    }

    await ensureDatabaseSchema(env);
    await expireOverdueUsers(env);

    if (request.method === "POST" && match(path, ["setup"])) {
        return setupFirstAdmin(request, env);
    }

    if (request.method === "POST" && match(path, ["auth", "login"])) {
        return login(request, env);
    }

    if (request.method === "POST" && match(path, ["auth", "logout"])) {
        return logout(request);
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

    if (request.method === "GET" && match(path, ["documents", "usage"])) {
        const session = await requireSession(request, env);
        return json({ documentUsage: await getDocumentUsageSummary(env, session.user) });
    }

    if (request.method === "GET" && match(path, ["pdf-tools", "usage"])) {
        const session = await requireSession(request, env);
        return json({ pdfToolUsage: await getPdfToolUsageSummary(env, session.user) });
    }

    if (request.method === "GET" && match(path, ["app-release"])) {
        return json({ release: await getLatestAppRelease(env) });
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

    if (request.method === "GET" && match(path, ["admin", "app-release"])) {
        await requireAdmin(request, env);
        return json({ release: await getLatestAppRelease(env) });
    }

    if (request.method === "POST" && match(path, ["admin", "app-release"])) {
        const session = await requireAdmin(request, env);
        const body = await readJson(request);
        const release = await createAppRelease(env, body, session.user);
        return json({ release, message: "Aviso de atualização publicado." }, 201);
    }

    if (request.method === "DELETE" && match(path, ["admin", "app-release"])) {
        const session = await requireAdmin(request, env);
        const deletedCount = await deleteAppRelease(env, session.user);
        return json({ deletedCount, release: null, message: "Aviso de atualização removido." });
    }

    if (request.method === "POST" && match(path, ["admin", "users"])) {
        const session = await requireAdmin(request, env);
        const body = await readJson(request);
        const user = await createManagedUser(env, body, session.user);
        return json({ user, message: "Login criado com sucesso." }, 201);
    }

    if (request.method === "PUT" && path.length === 3 && path[0] === "admin" && path[1] === "users") {
        const session = await requireAdmin(request, env);
        const body = await readJson(request);
        const user = await updateManagedUser(env, path[2], body, session.user);
        return json({ user, message: "Login atualizado com sucesso." });
    }

    if (request.method === "POST" && path.length === 4 && path[0] === "admin" && path[1] === "users" && path[3] === "actions") {
        const session = await requireAdmin(request, env);
        const body = await readJson(request);
        const user = await runUserAction(env, path[2], body.action, session.user, body);
        return json({ user, message: "Acesso atualizado com sucesso." });
    }

    if (request.method === "POST" && match(path, ["documents", "preview-pdf"])) {
        const session = await requireSession(request, env);
        return previewDocumentAsPdf(request, env, session.user);
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
            daily_document_limit INTEGER NOT NULL DEFAULT 5,
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
        `CREATE TABLE IF NOT EXISTS app_releases (
            id TEXT PRIMARY KEY,
            platform TEXT NOT NULL DEFAULT 'android',
            version_name TEXT NOT NULL DEFAULT '',
            update_message TEXT NOT NULL DEFAULT '',
            download_url TEXT NOT NULL DEFAULT '',
            notes TEXT NOT NULL DEFAULT '',
            is_active INTEGER NOT NULL DEFAULT 1,
            file_name TEXT NOT NULL DEFAULT '',
            file_type TEXT NOT NULL DEFAULT '',
            file_extension TEXT NOT NULL DEFAULT '',
            file_size INTEGER NOT NULL DEFAULT 0,
            file_data TEXT NOT NULL DEFAULT '',
            uploaded_by_user_id TEXT,
            created_at TEXT NOT NULL
        )`,
        "CREATE INDEX IF NOT EXISTS idx_app_releases_platform_created_at ON app_releases(platform, created_at)",
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
    ];

    for (const statement of statements) {
        await env.DB.prepare(statement).run();
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
    await ensureAppReleaseColumn(env, "update_message", "TEXT NOT NULL DEFAULT ''");
    await ensureAppReleaseColumn(env, "download_url", "TEXT NOT NULL DEFAULT ''");
    await ensureAppReleaseColumn(env, "is_active", "INTEGER NOT NULL DEFAULT 1");
    schemaReady = true;
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

async function ensureAppReleaseColumn(env, columnName, definition) {
    const result = await env.DB.prepare("PRAGMA table_info(app_releases)").all();
    const columns = result.results || [];

    if (columns.some((column) => column.name === columnName)) {
        return;
    }

    try {
        await env.DB.prepare(`ALTER TABLE app_releases ADD COLUMN ${columnName} ${definition}`).run();
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

    const user = await getUserByEmail(env, email);

    if (!user || !(await verifyPassword(password, user.password_hash))) {
        throw httpError(401, "E-mail ou senha incorretos.");
    }

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
    await logAction(env, user.id, "login", user.id, { email: user.email });

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

function logout(request) {
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

    return json({ documentUsage: await consumeDocumentUsageForUser(env, user, documentType) });
}

async function consumeDocumentUsageForUser(env, user, documentType) {
    assertDocumentAccessAllowed(user, documentType);

    if (!isDocumentUsageLimited(user)) {
        await logAction(env, user.id, "generate_document", user.id, { documentType });
        return getDocumentUsageSummary(env, user);
    }

    await ensureDocumentQuotaBalances(env, user);
    const now = new Date().toISOString();
    const result = await env.DB.prepare(`
        UPDATE document_quota_balances
        SET available_count = available_count - 1, updated_at = ?
        WHERE user_id = ?
          AND document_type = ?
          AND available_count > 0
    `).bind(now, user.id, documentType).run();
    const changes = Number(result.meta?.changes ?? result.changes ?? 0);

    if (changes === 0) {
        throw createDailyDocumentLimitError();
    }

    await logAction(env, user.id, "generate_document", user.id, { documentType });
    return getDocumentUsageSummary(env, user);
}

async function assertDocumentUsageAvailable(env, user, documentType) {
    assertDocumentAccessAllowed(user, documentType);

    if (!isDocumentUsageLimited(user)) {
        return;
    }

    const usage = await getDocumentUsageSummary(env, user);

    if (Number(usage.documents?.[documentType]?.remaining || 0) <= 0) {
        throw createDailyDocumentLimitError();
    }
}

function createDailyDocumentLimitError() {
    return httpError(429, `Sem geracoes disponiveis para este documento. A renovacao diaria adiciona saldo as ${formatDailyDocumentResetTime()} de Brasilia.`, {
        "X-Error-Code": "DAILY_DOCUMENT_LIMIT",
    });
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
            dailyAdd: null,
            renewalEnabled: true,
            documents: {},
        };
    }

    await ensureDocumentQuotaBalances(env, user, usageCycle);

    const result = await env.DB.prepare(`
        SELECT document_type, available_count, last_renewal_key
        FROM document_quota_balances
        WHERE user_id = ?
    `).bind(user.id).all();
    const documents = {};

    DOCUMENT_GENERATION_TYPES.forEach((documentType) => {
        documents[documentType] = {
            used: 0,
            remaining: 0,
            available: 0,
            blocked: true,
            lastRenewalKey: usageCycle.date,
        };
    });

    (result.results || []).forEach((row) => {
        if (!DOCUMENT_GENERATION_TYPES.has(row.document_type)) {
            return;
        }

        const remaining = Math.max(0, Number(row.available_count || 0));
        documents[row.document_type] = {
            used: Math.max(0, dailyLimit - Math.min(dailyLimit, remaining)),
            remaining,
            available: remaining,
            blocked: remaining === 0,
            lastRenewalKey: row.last_renewal_key || usageCycle.date,
        };
    });

    return {
        date: usageCycle.date,
        nextResetAt: usageCycle.nextResetAt,
        nextRenewalAt: usageCycle.nextResetAt,
        resetHour: DAILY_DOCUMENT_RESET_HOUR,
        resetMinute: DAILY_DOCUMENT_RESET_MINUTE,
        unlimited: false,
        limit: dailyLimit,
        dailyAdd: dailyLimit,
        renewalEnabled,
        documents,
    };
}

async function ensureDocumentQuotaBalances(env, user, usageCycle = getUsageCycle()) {
    if (!isDocumentUsageLimited(user)) {
        return;
    }

    const dailyLimit = getDailyDocumentLimit(user);
    const renewalEnabled = isDailyQuotaRenewalEnabled(user);
    const now = new Date().toISOString();
    const currentKey = usageCycle.date;
    const result = await env.DB.prepare(`
        SELECT document_type, available_count, last_renewal_key
        FROM document_quota_balances
        WHERE user_id = ?
    `).bind(user.id).all();
    const balances = new Map((result.results || [])
        .filter((row) => DOCUMENT_GENERATION_TYPES.has(row.document_type))
        .map((row) => [row.document_type, row]));

    for (const documentType of DOCUMENT_GENERATION_TYPES) {
        const row = balances.get(documentType);

        if (!row) {
            await env.DB.prepare(`
                INSERT INTO document_quota_balances (
                    user_id, document_type, available_count, last_renewal_key, updated_at
                )
                VALUES (?, ?, ?, ?, ?)
            `).bind(user.id, documentType, renewalEnabled ? dailyLimit : 0, currentKey, now).run();
            continue;
        }

        const lastKey = String(row.last_renewal_key || "");

        if (!renewalEnabled) {
            if (lastKey !== currentKey) {
                await env.DB.prepare(`
                    UPDATE document_quota_balances
                    SET last_renewal_key = ?, updated_at = ?
                    WHERE user_id = ? AND document_type = ?
                `).bind(currentKey, now, user.id, documentType).run();
            }
            continue;
        }

        const missingDays = countUsageCyclesBetween(lastKey, currentKey);

        if (missingDays <= 0) {
            continue;
        }

        await env.DB.prepare(`
            UPDATE document_quota_balances
            SET available_count = MAX(0, available_count) + ?,
                last_renewal_key = ?,
                updated_at = ?
            WHERE user_id = ? AND document_type = ?
        `).bind(missingDays * dailyLimit, currentKey, now, user.id, documentType).run();
    }
}

function isDocumentUsageLimited(user) {
    return !user?.is_admin && LIMITED_DOCUMENT_PLANS.has(normalizePlanId(user?.plan));
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

    return json({ pdfToolUsage: await consumePdfToolUsageForUser(env, user, toolType) });
}

async function consumePdfToolUsageForUser(env, user, toolType) {
    assertPdfToolAccessAllowed(user, toolType);

    if (user.is_admin) {
        await logAction(env, user.id, "use_pdf_tool", user.id, { toolType });
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

    await logAction(env, user.id, "use_pdf_tool", user.id, { toolType });
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
    const fileName = String(body.fileName || "documento.pdf").trim();
    const options = body.options && typeof body.options === "object" ? body.options : {};

    if (!SERVER_PDF_TOOL_TYPES.has(toolType)) {
        throw httpError(400, "Ferramenta PDF do servidor invalida.");
    }

    if (!fileBase64 || fileBase64.length > MAX_PDF_TOOL_BASE64_LENGTH) {
        throw httpError(400, "Arquivo PDF invalido ou grande demais para processamento no servidor.");
    }

    assertPdfToolAccessAllowed(user, toolType);

    const renderApiUrl = env.RENDER_API_URL || "https://gerador-de-documentos-1.onrender.com";
    const renderPath = toolType === "compress" ? "/api/pdf/compress" : "/api/pdf/ocr";
    const headers = { "Content-Type": "application/json" };

    if (env.RENDER_API_SECRET) {
        headers["X-Render-Secret"] = env.RENDER_API_SECRET;
    }

    try {
        const response = await fetch(`${renderApiUrl}${renderPath}`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                fileBase64,
                fileName,
                level: options.level || "balanced",
                language: options.language || "por",
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error(`Erro do Render PDF ${toolType}: ${response.status} - ${error}`);
            throw httpError(502, "Servico de PDF falhou. Tente novamente.");
        }

        const result = await response.json();

        if (!result.success || !result.pdfBase64) {
            throw httpError(500, "Servico de PDF retornou dados invalidos.");
        }

        const pdfToolUsage = await consumePdfToolUsageForUser(env, user, toolType);
        await logAction(env, user.id, "process_pdf_tool", user.id, {
            toolType,
            strategy: result.strategy || null,
            originalBytes: result.originalBytes || null,
            outputBytes: result.outputBytes || null,
            hadText: result.hadText === true,
        });

        return json({
            success: true,
            pdfBase64: result.pdfBase64,
            fileName: result.fileName || `${toolType}.pdf`,
            message: result.message || "PDF processado com sucesso.",
            strategy: result.strategy || null,
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
        throw httpError(502, "Nao foi possivel processar o PDF no servidor.");
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

        const documentUsage = await consumeDocumentUsageForUser(env, user, templatePath);
        await logAction(env, user.id, "preview_pdf", null, { documentType: templatePath });

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
    const identity = await getOptionalSupportIdentity(request, env);
    const body = await readJson(request);
    const user = identity?.user || null;
    const customerName = String(user?.name || body.name || "").trim();
    const customerEmail = normalizeEmail(user?.email || body.email);
    const message = String(body.message || "").trim();
    const attachment = normalizeSupportAttachment(body.attachment);

    if (!customerName || !customerEmail) {
        throw httpError(400, "Informe nome e e-mail validos para falar com o suporte.");
    }

    if (!message && !attachment) {
        throw httpError(400, "Digite uma mensagem ou anexe um comprovante.");
    }

    const saved = await insertSupportMessage(env, {
        userId: user?.id || null,
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
    const mercadoPagoPublicKey = String(env.MERCADO_PAGO_PUBLIC_KEY || "").trim();
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
            : "Pagamento criado. Configure MERCADO_PAGO_PUBLIC_KEY para exibir o pagamento dentro do DocSpace.",
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

    return buildBillingPaymentStatusResponse(
        request,
        env,
        user,
        current,
        current.status === "approved"
            ? "Pagamento aprovado. Seu plano foi renovado e o acesso foi liberado."
            : "Pagamento enviado ao Mercado Pago. Aguarde a confirmacao automatica."
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
    const payer = {
        ...payerFromBrick,
        email: String(payerFromBrick.email || user.email || "").trim(),
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

async function buildBillingPaymentStatusResponse(request, env, user, row, message) {
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
}

async function resetUserQuotasAfterPlanRenewal(env, user) {
    if (!user?.id) {
        return;
    }

    const now = new Date().toISOString();
    const usageCycle = getUsageCycle();

    if (isDocumentUsageLimited(user)) {
        const dailyLimit = getDailyDocumentLimit(user);
        for (const documentType of DOCUMENT_GENERATION_TYPES) {
            await env.DB.prepare(`
                INSERT INTO document_quota_balances (user_id, document_type, available_count, last_renewal_key, updated_at)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(user_id, document_type) DO UPDATE SET
                    available_count = excluded.available_count,
                    last_renewal_key = excluded.last_renewal_key,
                    updated_at = excluded.updated_at
            `).bind(user.id, documentType, dailyLimit, usageCycle.date, now).run();
        }
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
    const subject = "Resposta do atendimento - Gerador Rural Pro";
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
            name: String(env.EMAIL_FROM_NAME || "Gerador Rural Pro"),
        },
        subject: String(options.subject || "Atendimento - Gerador Rural Pro").slice(0, 160),
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
    const fromName = String(env.EMAIL_FROM_NAME || "Gerador Rural Pro");
    const subject = String(options.subject || "Atendimento - Gerador Rural Pro").slice(0, 160);
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

    return `<!DOCTYPE html><html lang="pt-BR"><body style="margin:0;background:#f3f6fb;font-family:Arial,sans-serif;color:#102033;"><div style="max-width:620px;margin:0 auto;padding:28px 18px;"><div style="background:#ffffff;border:1px solid #d9e3f0;border-radius:14px;padding:24px;"><p style="margin:0 0 8px;color:#2563eb;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">Gerador Rural Pro</p><h1 style="margin:0 0 18px;font-size:22px;line-height:1.25;">${safeTitle}</h1><p style="margin:0;font-size:15px;line-height:1.6;">${safeText}</p></div></div></body></html>`;
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

async function createAppRelease(env, body, actor) {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const versionName = String(body.versionName || "").trim().slice(0, 80);
    const updateMessage = String(body.message || body.updateMessage || "").trim().slice(0, 900);
    const downloadUrl = normalizeAppDownloadUrl(body.downloadUrl);

    await env.DB.prepare("DELETE FROM app_releases WHERE platform = 'android'").run();

    await env.DB.prepare(`
        INSERT INTO app_releases (
            id, platform, version_name, update_message, download_url, notes,
            file_name, file_type, file_extension, file_size, file_data,
            uploaded_by_user_id, created_at
        )
        VALUES (?, 'android', ?, ?, ?, ?, '', '', '', 0, '', ?, ?)
    `).bind(
        id,
        versionName,
        updateMessage || "Nova atualização disponível.",
        downloadUrl,
        updateMessage,
        actor?.id || null,
        createdAt
    ).run();

    await logAction(env, actor?.id || null, "publish_app_release", null, {
        downloadUrl,
        versionName,
        message: updateMessage,
    });

    return publicAppRelease({
        id,
        platform: "android",
        version_name: versionName,
        update_message: updateMessage || "Nova atualização disponível.",
        download_url: downloadUrl,
        notes: updateMessage,
        is_active: 1,
        file_name: "",
        file_type: "",
        file_extension: "",
        file_size: 0,
        uploaded_by_user_id: actor?.id || "",
        created_at: createdAt,
    });
}

async function deleteAppRelease(env, actor) {
    const result = await env.DB.prepare("DELETE FROM app_releases WHERE platform = 'android'").run();
    const deletedCount = Number(result.meta?.changes || 0);

    await logAction(env, actor?.id || null, "delete_app_release", null, { deletedCount });
    return deletedCount;
}

async function getLatestAppRelease(env) {
    const row = await env.DB.prepare(`
        SELECT id, platform, version_name, update_message, download_url, notes,
               is_active, file_name, file_type, file_extension, file_size,
               uploaded_by_user_id, created_at
        FROM app_releases
        WHERE platform = 'android' AND is_active = 1
        ORDER BY created_at DESC
        LIMIT 1
    `).first();

    return row ? publicAppRelease(row) : null;
}

function normalizeAppDownloadUrl(value) {
    const downloadUrl = String(value || "").trim();

    if (!downloadUrl) {
        throw httpError(400, "Informe o link de download do APK/APKS.");
    }

    let parsed;

    try {
        parsed = new URL(downloadUrl);
    } catch {
        throw httpError(400, "Informe um link de download valido.");
    }

    if (parsed.protocol !== "https:") {
        throw httpError(400, "Use um link HTTPS para o download do APK/APKS.");
    }

    return parsed.toString();
}

function publicAppRelease(row) {
    return {
        id: row.id,
        platform: row.platform || "android",
        versionName: row.version_name || "",
        message: row.update_message || row.notes || "",
        downloadUrl: row.download_url || "",
        notes: row.notes || row.update_message || "",
        isActive: row.is_active !== 0,
        fileName: row.file_name || "",
        fileType: row.file_type || "",
        fileExtension: row.file_extension || "",
        fileSize: Number(row.file_size || 0),
        uploadedByUserId: row.uploaded_by_user_id || "",
        createdAt: row.created_at,
    };
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

async function listUsers(env) {
    const result = await env.DB.prepare(`
        SELECT id, name, email, plan, plan_label, status, expires_at, is_admin, is_verified, allow_liquid_glass, daily_document_limit, daily_quota_renewal_enabled, allow_pdf_tools, pdf_tool_daily_limit, pdf_tool_quota_renewal_enabled, allowed_document_types, avatar_data_url, notes, created_at, updated_at, last_login_at
        FROM users
        ORDER BY email COLLATE NOCASE
    `).all();

    return (result.results || []).map(publicUser);
}

async function createManagedUser(env, body, actor) {
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

    await logAction(env, actor?.id || null, "create_user", id, { email: clean.email, plan: clean.plan, allowedDocuments: clean.allowedDocumentTypes.length });
    return publicUser(await getUserById(env, id));
}

async function updateManagedUser(env, id, body, actor) {
    const existing = await getUserById(env, id);

    if (!existing) {
        throw httpError(404, "Usuario nao encontrado.");
    }

    const clean = cleanUserInput(body, { requirePassword: false });
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

    await logAction(env, actor.id, "update_user", id, { email: clean.email, plan: clean.plan, status: clean.status, allowedDocuments: clean.allowedDocumentTypes.length });
    return publicUser(await getUserById(env, id));
}

async function runUserAction(env, id, action, actor, options = {}) {
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
    } else if (action === "addDocumentQuota") {
        const amount = normalizeQuotaAdjustmentAmount(options.amount);
        const documentType = normalizeQuotaDocumentType(options.documentType);
        await adjustDocumentQuotaNow(env, user, amount, documentType);
        await env.DB.prepare("UPDATE users SET updated_at = ? WHERE id = ?").bind(now, id).run();
        await logAction(env, actor.id, action, id, { amount, documentType });
        return publicUser(await getUserById(env, id));
    } else if (action === "subtractDocumentQuota") {
        const amount = normalizeQuotaAdjustmentAmount(options.amount);
        const documentType = normalizeQuotaDocumentType(options.documentType);
        await adjustDocumentQuotaNow(env, user, -amount, documentType);
        await env.DB.prepare("UPDATE users SET updated_at = ? WHERE id = ?").bind(now, id).run();
        await logAction(env, actor.id, action, id, { amount, documentType });
        return publicUser(await getUserById(env, id));
    } else if (action === "addPdfToolQuota") {
        const amount = normalizeQuotaAdjustmentAmount(options.amount);
        const toolType = normalizeQuotaPdfToolType(options.toolType);
        await adjustPdfToolQuotaNow(env, user, amount, toolType);
        await env.DB.prepare("UPDATE users SET updated_at = ? WHERE id = ?").bind(now, id).run();
        await logAction(env, actor.id, action, id, { amount, toolType });
        return publicUser(await getUserById(env, id));
    } else if (action === "subtractPdfToolQuota") {
        const amount = normalizeQuotaAdjustmentAmount(options.amount);
        const toolType = normalizeQuotaPdfToolType(options.toolType);
        await adjustPdfToolQuotaNow(env, user, -amount, toolType);
        await env.DB.prepare("UPDATE users SET updated_at = ? WHERE id = ?").bind(now, id).run();
        await logAction(env, actor.id, action, id, { amount, toolType });
        return publicUser(await getUserById(env, id));
    } else {
        throw httpError(400, "Acao invalida.");
    }

    const entries = Object.entries(updates);
    await env.DB.prepare(`UPDATE users SET ${entries.map(([key]) => `${key} = ?`).join(", ")} WHERE id = ?`)
        .bind(...entries.map(([, value]) => value), id)
        .run();

    await logAction(env, actor.id, action, id);
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
    const secret = String(env.APP_SECRET || "troque-este-segredo-em-producao");
    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
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

async function logAction(env, actorUserId, action, targetUserId, details = {}) {
    await env.DB.prepare(`
        INSERT INTO audit_logs (id, actor_user_id, action, target_user_id, details, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
        crypto.randomUUID(),
        actorUserId,
        action,
        targetUserId,
        JSON.stringify(details),
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

                message.textContent = "Administrador criado. Agora entre no painel com este e-mail e senha.";
                message.className = "message success";
                form.reset();
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

function createCorsPreflightResponse(request) {
    return withCors(request, new Response(null, { status: 204 }));
}

function withCors(request, response) {
    const headers = new Headers(response.headers);
    const origin = request.headers.get("Origin");

    if (origin) {
        headers.set("Access-Control-Allow-Origin", origin);
        headers.set("Access-Control-Allow-Credentials", "true");
        headers.set("Vary", "Origin");
    }

    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Billing-Token, X-Signature, X-Request-Id");
    headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");

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
