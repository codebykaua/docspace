# DocSpace v1.49 — GitHub Pages + Cloudflare Worker

A versão 1.49 publica o frontend estático pelo GitHub Pages e mantém o backend no Cloudflare Worker.

## Publicação automática

1. Extraia o ZIP completo.
2. Dê dois cliques em `PUBLICAR_TUDO_GITHUB_E_WORKER.bat`.
3. Autorize GitHub e Cloudflare no navegador quando solicitado.
4. Confirme o nome do repositório. O padrão é `docspace-web`.
5. Aguarde a validação, o push, o GitHub Actions e o deploy do Worker.

O link padrão será:

```text
https://SEU-USUARIO.github.io/docspace-web/
```

O publicador configura automaticamente `PUBLIC_APP_URL` e o CORS do Worker para o endereço do GitHub Pages.

## O que fica em cada serviço

### GitHub Pages

- landing page e checkout;
- HTML, CSS e JavaScript;
- biblioteca e formulários de documentos;
- editores Word e Excel;
- ferramentas PDF executadas no navegador;
- interface do Assistente IA.

### Cloudflare Worker

- login, sessões e permissões;
- Cloudflare D1;
- IA e chave privada;
- Mercado Pago e webhook;
- auditoria e cotas;
- conversões que precisam de servidor.

## Atualizações futuras

Execute novamente `PUBLICAR_TUDO_GITHUB_E_WORKER.bat`. O programa cria um novo commit, envia a branch `main`, dispara o workflow do Pages e atualiza o Worker.

Quando o repositório já possuir conteúdo na branch `main`, o programa pede confirmação antes de substituí-la.

## Credenciais

As chaves privadas continuam como secrets do Cloudflare Worker e não devem ser colocadas no GitHub. O arquivo `.gitignore` bloqueia `.env`, `.dev.vars`, `node_modules` e arquivos locais do Wrangler.
