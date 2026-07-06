import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import libre from 'libreoffice-convert';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { randomBytes } from 'crypto';

// =============================================================================
// AVISO IMPORTANT sobre REFACTOR APOS ESTUDO
// Este arquivo (server.js na raiz) e um BACKEND PDF LEGADO/DUPLICADO.
// A fonte da verdade em PRODUCCAO e render-server/server.js (com Dockerfile
// proprio em render-server/Dockerfile). Este arquivo foi mantido apenas como
// referencia e NAO deve ser usado como caminho de deploy.
// Limites e politicas de segredo aqui foram unificados a render-server para
// evitar divergencia de comportamento.
//
// Para subir o backend PDF:  cd render-server && npm install && npm start
// =============================================================================

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const MAX_DOCX_BYTES = 10 * 1024 * 1024; // 10 MB
// Limite unificado com render-server/server.js (50 MB). Antes era 80 MB aqui.
const MAX_PDF_BYTES = Number(process.env.MAX_PDF_BYTES) || 50 * 1024 * 1024;
const RENDER_API_SECRET = String(process.env.RENDER_API_SECRET || '').trim();

const convert = promisify(libre.convert);
const execFileAsync = promisify(execFile);

app.use(cors());
// Limite de body unificado com render-server/server.js (80 MB). Antes era 110 MB.
app.use(express.json({ limit: '80mb' }));

// Middleware de segredo obrigatorio. Em producao, NENHUMA rota sensivel pode
// ficar publica se RENDER_API_SECRET estiver ausente (falha segura 503).
app.use((req, res, next) => {
    // Permitir /health mesmo sem segredo, p/ check de liveness.
    if (req.path === '/health') {
        return next();
    }

    if (!RENDER_API_SECRET) {
        if (NODE_ENV === 'production') {
            return res.status(503).json({
                success: false,
                error:
                    'RENDER_API_SECRET nao configurado.DEFINE RENDER_API_SECRET antes de subir em producao.',
            });
        }
        return next(); // dev: permite chamar localmente sem secret
    }

    const receivedSecret = req.get('X-Render-Secret') || '';

    if (receivedSecret !== RENDER_API_SECRET) {
        return res.status(401).json({
            success: false,
            error: 'Acesso negado.',
        });
    }

    next();
});

app.get('/health', async (req, res) => {
    const checks = await Promise.allSettled([
        execFileAsync('libreoffice', ['--version'], { timeout: 5000 }),
        execFileAsync('qpdf', ['--version'], { timeout: 5000 }),
        execFileAsync('ocrmypdf', ['--version'], { timeout: 5000 }),
        execFileAsync('tesseract', ['--version'], { timeout: 5000 }),
        execFileAsync('pdftotext', ['-v'], { timeout: 5000 }),
        execFileAsync('gs', ['--version'], { timeout: 5000 }),
    ]);

    const names = ['libreoffice', 'qpdf', 'ocrmypdf', 'tesseract', 'pdftotext', 'ghostscript'];
    const dependencies = Object.fromEntries(names.map((name, index) => [name, checks[index].status === 'fulfilled']));
    const ok = Object.values(dependencies).every(Boolean);

    res.status(ok ? 200 : 503).json({
        status: ok ? 'ok' : 'error',
        message: ok
            ? 'PDF API rodando com conversao, protecao, OCR e compactacao.'
            : 'Uma ou mais dependencias estao indisponiveis.',
        dependencies,
    });
});

app.post('/api/convert-docx-to-pdf', async (req, res) => {
    try {
        const { docxBase64, fileName = 'documento.docx' } = req.body;
        const docxBytes = decodeBase64File(docxBase64, MAX_DOCX_BYTES, 'docx');

        if (!docxBytes) {
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
        console.error('Erro ao converter DOCX para PDF:', error.message);
        res.status(500).json({
            success: false,
            error: 'Falha ao converter DOCX para PDF. Tente novamente.',
        });
    }
});

app.post('/api/convert-html-to-pdf', async (req, res) => {
    try {
        const { html, fileName = 'documento.pdf' } = req.body;

        if (!html) {
            return res.status(400).json({
                success: false,
                error: 'html e obrigatorio.',
            });
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
        console.error('Erro ao converter HTML para PDF:', error.message);
        res.status(500).json({
            success: false,
            error: 'Falha ao converter HTML para PDF. Tente novamente.',
        });
    }
});

/**
 * POST /api/pdf/compress
 * Compacta PDF sem remover OCR/camada de texto quando ela existir.
 * Body: { pdfBase64, fileName, level: 'light'|'balanced'|'strong' }
 */
app.post('/api/pdf/compress', async (req, res) => {
    const workspace = await createWorkspace('compress-pdf-');

    try {
        const { pdfBase64, fileName = 'pdf-compactado.pdf', level = 'balanced' } = req.body;
        const inputBuffer = decodeBase64File(pdfBase64, MAX_PDF_BYTES, 'pdf');

        if (!inputBuffer) {
            return res.status(400).json({
                success: false,
                error: 'Envie um PDF valido em base64 com ate 80 MB.',
            });
        }

        const inputPath = path.join(workspace, 'input.pdf');
        const safePath = path.join(workspace, 'safe.pdf');
        const strongPath = path.join(workspace, 'strong.pdf');
        await fs.writeFile(inputPath, inputBuffer);

        const hadText = await pdfHasText(inputPath);
        const profile = getCompressionProfile(level);

        await optimizePdfSafely(inputPath, safePath, profile);

        let outputPath = safePath;
        let strategy = hadText ? 'safe-preserve-ocr' : 'safe-structural';

        // Se o PDF nao tem OCR/texto, podemos tentar Ghostscript para reduzir mais.
        // Se tem texto/OCR, nao usamos a versao que pode alterar a camada de texto.
        if (!hadText) {
            try {
                await compressPdfWithGhostscript(inputPath, strongPath, profile);
                outputPath = await chooseSmallerExistingFile(safePath, strongPath);
                strategy = outputPath === strongPath ? 'visual-compression' : 'safe-structural';
            } catch (error) {
                console.warn('Ghostscript falhou. Usando compactacao segura:', error.message);
            }
        }

        const outputBuffer = await fs.readFile(outputPath);

        res.json({
            success: true,
            pdfBase64: outputBuffer.toString('base64'),
            fileName: addSuffixToPdfName(fileName, 'compactado'),
            hadText,
            preservedOcr: hadText,
            strategy,
            originalBytes: inputBuffer.length,
            finalBytes: outputBuffer.length,
            reductionPercent: calculateReductionPercent(inputBuffer.length, outputBuffer.length),
            message: hadText
                ? 'PDF compactado preservando a camada de texto/OCR existente.'
                : 'PDF compactado. O arquivo original nao tinha texto/OCR detectavel.',
        });
    } catch (error) {
        console.error('Erro ao compactar PDF:', error.message);
        res.status(500).json({
            success: false,
            error: 'Falha ao compactar PDF. Tente outro nivel de compactacao.',
        });
    } finally {
        await removeWorkspace(workspace);
    }
});

/**
 * POST /api/pdf/ocr
 * Cria PDF pesquisavel sem aumentar demais o tamanho.
 * Body: { pdfBase64, fileName, language: 'por'|'eng'|'por+eng', level: 'light'|'balanced'|'strong' }
 */
app.post('/api/pdf/ocr', async (req, res) => {
    const workspace = await createWorkspace('ocr-pdf-');

    try {
        const {
            pdfBase64,
            fileName = 'pdf-pesquisavel.pdf',
            language = 'por',
            level = 'balanced',
            force = false,
        } = req.body;
        const inputBuffer = decodeBase64File(pdfBase64, MAX_PDF_BYTES, 'pdf');

        if (!inputBuffer) {
            return res.status(400).json({
                success: false,
                error: 'Envie um PDF valido em base64 com ate 80 MB.',
            });
        }

        const inputPath = path.join(workspace, 'input.pdf');
        const outputPath = path.join(workspace, 'ocr.pdf');
        await fs.writeFile(inputPath, inputBuffer);

        const hadText = await pdfHasText(inputPath);
        const profile = getCompressionProfile(level);
        const safeLanguage = normalizeOcrLanguage(language);

        await runOcrMyPdf(inputPath, outputPath, {
            language: safeLanguage,
            level: profile,
            mode: force ? 'force' : 'skip-text',
        });

        const outputBuffer = await fs.readFile(outputPath);

        res.json({
            success: true,
            pdfBase64: outputBuffer.toString('base64'),
            fileName: addSuffixToPdfName(fileName, 'ocr'),
            hadText,
            skippedExistingText: hadText && !force,
            originalBytes: inputBuffer.length,
            finalBytes: outputBuffer.length,
            increasePercent: calculateIncreasePercent(inputBuffer.length, outputBuffer.length),
            message: hadText && !force
                ? 'O PDF ja tinha texto/OCR. Mantivemos o texto e otimizamos o arquivo.'
                : 'OCR aplicado e PDF otimizado para evitar aumento exagerado.',
        });
    } catch (error) {
        console.error('Erro ao aplicar OCR:', error.message);
        res.status(500).json({
            success: false,
            error: 'Falha ao aplicar OCR no PDF. Confira se o arquivo nao esta corrompido ou protegido.',
        });
    } finally {
        await removeWorkspace(workspace);
    }
});

function decodeBase64File(value, maxBytes, type) {
    const base64 = String(value || '').trim();

    if (!base64 || !/^[a-zA-Z0-9+/]+={0,2}$/.test(base64)) {
        return null;
    }

    const buffer = Buffer.from(base64, 'base64');

    if (!buffer.length || buffer.length > maxBytes) {
        return null;
    }

    if (type === 'docx') {
        return buffer[0] === 0x50 && buffer[1] === 0x4b ? buffer : null;
    }

    if (type === 'pdf') {
        return buffer.slice(0, 5).toString('latin1') === '%PDF-' ? buffer : null;
    }

    return buffer;
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

function addSuffixToPdfName(fileName, suffix) {
    const clean = sanitizePdfFileName(fileName).replace(/\.pdf$/i, '');
    return `${clean || 'documento'}-${suffix}.pdf`;
}

async function protectPdf(pdfBuffer) {
    const workspace = await createWorkspace('protected-pdf-');
    const inputPath = path.join(workspace, 'input.pdf');
    const outputPath = path.join(workspace, 'output.pdf');
    const ownerPassword = randomBytes(32).toString('hex');

    try {
        await fs.writeFile(inputPath, pdfBuffer);
        await execFileAsync('qpdf', [
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
        ], {
            timeout: 20000,
            maxBuffer: 1024 * 1024,
        });
        return await fs.readFile(outputPath);
    } finally {
        await removeWorkspace(workspace);
    }
}

async function optimizePdfSafely(inputPath, outputPath, profile) {
    const tempPath = `${outputPath}.qpdf.pdf`;

    await execFileAsync('qpdf', [
        '--object-streams=generate',
        '--stream-data=compress',
        '--recompress-flate',
        '--compression-level=9',
        '--',
        inputPath,
        tempPath,
    ], {
        timeout: 60000,
        maxBuffer: 2 * 1024 * 1024,
    });

    // OCRmyPDF otimiza imagens e mantem/evita refazer texto com --skip-text.
    // Se falhar, ficamos com a versao qpdf.
    try {
        await runOcrMyPdf(tempPath, outputPath, {
            language: 'por',
            level: profile,
            mode: 'skip-text',
            optimizeOnly: true,
        });
    } catch (error) {
        console.warn('OCRmyPDF optimize falhou. Usando qpdf:', error.message);
        await fs.copyFile(tempPath, outputPath);
    }
}

async function compressPdfWithGhostscript(inputPath, outputPath, profile) {
    await execFileAsync('gs', [
        '-sDEVICE=pdfwrite',
        '-dCompatibilityLevel=1.6',
        '-dNOPAUSE',
        '-dQUIET',
        '-dBATCH',
        '-dDetectDuplicateImages=true',
        '-dCompressFonts=true',
        '-dSubsetFonts=true',
        '-dAutoRotatePages=/None',
        '-dColorImageDownsampleType=/Bicubic',
        '-dGrayImageDownsampleType=/Bicubic',
        '-dMonoImageDownsampleType=/Subsample',
        `-dColorImageResolution=${profile.dpi}`,
        `-dGrayImageResolution=${profile.dpi}`,
        '-dMonoImageResolution=300',
        '-dColorImageDownsampleThreshold=1.2',
        '-dGrayImageDownsampleThreshold=1.2',
        '-sOutputFile=' + outputPath,
        inputPath,
    ], {
        timeout: 120000,
        maxBuffer: 4 * 1024 * 1024,
    });
}

async function runOcrMyPdf(inputPath, outputPath, options) {
    const mode = options.mode || 'skip-text';
    const profile = options.level || getCompressionProfile('balanced');
    const args = [
        '-l',
        options.language || 'por',
        '--output-type',
        'pdf',
        '--optimize',
        String(profile.optimize),
        '--jpeg-quality',
        String(profile.jpegQuality),
        '--png-quality',
        String(profile.pngQuality),
        '--jobs',
        '1',
        '--tesseract-timeout',
        '120',
        '--rotate-pages',
        '--deskew',
    ];

    if (mode === 'force') {
        args.push('--force-ocr');
    } else {
        args.push('--skip-text');
    }

    if (options.optimizeOnly) {
        args.push('--skip-big', '100');
    }

    args.push(inputPath, outputPath);

    await execFileAsync('ocrmypdf', args, {
        timeout: 240000,
        maxBuffer: 8 * 1024 * 1024,
    });
}

async function pdfHasText(inputPath) {
    try {
        const { stdout } = await execFileAsync('pdftotext', [
            '-f',
            '1',
            '-l',
            '3',
            inputPath,
            '-',
        ], {
            timeout: 20000,
            maxBuffer: 1024 * 1024,
        });

        return String(stdout || '').replace(/\s+/g, '').length >= 20;
    } catch (error) {
        console.warn('Nao foi possivel detectar texto no PDF:', error.message);
        return false;
    }
}

function getCompressionProfile(level) {
    const levels = {
        light: {
            dpi: 180,
            jpegQuality: 80,
            pngQuality: 80,
            optimize: 1,
        },
        balanced: {
            dpi: 150,
            jpegQuality: 70,
            pngQuality: 70,
            optimize: 2,
        },
        strong: {
            dpi: 120,
            jpegQuality: 60,
            pngQuality: 60,
            optimize: 3,
        },
    };

    return levels[level] || levels.balanced;
}

function normalizeOcrLanguage(language) {
    const raw = String(language || 'por').toLowerCase().replace(/[^a-z+]/g, '');
    const allowed = new Set(['por', 'eng', 'por+eng', 'eng+por']);
    return allowed.has(raw) ? raw : 'por';
}

async function chooseSmallerExistingFile(pathA, pathB) {
    const [statA, statB] = await Promise.all([fs.stat(pathA), fs.stat(pathB)]);
    return statB.size < statA.size ? pathB : pathA;
}

function calculateReductionPercent(originalBytes, finalBytes) {
    if (!originalBytes || finalBytes >= originalBytes) {
        return 0;
    }

    return Math.round(((originalBytes - finalBytes) / originalBytes) * 100);
}

function calculateIncreasePercent(originalBytes, finalBytes) {
    if (!originalBytes || finalBytes <= originalBytes) {
        return 0;
    }

    return Math.round(((finalBytes - originalBytes) / originalBytes) * 100);
}

async function createWorkspace(prefix) {
    return fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

async function removeWorkspace(workspace) {
    if (workspace) {
        await fs.rm(workspace, { recursive: true, force: true });
    }
}

app.use((err, req, res, next) => {
    console.error('Erro nao tratado:', err);
    res.status(500).json({
        success: false,
        error: 'Erro interno do servidor.',
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Rota nao encontrada.',
    });
});

app.listen(PORT, () => {
    console.log(`PDF API rodando em http://localhost:${PORT}`);
    console.log('Rotas: /api/convert-docx-to-pdf, /api/pdf/compress, /api/pdf/ocr');
});

export default app;
