# Privacidade: dados só no navegador

## Regra

**Não salvamos no servidor (D1):**
- cadastro de pessoas/clientes
- rascunhos de formulário
- histórico de gerações
- arquivos PDF/Word gerados
- PDF assinado

Esses dados ficam apenas no **`localStorage`** do navegador do usuário (chaves por conta de login).

## O que ainda usa o servidor

- Login / sessão / planos / cotas
- Mercado Pago
- Suporte (mensagens)
- Admin de usuários
- Catálogo de modelos (admin)
- Link “Enviar ao cliente” (token + tipo de documento; **sem** formData pré-preenchido com seus dados)

## Chaves localStorage

- `docspace_local_people_v1::<userId>`
- `docspace_local_drafts_v1::<userId>`
- `docspace_local_history_v1::<userId>`

Limpar o site no navegador apaga esses dados.
