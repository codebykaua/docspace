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
    'ai-ui.js',
    'ai-styles.css',
    'pdf-preview.js',
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
            // Não sobrescreve assets já processados pelo Vite (com hash)
            if (fs.existsSync(targetPath)) {
                continue;
            }
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

console.log(`\n✅ Build complementar concluído: ${copiedFiles} arquivos + ${copiedDirs} assets de diretório`);
console.log(`📦 dist/ pronto para deploy no Cloudflare Pages`);