import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const frontend = resolve(root, "frontend");
const version = "163";
const required = [
  "index.html", "style.css", "lovable-original.css", "script.js", "app-config.js",
  "ai/ai-config.js", "ai/ai-client.js", "assets/LOGO1.png",
  "manifest.webmanifest", "service-worker.js", `cache-reset-v${version}.js`,
  "modelos/catalogo-integrado.json", ".nojekyll",
];

if (!existsSync(resolve(root, ".github/workflows/pages.yml"))) {
  console.error("Workflow do GitHub Pages ausente.");
  process.exit(1);
}
const pagesWorkflow = readFileSync(resolve(root, ".github/workflows/pages.yml"), "utf8");
for (const marker of ["actions/configure-pages@v5", "actions/upload-pages-artifact@v3", "actions/deploy-pages@v4", "path: frontend"]) {
  if (!pagesWorkflow.includes(marker)) {
    console.error(`Workflow GitHub Pages incompleto: ${marker}`);
    process.exit(1);
  }
}

const missing = required.filter((file) => !existsSync(resolve(frontend, file)));
if (missing.length) {
  console.error("Arquivos ausentes:", missing.join(", "));
  process.exit(1);
}

const catalog = JSON.parse(readFileSync(resolve(frontend, "modelos/catalogo-integrado.json"), "utf8"));
const templates = Array.isArray(catalog) ? catalog : (catalog.templates || []);
if (templates.length < 100) {
  console.error(`Catálogo expandido incompleto: ${templates.length} modelos.`);
  process.exit(1);
}
const docxFiles = readdirSync(resolve(frontend, "modelos")).filter((name) => name.toLowerCase().endsWith(".docx"));
if (docxFiles.length < 100) {
  console.error(`Biblioteca física incompleta: ${docxFiles.length} DOCX.`);
  process.exit(1);
}

const html = readFileSync(resolve(frontend, "index.html"), "utf8");
for (const ref of [
  `style.css?v=${version}`,
  `lovable-original.css?v=${version}`,
  `script.js?v=${version}`,
  `ai/ai-client.js?v=${version}`,
  `cache-reset-v${version}.js?v=${version}`,
]) {
  if (!html.includes(ref)) {
    console.error(`Referência não encontrada em index.html: ${ref}`);
    process.exit(1);
  }
}

for (const marker of ['id="landingView"', 'id="checkoutView"', 'id="publicCheckoutForm"', 'id="checkoutIntegrationBadge"', 'class="checkout-payment-panel"', 'class="checkout-order-card"', 'data-buy-plan="basic30"', 'data-buy-plan="proMax365"']) {
  if (!html.includes(marker)) {
    console.error(`Interface pública incompleta: ${marker}`);
    process.exit(1);
  }
}
if (!html.includes("https://sdk.mercadopago.com/js/v2")) {
  console.error("SDK do Mercado Pago não encontrado no checkout.");
  process.exit(1);
}

const script = readFileSync(resolve(frontend, "script.js"), "utf8");
if (!script.includes('event.target?.matches?.("#aiForm")')) {
  console.error("Correção do submit da IA não encontrada.");
  process.exit(1);
}
if (script.includes("const form = event.currentTarget || event.target")) {
  console.error("Bug antigo do submit da IA ainda está presente.");
  process.exit(1);
}
for (const marker of [
  "activeArea: localStorage.getItem",
  "resolveActiveArea",
  "renderPublicPaymentBrick",
  "ensureMercadoPagoSdk",
  "/api/public/checkout/config",
  "/api/public/checkout/start",
  "/api/billing/brick-payment",
  "Word no modelo",
  "renderAiTemplateDialog",
  "ai-thinking-dots",
  "Lendo e conferindo os documentos",
  "fileToDataUrl",
  "AI_HISTORY_STORAGE_KEY",
  "loadAiConversation",
  "templateMissingFields",
  "currentBrazilDateValues",
  "data-ai-menu-toggle",
  "adminHistory",
  "loadExpandedDocumentCatalog",
  "applyCurrentSignatureDateToForm",
  "prepareProfileAvatar",
  "pdfImages",
  "resizeA4",
  "metadataOpts",
  "data-word-find",
  "data-excel-sort=\"asc\"",
  "renderOfficeAiDialog",
  "office-word",
  "office-excel",
  "office-powerpoint",
  "renderPowerpointEditor",
  "PptxGenJS",
  "office-sticky-controls",
  "correctValidate",
  "processPdfCorrectionBatch",
  "PDF_CORRECTOR_JOB_STORAGE_KEY",
  "ensurePdfProcessingVisible",
  "A chave RENDER_API_SECRET precisa ser igual",
]) {
  if (!script.includes(marker)) {
    console.error(`Recurso esperado não encontrado no frontend: ${marker}`);
    process.exit(1);
  }
}


if (script.includes("Tipo de tarefa") || script.includes('id="aiMode"')) {
  console.error("O seletor antigo de tipo de tarefa ainda está presente.");
  process.exit(1);
}
for (const marker of [
  'data-ai-menu-toggle',
  'Anexar documento',
  'docspace_ai_history_v143',
  'Gerações diárias totais',
  'data-action="resetDocumentQuota"',
  'R$ 79,90',
  'R$ 590,99',
]) {
  if (!script.includes(marker) && !html.includes(marker)) {
    console.error(`Recurso v1.43 ausente: ${marker}`);
    process.exit(1);
  }
}
if (script.includes('data-admin-tab="overview"')) {
  console.error("A aba Visão geral não deveria existir na administração v1.43.");
  process.exit(1);
}

const worker = readFileSync(resolve(root, "backend-worker/src/worker.js"), "utf8");
for (const marker of [
  "Response.redirect(publicAppUrl, 302)",
  'match(path, ["public", "checkout", "config"])',
  'match(path, ["public", "checkout", "start"])',
  "startPublicCheckout",
  "billing_document",
  "createMercadoPagoBrickPayment",
  "notifyPaymentApproved",
  'type: "image_url"',
  "normalizeAiImages",
  'response_format: { type: "json_object" }',
  "templateFieldLabels",
  "document_generation_usage",
  "totalRemaining",
  "resetDocumentQuota",
  "ip_address",
  "user_agent",
  'match(path, ["pdf-corrector", "session"])',
  "createPdfCorrectorSession",
  "RENDER_API_SECRET",
  "O servidor de conversão recusou a autenticação",
  '"X-Render-Secret": renderSecret',
]) {
  if (!worker.includes(marker)) {
    console.error(`Recurso esperado não encontrado no Worker: ${marker}`);
    process.exit(1);
  }
}

const serviceWorker = readFileSync(resolve(frontend, "service-worker.js"), "utf8");
if (!serviceWorker.includes("docspace-v163-static")) {
  console.error("Service Worker de contingência não foi atualizado para v163.");
  process.exit(1);
}

const responsiveCss = readFileSync(resolve(frontend, "lovable-original.css"), "utf8");
for (const marker of [
  "DocSpace v162 — rolagem real",
  "grid-template-rows: auto minmax(0, 1fr) auto",
  "overflow-y: auto !important",
]) {
  if (!responsiveCss.includes(marker)) {
    console.error(`Correção responsiva v162 ausente: ${marker}`);
    process.exit(1);
  }
}

for (const cssFile of ["style.css", "lovable-original.css"]) {
  const css = readFileSync(resolve(frontend, cssFile), "utf8");
  if ((css.match(/{/g) || []).length !== (css.match(/}/g) || []).length) {
    console.error(`Chaves CSS desbalanceadas em ${cssFile}.`);
    process.exit(1);
  }
}

for (const file of ["frontend/script.js", "frontend/docspace-product.js", "frontend/ai/ai-client.js", "frontend/ai/ai-config.js", "backend-worker/src/worker.js"]) {
  const result = spawnSync(process.execPath, ["--check", resolve(root, file)], { encoding: "utf8" });
  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    process.exit(result.status || 1);
  }
}

console.log("OK: frontend v1.63 e Worker passaram nas verificações estáticas.");
