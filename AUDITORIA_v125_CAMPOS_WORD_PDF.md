# Auditoria v125 — Campos duplicados e preenchimento Word/PDF

- Documentos auditados: 30
- Campos brutos nos templates: 837
- Campos únicos após canonicalização: 835
- Duplicidades detectadas/corrigidas: [('comodato', ['profissao_comandatario', 'municipio_comandatario'])]

Correções aplicadas:
- Reordenei o preenchimento DOCX: agora o Docxtemplater roda primeiro e a substituição direta só entra como fallback.
- Isso corrige modelos Word com placeholders quebrados em partes internas do XML, causa comum de Word/PDF saindo em branco.
- Corrigi a canonicalização de campos acentuados e sem acento.
- Corrigi duplicidade do comodato em profissão/profissao e município/municipio.
- Reapliquei os campos simplificados: estado civil, mês, UF e nacionalidade como seletor.
- Profissão, órgão e documento ficaram com sugestões automáticas sem travar digitação.
- Atualizei cache para v125.
