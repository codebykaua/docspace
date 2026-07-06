# DocSpace v201 — reconstrução séria com preenchimento por etapas

Esta versão quebra novamente a interface anterior e troca a proposta visual por uma tela mais sóbria, profissional e direta.

## O que mudou

- `index.html` refeito do zero novamente.
- `style.css` refeito do zero com visual mais sério, sem estética "modinha"/glass.
- Login mantido chamando a mesma API configurada em `app-config.js`.
- Painel interno reorganizado com sidebar fixa e área de trabalho limpa.
- Biblioteca de documentos refeita com cards mais simples e profissionais.
- Preenchimento de documentos transformado em assistente por etapas.
- Campos de confrontante/confrontações agora ficam em etapa própria: **Dados do confrontante**.
- Botões **Continuar** e **Voltar** adicionados no preenchimento.
- A geração de Word/PDF só aparece na etapa final: **Revisão e geração**.
- Mantidas as chamadas originais de API para sessão, login, uso de documento, PDF, suporte, IA, planos e administração.

## Arquivos principais alterados

- `index.html`
- `style.css`
- `script.js`
- `service-worker.js`
- `dist/` reconstruída pelo build

## Validação feita

- `node --check script.js`
- `node --check dist/script.js`
- `node build-pages.js`

## Observação

Não foi feito teste de login real porque depende da API em produção e das credenciais do usuário. A sintaxe, build e estrutura do frontend foram validados localmente.
