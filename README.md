# DocSpace Web

Sistema web para preenchimento guiado de documentos, geração de Word/PDF, ferramentas PDF, administração de acessos, planos e atendimento.

## Funcionalidades principais

- Wizard de documentos (contratos, declarações, procurações, rural)
- Ferramentas PDF no navegador (juntar, dividir, compactar, OCR…)
- Planos, cotas e Mercado Pago
- Suporte, admin e DocSpace IA
- **Pessoas/clientes** reutilizáveis no preenchimento, salvos localmente no navegador
- **Rascunhos e histórico** locais, sem envio dos arquivos ao D1
- **Validação BR** (CPF, CNPJ, CEP/ViaCEP, máscaras)
- **Assinatura eletrônica** simples (canvas no PDF)
- **Link de preenchimento** para o cliente (`share.html`)
- **Catálogo de modelos** expansível no admin

## Rodar local

```bash
npm run dev
# ou
python -m http.server 5500
```

Acesse `http://127.0.0.1:5500` (ou a porta do Vite).

## Configuração

Edite `app-config.js` e informe a URL da API/Worker em `API_BASE_URL`.

Documentação de backend: `README_BACKEND_CLOUDFLARE.md`  
Cobrança: `README_MERCADO_PAGO.md`  
Histórico de correções antigas: `docs/archive/`

## Schema D1 e migrações

```bash
npx wrangler d1 execute gerador_documentos_rurais --remote --file=schema.sql --config wrangler-api.toml
npx wrangler d1 migrations apply gerador_documentos_rurais --remote --config wrangler-api.toml
```

O Worker também aplica o schema automaticamente em `ensureDatabaseSchema` no boot.

## Validação

```bash
node validate-templates.js
node --check script.js
node --check docspace-product.js
node --check worker-backend-pronto.js
```

## Deploy da API

```bash
npx wrangler deploy --config wrangler-api.toml
```

## Deploy do site

```bash
npm run build
npx wrangler pages deploy .pages-dist --project-name docspace-web
```

## Versão

**6.2.1** — atualização Android, segurança de login/webhook, correções administrativas e testes de regressão.
