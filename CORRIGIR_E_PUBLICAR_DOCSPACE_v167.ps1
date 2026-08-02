[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$ErrorActionPreference = "Stop"
$PSNativeCommandUseErrorActionPreference = $false

$Projeto = (Get-Location).Path
$Frontend = Join-Path $Projeto "frontend"
$CssPrincipal = Join-Path $Frontend "style.css"
$CssLovable = Join-Path $Frontend "lovable-original.css"
$IndexPath = Join-Path $Frontend "index.html"
$ScriptPath = Join-Path $Frontend "script.js"
$RepositorioUrl = "https://github.com/codebykaua/docspace.git"
$SiteUrl = "https://codebykaua.github.io/docspace/"
$Utf8 = [System.Text.UTF8Encoding]::new($false)

function Falhar([string]$Mensagem) {
    Write-Host "`nERRO: $Mensagem" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $IndexPath) -or -not (Test-Path $ScriptPath)) {
    Falhar "Execute este arquivo na pasta principal do DocSpace."
}

Write-Host "`n=== REMOVENDO CORRECOES ANTIGAS CONFLITANTES ===" -ForegroundColor Cyan

function Limpar-BlocosAntigos([string]$Arquivo) {
    if (-not (Test-Path $Arquivo)) { return }

    $Conteudo = [System.IO.File]::ReadAllText($Arquivo, [System.Text.Encoding]::UTF8)

    foreach ($Versao in @("165", "166", "167")) {
        $Inicio = "/\* DOCSPACE V$Versao[^*]*\*/"
        $Fim = "/\* FIM DOCSPACE V$Versao \*/"
        $Padrao = $Inicio + ".*?" + $Fim
        $Conteudo = [regex]::Replace(
            $Conteudo,
            $Padrao,
            "",
            [System.Text.RegularExpressions.RegexOptions]::Singleline
        )
    }

    [System.IO.File]::WriteAllText($Arquivo, $Conteudo.TrimEnd() + "`r`n", $Utf8)
}

Limpar-BlocosAntigos $CssPrincipal
Limpar-BlocosAntigos $CssLovable

$CssFinal = @'
/* DOCSPACE V167 - LAYOUT PDF NATURAL EM ZOOM 100% */

/*
  Regra definitiva:
  não usar altura fixa na biblioteca PDF.
  A página rola naturalmente e todas as ferramentas aparecem.
*/
body[data-view="pdf"] .content-area,
body[data-view="pdf"] .main-content,
body[data-view="pdf"] .workspace-main {
  display: block !important;
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
}

body[data-view="pdf"] .pdf-hub {
  display: block !important;
  position: relative !important;
  width: 100% !important;
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
  margin: 0 0 14px !important;
  padding: 0 !important;
  overflow: visible !important;
  opacity: 1 !important;
  visibility: visible !important;
}

body[data-view="pdf"] .pdf-hub-header {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto !important;
  align-items: center !important;
  gap: 12px !important;
  position: relative !important;
  width: 100% !important;
  height: auto !important;
  min-height: 78px !important;
  max-height: none !important;
  padding: 14px 16px !important;
  overflow: visible !important;
}

body[data-view="pdf"] .pdf-hub-body {
  display: block !important;
  position: relative !important;
  width: 100% !important;
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
  padding: 10px 12px 14px !important;
  overflow: visible !important;
  opacity: 1 !important;
  visibility: visible !important;
  background: var(--surface, #fff) !important;
}

body[data-view="pdf"] .pdf-category-chips {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 6px !important;
  position: relative !important;
  top: auto !important;
  width: 100% !important;
  margin: 0 0 10px !important;
  padding: 0 !important;
  background: transparent !important;
  opacity: 1 !important;
  visibility: visible !important;
}

body[data-view="pdf"] .pdf-tool-grid {
  display: grid !important;
  grid-template-columns: repeat(5, minmax(130px, 1fr)) !important;
  grid-auto-rows: minmax(68px, auto) !important;
  gap: 8px !important;
  position: relative !important;
  width: 100% !important;
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: visible !important;
  align-content: start !important;
  opacity: 1 !important;
  visibility: visible !important;
}

body[data-view="pdf"] .pdf-tool-card {
  display: grid !important;
  min-width: 0 !important;
  min-height: 68px !important;
  height: auto !important;
  padding: 8px !important;
  overflow: hidden !important;
  opacity: 1 !important;
  visibility: visible !important;
}

body[data-view="pdf"] .pdf-workbench {
  display: block !important;
  position: relative !important;
  clear: both !important;
  width: 100% !important;
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
  margin: 14px 0 20px !important;
  overflow: visible !important;
  transform: none !important;
}

@media (min-width: 1500px) {
  body[data-view="pdf"] .pdf-tool-grid {
    grid-template-columns: repeat(6, minmax(125px, 1fr)) !important;
  }
}

@media (max-width: 1250px) {
  body[data-view="pdf"] .pdf-tool-grid {
    grid-template-columns: repeat(4, minmax(125px, 1fr)) !important;
  }
}

@media (max-width: 920px) {
  body[data-view="pdf"] .pdf-tool-grid {
    grid-template-columns: repeat(3, minmax(120px, 1fr)) !important;
  }
}

@media (max-width: 680px) {
  body[data-view="pdf"] .pdf-hub-header {
    grid-template-columns: 1fr !important;
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

/* FIM DOCSPACE V167 */
'@

[System.IO.File]::WriteAllText(
    $CssLovable,
    ([System.IO.File]::ReadAllText($CssLovable, [System.Text.Encoding]::UTF8).TrimEnd() + "`r`n`r`n" + $CssFinal.Trim() + "`r`n"),
    $Utf8
)

Write-Host "`n=== ATUALIZANDO CACHE PARA V167 ===" -ForegroundColor Cyan

$Html = [System.IO.File]::ReadAllText($IndexPath, [System.Text.Encoding]::UTF8)
$Html = [regex]::Replace($Html, 'style\.css\?v=\d+', 'style.css?v=167')
$Html = [regex]::Replace($Html, 'lovable-original\.css\?v=\d+', 'lovable-original.css?v=167')
$Html = [regex]::Replace($Html, 'script\.js\?v=\d+', 'script.js?v=167')
$Html = [regex]::Replace($Html, 'cache-reset-v\d+\.js\?v=\d+', 'cache-reset-v167.js?v=167')
[System.IO.File]::WriteAllText($IndexPath, $Html, $Utf8)

[System.IO.File]::WriteAllText((Join-Path $Projeto "VERSION.txt"), "v167`r`n", $Utf8)
[System.IO.File]::WriteAllText((Join-Path $Frontend "VERSION.txt"), "v167`r`n", $Utf8)
[System.IO.File]::WriteAllText(
    (Join-Path $Frontend "version.json"),
    '{"version":"1.67","build":167,"hosting":"github-pages"}' + "`r`n",
    $Utf8
)

$CacheAnterior = Get-ChildItem -LiteralPath $Frontend -Filter "cache-reset-v*.js" |
    Where-Object { $_.Name -ne "cache-reset-v167.js" } |
    Sort-Object Name -Descending |
    Select-Object -First 1

if ($CacheAnterior) {
    $Cache = [System.IO.File]::ReadAllText($CacheAnterior.FullName, [System.Text.Encoding]::UTF8)
    $Cache = [regex]::Replace($Cache, 'DOCSPACE_BUILD\s*=\s*"[^"]+"', 'DOCSPACE_BUILD = "1.67"')
    $Cache = [regex]::Replace($Cache, 'dataset\.docspaceBuild\s*=\s*"[^"]+"', 'dataset.docspaceBuild = "1.67"')
    $Cache = [regex]::Replace($Cache, 'docspace-cache-reset-v\d+', 'docspace-cache-reset-v167')
    $Cache = [regex]::Replace($Cache, 'set\("build",\s*"\d+"\)', 'set("build", "167")')
    [System.IO.File]::WriteAllText((Join-Path $Frontend "cache-reset-v167.js"), $Cache, $Utf8)
}

Write-Host "`n=== VALIDANDO ===" -ForegroundColor Cyan
node --check $ScriptPath
if ($LASTEXITCODE -ne 0) {
    Falhar "O JavaScript apresentou erro."
}

$ValidacaoCss = [System.IO.File]::ReadAllText($CssLovable, [System.Text.Encoding]::UTF8)
if ($ValidacaoCss -notmatch "DOCSPACE V167" -or $ValidacaoCss -notmatch "max-height: none") {
    Falhar "A correção v167 não foi aplicada."
}

Write-Host "`n=== PUBLICANDO NA MAIN ===" -ForegroundColor Cyan
git config user.name "DocSpace Publisher"
git config user.email "codebykaua@users.noreply.github.com"

$Remotos = @(git remote)
if ($Remotos -contains "origin") {
    git remote set-url origin $RepositorioUrl
}
else {
    git remote add origin $RepositorioUrl
}

git add -A
$Alteracoes = git status --porcelain
if ($Alteracoes) {
    git commit -m "DocSpace v167 - remove alturas fixas da central PDF"
    if ($LASTEXITCODE -ne 0) {
        Falhar "Não foi possível criar o commit."
    }
}

git push -u origin main
if ($LASTEXITCODE -ne 0) {
    Falhar "Não foi possível atualizar a branch main."
}

Write-Host "`n=== PUBLICANDO GH-PAGES ===" -ForegroundColor Cyan

$Publicacao = Join-Path $env:TEMP "docspace-gh-pages-v167"
if (Test-Path $Publicacao) {
    Remove-Item $Publicacao -Recurse -Force -ErrorAction SilentlyContinue
}

git clone $RepositorioUrl $Publicacao
if ($LASTEXITCODE -ne 0) {
    Falhar "Não foi possível clonar o repositório."
}

Push-Location $Publicacao
git checkout --orphan docspace-publicacao-v167

if ($LASTEXITCODE -ne 0) {
    Pop-Location
    Falhar "Não foi possível criar a branch temporária."
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
    commit -m "Publica DocSpace v167"

git push origin HEAD:gh-pages --force
$Resultado = $LASTEXITCODE
Pop-Location

if ($Resultado -ne 0) {
    Falhar "Não foi possível atualizar a gh-pages."
}

Write-Host "`n============================================" -ForegroundColor Green
Write-Host "DOCSPACE V167 PUBLICADO" -ForegroundColor Green
Write-Host "A central PDF agora usa rolagem natural em zoom 100%." -ForegroundColor Green
Write-Host "Site: ${SiteUrl}?build=167" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green

Start-Process "${SiteUrl}?build=167"
