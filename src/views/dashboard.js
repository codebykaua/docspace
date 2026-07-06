// Dashboard View Module

export function initDashboard(container) {
  container.innerHTML = `
    <div class="dashboard">
      <div class="hero-grid">
        <div class="panel">
          <h2>Bem-vindo ao DocSpace</h2>
          <p>Seu sistema de geração de documentos jurídicos rurais com preenchimento guiado.</p>
          <div class="card-meta">
            <span class="badge">Versão 6.0.0</span>
            <span class="badge">Zero Wizard</span>
          </div>
        </div>
        <div class="stat-grid">
          <div class="stat">
            <small>Documentos Gerados</small>
            <strong id="statDocuments">--</strong>
          </div>
          <div class="stat">
            <small>PDFs Processados</small>
            <strong id="statPdfs">--</strong>
          </div>
          <div class="stat">
            <small>Conversas IA</small>
            <strong id="statAi">--</strong>
          </div>
        </div>
      </div>

      <div class="panel">
        <h2>Ações Rápidas</h2>
        <div class="grid" id="quickActions">
          <button class="document-card" data-action="new-document">
            <h3>Novo Documento</h3>
            <p>Criar contrato, declaração ou procuração</p>
          </button>
          <button class="document-card" data-action="pdf-tools">
            <h3>Ferramentas PDF</h3>
            <p>Comprimir, OCR, mesclar, dividir</p>
          </button>
          <button class="document-card" data-action="ai-chat">
            <h3>DocSpace IA</h3>
            <p>Assistente inteligente para documentos</p>
          </button>
          <button class="document-card" data-action="billing">
            <h3>Meu Plano</h3>
            <p>Gerenciar assinatura e cobrança</p>
          </button>
        </div>
      </div>

      <div class="panel">
        <h2>Documentos Recentes</h2>
        <div id="recentDocuments" class="grid"></div>
      </div>
    </div>
  `;

  // Setup quick action handlers
  const actions = container.querySelectorAll('#quickActions [data-action]');
  actions.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      handleQuickAction(action);
    });
  });

  loadDashboardStats();
  loadRecentDocuments();
}

async function handleQuickAction(action) {
  const { navigateTo } = await import('../modules/router.js');
  switch (action) {
    case 'new-document':
      navigateTo('documents');
      break;
    case 'pdf-tools':
      navigateTo('pdf');
      break;
    case 'ai-chat':
      navigateTo('ai');
      break;
    case 'billing':
      navigateTo('billing');
      break;
  }
}

async function loadDashboardStats() {
  try {
    const { apiFetch } = await import('../modules/auth.js');
    const data = await apiFetch('/api/session');
    if (data.documentUsage) {
      const totalDocs = Object.values(data.documentUsage.documents || {}).reduce((sum, d) => sum + (d.used || 0), 0);
      document.getElementById('statDocuments').textContent = totalDocs;
    }
    if (data.pdfToolUsage) {
      const totalPdfs = Object.values(data.pdfToolUsage.tools || {}).reduce((sum, t) => sum + (t.used || 0), 0);
      document.getElementById('statPdfs').textContent = totalPdfs;
    }
  } catch (error) {
    console.error('Failed to load dashboard stats:', error);
  }
}

async function loadRecentDocuments() {
  const container = document.getElementById('recentDocuments');
  if (!container) return;
  container.innerHTML = '<p class="message">Nenhum documento recente.</p>';
}