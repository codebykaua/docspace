# DocSpace v1.43 — alterações

## Assistente IA

- A área foi transformada em um chat compacto, com mensagens acima e caixa de envio fixa abaixo.
- O seletor “Tipo de tarefa” foi removido. A IA identifica automaticamente se o pedido é leitura, revisão, assistência ou geração.
- O bloco grande de RG/CPF foi substituído por um botão **+** dentro do compositor.
- O menu do botão **+** permite anexar JPG, PNG, WEBP e PDF.
- Os anexos aparecem como chips pequenos e removíveis.
- Enter envia e Shift+Enter cria uma nova linha.
- Rascunho e conversa ficam somente no `localStorage`.
- Documentos e Office possuem conversas e rascunhos independentes.
- Trocar Docs → Office → Docs restaura o histórico correto de cada área.

## Documentos gerados pela IA

- Pedidos de geração na área Documentos só produzem arquivos quando um modelo integrado é identificado.
- Se o nome do modelo não estiver claro, a IA pergunta qual documento do catálogo deve ser usado.
- Word e PDF são preenchidos diretamente no DOCX original; a IA não recria layout ou cláusulas.
- Antes de liberar o download, o sistema abre um formulário com todos os campos obrigatórios ausentes.
- A IA não inventa estado civil, RG, CPF, datas, endereços ou demais informações não legíveis.
- A data de assinatura usa automaticamente a data atual de Brasília quando o modelo possuir campo correspondente.
- O contrato de comodato continua perguntando modalidade, cônjuge e óbito antes da leitura.
- A mesma geração consome a cota uma única vez, mesmo quando o usuário baixa Word e PDF.

## Administração

- A aba “Visão geral” foi removida.
- As seções são: **Usuários**, **Atendimento**, **Planos e pagamentos** e **Sistema**.
- Cada seção apresenta somente o conteúdo correspondente.
- O administrador define a cota total de gerações por usuário e escolhe se ela renova diariamente.
- A cota é compartilhada entre todos os modelos, por exemplo: 30 documentos no total por dia.
- Foi adicionada a ação **Zerar cota** para liberação manual.
- O histórico por usuário mostra login, logout, documentos, IA, PDF, data, hora, IP e navegador.
- Os novos dados de auditoria são gravados no Cloudflare D1.

## Planos

- Plano mensal: **R$ 79,90** por 30 dias.
- Plano anual: **R$ 590,99** por 365 dias.
- Os valores foram atualizados no site, checkout, painel administrativo e Worker.

## Versão e cache

- Frontend e Worker atualizados para v1.43.
- Referências estáticas usam build 143.
- O cache reset remove Service Workers e caches de versões antigas.
