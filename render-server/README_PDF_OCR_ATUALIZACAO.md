# Atualizacao PDF/OCR no Render

Esta versao adiciona rotas na mesma API do Render:

- `POST /api/pdf/compress`
- `POST /api/pdf/ocr`

## O que mudou

- Compactacao agora roda no Render com OCRmyPDF/qpdf, preservando OCR/texto quando existir.
- OCR agora roda no Render com Tesseract/OCRmyPDF e otimizacao de tamanho.
- O frontend chama o Cloudflare Worker em `/api/pdf-tools/process`.
- O Worker valida login/plano/saldo e repassa para o Render.

## Variaveis recomendadas

No Cloudflare Worker:

- `RENDER_API_URL=https://sua-api.onrender.com`
- `RENDER_API_SECRET=uma-chave-grande`

No Render:

- `RENDER_API_SECRET=a-mesma-chave-do-worker`

Se nao configurar `RENDER_API_SECRET`, a API continua funcionando, mas fica menos protegida.

## Depois de subir

1. Faça redeploy no Render.
2. Teste `/health`.
3. Confira se `ocrmypdf`, `tesseract`, `pdftotext` e `ghostscript` aparecem como `true`.
4. Suba o Worker/Pages novamente.
