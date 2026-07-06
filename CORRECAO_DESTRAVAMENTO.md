# Correção de travamento

- Removido o MutationObserver que observava a página inteira.
- Esse observer podia entrar em loop com o lucide.createIcons() e travar a interface.
- Os ajustes agora rodam somente no carregamento e após cliques importantes, com debounce simples.
- Mantidas as correções de atendimento, perfil, categorias, selo verificado e radios compactos.
