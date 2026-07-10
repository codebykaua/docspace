# Histórico de documentos fora do D1 (Appwrite Storage)

## Por quê?

O **D1** do Cloudflare tem limite de **~5 GB**. PDF/Word em base64 enchem o banco rápido.

**Solução:** o D1 guarda só **metadados** (título, tipo, form_data JSON, chave do arquivo).  
O **arquivo binário** vai para **Appwrite Storage** (plano estudante) ou, se ativar no futuro, **Cloudflare R2**.

```
Gerar PDF/Word → API /api/history
                 ├─ D1: registro leve
                 └─ Appwrite: arquivo (PDF/DOCX)
Biblioteca → Baixar arquivo → API /api/history/:id/file → Appwrite
```

## Setup Appwrite (5 minutos)

1. Crie um projeto no [Appwrite Cloud](https://cloud.appwrite.io)
2. **Storage → Create bucket**
   - Name: `docspace-history`
   - File security: **disabled** (acesso só via API key do servidor)
   - Ou habilite e dê permissão à API key
3. **Overview → Project ID**
4. **Settings → API Keys → Create**
   - Scopes: `files.read`, `files.write`, `files.delete` (Storage)
5. No Worker Cloudflare, configure:

```bash
# vars públicas (podem ir no wrangler-api.toml)
# APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1"
# APPWRITE_PROJECT_ID = "seu-project-id"
# APPWRITE_BUCKET_HISTORY = "docspace-history"

# secret (nunca no git)
npx wrangler secret put APPWRITE_API_KEY --config wrangler-api.toml
```

Edite `wrangler-api.toml` e descomente/preencha:

```toml
APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1"
APPWRITE_PROJECT_ID = "SEU_PROJECT_ID"
APPWRITE_BUCKET_HISTORY = "docspace-history"
```

Deploy:

```bash
npx wrangler deploy --config wrangler-api.toml
```

## Sem Appwrite configurado

- O histórico **ainda salva** título + dados do formulário no D1
- **Não** grava o PDF/DOCX (não estoura o banco)
- Na Biblioteca aparece o badge **“Só dados (sem arquivo)”**

## Limites

- Upload de arquivo no histórico: ~**6 MB** por arquivo (base64 no request do Worker)
- Para arquivos maiores no futuro: upload multipart direto ao Appwrite com token temporário

## R2 (opcional depois)

Se ativar R2 no dashboard Cloudflare:

```bash
npx wrangler r2 bucket create docspace-history --config wrangler-api.toml
```

```toml
[[r2_buckets]]
binding = "HISTORY_BUCKET"
bucket_name = "docspace-history"
```

O Worker prefere **R2** se o binding existir; senão usa **Appwrite**.
