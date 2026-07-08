# Correção v122 — Word/PDF saindo sem preencher

- Corrigida a causa principal: o sistema desabilitava os campos antes de coletar os dados; FormData ignora campos disabled, então o DOCX/PDF saia vazio.
- Agora os dados são coletados antes de travar o formulário.
- A coleta foi reforçada para ler diretamente os elementos do formulário, mesmo se algum campo estiver disabled por UI.
- Campos duplicados do comodato foram normalizados: profissão/profissao, município/municipio, endereço/endereco, duração/duracao.
- Campos de cônjuge e óbito/representante agora ficam condicionais no comodato para reduzir duplicação visual.
- Aliases reversos foram aplicados para que o usuário preencha campo canônico e o template com placeholder antigo/acentuado também receba o valor.
- Cache atualizado para v122.
