/**
 * Recursos complementares do DocSpace v1.43:
 * validações brasileiras, envio de link ao cliente, assinatura de PDF e modelos administrativos.
 * Depende de window.DocSpaceCore exposto por script.js.
 */
(() => {
    "use strict";

    const PRODUCT_VERSION = "1.43.0-static";

    const state = {
        templateSettings: {},
        customTemplates: [],
    };

    function core() {
        return window.DocSpaceCore || null;
    }

    function esc(v) {
        return core()?.escapeHtml?.(v) ?? String(v ?? "").replace(/[&<>'"]/g, (c) => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
        }[c]));
    }

    function attr(v) {
        return esc(v).replace(/`/g, "&#96;");
    }

    async function api(path, options) {
        const c = core();
        if (!c?.apiRequest) throw new Error("API do DocSpace ainda não está pronta.");
        return c.apiRequest(path, options);
    }

    function toast(msg, type) {
        core()?.toast?.(msg, type);
    }

    function onlyDigits(value) {
        return String(value || "").replace(/\D/g, "");
    }

    function isValidCpf(value) {
        const cpf = onlyDigits(value);
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
        let sum = 0;
        for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
        let d1 = (sum * 10) % 11;
        if (d1 === 10) d1 = 0;
        if (d1 !== Number(cpf[9])) return false;
        sum = 0;
        for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
        let d2 = (sum * 10) % 11;
        if (d2 === 10) d2 = 0;
        return d2 === Number(cpf[10]);
    }

    function isValidCnpj(value) {
        const cnpj = onlyDigits(value);
        if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
        const calc = (base, factors) => {
            const sum = base.split("").reduce((acc, digit, i) => acc + Number(digit) * factors[i], 0);
            const rest = sum % 11;
            return rest < 2 ? 0 : 11 - rest;
        };
        const d1 = calc(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
        const d2 = calc(cnpj.slice(0, 12) + d1, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
        return cnpj.endsWith(`${d1}${d2}`);
    }

    function formatCpf(value) {
        const d = onlyDigits(value).slice(0, 11);
        return d
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    function formatCnpj(value) {
        const d = onlyDigits(value).slice(0, 14);
        return d
            .replace(/(\d{2})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1/$2")
            .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }

    function formatCep(value) {
        const d = onlyDigits(value).slice(0, 8);
        return d.replace(/(\d{5})(\d{1,3})$/, "$1-$2");
    }

    function formatPhone(value) {
        const d = onlyDigits(value).slice(0, 11);
        if (d.length <= 10) {
            return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d{1,4})$/, "$1-$2");
        }
        return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");
    }

    function formatCpfOrCnpj(value) {
        const digits = onlyDigits(value).slice(0, 14);
        // Campos rurais costumam aceitar CPF ou CNPJ no mesmo input.
        if (digits.length > 11) return formatCnpj(digits);
        return formatCpf(digits);
    }

    function fieldKind(name = "") {
        const key = String(name || "").toLowerCase();
        // cpf_cnpj_* / cpf-cnpj → aceita os dois (antes caía só em CNPJ e bloqueava o formulário)
        if (key.includes("cpf") && key.includes("cnpj")) return "cpf_cnpj";
        if (/(^|_)cnpj($|_)/.test(key) || key.includes("cnpj")) return "cnpj";
        // Muitos rótulos são "CPF/CNPJ" com name cpf_* — aceita os dois
        if (/(^|_)cpf($|_)/.test(key) || key.endsWith("_cpf") || key === "cpf" || key.includes("cpf")) return "cpf_cnpj";
        if (/(^|_)cep($|_)/.test(key) || key.includes("cep") || key.includes("postal")) return "cep";
        if (key.includes("telefone") || key.includes("celular") || key.includes("whatsapp") || key.includes("fone")) return "phone";
        return "";
    }

    function enhanceFieldElement(field) {
        if (!field || field.dataset.brEnhanced === "1") return;
        const name = field.name || field.dataset.fieldName || "";
        const kind = fieldKind(name);
        if (!kind || field.tagName === "SELECT" || field.tagName === "TEXTAREA") return;
        field.dataset.brEnhanced = "1";
        field.dataset.brKind = kind;
        field.setAttribute("inputmode", kind === "phone" ? "tel" : "numeric");
        // Nunca deixe customValidity residual de versões antigas bloquear o submit do wizard
        try { field.setCustomValidity(""); } catch (_) { /* ignore */ }
        field.addEventListener("input", () => {
            const start = field.selectionStart;
            const before = field.value;
            if (kind === "cpf") field.value = formatCpf(field.value);
            if (kind === "cnpj") field.value = formatCnpj(field.value);
            if (kind === "cpf_cnpj") field.value = formatCpfOrCnpj(field.value);
            if (kind === "cep") field.value = formatCep(field.value);
            if (kind === "phone") field.value = formatPhone(field.value);
            try {
                const delta = field.value.length - before.length;
                if (typeof start === "number") field.setSelectionRange(start + delta, start + delta);
            } catch (_) { /* ignore */ }
            markFieldValidity(field);
        });
        field.addEventListener("blur", async () => {
            markFieldValidity(field);
            if (kind === "cep" && onlyDigits(field.value).length === 8) {
                await fillAddressFromCep(field);
            }
        });
    }

    function markFieldValidity(field) {
        const kind = field.dataset.brKind;
        const digits = onlyDigits(field.value);
        let ok = true;

        // Sempre limpa customValidity: setCustomValidity bloqueava o submit do formulário.
        // No wizard multi-etapas o campo inválido fica em etapa oculta e parece que
        // "não gera Word nem PDF" — o browser engole o clique sem chamar o handler.
        try { field.setCustomValidity(""); } catch (_) { /* ignore */ }

        if (!digits) {
            field.classList.remove("is-invalid", "is-valid");
            return;
        }

        // Enquanto digita (valor incompleto), só feedback visual neutro — não marca erro.
        if (kind === "cpf" && digits.length < 11) {
            field.classList.remove("is-invalid", "is-valid");
            return;
        }
        if (kind === "cnpj" && digits.length < 14) {
            field.classList.remove("is-invalid", "is-valid");
            return;
        }
        if (kind === "cpf_cnpj" && digits.length < 11) {
            field.classList.remove("is-invalid", "is-valid");
            return;
        }
        if (kind === "cep" && digits.length < 8) {
            field.classList.remove("is-invalid", "is-valid");
            return;
        }
        if (kind === "phone" && digits.length < 10) {
            field.classList.remove("is-invalid", "is-valid");
            return;
        }

        if (kind === "cpf") ok = isValidCpf(digits) || isValidCnpj(digits);
        if (kind === "cnpj") ok = isValidCnpj(digits);
        if (kind === "cpf_cnpj") ok = isValidCpf(digits) || isValidCnpj(digits);
        if (kind === "cep") ok = digits.length === 8;
        if (kind === "phone") ok = digits.length >= 10 && digits.length <= 11;

        field.classList.toggle("is-invalid", !ok);
        field.classList.toggle("is-valid", ok);
        // Feedback visual apenas — NÃO usa setCustomValidity (bloqueava Gerar Word/PDF).
    }

    async function fillAddressFromCep(cepField) {
        const cep = onlyDigits(cepField.value);
        if (cep.length !== 8) return;
        const form = cepField.closest("form");
        if (!form) return;
        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();
            if (data.erro) {
                toast("CEP não encontrado.", "error");
                return;
            }
            const map = [
                ["logradouro", ["endereco", "logradouro", "rua", "address_street", "endereco_rua"]],
                ["bairro", ["bairro", "address_district", "distrito"]],
                ["localidade", ["cidade", "municipio", "address_city", "cidade_assinatura"]],
                ["uf", ["uf", "estado", "address_uf", "uf_assinatura"]],
            ];
            const name = (cepField.name || "").toLowerCase();
            const prefix = name.replace(/(cep|postal)$/i, "").replace(/_+$/, "");
            map.forEach(([viaKey, candidates]) => {
                const value = data[viaKey] || "";
                if (!value) return;
                const targets = candidates.flatMap((c) => {
                    const list = [c];
                    if (prefix) list.push(`${prefix}${c}`, `${prefix}_${c}`);
                    return list;
                });
                targets.forEach((fieldName) => {
                    const el = form.querySelector(`[name="${fieldName}"], [data-field-name="${fieldName}"]`);
                    if (el && !el.value) el.value = value;
                });
            });
            toast("Endereço preenchido pelo CEP.", "success");
        } catch (error) {
            console.warn(error);
            toast("Não foi possível consultar o CEP.", "error");
        }
    }

    function enhanceAllFields(root = document) {
        root.querySelectorAll("input[name], input[data-field-name]").forEach(enhanceFieldElement);
    }

    // ── Aplicação segura de dados recebidos por link ───────────────────────

    function applyDataToForm(form, data) {
        if (!form || !data) return;
        Object.entries(data).forEach(([key, value]) => {
            if (value == null || value === "") return;
            const fields = form.querySelectorAll(`[name="${key}"], [data-field-name="${key}"]`);
            fields.forEach((field) => {
                if (field.type === "radio") {
                    field.checked = String(field.value) === String(value);
                } else if (field.type === "checkbox") {
                    const selected = Array.isArray(value) ? value.map(String) : [String(value)];
                    field.checked = selected.includes(String(field.value)) || value === true;
                } else {
                    field.value = value;
                }
            });
        });
        enhanceAllFields(form);
    }

    // ── Catálogo administrativo de modelos ─────────────────────────────────

    async function loadTemplatesCatalog() {
        try {
            const data = await api("/api/templates");
            state.customTemplates = data.customTemplates || [];
            state.templateSettings = data.settings || {};
            core()?.mergeTemplates?.(state.customTemplates, state.templateSettings);
        } catch (error) {
            console.warn("Catálogo de modelos:", error);
        }
    }

    // ── Ações profissionais do assistente (compartilhar e assinar) ─────────

    function injectWizardToolbar(form) {
        if (!form || form.dataset.productToolbar === "1") return;
        form.dataset.productToolbar = "1";
        const actions = form.querySelector(".wizard-actions .right") || form.querySelector(".wizard-actions");
        if (!actions) return;
        const bar = document.createElement("div");
        bar.className = "product-toolbar action-row";
        bar.innerHTML = `
            <button type="button" class="secondary-button" data-product-share-link>Enviar ao cliente</button>
        `;
        actions.prepend(bar);
        bar.querySelector("[data-product-share-link]")?.addEventListener("click", () => createShareFromForm(form));
        enhanceAllFields(form);
    }

    async function createShareFromForm(form) {
        const c = core();
        const docId = form.dataset.documentId;
        const doc = c?.getDoc?.(docId);
        try {
            // Não envia formData/dados pessoais — só o tipo do modelo para o cliente preencher
            const data = await api("/api/share/links", {
                method: "POST",
                body: {
                    documentType: docId,
                    title: doc?.title || docId,
                    formData: {},
                    expiresInDays: 7,
                },
            });
            const token = data.link?.token;
            const base = window.location.href.replace(/index\.html.*/i, "").replace(/#.*$/, "");
            const url = `${base}${base.endsWith("/") ? "" : "/"}share.html?token=${encodeURIComponent(token)}`;
            try {
                await navigator.clipboard.writeText(url);
                toast("Link copiado (sem seus dados preenchidos).", "success");
            } catch (_) {
                prompt("Envie este link ao cliente:", url);
            }
        } catch (error) {
            toast(error.message || "Erro ao criar link.", "error");
        }
    }

    // ── Signature pad on PDF preview ───────────────────────────────────────

    function injectSignatureUi() {
        const panel = document.getElementById("documentPdfPreview");
        if (!panel || panel.dataset.signUi === "1") return;
        panel.dataset.signUi = "1";
        const actions = panel.querySelector(".pdf-preview-actions");
        if (!actions) return;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "primary-button";
        btn.textContent = "Assinar PDF";
        btn.dataset.productSignPdf = "1";
        actions.insertBefore(btn, actions.firstChild);
        btn.addEventListener("click", openSignatureModal);
    }

    function openSignatureModal() {
        const c = core();
        const pdfBase64 = c?.getState?.()?.pdfPreviewBase64;
        if (!pdfBase64) {
            toast("Gere um PDF primeiro.", "error");
            return;
        }
        const existing = document.getElementById("signatureModal");
        existing?.remove();
        const modal = document.createElement("div");
        modal.id = "signatureModal";
        modal.className = "signature-modal";
        modal.innerHTML = `
            <div class="signature-modal-card panel">
                <h2>Assinatura eletrônica</h2>
                <p>Desenhe a assinatura. Ela será carimbada na última página do PDF com data/hora.</p>
                <div class="form-grid">
                    <label class="field"><span>Nome do signatário</span><input id="signerName" required></label>
                    <label class="field"><span>E-mail</span><input id="signerEmail" type="email"></label>
                </div>
                <canvas id="signatureCanvas" width="560" height="180" class="signature-canvas"></canvas>
                <div class="action-row" style="margin-top:12px">
                    <button type="button" class="secondary-button" id="signatureClear">Limpar</button>
                    <button type="button" class="primary-button" id="signatureApply">Assinar e baixar</button>
                    <button type="button" class="ghost-button" id="signatureClose">Cancelar</button>
                </div>
                <p id="signatureMessage" class="message"></p>
            </div>
        `;
        document.body.appendChild(modal);
        const canvas = modal.querySelector("#signatureCanvas");
        const ctx = canvas.getContext("2d");
        ctx.strokeStyle = "#111";
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        let drawing = false;
        const pos = (event) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = event.touches ? event.touches[0].clientX : event.clientX;
            const clientY = event.touches ? event.touches[0].clientY : event.clientY;
            return {
                x: (clientX - rect.left) * (canvas.width / rect.width),
                y: (clientY - rect.top) * (canvas.height / rect.height),
            };
        };
        const start = (event) => {
            drawing = true;
            const p = pos(event);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            event.preventDefault();
        };
        const move = (event) => {
            if (!drawing) return;
            const p = pos(event);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
            event.preventDefault();
        };
        const end = () => { drawing = false; };
        canvas.addEventListener("mousedown", start);
        canvas.addEventListener("mousemove", move);
        canvas.addEventListener("mouseup", end);
        canvas.addEventListener("mouseleave", end);
        canvas.addEventListener("touchstart", start, { passive: false });
        canvas.addEventListener("touchmove", move, { passive: false });
        canvas.addEventListener("touchend", end);
        modal.querySelector("#signatureClear")?.addEventListener("click", () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
        modal.querySelector("#signatureClose")?.addEventListener("click", () => modal.remove());
        modal.querySelector("#signatureApply")?.addEventListener("click", async () => {
            const msg = modal.querySelector("#signatureMessage");
            const signerName = modal.querySelector("#signerName")?.value?.trim() || "";
            const signerEmail = modal.querySelector("#signerEmail")?.value?.trim() || "";
            if (!signerName) {
                if (msg) {
                    msg.textContent = "Informe o nome do signatário.";
                    msg.className = "message error";
                }
                return;
            }
            try {
                if (msg) {
                    msg.textContent = "Aplicando assinatura...";
                    msg.className = "message";
                }
                const signatureDataUrl = canvas.toDataURL("image/png");
                const stamped = await stampSignatureOnPdf(pdfBase64, signatureDataUrl, signerName);
                const fileName = (c.getState?.()?.pdfPreviewFileName || "documento.pdf").replace(/\.pdf$/i, "") + "-assinado.pdf";
                // Assinatura só no dispositivo — não envia PDF/dados ao servidor
                c.showDocumentPdfPreview?.(stamped, fileName);
                c.downloadBase64?.(stamped, fileName, "application/pdf");
                toast("PDF assinado e baixado (não foi enviado ao servidor).", "success");
                modal.remove();
            } catch (error) {
                if (msg) {
                    msg.textContent = error.message || "Falha ao assinar.";
                    msg.className = "message error";
                }
            }
        });
    }

    async function stampSignatureOnPdf(pdfBase64, signatureDataUrl, signerName) {
        if (!window.PDFLib?.PDFDocument) throw new Error("pdf-lib não carregado.");
        const clean = String(pdfBase64 || "").replace(/^data:[^;]+;base64,/, "");
        const bytes = Uint8Array.from(atob(clean), (c) => c.charCodeAt(0));
        const pdfDoc = await window.PDFLib.PDFDocument.load(bytes);
        const pngBytes = await (await fetch(signatureDataUrl)).arrayBuffer();
        const png = await pdfDoc.embedPng(pngBytes);
        const pages = pdfDoc.getPages();
        const page = pages[pages.length - 1];
        const { width } = page.getSize();
        const sigWidth = 160;
        const sigHeight = (png.height / png.width) * sigWidth;
        const margin = 36;
        page.drawImage(png, {
            x: width - sigWidth - margin,
            y: margin + 28,
            width: sigWidth,
            height: sigHeight,
        });
        page.drawText(`Assinado eletronicamente por ${signerName}`, {
            x: width - sigWidth - margin,
            y: margin + 14,
            size: 8,
        });
        page.drawText(new Date().toLocaleString("pt-BR"), {
            x: width - sigWidth - margin,
            y: margin + 4,
            size: 7,
        });
        const out = await pdfDoc.save();
        let binary = "";
        out.forEach((b) => { binary += String.fromCharCode(b); });
        return btoa(binary);
    }

    // ── Admin catalog panel ────────────────────────────────────────────────

    async function renderAdminTemplatesSection(host) {
        if (!host) return;
        let catalog;
        try {
            catalog = await api("/api/admin/templates");
        } catch (error) {
            host.innerHTML = `<p class="message error">${esc(error.message)}</p>`;
            return;
        }
        const customs = catalog.customTemplates || [];
        const settings = catalog.settings || {};
        const builtin = (core()?.listDocs?.() || []).filter((d) => !d.custom);
        host.innerHTML = `
            <article class="admin-card panel" style="margin-top:18px">
                <h2>Catálogo de modelos</h2>
                <p>Ative/desative modelos nativos e cadastre modelos customizados (campos + caminho ou arquivo .docx).</p>
                <h3>Modelos nativos</h3>
                <div class="table-wrap">
                    <table>
                        <thead><tr><th>ID</th><th>Título</th><th>Ativo</th></tr></thead>
                        <tbody>
                            ${builtin.map((doc) => {
                                const active = settings[doc.id] ? settings[doc.id].isActive !== false : true;
                                return `<tr>
                                    <td><code>${esc(doc.id)}</code></td>
                                    <td>${esc(doc.title)}</td>
                                    <td><button type="button" data-toggle-template="${attr(doc.id)}" data-active="${active ? "1" : "0"}">${active ? "Desativar" : "Ativar"}</button></td>
                                </tr>`;
                            }).join("")}
                        </tbody>
                    </table>
                </div>
                <h3 style="margin-top:18px">Novo modelo customizado</h3>
                <form id="customTemplateForm" class="form-grid">
                    <label class="field"><span>Slug (id)</span><input name="slug" required placeholder="meu-contrato"></label>
                    <label class="field"><span>Título</span><input name="title" required></label>
                    <label class="field"><span>Categoria</span>
                        <select name="category">
                            <option value="contratos">Contratos</option>
                            <option value="declaracoes">Declarações</option>
                            <option value="rural">Rural</option>
                            <option value="procuracoes">Procurações</option>
                            <option value="outros">Outros</option>
                        </select>
                    </label>
                    <label class="field"><span>Caminho do .docx (opcional)</span><input name="modelPath" placeholder="modelos/arquivo.docx"></label>
                    <label class="field wide"><span>Descrição</span><input name="description"></label>
                    <label class="field wide"><span>Campos (JSON array: name, label)</span>
                        <textarea name="fieldsJson" rows="4" required placeholder='[{"name":"nome","label":"Nome"},{"name":"cpf","label":"CPF"}]'></textarea>
                    </label>
                    <label class="field wide"><span>Upload .docx (opcional, até ~1.8MB)</span><input name="modelFile" type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"></label>
                    <div class="field wide action-row"><button class="primary-button" type="submit">Criar modelo</button></div>
                    <p id="customTemplateMessage" class="message field wide"></p>
                </form>
                <h3 style="margin-top:18px">Customizados (${customs.length})</h3>
                <div class="table-wrap">
                    <table>
                        <thead><tr><th>Slug</th><th>Título</th><th>Ativo</th><th>Ações</th></tr></thead>
                        <tbody>
                            ${customs.length ? customs.map((t) => `
                                <tr>
                                    <td><code>${esc(t.slug)}</code></td>
                                    <td>${esc(t.title)}</td>
                                    <td>${t.isActive ? "Sim" : "Não"}</td>
                                    <td class="actions-cell"><button type="button" data-delete-template="${attr(t.id)}">Remover</button></td>
                                </tr>
                            `).join("") : `<tr><td colspan="4"><p class="message">Nenhum modelo customizado.</p></td></tr>`}
                        </tbody>
                    </table>
                </div>
            </article>
        `;

        host.querySelectorAll("[data-toggle-template]").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const templateId = btn.dataset.toggleTemplate;
                const currentlyActive = btn.dataset.active === "1";
                await api("/api/admin/templates/settings", {
                    method: "POST",
                    body: { templateId, isActive: !currentlyActive },
                });
                await loadTemplatesCatalog();
                renderAdminTemplatesSection(host);
                toast("Visibilidade atualizada.", "success");
            });
        });

        host.querySelector("#customTemplateForm")?.addEventListener("submit", async (event) => {
            event.preventDefault();
            const form = event.target;
            const fd = new FormData(form);
            const msg = host.querySelector("#customTemplateMessage");
            let fields;
            try {
                fields = JSON.parse(String(fd.get("fieldsJson") || "[]"));
            } catch (_) {
                if (msg) {
                    msg.textContent = "JSON de campos inválido.";
                    msg.className = "message error field wide";
                }
                return;
            }
            let modelBase64 = "";
            const file = form.elements.namedItem("modelFile")?.files?.[0];
            if (file) {
                const buf = await file.arrayBuffer();
                const bytes = new Uint8Array(buf);
                let binary = "";
                bytes.forEach((b) => { binary += String.fromCharCode(b); });
                modelBase64 = btoa(binary);
            }
            try {
                await api("/api/admin/templates", {
                    method: "POST",
                    body: {
                        slug: fd.get("slug"),
                        title: fd.get("title"),
                        category: fd.get("category"),
                        description: fd.get("description"),
                        modelPath: fd.get("modelPath"),
                        fields,
                        modelBase64,
                    },
                });
                if (msg) {
                    msg.textContent = "Modelo criado.";
                    msg.className = "message success field wide";
                }
                form.reset();
                await loadTemplatesCatalog();
                renderAdminTemplatesSection(host);
            } catch (error) {
                if (msg) {
                    msg.textContent = error.message || "Erro ao criar modelo.";
                    msg.className = "message error field wide";
                }
            }
        });

        host.querySelectorAll("[data-delete-template]").forEach((btn) => {
            btn.addEventListener("click", async () => {
                if (!confirm("Remover modelo customizado?")) return;
                await api(`/api/admin/templates/${encodeURIComponent(btn.dataset.deleteTemplate)}`, { method: "DELETE" });
                await loadTemplatesCatalog();
                renderAdminTemplatesSection(host);
            });
        });
    }

    // ── Hooks for script.js ────────────────────────────────────────────────

    async function onView() {
        return false;
    }

    async function onAfterGenerate() {
        setTimeout(() => injectSignatureUi(), 50);
    }

    function onDocumentFormReady(form) {
        injectWizardToolbar(form);
        enhanceAllFields(form);
    }

    async function onSessionReady() {
        await loadTemplatesCatalog();
    }

    function onAdminRendered(container) {
        const currentTab = core()?.getState?.()?.adminTab;
        const existing = container.querySelector("#adminTemplatesHost");
        if (currentTab !== "system") {
            existing?.remove();
            return;
        }
        let host = existing;
        if (!host) {
            host = document.createElement("div");
            host.id = "adminTemplatesHost";
            host.className = "admin-templates-host";
            container.querySelector(".admin-tab-content")?.appendChild(host);
        }
        renderAdminTemplatesSection(host);
    }

    window.DocSpaceProduct = {
        version: PRODUCT_VERSION,
        state,
        onView,
        onAfterGenerate,
        onDocumentFormReady,
        onSessionReady,
        onAdminRendered,
        enhanceAllFields,
        isValidCpf,
        isValidCnpj,
        formatCpf,
        formatCnpj,
        formatCep,
        formatPhone,
        fieldKind,
        applyDataToForm,
        injectSignatureUi,
    };

    console.log(`DocSpace Product ${PRODUCT_VERSION} loaded`);
})();
