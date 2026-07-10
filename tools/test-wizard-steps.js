import fs from "fs";

const code = fs.readFileSync("script.js", "utf8");
const m = code.match(
  /const DOCSPACE_TEMPLATE_FIELDS\s*=\s*(\{[\s\S]*?\});\s*\n\s*const DOCSPACE_FIELD_ALIAS_MAP/
);
const DOCSPACE_TEMPLATE_FIELDS = Function(`"use strict"; return (${m[1]});`)();

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
function normalizeFieldKey(name) {
  return String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, "_");
}
function hasAny(text, terms) {
  return terms.some((term) => text.includes(normalize(term)) || text.includes(term));
}
function includesParty(normalizedKey, normalizedText, tokens) {
  return tokens.some((token) => {
    const t = normalize(token);
    return normalizedKey.includes(t) || normalizedText.includes(t);
  });
}

// Extract classifyDocumentField + buildDocumentSteps + DOCUMENT_STEP_ORDER from script
const orderStart = code.indexOf("const DOCUMENT_STEP_ORDER");
const orderEnd = code.indexOf("function buildDocumentSteps");
const classifyStart = code.indexOf("function classifyDocumentField(field, doc = null)");
const classifyEnd = code.indexOf("\n    function includesParty");
const buildStart = code.indexOf("function buildDocumentSteps(doc)");
const buildEnd = code.indexOf("\n    // Ordem fixa das partes") > buildStart
  ? code.indexOf("\n    // Ordem fixa das partes")
  : code.indexOf("\n    function classifyDocumentField");

// Rebuild: order + build + classify
const orderBlock = code.slice(orderStart, code.indexOf("function buildDocumentSteps(doc)"));
const buildBlock = code.slice(
  code.indexOf("function buildDocumentSteps(doc)"),
  code.indexOf("/**\n     * Separa os campos")
);
const classifyBlock = code.slice(classifyStart, classifyEnd);

const runner = new Function(
  "DOCSPACE_TEMPLATE_FIELDS",
  "normalize",
  "normalizeFieldKey",
  "hasAny",
  "includesParty",
  `${orderBlock}\n${buildBlock}\n${classifyBlock}\nreturn { buildDocumentSteps, classifyDocumentField, DOCUMENT_STEP_ORDER };`
);

const { buildDocumentSteps } = runner(
  DOCSPACE_TEMPLATE_FIELDS,
  normalize,
  normalizeFieldKey,
  hasAny,
  includesParty
);

const samples = [
  "comodato",
  "contrato-compra-venda-imovel",
  "contrato-arrendamento-rural",
  "contrato-comodato-equipamentos",
  "declaracao-uniao-estavel",
  "cadastro-confrontantes",
  "procuracao-normal",
];

for (const id of samples) {
  const doc = {
    id,
    fields: DOCSPACE_TEMPLATE_FIELDS[id],
    choices:
      id === "comodato"
        ? [{ name: "possui_conjuge" }, { name: "possui_obito" }]
        : id === "autodeclaracao-rural"
          ? [{ name: "possui_representacao" }]
          : [],
  };
  const steps = buildDocumentSteps(doc);
  console.log("\n===" + id + "===");
  steps.forEach((s, i) =>
    console.log(`  ${i + 1}. ${s.title} [${s.key}] — ${s.items.length} campos`)
  );
}
