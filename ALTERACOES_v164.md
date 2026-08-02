# DocSpace v1.64

## Central de PDF

- Corrige a biblioteca de ferramentas que podia desaparecer após trocar de ferramenta.
- Reseta a posição de rolagem da central ao renderizar a área PDF.
- Mantém filtros e cartões sempre visíveis com rolagem interna previsível.
- Preserva o formulário e o processamento abaixo da biblioteca.

## Render

- Atualiza a URL do serviço para `https://gerador-de-documentos-3a8t.onrender.com`.
- A rota `/health` agora é um teste de vida e sempre retorna HTTP 200 quando o FastAPI está ativo.
- Adiciona `/ready` para diagnóstico estrito de segredo e dependências.
- Adiciona rota `/` com identificação do serviço.
- Valida dependências Python e binários durante a construção Docker.
- Adiciona Tesseract OSD e fontes Noto ao contêiner.
