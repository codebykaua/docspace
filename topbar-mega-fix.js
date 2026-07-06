/* =========================================================
   DocSpace Topbar Mega Menu Force Fix
   Garante abertura de Ferramentas e Documentos mesmo se JS antigo interferir.
   ========================================================= */
(function () {
    function all(selector, root) {
        return Array.from((root || document).querySelectorAll(selector));
    }

    function one(selector, root) {
        return (root || document).querySelector(selector);
    }

    function getMenus() {
        return all(".docspace-mega-menu");
    }

    function getTriggers() {
        return all("[data-mega-target]");
    }

    function closeAllMegaMenus(exceptId) {
        getMenus().forEach(function (menu) {
            if (exceptId && menu.id === exceptId) {
                return;
            }

            menu.classList.add("is-hidden");
            menu.removeAttribute("data-open");
            menu.style.display = "none";
            menu.style.visibility = "hidden";
            menu.style.opacity = "0";
            menu.style.pointerEvents = "none";
        });

        getTriggers().forEach(function (trigger) {
            if (exceptId && trigger.dataset.megaTarget === exceptId) {
                return;
            }

            trigger.classList.remove("is-open");
            trigger.setAttribute("aria-expanded", "false");
        });
    }

    function openMegaMenu(targetId, trigger) {
        var menu = document.getElementById(targetId);

        if (!menu) {
            return;
        }

        closeAllMegaMenus(targetId);

        menu.classList.remove("is-hidden");
        menu.setAttribute("data-open", "true");
        menu.style.display = "block";
        menu.style.visibility = "visible";
        menu.style.opacity = "1";
        menu.style.pointerEvents = "auto";

        if (trigger) {
            trigger.classList.add("is-open");
            trigger.setAttribute("aria-expanded", "true");
        }

        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }
    }

    function toggleMegaMenu(targetId, trigger) {
        var menu = document.getElementById(targetId);

        if (!menu) {
            return;
        }

        var isOpen = menu.getAttribute("data-open") === "true" || !menu.classList.contains("is-hidden");

        if (isOpen) {
            closeAllMegaMenus();
            return;
        }

        openMegaMenu(targetId, trigger);
    }

    function bindTriggers() {
        getTriggers().forEach(function (trigger) {
            if (trigger.dataset.forceMegaBound === "true") {
                return;
            }

            trigger.dataset.forceMegaBound = "true";
            trigger.type = "button";
            trigger.style.pointerEvents = "auto";

            trigger.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                var targetId = trigger.dataset.megaTarget;

                window.setTimeout(function () {
                    toggleMegaMenu(targetId, trigger);
                }, 0);
            }, true);
        });
    }

    function bindMenuActions() {
        all("[data-mega-pdf-operation]").forEach(function (button) {
            if (button.dataset.forceMegaActionBound === "true") {
                return;
            }

            button.dataset.forceMegaActionBound = "true";

            button.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();

                var operation = button.dataset.megaPdfOperation || "merge";
                closeAllMegaMenus();

                var pdfCard = one("#pdfLocalCard");
                if (pdfCard) {
                    pdfCard.click();
                } else if (typeof window.mostrarTela === "function") {
                    window.mostrarTela("pdfLocal");
                }

                window.setTimeout(function () {
                    var tool = one('[data-pdf-local-operation="' + operation + '"]');

                    if (tool) {
                        tool.click();
                    } else if (typeof window.selecionarFerramentaPdfLocal === "function") {
                        window.selecionarFerramentaPdfLocal(operation, { abrirPainel: true });
                    }
                }, 180);
            }, true);
        });

        all("[data-mega-document-type]").forEach(function (button) {
            if (button.dataset.forceMegaDocBound === "true") {
                return;
            }

            button.dataset.forceMegaDocBound = "true";

            button.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();

                var type = button.dataset.megaDocumentType;
                closeAllMegaMenus();

                if (typeof window.navegarTelaInicialDocumentos === "function") {
                    window.navegarTelaInicialDocumentos("documents", { focusSearch: false });
                }

                window.setTimeout(function () {
                    var card = one('.document-card[data-document-type="' + type + '"]');

                    if (card) {
                        card.click();
                    }
                }, 180);
            }, true);
        });

        all(".mega-open-all-documents").forEach(function (button) {
            if (button.dataset.forceMegaAllDocsBound === "true") {
                return;
            }

            button.dataset.forceMegaAllDocsBound = "true";

            button.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                closeAllMegaMenus();

                if (typeof window.navegarTelaInicialDocumentos === "function") {
                    window.navegarTelaInicialDocumentos("documents", { focusSearch: false });
                }
            }, true);
        });
    }

    function bindOutsideClose() {
        if (window.__docspaceMegaOutsideCloseBound) {
            return;
        }

        window.__docspaceMegaOutsideCloseBound = true;

        document.addEventListener("click", function (event) {
            if (!event.target.closest(".docspace-mega-menu") && !event.target.closest("[data-mega-target]")) {
                closeAllMegaMenus();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeAllMegaMenus();
            }
        });
    }

    function init() {
        bindTriggers();
        bindMenuActions();
        bindOutsideClose();
        closeAllMegaMenus();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    window.DocSpaceMegaMenuForceFix = {
        init: init,
        open: openMegaMenu,
        close: closeAllMegaMenus
    };
})();
