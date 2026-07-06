const API_BASE_URL = String(
    window.DOCSPACE_CONFIG?.API_BASE_URL || ""
)
    .trim()
    .replace(/\/+$/, "");
window.API_BASE_URL = API_BASE_URL;
const SESSION_TOKEN_KEY = "documentos_rurais_session_token";

const controlLoginView = document.getElementById("controlLoginView");
const controlPanelView = document.getElementById("controlPanelView");
const controlLoginForm = document.getElementById("controlLoginForm");
const controlLoginEmail = document.getElementById("controlLoginEmail");
const controlLoginPassword = document.getElementById("controlLoginPassword");
const controlLoginButton = document.getElementById("controlLoginButton");
const controlLoginMessage = document.getElementById("controlLoginMessage");
const controlUserEmail = document.getElementById("controlUserEmail");
const controlLogoutButton = document.getElementById("controlLogoutButton");
const controlAccessForm = document.getElementById("controlAccessForm");
const controlEditingUid = document.getElementById("controlEditingUid");
const controlFormTitle = document.getElementById("controlFormTitle");
const controlUserName = document.getElementById("controlUserName");
const controlUserEmailInput = document.getElementById("controlUserEmailInput");
const controlUserPassword = document.getElementById("controlUserPassword");
const controlUserPlan = document.getElementById("controlUserPlan");
const controlUserStatus = document.getElementById("controlUserStatus");
const controlUserExpiresAt = document.getElementById("controlUserExpiresAt");
const controlUserDailyDocumentLimit = document.getElementById("controlUserDailyDocumentLimit");
const controlUserAdmin = document.getElementById("controlUserAdmin");
const controlUserVerified = document.getElementById("controlUserVerified");
const controlUserNotes = document.getElementById("controlUserNotes");
const controlAccessMessage = document.getElementById("controlAccessMessage");
const controlAccessButton = document.getElementById("controlAccessButton");
const controlCancelEditButton = document.getElementById("controlCancelEditButton");
const controlRefreshUsersButton = document.getElementById("controlRefreshUsersButton");
const controlUsersList = document.getElementById("controlUsersList");
const controlRefreshSupportButton = document.getElementById("controlRefreshSupportButton");
const controlSupportList = document.getElementById("controlSupportList");

const ACCESS_PLANS = {
    test3min: {
        label: "3 minutos para teste",
        minutes: 3,
    },
    test10c: {
        label: "Teste Mercado Pago - R$ 0,10",
        days: 30,
    },
    basic30: {
        label: "30 dias plano Básico",
        days: 30,
    },
    proMax365: {
        label: "365 dias plano Pro Max",
        days: 365,
    },
};

const PLAN_ALIASES = {
    teste3min: "test3min",
    "3-minutos": "test3min",
    test10c: "test10c",
    teste10c: "test10c",
    teste10centavos: "test10c",
    "teste-10-centavos": "test10c",
    "teste-mercado-pago": "test10c",
    test15min: "basic30",
    test5min: "basic30",
    trial15: "basic30",
    trial7: "basic30",
    monthly30: "basic30",
    annual365: "proMax365",
    basico30: "basic30",
    basic: "basic30",
    plus: "basic30",
    plus90: "basic30",
    pro: "basic30",
    pro180: "basic30",
    proMax: "proMax365",
    "pro-max": "proMax365",
    pro_max: "proMax365",
};

const PLAN_BADGES = {
    test3min: "Teste interno",
    test10c: "Teste R$ 0,10",
    basic30: "Básico",
    proMax365: "Azul intenso",
};

let usuarioAtual = null;
let usuariosCache = {};

preencherSelectPlanos(controlUserPlan);
inicializarControle();

async function inicializarControle() {
    mostrarTelaControle("login");
    configurarEventosControle();
    alternarLoginCarregamento(true, "Verificando...");

    try {
        const data = await apiRequest("/api/session");

        if (!data.user?.isAdmin) {
            await sairControle(false);
            mostrarLoginMensagem("Este login nao tem permissao de administrador.", "error");
            return;
        }

        abrirPainel(data.user);
    } catch (error) {
        mostrarTelaControle("login");
    } finally {
        alternarLoginCarregamento(false);
    }
}

function configurarEventosControle() {
    controlLoginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        limparLoginMensagem();

        if (!validarLogin()) {
            return;
        }

        alternarLoginCarregamento(true, "Entrando...");

        try {
            const data = await apiRequest("/api/auth/login", {
                method: "POST",
                body: {
                    email: controlLoginEmail.value.trim(),
                    password: controlLoginPassword.value,
                },
            });

            if (!data.user?.isAdmin) {
                await sairControle(false);
                mostrarLoginMensagem("Este login nao tem permissao de administrador.", "error");
                return;
            }

            abrirPainel(data.user);
        } catch (error) {
            console.error(error);
            mostrarLoginMensagem(traduzirErroApi(error), "error");
        } finally {
            alternarLoginCarregamento(false);
        }
    });

    controlLogoutButton.addEventListener("click", () => {
        sairControle(true);
    });

    controlAccessForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        limparMensagemControle();

        if (!validarFormularioAcesso()) {
            return;
        }

        const editando = Boolean(controlEditingUid.value);
        alternarAcessoCarregamento(true, editando ? "Salvando..." : "Criando...");

        try {
            if (editando) {
                await editarAcesso(controlEditingUid.value);
                mostrarMensagemControle("Acesso atualizado com sucesso.", "success");
            } else {
                await criarLoginComAcesso();
                mostrarMensagemControle("Login criado com sucesso.", "success");
            }

            limparFormularioAcesso();
            await carregarUsuarios();
        } catch (error) {
            console.error(error);
            mostrarMensagemControle(traduzirErroApi(error), "error");
        } finally {
            alternarAcessoCarregamento(false);
        }
    });

    controlCancelEditButton.addEventListener("click", () => {
        limparFormularioAcesso();
        limparMensagemControle();
    });

    controlRefreshUsersButton.addEventListener("click", carregarUsuarios);
    controlRefreshSupportButton.addEventListener("click", carregarAtendimentos);
    controlSupportList.addEventListener("click", async (event) => {
        const downloadButton = event.target.closest("[data-support-download]");

        if (downloadButton) {
            await baixarAnexoAtendimento(downloadButton.dataset.supportDownload, downloadButton.dataset.attachmentName);
            return;
        }

        const replyButton = event.target.closest("[data-support-reply]");

        if (replyButton) {
            const message = window.prompt(`Responder para ${replyButton.dataset.supportReply}:`);

            if (message?.trim()) {
                await enviarRespostaAtendimento(replyButton.dataset.supportReply, replyButton.dataset.customerName, message.trim());
            }
        }
    });

    controlUsersList.addEventListener("click", async (event) => {
        const button = event.target.closest("[data-control-action]");

        if (!button) {
            return;
        }

        const { uid, controlAction } = button.dataset;

        if (controlAction === "edit") {
            preencherFormularioEdicao(uid);
            return;
        }

        if (controlAction === "changePlan") {
            await alterarPlanoDoUsuario(uid);
            return;
        }

        button.disabled = true;

        try {
            await apiRequest(`/api/admin/users/${uid}/actions`, {
                method: "POST",
                body: {
                    action: controlAction,
                },
            });
            mostrarMensagemControle("Acesso atualizado com sucesso.", "success");
            await carregarUsuarios();
        } catch (error) {
            console.error(error);
            mostrarMensagemControle(traduzirErroApi(error), "error");
            button.disabled = false;
        }
    });

    controlUserPlan.addEventListener("change", atualizarCampoVencimentoPorPlano);
    atualizarCampoVencimentoPorPlano();
}

function preencherSelectPlanos(selectElement) {
    if (!selectElement) {
        return;
    }

    selectElement.textContent = "";

    Object.entries(ACCESS_PLANS).forEach(([planId, plan]) => {
        const option = document.createElement("option");
        option.value = planId;
        option.textContent = obterTextoPlanoSelect(planId, plan.label);
        selectElement.appendChild(option);
    });
}

function obterTextoPlanoSelect(planId, label) {
    const badge = PLAN_BADGES[planId];
    return badge ? `${label} - ${badge}` : label;
}

function abrirPainel(user) {
    usuarioAtual = user;
    controlUserEmail.textContent = user.email || "";
    limparLoginMensagem();
    mostrarTelaControle("panel");
    carregarUsuarios();
    carregarAtendimentos();
}

async function sairControle(mostrarLogin) {
    try {
        await apiRequest("/api/auth/logout", {
            method: "POST",
        });
    } catch (error) {
        console.warn("Nao foi possivel encerrar a sessao no servidor.", error);
    }

    usuarioAtual = null;
    usuariosCache = {};
    controlUserEmail.textContent = "";
    limparFormularioAcesso();

    if (mostrarLogin) {
        mostrarTelaControle("login");
    }
}

function validarLogin() {
    const emailInvalido = controlLoginEmail.value.trim() === "" || !controlLoginEmail.validity.valid;
    const senhaInvalida = controlLoginPassword.value.trim() === "";

    controlLoginEmail.classList.toggle("is-invalid", emailInvalido);
    controlLoginPassword.classList.toggle("is-invalid", senhaInvalida);

    if (emailInvalido || senhaInvalida) {
        mostrarLoginMensagem("Informe um e-mail valido e a senha.", "error");
        (emailInvalido ? controlLoginEmail : controlLoginPassword).focus();
        return false;
    }

    return true;
}

function validarFormularioAcesso() {
    const editando = Boolean(controlEditingUid.value);
    const campos = [controlUserName, controlUserEmailInput, controlUserPlan, controlUserStatus, controlUserDailyDocumentLimit];

    if (!editando) {
        campos.push(controlUserPassword);
    }

    const campoInvalido = campos.find((campo) => {
        const invalido = campo.value.trim() === "" || !campo.validity.valid;
        campo.classList.toggle("is-invalid", invalido);
        return invalido;
    });

    if (campoInvalido) {
        mostrarMensagemControle(
            editando
                ? "Preencha nome, e-mail valido, plano e status."
                : "Preencha nome, e-mail valido, senha com no minimo 6 caracteres, plano e status.",
            "error"
        );
        campoInvalido.focus();
        return false;
    }

    return true;
}

async function criarLoginComAcesso() {
    await apiRequest("/api/admin/users", {
        method: "POST",
        body: montarDadosAcesso({ incluirSenha: true }),
    });
}

async function editarAcesso(uid) {
    await apiRequest(`/api/admin/users/${uid}`, {
        method: "PUT",
        body: montarDadosAcesso({ incluirSenha: false }),
    });
}

function montarDadosAcesso(options) {
    const dados = {
        email: controlUserEmailInput.value.trim(),
        name: controlUserName.value.trim(),
        plan: normalizePlanId(controlUserPlan.value),
        status: controlUserStatus.value,
        expiresAt: controlUserExpiresAt.disabled ? "" : controlUserExpiresAt.value,
        dailyDocumentLimit: Number(controlUserDailyDocumentLimit.value),
        isAdmin: controlUserAdmin.value === "yes",
        isVerified: controlUserVerified.value === "yes",
        notes: controlUserNotes.value.trim(),
    };

    if (options.incluirSenha || controlUserPassword.value.trim()) {
        dados.password = controlUserPassword.value;
    }

    return dados;
}

async function carregarUsuarios() {
    controlUsersList.innerHTML = '<div class="empty-state">Carregando usuarios...</div>';

    try {
        const data = await apiRequest("/api/admin/users");
        const usuarios = data.users || [];
        usuariosCache = Object.fromEntries(usuarios.map((usuario) => [usuario.id, usuario]));
        renderizarUsuarios(usuarios);
    } catch (error) {
        console.error(error);
        controlUsersList.innerHTML = '<div class="empty-state">Nao foi possivel carregar os usuarios.</div>';
    }
}

async function carregarAtendimentos() {
    controlSupportList.innerHTML = '<div class="empty-state">Carregando atendimentos...</div>';

    try {
        const data = await apiRequest("/api/admin/support/messages");
        renderizarAtendimentos(data.messages || []);
    } catch (error) {
        controlSupportList.innerHTML = `<div class="empty-state">${escaparHtmlSeguro(traduzirErroApi(error))}</div>`;
    }
}

function renderizarAtendimentos(messages) {
    if (!messages.length) {
        controlSupportList.innerHTML = '<div class="empty-state">Nenhuma mensagem ou comprovante recebido.</div>';
        return;
    }

    const conversations = messages.reduce((groups, item) => {
        const email = item.customerEmail || "sem-email";
        groups[email] ||= [];
        groups[email].push(item);
        return groups;
    }, {});

    controlSupportList.innerHTML = Object.entries(conversations).map(([email, items]) => {
        const latest = items[0];
        const customerName = latest.customerName || "Cliente";
        const thread = items.map((item) => `
            <article class="admin-support-message ${item.senderType === "admin" ? "is-admin" : "is-customer"}">
                <div class="admin-support-message-heading">
                    <strong>${item.senderType === "admin" ? "Administrador" : "Cliente"}</strong>
                    <time>${formatarDataHora(item.createdAt)}</time>
                </div>
                ${item.category === "payment_proof" ? `<span class="support-category-pill">Comprovante: ${escaparHtmlSeguro(getPlan(item.plan)?.label || item.plan)}</span>` : ""}
                ${item.message ? `<p>${escaparHtmlSeguro(item.message)}</p>` : ""}
                ${item.attachmentName ? `<button type="button" class="secondary-button support-download-button" data-support-download="${escaparHtmlSeguro(item.id)}" data-attachment-name="${escaparHtmlSeguro(item.attachmentName)}">Baixar ${escaparHtmlSeguro(item.attachmentName)}</button>` : ""}
            </article>
        `).join("");

        return `
            <details class="admin-support-conversation">
                <summary>
                    <span class="admin-support-avatar">ID</span>
                    <span><strong>${escaparHtmlSeguro(customerName)}</strong><small>${escaparHtmlSeguro(email)}</small></span>
                    <span class="admin-support-count">${items.length}</span>
                </summary>
                <div class="admin-support-thread">
                    ${thread}
                    <button type="button" class="secondary-button admin-support-reply" data-support-reply="${escaparHtmlSeguro(email)}" data-customer-name="${escaparHtmlSeguro(customerName)}">Responder</button>
                </div>
            </details>
        `;
    }).join("");
}

async function enviarRespostaAtendimento(email, name, message) {
    try {
        await apiRequest("/api/admin/support/messages", {
            method: "POST",
            body: { email, name, message },
        });
        await carregarAtendimentos();
    } catch (error) {
        window.alert(traduzirErroApi(error));
    }
}

async function baixarAnexoAtendimento(id, filename) {
    try {
        const headers = new Headers();
        const sessionToken = localStorage.getItem(SESSION_TOKEN_KEY);

        if (sessionToken) {
            headers.set("Authorization", `Bearer ${sessionToken}`);
        }

        const response = await fetch(montarUrlApi(`/api/support/attachments/${id}`), { headers, credentials: "include" });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || "Nao foi possivel baixar o comprovante.");
        }

        const link = document.createElement("a");
        const url = URL.createObjectURL(await response.blob());
        link.href = url;
        link.download = filename || "comprovante";
        link.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        window.alert(error.message || "Nao foi possivel baixar o comprovante.");
    }
}

function escaparHtmlSeguro(text) {
    return String(text || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function renderizarUsuarios(usuarios) {
    if (usuarios.length === 0) {
        controlUsersList.innerHTML = '<div class="empty-state">Nenhum usuario cadastrado ainda.</div>';
        return;
    }

    controlUsersList.textContent = "";

    usuarios.forEach((usuario) => {
        const status = obterStatusVisual(usuario);
        const item = document.createElement("article");
        item.className = "admin-user-item";

        const info = document.createElement("div");
        const nomeLinha = document.createElement("span");
        nomeLinha.className = "verified-name-line";
        const nome = document.createElement("strong");
        nome.textContent = usuario.name || "Usuario sem nome";
        nomeLinha.appendChild(nome);

        if (usuario.isVerified) {
            nomeLinha.appendChild(criarSeloVerificado());
        }

        const meta = document.createElement("div");
        meta.className = "admin-user-meta";
        meta.append(
            criarTextoMeta(usuario.email || "sem e-mail"),
            criarPlanoAtual(usuario),
            criarTextoMeta(`Tempo: ${formatarTempoDoPlano(usuario)}`),
            criarStatus(status)
        );

        if (["test3min", "test10c", "basic30"].includes(normalizePlanId(usuario.plan))) {
            meta.append(criarTextoMeta(`Limite diario: ${usuario.dailyDocumentLimit || 5} por documento`));
        }

        if (usuario.isAdmin) {
            meta.append(criarTextoMeta("Administrador"));
        }

        if (usuario.notes) {
            meta.append(criarTextoMeta(usuario.notes));
        }

        info.append(nomeLinha, meta);

        const actions = document.createElement("div");
        actions.className = "admin-user-actions";
        actions.append(
            criarBotao(usuario.id, "edit", "Editar dados"),
            criarBotao(usuario.id, "renewCurrent", "Renovar plano"),
            criarBotao(usuario.id, "changePlan", "Alterar plano"),
            criarBotao(usuario.id, status.status === "blocked" ? "unblock" : "block", status.status === "blocked" ? "Liberar" : "Bloquear")
        );

        item.append(info, actions);
        controlUsersList.appendChild(item);
    });
}

function preencherFormularioEdicao(uid) {
    const usuario = usuariosCache[uid];

    if (!usuario) {
        return;
    }

    controlEditingUid.value = uid;
    controlFormTitle.textContent = "Editar acesso";
    controlAccessButton.textContent = "Salvar alteracoes";
    controlCancelEditButton.classList.remove("is-hidden");
    controlUserPassword.required = false;
    controlUserPassword.disabled = false;
    controlUserPassword.value = "";
    controlUserPassword.placeholder = "Preencha apenas se quiser trocar a senha";
    controlUserName.value = usuario.name || "";
    controlUserEmailInput.value = usuario.email || "";
    controlUserPlan.value = normalizePlanId(usuario.plan || "basic30");
    controlUserStatus.value = usuario.status || "active";
    controlUserExpiresAt.value = usuario.expiresAt ? formatarDataParaInput(usuario.expiresAt) : "";
    controlUserDailyDocumentLimit.value = String(usuario.dailyDocumentLimit || 5);
    controlUserAdmin.value = usuario.isAdmin ? "yes" : "no";
    controlUserVerified.value = usuario.isVerified ? "yes" : "no";
    controlUserNotes.value = usuario.notes || "";
    atualizarCampoVencimentoPorPlano();
    controlAccessForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function alterarPlanoDoUsuario(uid) {
    const usuario = usuariosCache[uid];

    if (!usuario) {
        return;
    }

    const opcoes = Object.entries(ACCESS_PLANS)
        .map(([id, plano]) => `${id} = ${plano.label}`)
        .join("\n");
    const novoPlano = window.prompt(
        `Digite o codigo do novo plano:\n\n${opcoes}`,
        normalizePlanId(usuario.plan || "basic30")
    );

    if (!novoPlano) {
        return;
    }

    const planId = normalizePlanId(novoPlano);

    if (!getPlan(planId)) {
        mostrarMensagemControle("Plano invalido. Use um dos codigos mostrados.", "error");
        return;
    }

    await apiRequest(`/api/admin/users/${uid}`, {
        method: "PUT",
        body: montarDadosUsuarioExistente(usuario, {
            plan: planId,
            status: "active",
            expiresAt: "",
        }),
    });

    mostrarMensagemControle("Plano alterado com sucesso.", "success");
    await carregarUsuarios();
}

function montarDadosUsuarioExistente(usuario, overrides = {}) {
    const dados = {
        name: usuario.name || "",
        email: usuario.email || "",
        plan: normalizePlanId(usuario.plan || "basic30"),
        status: usuario.status || "active",
        expiresAt: usuario.expiresAt ? formatarDataParaInput(usuario.expiresAt) : "",
        dailyDocumentLimit: Number(usuario.dailyDocumentLimit || 5),
        isAdmin: Boolean(usuario.isAdmin),
        isVerified: Boolean(usuario.isVerified),
        notes: usuario.notes || "",
        ...overrides,
    };

    dados.plan = normalizePlanId(dados.plan || "basic30");
    return dados;
}

function obterStatusVisual(usuario) {
    if (usuario.status === "blocked") {
        return {
            status: "blocked",
            label: "Bloqueado",
        };
    }

    if (usuario.status === "expired" || !usuario.expiresAt || new Date(usuario.expiresAt).getTime() <= Date.now()) {
        return {
            status: "expired",
            label: "Vencido",
        };
    }

    return {
        status: "active",
        label: "Ativo",
    };
}

function criarTextoMeta(texto) {
    const span = document.createElement("span");
    span.textContent = texto;
    return span;
}

function criarSeloVerificado() {
    const selo = document.createElement("span");
    selo.className = "verified-badge";
    selo.dataset.verifiedBadge = "true";
    selo.title = "Perfil verificado";
    selo.setAttribute("aria-label", "Perfil verificado");
    selo.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path class="verified-badge-medallion" d="M23 12l-2.44-2.79.39-3.69-3.61-.82L15.45 1.5 12 2.96 8.55 1.5 6.66 4.69l-3.61.82.39 3.69L1 12l2.44 2.79-.39 3.69 3.61.82 1.89 3.19L12 21.04l3.45 1.46 1.89-3.19 3.61-.82-.39-3.69L23 12z"></path>
            <path class="verified-badge-check" d="m8.5 12.1 2.15 2.15 4.85-4.85"></path>
        </svg>
    `;
    return selo;
}

function criarPlanoAtual(usuario) {
    const span = document.createElement("span");
    span.className = `plan-pill ${obterClassePlano(usuario.plan)}`;
    span.textContent = `Plano atual: ${obterNomePlano(usuario)}`;
    return span;
}

function criarStatus(status) {
    const span = document.createElement("span");
    span.className = `status-pill status-pill-${status.status}`;
    span.textContent = status.label;
    return span;
}

function criarBotao(uid, action, text) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "secondary-button";
    button.dataset.uid = uid;
    button.dataset.controlAction = action;
    button.textContent = text;
    return button;
}

function calcularDataVencimentoIso(planId) {
    const plano = getPlan(planId) || ACCESS_PLANS.basic30;
    const data = new Date();

    if (plano.minutes) {
        data.setMinutes(data.getMinutes() + plano.minutes);
        return data.toISOString();
    }

    data.setDate(data.getDate() + plano.days);
    return data.toISOString();
}

function calcularDataVencimentoInput(planId) {
    return formatarDataParaInput(calcularDataVencimentoIso(planId));
}

function formatarData(valor) {
    if (!valor) {
        return "sem data";
    }

    return new Intl.DateTimeFormat("pt-BR").format(new Date(valor));
}

function formatarDataParaInput(valor) {
    if (!valor) {
        return "";
    }

    const data = new Date(valor);

    if (!Number.isFinite(data.getTime())) {
        return "";
    }

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function formatarDataHora(valor) {
    if (!valor) {
        return "sem data";
    }

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(valor));
}

function formatarVencimento(usuario) {
    const plano = getPlan(usuario?.plan);
    return plano?.minutes ? formatarDataHora(usuario.expiresAt) : formatarData(usuario?.expiresAt);
}

function formatarTempoDoPlano(usuario) {
    if (!usuario?.expiresAt) {
        return "sem vencimento";
    }

    const vencimento = new Date(usuario.expiresAt);
    const restante = vencimento.getTime() - Date.now();

    if (!Number.isFinite(vencimento.getTime())) {
        return "data invalida";
    }

    if (restante <= 0 || usuario.status === "expired") {
        return `vencido em ${formatarVencimento(usuario)}`;
    }

    const plano = getPlan(usuario.plan);

    if (plano?.minutes || restante < 1000 * 60 * 60 * 24) {
        const minutos = Math.max(1, Math.ceil(restante / (1000 * 60)));
        return `${minutos} minuto${minutos === 1 ? "" : "s"} restantes, vence em ${formatarDataHora(usuario.expiresAt)}`;
    }

    const dias = Math.max(1, Math.ceil(restante / (1000 * 60 * 60 * 24)));
    return `${dias} dia${dias === 1 ? "" : "s"} restantes, vence em ${formatarData(usuario.expiresAt)}`;
}

function obterNomePlano(usuario) {
    const plano = getPlan(usuario?.plan);
    return plano?.label || usuario?.planLabel || "Sem plano";
}

function normalizePlanId(planId) {
    const raw = String(planId || "").trim();

    if (!raw) {
        return "";
    }

    const lower = raw.toLowerCase();
    const compact = lower
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");

    const aliasesNormalizados = {
        test3min: "test3min",
        teste3min: "test3min",
        "3minutosparateste": "test3min",
        test10c: "test10c",
        teste10c: "test10c",
        teste10centavos: "test10c",
        teste10centavo: "test10c",
        teste10cent: "test10c",
        teste10: "test10c",
        "testemercadopago": "test10c",
        "testemercadopago10centavos": "test10c",
        test15min: "basic30",
        teste5min: "basic30",
        "5minutosdeteste": "basic30",
        trial15: "basic30",
        trial7: "basic30",
        teste7: "basic30",
        teste7dias: "basic30",
        "7diastestegratis": "basic30",
        monthly30: "basic30",
        annual365: "proMax365",
        basico30: "basic30",
        basic: "basic30",
        basic30: "basic30",
        "30diasplanobasico": "basic30",
        "30diasplanopro": "basic30",
        plus: "basic30",
        plus90: "basic30",
        "90diasplanoplus": "basic30",
        pro: "basic30",
        pro180: "basic30",
        "180diasplanopro": "basic30",
        promax: "proMax365",
        promax365: "proMax365",
        promaximo365: "proMax365",
        "365diasplanopromax": "proMax365",
    };

    const alias = PLAN_ALIASES[raw] || PLAN_ALIASES[lower] || aliasesNormalizados[compact];

    if (alias) {
        return alias;
    }

    const match = Object.keys(ACCESS_PLANS).find((id) => id.toLowerCase() === lower);
    return match || raw;
}

function getPlan(planId) {
    return ACCESS_PLANS[normalizePlanId(planId)];
}

function obterClassePlano(planId) {
    return `plan-theme-${normalizePlanId(planId)}`;
}

function atualizarCampoVencimentoPorPlano() {
    const plano = getPlan(controlUserPlan.value) || ACCESS_PLANS.basic30;

    if (plano.minutes) {
        controlUserExpiresAt.value = "";
        controlUserExpiresAt.disabled = true;
        controlUserExpiresAt.title = `Este plano vence automaticamente em ${plano.minutes} minutos.`;
        return;
    }

    controlUserExpiresAt.disabled = false;
    controlUserExpiresAt.title = "";

    if (!controlUserExpiresAt.value) {
        controlUserExpiresAt.value = calcularDataVencimentoInput(controlUserPlan.value);
    }
}

function limparFormularioAcesso() {
    controlAccessForm.reset();
    controlEditingUid.value = "";
    controlFormTitle.textContent = "Criar novo login";
    controlAccessButton.textContent = "Criar login";
    controlCancelEditButton.classList.add("is-hidden");
    controlUserPassword.required = true;
    controlUserPassword.disabled = false;
    controlUserPassword.placeholder = "";
    atualizarCampoVencimentoPorPlano();
    controlAccessForm.querySelectorAll(".is-invalid").forEach((field) => {
        field.classList.remove("is-invalid");
    });
}

function mostrarTelaControle(tela) {
    controlLoginView.classList.toggle("is-hidden", tela !== "login");
    controlPanelView.classList.toggle("is-hidden", tela !== "panel");
    document.body.classList.toggle("auth-open", tela === "login");
    document.body.classList.toggle("admin-access-open", tela === "panel");
}

function mostrarLoginMensagem(texto, tipo) {
    controlLoginMessage.textContent = texto;
    controlLoginMessage.className = `message ${tipo || ""}`.trim();
}

function limparLoginMensagem() {
    mostrarLoginMensagem("", "");
    controlLoginEmail.classList.remove("is-invalid");
    controlLoginPassword.classList.remove("is-invalid");
}

function mostrarMensagemControle(texto, tipo) {
    controlAccessMessage.textContent = texto;
    controlAccessMessage.className = `message ${tipo || ""}`.trim();
}

function limparMensagemControle() {
    mostrarMensagemControle("", "");
    controlAccessForm.querySelectorAll(".is-invalid").forEach((field) => {
        field.classList.remove("is-invalid");
    });
}

function alternarLoginCarregamento(carregando, texto = "Entrar") {
    controlLoginButton.disabled = carregando;
    controlLoginButton.textContent = carregando ? texto : "Entrar";
}

function alternarAcessoCarregamento(carregando, texto = "Criar login") {
    controlAccessButton.disabled = carregando;
    controlAccessButton.textContent = carregando
        ? texto
        : (controlEditingUid.value ? "Salvar alteracoes" : "Criar login");
}

function traduzirErroApi(error) {
    const message = error?.data?.message || error?.message || "Nao foi possivel concluir a acao.";

    if (/^Plano invalido\.?$/i.test(String(message).trim())) {
        return "A API do Cloudflare ainda esta com os planos antigos. Cole o worker-backend-pronto.js atualizado no Worker e clique em Deploy.";
    }

    if (/^Rota nao encontrada\.?$/i.test(String(message).trim())) {
        return "A rota de atendimento ainda nao foi publicada. Rode: npx wrangler deploy --config wrangler-api.toml";
    }

    return message;
}

async function apiRequest(path, options = {}) {
    const headers = new Headers(options.headers || {});
    const sessionToken = localStorage.getItem(SESSION_TOKEN_KEY);

    if (sessionToken) {
        headers.set("Authorization", `Bearer ${sessionToken}`);
    }

    const request = {
        method: options.method || "GET",
        credentials: "include",
        headers,
    };

    if (options.body !== undefined) {
        headers.set("Content-Type", "application/json");
        request.body = JSON.stringify(options.body);
    }

    const response = await fetch(montarUrlApi(path), request);
    const contentType = response.headers.get("Content-Type") || "";
    const data = contentType.includes("application/json") ? await response.json() : {};

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem(SESSION_TOKEN_KEY);
        }

        const error = new Error(data.message || "Erro na API.");
        error.status = response.status;
        error.data = data;
        throw error;
    }

    if (data.sessionToken) {
        localStorage.setItem(SESSION_TOKEN_KEY, data.sessionToken);
    }

    if (path.includes("/auth/logout")) {
        localStorage.removeItem(SESSION_TOKEN_KEY);
    }

    return data;
}

function montarUrlApi(path) {
    const base = API_BASE_URL.replace(/\/$/, "");
    const caminho = path.startsWith("/") ? path : `/${path}`;
    return `${base}${caminho}`;
}
