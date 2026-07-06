import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import libre from 'libreoffice-convert';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { randomBytes } from 'crypto';

const app = express();
const PORT = process.env.PORT || 3000;
const MAX_DOCX_BYTES = 10 * 1024 * 1024;
const MAX_PDF_BYTES = Number(process.env.MAX_PDF_BYTES || 50 * 1024 * 1024);
const RENDER_API_SECRET = String(process.env.RENDER_API_SECRET || '').trim();

const convert = promisify(libre.convert);
const execFileAsync = promisify(execFile);

app.use(cors());
app.use(express.json({ limit: '80mb' }));

app.get('/health', async (req, res) => {
    const checks = await Promise.allSettled([
        checkCommand('libreoffice', ['--version']),
        checkCommand('qpdf', ['--version']),
        checkCommand('ocrmypdf', ['--version']),
        checkCommand('tesseract', ['--version']),
        checkCommand('pdftotext', ['-v']),
        checkCommand('gs', ['--version']),
    ]);

    const names = ['libreoffice', 'qpdf', 'ocrmypdf', 'tesseract', 'pdftotext', 'ghostscript'];
    const dependencies = Object.fromEntries(names.map((name, index) => [name, checks[index].status === 'fulfilled']));
    const ok = dependencies.libreoffice && dependencies.qpdf;

    res.status(ok ? 200 : 503).json({
        status: ok ? 'ok' : 'error',
        message: ok
            ? 'PDF API is running. DOCX to PDF, protected PDF, compression and OCR routes are available.'
            : 'Required dependencies are unavailable.',
        dependencies,
        maxPdfMb: Math.round(MAX_PDF_BYTES / (1024 * 1024)),
    });
});

app.post('/api/convert-docx-to-pdf', async (req, res) => {
    try {
        assertRenderSecret(req);
        const { docxBase64, fileName = 'documento.docx' } = req.body;
        const docxBytes = decodeBase64File(docxBase64, MAX_DOCX_BYTES, 'DOCX');

        if (!docxBytes || !isZipLike(docxBytes)) {
            return res.status(400).json({
                success: false,
                error: 'Envie um arquivo DOCX valido em base64 com ate 10 MB.',
            });
        }

        const pdfBuffer = await convert(docxBytes, '.pdf', undefined);
        const protectedPdfBuffer = await protectPdf(pdfBuffer);

        res.json({
            success: true,
            protected: true,
            pdfBase64: protectedPdfBuffer.toString('base64'),
            fileName: getPdfFileName(fileName),
        });
    } catch (error) {
        handleRouteError(res, error, 'Erro ao converter DOCX para PDF.');
    }
});

app.post('/api/convert-html-to-pdf', async (req, res) => {
    try {
        assertRenderSecret(req);
        const { html, fileName = 'documento.pdf' } = req.body;

        if (!html) {
            return res.status(400).json({ success: false, error: 'html e obrigatorio.' });
        }

        const pdfBuffer = await convert(Buffer.from(html, 'utf8'), '.pdf', undefined);
        const protectedPdfBuffer = await protectPdf(pdfBuffer);

        res.json({
            success: true,
            protected: true,
            pdfBase64: protectedPdfBuffer.toString('base64'),
            fileName: sanitizePdfFileName(fileName),
        });
    } catch (error) {
        handleRouteError(res, error, 'Erro ao converter HTML para PDF.');
    }
});

app.post('/api/pdf/compress', async (req, res) => {
    let workspace = null;

    try {
        assertRenderSecret(req);
        const { fileBase64, fileName = 'documento.pdf', level = 'balanced' } = req.body;
        const inputBuffer = decodeBase64File(fileBase64, MAX_PDF_BYTES, 'PDF');

        if (!inputBuffer || !isPdf(inputBuffer)) {
            return res.status(400).json({ success: false, error: 'Envie um PDF valido em base64.' });
        }

        workspace = await fs.mkdtemp(path.join(os.tmpdir(), 'pdf-compress-'));
        const inputPath = path.join(workspace, 'input.pdf');
        const optimizedPath = path.join(workspace, 'optimized.pdf');
        const qpdfPath = path.join(workspace, 'qpdf.pdf');
        const ghostscriptPath = path.join(workspace, 'ghostscript.pdf');

        await fs.writeFile(inputPath, inputBuffer);

        const textInfo = await inspectPdfText(inputPath);
        const preset = getCompressionPreset(level);

        // Primeiro faz uma otimizacao segura. O OCRmyPDF preserva a camada de texto/OCR quando existe.
        const ocrArgs = [
            '--skip-text',
            '--optimize', String(preset.optimize),
            '--jpeg-quality', String(preset.jpegQuality),
            '--png-quality', String(preset.pngQuality),
            '--output-type', 'pdf',
            inputPath,
            optimizedPath,
        ];

        await runCommand('ocrmypdf', ocrArgs, { timeout: preset.timeout });

        // Fallback/concorrente estrutural com qpdf, preserva texto e metadados do PDF.
        await runCommand('qpdf', ['--object-streams=generate', '--stream-data=compress', inputPath, qpdfPath], { timeout: 30000 });
        await tryOptimizeWithGhostscript(inputPath, ghostscriptPath, preset, 'compress');

        const candidates = await collectExistingCandidates([
            { type: 'original', path: inputPath },
            { type: 'qpdf', path: qpdfPath },
            { type: `otimizacao-${preset.name}`, path: optimizedPath },
            { type: `gs-${preset.name}`, path: ghostscriptPath },
        ]);

        // Se o PDF original tinha texto/OCR, NUNCA escolha uma saída que perdeu texto.
        // Isso impede que a compactação devolva um PDF visualmente menor, mas sem OCR pesquisável.
        const best = textInfo.hasText
            ? await chooseSmallestPreservingText(candidates, inputPath)
            : chooseSmallest(candidates);

        const outputTextInfo = textInfo.hasText ? await inspectPdfText(best.path) : { hasText: false, characters: 0 };
        const outputBuffer = await fs.readFile(best.path);

        res.json({
            success: true,
            pdfBase64: outputBuffer.toString('base64'),
            fileName: getProcessedPdfFileName(fileName, 'compactado'),
            originalBytes: inputBuffer.length,
            outputBytes: outputBuffer.length,
            strategy: best.type,
            hadText: textInfo.hasText,
            preservedText: !textInfo.hasText || outputTextInfo.hasText,
            inputTextCharacters: textInfo.characters,
            outputTextCharacters: outputTextInfo.characters,
            message: buildCompressionMessage(inputBuffer.length, outputBuffer.length, best.type, textInfo.hasText),
        });
    } catch (error) {
        handleRouteError(res, error, 'Falha ao compactar PDF no servidor.');
    } finally {
        if (workspace) {
            await fs.rm(workspace, { recursive: true, force: true });
        }
    }
});

app.post('/api/pdf/ocr', async (req, res) => {
    let workspace = null;

    try {
        assertRenderSecret(req);
        const { fileBase64, fileName = 'pdf-pesquisavel.pdf', language = 'por', level = 'balanced' } = req.body;
        const inputBuffer = decodeBase64File(fileBase64, MAX_PDF_BYTES, 'PDF/imagem');

        if (!inputBuffer) {
            return res.status(400).json({ success: false, error: 'Envie um PDF ou imagem valida em base64.' });
        }

        workspace = await fs.mkdtemp(path.join(os.tmpdir(), 'pdf-ocr-'));
        const ext = chooseInputExtension(fileName, inputBuffer);
        const inputPath = path.join(workspace, `input${ext}`);
        const outputPath = path.join(workspace, 'output.pdf');
        const qpdfPath = path.join(workspace, 'qpdf.pdf');
        const qpdfOcrPath = path.join(workspace, 'ocr-qpdf.pdf');
        const ghostscriptOcrPath = path.join(workspace, 'ocr-gs.pdf');

        await fs.writeFile(inputPath, inputBuffer);

        const isInputPdf = isPdf(inputBuffer);
        const textInfo = isInputPdf ? await inspectPdfText(inputPath) : { hasText: false, characters: 0 };
        const preset = getCompressionPreset(level);
        const safeLanguage = normalizeOcrLanguage(language);

        const args = [
            '-l', safeLanguage,
            '--skip-text',
            '--optimize', String(preset.optimize),
            '--jpeg-quality', String(preset.jpegQuality),
            '--png-quality', String(preset.pngQuality),
            '--output-type', 'pdf',
            inputPath,
            outputPath,
        ];

        await runCommand('ocrmypdf', args, { timeout: preset.timeout });
        await tryOptimizeWithQpdf(outputPath, qpdfOcrPath);
        await tryOptimizeWithGhostscript(outputPath, ghostscriptOcrPath, preset, 'ocr');

        // Se o PDF ja tinha texto/OCR e o OCRmyPDF aumentou demais, devolve uma versao qpdf ou original.
        if (isInputPdf && textInfo.hasText) {
            await runCommand('qpdf', ['--object-streams=generate', '--stream-data=compress', inputPath, qpdfPath], { timeout: 30000 });
        }

        const candidates = await collectExistingCandidates([
            { type: 'ocrmypdf', path: outputPath },
            { type: 'ocr-qpdf', path: qpdfOcrPath },
            { type: `ocr-gs-${preset.name}`, path: ghostscriptOcrPath },
            ...(isInputPdf && textInfo.hasText ? [
                { type: 'qpdf-preservado', path: qpdfPath },
                { type: 'original-com-ocr', path: inputPath },
            ] : []),
        ]);

        const chosen = isInputPdf && textInfo.hasText
            ? await chooseSmallestPreservingText(candidates, inputPath)
            : await chooseSmallestWithText(candidates, outputPath);

        const outputTextInfo = await inspectPdfText(chosen.path);
        const outputBuffer = await fs.readFile(chosen.path);

        res.json({
            success: true,
            pdfBase64: outputBuffer.toString('base64'),
            fileName: getProcessedPdfFileName(fileName, 'ocr-pesquisavel'),
            originalBytes: inputBuffer.length,
            outputBytes: outputBuffer.length,
            strategy: chosen.type,
            hadText: textInfo.hasText,
            preservedText: !textInfo.hasText || outputTextInfo.hasText,
            outputHasText: outputTextInfo.hasText,
            inputTextCharacters: textInfo.characters,
            outputTextCharacters: outputTextInfo.characters,
            language: safeLanguage,
            message: buildOcrMessage(inputBuffer.length, outputBuffer.length, chosen.type, textInfo.hasText),
        });
    } catch (error) {
        handleRouteError(res, error, 'Falha ao aplicar OCR no servidor.');
    } finally {
        if (workspace) {
            await fs.rm(workspace, { recursive: true, force: true });
        }
    }
});

function assertRenderSecret(req) {
    const secret = String(process.env.RENDER_API_SECRET || '').trim();

    // Modo compatível: se o segredo não estiver configurado no Render,
    // a conversão continua funcionando. Para produção segura, configure
    // RENDER_API_SECRET no Render e o mesmo segredo no Worker.
    if (!secret) {
        console.warn('RENDER_API_SECRET não configurado. Conversão liberada em modo compatível.');
        return;
    }

    const received = String(req.get('x-render-secret') || '').trim();

    if (received !== secret) {
        const error = new Error('Acesso nao autorizado.');
        error.status = 401;
        throw error;
    }
}

function decodeBase64File(value, maxBytes, label) {
    const base64 = String(value || '').trim();

    if (!base64 || !/^[a-zA-Z0-9+/]+={0,2}$/.test(base64)) {
        return null;
    }

    const bytes = Buffer.from(base64, 'base64');

    if (!bytes.length || bytes.length > maxBytes) {
        return null;
    }

    return bytes;
}

function isZipLike(buffer) {
    return buffer[0] === 0x50 && buffer[1] === 0x4b;
}

function isPdf(buffer) {
    return buffer.subarray(0, 5).toString('utf8') === '%PDF-';
}

function chooseInputExtension(fileName, buffer) {
    const lower = String(fileName || '').toLowerCase();

    if (isPdf(buffer) || lower.endsWith('.pdf')) return '.pdf';
    if (lower.endsWith('.png')) return '.png';
    if (lower.endsWith('.webp')) return '.webp';
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return '.jpg';

    if (buffer[0] === 0x89 && buffer[1] === 0x50) return '.png';
    if (buffer[0] === 0xff && buffer[1] === 0xd8) return '.jpg';

    return '.pdf';
}

function getCompressionPreset(level) {
    const key = String(level || 'balanced').toLowerCase();
    const presets = {
        balanced: { name: 'equilibrada', optimize: 2, jpegQuality: 72, pngQuality: 72, timeout: 120000 },
        strong: { name: 'forte', optimize: 3, jpegQuality: 62, pngQuality: 62, timeout: 150000 },
        maximum: { name: 'maxima', optimize: 3, jpegQuality: 52, pngQuality: 52, timeout: 180000 },
    };

    return presets[key] || presets.balanced;
}

function normalizeOcrLanguage(language) {
    const value = String(language || 'por').toLowerCase().replace(/[^a-z+]/g, '');
    const allowed = new Set(['por', 'eng', 'por+eng', 'eng+por']);
    return allowed.has(value) ? value : 'por';
}

async function inspectPdfText(pdfPath) {
    const txtPath = `${pdfPath}.txt`;

    try {
        await runCommand('pdftotext', ['-enc', 'UTF-8', pdfPath, txtPath], { timeout: 30000 });
        const text = await fs.readFile(txtPath, 'utf8');
        const characters = text.replace(/\s+/g, '').length;
        return { hasText: characters >= 20, characters };
    } catch (error) {
        return { hasText: false, characters: 0 };
    } finally {
        await fs.rm(txtPath, { force: true });
    }
}

async function collectExistingCandidates(candidates) {
    const existing = [];

    for (const candidate of candidates) {
        try {
            const stat = await fs.stat(candidate.path);
            if (stat.size > 0) {
                existing.push({ ...candidate, size: stat.size });
            }
        } catch (_) {
            // ignore
        }
    }

    if (!existing.length) {
        throw new Error('Nenhum PDF final foi gerado.');
    }

    return existing;
}

async function tryOptimizeWithQpdf(inputPath, outputPath) {
    try {
        await runCommand('qpdf', [
            '--object-streams=generate',
            '--stream-data=compress',
            inputPath,
            outputPath,
        ], { timeout: 30000 });
    } catch (error) {
        console.warn('Otimizacao qpdf ignorada:', error.message || error);
    }
}

function getGhostscriptSettings(preset, purpose = 'compress') {
    const isMaximum = preset.name === 'maxima';
    const isStrong = preset.name === 'forte';

    if (purpose === 'ocr') {
        return {
            imageResolution: isMaximum ? 180 : isStrong ? 200 : 220,
            monoResolution: isMaximum ? 360 : isStrong ? 400 : 450,
            jpegQuality: isMaximum ? 74 : isStrong ? 80 : 86,
        };
    }

    return {
        imageResolution: isMaximum ? 120 : isStrong ? 140 : 170,
        monoResolution: isMaximum ? 260 : isStrong ? 300 : 350,
        jpegQuality: isMaximum ? 58 : isStrong ? 66 : 76,
    };
}

async function tryOptimizeWithGhostscript(inputPath, outputPath, preset, purpose = 'compress') {
    const settings = getGhostscriptSettings(preset, purpose);

    try {
        await runCommand('gs', [
            '-sDEVICE=pdfwrite',
            '-dCompatibilityLevel=1.4',
            '-dNOPAUSE',
            '-dQUIET',
            '-dBATCH',
            '-dDetectDuplicateImages=true',
            '-dCompressFonts=true',
            '-dSubsetFonts=true',
            '-dDownsampleColorImages=true',
            '-dColorImageDownsampleType=/Bicubic',
            `-dColorImageResolution=${settings.imageResolution}`,
            '-dDownsampleGrayImages=true',
            '-dGrayImageDownsampleType=/Bicubic',
            `-dGrayImageResolution=${settings.imageResolution}`,
            '-dDownsampleMonoImages=true',
            '-dMonoImageDownsampleType=/Subsample',
            `-dMonoImageResolution=${settings.monoResolution}`,
            '-dAutoFilterColorImages=false',
            '-dAutoFilterGrayImages=false',
            '-dColorImageFilter=/DCTEncode',
            '-dGrayImageFilter=/DCTEncode',
            `-dJPEGQ=${settings.jpegQuality}`,
            `-sOutputFile=${outputPath}`,
            inputPath,
        ], { timeout: preset.timeout });
    } catch (error) {
        console.warn('Otimizacao Ghostscript ignorada:', error.message || error);
    }
}

function chooseSmallest(candidates) {
    return candidates.reduce((best, current) => current.size < best.size ? current : best);
}

async function getMinimumTextCharacters(referencePath) {
    if (!referencePath) {
        return 20;
    }

    const referenceInfo = await inspectPdfText(referencePath);

    if (referenceInfo.characters < 100) {
        return 20;
    }

    return Math.max(20, Math.floor(referenceInfo.characters * 0.8));
}

async function chooseSmallestWithText(candidates, referencePath = null) {
    const minimumTextCharacters = await getMinimumTextCharacters(referencePath);
    const withText = [];

    for (const candidate of candidates) {
        const info = await inspectPdfText(candidate.path);

        if (info.hasText && info.characters >= minimumTextCharacters) {
            withText.push({
                ...candidate,
                textCharacters: info.characters,
            });
        }
    }

    if (!withText.length) {
        throw new Error('OCR nao gerou texto pesquisavel no PDF final.');
    }

    return chooseSmallest(withText);
}

async function chooseSmallestPreservingText(candidates, originalPath) {
    const minimumTextCharacters = await getMinimumTextCharacters(originalPath);
    const preserving = [];

    for (const candidate of candidates) {
        const info = await inspectPdfText(candidate.path);

        if (info.hasText && info.characters >= minimumTextCharacters) {
            preserving.push({
                ...candidate,
                textCharacters: info.characters,
            });
        }
    }

    if (preserving.length) {
        return chooseSmallest(preserving);
    }

    // Última trava de segurança: se algo saiu sem OCR, devolve o original em vez de perder texto.
    const stat = await fs.stat(originalPath);
    return {
        type: 'original-preservado',
        path: originalPath,
        size: stat.size,
    };
}

function buildCompressionMessage(originalBytes, outputBytes, strategy, hadText) {
    const reduction = originalBytes > outputBytes
        ? Math.max(1, Math.round(((originalBytes - outputBytes) / originalBytes) * 100))
        : 0;
    const prefix = hadText
        ? 'PDF compactado preservando texto/OCR pesquisavel.'
        : 'PDF compactado e otimizado.';

    if (reduction > 0) {
        return `${prefix} Estrategia: ${strategy}. Reducao aproximada: ${reduction}%.`;
    }

    return `${prefix} O arquivo original ja estava otimizado; foi retornada a melhor versao segura.`;
}

function buildOcrMessage(originalBytes, outputBytes, strategy, hadText) {
    if (hadText) {
        return `Este PDF ja tinha texto/OCR. Foi retornada a melhor versao otimizada sem refazer OCR desnecessario. Estrategia: ${strategy}.`;
    }

    const growth = outputBytes > originalBytes ? Math.round(((outputBytes - originalBytes) / originalBytes) * 100) : 0;
    const reduction = originalBytes > outputBytes ? Math.max(1, Math.round(((originalBytes - outputBytes) / originalBytes) * 100)) : 0;

    if (reduction > 0) {
        return `OCR aplicado e pos-otimizado. O PDF ficou pesquisavel e reduziu cerca de ${reduction}%. Estrategia: ${strategy}.`;
    }

    if (growth > 0) {
        return `OCR aplicado e pos-otimizado. O PDF ficou pesquisavel e aumentou cerca de ${growth}% por causa da camada OCR. Estrategia: ${strategy}.`;
    }

    return `OCR aplicado e pos-otimizado. O PDF ficou pesquisavel sem aumento relevante. Estrategia: ${strategy}.`;
}

function getPdfFileName(value) {
    const baseName = path.basename(String(value || 'documento.docx'))
        .replace(/\.docx$/i, '')
        .replace(/[^a-zA-Z0-9._-]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return `${baseName || 'documento'}.pdf`;
}

function sanitizePdfFileName(value) {
    const baseName = path.basename(String(value || 'documento.pdf'))
        .replace(/[^a-zA-Z0-9._-]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return baseName.toLowerCase().endsWith('.pdf') ? baseName : `${baseName || 'documento'}.pdf`;
}

function getProcessedPdfFileName(value, suffix) {
    const baseName = path.basename(String(value || 'documento.pdf'))
        .replace(/\.pdf$/i, '')
        .replace(/\.(jpg|jpeg|png|webp)$/i, '')
        .replace(/[^a-zA-Z0-9._-]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return `${baseName || 'documento'}-${suffix}.pdf`;
}

async function protectPdf(pdfBuffer) {
    const workspace = await fs.mkdtemp(path.join(os.tmpdir(), 'protected-pdf-'));
    const inputPath = path.join(workspace, 'input.pdf');
    const outputPath = path.join(workspace, 'output.pdf');
    const ownerPassword = randomBytes(32).toString('hex');

    try {
        await fs.writeFile(inputPath, pdfBuffer);
        await runCommand('qpdf', [
            '--encrypt',
            '',
            ownerPassword,
            '256',
            '--print=full',
            '--modify=none',
            '--extract=n',
            '--annotate=n',
            '--form=n',
            '--assemble=n',
            '--',
            inputPath,
            outputPath,
        ], { timeout: 15000 });
        return await fs.readFile(outputPath);
    } finally {
        await fs.rm(workspace, { recursive: true, force: true });
    }
}

async function checkCommand(command, args) {
    await execFileAsync(command, args, { timeout: 5000, maxBuffer: 1024 * 1024 });
}

async function runCommand(command, args, options = {}) {
    try {
        return await execFileAsync(command, args, {
            timeout: options.timeout || 60000,
            maxBuffer: options.maxBuffer || 10 * 1024 * 1024,
        });
    } catch (error) {
        const details = [error.message, error.stderr, error.stdout].filter(Boolean).join('\n');
        const wrapped = new Error(details || `Falha ao executar ${command}.`);
        wrapped.status = error.status;
        throw wrapped;
    }
}

function handleRouteError(res, error, fallbackMessage) {
    console.error(fallbackMessage, error);
    const status = error.status === 400 || error.status === 401 ? error.status : 500;
    res.status(status).json({
        success: false,
        error: status === 401 ? 'Acesso nao autorizado.' : fallbackMessage,
        details: process.env.NODE_ENV === 'production' ? undefined : String(error.message || error),
    });
}

app.use((err, req, res, next) => {
    console.error('Erro nao tratado:', err);
    const status = err.status === 400 ? 400 : 500;
    res.status(status).json({
        success: false,
        error: status === 400 ? 'JSON invalido' : 'Erro interno do servidor',
    });
});

app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Rota nao encontrada' });
});

app.listen(PORT, () => {
    console.log(`PDF API rodando em http://localhost:${PORT}`);
    console.log('Rotas: /health, /api/convert-docx-to-pdf, /api/pdf/compress, /api/pdf/ocr');
});

export default app;
