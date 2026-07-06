import './styles/main.css';

// Import modules
import { initState, subscribe, getState, setUser, setActiveView, setSessionToken } from './modules/state.js';
import { initRouter, navigateTo, getCurrentView } from './modules/router.js';
import { initAuth, apiFetch, login, logout, checkSession } from './modules/auth.js';

// Initialize state
initState();

// Initialize auth
initAuth();

// Initialize router
initRouter();

// Make functions globally available for inline handlers and legacy code
window.navigateTo = navigateTo;
window.getCurrentView = getCurrentView;
window.apiFetch = apiFetch;
window.login = login;
window.logout = logout;
window.checkSession = checkSession;

// Global state access
window.getState = getState;
window.setUser = setUser;
window.setActiveView = setActiveView;
window.setSessionToken = setSessionToken;

// Legacy API_BASE_URL — defined by app-config.js (DOCSPACE_CONFIG) and script.js

// Handle auth state changes
subscribe((state) => {
  // Update UI based on auth state
  const authView = document.getElementById('authView');
  const appView = document.getElementById('appView');

  if (state.isAuthenticated && state.user) {
    authView?.classList.add('is-hidden');
    appView?.classList.remove('is-hidden');

    // Update user info in header
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userInitials = document.getElementById('userInitials');

    if (userName) userName.textContent = state.user.name || 'Usuário';
    if (userEmail) userEmail.textContent = state.user.email || '';
    if (userInitials && state.user.name) {
      userInitials.textContent = state.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
  } else {
    authView?.classList.remove('is-hidden');
    appView?.classList.add('is-hidden');
  }
});

// Check session on load
checkSession().catch(console.error);

console.log('DocSpace initialized');