Correção aplicada:
- A coluna esquerda do login tinha a classe login-slideshow e estava recebendo position:absolute.
- Isso fazia o slideshow cobrir a tela inteira e esconder o formulário.
- Corrigido com CSS limpo: auth-copy.login-slideshow voltou para position:relative dentro do grid 50/50.
- O formulário do lado direito voltou a aparecer.
