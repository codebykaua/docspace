# Arquitetura DocSpace v1.49

## Frontend: GitHub Pages

A pasta `frontend/` contém uma aplicação estática em HTML, CSS e JavaScript. O workflow `.github/workflows/pages.yml` publica essa pasta no GitHub Pages a cada push na branch `main`.

A interface usa caminhos relativos, portanto funciona em URLs de projeto como:

```text
https://usuario.github.io/docspace-web/
```

## Backend: Cloudflare Worker

A pasta `backend-worker/` mantém autenticação, D1, administração, cotas, auditoria, atendimento, Mercado Pago, IA e conversões no servidor.

O publicador atualiza automaticamente:

- `PUBLIC_APP_URL` para o link do GitHub Pages;
- `CORS_ALLOWED_ORIGINS` para autorizar o domínio `github.io`;
- o Worker `docspace-api` pelo Wrangler.

## Biblioteca de documentos

A interface carrega `frontend/modelos/catalogo-integrado.json` e disponibiliza 107 modelos lógicos ligados a 110 arquivos DOCX. A IA extrai os dados, pergunta os campos ausentes e preenche o DOCX original. Ela não deve recriar o layout do contrato do zero.

Campos de data de assinatura/documento são sobrescritos pela data atual no fuso `America/Sao_Paulo` no momento da geração.

## Assistente IA

O chat exibe somente informações úteis ao usuário. Nome de provedor, modelo e relógio do servidor não aparecem na interface. Imagens e PDFs anexados são enviados ao Worker, que faz a chamada protegida ao provedor configurado.

O histórico da conversa permanece no `localStorage`, separado entre Documentos e Office.

## Perfil

A foto de perfil é cortada no navegador para formato quadrado, reduzida e enviada ao Worker. O D1 armazena a imagem associada ao usuário.

## PDF e Office

A central possui 24 ferramentas PDF. Parte delas funciona localmente; OCR, conversão Word para PDF e operações de servidor dependem dos serviços configurados.

Os editores Word e Excel são editores web ampliados. Eles não prometem compatibilidade integral com todos os recursos proprietários do Microsoft Office, mas oferecem importação, formatação, fórmulas e exportação para os usos comuns do sistema.
