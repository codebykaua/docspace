// Documents View Module

export function initDocuments(container) {
  container.innerHTML = `
    <div class="documents-view">
      <div class="view-header">
        <h2>Meus Documentos</h2>
        <button class="btn btn-primary" id="newDocumentBtn">
          <span class="icon">+</span> Novo Documento
        </button>
      </div>

      <div class="panel">
        <div class="filters">
          <select id="documentTypeFilter">
            <option value="">Todos os tipos</option>
            <option value="contract">Contratos</option>
            <option value="declaration">Declarações</option>
            <option value="procuration">Procurções</option>
            <option value="other">Outros</option>
          </select>
          <input type="text" id="documentSearch" placeholder="Buscar documentos..." class="search-input">
        </div>

        <div id="documentsList" class="documents-grid">
          <p class="message">Carregando documentos...</p>
        </div>

        <div id="documentsPagination" class="pagination"></div>
      </div>
    </div>
  `;

  setupEventListeners(container);
  loadDocuments();
}

function setupEventListeners(container) {
  const newDocBtn = container.querySelector('#newDocumentBtn');
  if (newDocBtn) {
    newDocBtn.addEventListener('click', () => openDocumentWizard());
  }

  const typeFilter = container.querySelector('#documentTypeFilter');
  const searchInput = container.querySelector('#documentSearch');
  
  if (typeFilter) {
    typeFilter.addEventListener('change', () => loadDocuments());
  }
  
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => loadDocuments(), 300);
    });
  }
}

async function loadDocuments(page = 1) {
  const container = document.getElementById('documentsList');
  if (!container) return;

  try {
    const { apiFetch } = await import('../modules/auth.js');
    const typeFilter = document.getElementById('documentTypeFilter')?.value || '';
    const search = document.getElementById('documentSearch')?.value || '';
    
    const params = new URLSearchParams({ page: page.toString(), limit: '10' });
    if (typeFilter) params.append('type', typeFilter);
    if (search) params.append('search', search);

    const data = await apiFetch(`/api/documents?${params.toString()}`);
    renderDocuments(container, data.documents || [], data.pagination);
  } catch (error) {
    console.error('Failed to load documents:', error);
    container.innerHTML = `<p class="message error">Erro ao carregar documentos: ${error.message}</p>`;
  }
}

function renderDocuments(container, documents, pagination) {
  if (!documents.length) {
    container.innerHTML = '<p class="message">Nenhum documento encontrado.</p>';
    renderPagination(pagination);
    return;
  }

  container.innerHTML = documents.map(doc => `
    <div class="document-card" data-id="${doc.id}">
      <div class="document-header">
        <h3>${escapeHtml(doc.title || 'Sem título')}</h3>
        <span class="badge badge-${getTypeClass(doc.type)}">${escapeHtml(getTypeLabel(doc.type))}</span>
      </div>
      <p class="document-meta">
        <small>Criado: ${formatDate(doc.createdAt)}</small>
        ${doc.updatedAt ? `<small> • Atualizado: ${formatDate(doc.updatedAt)}</small>` : ''}
      </p>
      <div class="document-actions">
        <button class="btn btn-secondary btn-sm" data-action="edit" data-id="${doc.id}">Editar</button>
        <button class="btn btn-primary btn-sm" data-action="download" data-id="${doc.id}">Baixar PDF</button>
        <button class="btn btn-outline btn-sm" data-action="duplicate" data-id="${doc.id}">Duplicar</button>
        <button class="btn btn-danger btn-sm" data-action="delete" data-id="${doc.id}">Excluir</button>
      </div>
    </div>
  `).join('');

  // Add event listeners for document actions
  container.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      const id = e.target.dataset.id;
      handleDocumentAction(action, id);
    });
  });

  renderPagination(pagination);
}

function renderPagination(pagination) {
  const container = document.getElementById('documentsPagination');
  if (!container || !pagination || pagination.totalPages <= 1) {
    if (container) container.innerHTML = '';
    return;
  }

  let html = '<nav class="pagination-nav">';
  if (pagination.currentPage > 1) {
    html += `<button class="btn btn-sm" data-page="${pagination.currentPage - 1}">Anterior</button>`;
  }
  
  for (let i = 1; i <= pagination.totalPages; i++) {
    if (i === 1 || i === pagination.totalPages || 
        (i >= pagination.currentPage - 1 && i <= pagination.currentPage + 1)) {
      html += `<button class="btn btn-sm ${i === pagination.currentPage ? 'btn-primary' : 'btn-outline'}" 
                data-page="${i}">${i}</button>`;
    } else if (i === pagination.currentPage - 2 || i === pagination.currentPage + 2) {
      html += '<span class="pagination-ellipsis">...</span>';
    }
  }
  
  if (pagination.currentPage < pagination.totalPages) {
    html += `<button class="btn btn-sm" data-page="${pagination.currentPage + 1}">Próximo</button>`;
  }
  html += '</nav>';

  container.innerHTML = html;

  container.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => loadDocuments(parseInt(btn.dataset.page)));
  });
}

async function handleDocumentAction(action, id) {
  const { navigateTo } = await import('../modules/router.js');
  
  switch (action) {
    case 'edit':
      navigateTo('documents');
      // TODO: Open editor with document ID
      break;
    case 'download':
      downloadDocument(id);
      break;
    case 'duplicate':
      duplicateDocument(id);
      break;
    case 'delete':
      if (confirm('Tem certeza que deseja excluir este documento?')) {
        await deleteDocument(id);
        loadDocuments();
      }
      break;
  }
}

async function downloadDocument(id) {
  try {
    const { apiFetch } = await import('../modules/auth.js');
    const response = await fetch(`${window.API_BASE_URL}/api/documents/${id}/download`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('documentos_rurais_session_token')}` }
    });
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `documento-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Download failed:', error);
    alert('Erro ao baixar documento');
  }
}

async function duplicateDocument(id) {
  try {
    const { apiFetch } = await import('../modules/auth.js');
    await apiFetch(`/api/documents/${id}/duplicate`, { method: 'POST' });
    loadDocuments();
  } catch (error) {
    console.error('Duplicate failed:', error);
    alert('Erro ao duplicar documento');
  }
}

async function deleteDocument(id) {
  try {
    const { apiFetch } = await import('../modules/auth.js');
    await apiFetch(`/api/documents/${id}`, { method: 'DELETE' });
  } catch (error) {
    console.error('Delete failed:', error);
    alert('Erro ao excluir documento');
  }
}

function openDocumentWizard() {
  import('../modules/router.js').then(({ navigateTo }) => {
    navigateTo('documents');
    // TODO: Open wizard modal or navigate to wizard step
  });
}

function getTypeClass(type) {
  const classes = { contract: 'primary', declaration: 'success', procuration: 'warning', other: 'secondary' };
  return classes[type] || 'secondary';
}

function getTypeLabel(type) {
  const labels = { contract: 'Contrato', declaration: 'Declaração', procuration: 'Procurção', other: 'Outro' };
  return labels[type] || type;
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}