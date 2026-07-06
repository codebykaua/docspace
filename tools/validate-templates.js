const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const scriptPath = path.join(rootDir, "script.js");
const modelosDir = path.join(rootDir, "modelos");
const script = fs.readFileSync(scriptPath, "utf8");
const refs = new Set();
const regex = /modelos\/[^"]+?\.docx/g;
let match;
while ((match = regex.exec(script))) refs.add(match[0]);

const missing = [];
for (const ref of refs) {
    const filePath = path.join(rootDir, ref);
    if (!fs.existsSync(filePath)) missing.push(ref);
}

const corrupt = fs.existsSync(modelosDir)
    ? fs.readdirSync(modelosDir).filter((name) => name.includes("#U") || name.includes(" (2)"))
    : [];

if (missing.length || corrupt.length) {
    console.error("Falha na validação dos modelos DOCX.");
    if (missing.length) console.error("Modelos referenciados e ausentes:\n" + missing.map((x) => "- " + x).join("\n"));
    if (corrupt.length) console.error("Modelos duplicados/corrompidos restantes:\n" + corrupt.map((x) => "- " + x).join("\n"));
    process.exit(1);
}

console.log(`Modelos DOCX validados: ${refs.size} referencias encontradas e presentes.`);
