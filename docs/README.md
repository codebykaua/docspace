# DocSpace — documentação

## Pastas

- `archive/` — notas históricas de correções e hotfixes (não são a fonte de verdade do produto).
- `../migrations/` — schema SQL do D1.
- `../README.md` — visão geral e como rodar.
- `../README_BACKEND_CLOUDFLARE.md` — API, D1, deploy.
- `../README_MERCADO_PAGO.md` — cobrança.

## Funcionalidades de produto (v6.1)

| # | Feature | Onde |
|---|---------|------|
| 1 | Cadastro de pessoas/clientes | UI: Pessoas · API: `/api/people` |
| 2 | Rascunhos e histórico | UI: Biblioteca · API: `/api/drafts`, `/api/history` |
| 4 | Validação CPF/CNPJ/CEP | Frontend (`docspace-product.js` + wizard) |
| 6 | Assinatura eletrônica (canvas) | Após PDF · API: `/api/signatures` |
| 7 | Link de preenchimento | `share.html` · API: `/api/share/*` |
| 10 | Catálogo de modelos (admin) | Admin · API: `/api/templates`, `/api/admin/templates` |
| 16 | Limpeza do repositório | `docs/archive/`, `.gitignore` |
