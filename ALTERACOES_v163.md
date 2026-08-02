# DocSpace v1.63

## Correção da conversão Word para PDF

- Envia `X-Render-Secret` na rota `/api/ai/export-pdf`.
- Detecta ausência de `RENDER_API_SECRET` antes de chamar o servidor.
- Tenta novamente automaticamente em falhas temporárias e inicialização do Render.
- Aumenta o tempo de conversão para documentos maiores.
- Lê corretamente o campo `detail` retornado pelo FastAPI.
- Exibe mensagens específicas para autenticação, rota ausente, tempo limite e indisponibilidade.
- Mantém o download em Word quando a geração do PDF não for possível.
