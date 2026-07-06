# DocSpace redesign zero iOS/API

Aplicado em 2026-07-05.

## O que mudou

- `index.html`, `style.css`, `script.js` e `service-worker.js` foram refeitos do zero.
- A interface antiga foi removida do carregamento principal.
- A API original foi mantida via `app-config.js` e rotas `/api/*`.
- Login, sessão, documentos, PDF, suporte, IA, planos e admin chamam as rotas existentes.
- `dist/` deve ser reconstruído com `node build-pages.js`.

## Total de modelos mapeados

30 documentos.
