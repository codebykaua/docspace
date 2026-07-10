// Auth Module - Handles authentication, session management

import { reactiveState, setUser } from "./state.js";

const SESSION_TOKEN_KEY = "documentos_rurais_session_token";
const BILLING_TOKEN_KEY = "documentos_rurais_billing_token";

export function getApiBaseUrl() {
  return String(window.DOCSPACE_CONFIG?.API_BASE_URL || "")
    .trim()
    .replace(/\/+$/, "");
}

// Expose for legacy helpers
window.API_BASE_URL = getApiBaseUrl();

export function getAuthHeaders(includeAuth = true) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = localStorage.getItem(SESSION_TOKEN_KEY) || reactiveState.sessionToken;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

export async function apiFetch(path, options = {}) {
  const base = getApiBaseUrl();
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const token = localStorage.getItem(SESSION_TOKEN_KEY) || reactiveState.sessionToken;
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const billingToken = localStorage.getItem(BILLING_TOKEN_KEY) || reactiveState.billingToken;
  if (billingToken && !headers.has("X-Billing-Token")) {
    headers.set("X-Billing-Token", billingToken);
  }

  const response = await fetch(`${base}${path}`, {
    method: options.method || "GET",
    headers,
    credentials: "include",
    signal: options.signal,
    body:
      options.body === undefined
        ? undefined
        : typeof options.body === "string"
          ? options.body
          : JSON.stringify(options.body),
  });

  const data = await response.json().catch(() => ({}));

  if (data.sessionToken) {
    localStorage.setItem(SESSION_TOKEN_KEY, data.sessionToken);
    reactiveState.sessionToken = data.sessionToken;
  }
  if (data.billingToken) {
    localStorage.setItem(BILLING_TOKEN_KEY, data.billingToken);
    reactiveState.billingToken = data.billingToken;
  }

  if (!response.ok) {
    const error = new Error(data.message || "Falha na comunicação com a API.");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function login(email, password) {
  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });

  if (data.sessionToken) {
    localStorage.setItem(SESSION_TOKEN_KEY, data.sessionToken);
    reactiveState.sessionToken = data.sessionToken;
  }

  setUser(data.user);
  reactiveState.documentUsage = data.documentUsage || {};
  reactiveState.pdfToolUsage = data.pdfToolUsage || {};

  return data;
}

export async function logout() {
  try {
    await apiFetch("/api/auth/logout", { method: "POST" });
  } catch (_) {
    // Sessão pode já ter expirado.
  }
  localStorage.removeItem(SESSION_TOKEN_KEY);
  localStorage.removeItem(BILLING_TOKEN_KEY);
  reactiveState.sessionToken = null;
  reactiveState.billingToken = null;
  resetAuthState();
}

function resetAuthState() {
  reactiveState.user = null;
  reactiveState.isAuthenticated = false;
  reactiveState.documentUsage = {};
  reactiveState.pdfToolUsage = {};
}

export async function checkSession() {
  try {
    const data = await apiFetch("/api/session");
    setUser(data.user);
    reactiveState.documentUsage = data.documentUsage || {};
    reactiveState.pdfToolUsage = data.pdfToolUsage || {};
    reactiveState.aiFirstName = data.firstName || "";
    return true;
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      resetAuthState();
      localStorage.removeItem(SESSION_TOKEN_KEY);
    }
    return false;
  }
}

export async function initAuth() {
  const token = localStorage.getItem(SESSION_TOKEN_KEY);
  if (token) {
    reactiveState.sessionToken = token;
    await checkSession();
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }
}

async function handleLogin(event) {
  event.preventDefault();

  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  const messageEl = document.getElementById("loginMessage");
  const button = document.getElementById("loginButton");

  const email = emailInput?.value?.trim();
  const password = passwordInput?.value;

  if (!email || !password) {
    showMessage(messageEl, "Informe e-mail e senha.", "error");
    return;
  }

  if (button) {
    button.disabled = true;
    button.textContent = "Entrando...";
  }
  showMessage(messageEl, "", "");

  try {
    await login(email, password);
    showAppView();
  } catch (error) {
    showMessage(messageEl, error.message || "Erro ao fazer login.", "error");
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = "Entrar";
    }
  }
}

async function handleLogout(event) {
  event.preventDefault();
  await logout();
  showAuthView();
}

function showAuthView() {
  const authView = document.getElementById("authView");
  const appView = document.getElementById("appView");
  if (authView) authView.classList.remove("is-hidden");
  if (appView) appView.classList.add("is-hidden");
}

function showAppView() {
  const authView = document.getElementById("authView");
  const appView = document.getElementById("appView");
  if (authView) authView.classList.add("is-hidden");
  if (appView) appView.classList.remove("is-hidden");
}

function showMessage(element, text, type) {
  if (!element) return;
  element.textContent = text || "";
  element.className = `message ${type || ""}`.trim();
}

export function getSessionToken() {
  return localStorage.getItem(SESSION_TOKEN_KEY) || reactiveState.sessionToken;
}
