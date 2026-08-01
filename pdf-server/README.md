# DocSpace PDF Corrector v1.60

Serviço Python/FastAPI para o módulo **Corrigir PDFs** do DocSpace.

## Entradas

- Um PDF;
- Vários PDFs, enviados em blocos de 8 MB;
- Um ou mais ZIPs contendo PDFs;
- Até 500 PDFs por trabalho, com limites configuráveis por variável de ambiente.

## Saída

Um único arquivo `RESULTADO-CORRECAO-PDFS.zip` contendo:

- `CORRIGIDOS/`;
- `NAO-CORRIGIDOS/`;
- `RELATORIO-DE-CORRECAO.txt`;
- `relatorio.json`.

## Dependências do sistema

O Dockerfile instala Ghostscript, QPDF, Tesseract OCR em português/inglês, unpaper, pngquant e fontes Unicode.

## Variáveis obrigatórias

- `PDF_CORRECTOR_SECRET`: deve ser igual ao segredo configurado no Cloudflare Worker.
- `PDF_CORRECTOR_ALLOWED_ORIGINS`: origem do frontend, por exemplo `https://codebykaua.github.io`.

## Implantação

Use o `render.yaml` ou publique o Dockerfile em um serviço com disco temporário suficiente. Para lotes de 300–400 PDFs, use um plano com memória e disco compatíveis; o processador persiste o estado em disco e retoma trabalhos enfileirados após reinicialização.
