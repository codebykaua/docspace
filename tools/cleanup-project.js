/**
 * Remove modelos duplicados e arquivos de histórico/correção que só pesam o projeto.
 * Mantém README*.md e arquivos de runtime.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const KEEP_README = new Set([
  "README.md",
  "README_BACKEND_CLOUDFLARE.md",
  "README_MERCADO_PAGO.md",
]);

// Modelos referenciados por script.js / validate-templates.js
const KEEP_MODELOS = new Set([
  "declaracao_ufba_membros.docx",
  "declaracao_renda_membros.docx",
  "declaracao_posso.docx",
  "procuracao_consumidor.docx",
  "procuracao_normal.docx",
  "contrato_honorarios_50.docx",
  "contrato_prev_40.docx",
  "contrato_prev_30.docx",
  "contrato_compra_venda_template_sistema_negrito.docx",
  "contrato_compra_venda_veiculo_bem_movel_template.docx",
  "cadastro_confrontantes_template(1).docx",
  "controle_producao_anual_template(1).docx",
  "controle_rebanho_template(1).docx",
  "inventario_producao_rural_template.docx",
  "contrato_arrendamento_rural_template.docx",
  "contrato_comodato_equipamentos_template.docx",
  "contrato_parceria_rural_template.docx",
  "declaracao_posse_mansa_pacifica_template.docx",
  "declaracao_residencia_template.docx",
  "declaracao_nao_possuir_renda_template.docx",
  "declaracao_exercicio_agricultura_familiar_template.docx",
  "declaracao_dependencia_economica_template.docx",
  "declaracao_convivencia_familiar_template.docx",
  "declaracao_baixa_renda_template.docx",
  "declaracao_autenticidade_documentos_template.docx",
  "declaracao_atividade_rural_template.docx",
  "declaracao_uniao_estavel_template.docx",
  "declaracao_tempo_trabalho_rural_template.docx",
  "contrato_sem_conjuge.docx",
  "contrato_com_conjuge.docx",
  "contrato_sem_conjuge_falecido_representante_final.docx",
  "contrato_com_conjuge_falecido_representante_final.docx",
  "Autodeclaracao - SEM REPRESENTACAO.docx",
  "Autodeclaracao - COM REPRESENTACAO.docx",
]);

const JUNK_ROOT_FILES = [
  "Dockerfile.deprecated",
  "CSS_CLEANUP_REPORT.json",
  "CSS_LIMPO_LEIA.txt",
  "LEIA_HOME_FINAL.txt",
  "LIMPEZA_TOTAL_APLICADA.json",
  "RELATORIO_CORRECAO_HOME_FINAL.json",
  "docspace-clean-ui.js",
  "topbar-mega-fix.js",
  "topbar-nav-fix.js",
  "ai-ui.js",
  "ai-styles.css",
  "pdf-preview.js",
  "style.css.backup-before-clean-theme",
  "style.css.backup-before-simple-global-v2",
];

const JUNK_PREFIXES = [
  "CORRECAO_",
  "HOTFIX_",
  "AJUSTE_",
  "DOCSPACE_",
  "CLOUD_CODE_",
  "LOGIN_SLIDESHOW_",
  "MELHORIAS_",
  "AUDITORIA_",
];

let removed = 0;
let freed = 0;

function rm(filePath) {
  if (!fs.existsSync(filePath)) return;
  const stat = fs.statSync(filePath);
  const size = stat.isDirectory() ? dirSize(filePath) : stat.size;
  fs.rmSync(filePath, { recursive: true, force: true });
  removed++;
  freed += size;
  console.log("  🗑️ ", path.relative(root, filePath));
}

function dirSize(dir) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    total += entry.isDirectory() ? dirSize(p) : fs.statSync(p).size;
  }
  return total;
}

console.log("\n🧹 Limpando modelos não usados...");
const modelosDir = path.join(root, "modelos");
if (fs.existsSync(modelosDir)) {
  for (const name of fs.readdirSync(modelosDir)) {
    if (!name.toLowerCase().endsWith(".docx")) continue;
    if (KEEP_MODELOS.has(name)) continue;
    rm(path.join(modelosDir, name));
  }
}

console.log("\n🧹 Limpando arquivos de histórico / sobras no root...");
for (const name of fs.readdirSync(root)) {
  const full = path.join(root, name);
  if (!fs.statSync(full).isFile()) continue;

  if (JUNK_ROOT_FILES.includes(name)) {
    rm(full);
    continue;
  }

  if (name.endsWith(".md") && !KEEP_README.has(name)) {
    if (JUNK_PREFIXES.some((p) => name.startsWith(p)) || name.startsWith("CORRECAO") || name.includes("HOTFIX")) {
      rm(full);
      continue;
    }
    // outros .md de correção avulsos
    if (/^(CORRECAO|HOTFIX|AJUSTE|DOCSPACE|LOGIN_|MELHORIAS_|AUDITORIA_|CLOUD_)/i.test(name)) {
      rm(full);
    }
  }

  if (name.includes(".backup") || name.endsWith(".bak")) {
    rm(full);
  }
}

// pasta imgs-slide vazia / não usada
const imgsSlide = path.join(root, "imgs-slide");
if (fs.existsSync(imgsSlide)) {
  const entries = fs.readdirSync(imgsSlide);
  if (!entries.length) rm(imgsSlide);
}

// dist backups
const distBackups = [
  path.join(root, "dist", "style.css.backup-before-clean-theme"),
  path.join(root, "dist", "style.css.backup-before-simple-global-v2"),
  path.join(root, "dist", "docspace-clean-ui.js"),
  path.join(root, "dist", "topbar-mega-fix.js"),
  path.join(root, "dist", "topbar-nav-fix.js"),
  path.join(root, "dist", "ai-ui.js"),
  path.join(root, "dist", "ai-styles.css"),
  path.join(root, "dist", "pdf-preview.js"),
];
console.log("\n🧹 Limpando sobras em dist/...");
for (const p of distBackups) rm(p);

// remove modelos extras em dist
const distModelos = path.join(root, "dist", "modelos");
if (fs.existsSync(distModelos)) {
  for (const name of fs.readdirSync(distModelos)) {
    if (!name.toLowerCase().endsWith(".docx")) continue;
    if (KEEP_MODELOS.has(name)) continue;
    rm(path.join(distModelos, name));
  }
}

console.log(`\n✅ Removidos ${removed} itens (~${(freed / (1024 * 1024)).toFixed(1)} MB liberados)`);
