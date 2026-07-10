/**
 * DocSpace product features (v6.1)
 * Pessoas, biblioteca (rascunhos/histórico), validação BR, assinatura, share, catálogo.
 * Depende de window.DocSpaceCore exposto por script.js.
 */
(() => {
    "use strict";

    const PRODUCT_VERSION = "6.1.0";
    const state = {
        people: [],
        drafts: [],
        history: [],
        shareLinks: [],
        signatures: [],
        templateSettings: {},
        customTemplates: [],
        peopleQuery: "",
        activeDraftId: null,
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

    // ── Brazilian validation / masks ───────────────────────────────────────

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

    function fieldKind(name = "") {
        const key = String(name || "").toLowerCase();
        if (/(^|_)cnpj($|_)/.test(key) || key.includes("cnpj")) return "cnpj";
        if (/(^|_)cpf($|_)/.test(key) || key.endsWith("_cpf") || key === "cpf") return "cpf";
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
        field.addEventListener("input", () => {
            const start = field.selectionStart;
            const before = field.value;
            if (kind === "cpf") field.value = formatCpf(field.value);
            if (kind === "cnpj") field.value = formatCnpj(field.value);
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
        if (!digits) {
            field.classList.remove("is-invalid", "is-valid");
            return;
        }
        if (kind === "cpf") ok = isValidCpf(digits);
        if (kind === "cnpj") ok = isValidCnpj(digits);
        if (kind === "cep") ok = digits.length === 8;
        if (kind === "phone") ok = digits.length >= 10 && digits.length <= 11;
        field.classList.toggle("is-invalid", !ok);
        field.classList.toggle("is-valid", ok);
        field.setCustomValidity(ok ? "" : `Valor de ${kind.toUpperCase()} inválido`);
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

    // ── People field mapping into document forms ───────────────────────────

    function personToFormData(person, rolePrefix = "") {
        const p = rolePrefix ? `${rolePrefix}_` : "";
        const base = {
            [`${p}nome`]: person.name,
            [`${p}nome_completo`]: person.name,
            nome: person.name,
            nome_pessoa: person.name,
            nome_declarante: person.name,
            nome_cliente: person.name,
            cpf: formatCpf(person.cpf),
            [`${p}cpf`]: formatCpf(person.cpf),
            cnpj: formatCnpj(person.cnpj),
            rg: person.rg,
            [`${p}rg`]: person.rg,
            email: person.email,
            telefone: formatPhone(person.phone),
            celular: formatPhone(person.phone),
            data_nascimento: person.birthDate,
            nacionalidade: person.nationality,
            estado_civil: person.maritalStatus,
            profissao: person.profession,
            endereco: person.addressStreet,
            logradouro: person.addressStreet,
            numero: person.addressNumber,
            bairro: person.addressDistrict,
            cidade: person.addressCity,
            municipio: person.addressCity,
            uf: person.addressUf,
            cep: formatCep(person.addressCep),
        };
        return base;
    }

    function applyDataToForm(form, data) {
        if (!form || !data) return;
        Object.entries(data).forEach(([key, value]) => {
            if (value == null || value === "") return;
            const fields = form.querySelectorAll(`[name="${key}"], [data-field-name="${key}"]`);
            fields.forEach((field) => {
                if (field.type === "checkbox" || field.type === "radio") {
                    field.checked = field.value === value || value === true || value === "sim";
                } else {
                    field.value = value;
                }
            });
        });
        enhanceAllFields(form);
    }

    // ── Views ──────────────────────────────────────────────────────────────

    async function loadPeople(q = "") {
        const data = await api(`/api/people${q ? `?q=${encodeURIComponent(q)}` : ""}`);
        state.people = data.people || [];
        return state.people;
    }

    async function loadLibrary() {
        const [drafts, history, links] = await Promise.all([
            api("/api/drafts"),
            api("/api/history?limit=50"),
            api("/api/share/links"),
        ]);
        state.drafts = drafts.drafts || [];
        state.history = history.history || [];
        state.shareLinks = links.links || [];
    }

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

    function renderPeopleView(container) {
        container.innerHTML = `
            <article class="panel">
                <div class="library-header">
                    <div>
                        <p class="eyebrow">Cadastro</p>
                        <h2>Pessoas e clientes</h2>
                        <p>Salve dados reutilizáveis e aplique no preenchimento dos documentos.</p>
                    </div>
                    <input id="peopleSearch" class="search-input" type="search" placeholder="Buscar nome, CPF, e-mail..." value="${attr(state.peopleQuery)}">
                </div>
            </article>
            <div class="split">
                <article class="admin-card panel">
                    <h2>Nova pessoa</h2>
                    <form id="personForm" class="form-grid">
                        <input type="hidden" name="id" id="personId">
                        <label class="field"><span>Nome completo</span><input name="name" required></label>
                        <label class="field"><span>CPF</span><input name="cpf" data-br-kind="cpf"></label>
                        <label class="field"><span>CNPJ</span><input name="cnpj" data-br-kind="cnpj"></label>
                        <label class="field"><span>RG</span><input name="rg"></label>
                        <label class="field"><span>E-mail</span><input name="email" type="email"></label>
                        <label class="field"><span>Telefone</span><input name="phone" data-br-kind="phone"></label>
                        <label class="field"><span>Nascimento</span><input name="birthDate" placeholder="dd/mm/aaaa"></label>
                        <label class="field"><span>Nacionalidade</span><input name="nationality"></label>
                        <label class="field"><span>Estado civil</span><input name="maritalStatus"></label>
                        <label class="field"><span>Profissão</span><input name="profession"></label>
                        <label class="field"><span>CEP</span><input name="addressCep" data-br-kind="cep"></label>
                        <label class="field"><span>Rua / logradouro</span><input name="addressStreet"></label>
                        <label class="field"><span>Número</span><input name="addressNumber"></label>
                        <label class="field"><span>Bairro</span><input name="addressDistrict"></label>
                        <label class="field"><span>Cidade</span><input name="addressCity"></label>
                        <label class="field"><span>UF</span><input name="addressUf" maxlength="2"></label>
                        <label class="field wide"><span>Observações</span><textarea name="notes" rows="2"></textarea></label>
                        <div class="field wide action-row">
                            <button class="primary-button" type="submit">Salvar pessoa</button>
                            <button class="secondary-button" type="button" id="personFormClear">Limpar</button>
                        </div>
                        <p id="personFormMessage" class="message field wide"></p>
                    </form>
                </article>
                <article class="admin-card panel">
                    <h2>Lista (${state.people.length})</h2>
                    <div class="table-wrap">
                        <table>
                            <thead><tr><th>Nome</th><th>Documento</th><th>Contato</th><th>Ações</th></tr></thead>
                            <tbody>
                                ${state.people.length ? state.people.map((p) => `
                                    <tr>
                                        <td><strong>${esc(p.name)}</strong><br><small>${esc(p.addressCity || "")} ${esc(p.addressUf || "")}</small></td>
                                        <td><small>CPF ${esc(formatCpf(p.cpf) || "—")}<br>CNPJ ${esc(formatCnpj(p.cnpj) || "—")}</small></td>
                                        <td><small>${esc(p.email || "—")}<br>${esc(formatPhone(p.phone) || "—")}</small></td>
                                        <td class="actions-cell">
                                            <button type="button" data-person-edit="${attr(p.id)}">Editar</button>
                                            <button type="button" data-person-delete="${attr(p.id)}">Excluir</button>
                                        </td>
                                    </tr>
                                `).join("") : `<tr><td colspan="4"><p class="message">Nenhuma pessoa cadastrada ainda.</p></td></tr>`}
                            </tbody>
                        </table>
                    </div>
                </article>
            </div>
        `;
        enhanceAllFields(container);
        const form = container.querySelector("#personForm");
        form?.addEventListener("submit", async (event) => {
            event.preventDefault();
            const fd = new FormData(form);
            const id = String(fd.get("id") || "");
            const body = Object.fromEntries(fd.entries());
            delete body.id;
            const msg = container.querySelector("#personFormMessage");
            try {
                if (id) await api(`/api/people/${encodeURIComponent(id)}`, { method: "PUT", body });
                else await api("/api/people", { method: "POST", body });
                if (msg) {
                    msg.textContent = "Pessoa salva.";
                    msg.className = "message success field wide";
                }
                form.reset();
                form.querySelector("#personId").value = "";
                await loadPeople(state.peopleQuery);
                renderPeopleView(container);
            } catch (error) {
                if (msg) {
                    msg.textContent = error.message || "Erro ao salvar.";
                    msg.className = "message error field wide";
                }
            }
        });
        container.querySelector("#personFormClear")?.addEventListener("click", () => {
            form.reset();
            form.querySelector("#personId").value = "";
        });
        container.querySelector("#peopleSearch")?.addEventListener("input", (event) => {
            clearTimeout(renderPeopleView._t);
            renderPeopleView._t = setTimeout(async () => {
                state.peopleQuery = event.target.value;
                await loadPeople(state.peopleQuery);
                renderPeopleView(container);
            }, 280);
        });
        container.querySelectorAll("[data-person-edit]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const person = state.people.find((p) => p.id === btn.dataset.personEdit);
                if (!person || !form) return;
                Object.entries({
                    id: person.id,
                    name: person.name,
                    cpf: formatCpf(person.cpf),
                    cnpj: formatCnpj(person.cnpj),
                    rg: person.rg,
                    email: person.email,
                    phone: formatPhone(person.phone),
                    birthDate: person.birthDate,
                    nationality: person.nationality,
                    maritalStatus: person.maritalStatus,
                    profession: person.profession,
                    addressCep: formatCep(person.addressCep),
                    addressStreet: person.addressStreet,
                    addressNumber: person.addressNumber,
                    addressDistrict: person.addressDistrict,
                    addressCity: person.addressCity,
                    addressUf: person.addressUf,
                    notes: person.notes,
                }).forEach(([k, v]) => {
                    const el = form.elements.namedItem(k);
                    if (el && "value" in el) el.value = v || "";
                });
                form.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        });
        container.querySelectorAll("[data-person-delete]").forEach((btn) => {
            btn.addEventListener("click", async () => {
                if (!confirm("Remover esta pessoa?")) return;
                try {
                    await api(`/api/people/${encodeURIComponent(btn.dataset.personDelete)}`, { method: "DELETE" });
                    await loadPeople(state.peopleQuery);
                    renderPeopleView(container);
                    toast("Pessoa removida.", "success");
                } catch (error) {
                    toast(error.message, "error");
                }
            });
        });
    }

    function renderLibraryView(container) {
        const appUrl = window.location.origin + window.location.pathname.replace(/index\.html$/i, "");
        container.innerHTML = `
            <article class="panel">
                <p class="eyebrow">Biblioteca</p>
                <h2>Rascunhos, histórico e links</h2>
                <p>Continue preenchimentos, reabra gerações anteriores e gerencie links enviados ao cliente.</p>
            </article>
            <div class="split">
                <article class="panel">
                    <h2>Rascunhos (${state.drafts.length})</h2>
                    <div class="grid">
                        ${state.drafts.length ? state.drafts.map((d) => `
                            <article class="document-card">
                                <h3>${esc(d.title || d.documentType)}</h3>
                                <p>Atualizado: ${esc(formatDate(d.updatedAt))}</p>
                                <div class="card-meta">
                                    <span class="badge">${esc(d.documentType)}</span>
                                    <span class="badge">${esc(d.status)}</span>
                                </div>
                                <div class="action-row" style="margin-top:10px">
                                    <button class="primary-button" type="button" data-open-draft="${attr(d.id)}">Continuar</button>
                                    <button class="ghost-button" type="button" data-delete-draft="${attr(d.id)}">Excluir</button>
                                </div>
                            </article>
                        `).join("") : `<p class="message">Nenhum rascunho salvo.</p>`}
                    </div>
                </article>
                <article class="panel">
                    <h2>Histórico (${state.history.length})</h2>
                    <div class="table-wrap">
                        <table>
                            <thead><tr><th>Documento</th><th>Formato</th><th>Quando</th><th>Ações</th></tr></thead>
                            <tbody>
                                ${state.history.length ? state.history.map((h) => `
                                    <tr>
                                        <td><strong>${esc(h.title || h.documentType)}</strong><br><small>${esc(h.fileName || "")}</small></td>
                                        <td>${esc((h.outputFormat || "").toUpperCase())}</td>
                                        <td>${esc(formatDate(h.createdAt))}</td>
                                        <td class="actions-cell">
                                            <button type="button" data-reopen-history="${attr(h.id)}">Reabrir dados</button>
                                        </td>
                                    </tr>
                                `).join("") : `<tr><td colspan="4"><p class="message">Nenhuma geração registrada.</p></td></tr>`}
                            </tbody>
                        </table>
                    </div>
                </article>
            </div>
            <article class="panel">
                <h2>Links de preenchimento</h2>
                <div class="table-wrap">
                    <table>
                        <thead><tr><th>Título</th><th>Status</th><th>Expira</th><th>Link / ações</th></tr></thead>
                        <tbody>
                            ${state.shareLinks.length ? state.shareLinks.map((l) => {
                                const url = `${appUrl}share.html?token=${encodeURIComponent(l.token)}`;
                                return `<tr>
                                    <td><strong>${esc(l.title || l.documentType)}</strong><br><small>${esc(l.documentType)}</small></td>
                                    <td>${esc(l.status)}</td>
                                    <td>${esc(formatDate(l.expiresAt))}</td>
                                    <td class="actions-cell">
                                        <button type="button" data-copy-share="${attr(url)}">Copiar link</button>
                                        ${l.status === "open" ? `<button type="button" data-close-share="${attr(l.id)}">Encerrar</button>` : ""}
                                        ${l.status === "submitted" ? `<button type="button" data-open-share-draft="${attr(l.id)}">Abrir dados</button>` : ""}
                                    </td>
                                </tr>`;
                            }).join("") : `<tr><td colspan="4"><p class="message">Nenhum link criado. Abra um documento e use “Enviar ao cliente”.</p></td></tr>`}
                        </tbody>
                    </table>
                </div>
            </article>
        `;

        container.querySelectorAll("[data-open-draft]").forEach((btn) => {
            btn.addEventListener("click", () => openDraft(btn.dataset.openDraft));
        });
        container.querySelectorAll("[data-delete-draft]").forEach((btn) => {
            btn.addEventListener("click", async () => {
                if (!confirm("Excluir rascunho?")) return;
                await api(`/api/drafts/${encodeURIComponent(btn.dataset.deleteDraft)}`, { method: "DELETE" });
                await loadLibrary();
                renderLibraryView(container);
            });
        });
        container.querySelectorAll("[data-reopen-history]").forEach((btn) => {
            btn.addEventListener("click", () => reopenHistory(btn.dataset.reopenHistory));
        });
        container.querySelectorAll("[data-copy-share]").forEach((btn) => {
            btn.addEventListener("click", async () => {
                try {
                    await navigator.clipboard.writeText(btn.dataset.copyShare);
                    toast("Link copiado.", "success");
                } catch (_) {
                    prompt("Copie o link:", btn.dataset.copyShare);
                }
            });
        });
        container.querySelectorAll("[data-close-share]").forEach((btn) => {
            btn.addEventListener("click", async () => {
                await api(`/api/share/links/${encodeURIComponent(btn.dataset.closeShare)}`, { method: "DELETE" });
                await loadLibrary();
                renderLibraryView(container);
            });
        });
        container.querySelectorAll("[data-open-share-draft]").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const link = state.shareLinks.find((l) => l.id === btn.dataset.openShareDraft);
                if (!link) return;
                core()?.openDocumentWithData?.(link.documentType, link.formData || {});
            });
        });
    }

    function formatDate(value) {
        if (!value) return "—";
        try {
            return new Date(value).toLocaleString("pt-BR");
        } catch (_) {
            return String(value);
        }
    }

    async function openDraft(id) {
        const data = await api(`/api/drafts/${encodeURIComponent(id)}`);
        const draft = data.draft;
        if (!draft) return;
        state.activeDraftId = draft.id;
        core()?.openDocumentWithData?.(draft.documentType, draft.formData || {}, { draftId: draft.id, step: draft.currentStep || 0 });
        toast("Rascunho aberto.", "success");
    }

    async function reopenHistory(id) {
        const data = await api(`/api/history/${encodeURIComponent(id)}`);
        const item = data.item;
        if (!item) return;
        core()?.openDocumentWithData?.(item.documentType, item.formData || {});
        toast("Dados do histórico carregados.", "success");
    }

    // ── Wizard toolbar (save draft, people, share, sign) ───────────────────

    function injectWizardToolbar(form) {
        if (!form || form.dataset.productToolbar === "1") return;
        form.dataset.productToolbar = "1";
        const actions = form.querySelector(".wizard-actions .right") || form.querySelector(".wizard-actions");
        if (!actions) return;
        const bar = document.createElement("div");
        bar.className = "product-toolbar action-row";
        bar.innerHTML = `
            <button type="button" class="secondary-button" data-product-save-draft>Salvar rascunho</button>
            <button type="button" class="secondary-button" data-product-apply-person>Usar pessoa</button>
            <button type="button" class="secondary-button" data-product-share-link>Enviar ao cliente</button>
        `;
        actions.prepend(bar);

        bar.querySelector("[data-product-save-draft]")?.addEventListener("click", () => saveCurrentDraft(form));
        bar.querySelector("[data-product-apply-person]")?.addEventListener("click", () => openPersonPicker(form));
        bar.querySelector("[data-product-share-link]")?.addEventListener("click", () => createShareFromForm(form));
        enhanceAllFields(form);
    }

    async function saveCurrentDraft(form) {
        const c = core();
        if (!c) return;
        const docId = form.dataset.documentId;
        const doc = c.getDoc?.(docId);
        const formData = c.collectFormData?.(form, doc) || {};
        const body = {
            id: state.activeDraftId || undefined,
            documentType: docId,
            title: doc?.title || docId,
            formData,
            currentStep: Number(form.dataset.currentStep || 0),
            status: "draft",
        };
        try {
            const data = await api("/api/drafts", { method: "POST", body });
            state.activeDraftId = data.draft?.id || state.activeDraftId;
            toast("Rascunho salvo.", "success");
        } catch (error) {
            toast(error.message || "Erro ao salvar rascunho.", "error");
        }
    }

    async function openPersonPicker(form) {
        try {
            if (!state.people.length) await loadPeople();
        } catch (error) {
            toast(error.message, "error");
            return;
        }
        if (!state.people.length) {
            toast("Cadastre pessoas em “Pessoas” primeiro.", "error");
            return;
        }
        const choice = prompt(
            "Digite o número da pessoa:\n" +
            state.people.slice(0, 20).map((p, i) => `${i + 1}. ${p.name}`).join("\n")
        );
        const index = Number(choice) - 1;
        if (!Number.isInteger(index) || index < 0 || index >= state.people.length) return;
        applyDataToForm(form, personToFormData(state.people[index]));
        toast(`Dados de ${state.people[index].name} aplicados.`, "success");
    }

    async function createShareFromForm(form) {
        const c = core();
        const docId = form.dataset.documentId;
        const doc = c?.getDoc?.(docId);
        const formData = c?.collectFormData?.(form, doc) || {};
        try {
            const data = await api("/api/share/links", {
                method: "POST",
                body: {
                    documentType: docId,
                    title: doc?.title || docId,
                    formData,
                    expiresInDays: 7,
                },
            });
            const token = data.link?.token;
            const base = window.location.href.replace(/index\.html.*/i, "").replace(/#.*$/, "");
            const url = `${base}${base.endsWith("/") ? "" : "/"}share.html?token=${encodeURIComponent(token)}`;
            try {
                await navigator.clipboard.writeText(url);
                toast("Link copiado para a área de transferência.", "success");
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
                await api("/api/signatures", {
                    method: "POST",
                    body: {
                        signerName,
                        signerEmail,
                        signatureDataUrl,
                        pdfBase64: stamped,
                        fileName,
                        documentType: c.getState?.()?.activeDocId || "",
                    },
                });
                c.showDocumentPdfPreview?.(stamped, fileName);
                c.downloadBase64?.(stamped, fileName, "application/pdf");
                toast("PDF assinado e baixado.", "success");
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

    async function onView(view, container) {
        if (view === "people") {
            try {
                await loadPeople(state.peopleQuery);
            } catch (error) {
                container.innerHTML = `<p class="message error">${esc(error.message)}</p>`;
                return true;
            }
            renderPeopleView(container);
            return true;
        }
        if (view === "library") {
            try {
                await loadLibrary();
            } catch (error) {
                container.innerHTML = `<p class="message error">${esc(error.message)}</p>`;
                return true;
            }
            renderLibraryView(container);
            return true;
        }
        return false;
    }

    async function onAfterGenerate({ form, doc, formData, generateType, fileName }) {
        try {
            await api("/api/history", {
                method: "POST",
                body: {
                    documentType: doc?.id || form?.dataset?.documentId,
                    title: doc?.title || "",
                    formData,
                    outputFormat: generateType,
                    fileName: fileName || "",
                    draftId: state.activeDraftId || "",
                },
            });
            if (state.activeDraftId) {
                await api("/api/drafts", {
                    method: "POST",
                    body: {
                        id: state.activeDraftId,
                        documentType: doc?.id,
                        title: doc?.title,
                        formData,
                        status: "completed",
                        currentStep: 0,
                    },
                });
            }
        } catch (error) {
            console.warn("Histórico não registrado:", error);
        }
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
        let host = container.querySelector("#adminTemplatesHost");
        if (!host) {
            host = document.createElement("div");
            host.id = "adminTemplatesHost";
            container.appendChild(host);
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
        personToFormData,
        injectSignatureUi,
    };

    console.log(`DocSpace Product ${PRODUCT_VERSION} loaded`);
})();
