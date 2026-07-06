// Router Module - Handles view navigation and URL routing

import { reactiveState, setActiveView } from './state.js';
import { initDashboard } from './views/dashboard.js';
import { initDocuments } from './views/documents.js';
import { initPdfTools } from './views/pdf-tools.js';
import { initSupport } from './views/support.js';
import { initAi } from './views/ai.js';
import { initBilling } from './views/billing.js';
import { initAdmin } from './views/admin.js';

const VIEWS = {
  dashboard: { init: initDashboard, title: 'Início', icon: 'home' },
  documents: { init: initDocuments, title: 'Documentos', icon: 'file-text' },
  pdf: { init: initPdfTools, title: 'PDF', icon: 'file-type' },
  support: { init: initSupport, title: 'Atendimento', icon: 'headphones' },
  ai: { init: initAi, title: 'IA', icon: 'sparkles' },
  billing: { init: initBilling, title: 'Planos', icon: 'credit-card' },
  admin: { init: initAdmin, title: 'Admin', icon: 'shield' }
};

export function initRouter() {
  // Navigation buttons in sidebar
  const navButtons = document.querySelectorAll('.main-nav button[data-view]');
  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const view = button.dataset.view;
      navigateTo(view);
    });
  });

  // Handle browser back/forward
  window.addEventListener('popstate', (event) => {
    if (event.state?.view) {
      setActiveView(event.state.view);
      renderView(event.state.view);
    }
  });

  // Initial view
  const initialView = reactiveState.activeView || 'dashboard';
  navigateTo(initialView, false);
}

export function navigateTo(view, pushState = true) {
  if (!VIEWS[view]) {
    console.warn(`Unknown view: ${view}`);
    view = 'dashboard';
  }

  // Check admin access
  if (view === 'admin' && reactiveState.user && !reactiveState.user.isAdmin) {
    console.warn('Access denied: admin view requires admin privileges');
    view = 'dashboard';
  }

  // Update state
  setActiveView(view);

  // Update URL
  if (pushState) {
    history.pushState({ view }, '', `#${view}`);
  }

  // Update active nav button
  updateActiveNav(view);

  // Render the view
  renderView(view);
}

function updateActiveNav(view) {
  document.querySelectorAll('.main-nav button[data-view]').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.view === view);
  });
}

function renderView(view) {
  const contentArea = document.getElementById('content');
  if (!contentArea) return;

  // Clear content
  contentArea.innerHTML = '';

  // Update page header
  const pageKicker = document.getElementById('pageKicker');
  const pageTitle = document.getElementById('pageTitle');
  const viewConfig = VIEWS[view];

  if (pageKicker) {
    pageKicker.textContent = viewConfig?.title ? 'Painel' : '';
  }
  if (pageTitle) {
    pageTitle.textContent = viewConfig?.title || 'Início';
  }

  // Initialize view
  if (viewConfig?.init) {
    try {
      viewConfig.init(contentArea);
    } catch (error) {
      console.error(`Error initializing view ${view}:`, error);
      contentArea.innerHTML = `
        <div class="panel">
          <h2>Erro ao carregar a visualização</h2>
          <p class="message error">${error.message}</p>
        </div>
      `;
    }
  }
}

// Export for programmatic navigation
export function getCurrentView() {
  return reactiveState.activeView;
}