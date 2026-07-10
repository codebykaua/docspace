// State Module - Central reactive state management

// Internal state (also exposed as reactiveState for consumers)
export const reactiveState = {
  // User & Auth
  user: null,
  sessionToken: null,
  billingToken: null,
  isAuthenticated: false,

  // UI State
  activeView: "dashboard",
  sidebarOpen: true,
  modalOpen: false,
  loading: false,

  // Data
  documents: [],
  documentUsage: null,
  pdfToolUsage: null,
  aiUsage: null,
  aiConversations: [],
  currentAiConversation: null,
  aiFirstName: "",

  // Settings
  settings: {
    theme: "light",
    language: "pt-BR",
  },
};

// Backwards-compatible alias
const state = reactiveState;

// Subscribers for reactive updates
const subscribers = new Set();

function notifySubscribers() {
  subscribers.forEach((callback) => callback(state));
}

// Getter - returns a shallow copy to prevent accidental top-level mutation
export function getState() {
  return { ...state };
}

// Getter for specific key
export function getStateKey(key) {
  return state[key];
}

// Setter - updates state and notifies subscribers
export function setStateKey(key, value) {
  if (state[key] !== value) {
    state[key] = value;
    notifySubscribers();
  }
  return value;
}

// Special setter for user
export function setUser(user) {
  state.user = user;
  state.isAuthenticated = !!user;
  notifySubscribers();
}

// Special setter for active view
export function setActiveView(view) {
  state.activeView = view;
  notifySubscribers();
}

// Special setter for session token
export function setSessionToken(token) {
  state.sessionToken = token;
  if (token) {
    localStorage.setItem("documentos_rurais_session_token", token);
  } else {
    localStorage.removeItem("documentos_rurais_session_token");
  }
  notifySubscribers();
}

// Subscribe to state changes
export function subscribe(callback) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

// Initialize state from localStorage
export function initState() {
  const token = localStorage.getItem("documentos_rurais_session_token");
  if (token) {
    state.sessionToken = token;
  }
  const billingToken = localStorage.getItem("documentos_rurais_billing_token");
  if (billingToken) {
    state.billingToken = billingToken;
  }
}
