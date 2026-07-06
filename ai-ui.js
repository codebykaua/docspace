(function () {
    "use strict";

    const SESSION_TOKEN_KEY = "documentos_rurais_session_token";
    const MAX_MESSAGE_LENGTH = 12000;
    const state = {
        open: false,
        currentConversationId: "",
        conversations: [],
        abortController: null,
        lastExternalEditable: null,
        lastUserMessage: "",
        lastMode: "chat",
        usage: null,
        firstName: "",
    };

    const quickPrompts = [
        { mode: "create", icon: "file-plus-2", title: "Criar documento", text: "Crie um modelo de documento com campos editaveis para preencher depois." },
        { mode: "review", icon: "spell-check-2", title: "Revisar texto", text: "Revise ortografia, clareza e pontuacao deste texto." },
        { mode: "formalize", icon: "briefcase-business", title: "Formalizar", text: "Transforme este texto em uma versao formal e profissional." },
        { mode: "summarize", icon: "list-checks", title: "Resumir", text: "Resuma este documento de forma objetiva." },
        { mode: "clause", icon: "scale", title: "Melhorar clausula", text: "Melhore a clareza desta clausula sem inventar informacoes." },
        { mode: "explain", icon: "circle-help", title: "Explicar", text: "Explique este documento em linguagem simples." },
    ];

    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback, { once: true });
            return;
        }

        callback();
    }

    ready(init);

    function init() {
        injectButtons();
        injectPanel();
        bindEvents();
        createIcons();
    }

    function injectButtons() {
        const sidebarNav = document.querySelector(".dashboard-sidebar-nav");

        if (sidebarNav && !document.getElementById("aiSidebarButton")) {
            const button = document.createElement("button");
            button.type = "button";
            button.id = "aiSidebarButton";
            button.className = "dashboard-sidebar-item docspace-ai-nav-button";
            button.setAttribute("aria-label", "Abrir DocSpace IA");
            button.innerHTML = '<i data-lucide="sparkles" aria-hidden="true"></i><span>DocSpace IA</span>';
            const adminButton = document.getElementById("adminSidebarButton");
            sidebarNav.insertBefore(button, adminButton || sidebarNav.lastElementChild);
        }

        if (!document.getElementById("aiFloatingButton")) {
            const floating = document.createElement("button");
            floating.type = "button";
            floating.id = "aiFloatingButton";
            floating.className = "ai-floating-button";
            floating.setAttribute("aria-label", "Abrir DocSpace IA");
            floating.title = "DocSpace IA";
            floating.innerHTML = '<i data-lucide="sparkles" aria-hidden="true"></i><span>IA</span>';
            document.body.appendChild(floating);
        }

    }

    function injectPanel() {
        if (document.getElementById("docspaceAiOverlay")) {
            return;
        }

        const overlay = document.createElement("div");
        overlay.id = "docspaceAiOverlay";
        overlay.className = "ai-assistant-overlay is-hidden";
        overlay.innerHTML = `
            <section id="docspaceAiPanel" class="ai-assistant-panel" role="dialog" aria-modal="true" aria-labelledby="docspaceAiTitle" aria-describedby="docspaceAiSubtitle">
                <header class="ai-assistant-topbar">
                    <div class="ai-assistant-title-block">
                        <span class="ai-assistant-mark"><i data-lucide="sparkles" aria-hidden="true"></i></span>
                        <div>
                            <p class="eyebrow">Assistente inteligente</p>
                            <h2 id="docspaceAiTitle">DocSpace IA</h2>
                            <p id="docspaceAiSubtitle">Crie, revise, resuma e organize documentos com seguranca.</p>
                        </div>
                    </div>
                    <div class="ai-assistant-top-actions">
                        <button type="button" id="aiHistoryButton" class="secondary-button ai-icon-text"><i data-lucide="history" aria-hidden="true"></i><span>Historico</span></button>
                        <button type="button" id="aiNewConversationButton" class="secondary-button ai-icon-text"><i data-lucide="plus" aria-hidden="true"></i><span>Nova</span></button>
                        <button type="button" id="aiAssistantCloseButton" class="icon-button" aria-label="Fechar DocSpace IA"><i data-lucide="x" aria-hidden="true"></i></button>
                    </div>
                </header>

                <div class="ai-assistant-body">
                    <aside id="aiHistoryView" class="ai-history-view" aria-label="Historico de conversas">
                        <div class="ai-history-heading">
                            <strong>Conversas</strong>
                            <small id="aiHistoryStatus">Carregando...</small>
                        </div>
                        <div id="aiHistoryList" class="ai-history-list"></div>
                    </aside>

                    <main class="ai-chat-shell">
                        <div class="ai-usage-strip">
                            <span id="aiAssistantStatus">Pronto para ajudar.</span>
                            <strong id="aiUsageLabel">Uso: --</strong>
                        </div>

                        <div id="aiQuickPrompts" class="ai-quick-prompts" aria-label="Atalhos do DocSpace IA"></div>

                        <div id="aiMessages" class="ai-messages" aria-live="polite"></div>

                        <div id="aiTypingIndicator" class="ai-typing-indicator is-hidden" role="status">
                            <span></span><span></span><span></span>
                            <strong>DocSpace IA esta respondendo...</strong>
                        </div>

                        <form id="aiComposerForm" class="ai-composer" novalidate>
                            <label for="aiMessageInput" class="sr-only">Mensagem para o DocSpace IA</label>
                            <textarea id="aiMessageInput" rows="3" maxlength="${MAX_MESSAGE_LENGTH}" placeholder="Digite o que voce precisa: criar contrato, revisar texto, resumir documento..."></textarea>
                            <div class="ai-composer-footer">
                                <span id="aiCharacterCounter">0/${MAX_MESSAGE_LENGTH}</span>
                                <div class="ai-composer-actions">
                                    <button type="button" id="aiStopButton" class="secondary-button is-hidden"><i data-lucide="octagon-x" aria-hidden="true"></i><span>Parar</span></button>
                                    <button type="submit" id="aiSendButton"><i data-lucide="send" aria-hidden="true"></i><span>Enviar</span></button>
                                </div>
                            </div>
                        </form>
                    </main>
                </div>
            </section>
        `;
        document.body.appendChild(overlay);

        const quickContainer = overlay.querySelector("#aiQuickPrompts");
        quickPrompts.forEach((prompt) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "ai-quick-prompt";
            button.dataset.aiMode = prompt.mode;
            button.dataset.aiPrompt = prompt.text;
            button.innerHTML = `<i data-lucide="${prompt.icon}" aria-hidden="true"></i><span>${escapeHtml(prompt.title)}</span>`;
            quickContainer.appendChild(button);
        });
    }

    function bindEvents() {
        document.addEventListener("focusin", (event) => {
            const target = event.target;

            if (!target || document.getElementById("docspaceAiPanel")?.contains(target)) {
                return;
            }

            if (isEditable(target)) {
                state.lastExternalEditable = target;
            }
        });

        document.addEventListener("click", (event) => {
            const openButton = event.target.closest("#aiSidebarButton, #aiAssistantButton, #aiFloatingButton");

            if (openButton) {
                event.preventDefault();
                openPanel();
                return;
            }
        });

        const overlay = document.getElementById("docspaceAiOverlay");
        const closeButton = document.getElementById("aiAssistantCloseButton");
        const form = document.getElementById("aiComposerForm");
        const textarea = document.getElementById("aiMessageInput");
        const stopButton = document.getElementById("aiStopButton");
        const newButton = document.getElementById("aiNewConversationButton");
        const historyButton = document.getElementById("aiHistoryButton");

        overlay?.addEventListener("click", (event) => {
            if (event.target === overlay) {
                closePanel();
            }
        });
        closeButton?.addEventListener("click", closePanel);
        newButton?.addEventListener("click", startNewConversation);
        historyButton?.addEventListener("click", () => {
            overlay?.classList.toggle("ai-history-open");
        });
        stopButton?.addEventListener("click", abortRequest);

        textarea?.addEventListener("input", () => {
            updateCounter();
            autoGrow(textarea);
        });
        textarea?.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                form?.requestSubmit();
            }
        });
        form?.addEventListener("submit", (event) => {
            event.preventDefault();
            sendMessage();
        });

        document.getElementById("aiQuickPrompts")?.addEventListener("click", (event) => {
            const button = event.target.closest("[data-ai-prompt]");

            if (!button) {
                return;
            }

            const input = document.getElementById("aiMessageInput");
            input.value = button.dataset.aiPrompt || "";
            input.dataset.mode = button.dataset.aiMode || "chat";
            input.focus();
            updateCounter();
            autoGrow(input);
        });

        document.getElementById("aiMessages")?.addEventListener("click", async (event) => {
            const copyButton = event.target.closest("[data-ai-copy]");
            const retryButton = event.target.closest("[data-ai-retry]");
            const useButton = event.target.closest("[data-ai-use]");

            if (copyButton) {
                await copyText(copyButton.dataset.aiCopy || "");
                setStatus("Texto copiado.");
                return;
            }

            if (retryButton && state.lastUserMessage) {
                document.getElementById("aiMessageInput").value = state.lastUserMessage;
                document.getElementById("aiMessageInput").dataset.mode = state.lastMode || "chat";
                updateCounter();
                sendMessage();
                return;
            }

            if (useButton) {
                useTextInDocument(useButton.dataset.aiUse || "");
            }
        });

        document.getElementById("aiHistoryList")?.addEventListener("click", async (event) => {
            const openButton = event.target.closest("[data-ai-conversation]");
            const deleteButton = event.target.closest("[data-ai-delete-conversation]");

            if (deleteButton) {
                event.stopPropagation();
                await deleteConversation(deleteButton.dataset.aiDeleteConversation || "");
                return;
            }

            if (openButton) {
                await openConversation(openButton.dataset.aiConversation || "");
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && state.open) {
                closePanel();
            }
        });
    }

    async function openPanel() {
        const overlay = document.getElementById("docspaceAiOverlay");
        overlay?.classList.remove("is-hidden");
        document.body.classList.add("ai-assistant-open");
        state.open = true;
        document.querySelectorAll(".dashboard-sidebar-item").forEach((item) => item.classList.remove("is-active"));
        document.getElementById("aiSidebarButton")?.classList.add("is-active");
        document.getElementById("aiMessageInput")?.focus({ preventScroll: true });
        await Promise.allSettled([loadUsage(), loadConversations()]);

        if (!document.getElementById("aiMessages")?.childElementCount) {
            renderWelcome();
        }

        createIcons();
    }

    function closePanel() {
        document.getElementById("docspaceAiOverlay")?.classList.add("is-hidden");
        document.body.classList.remove("ai-assistant-open");
        state.open = false;
    }

    function startNewConversation() {
        state.currentConversationId = "";
        const messages = document.getElementById("aiMessages");
        if (messages) {
            messages.textContent = "";
        }
        renderWelcome();
        setStatus("Nova conversa iniciada.");
        document.getElementById("aiMessageInput")?.focus();
    }

    function renderWelcome() {
        const name = state.firstName ? `, ${state.firstName}` : "";
        appendMessage({
            role: "assistant",
            content: `Ola${name}. Sou o DocSpace IA. Posso criar modelos, revisar textos, resumir documentos e melhorar clausulas sem inventar dados ausentes.`,
            mode: "chat",
            transient: true,
        });
    }

    async function sendMessage() {
        const input = document.getElementById("aiMessageInput");
        const text = (input?.value || "").trim();
        const mode = input?.dataset.mode || "chat";

        if (!text) {
            setStatus("Digite uma mensagem primeiro.");
            input?.focus();
            return;
        }

        if (state.abortController) {
            return;
        }

        state.lastUserMessage = text;
        state.lastMode = mode;
        input.value = "";
        input.dataset.mode = "chat";
        updateCounter();
        autoGrow(input);
        appendMessage({ role: "user", content: text, mode });
        setLoading(true);
        setStatus("Enviando para o Worker...");

        const controller = new AbortController();
        state.abortController = controller;

        try {
            const data = await apiFetch("/api/ai/chat", {
                method: "POST",
                body: {
                    conversationId: state.currentConversationId || undefined,
                    mode,
                    message: text,
                },
                signal: controller.signal,
            });

            state.currentConversationId = data.conversationId || state.currentConversationId;
            state.usage = data.usage || state.usage;
            updateUsage();
            appendMessage(data.message || { role: "assistant", content: "Resposta recebida.", mode });
            setStatus("Resposta pronta.");
            await loadConversations();
        } catch (error) {
            if (error.name === "AbortError") {
                appendMessage({ role: "system", content: "Solicitacao interrompida.", mode: "chat", transient: true });
                setStatus("Solicitacao interrompida.");
            } else {
                appendMessage({ role: "error", content: getFriendlyAiError(error), mode: "chat", transient: true });
                setStatus("Falha ao responder.");
            }
        } finally {
            state.abortController = null;
            setLoading(false);
            createIcons();
        }
    }

    async function loadUsage() {
        try {
            const data = await apiFetch("/api/ai/usage");
            state.usage = data.usage || null;
            state.firstName = data.firstName || "";
            updateUsage();
        } catch (error) {
            setStatus(error.message || "Nao foi possivel carregar o uso de IA.");
        }
    }

    async function loadConversations() {
        const status = document.getElementById("aiHistoryStatus");
        if (status) {
            status.textContent = "Carregando...";
        }

        try {
            const data = await apiFetch("/api/ai/conversations");
            state.conversations = Array.isArray(data.conversations) ? data.conversations : [];
            renderConversations();
            if (status) {
                status.textContent = `${state.conversations.length} conversa(s)`;
            }
        } catch (error) {
            if (status) {
                status.textContent = "Erro ao carregar";
            }
        }
    }

    async function openConversation(id) {
        if (!id) {
            return;
        }

        setStatus("Abrindo conversa...");
        const data = await apiFetch(`/api/ai/conversations/${encodeURIComponent(id)}/messages`);
        state.currentConversationId = id;
        const messages = document.getElementById("aiMessages");
        messages.textContent = "";
        (data.messages || []).forEach(appendMessage);
        document.getElementById("docspaceAiOverlay")?.classList.remove("ai-history-open");
        setStatus("Conversa aberta.");
        createIcons();
    }

    async function deleteConversation(id) {
        if (!id) {
            return;
        }

        if (!window.confirm("Remover esta conversa do historico?")) {
            return;
        }

        await apiFetch(`/api/ai/conversations/${encodeURIComponent(id)}`, { method: "DELETE" });

        if (state.currentConversationId === id) {
            startNewConversation();
        }

        await loadConversations();
    }

    function renderConversations() {
        const list = document.getElementById("aiHistoryList");
        if (!list) {
            return;
        }

        list.textContent = "";

        if (!state.conversations.length) {
            const empty = document.createElement("p");
            empty.className = "ai-empty-state";
            empty.textContent = "Nenhuma conversa ainda.";
            list.appendChild(empty);
            return;
        }

        state.conversations.forEach((conversation) => {
            const item = document.createElement("button");
            item.type = "button";
            item.className = `ai-history-item${conversation.id === state.currentConversationId ? " is-active" : ""}`;
            item.dataset.aiConversation = conversation.id;
            item.innerHTML = `
                <i data-lucide="message-square-text" aria-hidden="true"></i>
                <span>
                    <strong>${escapeHtml(conversation.title || "Conversa")}</strong>
                    <small>${formatDate(conversation.updatedAt)}</small>
                </span>
                <em data-ai-delete-conversation="${escapeHtml(conversation.id)}" role="button" tabindex="0" aria-label="Excluir conversa">
                    <i data-lucide="trash-2" aria-hidden="true"></i>
                </em>
            `;
            list.appendChild(item);
        });
    }

    function getFriendlyAiError(error) {
        const message = String(error?.message || "").trim();

        if (error?.status === 404 || /implanta/i.test(message) || /deployment/i.test(message)) {
            return "A IA esta conectada ao Worker, mas o deployment configurado no Azure/Foundry nao foi encontrado. Confira AZURE_OPENAI_DEPLOYMENT e a URL Responses no Cloudflare.";
        }

        if (error?.status === 503) {
            return "A IA ainda nao esta configurada no Cloudflare. Confira as variaveis AZURE_OPENAI_API_KEY, AZURE_OPENAI_RESPONSES_URL e AZURE_OPENAI_DEPLOYMENT.";
        }

        return message || "Nao foi possivel falar com a IA.";
    }

    function appendMessage(message) {
        const list = document.getElementById("aiMessages");
        if (!list) {
            return;
        }

        const role = message.role || "assistant";
        const bubble = document.createElement("article");
        bubble.className = `ai-message ai-message-${role}`;
        const content = String(message.content || "");
        const label = role === "user" ? "Voce" : role === "error" ? "Erro" : role === "system" ? "Sistema" : "DocSpace IA";
        bubble.innerHTML = `
            <div class="ai-message-avatar"><i data-lucide="${role === "user" ? "user-round" : role === "error" ? "triangle-alert" : "sparkles"}" aria-hidden="true"></i></div>
            <div class="ai-message-card">
                <header><strong>${label}</strong><small>${formatMode(message.mode)}</small></header>
                <div class="ai-message-text"></div>
                ${role === "assistant" && !message.transient ? `
                    <footer>
                        <button type="button" class="secondary-button" data-ai-copy="${escapeAttr(content)}"><i data-lucide="copy" aria-hidden="true"></i><span>Copiar</span></button>
                        <button type="button" class="secondary-button" data-ai-use="${escapeAttr(content)}"><i data-lucide="text-cursor-input" aria-hidden="true"></i><span>Usar</span></button>
                    </footer>
                ` : ""}
                ${role === "error" ? `
                    <footer>
                        <button type="button" class="secondary-button" data-ai-retry="true"><i data-lucide="refresh-cw" aria-hidden="true"></i><span>Tentar novamente</span></button>
                    </footer>
                ` : ""}
            </div>
        `;
        bubble.querySelector(".ai-message-text").textContent = content;
        list.appendChild(bubble);
        list.scrollTop = list.scrollHeight;
        createIcons();
    }

    function abortRequest() {
        state.abortController?.abort();
    }

    function setLoading(loading) {
        const sendButton = document.getElementById("aiSendButton");
        const stopButton = document.getElementById("aiStopButton");
        const typing = document.getElementById("aiTypingIndicator");

        if (sendButton) {
            sendButton.disabled = loading;
        }
        stopButton?.classList.toggle("is-hidden", !loading);
        typing?.classList.toggle("is-hidden", !loading);

        if (stopButton) {
            stopButton.hidden = !loading;
            stopButton.setAttribute("aria-hidden", String(!loading));
        }

        if (typing) {
            typing.hidden = !loading;
            typing.setAttribute("aria-hidden", String(!loading));
        }
    }

    function setStatus(text) {
        const status = document.getElementById("aiAssistantStatus");
        if (status) {
            status.textContent = text;
        }
    }

    function updateUsage() {
        const label = document.getElementById("aiUsageLabel");
        const usage = state.usage;

        if (!label) {
            return;
        }

        if (!usage) {
            label.textContent = "Uso: --";
            return;
        }

        if (usage.enabled === false) {
            label.textContent = "IA desativada";
            return;
        }

        label.textContent = usage.limit === -1
            ? `Uso hoje: ${usage.used} / ilimitado`
            : `Uso hoje: ${usage.used}/${usage.limit}`;
    }

    function updateCounter() {
        const input = document.getElementById("aiMessageInput");
        const counter = document.getElementById("aiCharacterCounter");
        if (counter && input) {
            counter.textContent = `${input.value.length}/${MAX_MESSAGE_LENGTH}`;
        }
    }

    function autoGrow(textarea) {
        if (!textarea) {
            return;
        }
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 220)}px`;
    }

    async function apiFetch(path, options = {}) {
        const base = String(window.API_BASE_URL || "").replace(/\/$/, "");
        const headers = new Headers(options.headers || {});
        headers.set("Content-Type", "application/json");
        const token = localStorage.getItem(SESSION_TOKEN_KEY);

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        const response = await fetch(`${base}${path}`, {
            method: options.method || "GET",
            headers,
            credentials: "include",
            signal: options.signal,
            body: options.body ? JSON.stringify(options.body) : undefined,
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const error = new Error(data.message || "Falha na comunicacao com a API.");
            error.status = response.status;
            throw error;
        }

        return data;
    }

    async function copyText(text) {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return;
        }

        const area = document.createElement("textarea");
        area.value = text;
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        area.remove();
    }

    function useTextInDocument(text) {
        const target = state.lastExternalEditable;

        if (target && document.contains(target) && isEditable(target)) {
            target.value = target.value ? `${target.value}\n\n${text}` : text;
            target.dispatchEvent(new Event("input", { bubbles: true }));
            target.focus();
            setStatus("Texto enviado para o campo selecionado.");
            return;
        }

        copyText(text).then(() => setStatus("Nenhum campo selecionado. Texto copiado."));
    }

    function isEditable(element) {
        return element instanceof HTMLTextAreaElement
            || element instanceof HTMLInputElement && ["text", "search", "email", "url", "tel", "number", ""].includes(element.type)
            || element?.isContentEditable;
    }

    function formatMode(mode) {
        const labels = {
            chat: "Conversa",
            create: "Criacao",
            review: "Revisao",
            formalize: "Formalizacao",
            summarize: "Resumo",
            clause: "Clausula",
            explain: "Explicacao",
        };
        return labels[mode] || labels.chat;
    }

    function formatDate(value) {
        if (!value) {
            return "Sem data";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "Sem data";
        }

        return date.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    function createIcons() {
        if (window.lucide?.createIcons) {
            window.lucide.createIcons();
        }
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function escapeAttr(value) {
        return escapeHtml(value).replace(/`/g, "&#96;");
    }
})();
