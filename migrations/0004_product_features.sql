-- DocSpace product features: people, drafts, history, share links, signatures, template catalog

CREATE TABLE IF NOT EXISTS people (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    cpf TEXT NOT NULL DEFAULT '',
    cnpj TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    rg TEXT NOT NULL DEFAULT '',
    birth_date TEXT NOT NULL DEFAULT '',
    nationality TEXT NOT NULL DEFAULT '',
    marital_status TEXT NOT NULL DEFAULT '',
    profession TEXT NOT NULL DEFAULT '',
    address_street TEXT NOT NULL DEFAULT '',
    address_number TEXT NOT NULL DEFAULT '',
    address_district TEXT NOT NULL DEFAULT '',
    address_city TEXT NOT NULL DEFAULT '',
    address_uf TEXT NOT NULL DEFAULT '',
    address_cep TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    extra_json TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_people_user ON people(user_id);
CREATE INDEX IF NOT EXISTS idx_people_user_name ON people(user_id, name);
CREATE INDEX IF NOT EXISTS idx_people_user_cpf ON people(user_id, cpf);

CREATE TABLE IF NOT EXISTS document_drafts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    document_type TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    form_data TEXT NOT NULL DEFAULT '{}',
    current_step INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_document_drafts_user_updated ON document_drafts(user_id, updated_at);
CREATE INDEX IF NOT EXISTS idx_document_drafts_user_type ON document_drafts(user_id, document_type);

CREATE TABLE IF NOT EXISTS document_history (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    document_type TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    form_data TEXT NOT NULL DEFAULT '{}',
    output_format TEXT NOT NULL DEFAULT 'docx',
    file_name TEXT NOT NULL DEFAULT '',
    draft_id TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_document_history_user_created ON document_history(user_id, created_at);

CREATE TABLE IF NOT EXISTS share_fill_links (
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
);

CREATE INDEX IF NOT EXISTS idx_share_fill_links_owner ON share_fill_links(owner_user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_share_fill_links_token ON share_fill_links(token);

CREATE TABLE IF NOT EXISTS document_signatures (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    history_id TEXT NOT NULL DEFAULT '',
    document_type TEXT NOT NULL DEFAULT '',
    file_name TEXT NOT NULL DEFAULT '',
    signer_name TEXT NOT NULL DEFAULT '',
    signer_email TEXT NOT NULL DEFAULT '',
    signature_data_url TEXT NOT NULL DEFAULT '',
    pdf_base64 TEXT NOT NULL DEFAULT '',
    ip_hint TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_document_signatures_user ON document_signatures(user_id, created_at);

CREATE TABLE IF NOT EXISTS custom_document_templates (
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
);

CREATE INDEX IF NOT EXISTS idx_custom_templates_active ON custom_document_templates(is_active);

CREATE TABLE IF NOT EXISTS template_settings (
    template_id TEXT PRIMARY KEY,
    is_active INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL,
    updated_by TEXT
);
