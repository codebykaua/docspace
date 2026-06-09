CREATE TABLE IF NOT EXISTS users (
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
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_expires_at ON users(expires_at);

CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    actor_user_id TEXT,
    action TEXT NOT NULL,
    target_user_id TEXT,
    details TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_user_id ON audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target_user_id ON audit_logs(target_user_id);

CREATE TABLE IF NOT EXISTS support_messages (
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
);

CREATE INDEX IF NOT EXISTS idx_support_messages_email ON support_messages(customer_email);
CREATE INDEX IF NOT EXISTS idx_support_messages_created_at ON support_messages(created_at);


CREATE TABLE IF NOT EXISTS billing_payments (
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
);

CREATE INDEX IF NOT EXISTS idx_billing_payments_user ON billing_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_payments_status ON billing_payments(status);
CREATE INDEX IF NOT EXISTS idx_billing_payments_external_reference ON billing_payments(external_reference);
CREATE INDEX IF NOT EXISTS idx_billing_payments_mp_payment ON billing_payments(mercado_pago_payment_id);

CREATE TABLE IF NOT EXISTS document_generation_usage (
    user_id TEXT NOT NULL,
    document_type TEXT NOT NULL,
    usage_date TEXT NOT NULL,
    generated_count INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (user_id, document_type, usage_date)
);

CREATE INDEX IF NOT EXISTS idx_document_generation_usage_user_date ON document_generation_usage(user_id, usage_date);

CREATE TABLE IF NOT EXISTS document_quota_balances (
    user_id TEXT NOT NULL,
    document_type TEXT NOT NULL,
    available_count INTEGER NOT NULL DEFAULT 0,
    last_renewal_key TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL,
    PRIMARY KEY (user_id, document_type)
);

CREATE INDEX IF NOT EXISTS idx_document_quota_balances_user ON document_quota_balances(user_id);

CREATE TABLE IF NOT EXISTS pdf_tool_quota_balances (
    user_id TEXT NOT NULL,
    tool_type TEXT NOT NULL,
    available_count INTEGER NOT NULL DEFAULT 0,
    last_renewal_key TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL,
    PRIMARY KEY (user_id, tool_type)
);

CREATE INDEX IF NOT EXISTS idx_pdf_tool_quota_balances_user ON pdf_tool_quota_balances(user_id);
