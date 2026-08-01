# DocSpace v1.60 — Corretor e Validador de PDFs em lote

## Nova ferramenta: Corrigir PDFs

A central de PDF recebeu uma ferramenta própria para corrigir e validar:

- um PDF individual;
- vários PDFs selecionados de uma vez;
- um ou mais arquivos ZIP contendo PDFs;
- lotes com até 500 PDFs, conforme a capacidade configurada no servidor.

## Processamento em fila

Os arquivos são enviados diretamente ao serviço pesado em blocos de 8 MB. O Cloudflare Worker autoriza o trabalho com um token temporário, mas não recebe os PDFs completos. Isso evita o limite de corpo do Worker e permite lotes grandes.

O serviço mantém o estado do trabalho em disco, processa os PDFs em sequência e retoma trabalhos enfileirados depois de reinicialização.

## Correções e validações

O serviço executa:

1. reparo estrutural e remoção de JavaScript/anexos internos;
2. análise de fontes, incorporação e mapeamento Unicode;
3. OCR em português/inglês;
4. reconstrução completa quando existem fontes Type 3 ou texto corrompido;
5. compressão progressiva;
6. medição real de cada página em um PDF individual;
7. validação de pesquisa, renderização, fontes, tamanho total e tamanho por página;
8. nova tentativa automática quando o primeiro resultado não atende aos limites.

## Resultado

O download final é sempre um ZIP com:

- `CORRIGIDOS/`;
- `NAO-CORRIGIDOS/`;
- `RELATORIO-DE-CORRECAO.txt`;
- `relatorio.json`.

## Serviço pesado

A pasta `pdf-server` contém o backend FastAPI/Docker completo. Ela também mantém as rotas existentes de:

- DOCX para PDF;
- compressão de PDF;
- OCR pesquisável.

O serviço depende de LibreOffice, Ghostscript, QPDF, OCRmyPDF, Tesseract, PyMuPDF, pikepdf e fontes Unicode.

## Segurança

- extração segura de ZIP;
- bloqueio de caminhos `../`;
- bloqueio de ZIP criptografado;
- verificação de ZIP bomb;
- limite por arquivo, por lote e por quantidade;
- upload em chunks ordenados;
- token temporário assinado;
- diretório isolado por trabalho;
- exclusão automática após o prazo de retenção.


## Robustez para trabalhos extensos

- Token de acompanhamento válido por 72 horas.
- Resultado mantido por 72 horas.
- Disco persistente de 20 GB configurado no Render Blueprint.
- Processamento sequencial e limpeza dos arquivos intermediários após cada PDF.
- O ZIP de entrada é removido depois da descompactação segura.
- O servidor mantém somente o ZIP final durante o período de retenção.
