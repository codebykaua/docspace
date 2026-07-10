-- Histórico de documentos: metadados no D1, arquivo binário no R2
-- (não guarda PDF/DOCX em base64 no banco)

ALTER TABLE document_history ADD COLUMN file_key TEXT NOT NULL DEFAULT '';
ALTER TABLE document_history ADD COLUMN file_size INTEGER NOT NULL DEFAULT 0;
ALTER TABLE document_history ADD COLUMN mime_type TEXT NOT NULL DEFAULT '';
ALTER TABLE document_history ADD COLUMN storage_provider TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_document_history_file_key ON document_history(file_key);

-- Assinaturas: PDF assinado também no R2 (não no D1)
ALTER TABLE document_signatures ADD COLUMN file_key TEXT NOT NULL DEFAULT '';
ALTER TABLE document_signatures ADD COLUMN file_size INTEGER NOT NULL DEFAULT 0;
