CREATE TABLE IF NOT EXISTS ai_conversations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_updated ON ai_conversations(user_id, updated_at);

CREATE TABLE IF NOT EXISTS ai_messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    mode TEXT NOT NULL,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_created ON ai_messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ai_messages_user_created ON ai_messages(user_id, created_at);

CREATE TABLE IF NOT EXISTS ai_usage_daily (
    user_id TEXT NOT NULL,
    usage_date TEXT NOT NULL,
    request_count INTEGER NOT NULL DEFAULT 0,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (user_id, usage_date)
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_daily_user_date ON ai_usage_daily(user_id, usage_date);

CREATE TABLE IF NOT EXISTS ai_user_settings (
    user_id TEXT PRIMARY KEY,
    enabled INTEGER NOT NULL DEFAULT 1,
    daily_limit INTEGER,
    updated_at TEXT NOT NULL,
    updated_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_ai_user_settings_updated_by ON ai_user_settings(updated_by);
