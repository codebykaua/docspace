# Integração Mercado Pago - DocSpace

Esta versão remove o QR Code fixo e usa Mercado Pago com pagamento integrado dentro do DocSpace via Checkout Bricks / Payment Brick.

## O que já foi preparado

- Frontend chama `POST /api/billing/checkout` para criar a cobrança local e a preferência de apoio.
- Frontend renderiza o Payment Brick dentro do modal do DocSpace quando `MERCADO_PAGO_PUBLIC_KEY` estiver configurada.
- Backend processa o formulário do Brick em `POST /api/billing/brick-payment` e cria o pagamento real no Mercado Pago.
- O método Conta Mercado Pago fica desativado no Brick para evitar obrigar o comprador a entrar em uma conta Mercado Pago; o foco fica em Pix, cartão e boleto.
- Mercado Pago chama `POST /api/billing/mercadopago/webhook` quando houver evento de pagamento.
- Backend consulta o pagamento no Mercado Pago e, se o status for `approved`, renova o plano automaticamente.
- O usuário fica com `status = active`, novo `expires_at` calculado pelo plano, e os saldos diários são restaurados.
- Histórico do pagamento fica salvo na tabela `billing_payments`.

## Secrets/variáveis necessárias no Cloudflare Worker

Configure o token privado como secret:

```bash
wrangler secret put MERCADO_PAGO_ACCESS_TOKEN --config wrangler-api.toml
```

Opcionalmente configure:

```bash
wrangler secret put MERCADO_PAGO_WEBHOOK_SECRET --config wrangler-api.toml
```

E em `[vars]` do `wrangler-api.toml`, configure a Public Key e as URLs públicas:

```toml
MERCADO_PAGO_PUBLIC_KEY = "SUA_PUBLIC_KEY_AQUI"
PUBLIC_APP_URL = "https://SEU_SITE.com"
MERCADO_PAGO_WEBHOOK_URL = "https://SUA_API.workers.dev/api/billing/mercadopago/webhook"
```

A `MERCADO_PAGO_PUBLIC_KEY` pode ficar no arquivo porque é pública. O `MERCADO_PAGO_ACCESS_TOKEN` continua sendo secret e nunca deve ir para o frontend.

## Rotas criadas

### Criar pagamento

```http
POST /api/billing/checkout
Authorization: Bearer <sessionToken>
Content-Type: application/json

{
  "plan": "basic30",
  "mode": "renovar"
}
```

Planos preparados:

- `test10c` — R$ 0,10 — 30 dias de teste
- `basic30` — R$ 39,90 — 30 dias
- `proMax365` — R$ 490,90 — 365 dias

### Enviar pagamento do Payment Brick

```http
POST /api/billing/brick-payment
Authorization: Bearer <sessionToken>
Content-Type: application/json

{
  "paymentId": "id-local-do-pagamento",
  "selectedPaymentMethod": "pix",
  "formData": { }
}
```

O `formData` é enviado automaticamente pelo Payment Brick do Mercado Pago.

### Consultar status local

```http
GET /api/billing/payments/{paymentId}
Authorization: Bearer <sessionToken>
```

### Webhook do Mercado Pago

```http
POST /api/billing/mercadopago/webhook
```

Quando o webhook receber um evento `payment` com `data.id`, o backend consulta o Mercado Pago e renova o usuário se o pagamento estiver aprovado.

## Banco de dados

Foi adicionada a tabela `billing_payments` no `schema.sql` e também no `ensureDatabaseSchema()` do Worker.

Depois de publicar, rode o schema no D1 se necessário:

```bash
wrangler d1 execute gerador_documentos_rurais --file=schema.sql --config wrangler-api.toml --remote
```


## Plano de teste Mercado Pago

Foi adicionado o plano interno `test10c` para testes de pagamento:

- Nome: Teste Mercado Pago - R$ 0,10
- Valor: R$ 0,10
- Duração: 30 dias
- Uso: aparece no painel admin e na tela de alteração/compra do usuário.

Depois de publicar o Worker, o pagamento aprovado pelo Mercado Pago renova o usuário automaticamente por 30 dias.
