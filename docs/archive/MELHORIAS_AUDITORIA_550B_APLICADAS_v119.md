# Melhorias aplicadas — Auditoria 550B v119

Aplicado sobre a versão v118.

## Segurança

- Removido fallback inseguro do `APP_SECRET`. Agora o Worker falha com erro claro se o segredo não estiver configurado.
- PBKDF2 aumentado de 100.000 para 310.000 iterações para novas senhas. Senhas antigas continuam funcionando porque o verificador lê a quantidade salva no hash.
- Render Server agora exige `RENDER_API_SECRET` em produção. Localhost/desenvolvimento continua liberado para teste.
- Removidos valores pessoais padrão do `setup-admin.html`.

## Estabilidade e build

- `app-config.js` virou fonte principal da URL da API. `script.js`, `pdf-preview.js` e `setup-admin.html` deixaram de carregar fallback hardcoded próprio.
- Criado `tools/validate-templates.js` para validar se todos os modelos DOCX citados no `script.js` existem antes do build.
- `build-pages.js` agora roda a validação de templates antes de copiar para `dist`.
- Adicionado `package.json` com `validate:templates`, `check:js` e `build`.

## Modelos DOCX

- Removidos modelos duplicados ` (2)` e arquivos com nomes corrompidos `#U...`.
- Mantidos os modelos canônicos usados pelo sistema, incluindo os nomes acentuados válidos de Autodeclaração.

## Validação realizada

- `node --check` executado em `script.js`, `ai-ui.js`, `pdf-preview.js`, `worker-backend-pronto.js`, `server.js`, `build-pages.js` e `tools/validate-templates.js`.
- Validação dos modelos DOCX executada com sucesso.

## Observação

A modularização completa em TypeScript/Vite/Hono é uma refatoração grande de vários dias. Esta versão aplica as melhorias críticas e seguras da auditoria sem quebrar a lógica atual.
