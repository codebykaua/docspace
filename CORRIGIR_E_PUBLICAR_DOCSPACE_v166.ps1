[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$ErrorActionPreference = "Stop"
$PSNativeCommandUseErrorActionPreference = $false

$Projeto = (Get-Location).Path
$Frontend = Join-Path $Projeto "frontend"
$Css = Join-Path $Frontend "lovable-original.css"
$Css2 = Join-Path $Frontend "style.css"
$Index = Join-Path $Frontend "index.html"
$ScriptJs = Join-Path $Frontend "script.js"
$Versao = "166"
$RepositorioUrl = "https://github.com/codebykaua/docspace.git"
$SiteUrl = "https://codebykaua.github.io/docspace/"
$Utf8 = [System.Text.UTF8Encoding]::new($false)

function Falhar([string]$Mensagem) {
    Write-Host "`nERRO: $Mensagem" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $Index) -or -not (Test-Path $ScriptJs)) {
    Falhar "Execute este arquivo na pasta principal do DocSpace."
}

$Inicio = "/* DOCSPACE V166 - PDF HUB CORRIGIDO */"
$Fim = "/* FIM DOCSPACE V166 */"

$Bloco = @'
/* DOCSPACE V166 - PDF HUB CORRIGIDO */

/*
  Correção definitiva da central de ferramentas PDF:
  - o cabeçalho azul fica no topo;
  - filtros e cartões permanecem visíveis;
  - a rolagem acontece dentro da biblioteca;
  - a ferramenta aberta fica abaixo, sem sobreposição.
*/
body[data-view="pdf"] .pdf-hub {
  display: flex !important;
  flex-direction: column !important;
  position: relative !important;
  isolation: isolate !important;
  width: 100% !important;
  min-width: 0 !important;
  height: clamp(320px, 43vh, 460px) !important;
  min-height: 320px !important;
  max-height: 460px !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden !important;
  visibility: visible !important;
  opacity: 1 !important;
}

body[data-view="pdf"] .pdf-hub-header {
  position: relative !important;
  z-index: 3 !important;
  flex: 0 0 auto !important;
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto !important;
  align-items: center !important;
  width: 100% !important;
  min-height: 84px !important;
  height: auto !important;
  padding: 16px 18px !important;
  overflow: visible !important;
}

body[data-view="pdf"] .pdf-hub-body {
  position: relative !important;
  z-index: 2 !important;
  flex: 1 1 auto !important;
  display: block !important;
  width: 100% !important;
  min-width: 0 !important;
  min-height: 220px !important;
  height: auto !important;
  max-height: none !important;
  padding: 12px 14px 14px !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  overscroll-behavior: contain !important;
  scrollbar-gutter: stable !important;
  visibility: visible !important;
  opacity: 1 !important;
  background: var(--surface, #fff) !important;
}

body[data-view="pdf"] .pdf-category-chips {
  position: sticky !important;
  top: 0 !important;
  z-index: 5 !important;
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 7px !important;
  width: 100% !important;
  margin: 0 0 10px !important;
  padding: 2px 0 8px !important;
  background: var(--surface, #fff) !important;
  visibility: visible !important;
  opacity: 1 !important;
}

body[data-view="pdf"] .pdf-tool-grid {
  display: grid !important;
  grid-template-columns: repeat(5, minmax(135px, 1fr)) !important;
  grid-auto-rows: minmax(72px, auto) !important;
  gap: 8px !important;
  position: relative !important;
  width: 100% !important;
  min-width: 0 !important;
  height: auto !important;
  min-height: 160px !important;
  max-height: none !important;
  padding: 0 2px 8px 0 !important;
  margin: 0 !important;
  overflow: visible !important;
  align-content: start !important;
  visibility: visible !important;
  opacity: 1 !important;
}

body[data-view="pdf"] .pdf-tool-card {
  display: grid !important;
  min-width: 0 !important;
  min-height: 72px !important;
  height: auto !important;
  padding: 9px !important;
  overflow: hidden !important;
  visibility: visible !important;
  opacity: 1 !important;
}

body[data-view="pdf"] .pdf-workbench {
  display: block !important;
  position: relative !important;
  z-index: 1 !important;
  clear: both !important;
  width: 100% !important;
  min-width: 0 !important;
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
  margin: 14px 0 18px !important;
  overflow: visible !important;
  transform: none !important;
}

body[data-view="pdf"] .content-area {
  display: block !important;
  min-height: 0 !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  scroll-behavior: auto !important;
}

@media (min-width: 1450px) {
  body[data-view="pdf"] .pdf-tool-grid {
    grid-template-columns: repeat(6, minmax(130px, 1fr)) !important;
  }
}

@media (max-width: 1250px) {
  body[data-view="pdf"] .pdf-tool-grid {
    grid-template-columns: repeat(4, minmax(130px, 1fr)) !important;
  }
}

@media (max-width: 900px) {
  body[data-view="pdf"] .pdf-hub {
    height: clamp(300px, 46vh, 410px) !important;
    min-height: 300px !important;
  }

  body[data-view="pdf"] .pdf-tool-grid {
    grid-template-columns: repeat(3, minmax(120px, 1fr)) !important;
  }
}

@media (max-width: 680px) {
  body[data-view="pdf"] .pdf-hub {
    height: auto !important;
    min-height: 0 !important;
    max-height: none !important;
    overflow: visible !important;
  }

  body[data-view="pdf"] .pdf-hub-header {
    grid-template-columns: 1fr !important;
  }

  body[data-view="pdf"] .pdf-hub-body {
    min-height: 0 !important;
    max-height: none !important;
    overflow: visible !important;
  }

  body[data-view="pdf"] .pdf-category-chips {
    position: relative !important;
    top: auto !important;
  }

  body[data-view="pdf"] .pdf-tool-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
}

@media (max-width: 430px) {
  body[data-view="pdf"] .pdf-tool-grid {
    grid-template-columns: 1fr !important;
  }
}

/* FIM DOCSPACE V166 */
'@

function AplicarCss([string]$Arquivo) {
    if (-not (Test-Path $Arquivo)) { return }
    $Conteudo = [System.IO.File]::ReadAllText($Arquivo, [System.Text.Encoding]::UTF8)
    $Padrao = [regex]::Escape($Inicio) + ".*?" + [regex]::Escape($Fim)

    if ([regex]::IsMatch($Conteudo, $Padrao, [System.Text.RegularExpressions.RegexOptions]::Singleline)) {
        $Conteudo = [regex]::Replace(
            $Conteudo,
            $Padrao,
            [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $Bloco.Trim() },
            [System.Text.RegularExpressions.RegexOptions]::Singleline
        )
    } else {
        $Conteudo = $Conteudo.TrimEnd() + "`r`n`r`n" + $Bloco.Trim() + "`r`n"
    }

    [System.IO.File]::WriteAllText($Arquivo, $Conteudo, $Utf8)
}

Write-Host "`n=== CORRIGINDO A CENTRAL PDF ===" -ForegroundColor Cyan
AplicarCss $Css
AplicarCss $Css2

Write-Host "`n=== CORRIGINDO A POSICAO DE ROLAGEM ===" -ForegroundColor Cyan
$Js = [System.IO.File]::ReadAllText($ScriptJs, [System.Text.Encoding]::UTF8)

$Marcador = 'function resetPdfToolsViewport() {'
if ($Js.Contains($Marcador)) {
    $Js = $Js.Replace(
        'function resetPdfToolsViewport() {',
        @'
function resetPdfToolsViewport() {
        const forcePdfTop = () => {
            const content = refs.content;
            if (content) {
                content.scrollTop = 0;
                content.scrollLeft = 0;
            }
            const workspace = content?.closest?.(".workspace");
            if (workspace) workspace.scrollTop = 0;
            const hub = content?.querySelector?.(".pdf-hub");
            if (hub) {
                const body = hub.querySelector(".pdf-hub-body");
                if (body) body.scrollTop = 0;
            }
        };
        forcePdfTop();
'@
    )
}

[System.IO.File]::WriteAllText($ScriptJs, $Js, $Utf8)

Write-Host "`n=== ATUALIZANDO VERSAO E CACHE ===" -ForegroundColor Cyan
$Html = [System.IO.File]::ReadAllText($Index, [System.Text.Encoding]::UTF8)
$Html = [regex]::Replace($Html, 'style\.css\?v=\d+', 'style.css?v=166')
$Html = [regex]::Replace($Html, 'lovable-original\.css\?v=\d+', 'lovable-original.css?v=166')
$Html = [regex]::Replace($Html, 'script\.js\?v=\d+', 'script.js?v=166')
$Html = [regex]::Replace($Html, 'cache-reset-v\d+\.js\?v=\d+', 'cache-reset-v166.js?v=166')
[System.IO.File]::WriteAllText($Index, $Html, $Utf8)

[System.IO.File]::WriteAllText((Join-Path $Projeto "VERSION.txt"), "v166`r`n", $Utf8)
[System.IO.File]::WriteAllText((Join-Path $Frontend "VERSION.txt"), "v166`r`n", $Utf8)
[System.IO.File]::WriteAllText(
    (Join-Path $Frontend "version.json"),
    '{"version":"1.66","build":166,"hosting":"github-pages"}' + "`r`n",
    $Utf8
)

$CacheAnterior = Get-ChildItem -LiteralPath $Frontend -Filter "cache-reset-v*.js" |
    Where-Object { $_.Name -ne "cache-reset-v166.js" } |
    Sort-Object Name -Descending |
    Select-Object -First 1

if ($CacheAnterior) {
    $Cache = [System.IO.File]::ReadAllText($CacheAnterior.FullName, [System.Text.Encoding]::UTF8)
    $Cache = [regex]::Replace($Cache, 'DOCSPACE_BUILD\s*=\s*"[^"]+"', 'DOCSPACE_BUILD = "1.66"')
    $Cache = [regex]::Replace($Cache, 'dataset\.docspaceBuild\s*=\s*"[^"]+"', 'dataset.docspaceBuild = "1.66"')
    $Cache = [regex]::Replace($Cache, 'docspace-cache-reset-v\d+', 'docspace-cache-reset-v166')
    $Cache = [regex]::Replace($Cache, 'set\("build",\s*"\d+"\)', 'set("build", "166")')
    [System.IO.File]::WriteAllText((Join-Path $Frontend "cache-reset-v166.js"), $Cache, $Utf8)
}

Write-Host "`n=== VALIDANDO ===" -ForegroundColor Cyan
node --check $ScriptJs
if ($LASTEXITCODE -ne 0) { Falhar "O JavaScript apresentou erro." }

$Teste = [System.IO.File]::ReadAllText($Css, [System.Text.Encoding]::UTF8)
if ($Teste -notmatch "DOCSPACE V166" -or $Teste -notmatch "height: clamp\(320px, 43vh, 460px\)") {
    Falhar "A correção da central PDF não foi aplicada."
}

Write-Host "`n=== PUBLICANDO ===" -ForegroundColor Cyan
git config user.name "DocSpace Publisher"
git config user.email "codebykaua@users.noreply.github.com"

$Remotos = @(git remote)
if ($Remotos -contains "origin") {
    git remote set-url origin $RepositorioUrl
} else {
    git remote add origin $RepositorioUrl
}

git add -A
if (git status --porcelain) {
    git commit -m "DocSpace v166 - central PDF visível em zoom 100%"
    if ($LASTEXITCODE -ne 0) { Falhar "Não foi possível criar o commit." }
}

git push -u origin main
if ($LASTEXITCODE -ne 0) { Falhar "Não foi possível enviar a main." }

$Publicacao = Join-Path $env:TEMP "docspace-gh-pages-v166"
if (Test-Path $Publicacao) {
    Remove-Item $Publicacao -Recurse -Force -ErrorAction SilentlyContinue
}

git clone $RepositorioUrl $Publicacao
if ($LASTEXITCODE -ne 0) { Falhar "Não foi possível clonar o repositório." }

Push-Location $Publicacao
git checkout --orphan docspace-publicacao-v166
if ($LASTEXITCODE -ne 0) {
    Pop-Location
    Falhar "Não foi possível criar a publicação."
}

Get-ChildItem -Force |
    Where-Object { $_.Name -ne ".git" } |
    Remove-Item -Recurse -Force

Get-ChildItem -LiteralPath $Frontend -Force |
    Copy-Item -Destination $Publicacao -Recurse -Force

New-Item -Path (Join-Path $Publicacao ".nojekyll") -ItemType File -Force | Out-Null

git add -A
git -c user.name="DocSpace Publisher" `
    -c user.email="codebykaua@users.noreply.github.com" `
    commit -m "Publica DocSpace v166"

git push origin HEAD:gh-pages --force
$Resultado = $LASTEXITCODE
Pop-Location

if ($Resultado -ne 0) { Falhar "Não foi possível atualizar a gh-pages." }

Write-Host "`n============================================" -ForegroundColor Green
Write-Host "DOCSPACE V166 PUBLICADO" -ForegroundColor Green
Write-Host "Filtros e ferramentas PDF agora ficam visíveis." -ForegroundColor Green
Write-Host "Site: ${SiteUrl}?build=166" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green

Start-Process "${SiteUrl}?build=166"
