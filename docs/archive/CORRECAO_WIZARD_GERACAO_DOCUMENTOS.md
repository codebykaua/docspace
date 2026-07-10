# Correção de etapas e geração de documentos

- Corrigido o CSS que deixava campos de outras etapas visíveis.
- Agora a etapa 1 mostra somente a etapa 1; Local e data só aparece após Continuar.
- O botão Continuar valida somente os campos da etapa atual.
- Os botões Gerar Word, Gerar PDF e Limpar campos não recarregam mais a página.
- Foi criado um fallback seguro para acionar a geração de Word e PDF usando as funções originais.
- A correção vale para o contrato principal e para todos os documentos simples.
