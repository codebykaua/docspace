/* =========================================================
   DocSpace — UI interna polida
   - Corrige botões Voltar/Trocar documento
   - Corrige alternância de tema
   - Abre ferramentas PDF diretamente na ferramenta escolhida
   - Abre documentos diretamente pelo menu
   - Mantém a lógica original quando disponível
   ========================================================= */

(function () {
    if (window.__docspaceInternalUiLoaded) {
        return;
    }
    window.__docspaceInternalUiLoaded = true;

    const PDF_OPERATION_META = {
        merge: {
            title: "Juntar PDFs",
            desc: "Combine vários arquivos PDF em um único documento, mantendo a ordem selecionada.",
            icon: "paperclip",
            button: "Juntar PDFs",
            fileLabel: "Arquivos PDF na ordem desejada",
            pages: false,
            rotation: false,
            compression: false,
            ocr: false,
            multiple: true,
            accept: ".pdf,application/pdf",
        },
        split: {
            title: "Dividir PDF",
            desc: "Separe páginas de um PDF e baixe tudo organizado em um arquivo ZIP.",
            icon: "scissors",
            button: "Dividir PDF",
            fileLabel: "Arquivo PDF",
            pages: true,
            pagesLabel: "Páginas para separar",
            pagesHelp: "Deixe vazio para separar todas ou informe: 1,3-5.",
            rotation: false,
            compression: false,
            ocr: false,
            multiple: false,
            accept: ".pdf,application/pdf",
        },
        compress: {
            title: "Comprimir PDF",
            desc: "Reduza o tamanho do PDF usando processamento local no navegador.",
            icon: "archive",
            button: "Comprimir PDF",
            fileLabel: "Arquivo PDF",
            pages: false,
            rotation: false,
            compression: true,
            ocr: false,
            multiple: false,
            accept: ".pdf,application/pdf",
        },
        organize: {
            title: "Organizar páginas",
            desc: "Reordene as páginas do PDF informando a sequência desejada.",
            icon: "list-ordered",
            button: "Organizar páginas",
            fileLabel: "Arquivo PDF",
            pages: true,
            pagesLabel: "Nova ordem das páginas",
            pagesHelp: "Informe a ordem desejada. Exemplo: 3,1,2,4-6.",
            rotation: false,
            compression: false,
            ocr: false,
            multiple: false,
            accept: ".pdf,application/pdf",
        },
        remove: {
            title: "Remover páginas",
            desc: "Exclua páginas específicas sem recriar o documento inteiro.",
            icon: "trash-2",
            button: "Remover páginas",
            fileLabel: "Arquivo PDF",
            pages: true,
            pagesLabel: "Páginas que serão removidas",
            pagesHelp: "Exemplo: 2,4-6.",
            rotation: false,
            compression: false,
            ocr: false,
            multiple: false,
            accept: ".pdf,application/pdf",
        },
        extract: {
            title: "Extrair páginas",
            desc: "Crie um novo PDF somente com as páginas selecionadas.",
            icon: "files",
            button: "Extrair páginas",
            fileLabel: "Arquivo PDF",
            pages: true,
            pagesLabel: "Páginas que serão extraídas",
            pagesHelp: "Exemplo: 1,3-5.",
            rotation: false,
            compression: false,
            ocr: false,
            multiple: false,
            accept: ".pdf,application/pdf",
        },
        rotate: {
            title: "Girar páginas",
            desc: "Gire páginas do PDF para corrigir a orientação.",
            icon: "rotate-cw",
            button: "Girar páginas",
            fileLabel: "Arquivo PDF",
            pages: true,
            pagesLabel: "Páginas que serão giradas",
            pagesHelp: "Deixe vazio para girar todas.",
            rotation: true,
            compression: false,
            ocr: false,
            multiple: false,
            accept: ".pdf,application/pdf",
        },
        images: {
            title: "Imagens para PDF",
            desc: "Converta imagens JPG, PNG ou WEBP em um arquivo PDF.",
            icon: "image",
            button: "Converter imagens",
            fileLabel: "Imagens",
            pages: false,
            rotation: false,
            compression: false,
            ocr: false,
            multiple: true,
            accept: ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp",
        },
        wordPdf: {
            title: "Word para PDF",
            desc: "Converta texto de arquivo Word .docx para PDF.",
            icon: "file-type-2",
            button: "Converter Word",
            fileLabel: "Arquivo Word",
            pages: false,
            rotation: false,
            compression: false,
            ocr: false,
            multiple: false,
            accept: ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        },
        ocr: {
            title: "PDF pesquisável com OCR",
            desc: "Adicione texto pesquisável a PDFs digitalizados ou imagens.",
            icon: "scan-text",
            button: "Aplicar OCR",
            fileLabel: "PDF ou imagem",
            pages: false,
            rotation: false,
            compression: false,
            ocr: true,
            multiple: false,
            accept: ".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp",
        },
    };

    function all(selector, root) {
        return Array.from((root || document).querySelectorAll(selector));
    }

    function one(selector, root) {
        return (root || document).querySelector(selector);
    }

    function createIcons() {
        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }
    }

    function callGlobal(name, args) {
        args = args || [];
        try {
            if (typeof window[name] === "function") {
                return window[name].apply(window, args);
            }
            if (typeof globalThis[name] === "function") {
                return globalThis[name].apply(globalThis, args);
            }
        } catch (error) {
            console.warn("Falha ao executar " + name + ".", error);
        }
        return undefined;
    }

    function setView(viewName) {
        const views = {
            auth: one("#authView"),
            documents: one("#documentView"),
            admin: one("#adminView"),
            generator: one("#generatorView"),
            simpleDocument: one("#simpleDocumentView"),
            pdfLocal: one("#pdfLocalView"),
        };

        Object.keys(views).forEach((key) => {
            if (views[key]) {
                views[key].classList.toggle("is-hidden", key !== viewName);
            }
        });

        document.body.classList.toggle("auth-open", viewName === "auth");
        document.body.classList.toggle("document-home-open", viewName === "documents");
        document.body.classList.toggle("document-generator-open", viewName === "generator" || viewName === "simpleDocument");
        document.body.classList.toggle("pdf-tools-open", viewName === "pdfLocal");
        document.body.classList.toggle("admin-access-open", viewName === "admin");
        createIcons();
    }

    function closeMegaMenus() {
        all(".docspace-mega-menu").forEach((menu) => {
            menu.classList.add("is-hidden");
            menu.removeAttribute("data-open");
            menu.style.display = "";
            menu.style.visibility = "";
            menu.style.opacity = "";
            menu.style.pointerEvents = "";
        });

        all("[data-mega-target]").forEach((button) => {
            button.classList.remove("is-open");
            button.setAttribute("aria-expanded", "false");
        });
    }

    function openMegaMenu(button) {
        const targetId = button?.dataset?.megaTarget || "";
        const menu = targetId ? document.getElementById(targetId) : null;

        if (!menu) return;

        const alreadyOpen = !menu.classList.contains("is-hidden") || menu.getAttribute("data-open") === "true";
        closeMegaMenus();

        if (!alreadyOpen) {
            menu.classList.remove("is-hidden");
            menu.setAttribute("data-open", "true");
            button.classList.add("is-open");
            button.setAttribute("aria-expanded", "true");
        }

        createIcons();
    }

    function setActiveNav(target) {
        all(".document-home-header [data-home-nav]").forEach((button) => {
            button.classList.toggle("is-active", button.dataset.homeNav === target);
        });
    }

    function showHomeSection(target) {
        const normalized = target || "home";

        closeMegaMenus();

        if (callGlobal("mostrarTela", ["documents"]) === undefined) {
            setView("documents");
        }

        all("#documentView [data-home-section]").forEach((section) => {
            section.classList.toggle("is-hidden", section.dataset.homeSection !== normalized);
        });

        setActiveNav(normalized);

        try {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (_) {}

        createIcons();
    }

    function toggleTheme() {
        try {
            if (typeof window.alternarTemaSistema === "function") {
                window.alternarTemaSistema();
                return;
            }
            if (typeof globalThis.alternarTemaSistema === "function") {
                globalThis.alternarTemaSistema();
                return;
            }
        } catch (_) {}

        const isLight = document.body.classList.contains("system-light-theme");
        document.body.classList.toggle("system-light-theme", !isLight);
        document.body.classList.toggle("system-dark-theme", isLight);
        document.documentElement.style.colorScheme = isLight ? "dark" : "light";

        try {
            localStorage.setItem("documentos_rurais_system_theme", isLight ? "dark" : "light");
        } catch (_) {}

        all("[data-system-theme-toggle]").forEach((button) => {
            const label = button.querySelector("span");
            const icon = button.querySelector("i");
            const nowLight = document.body.classList.contains("system-light-theme");
            button.setAttribute("aria-pressed", String(nowLight));
            if (label) label.textContent = nowLight ? "Tema escuro" : "Tema claro";
            if (icon) icon.setAttribute("data-lucide", nowLight ? "moon" : "sun");
        });

        createIcons();
    }

    function updatePdfFields(operation) {
        const meta = PDF_OPERATION_META[operation] || PDF_OPERATION_META.merge;

        const title = one("#pdfLocalOperationTitle");
        const desc = one("#pdfLocalOperationDescription");
        const icon = one("#pdfLocalOperationIcon");
        const kicker = one("#pdfLocalOperationKicker");
        const submit = one("#pdfLocalSubmitButton");
        const fileLabel = one("#pdfLocalFileLabel");
        const files = one("#pdfLocalFiles");

        if (title) title.textContent = meta.title;
        if (desc) desc.textContent = meta.desc;
        if (kicker) kicker.textContent = meta.title;
        if (submit) submit.textContent = meta.button;
        if (fileLabel) fileLabel.textContent = meta.fileLabel;
        if (files) {
            files.accept = meta.accept || "";
            files.multiple = Boolean(meta.multiple);
        }
        if (icon) {
            icon.innerHTML = `<i data-lucide="${meta.icon || "file-text"}" aria-hidden="true"></i>`;
        }

        const pagesField = one("#pdfLocalPagesField");
        const pages = one("#pdfLocalPages");
        const pagesLabel = one("#pdfLocalPagesLabel");
        const pagesHelp = one("#pdfLocalPagesHelp");
        const rotationField = one("#pdfLocalRotationField");
        const compressionField = one("#pdfLocalCompressionField");
        const ocrField = one("#pdfLocalOcrLanguageField");

        if (pagesField) pagesField.classList.toggle("is-hidden", !meta.pages);
        if (pages) {
            pages.required = Boolean(meta.pagesRequired);
            if (!meta.pages) pages.value = "";
        }
        if (pagesLabel) pagesLabel.textContent = meta.pagesLabel || "Páginas";
        if (pagesHelp) pagesHelp.textContent = meta.pagesHelp || "";
        if (rotationField) rotationField.classList.toggle("is-hidden", !meta.rotation);
        if (compressionField) compressionField.classList.toggle("is-hidden", !meta.compression);
        if (ocrField) ocrField.classList.toggle("is-hidden", !meta.ocr);

        all("[data-pdf-local-operation]").forEach((button) => {
            button.classList.toggle("is-active", button.dataset.pdfLocalOperation === operation);
        });

        all(".pdf-local-category-tab").forEach((button) => {
            const activeCategory = {
                organize: "organize",
                compress: "optimize",
                images: "convert",
                wordPdf: "convert",
                ocr: "intelligence",
            }[operation] || "all";
            button.classList.toggle("is-active", button.dataset.pdfLocalCategory === activeCategory);
        });

        createIcons();
    }

    function forcePdfOperation(operation) {
        const selected = operation || "merge";

        try {
            if (typeof window.selecionarFerramentaPdfLocal === "function") {
                window.selecionarFerramentaPdfLocal(selected, { abrirPainel: true });
            } else if (typeof globalThis.selecionarFerramentaPdfLocal === "function") {
                globalThis.selecionarFerramentaPdfLocal(selected, { abrirPainel: true });
            }
        } catch (error) {
            console.warn("selecionarFerramentaPdfLocal falhou. Usando fallback visual.", error);
        }

        const toolsHome = one("#pdfLocalToolsHome");
        const operationPanel = one("#pdfLocalOperationPanel");

        if (toolsHome) toolsHome.classList.add("is-hidden");
        if (operationPanel) {
            operationPanel.classList.remove("is-hidden");
            operationPanel.dataset.activeOperation = selected;
        }

        updatePdfFields(selected);

        try {
            operationPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (_) {}
    }

    function openPdfTools(operation) {
        closeMegaMenus();

        const selected = operation || "merge";

        try {
            if (typeof window.abrirFerramentasPdfLocais === "function") {
                window.abrirFerramentasPdfLocais();
            } else if (typeof globalThis.abrirFerramentasPdfLocais === "function") {
                globalThis.abrirFerramentasPdfLocais();
            } else if (callGlobal("mostrarTela", ["pdfLocal"]) === undefined) {
                setView("pdfLocal");
            }
        } catch (error) {
            console.warn("Abrindo ferramentas PDF pelo fallback.", error);
            setView("pdfLocal");
        }

        window.setTimeout(() => forcePdfOperation(selected), 80);
        window.setTimeout(() => forcePdfOperation(selected), 320);
    }

    function showPdfToolsHome() {
        callGlobal("mostrarHomeFerramentasPdfLocal");
        const toolsHome = one("#pdfLocalToolsHome");
        const operationPanel = one("#pdfLocalOperationPanel");

        if (toolsHome) toolsHome.classList.remove("is-hidden");
        if (operationPanel) operationPanel.classList.add("is-hidden");
        createIcons();
    }

    function openDocuments(type) {
        closeMegaMenus();

        const selected = type || "";

        if (selected) {
            try {
                if (typeof window.abrirTipoDocumento === "function") {
                    window.abrirTipoDocumento(selected);
                    return;
                }
                if (typeof globalThis.abrirTipoDocumento === "function") {
                    globalThis.abrirTipoDocumento(selected);
                    return;
                }
            } catch (error) {
                console.warn("abrirTipoDocumento falhou. Tentando via card.", error);
            }
        }

        showHomeSection("documents");

        if (!selected) return;

        window.setTimeout(() => {
            const card = one('.document-card[data-document-type="' + selected + '"]');
            if (card) {
                card.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
            }
        }, 150);
    }

    function refreshAdminData() {
        window.setTimeout(() => {
            callGlobal("carregarUsuariosAdmin");
            callGlobal("carregarAtendimentosAdmin");
            callGlobal("carregarAppReleaseAdmin");
            createIcons();
        }, 120);

        window.setTimeout(() => {
            callGlobal("carregarUsuariosAdmin");
            createIcons();
        }, 600);
    }

    function openAdmin() {
        closeMegaMenus();

        try {
            if (typeof window.abrirPainelAdmin === "function") {
                window.abrirPainelAdmin();
                refreshAdminData();
                return;
            }
            if (typeof globalThis.abrirPainelAdmin === "function") {
                globalThis.abrirPainelAdmin();
                refreshAdminData();
                return;
            }
        } catch (error) {
            console.warn("abrirPainelAdmin falhou. Usando fallback.", error);
        }

        if (callGlobal("mostrarTela", ["admin"]) === undefined) {
            setView("admin");
        }

        callGlobal("mostrarSecaoAdmin", ["users"]);
        refreshAdminData();
    }

    function backToDocuments() {
        closeMegaMenus();

        try {
            callGlobal("limparMensagem");
            callGlobal("limparMensagemDocumentoSimples");
            callGlobal("limparMensagemAdmin");
            callGlobal("limparFormularioPdfLocal");
        } catch (_) {}

        if (callGlobal("mostrarTela", ["documents"]) === undefined) {
            setView("documents");
        }

        window.setTimeout(() => showHomeSection("home"), 40);
    }

    function logout() {
        closeMegaMenus();

        try {
            if (typeof window.sairDoSistema === "function") {
                window.sairDoSistema();
                return;
            }
            if (typeof globalThis.sairDoSistema === "function") {
                globalThis.sairDoSistema();
                return;
            }
        } catch (_) {}

        try {
            localStorage.removeItem("documentos_rurais_session_token");
            localStorage.removeItem("documentos_rurais_billing_token");
        } catch (_) {}

        if (callGlobal("mostrarTela", ["auth"]) === undefined) {
            setView("auth");
        }
    }

    function normalizeGeneratedProfile() {
        const profile = one("#profileSection");
        if (!profile) return;

        const largeFallback = profile.querySelector(".profile-avatar-fallback, #profileAvatarFallback");
        if (largeFallback) {
            largeFallback.style.removeProperty("width");
            largeFallback.style.removeProperty("height");
        }
    }

    function bind() {
        document.addEventListener("click", (event) => {
            const trigger = event.target.closest("[data-mega-target]");
            if (trigger) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                openMegaMenu(trigger);
                return;
            }

            const pdf = event.target.closest("[data-mega-pdf-operation]");
            if (pdf) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                openPdfTools(pdf.dataset.megaPdfOperation || "merge");
                return;
            }

            const pdfOperation = event.target.closest("#pdfLocalView [data-pdf-local-operation]");
            if (pdfOperation) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                forcePdfOperation(pdfOperation.dataset.pdfLocalOperation || "merge");
                return;
            }

            const doc = event.target.closest("[data-mega-document-type]");
            if (doc) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                openDocuments(doc.dataset.megaDocumentType || "");
                return;
            }

            const admin = event.target.closest("#adminSidebarButton");
            if (admin) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                openAdmin();
                return;
            }

            const back = event.target.closest("#backToDocumentsButton, #backToDocumentsFromSimpleButton, #backToDocumentsFromAdminButton, #backToDocumentsFromPdfLocalButton");
            if (back) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                backToDocuments();
                return;
            }

            const pdfBackToTools = event.target.closest("#pdfLocalBackToToolsButton");
            if (pdfBackToTools) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                showPdfToolsHome();
                return;
            }

            const theme = event.target.closest("[data-system-theme-toggle]");
            if (theme) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                toggleTheme();
                return;
            }

            const nav = event.target.closest(".document-home-header [data-home-nav]");
            if (nav && !nav.matches("[data-mega-target]")) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                showHomeSection(nav.dataset.homeNav || "home");
                return;
            }

            const exit = event.target.closest("[data-logout-button]");
            if (exit) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                logout();
                return;
            }

            if (!event.target.closest(".docspace-mega-menu")) {
                closeMegaMenus();
            }
        }, true);

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMegaMenus();
            }
        });
    }

    function init() {
        bind();
        normalizeGeneratedProfile();
        closeMegaMenus();
        createIcons();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    window.DocSpaceInternalUI = {
        showHomeSection,
        openPdfTools,
        openDocuments,
        openAdmin,
        backToDocuments,
        closeMegaMenus,
        forcePdfOperation,
    };
})();



/* =========================================================
   HARD FIX SEGURO — sem MutationObserver travando o site
   - Atendimento modal
   - Categorias redirecionando
   - Perfil sem Liquid Glass
   - Selo verificado pequeno
   - Radios compactos
   ========================================================= */
(function () {
    if (window.__docspaceHardFixSafe20260703) return;
    window.__docspaceHardFixSafe20260703 = true;

    const q = (s, r = document) => r.querySelector(s);
    const qa = (s, r = document) => Array.from(r.querySelectorAll(s));

    function icons() {
        if (window.lucide?.createIcons) {
            window.lucide.createIcons();
        }
    }

    function showView(name) {
        try {
            if (typeof window.mostrarTela === "function") {
                window.mostrarTela(name);
                return;
            }
        } catch (_) {}

        const map = {
            auth: "#authView",
            documents: "#documentView",
            admin: "#adminView",
            generator: "#generatorView",
            simpleDocument: "#simpleDocumentView",
            pdfLocal: "#pdfLocalView",
        };

        Object.entries(map).forEach(([key, selector]) => {
            q(selector)?.classList.toggle("is-hidden", key !== name);
        });

        document.body.classList.toggle("document-home-open", name === "documents");
        document.body.classList.toggle("admin-access-open", name === "admin");
        document.body.classList.toggle("document-generator-open", name === "generator" || name === "simpleDocument");
        document.body.classList.toggle("pdf-tools-open", name === "pdfLocal");
    }

    function showHomeSection(target) {
        const safe = target || "home";
        showView("documents");

        qa("#documentView [data-home-section]").forEach((section) => {
            section.classList.toggle("is-hidden", section.dataset.homeSection !== safe);
        });

        qa(".document-home-header [data-home-nav]").forEach((button) => {
            button.classList.toggle("is-active", button.dataset.homeNav === safe);
        });

        try {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (_) {}

        icons();
    }

    function applyDocumentFilter(filter) {
        const normalized = filter || "all";
        const search = q("#documentSearch");
        if (search) search.value = "";

        qa(".document-filter").forEach((button) => {
            const active = button.dataset.documentFilter === normalized;
            button.classList.toggle("is-active", active);
            button.setAttribute("aria-selected", String(active));
        });

        let total = 0;
        qa(".document-card[data-document-type]").forEach((card) => {
            const cats = String(card.dataset.documentCategory || "").split(/\s+/);
            const ok = normalized === "all" || cats.includes(normalized);
            card.classList.toggle("is-filtered-out", !ok);
            if (ok && !card.classList.contains("is-hidden")) total += 1;
        });

        q("#documentEmptyState")?.classList.toggle("is-hidden", total > 0);
    }

    function openCategory(filter) {
        const categoryMap = {
            contracts: "contracts",
            rural: "declarations",
            declarations: "declarations",
            powers: "powers",
            tools: "tools",
            inss: "declarations",
            all: "all",
        };

        const selected = categoryMap[filter] || filter || "all";
        showHomeSection("documents");

        window.setTimeout(() => applyDocumentFilter(selected), 60);
        window.setTimeout(() => {
            q("#documentCatalogSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
            applyDocumentFilter(selected);
        }, 160);
    }

    function applySearchShortcut(term) {
        showHomeSection("documents");

        window.setTimeout(() => {
            const search = q("#documentSearch");
            if (search) {
                search.value = term || "";
                search.dispatchEvent(new Event("input", { bubbles: true }));
            }

            const normalized = String(term || "")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();

            let total = 0;

            qa(".document-card[data-document-type]").forEach((card) => {
                const text = card.textContent
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase();

                const ok = !normalized || text.includes(normalized);
                card.classList.toggle("is-filtered-out", !ok);

                if (ok && !card.classList.contains("is-hidden")) total += 1;
            });

            q("#documentEmptyState")?.classList.toggle("is-hidden", total > 0);
        }, 100);
    }

    function openSupport() {
        const modal = q("#supportChatModal");
        if (!modal) return;

        modal.classList.remove("is-hidden");
        modal.setAttribute("data-open", "true");
        document.body.classList.add("modal-open", "support-modal-open");

        try {
            if (typeof window.carregarMensagensAtendimento === "function") {
                window.carregarMensagensAtendimento();
            }
        } catch (_) {}

        setTimeout(() => q("#supportMessage")?.focus({ preventScroll: true }), 120);
        icons();
    }

    function closeSupport() {
        const modal = q("#supportChatModal");
        if (!modal) return;

        modal.classList.add("is-hidden");
        modal.removeAttribute("data-open");
        document.body.classList.remove("support-modal-open");
        document.body.classList.remove("modal-open");
    }

    function compactAdminUsers() {
        qa(".admin-user-row details").forEach((details) => {
            details.classList.add("admin-user-details-compact");
        });

        qa(".admin-user-row summary").forEach((summary) => {
            if (/ver detalhes/i.test(summary.textContent || "")) {
                summary.textContent = "Detalhes";
            }
        });

        qa(".verified-badge svg, [data-verified-badge] svg, .home-verified-badge svg").forEach((svg) => {
            svg.removeAttribute("width");
            svg.removeAttribute("height");
            svg.style.width = "18px";
            svg.style.height = "18px";
        });

        qa(".verified-badge, [data-verified-badge], .home-verified-badge").forEach((badge) => {
            badge.style.width = "18px";
            badge.style.height = "18px";
            badge.style.minWidth = "18px";
            badge.style.maxWidth = "18px";
            badge.style.maxHeight = "18px";
        });
    }

    function removeLiquidGlassProfile() {
        const panel = q("#profileThemePanel");
        if (panel) {
            panel.classList.add("is-hidden");
            panel.setAttribute("hidden", "hidden");
        }

        const adminLiquid = q("#adminUserLiquidGlass");
        const liquidField = adminLiquid?.closest(".field");
        if (liquidField) {
            liquidField.style.display = "none";
        }
    }

    function compactRadioGroups() {
        qa("#contractForm input[type='radio'], #simpleDocumentForm input[type='radio']").forEach((radio) => {
            const label = radio.closest("label");
            if (label) label.classList.add("compact-radio-option");

            const fieldset = radio.closest("fieldset");
            if (fieldset) fieldset.classList.add("compact-choice-fieldset");
        });

        qa("#contractForm input[type='checkbox'], #simpleDocumentForm input[type='checkbox']").forEach((checkbox) => {
            const label = checkbox.closest("label");
            if (label) label.classList.add("compact-radio-option");

            const fieldset = checkbox.closest("fieldset");
            if (fieldset) fieldset.classList.add("compact-choice-fieldset");
        });
    }

    function polishProfileStats() {
        const profile = q("#profileSection");
        if (!profile) return;

        q("#profileThemePanel")?.remove();
        q(".profile-statistics")?.classList.add("profile-statistics-polished");
        qa("#profileSection .dashboard-stat-card").forEach((card) => {
            card.classList.add("profile-stat-card-polished");
        });
    }

    let scheduled = false;
    function scheduleLightFix() {
        if (scheduled) return;
        scheduled = true;

        window.setTimeout(() => {
            scheduled = false;
            compactAdminUsers();
            removeLiquidGlassProfile();
            compactRadioGroups();
            polishProfileStats();
        }, 120);
    }

    document.addEventListener("click", (event) => {
        const supportButton = event.target.closest("#supportChatButton, #blockedSupportButton");
        if (supportButton) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            openSupport();
            return;
        }

        const supportClose = event.target.closest("#supportChatCloseButton");
        if (supportClose) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            closeSupport();
            return;
        }

        const supportModal = q("#supportChatModal");
        if (supportModal && event.target === supportModal) {
            event.preventDefault();
            closeSupport();
            return;
        }

        const cat = event.target.closest("[data-document-category-shortcut]");
        if (cat) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            openCategory(cat.dataset.documentCategoryShortcut || "all");
            return;
        }

        const search = event.target.closest("[data-document-search-shortcut]");
        if (search) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            applySearchShortcut(search.dataset.documentSearchShortcut || search.textContent || "");
            return;
        }

        if (
            event.target.closest("[data-home-nav='profile'], [data-home-nav='documents'], #adminSidebarButton, [data-mega-document-type]")
        ) {
            scheduleLightFix();
        }
    }, true);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !q("#supportChatModal")?.classList.contains("is-hidden")) {
            closeSupport();
        }
    });

    function init() {
        compactAdminUsers();
        removeLiquidGlassProfile();
        compactRadioGroups();
        polishProfileStats();
        icons();

        window.setTimeout(scheduleLightFix, 400);
        window.setTimeout(scheduleLightFix, 1000);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    window.DocSpaceHardFix = {
        openSupport,
        closeSupport,
        openCategory,
        applyDocumentFilter,
        scheduleLightFix,
    };
})();


/* =========================================================
   DOCUMENT FILTER FIX — documentos, filtros e favoritos removidos
   ========================================================= */
(function () {
    if (window.__docspaceDocumentFilterFix20260703) return;
    window.__docspaceDocumentFilterFix20260703 = true;

    const q = (s, r = document) => r.querySelector(s);
    const qa = (s, r = document) => Array.from(r.querySelectorAll(s));

    function normalize(text) {
        return String(text || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    function removeFavoriteButtons() {
        qa(
            ".category-favorite-button, .document-favorite-button, [data-category-favorite], [data-document-favorite], .favorite-document-button, .favorite-button"
        ).forEach((button) => button.remove());

        // Remove wrappers/células vazias criadas só para favorito.
        qa(".document-card-wrapper").forEach((wrapper) => {
            const card = wrapper.querySelector(".document-card");
            if (card) {
                wrapper.classList.add("no-favorite");
            }
        });
    }

    function removeToolFilterAndCards() {
        qa('[data-document-filter="tools"]').forEach((button) => button.remove());

        qa(".document-card[data-document-category]").forEach((card) => {
            const categories = String(card.dataset.documentCategory || "").split(/\s+/);
            const type = String(card.dataset.documentType || "");
            const text = normalize(card.textContent);

            const isTool =
                categories.includes("tools") ||
                type === "pdf-local" ||
                text.includes("ferramentas pdf") ||
                text.includes("comprimir pdf") ||
                text.includes("juntar pdf");

            if (isTool) {
                const wrapper = card.closest(".document-card-wrapper") || card;
                wrapper.remove();
            }
        });
    }

    function cardMatchesFilter(card, filter) {
        const safeFilter = filter || "all";
        const type = String(card.dataset.documentType || "");
        const categories = String(card.dataset.documentCategory || "").split(/\s+/);
        const text = normalize(card.textContent);

        if (safeFilter === "all") {
            return true;
        }

        if (safeFilter === "contracts") {
            return categories.includes("contracts") || text.includes("contrato") || type.startsWith("contrato-") || type === "comodato";
        }

        if (safeFilter === "declarations") {
            return (
                categories.includes("declarations") ||
                categories.includes("caf") ||
                text.includes("declaracao") ||
                text.includes("autodeclaracao") ||
                type.includes("declaracao") ||
                type.includes("autodeclaracao") ||
                type === "posse" ||
                type === "ufba-membros" ||
                type === "renda-membros"
            );
        }

        if (safeFilter === "powers") {
            return categories.includes("powers") || text.includes("procuracao") || type.includes("procuracao");
        }

        return categories.includes(safeFilter);
    }

    function applyDocumentFilter(filter) {
        const safeFilter = filter || "all";
        const searchInput = q("#documentSearch");
        const search = normalize(searchInput ? searchInput.value : "");

        qa(".document-filter").forEach((button) => {
            const active = button.dataset.documentFilter === safeFilter;
            button.classList.toggle("is-active", active);
            button.setAttribute("aria-selected", String(active));
        });

        let totalVisible = 0;

        qa(".document-card[data-document-type]").forEach((card) => {
            const wrapper = card.closest(".document-card-wrapper") || card;
            const text = normalize(card.textContent);
            const isTool =
                String(card.dataset.documentCategory || "").split(/\s+/).includes("tools") ||
                String(card.dataset.documentType || "") === "pdf-local";

            const ok =
                !isTool &&
                cardMatchesFilter(card, safeFilter) &&
                (!search || text.includes(search)) &&
                !card.classList.contains("is-hidden");

            wrapper.classList.toggle("is-filtered-out", !ok);

            if (ok) totalVisible += 1;
        });

        q("#documentEmptyState")?.classList.toggle("is-hidden", totalVisible > 0);
    }

    function showDocumentsLibrary(filter) {
        try {
            if (window.DocSpaceInternalUI?.showHomeSection) {
                window.DocSpaceInternalUI.showHomeSection("documents");
            } else if (typeof window.mostrarTela === "function") {
                window.mostrarTela("documents");
            }
        } catch (_) {}

        qa("#documentView [data-home-section]").forEach((section) => {
            section.classList.toggle("is-hidden", section.dataset.homeSection !== "documents");
        });

        qa(".document-home-header [data-home-nav]").forEach((button) => {
            button.classList.toggle("is-active", button.dataset.homeNav === "documents");
        });

        window.setTimeout(() => {
            applyDocumentFilter(filter || "all");
            q("#documentCatalogSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
    }

    function initDocumentLibraryFix() {
        removeFavoriteButtons();
        removeToolFilterAndCards();
        applyDocumentFilter("all");
    }

    document.addEventListener("click", (event) => {
        const filterButton = event.target.closest(".document-filter[data-document-filter]");
        if (filterButton) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            const filter = filterButton.dataset.documentFilter || "all";
            applyDocumentFilter(filter);
            return;
        }

        const categoryShortcut = event.target.closest("[data-document-category-shortcut]");
        if (categoryShortcut) {
            const shortcut = categoryShortcut.dataset.documentCategoryShortcut || "all";
            const map = {
                rural: "declarations",
                inss: "declarations",
                declarations: "declarations",
                contracts: "contracts",
                powers: "powers",
                all: "all",
            };

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            showDocumentsLibrary(map[shortcut] || shortcut);
            return;
        }
    }, true);

    document.addEventListener("input", (event) => {
        if (event.target && event.target.id === "documentSearch") {
            const active = q(".document-filter.is-active");
            applyDocumentFilter(active?.dataset.documentFilter || "all");
        }
    }, true);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initDocumentLibraryFix);
    } else {
        initDocumentLibraryFix();
    }

    window.DocSpaceDocumentFilterFix = {
        applyDocumentFilter,
        showDocumentsLibrary,
        removeFavoriteButtons,
        removeToolFilterAndCards,
    };
})();


/* =========================================================
   DOCUMENTOS — REORGANIZAR GRADE E FILTROS SEM FAVORITOS
   ========================================================= */
(function () {
    if (window.__docspaceDocumentGridClean20260703) return;
    window.__docspaceDocumentGridClean20260703 = true;

    const q = (s, r = document) => r.querySelector(s);
    const qa = (s, r = document) => Array.from(r.querySelectorAll(s));

    function normalize(text) {
        return String(text || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    function getGrid() {
        return q("#documentCatalogSection .document-grid");
    }

    function cleanDocumentGrid() {
        const grid = getGrid();
        if (!grid) return;

        // Pega todos os cards reais, mesmo se estiverem dentro de wrappers antigos.
        const cards = qa(".document-card[data-document-type]", grid);

        // Remove completamente favoritos/estrelas antigos.
        qa(".document-favorite-button, .favorite-document-button, .favorite-button, [data-document-favorite], [data-category-favorite], .category-favorite-button", grid)
            .forEach((element) => element.remove());

        // Remove ferramentas da biblioteca de documentos.
        const cleanCards = cards.filter((card) => {
            const categories = String(card.dataset.documentCategory || "").split(/\s+/);
            const type = String(card.dataset.documentType || "");
            const text = normalize(card.textContent);
            const isTool =
                categories.includes("tools") ||
                type === "pdf-local" ||
                text.includes("ferramentas pdf") ||
                text.includes("juntar pdf") ||
                text.includes("comprimir pdf") ||
                text.includes("ocr");

            if (isTool) {
                const wrapper = card.closest(".document-card-wrapper");
                if (wrapper) wrapper.remove();
                else card.remove();
                return false;
            }

            card.classList.remove("is-filtered-out");
            card.removeAttribute("style");
            return true;
        });

        // Limpa a grade e reinsere somente cards. Isso remove buracos causados por wrappers/estrelas.
        grid.innerHTML = "";
        cleanCards.forEach((card) => grid.appendChild(card));

        if (window.lucide?.createIcons) {
            window.lucide.createIcons();
        }
    }

    function matchesFilter(card, filter) {
        const safe = filter || "all";
        const type = String(card.dataset.documentType || "");
        const categories = String(card.dataset.documentCategory || "").split(/\s+/);
        const text = normalize(card.textContent);

        if (safe === "all") return true;

        if (safe === "contracts") {
            return categories.includes("contracts") ||
                type === "comodato" ||
                type.startsWith("contrato-") ||
                text.includes("contrato");
        }

        if (safe === "declarations") {
            return categories.includes("declarations") ||
                categories.includes("caf") ||
                type.includes("declaracao") ||
                type.includes("autodeclaracao") ||
                type === "posse" ||
                type === "ufba-membros" ||
                type === "renda-membros" ||
                text.includes("declaracao") ||
                text.includes("autodeclaracao");
        }

        if (safe === "powers") {
            return categories.includes("powers") ||
                type.includes("procuracao") ||
                text.includes("procuracao");
        }

        return categories.includes(safe);
    }

    function applyFilter(filter) {
        const safe = filter || "all";
        const search = normalize(q("#documentSearch")?.value || "");
        let total = 0;

        qa("#documentCatalogSection .document-filter").forEach((button) => {
            const active = button.dataset.documentFilter === safe;
            button.classList.toggle("is-active", active);
            button.setAttribute("aria-selected", String(active));
        });

        qa("#documentCatalogSection .document-card[data-document-type]").forEach((card) => {
            const visible = matchesFilter(card, safe) && (!search || normalize(card.textContent).includes(search));
            card.classList.toggle("is-filtered-out", !visible);
            if (visible) total += 1;
        });

        q("#documentEmptyState")?.classList.toggle("is-hidden", total > 0);
    }

    function removeToolsFilter() {
        qa('#documentCatalogSection .document-filter[data-document-filter="tools"]').forEach((button) => button.remove());
    }

    function initDocumentsClean() {
        removeToolsFilter();
        cleanDocumentGrid();

        const active = q("#documentCatalogSection .document-filter.is-active");
        applyFilter(active?.dataset.documentFilter || "all");
    }

    document.addEventListener("click", (event) => {
        const filterButton = event.target.closest("#documentCatalogSection .document-filter[data-document-filter]");
        if (filterButton) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            cleanDocumentGrid();
            applyFilter(filterButton.dataset.documentFilter || "all");
            return;
        }

        const navDocs = event.target.closest('[data-home-nav="documents"]');
        if (navDocs) {
            window.setTimeout(initDocumentsClean, 80);
            window.setTimeout(initDocumentsClean, 250);
        }
    }, true);

    document.addEventListener("input", (event) => {
        if (event.target && event.target.id === "documentSearch") {
            const active = q("#documentCatalogSection .document-filter.is-active");
            applyFilter(active?.dataset.documentFilter || "all");
        }
    }, true);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initDocumentsClean);
    } else {
        initDocumentsClean();
    }

    window.DocSpaceDocumentGridClean = {
        initDocumentsClean,
        applyFilter,
        cleanDocumentGrid,
    };
})();


/* =========================================================
   WIZARD BOTÕES — CRIA CONTINUAR/VOLTAR QUANDO NÃO EXISTE
   ========================================================= */
(function () {
    if (window.__docspaceWizardButtonsFix20260703) return;
    window.__docspaceWizardButtonsFix20260703 = true;

    const q = (s, r = document) => r.querySelector(s);
    const qa = (s, r = document) => Array.from(r.querySelectorAll(s));

    function getSteps(form) {
        const grid = q(".grid", form);
        if (!grid) return [];

        const steps = [];
        let current = null;

        Array.from(grid.children).forEach((element) => {
            if (element.classList.contains("section-title")) {
                current = {
                    title: element.textContent.trim() || "Etapa",
                    elements: [element],
                };
                steps.push(current);
                return;
            }

            if (!current) {
                current = {
                    title: "Dados",
                    elements: [],
                };
                steps.push(current);
            }

            current.elements.push(element);
        });

        return steps;
    }

    function ensureNavigation(form) {
        if (!form) return;

        let nav = q(".wizard-navigation", form);
        if (nav) return;

        nav = document.createElement("div");
        nav.className = "wizard-navigation";
        nav.innerHTML = `
            <button type="button" data-wizard-prev>Voltar</button>
            <span data-wizard-message aria-live="polite"></span>
            <span data-wizard-position></span>
            <button type="button" data-wizard-next>Continuar</button>
        `;

        const actions = q(".actions", form);
        if (actions) {
            form.insertBefore(nav, actions);
        } else {
            form.appendChild(nav);
        }
    }

    function ensureWizardBar(form) {
        if (!form) return;

        let bar = q(".document-wizard", form);
        if (bar) return;

        const steps = getSteps(form);
        if (!steps.length) return;

        bar = document.createElement("div");
        bar.className = "document-wizard";
        bar.innerHTML = `
            <div class="document-wizard-header">
                <div>
                    <p class="eyebrow" data-wizard-eyebrow>Etapa 1 de ${steps.length}</p>
                    <h2 data-wizard-title>${steps[0].title}</h2>
                </div>
                <strong data-wizard-percent></strong>
            </div>
            <div class="document-wizard-progress">
                <span data-wizard-progress style="width:${Math.round(100 / steps.length)}%"></span>
            </div>
            <div class="document-wizard-steps">
                ${steps.map((step, index) => `
                    <button type="button" class="${index === 0 ? "is-active" : ""}" data-wizard-step="${index}">
                        <span>${index + 1}</span>
                        ${step.title}
                    </button>
                `).join("")}
            </div>
        `;

        form.insertBefore(bar, q(".grid", form));
    }

    function isVisibleInput(input) {
        return input && !input.disabled && input.type !== "hidden" && !input.closest(".wizard-step-hidden, .is-hidden, [hidden]");
    }

    function validateStep(form, stepIndex) {
        const steps = getSteps(form);
        const step = steps[stepIndex];
        if (!step) return true;

        const invalid = [];

        step.elements.forEach((el) => {
            qa("input, select, textarea", el).forEach((input) => {
                if (!input.required || !isVisibleInput(input)) return;

                let ok = true;
                if (input.type === "radio") {
                    ok = Boolean(form.querySelector(`input[name="${CSS.escape(input.name)}"]:checked`));
                } else {
                    ok = String(input.value || "").trim().length > 0;
                }

                input.classList.toggle("is-invalid", !ok);
                input.setAttribute("aria-invalid", String(!ok));

                if (!ok && !invalid.length) invalid.push(input);
            });
        });

        const msg = q("[data-wizard-message]", form);
        if (msg) msg.textContent = invalid.length ? "Preencha os campos obrigatórios desta etapa." : "";

        if (invalid.length) {
            invalid[0].focus();
            return false;
        }

        return true;
    }

    function showStep(form, targetIndex) {
        if (!form) return;

        ensureWizardBar(form);
        ensureNavigation(form);

        const steps = getSteps(form);
        if (!steps.length) return;

        const index = Math.max(0, Math.min(Number(targetIndex) || 0, steps.length - 1));
        const last = index === steps.length - 1;

        steps.forEach((step, stepIndex) => {
            step.elements.forEach((element) => {
                const hidden = stepIndex !== index;
                element.classList.toggle("wizard-step-hidden", hidden);
                element.setAttribute("aria-hidden", String(hidden));
            });
        });

        const nav = q(".wizard-navigation", form);
        const actions = q(".actions", form);

        if (nav) {
            nav.classList.toggle("is-hidden", last);
            const prev = q("[data-wizard-prev]", nav);
            const next = q("[data-wizard-next]", nav);
            const pos = q("[data-wizard-position]", nav);
            const msg = q("[data-wizard-message]", nav);

            if (prev) prev.disabled = index === 0;
            if (next) next.textContent = "Continuar";
            if (pos) pos.textContent = `${index + 1} / ${steps.length}`;
            if (msg) msg.textContent = "";
        }

        if (actions) {
            actions.classList.toggle("wizard-actions-hidden", !last);
        }

        const bar = q(".document-wizard", form);
        if (bar) {
            const eyebrow = q("[data-wizard-eyebrow]", bar);
            const title = q("[data-wizard-title]", bar);
            const progress = q("[data-wizard-progress]", bar);

            if (eyebrow) eyebrow.textContent = `Etapa ${index + 1} de ${steps.length}`;
            if (title) title.textContent = steps[index].title;
            if (progress) progress.style.width = `${Math.round(((index + 1) / steps.length) * 100)}%`;

            qa("[data-wizard-step]", bar).forEach((button, buttonIndex) => {
                button.classList.toggle("is-active", buttonIndex === index);
                button.classList.toggle("is-complete", buttonIndex < index);
            });
        }

        const pdfButton = form.id === "contractForm" ? q("#printPdfButton") : q("#simplePrintPdfButton");
        if (pdfButton) {
            pdfButton.style.display = last ? "inline-flex" : "none";
        }

        form.dataset.currentWizardStep = String(index);
    }

    function initForm(form) {
        if (!form) return;

        ensureWizardBar(form);
        ensureNavigation(form);
        showStep(form, Number(form.dataset.currentWizardStep || 0));
    }

    function initAll() {
        initForm(q("#contractForm"));
        initForm(q("#simpleDocumentForm"));
    }

    document.addEventListener("click", (event) => {
        const next = event.target.closest("[data-wizard-next]");
        if (next) {
            const form = next.closest("form");
            if (!form) return;

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            const current = Number(form.dataset.currentWizardStep || 0);
            if (!validateStep(form, current)) return;

            showStep(form, current + 1);
            form.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }

        const prev = event.target.closest("[data-wizard-prev]");
        if (prev) {
            const form = prev.closest("form");
            if (!form) return;

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            const current = Number(form.dataset.currentWizardStep || 0);
            showStep(form, current - 1);
            form.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }

        const step = event.target.closest("[data-wizard-step]");
        if (step) {
            const form = step.closest("form");
            if (!form) return;

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            const current = Number(form.dataset.currentWizardStep || 0);
            const target = Number(step.dataset.wizardStep || 0);

            if (target > current && !validateStep(form, current)) return;

            showStep(form, target);
            form.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }

        const docOpen = event.target.closest("[data-mega-document-type], .document-card[data-document-type], .document-open, #backToDocumentsFromGeneratorButton, #backToDocumentsFromSimpleButton");
        if (docOpen) {
            window.setTimeout(initAll, 150);
            window.setTimeout(initAll, 500);
            window.setTimeout(initAll, 1000);
        }
    }, true);

    document.addEventListener("reset", (event) => {
        const form = event.target.closest("#contractForm, #simpleDocumentForm");
        if (!form) return;
        window.setTimeout(() => showStep(form, 0), 50);
    }, true);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAll);
    } else {
        initAll();
    }

    window.DocSpaceWizardButtonsFix = {
        initAll,
        initForm,
        showStep,
    };
})();


/* =========================================================
   AJUSTE FINAL — ADMIN, PLANOS, RODAPÉ E WIZARD
   ========================================================= */
(function () {
    if (window.__docspaceFinalAdminPlanWizardFix20260704) return;
    window.__docspaceFinalAdminPlanWizardFix20260704 = true;

    const q = (s, r = document) => r.querySelector(s);
    const qa = (s, r = document) => Array.from(r.querySelectorAll(s));

    function call(name, args = []) {
        if (typeof window[name] === "function") {
            return window[name](...args);
        }
        return undefined;
    }

    function getUidFromAction(element) {
        return element?.dataset?.uid || element?.closest("[data-uid]")?.dataset?.uid || "";
    }

    async function api(path, options = {}) {
        if (typeof window.apiRequest === "function") {
            return window.apiRequest(path, options);
        }

        const token = localStorage.getItem("docspace_session_token") || localStorage.getItem("SESSION_TOKEN_KEY") || "";
        const response = await fetch(path, {
            method: options.method || "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.message || data.error || "Falha na comunicação com o servidor.");
        }
        return data;
    }

    function showAdminMessage(text, type = "") {
        if (typeof window.mostrarMensagemAdmin === "function") {
            window.mostrarMensagemAdmin(text, type);
            return;
        }

        const el = q("#adminAccessMessage");
        if (!el) return;
        el.textContent = text || "";
        el.className = `message ${type || ""}`.trim();
    }

    function closeOpenMenus(except) {
        qa(".admin-row-menu[open]").forEach((menu) => {
            if (menu !== except) menu.removeAttribute("open");
        });
    }

    async function runAdminAction(button) {
        const action = button.dataset.adminAction;
        const uid = getUidFromAction(button);

        if (!uid || !action) return false;

        if (action === "edit") {
            call("preencherFormularioAdminEdicao", [uid]);
            q("#adminAccessForm")?.scrollIntoView({ behavior: "smooth", block: "start" });
            return true;
        }

        if (action === "history") {
            const result = call("carregarHistoricoUsuarioAdmin", [uid]);
            if (result && typeof result.then === "function") await result;
            q("#adminHistoryPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
            return true;
        }

        if (["block", "unblock", "renewCurrent"].includes(action)) {
            const labels = {
                block: "bloquear este usuário",
                unblock: "liberar este usuário",
                renewCurrent: "renovar o plano deste usuário",
            };

            if (!window.confirm(`Confirmar ação: ${labels[action]}?`)) return true;

            button.disabled = true;

            try {
                await api(`/api/admin/users/${uid}/actions`, {
                    method: "POST",
                    body: { action },
                });

                showAdminMessage("Acesso atualizado com sucesso.", "success");

                const reload = call("carregarUsuariosAdmin");
                if (reload && typeof reload.then === "function") await reload;
            } catch (error) {
                console.error(error);
                showAdminMessage(error?.message || "Não foi possível executar a ação.", "error");
                button.disabled = false;
            }

            return true;
        }

        return false;
    }

    function wireAdminActions() {
        document.addEventListener("click", async (event) => {
            const summary = event.target.closest(".admin-row-menu > summary");
            if (summary) {
                const menu = summary.closest(".admin-row-menu");
                window.setTimeout(() => closeOpenMenus(menu), 0);
                return;
            }

            const button = event.target.closest("#adminUsersList [data-admin-action]");
            if (!button) return;

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            await runAdminAction(button);
        }, true);

        document.addEventListener("click", (event) => {
            if (!event.target.closest(".admin-row-menu")) {
                closeOpenMenus();
            }
        }, true);
    }

    function getEmailFromRow(row) {
        return row?.querySelector(".admin-user-identity small")?.textContent?.trim() || "";
    }

    function getNameFromRow(row) {
        return row?.querySelector(".admin-user-identity strong")?.textContent?.trim() || "Cliente";
    }

    function selectSupportByUser(row) {
        const email = getEmailFromRow(row);
        if (!email || email === "sem e-mail") return;

        const support = q("#adminSupportList");
        if (support) {
            support.dataset.selectedSupportEmail = email;
        }

        const run = async () => {
            try {
                if (typeof window.mostrarSecaoAdmin === "function") {
                    window.mostrarSecaoAdmin("support");
                }

                const load = call("carregarAtendimentosAdmin");
                if (load && typeof load.then === "function") await load;

                const panel = q(".admin-support-panel");
                panel?.scrollIntoView({ behavior: "smooth", block: "start" });
            } catch (error) {
                console.error(error);
                showAdminMessage(`Não foi possível abrir as mensagens de ${getNameFromRow(row)}.`, "error");
            }
        };

        run();
    }

    function wireAdminUserToSupport() {
        document.addEventListener("click", (event) => {
            if (event.target.closest("button, summary, details, a, input, select, textarea")) return;

            const identity = event.target.closest("#adminUsersList .admin-user-identity");
            if (!identity) return;

            const row = identity.closest(".admin-user-row");
            if (!row) return;

            event.preventDefault();
            selectSupportByUser(row);
        }, true);
    }

    function improveAdminSupportSelection() {
        document.addEventListener("click", (event) => {
            const open = event.target.closest("[data-support-open]");
            if (!open) return;

            const email = open.dataset.supportOpen;
            if (!email) return;

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            const support = q("#adminSupportList");
            if (support) {
                support.dataset.selectedSupportEmail = email;
            }

            call("selecionarConversaAtendimentoAdmin", [email]);
        }, true);
    }

    function makePlanModalsReliable() {
        document.addEventListener("click", (event) => {
            const renew = event.target.closest("#renewPlanButton");
            const change = event.target.closest("#changePlanButton");

            if (!renew && !change) return;

            window.setTimeout(() => {
                const modal = q("#paymentModal");
                if (modal && !modal.classList.contains("is-hidden")) {
                    modal.setAttribute("data-open", "true");
                    document.body.classList.add("modal-open");
                }
            }, 40);
        }, true);

        document.addEventListener("click", (event) => {
            const close = event.target.closest("#paymentCloseButton, #paymentCancelButton");
            if (!close) return;

            window.setTimeout(() => {
                const modal = q("#paymentModal");
                if (modal?.classList.contains("is-hidden")) {
                    modal.removeAttribute("data-open");
                    document.body.classList.remove("modal-open");
                }
            }, 80);
        }, true);
    }

    function addHomeFooter() {
        const home = q("#homeView");
        if (!home || q(".docspace-home-footer", home)) return;

        const footer = document.createElement("footer");
        footer.className = "docspace-home-footer";
        footer.innerHTML = `
            <div class="docspace-home-footer-inner">
                <span>DocSpace — Espaço de documentos</span>
                <span>Modelos, ferramentas e atendimento em um só painel.</span>
                <span>© ${new Date().getFullYear()} DocSpace</span>
            </div>
        `;

        home.appendChild(footer);
    }

    function fixWizardLook() {
        qa("#contractForm .document-wizard, #simpleDocumentForm .document-wizard").forEach((wizard) => {
            const steps = q(".document-wizard-steps", wizard);
            if (!steps) return;

            qa("button", steps).forEach((button, index) => {
                if (!button.dataset.wizardStep) button.dataset.wizardStep = String(index);
                let span = button.querySelector("span");
                if (!span) {
                    span = document.createElement("span");
                    span.textContent = String(index + 1);
                    button.prepend(span);
                }
            });
        });
    }

    function keepWizardStepOnCurrentInput() {
        document.addEventListener("input", (event) => {
            const form = event.target.closest("#contractForm, #simpleDocumentForm");
            if (!form) return;

            const current = Number(form.dataset.currentWizardStep || form.dataset.safeWizardStep || 0);
            if (current < 1) return;

            window.setTimeout(() => {
                try {
                    if (window.DocSpaceWizardButtonsFix?.showStep) {
                        window.DocSpaceWizardButtonsFix.showStep(form, current);
                    }
                } catch (_) {}
            }, 10);
        }, true);
    }

    function watchUiRenders() {
        const observer = new MutationObserver(() => {
            addHomeFooter();
            fixWizardLook();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function init() {
        wireAdminActions();
        wireAdminUserToSupport();
        improveAdminSupportSelection();
        makePlanModalsReliable();
        keepWizardStepOnCurrentInput();
        addHomeFooter();
        fixWizardLook();
        watchUiRenders();

        window.setTimeout(addHomeFooter, 300);
        window.setTimeout(fixWizardLook, 300);
        window.setTimeout(fixWizardLook, 900);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();


/* =========================================================
   DOCSPACE — WORD PELO TEMPLATE ORIGINAL SEM RECARREGAR
   ========================================================= */
(function () {
    if (window.__docspaceTemplateWordFix20260704) return;
    window.__docspaceTemplateWordFix20260704 = true;

    function msg(form, text, type) {
        const target = form?.id === "contractForm"
            ? document.getElementById("message")
            : document.getElementById("simpleDocumentMessage");

        if (!target) return;

        target.textContent = text || "";
        target.className = `message ${type || ""}`.trim();
    }

    function setLoading(button, loading) {
        if (!button) return;
        button.disabled = Boolean(loading);
        button.textContent = loading ? "Gerando Word..." : "Gerar Word";
    }

    function currentSimpleFileName(dados) {
        if (typeof obterNomeArquivoDocumentoSimples === "function") {
            return obterNomeArquivoDocumentoSimples(dados);
        }

        return "documento-preenchido.docx";
    }

    async function gerarWordContrato(button) {
        const form = document.getElementById("contractForm");
        if (!form) return;

        try {
            if (typeof usuarioAtualTemPlanoBasicoSemWord === "function" && usuarioAtualTemPlanoBasicoSemWord()) {
                msg(form, "No Plano Básico, use o botão Gerar PDF.", "");
                return;
            }

            if (typeof validarCamposObrigatorios === "function" && !validarCamposObrigatorios()) {
                msg(form, "Preencha os campos obrigatórios antes de gerar o Word.", "error");
                return;
            }

            setLoading(button, true);
            msg(form, "Gerando Word pelo modelo original...", "");

            if (typeof garantirBibliotecas === "function") {
                await garantirBibliotecas();
            }

            const dados = typeof coletarDadosDoFormulario === "function" ? coletarDadosDoFormulario() : {};
            const modelo = typeof obterCaminhoDoModelo === "function" ? obterCaminhoDoModelo() : "";

            if (!modelo || typeof gerarArquivoDocx !== "function") {
                throw new Error("Gerador Word ou modelo não encontrado.");
            }

            const arquivoFinal = await gerarArquivoDocx(dados, modelo);

            try {
                if (typeof registrarUsoDocumentoNoServidor === "function") {
                    await registrarUsoDocumentoNoServidor("comodato");
                }
                if (typeof registrarDocumentoGerado === "function") {
                    registrarDocumentoGerado("comodato");
                }
            } catch (error) {
                console.warn("Word gerado, mas o registro de uso falhou.", error);
            }

            if (typeof saveAs !== "function") {
                throw new Error("Biblioteca de download não carregada.");
            }

            saveAs(arquivoFinal, "contrato-comodato-preenchido.docx");
            msg(form, "Word gerado com sucesso. O download foi iniciado.", "success");
        } catch (error) {
            console.error(error);
            msg(form, error?.message || "Não foi possível gerar o Word.", "error");
        } finally {
            setLoading(button, false);
        }
    }

    async function gerarWordDocumentoSimples(button) {
        const form = document.getElementById("simpleDocumentForm");
        if (!form) return;

        try {
            if (typeof usuarioAtualTemPlanoBasicoSemWord === "function" && usuarioAtualTemPlanoBasicoSemWord()) {
                msg(form, "No Plano Básico, use o botão Gerar PDF.", "");
                return;
            }

            if (typeof validarDocumentoSimples === "function" && !validarDocumentoSimples()) {
                msg(form, "Preencha os campos obrigatórios antes de gerar o Word.", "error");
                return;
            }

            setLoading(button, true);
            msg(form, "Gerando Word pelo modelo original...", "");

            if (typeof garantirBibliotecas === "function") {
                await garantirBibliotecas();
            }

            const dados = typeof coletarDadosDocumentoSimples === "function" ? coletarDadosDocumentoSimples() : {};
            const modelo = typeof obterCaminhoModeloDocumentoSimples === "function"
                ? obterCaminhoModeloDocumentoSimples(dados)
                : "";
            const tipo = button?.dataset?.documentType || window.documentoSimplesTipoAtual || "";
            const nomeArquivo = currentSimpleFileName(dados);

            if (!modelo || typeof gerarArquivoDocx !== "function") {
                throw new Error("Gerador Word ou modelo não encontrado.");
            }

            const arquivoFinal = await gerarArquivoDocx(dados, modelo);

            try {
                if (tipo && typeof registrarUsoDocumentoNoServidor === "function") {
                    await registrarUsoDocumentoNoServidor(tipo);
                }
                if (tipo && typeof registrarDocumentoGerado === "function") {
                    registrarDocumentoGerado(tipo);
                }
            } catch (error) {
                console.warn("Word gerado, mas o registro de uso falhou.", error);
            }

            if (typeof saveAs !== "function") {
                throw new Error("Biblioteca de download não carregada.");
            }

            saveAs(arquivoFinal, nomeArquivo || "documento-preenchido.docx");
            msg(form, "Word gerado com sucesso. O download foi iniciado.", "success");
        } catch (error) {
            console.error(error);
            msg(form, error?.message || "Não foi possível gerar o Word.", "error");
        } finally {
            setLoading(button, false);
        }
    }

    document.addEventListener("click", (event) => {
        const button = event.target.closest("#generateButton, #simpleDocumentButton");
        if (!button) return;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        if (button.id === "generateButton") {
            gerarWordContrato(button);
        } else {
            gerarWordDocumentoSimples(button);
        }
    }, true);

    document.addEventListener("submit", (event) => {
        const form = event.target.closest("#contractForm, #simpleDocumentForm");
        if (!form) return;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        const button = form.id === "contractForm"
            ? document.getElementById("generateButton")
            : document.getElementById("simpleDocumentButton");

        if (form.id === "contractForm") {
            gerarWordContrato(button);
        } else {
            gerarWordDocumentoSimples(button);
        }
    }, true);

    window.DocSpaceTemplateWordFix = {
        gerarWordContrato,
        gerarWordDocumentoSimples,
    };
})();


/* =========================================================
   DOCSPACE v117 — LIMPEZA HOME E AVISO PRIVACIDADE
   ========================================================= */
(function () {
    if (window.__docspaceV117PrivacyHomeCleanup) return;
    window.__docspaceV117PrivacyHomeCleanup = true;

    function cleanHomeStatus() {
        const status = document.getElementById("accessStatusMessage");
        if (status) {
            status.textContent = "";
            status.classList.add("is-hidden");
            status.setAttribute("aria-hidden", "true");
            status.style.display = "none";
        }

        document.querySelectorAll("#documentPlanCard .home-user-line .home-verified-badge").forEach((badge) => {
            badge.remove();
        });
    }

    function fixPrivacyModal() {
        const modal = document.getElementById("privacyModal");
        const button = document.getElementById("privacyAcceptButton");

        if (!modal || !button) return;

        const close = () => {
            modal.classList.add("is-hidden");
            document.body.classList.remove("modal-open");
            try {
                localStorage.setItem("docspace_privacy_notice_accepted", "yes");
                localStorage.setItem("documentos_rurais_privacy_accepted", "yes");
            } catch (_) {}
        };

        button.addEventListener("click", close, true);

        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                event.preventDefault();
                close();
            }
        }, true);

        document.addEventListener("keydown", (event) => {
            if (event.key !== "Escape") return;
            if (modal.classList.contains("is-hidden")) return;
            event.preventDefault();
            close();
        }, true);
    }

    function init() {
        cleanHomeStatus();
        fixPrivacyModal();

        const observer = new MutationObserver(cleanHomeStatus);
        observer.observe(document.body, { childList: true, subtree: true });

        window.setTimeout(cleanHomeStatus, 300);
        window.setTimeout(cleanHomeStatus, 900);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
