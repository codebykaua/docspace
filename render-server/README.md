# Render Server - Backend PDF Oficial do DocSpace

Este é o backend PDF oficial para processamento de documentos no DocSpace.

## Funções

- Conversão DOCX → PDF
- Conversão HTML → PDF
- Compactação de PDF
- OCR em PDF/imagens

## Deploy

Este servidor deve ser implantado separadamente do frontend (Cloudflare Workers).

Recomendado: Render, Railway, Fly.io, ou qualquer host que rode Node.js + Linux.

## Variáveis de Ambiente

```bash
PORT=3000
RENDER_API_SECRET=<segredo-forte-aleatorio>
MAX_PDF_BYTES=52428800
```

**IMPORTANTE:** `RENDER_API_SECRET` deve ser configurado no host de deploy.
O servidor recusa requisições sem este segredo no header `x-render-secret`.

## Integração com Frontend

O frontend (Cloudflare Workers em functions/api/) chama este servidor via
`env.RENDER_API_URL` + header `x-render-secret`.

## Dockerfile

O Dockerfile na raiz do projeto está **OBSOLETO** e foi mantido apenas como
referência histórica. Para deploy em produção, use:

```bash
docker build -f render-server/Dockerfile -t docspace-render-server ./render-server
```

Ou implante diretamente o código do render-server em um provedor PaaS.