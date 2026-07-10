# Correção v118 — Compressão seletiva por página

- Adicionada na ferramenta **Comprimir PDF** a opção **Páginas específicas para comprimir (opcional)**.
- Exemplo de uso: PDF com 50 páginas → digitar `10` para compactar somente a página 10.
- Também aceita intervalos: `1,5,10-12`.
- Se o campo ficar vazio, o sistema mantém o fluxo antigo e compacta o PDF inteiro.
- Na compactação seletiva, o sistema recria o PDF mantendo as páginas não selecionadas preservadas e rasteriza/comprime somente as páginas escolhidas.
- Para páginas específicas, o sistema aceita um PDF por vez.
- Cache atualizado para `v118`.
