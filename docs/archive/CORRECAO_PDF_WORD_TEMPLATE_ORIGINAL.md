# Correção PDF/Word por template original

- Removido o fallback que gerava PDF simples tipo ficha/print da tela.
- O botão Gerar PDF voltou a usar o fluxo correto: preencher DOCX pelo template Word e enviar para a API de conversão LibreOffice.
- O PDF passa a preservar o layout do modelo Word colocado na pasta modelos.
- O popup de PDF continua sendo usado e o download automático é iniciado após a conversão.
- Os botões Gerar Word foram protegidos contra recarregamento da página e agora forçam o download do DOCX preenchido.
- Criados arquivos de Autodeclaração com nomes normais para evitar falha de fetch em caminhos com acento.
- Modelos faltando após a correção: nenhum.
- Cache atualizado para v115 / docspace-clean-ui v15 / pdf-preview v7.
