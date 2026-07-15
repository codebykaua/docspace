# Backend Cloudflare

Este projeto agora usa Cloudflare Pages Functions + D1 para gerenciar logins,
planos, bloqueios e vencimentos. A autenticação antiga foi removida.

## Arquivos principais

- `functions/api/[[path]].js`: API de login, sessao e painel administrativo.
- `worker-backend-pronto.js`: API pronta para publicar como Worker independente.
- `wrangler-api.toml`: configuracao de deploy do Worker usado pelo frontend local.
- `schema.sql`: estrutura do banco D1.
- `wrangler.toml`: configuracao do projeto Cloudflare.
- `contro.html` e `contro.js`: painel para criar, editar, ativar, bloquear e renovar logins.
- `index.html` e `script.js`: sistema principal consumindo a API.

## Variaveis obrigatorias

Configure no painel da Cloudflare ou via `wrangler secret put`:

```bash
wrangler secret put APP_SECRET
wrangler secret put SETUP_TOKEN
```

Use valores longos e aleatorios. O `APP_SECRET` assina as sessoes. O
`SETUP_TOKEN` serve apenas para criar o primeiro administrador.

## Criar o banco D1

```bash
wrangler d1 create gerador_documentos_rurais
```

Copie o `database_id` retornado e cole em `wrangler.toml`.

Depois rode o schema:

```bash
wrangler d1 execute gerador_documentos_rurais --file=schema.sql
```

## Criar o primeiro administrador

Depois do deploy, chame uma vez:

```bash
curl -X POST https://SEU_DOMINIO/api/setup \
  -H "Content-Type: application/json" \
  -d "{\"setupToken\":\"SEU_SETUP_TOKEN\",\"name\":\"Administrador\",\"email\":\"seu@email.com\",\"password\":\"sua-senha\"}"
```

Depois disso, crie e gerencie os outros logins pelo `contro.html`.

## Publicar a API usada pelo frontend local

O `index.html` e o `contro.html` consomem o Worker independente configurado em
`wrangler-api.toml`. Sempre que alterar `worker-backend-pronto.js`, publique a
nova versao com:

```bash
npx wrangler login
npx wrangler deploy --config wrangler-api.toml
```

O deploy mantem o endereco usado pelo site:

```text
https://docspace-api.kaualucas9773.workers.dev
```

## Pre-visualizacao PDF via Render

O navegador preenche o mesmo DOCX usado no download em Word e envia o arquivo
para o Worker. O Worker valida o tamanho e encaminha o DOCX para o servico em
`render-server/`, que usa LibreOffice para converter o documento em PDF.

Publique `render-server/` no Render como Web Service com runtime Docker. A
imagem instala o LibreOffice automaticamente. Se o servico receber outra URL,
configure `RENDER_API_URL` no Worker antes de executar novamente:

```bash
npx wrangler deploy --config wrangler-api.toml
```

Depois publique tambem o frontend para atualizar `pdf-preview.js` e o cache do
service worker.

## Planos

- `test3min`: 3 minutos para teste interno de vencimento e cobranca.
- `basic30`: 30 dias plano Básico.
- `proMax365`: 365 dias plano Pro Max.

## Limite diario de documentos

O plano `basic30` e o plano interno `test3min` possuem limite de geracao por
modelo. Por padrao, cada modelo libera 5 geracoes por ciclo.

O ciclo diario reinicia as 04:00 no fuso `America/Bahia`. O Worker devolve
`nextResetAt` em `/api/session` e `/api/documents/usage`, e o frontend agenda a
atualizacao automatica dos contadores nesse horario.

## Controle de documentos por usuario

O campo `allowed_document_types` da tabela `users` guarda uma lista JSON com os
documentos liberados para cada login. Quando o campo esta vazio ou como `[]`, o
usuario ve todos os documentos permitidos pelo plano. Quando ha itens na lista,
somente esses documentos aparecem e a API tambem bloqueia geracao direta dos
demais.

## Atendimento e comprovantes

O backend cria automaticamente a tabela `support_messages` no D1. Ela armazena conversas,
comprovantes e respostas administrativas organizadas pelo nome e e-mail do login.

- Contas vencidas recebem um token temporário de cobrança com duração de 24 horas.
- Esse token permite enviar comprovantes e conversar com o suporte, mas não libera documentos.
- Anexos aceitos: JPG, PNG e PDF com até 1,5 MB.
- Para maior volume de arquivos, migre os anexos para Cloudflare R2 e mantenha no D1 apenas os metadados.

Rotas adicionadas:

- `POST /api/support/messages`
- `GET /api/support/messages`
- `POST /api/billing/payment-proofs`
- `GET /api/support/attachments/:id`
- `GET /api/admin/support/messages`
- `POST /api/admin/support/messages`

## Ferramentas PDF locais

O plano `proMax365` libera ferramentas PDF executadas diretamente no navegador:

- juntar e dividir PDFs;
- organizar, remover, extrair e girar paginas;
- compactar PDFs com níveis equilibrado, forte e máximo;
- criar PDF pesquisavel com OCR local a partir de PDFs digitalizados e imagens;
- converter imagens JPG ou PNG em PDF.

Os arquivos nao sao enviados para API, Worker ou armazenamento externo. O
navegador usa `pdf-lib`, `PDF.js`, `Tesseract.js`, `PizZip` e `FileSaver.js` somente para processar e
baixar o resultado no dispositivo do usuario. Ao selecionar um PDF, o app
tambem mostra uma pre-visualizacao local do primeiro arquivo escolhido.

Na compactacao, o navegador compara a otimizacao estrutural com uma versao
visual rasterizada pagina por pagina e baixa a menor delas. Os modos forte e
maximo reduzem melhor PDFs escaneados ou com fotos, mas podem remover texto
selecionavel e links.

No OCR, o navegador usa `Tesseract.js` com portugues, ingles ou ambos. Para
PDFs, cada pagina e renderizada localmente pelo `PDF.js`, reconhecida e reunida
em um novo PDF com camada de texto pesquisavel. Na primeira utilizacao, o modelo
do idioma e baixado pelo navegador.

Quando o plano vence, o backend bloqueia o acesso automaticamente na proxima
validacao de sessao/login e o app tambem verifica a sessao periodicamente.

## Mercado Pago

O fluxo de QR Code fixo foi removido do frontend. Agora o pagamento passa pela
estrutura de checkout integrada:

- `POST /api/billing/checkout`: cria a cobrança/preferência de pagamento.
- `GET /api/billing/payments/:id`: consulta o status salvo no sistema.
- `POST /api/billing/mercadopago/webhook`: recebe notificações do Mercado Pago.

Configure o token privado no Worker:

```bash
wrangler secret put MERCADO_PAGO_ACCESS_TOKEN --config wrangler-api.toml
wrangler secret put MERCADO_PAGO_WEBHOOK_SECRET --config wrangler-api.toml
```

Opcional:

```toml
PUBLIC_APP_URL = "https://seu-site.com"
MERCADO_PAGO_WEBHOOK_URL = "https://sua-api.workers.dev/api/billing/mercadopago/webhook"
```

Quando o Mercado Pago confirmar um pagamento com status `approved`, o Worker
ativa o usuário, renova o `expires_at` de acordo com o plano e restaura os saldos
diários do plano.
