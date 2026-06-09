# PDF Converter API - Render

Servidor Node.js responsável somente pela conversão de DOCX preenchido para PDF.
O preenchimento do modelo continua no navegador, usando a mesma rotina do download
em Word. A imagem Docker instala o LibreOffice para conversão e o `qpdf` para
proteger o resultado contra edição, montagem e extração em leitores compatíveis.

## Deploy no Render

1. Crie um novo Web Service e conecte este repositório.
2. Selecione `Docker` como runtime.
3. Configure `render-server` como **Root Directory**.
4. Use `/health` como **Health Check Path**.
5. Publique o serviço e copie a URL gerada.

Se o serviço atual usa o runtime Node nativo, recrie-o com runtime Docker ou
altere o runtime pelo painel/API do Render.

Se a URL for diferente da URL padrão usada pelo Worker, configure a variável
`RENDER_API_URL` no Cloudflare Worker.

## Endpoints

### `POST /api/convert-docx-to-pdf`

Converte um DOCX já preenchido para PDF.

```json
{
  "docxBase64": "UEsDB...",
  "fileName": "comodato.docx"
}
```

Resposta:

```json
{
  "success": true,
  "pdfBase64": "JVBERi0xLjQ...",
  "fileName": "comodato.pdf"
}
```

### `POST /api/convert-html-to-pdf`

Converte HTML para PDF.

```json
{
  "html": "<h1>Documento</h1>",
  "fileName": "documento.pdf"
}
```

### `GET /health`

Health check da API. Também verifica se o executável do LibreOffice está
disponível e responde `503` quando a conversão não pode funcionar.

## Troubleshooting

- Se `/health` falhar, verifique o deploy Docker no Render.
- Se a conversão responder erro, confira os logs do Web Service.
- A primeira requisição pode demorar por causa do spin-up do Render.
- O DOCX enviado para conversão pode ter no máximo 10 MB.
