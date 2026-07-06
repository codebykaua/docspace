#!/usr/bin/env node
/**
 * Validação pré-deploy dos templates .docx referenciados no DOCS registry
 * Executa antes do build para garantir que todos os templates existem
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCRIPT_PATH = path.join(__dirname, 'script.js');
const MODELOS_DIR = path.join(__dirname, 'modelos');

function extractModelPaths(scriptContent) {
    const modelPaths = new Set();

    // modelPath (single)
    const modelPathMatches = scriptContent.matchAll(/"modelPath"\s*:\s*"([^"]+)"/g);
    for (const match of modelPathMatches) {
        modelPaths.add(match[1]);
    }

    // modelPaths (object with multiple paths)
    const modelPathsMatches = scriptContent.matchAll(/"modelPaths"\s*:\s*\{([^}]+)\}/g);
    for (const match of modelPathsMatches) {
        const paths = match[1].matchAll(/:\s*"([^"]+)"/g);
        for (const p of paths) {
            modelPaths.add(p[1]);
        }
    }

    return Array.from(modelPaths).map(p => path.basename(p));
}

function validateTemplates() {
    console.log('🔍 Validando templates .docx referenciados no script.js...\n');

    // Read script.js
    if (!fs.existsSync(SCRIPT_PATH)) {
        console.error(`❌ Erro: script.js não encontrado em ${SCRIPT_PATH}`);
        process.exit(1);
    }

    const scriptContent = fs.readFileSync(SCRIPT_PATH, 'utf-8');
    const referencedTemplates = extractModelPaths(scriptContent);

    // Read modelos directory
    if (!fs.existsSync(MODELOS_DIR)) {
        console.error(`❌ Erro: Pasta modelos não encontrada em ${MODELOS_DIR}`);
        process.exit(1);
    }

    const existingFiles = fs.readdirSync(MODELOS_DIR)
        .filter(f => f.endsWith('.docx'))
        .map(f => f.toLowerCase());

    console.log(`📋 Templates referenciados no código: ${referencedTemplates.length}`);
    console.log(`📁 Arquivos .docx existentes em modelos/: ${existingFiles.length}\n`);

    let allValid = true;
    const missing = [];

    for (const template of referencedTemplates) {
        const templateLower = template.toLowerCase();
        const found = existingFiles.some(ef => ef === templateLower);

        if (found) {
            console.log(`  ✅ ${template}`);
        } else {
            // Try case-insensitive match
            const caseMatch = existingFiles.find(ef => ef === templateLower);
            if (caseMatch) {
                console.log(`  ⚠️  ${template} (case mismatch: arquivo é "${caseMatch}")`);
            } else {
                console.log(`  ❌ ${template} - NÃO ENCONTRADO`);
                missing.push(template);
                allValid = false;
            }
        }
    }

    // Check for extra files not referenced
    const referencedLower = referencedTemplates.map(t => t.toLowerCase());
    const extra = existingFiles.filter(ef => !referencedLower.includes(ef));
    if (extra.length > 0) {
        console.log(`\n📦 Arquivos em modelos/ não referenciados no código (${extra.length}):`);
        for (const e of extra) {
            console.log(`   - ${e}`);
        }
    }

    console.log('\n' + '='.repeat(50));
    if (allValid) {
        console.log('✅ VALIDAÇÃO PASSOU - Todos os templates existem');
        process.exit(0);
    } else {
        console.log(`❌ VALIDAÇÃO FALHOU - ${missing.length} template(s) faltando:`);
        for (const m of missing) {
            console.log(`   - ${m}`);
        }
        process.exit(1);
    }
}

validateTemplates();