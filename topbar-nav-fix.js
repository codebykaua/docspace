/* =========================================================
   DocSpace Topbar Nav Force Fix
   Garante funcionamento dos botões: Início, Categorias, Perfil, Admin e Sair.
   ========================================================= */
(function () {
    function all(selector, root) {
        return Array.from((root || document).querySelectorAll(selector));
    }

    function one(selector, root) {
        return (root || document).querySelector(selector);
    }

    function closeMegaMenus() {
        all(".docspace-mega-menu").forEach(function (menu) {
            menu.classList.add("is-hidden");
            menu.removeAttribute("data-open");
            menu.style.display = "none";
            menu.style.visibility = "hidden";
            menu.style.opacity = "0";
            menu.style.pointerEvents = "none";
        });

        all("[data-mega-target]").forEach(function (button) {
            button.classList.remove("is-open");
            button.setAttribute("aria-expanded", "false");
        });
    }

    function setActiveTopbar(targetName) {
        all(".document-home-header .app-shell-tab").forEach(function (button) {
            var isActive = button.dataset.homeNav === targetName;
            button.classList.toggle("is-active", isActive);

            if (button.dataset.homeNav) {
                button.setAttribute("aria-current", isActive ? "page" : "false");
            }
        });
    }

    function showSection(targetName) {
        var normalized = targetName || "home";

        all("[data-home-section]").forEach(function (section) {
            section.classList.toggle("is-hidden", section.dataset.homeSection !== normalized);
        });

        var documentView = one("#documentView");
        if (documentView) {
            documentView.classList.toggle("is-profile-page", normalized === "profile");
        }

        setActiveTopbar(normalized);

        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }
    }

    function goHomeNav(targetName) {
        closeMegaMenus();

        var normalized = targetName || "home";

        try {
            if (typeof window.navegarTelaInicialDocumentos === "function") {
                window.navegarTelaInicialDocumentos(normalized, { focusSearch: false });
                setActiveTopbar(normalized);
                return;
            }
        } catch (error) {
            console.warn("Navegação original falhou. Usando fallback:", error);
        }

        showSection(normalized);
    }

    function openAdmin() {
        closeMegaMenus();

        try {
            if (typeof window.mostrarTela === "function") {
                window.mostrarTela("admin");
                return;
            }
        } catch (error) {
            console.warn("Abertura original do admin falhou. Usando fallback:", error);
        }

        all(".view").forEach(function (view) {
            view.classList.add("is-hidden");
        });

        var adminView = one("#adminView");
        if (adminView) {
            adminView.classList.remove("is-hidden");
        }

        document.body.classList.remove("document-home-open", "auth-open", "document-generator-open", "pdf-tools-open");
        document.body.classList.add("admin-access-open");

        if (window.lucide && typeof window.lucide.createIcons === "function") {
            window.lucide.createIcons();
        }
    }

    function logout() {
        closeMegaMenus();

        try {
            if (typeof window.apiRequest === "function") {
                window.apiRequest("/auth/logout", { method: "POST" }).catch(function () {});
            }
        } catch (_) {}

        try {
            localStorage.removeItem("documentos_rurais_session_token");
            localStorage.removeItem("documentos_rurais_billing_token");
        } catch (_) {}

        if (typeof window.mostrarTela === "function") {
            try {
                window.mostrarTela("auth");
                return;
            } catch (_) {}
        }

        all(".view").forEach(function (view) {
            view.classList.add("is-hidden");
        });

        var authView = one("#authView");
        if (authView) {
            authView.classList.remove("is-hidden");
        }

        document.body.classList.add("auth-open");
        document.body.classList.remove("document-home-open", "document-generator-open", "pdf-tools-open", "admin-access-open");
    }

    function bind() {
        document.addEventListener("click", function (event) {
            var adminButton = event.target.closest("#adminSidebarButton");
            if (adminButton) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                openAdmin();
                return;
            }

            var logoutButton = event.target.closest("[data-logout-button]");
            if (logoutButton) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                logout();
                return;
            }

            var navButton = event.target.closest(".document-home-header [data-home-nav]");
            if (navButton && !navButton.matches("[data-mega-target]")) {
                var target = navButton.dataset.homeNav;

                if (target) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    goHomeNav(target);
                }
            }
        }, true);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bind);
    } else {
        bind();
    }

    window.DocSpaceTopbarNavForceFix = {
        go: goHomeNav,
        admin: openAdmin,
        logout: logout
    };
})();
