import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');

/**
 * Arquivos estáticos que devem ser copiados para dist/ APÓS o vite build.
 * IMPORTANTE: não sobrescreve arquivos já gerados pelo Vite (index.html, contro.html, setup-admin.html).
 * O Vite já processou esses HTMLs com hashes nos assets.
 */
const staticFilesToCopy = [
    'app-config.js',
    'style.css',
    'script.js',
    'docspace-product.js',
    'share.html',
    'contro.js',
    'service-worker.js',
    'manifest.webmanifest',
];

const staticDirs = [
    'assets',
    'IMG',
    'modelos',
];

/**
 * Arquivos que já são gerados pelo Vite e NÃO devem ser sobrescritos.
 * O build-pages opera em modo "complemento" — adiciona sem destruir.
 */
const viteGenerated = [
    'index.html',
    'contro.html',
    'setup-admin.html',
];

const forbidden = [
    'functions',
    'worker-backend-pronto.js',
    'wrangler-api.toml',
    'migrations',
    'node_modules',
    '.git',
    '.wrangler',
    'src',
    'vite.config.js',
    'package.json',
    'package-lock.json',
    'validate-templates.js',
    'README.md',
    'README_BACKEND_CLOUDING_CLOUDFLARE.md',
    'README_MERCADO_PAGO.md'
];

function assertInsideProject(target) {
    const resolvedRoot = path.resolve(rootDir);
    const resolvedTarget = path.resolve(target);

    if (!resolvedTarget.startsWith(resolvedRoot + path.sep)) {
        throw new Error(`Refusing to write outside project: ${resolvedTarget}`);
    }
}

function copyFile(relativePath) {
    const from = path.join(rootDir, relativePath);
    const to = path.join(distDir, relativePath);

    if (!fs.existsSync(from)) {
        console.log(`  ⚠️  SKIP (fonte ausente): ${relativePath}`);
        return false;
    }

    // Não sobrescreve arquivos gerados pelo Vite
    if (viteGenerated.includes(relativePath)) {
        console.log(`  ⏭️  SKIP (gerado pelo Vite): ${relativePath}`);
        return false;
    }

    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
    console.log(`  ✅ ${relativePath}`);
    return true;
}

function copyDir(relativePath) {
    const from = path.join(rootDir, relativePath);
    const to = path.join(distDir, relativePath);

    if (!fs.existsSync(from)) {
        console.log(`  ⚠️  SKIP (fonte ausente): ${relativePath}/`);
        return 0;
    }

    return copyDirRecursive(from, to);
}

function copyDirRecursive(from, to) {
    fs.mkdirSync(to, { recursive: true });
    let count = 0;

    for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
        const sourcePath = path.join(from, entry.name);
        const targetPath = path.join(to, entry.name);

        if (entry.isDirectory()) {
            count += copyDirRecursive(sourcePath, targetPath);
        } else if (entry.isFile()) {
            // Sobrescreve para garantir modelos/assets atualizados no dist.
            // Assets hasheados do Vite ficam em dist/assets/*-HASH.* e não colidem.
            fs.copyFileSync(sourcePath, targetPath);
            count++;
        }
    }

    return count;
}

// ── Execução ──────────────────────────────────────────────

assertInsideProject(distDir);

// Garantir que dist/ existe (Vite já criou)
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

console.log('\n📋 Copiando arquivos estáticos complementares...');
let copiedFiles = 0;
for (const f of staticFilesToCopy) {
    if (copyFile(f)) copiedFiles++;
}

console.log('\n📁 Copiando diretórios de assets...');
let copiedDirs = 0;
for (const d of staticDirs) {
    const n = copyDir(d);
    copiedDirs += n;
    console.log(`  📁 ${d}/ (${n} arquivos)`);
}

// Garante que HTMLs de produção apontem para style.css/script.js locais
// (Vite às vezes reescreve CSS para um asset hasheado compartilhado).
patchHtmlAssets();
ensureHeadersFile();

console.log(`\n✅ Build complementar concluído: ${copiedFiles} arquivos + ${copiedDirs} assets de diretório`);
console.log(`📦 dist/ pronto para deploy no Cloudflare Pages`);

function patchHtmlAssets() {
    const htmlFiles = ['index.html', 'contro.html', 'setup-admin.html'];
    const assetVersion = '131';

    for (const fileName of htmlFiles) {
        const filePath = path.join(distDir, fileName);
        if (!fs.existsSync(filePath)) continue;

        let html = fs.readFileSync(filePath, 'utf8');
        const original = html;

        // Normaliza links de CSS gerados pelo Vite de volta para style.css (quando aplicável)
        if (fileName === 'index.html') {
            html = html.replace(
                /<link rel="stylesheet"[^>]*href="[^"]*contro-[^"]+\.css"[^>]*>/i,
                `<link rel="stylesheet" href="style.css?v=${assetVersion}">`
            );
            if (!/href="style\.css/i.test(html)) {
                html = html.replace(
                    /<\/head>/i,
                    `  <link rel="stylesheet" href="style.css?v=${assetVersion}">\n</head>`
                );
            }
            html = html.replace(/script\.js\?v=\d+/g, `script.js?v=${assetVersion}`);
            html = html.replace(/style\.css\?v=\d+/g, `style.css?v=${assetVersion}`);

            // Manifest na raiz (não o hasheado do Vite em /assets/) — PWA precisa do start_url certo
            html = html.replace(
                /<link rel="manifest"[^>]*>/i,
                '<link rel="manifest" href="manifest.webmanifest">'
            );
        }

        // Caminhos absolutos (/assets/...) quebram em alguns contextos de PWA/standalone.
        // Força relativos para assets locais.
        html = html.replace(/src="\/(assets\/[^"]+)"/g, 'src="$1"');
        html = html.replace(/href="\/(assets\/[^"]+)"/g, 'href="$1"');
        html = html.replace(/src="\/(app-config\.js[^"]*)"/g, 'src="$1"');
        html = html.replace(/src="\/(script\.js[^"]*)"/g, 'src="$1"');
        html = html.replace(/src="\/(contro\.js[^"]*)"/g, 'src="$1"');
        html = html.replace(/href="\/(style\.css[^"]*)"/g, 'href="$1"');
        html = html.replace(/href="\/(manifest\.webmanifest)"/g, 'href="$1"');

        if (html !== original) {
            fs.writeFileSync(filePath, html, 'utf8');
            console.log(`  🔧 HTML ajustado: ${fileName}`);
        }
    }
}

// Garante _headers do Cloudflare Pages (public/ já vai via Vite; fallback se faltar)
function ensureHeadersFile() {
    const fromPublic = path.join(rootDir, 'public', '_headers');
    const toDist = path.join(distDir, '_headers');
    if (fs.existsSync(fromPublic)) {
        fs.copyFileSync(fromPublic, toDist);
        console.log('  ✅ _headers');
    }
}