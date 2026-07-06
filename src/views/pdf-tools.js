// PDF Tools View Module

export function initPdfTools(container) {
  container.innerHTML = `
    <div class="pdf-tools-view">
      <h2>Ferramentas PDF</h2>
      
      <div class="tools-grid" id="toolsGrid">
        <div class="tool-card" data-tool="compress">
          <div class="tool-icon">📦</div>
          <h3>Comprimir PDF</h3>
          <p>Reduza o tamanho do arquivo mantendo a qualidade</p>
          <button class="btn btn-primary" data-action="open">Usar</button>
        </div>
        
        <div class="tool-card" data-tool="ocr">
          <div class="tool-icon">🔍</div>
          <h3>OCR (Reconhecimento de Texto)</h3>
          <p>Transforme PDFs escaneados em texto pesquisável</p>
          <button class="btn btn-primary" data-action="open">Usar</button>
        </div>
        
        <div class="tool-card" data-tool="merge">
          <div class="tool-icon">🔗</div>
          <h3>Mesclar PDFs</h3>
          <p>Combine múltiplos arquivos em um único PDF</p>
          <button class="btn btn-primary" data-action="open">Usar</button>
        </div>
        
        <div class="tool-card" data-tool="split">
          <div class="tool-icon">✂️</div>
          <h3>Dividir PDF</h3>
          <p>Separe páginas ou extraia intervalos específicos</p>
          <button class="btn btn-primary" data-action="open">Usar</button>
        </div>
        
        <div class="tool-card" data-tool="rotate">
          <div class="tool-icon">🔄</div>
          <h3>Rotacionar Páginas</h3>
          <p>Gire páginas individuais ou o documento inteiro</p>
          <button class="btn btn-primary" data-action="open">Usar</button>
        </div>
        
        <div class="tool-card" data-tool="watermark">
          <div class="tool-icon">💧</div>
          <h3>Marca d'Água</h3>
          <p>Adicione marca d'água de texto ou imagem</p>
          <button class="btn btn-primary" data-action="open">Usar</button>
        </div>
        
        <div class="tool-card" data-tool="protect">
          <div class="tool-icon">🔒</div>
          <h3>Proteger PDF</h3>
          <p>Adicione senha e permissões de segurança</p>
          <button class="btn btn-primary" data-action="open">Usar</button>
        </div>
        
        <div class="tool-card" data-tool="unlock">
          <div class="tool-icon">🔓</div>
          <h3>Remover Senha</h3>
          <p>Remova a proteção de PDFs conhecidos</p>
          <button class="btn btn-primary" data-action="open">Usar</button>
        </div>
        
        <div class="tool-card" data-tool="convert">
          <div class="tool-icon">🔄</div>
          <h3>Converter</h3>
          <p>PDF para Word, Excel, Imagens e vice-versa</p>
          <button class="btn btn-primary" data-action="open">Usar</button>
        </div>
      </div>

      <div class="panel" id="toolWorkspace" style="display: none;">
        <div class="workspace-header">
          <h3 id="toolTitle"></h3>
          <button class="btn btn-outline" id="backToTools">← Voltar</button>
        </div>
        <div id="toolContent"></div>
      </div>

      <div class="panel" id="recentJobs">
        <h3>Processamentos Recentes</h3>
        <div id="jobsList" class="jobs-list">
          <p class="message">Carregando histórico...</p>
        </div>
      </div>
    </div>
  `;

  setupEventListeners(container);
  loadRecentJobs();
}

function setupEventListeners(container) {
  // Tool card clicks
  container.querySelectorAll('.tool-card [data-action="open"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const toolCard = e.target.closest('.tool-card');
      const tool = toolCard.dataset.tool;
      openTool(tool);
    });
  });

  // Back button
  const backBtn = container.querySelector('#backToTools');
  if (backBtn) {
    backBtn.addEventListener('click', () => showToolsGrid());
  }
}

function showToolsGrid() {
  document.getElementById('toolsGrid').style.display = 'grid';
  document.getElementById('toolWorkspace').style.display = 'none';
}

function openTool(tool) {
  document.getElementById('toolsGrid').style.display = 'none';
  const workspace = document.getElementById('toolWorkspace');
  workspace.style.display = 'block';

  const titles = {
    compress: 'Comprimir PDF',
    ocr: 'OCR - Reconhecimento de Texto',
    merge: 'Mesclar PDFs',
    split: 'Dividir PDF',
    rotate: 'Rotacionar Páginas',
    watermark: 'Adicionar Marca d\'Água',
    protect: 'Proteger PDF',
    unlock: 'Remover Senha',
    convert: 'Converter Arquivos'
  };

  document.getElementById('toolTitle').textContent = titles[tool] || 'Ferramenta PDF';
  renderToolContent(tool);
}

function renderToolContent(tool) {
  const content = document.getElementById('toolContent');
  
  const templates = {
    compress: `
      <div class="tool-form">
        <div class="drop-zone" id="compressDropZone">
          <p>Arraste seu PDF aqui ou <button type="button" class="btn btn-link" id="compressFileBtn">clique para selecionar</button></p>
          <input type="file" id="compressFileInput" accept=".pdf" style="display: none;">
        </div>
        <div class="form-group">
          <label>Nível de compressão</label>
          <select id="compressLevel">
            <option value="low">Baixo (melhor qualidade)</option>
            <option value="medium" selected>Médio (recomendado)</option>
            <option value="high">Alto (menor tamanho)</option>
          </select>
        </div>
        <button class="btn btn-primary" id="compressProcessBtn" disabled>Comprimir</button>
        <div id="compressResult" class="result" style="display: none;"></div>
      </div>
    `,
    ocr: `
      <div class="tool-form">
        <div class="drop-zone" id="ocrDropZone">
          <p>Arraste seu PDF escaneado aqui ou <button type="button" class="btn btn-link" id="ocrFileBtn">clique para selecionar</button></p>
          <input type="file" id="ocrFileInput" accept=".pdf" style="display: none;">
        </div>
        <div class="form-group">
          <label>Idioma</label>
          <select id="ocrLanguage">
            <option value="por">Português</option>
            <option value="eng">Inglês</option>
            <option value="spa">Espanhol</option>
            <option value="fra">Francês</option>
          </select>
        </div>
        <button class="btn btn-primary" id="ocrProcessBtn" disabled>Processar OCR</button>
        <div id="ocrResult" class="result" style="display: none;"></div>
      </div>
    `,
    merge: `
      <div class="tool-form">
        <div class="file-list" id="mergeFileList">
          <p class="message">Nenhum arquivo adicionado</p>
        </div>
        <div class="drop-zone" id="mergeDropZone">
          <p>Arraste PDFs aqui ou <button type="button" class="btn btn-link" id="mergeFileBtn">clique para adicionar</button></p>
          <input type="file" id="mergeFileInput" accept=".pdf" multiple style="display: none;">
        </div>
        <button class="btn btn-primary" id="mergeProcessBtn" disabled>Mesclar PDFs</button>
        <div id="mergeResult" class="result" style="display: none;"></div>
      </div>
    `,
    split: `
      <div class="tool-form">
        <div class="drop-zone" id="splitDropZone">
          <p>Arraste seu PDF aqui ou <button type="button" class="btn btn-link" id="splitFileBtn">clique para selecionar</button></p>
          <input type="file" id="splitFileInput" accept=".pdf" style="display: none;">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Modo de divisão</label>
            <select id="splitMode">
              <option value="pages">Extrair páginas específicas</option>
              <option value="range">Dividir por intervalo</option>
              <option value="each">Cada página como arquivo separado</option>
            </select>
          </div>
          <div class="form-group" id="splitPagesGroup">
            <label>Páginas (ex: 1,3,5-7)</label>
            <input type="text" id="splitPages" placeholder="1,3,5-7">
          </div>
        </div>
        <button class="btn btn-primary" id="splitProcessBtn" disabled>Dividir</button>
        <div id="splitResult" class="result" style="display: none;"></div>
      </div>
    `,
    rotate: `
      <div class="tool-form">
        <div class="drop-zone" id="rotateDropZone">
          <p>Arraste seu PDF aqui ou <button type="button" class="btn btn-link" id="rotateFileBtn">clique para selecionar</button></p>
          <input type="file" id="rotateFileInput" accept=".pdf" style="display: none;">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Rotação</label>
            <select id="rotateAngle">
              <option value="90">90° (Horário)</option>
              <option value="180">180°</option>
              <option value="270">270° (Anti-horário)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Aplicar a</label>
            <select id="rotateScope">
              <option value="all">Todas as páginas</option>
              <option value="selection">Páginas específicas</option>
            </select>
          </div>
        </div>
        <div class="form-group" id="rotatePagesGroup" style="display: none;">
          <label>Páginas (ex: 1,3,5-7)</label>
          <input type="text" id="rotatePages" placeholder="1,3,5-7">
        </div>
        <button class="btn btn-primary" id="rotateProcessBtn" disabled>Rotacionar</button>
        <div id="rotateResult" class="result" style="display: none;"></div>
      </div>
    `,
    watermark: `
      <div class="tool-form">
        <div class="drop-zone" id="watermarkDropZone">
          <p>Arraste seu PDF aqui ou <button type="button" class="btn btn-link" id="watermarkFileBtn">clique para selecionar</button></p>
          <input type="file" id="watermarkFileInput" accept=".pdf" style="display: none;">
        </div>
        <div class="form-group">
          <label>Tipo</label>
          <select id="watermarkType">
            <option value="text">Texto</option>
            <option value="image">Imagem</option>
          </select>
        </div>
        <div class="form-group" id="watermarkTextGroup">
          <label>Texto da marca d'água</label>
          <input type="text" id="watermarkText" placeholder="CONFIDENCIAL">
        </div>
        <div class="form-group" id="watermarkImageGroup" style="display: none;">
          <label>Imagem</label>
          <input type="file" id="watermarkImageInput" accept="image/*">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Opacidade (%)</label>
            <input type="range" id="watermarkOpacity" min="10" max="100" value="30">
          </div>
          <div class="form-group">
            <label>Rotação (°)</label>
            <input type="range" id="watermarkRotation" min="-45" max="45" value="-30">
          </div>
        </div>
        <button class="btn btn-primary" id="watermarkProcessBtn" disabled>Aplicar</button>
        <div id="watermarkResult" class="result" style="display: none;"></div>
      </div>
    `,
    protect: `
      <div class="tool-form">
        <div class="drop-zone" id="protectDropZone">
          <p>Arraste seu PDF aqui ou <button type="button" class="btn btn-link" id="protectFileBtn">clique para selecionar</button></p>
          <input type="file" id="protectFileInput" accept=".pdf" style="display: none;">
        </div>
        <div class="form-group">
          <label>Senha de abertura</label>
          <input type="password" id="protectOpenPassword" placeholder="Senha para abrir o PDF">
        </div>
        <div class="form-group">
          <label>Senha de permissões (opcional)</label>
          <input type="password" id="protectPermPassword" placeholder="Senha para editar/imprimir">
        </div>
        <div class="form-group">
          <label>Permissões</label>
          <div class="checkbox-group">
            <label><input type="checkbox" id="permPrint" checked> Permitir impressão</label>
            <label><input type="checkbox" id="permCopy" checked> Permitir cópia</label>
            <label><input type="checkbox" id="permModify"> Permitir modificação</label>
            <label><input type="checkbox" id="permAnnotate"> Permitir anotações</label>
          </div>
        </div>
        <button class="btn btn-primary" id="protectProcessBtn" disabled>Proteger</button>
        <div id="protectResult" class="result" style="display: none;"></div>
      </div>
    `,
    unlock: `
      <div class="tool-form">
        <div class="drop-zone" id="unlockDropZone">
          <p>Arraste seu PDF protegido aqui ou <button type="button" class="btn btn-link" id="unlockFileBtn">clique para selecionar</button></p>
          <input type="file" id="unlockFileInput" accept=".pdf" style="display: none;">
        </div>
        <div class="form-group">
          <label>Senha do PDF</label>
          <input type="password" id="unlockPassword" placeholder="Digite a senha do PDF">
        </div>
        <button class="btn btn-primary" id="unlockProcessBtn" disabled>Remover Proteção</button>
        <div id="unlockResult" class="result" style="display: none;"></div>
      </div>
    `,
    convert: `
      <div class="tool-form">
        <div class="form-group">
          <label>Conversão</label>
          <select id="convertType">
            <option value="pdf-to-word">PDF → Word (.docx)</option>
            <option value="pdf-to-excel">PDF → Excel (.xlsx)</option>
            <option value="pdf-to-images">PDF → Imagens (ZIP)</option>
            <option value="word-to-pdf">Word → PDF</option>
            <option value="excel-to-pdf">Excel → PDF</option>
            <option value="images-to-pdf">Imagens → PDF</option>
          </select>
        </div>
        <div class="drop-zone" id="convertDropZone">
          <p>Arraste arquivos aqui ou <button type="button" class="btn btn-link" id="convertFileBtn">clique para selecionar</button></p>
          <input type="file" id="convertFileInput" style="display: none;">
        </div>
        <button class="btn btn-primary" id="convertProcessBtn" disabled>Converter</button>
        <div id="convertResult" class="result" style="display: none;"></div>
      </div>
    `
  };

  content.innerHTML = templates[tool] || '<p class="message error">Ferramenta não encontrada</p>';
  setupToolEvents(tool);
}

function setupToolEvents(tool) {
  // Common drop zone setup
  const dropZone = document.querySelector('.drop-zone');
  const fileInput = dropZone?.querySelector('input[type="file"]');
  const fileBtn = dropZone?.querySelector('.btn-link');
  
  if (fileBtn && fileInput) {
    fileBtn.addEventListener('click', () => fileInput.click());
  }
  
  if (dropZone && fileInput) {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        handleFileSelect(tool, fileInput.files);
      }
    });
    fileInput.addEventListener('change', () => handleFileSelect(tool, fileInput.files));
  }

  // Tool-specific event handlers
  const processBtn = document.querySelector(`#${tool}ProcessBtn`);
  if (processBtn) {
    processBtn.addEventListener('click', () => processTool(tool));
  }

  // Watermark type change
  if (tool === 'watermark') {
    const typeSelect = document.getElementById('watermarkType');
    if (typeSelect) {
      typeSelect.addEventListener('change', (e) => {
        document.getElementById('watermarkTextGroup').style.display = e.target.value === 'text' ? 'block' : 'none';
        document.getElementById('watermarkImageGroup').style.display = e.target.value === 'image' ? 'block' : 'none';
      });
    }
  }

  // Rotate scope change
  if (tool === 'rotate') {
    const scopeSelect = document.getElementById('rotateScope');
    if (scopeSelect) {
      scopeSelect.addEventListener('change', (e) => {
        document.getElementById('rotatePagesGroup').style.display = e.target.value === 'selection' ? 'block' : 'none';
      });
    }
  }

  // Split mode change
  if (tool === 'split') {
    const modeSelect = document.getElementById('splitMode');
    if (modeSelect) {
      modeSelect.addEventListener('change', (e) => {
        document.getElementById('splitPagesGroup').style.display = e.target.value !== 'each' ? 'block' : 'none';
      });
    }
  }
}

let selectedFiles = [];

function handleFileSelect(tool, files) {
  selectedFiles = Array.from(files);
  const processBtn = document.querySelector(`#${tool}ProcessBtn`);
  if (processBtn) {
    processBtn.disabled = selectedFiles.length === 0;
  }
  
  // Update drop zone text
  const dropZone = document.querySelector('.drop-zone');
  if (dropZone && selectedFiles.length) {
    dropZone.innerHTML = `<p>${selectedFiles.length} arquivo(s) selecionado(s)</p>`;
  }
}

async function processTool(tool) {
  if (!selectedFiles.length) return;

  const processBtn = document.querySelector(`#${tool}ProcessBtn`);
  const resultDiv = document.querySelector(`#${tool}Result`);
  
  processBtn.disabled = true;
  processBtn.textContent = 'Processando...';
  resultDiv.style.display = 'none';

  try {
    const { apiFetch } = await import('../modules/auth.js');
    const formData = new FormData();
    
    selectedFiles.forEach((file, i) => formData.append('files', file));
    
    // Add tool-specific options
    switch (tool) {
      case 'compress':
        formData.append('level', document.getElementById('compressLevel').value);
        break;
      case 'ocr':
        formData.append('language', document.getElementById('ocrLanguage').value);
        break;
      case 'merge':
        // Files already added
        break;
      case 'split':
        formData.append('mode', document.getElementById('splitMode').value);
        if (document.getElementById('splitMode').value !== 'each') {
          formData.append('pages', document.getElementById('splitPages').value);
        }
        break;
      case 'rotate':
        formData.append('angle', document.getElementById('rotateAngle').value);
        formData.append('scope', document.getElementById('rotateScope').value);
        if (document.getElementById('rotateScope').value === 'selection') {
          formData.append('pages', document.getElementById('rotatePages').value);
        }
        break;
      case 'watermark':
        formData.append('type', document.getElementById('watermarkType').value);
        if (document.getElementById('watermarkType').value === 'text') {
          formData.append('text', document.getElementById('watermarkText').value);
        }
        formData.append('opacity', document.getElementById('watermarkOpacity').value);
        formData.append('rotation', document.getElementById('watermarkRotation').value);
        break;
      case 'protect':
        formData.append('openPassword', document.getElementById('protectOpenPassword').value);
        formData.append('permPassword', document.getElementById('protectPermPassword').value);
        formData.append('allowPrint', document.getElementById('permPrint').checked);
        formData.append('allowCopy', document.getElementById('permCopy').checked);
        formData.append('allowModify', document.getElementById('permModify').checked);
        formData.append('allowAnnotate', document.getElementById('permAnnotate').checked);
        break;
      case 'unlock':
        formData.append('password', document.getElementById('unlockPassword').value);
        break;
      case 'convert':
        formData.append('type', document.getElementById('convertType').value);
        break;
    }

    const token = localStorage.getItem('documentos_rurais_session_token');
    const response = await fetch(`${window.API_BASE_URL}/api/pdf/${tool}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    const data = await response.json();
    
    if (response.ok && data.downloadUrl) {
      showResult(resultDiv, 'success', 'Processamento concluído!', data.downloadUrl);
      loadRecentJobs();
    } else {
      showResult(resultDiv, 'error', data.message || 'Erro no processamento');
    }
  } catch (error) {
    console.error('PDF tool error:', error);
    showResult(resultDiv, 'error', 'Erro de conexão: ' + error.message);
  } finally {
    processBtn.disabled = false;
    processBtn.textContent = getProcessButtonText(tool);
  }
}

function getProcessButtonText(tool) {
  const texts = {
    compress: 'Comprimir',
    ocr: 'Processar OCR',
    merge: 'Mesclar PDFs',
    split: 'Dividir',
    rotate: 'Rotacionar',
    watermark: 'Aplicar',
    protect: 'Proteger',
    unlock: 'Remover Proteção',
    convert: 'Converter'
  };
  return texts[tool] || 'Processar';
}

function showResult(container, type, message, downloadUrl = null) {
  container.className = `result ${type}`;
  container.style.display = 'block';
  
  let html = `<p>${message}</p>`;
  if (downloadUrl) {
    html += `<a href="${downloadUrl}" class="btn btn-primary" download>Baixar Resultado</a>`;
  }
  container.innerHTML = html;
}

async function loadRecentJobs() {
  const container = document.getElementById('jobsList');
  if (!container) return;

  try {
    const { apiFetch } = await import('../modules/auth.js');
    const data = await apiFetch('/api/pdf/jobs?limit=10');
    
    if (!data.jobs?.length) {
      container.innerHTML = '<p class="message">Nenhum processamento recente.</p>';
      return;
    }

    container.innerHTML = data.jobs.map(job => `
      <div class="job-item">
        <div class="job-info">
          <span class="job-tool">${getToolLabel(job.tool)}</span>
          <span class="job-status status-${job.status}">${getStatusLabel(job.status)}</span>
        </div>
        <div class="job-meta">
          <small>${formatDate(job.createdAt)}</small>
          ${job.downloadUrl ? `<a href="${job.downloadUrl}" class="btn btn-sm btn-outline">Baixar</a>` : ''}
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Failed to load jobs:', error);
    container.innerHTML = '<p class="message error">Erro ao carregar histórico.</p>';
  }
}

function getToolLabel(tool) {
  const labels = {
    compress: 'Comprimir', ocr: 'OCR', merge: 'Mesclar', split: 'Dividir',
    rotate: 'Rotacionar', watermark: 'Marca d\'Água', protect: 'Proteger',
    unlock: 'Desbloquear', convert: 'Converter'
  };
  return labels[tool] || tool;
}

function getStatusLabel(status) {
  const labels = { pending: 'Pendente', processing: 'Processando', completed: 'Concluído', failed: 'Falhou' };
  return labels[status] || status;
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR');
}