# DocSpace Web

Sistema web para preenchimento guiado de documentos, geração de Word/PDF, ferramentas PDF, administração de acessos, planos e atendimento.

## Rodar local

Abra `index.html` em um servidor local, por exemplo:

```bash
python -m http.server 5500
```

Acesse `http://127.0.0.1:5500`.

## Configuração

Edite `app-config.js` e informe a URL da API/Worker em `API_BASE_URL`.

## Validação

```bash
node validate-templates.js
node --check script.js
```

## Versão

v121 — campos dos formulários sincronizados com os placeholders reais dos modelos Word, evitando duplicidade e documento PDF/Word vazio.
