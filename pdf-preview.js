// Configuração do PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let currentPdfData = null;
let currentPdfDocument = null;
let currentPageNum = 1;
let currentPdfProgress = 0;
let pdfConversionProgressTimer = null;

// Verificar se as constantes estão disponíveis
if (typeof API_BASE_URL === 'undefined') {
    window.API_BASE_URL = 'https://tiny-bread-b482gerador-documentos-rurais-api.kauatech-dev.workers.dev';
}
if (typeof SESSION_TOKEN_KEY === 'undefined') {
    window.SESSION_TOKEN_KEY = 'documentos_rurais_session_token';
}

async function converterDocumentoEmPdf(templatePath, docxBlob) {
    try {
        // Mostrar modal com loading
        pdfLoadingMessage.textContent = '';
        pdfLoadingMessage.style.color = '';
        pdfPreviewLoading.classList.remove('is-hidden');
        pdfPreviewModal.classList.remove('is-hidden');
        pdfCanvas.style.display = 'none';
        pdfPrintButton.disabled = true;
        pdfDownloadButton.disabled = true;
        reiniciarProgressoPdf();
''
        if (!(docxBlob instanceof Blob)) {
            throw new Error('Não foi possível preparar o documento para conversão.');
        }

        const docxBase64 = await converterBlobEmBase64(docxBlob, (percentual) => {
            atualizarProgressoPdf(mapearPercentual(percentual, 0, 15), 'Preparando documento');
        });

        // Chamar API
        const token = localStorage.getItem(SESSION_TOKEN_KEY);
        const apiUrl = API_BASE_URL;

        console.log('Chamando API PDF:', `${apiUrl}/api/documents/preview-pdf`);
        const result = await solicitarConversaoPdf(`${apiUrl}/api/documents/preview-pdf`, token, {
            templatePath: templatePath,
            docxBase64: docxBase64,
        });
        
        if (!result.success || !result.pdfBase64 || result.protected !== true) {
            throw new Error('Resposta inválida do servidor');
        }

        if (result.documentUsage) {
            aplicarUsoDiarioDocumentos(result.documentUsage);
        }

        // Exibir PDF
        await exibirPdfPreview(result.pdfBase64, result.fileName);

    } catch (error) {
        console.error('Erro ao converter PDF:', error);
        ocultarProgressoPdf();
        pdfLoadingMessage.textContent = `Erro: ${error.message}`;
        pdfLoadingMessage.style.color = '#c41e3a';
    }
}

function converterBlobEmBase64(blob, onProgress) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                onProgress?.(calcularPercentual(event.loaded, event.total));
            }
        });
        reader.addEventListener('load', () => {
            const resultado = String(reader.result || '');
            onProgress?.(100);
            resolve(resultado.includes(',') ? resultado.split(',', 2)[1] : resultado);
        });
        reader.addEventListener('error', () => {
            reject(new Error('Não foi possível preparar o documento para conversão.'));
        });
        reader.readAsDataURL(blob);
    });
}

function solicitarConversaoPdf(url, token, body) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('POST', url);
        xhr.responseType = 'json';
        xhr.timeout = 180000;
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                atualizarProgressoPdf(
                    mapearPercentual(calcularPercentual(event.loaded, event.total), 15, 35),
                    'Enviando documento'
                );
                return;
            }

            atualizarProgressoPdf(20, 'Enviando documento');
        });
        xhr.upload.addEventListener('load', () => {
            iniciarProgressoConversaoPdf();
        });
        xhr.addEventListener('progress', (event) => {
            pararProgressoConversaoPdf();

            if (event.lengthComputable) {
                atualizarProgressoPdf(
                    mapearPercentual(calcularPercentual(event.loaded, event.total), 88, 96),
                    'Recebendo PDF'
                );
                return;
            }

            atualizarProgressoPdf(92, 'Recebendo PDF');
        });
        xhr.addEventListener('load', () => {
            pararProgressoConversaoPdf();
            const response = obterRespostaJson(xhr);

            if (xhr.status < 200 || xhr.status >= 300) {
                reject(new Error(response.message || 'Erro ao converter documento'));
                return;
            }

            atualizarProgressoPdf(96, 'PDF recebido');
            resolve(response);
        });
        xhr.addEventListener('timeout', () => {
            pararProgressoConversaoPdf();
            reject(new Error('A conversão demorou mais que o esperado. Tente novamente.'));
        });
        xhr.addEventListener('error', () => {
            pararProgressoConversaoPdf();
            reject(new Error('Não foi possível conectar ao serviço de conversão.'));
        });

        atualizarProgressoPdf(15, 'Enviando documento');
        xhr.send(JSON.stringify(body));
    });
}

function obterRespostaJson(xhr) {
    if (xhr.response && typeof xhr.response === 'object') {
        return xhr.response;
    }

    try {
        return JSON.parse(xhr.responseText || '{}');
    } catch (error) {
        return {};
    }
}

function calcularPercentual(valorAtual, valorTotal) {
    if (!valorTotal) {
        return 0;
    }

    return Math.min(100, Math.max(0, Math.round((valorAtual / valorTotal) * 100)));
}

function mapearPercentual(percentual, minimo, maximo) {
    return minimo + ((maximo - minimo) * (percentual / 100));
}

function reiniciarProgressoPdf() {
    pararProgressoConversaoPdf();
    currentPdfProgress = 0;
    atualizarProgressoPdf(0, 'Preparando documento');
}

function atualizarProgressoPdf(percentual, texto) {
    const valor = Math.min(100, Math.max(currentPdfProgress, Number(percentual) || 0));

    currentPdfProgress = valor;
    pdfProgress.classList.remove('is-hidden');
    pdfProgressBar.style.width = `${valor}%`;
    pdfProgressText.textContent = `${texto}: ${Math.round(valor)}%`;
    pdfProgress.setAttribute('aria-valuenow', String(Math.round(valor)));
    pdfProgress.setAttribute('aria-valuetext', pdfProgressText.textContent);
}

function iniciarProgressoConversaoPdf() {
    const inicio = Date.now();

    pararProgressoConversaoPdf();
    atualizarProgressoPdf(35, 'Convertendo documento (estimativa)');
    pdfConversionProgressTimer = window.setInterval(() => {
        const segundos = (Date.now() - inicio) / 1000;
        const estimativa = 35 + ((1 - Math.exp(-segundos / 14)) * 53);

        atualizarProgressoPdf(Math.min(88, estimativa), 'Convertendo documento (estimativa)');
    }, 400);
}

function pararProgressoConversaoPdf() {
    if (pdfConversionProgressTimer) {
        window.clearInterval(pdfConversionProgressTimer);
        pdfConversionProgressTimer = null;
    }
}

function ocultarProgressoPdf() {
    pararProgressoConversaoPdf();
    currentPdfProgress = 0;
    pdfProgress.classList.add('is-hidden');
    pdfProgressBar.style.removeProperty('width');
    pdfProgressText.textContent = '';
    pdfProgress.removeAttribute('aria-valuenow');
    pdfProgress.removeAttribute('aria-valuetext');
}

function mostrarErroPreviewPdf(error) {
    console.error('Erro ao preparar PDF:', error);
    pdfPreviewModal.classList.remove('is-hidden');
    pdfPreviewLoading.classList.remove('is-hidden');
    pdfCanvas.style.display = 'none';
    pdfPrintButton.disabled = true;
    pdfDownloadButton.disabled = true;
    ocultarProgressoPdf();
    pdfLoadingMessage.textContent = `Erro: ${error.message}`;
    pdfLoadingMessage.style.color = '#c41e3a';
}

async function exibirPdfPreview(pdfBase64, fileName) {
    try {
        atualizarProgressoPdf(97, 'Renderizando pré-visualização');

        // Converter base64 para bytes
        const binaryString = atob(pdfBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Carregar PDF com pdf.js
        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        currentPdfDocument = pdf;
        currentPageNum = 1;

        // Renderizar primeira página
        await renderizarPagePdf(1);

        // Atualizar UI
        atualizarProgressoPdf(100, 'PDF pronto');
        await aguardar(250);
        pdfLoadingMessage.textContent = '';
        pdfPreviewLoading.classList.add('is-hidden');
        pdfCanvas.style.display = 'block';
        pdfPrintButton.disabled = false;
        pdfDownloadButton.disabled = false;

        // Guardar dados para download
        currentPdfData = {
            pdfBase64: pdfBase64,
            fileName: fileName,
        };

    } catch (error) {
        console.error('Erro ao exibir PDF:', error);
        ocultarProgressoPdf();
        pdfLoadingMessage.textContent = `Erro ao exibir PDF: ${error.message}`;
        pdfLoadingMessage.style.color = '#c41e3a';
    }
}

function aguardar(tempo) {
    return new Promise((resolve) => window.setTimeout(resolve, tempo));
}

async function renderizarPagePdf(pageNumber) {
    if (!currentPdfDocument || pageNumber < 1 || pageNumber > currentPdfDocument.numPages) {
        return;
    }

    const page = await currentPdfDocument.getPage(pageNumber);
    const scale = 1.5;
    const viewport = page.getViewport({ scale: scale });

    pdfCanvas.width = viewport.width;
    pdfCanvas.height = viewport.height;

    const context = pdfCanvas.getContext('2d');
    const renderContext = {
        canvasContext: context,
        viewport: viewport,
    };

    await page.render(renderContext).promise;
    currentPageNum = pageNumber;
}

function imprimirPdf() {
    if (!currentPdfData) {
        return;
    }

    // Carrega o PDF em um iframe temporário e abre o diálogo nativo do navegador.
    const iframe = document.createElement('iframe');
    const blob = criarBlobPdfAtual();
    const url = URL.createObjectURL(blob);
    let cleanupTimer = null;

    function limparIframeImpressao() {
        if (cleanupTimer) {
            window.clearTimeout(cleanupTimer);
        }

        URL.revokeObjectURL(url);
        iframe.remove();
    }

    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.src = url;
    iframe.addEventListener('load', () => {
        window.setTimeout(() => {
            const printWindow = iframe.contentWindow;

            if (!printWindow) {
                limparIframeImpressao();
                return;
            }

            printWindow.addEventListener('afterprint', limparIframeImpressao, { once: true });
            printWindow.focus();
            printWindow.print();
        }, 250);
    }, { once: true });

    document.body.appendChild(iframe);
    cleanupTimer = window.setTimeout(limparIframeImpressao, 120000);
}

function baixarPdfProtegido() {
    if (!currentPdfData) {
        return;
    }

    const url = URL.createObjectURL(criarBlobPdfAtual());
    const link = document.createElement('a');

    link.href = url;
    link.download = currentPdfData.fileName || 'documento-protegido.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function criarBlobPdfAtual() {
    const binaryString = atob(currentPdfData.pdfBase64);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes], { type: 'application/pdf' });
}

function fecharModalPdf() {
    pdfPreviewModal.classList.add('is-hidden');
    currentPdfData = null;
    currentPdfDocument = null;
    currentPageNum = 1;
    pdfCanvas.width = 0;
    pdfCanvas.height = 0;
    pdfPreviewLoading.classList.remove('is-hidden');
    pdfLoadingMessage.textContent = '';
    pdfLoadingMessage.style.color = '';
    ocultarProgressoPdf();
}

// Event listeners
printPdfButton?.addEventListener('click', async () => {
    if (!validarCamposObrigatorios()) {
        return;
    }

    try {
        await garantirBibliotecas();
        const dados = coletarDadosDoFormulario();
        const docxBlob = await gerarArquivoDocx(dados, obterCaminhoDoModelo());
        await converterDocumentoEmPdf('comodato', docxBlob);
    } catch (error) {
        mostrarErroPreviewPdf(error);
    }
});

simplePrintPdfButton?.addEventListener('click', async () => {
    const templateType =
        simplePrintPdfButton.dataset.documentType ||
        window.documentoSimplesTipoAtual ||
        "";

    if (!templateType) {
        pdfPreviewModal.classList.remove('is-hidden');
        pdfPreviewLoading.classList.remove('is-hidden');
        pdfCanvas.style.display = 'none';
        ocultarProgressoPdf();
        pdfLoadingMessage.textContent = 'Erro: tipo de documento não identificado.';
        pdfLoadingMessage.style.color = '#c41e3a';
        return;
    }

    if (!documentoSimplesAtual || !validarDocumentoSimples()) {
        return;
    }

    try {
        await garantirBibliotecas();
        const dados = coletarDadosDocumentoSimples();
        const docxBlob = await gerarArquivoDocx(dados, obterCaminhoModeloDocumentoSimples(dados));
        await converterDocumentoEmPdf(templateType, docxBlob);
    } catch (error) {
        mostrarErroPreviewPdf(error);
    }
});

pdfPrintButton?.addEventListener('click', imprimirPdf);
pdfDownloadButton?.addEventListener('click', baixarPdfProtegido);
pdfPreviewCloseButton?.addEventListener('click', fecharModalPdf);
pdfCloseButton?.addEventListener('click', fecharModalPdf);

// Fechar modal ao clicar fora
pdfPreviewModal?.addEventListener('click', (event) => {
    if (event.target === pdfPreviewModal) {
        fecharModalPdf();
    }
});
