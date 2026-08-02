[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$ErrorActionPreference = "Stop"
$PSNativeCommandUseErrorActionPreference = $false

$Projeto = (Get-Location).Path
$Frontend = Join-Path $Projeto "frontend"
$CssPrincipal = Join-Path $Frontend "style.css"
$CssLovable = Join-Path $Frontend "lovable-original.css"
$IndexPath = Join-Path $Frontend "index.html"
$Versao = "165"
$RepositorioUrl = "https://github.com/codebykaua/docspace.git"
$SiteUrl = "https://codebykaua.github.io/docspace/"

function Falhar([string]$Mensagem) {
    Write-Host "`nERRO: $Mensagem" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path (Join-Path $Frontend "index.html"))) {
    Falhar "Execute este arquivo na pasta principal do DocSpace."
}

$Utf8 = [System.Text.UTF8Encoding]::new($false)

$Inicio = "/* DOCSPACE V165 - CENTRAL PDF VISIVEL EM 100% */"
$Fim = "/* FIM DOCSPACE V165 */"

$BlocoCss = @'
/* DOCSPACE V165 - CENTRAL PDF VISIVEL EM 100% */

/*
  A biblioteca de ferramentas PDF não pode herdar alturas pequenas
  das versões anteriores. Ela possui altura própria e rolagem interna.
*/
.pdf-tools-library,
.pdf-tools-catalog,
.pdf-tools-panel,
.pdf-tools-shell,
.pdf-tool-library,
[data-pdf-tools-library] {
  display: block !important;
  position: relative !important;
  height: clamp(250px, 34vh, 390px) !important;
  min-height: 250px !important;
  max-height: 390px !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
  opacity: 1 !important;
  visibility: visible !important;
  clip-path: none !important;
  contain: none !important;
}

/* O cabeçalho azul não pode ocupar sozinho toda a altura da biblioteca. */
.pdf-tools-library > .pdf-hero,
.pdf-tools-catalog > .pdf-hero,
.pdf-tools-panel > .pdf-hero,
.pdf-tools-shell > .pdf-hero,
.pdf-tool-library > .pdf-hero,
.pdf-tools-hero,
.pdf-hero {
  position: sticky !important;
  top: 0 !important;
  z-index: 4 !important;
  min-height: 92px !important;
  height: auto !important;
  margin: 0 0 10px !important;
}

/* Filtros visíveis logo abaixo do cabeçalho. */
.pdf-tool-filters,
.pdf-tools-filters,
[data-pdf-tool-filters] {
  position: sticky !important;
  top: 92px !important;
  z-index: 5 !important;
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 7px !important;
  padding: 8px 10px !important;
  margin: 0 !important;
  background: var(--surface, #fff) !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* Grade completa e rolável. */
.pdf-tool-grid,
.pdf-tools-grid,
[data-pdf-tools-grid] {
  display: grid !important;
  grid-template-columns: repeat(5, minmax(145px, 1fr)) !important;
  gap: 9px !important;
  width: 100% !important;
  min-width: 0 !important;
  height: auto !important;
  min-height: max-content !important;
  max-height: none !important;
  overflow: visible !important;
  padding: 8px 10px 14px !important;
  margin: 0 !important;
  opacity: 1 !important;
  visibility: visible !important;
}

/* Cartões compactos para caberem em zoom 100%. */
.pdf-tool-card,
.pdf-tools-card,
[data-pdf-tool] {
  display: flex !important;
  min-width: 0 !important;
  min-height: 88px !important;
  height: auto !important;
  padding: 10px !important;
  overflow: hidden !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* O formulário da ferramenta fica abaixo e a página pode rolar normalmente. */
.pdf-tool-workspace,
.pdf-workspace,
.pdf-operation-panel,
.pdf-tool-operation,
[data-pdf-workspace] {
  position: relative !important;
  z-index: 1 !important;
  display: block !important;
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
  overflow: visible !important;
  margin-top: 14px !important;
}

/* Área central do aplicativo deve permitir rolagem vertical. */
.app-main,
.main-content,
.workspace-main,
.content-area,
.page-content,
[data-main-content] {
  min-height: 0 !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
}

/* Telas médias. */
@media (max-width: 1280px) {
  .pdf-tool-grid,
  .pdf-tools-grid,
  [data-pdf-tools-grid] {
    grid-template-columns: repeat(4, minmax(140px, 1fr)) !important;
  }
}

/* Telas menores e notebooks baixos. */
@media (max-width: 980px), (max-height: 760px) {
  .pdf-tools-library,
  .pdf-tools-catalog,
  .pdf-tools-panel,
  .pdf-tools-shell,
  .pdf-tool-library,
  [data-pdf-tools-library] {
    height: clamp(220px, 36vh, 310px) !important;
    min-height: 220px !important;
  }

  .pdf-tool-grid,
  .pdf-tools-grid,
  [data-pdf-tools-grid] {
    grid-template-columns: repeat(3, minmax(135px, 1fr)) !important;
  }
}

/* Celular e tablet. */
@media (max-width: 720px) {
  .pdf-tools-library,
  .pdf-tools-catalog,
  .pdf-tools-panel,
  .pdf-tools-shell,
  .pdf-tool-library,
  [data-pdf-tools-library] {
    height: auto !important;
    min-height: 0 !important;
    max-height: none !important;
    overflow: visible !important;
  }

  .pdf-tools-library > .pdf-hero,
  .pdf-tools-catalog > .pdf-hero,
  .pdf-tools-panel > .pdf-hero,
  .pdf-tools-shell > .pdf-hero,
  .pdf-tool-library > .pdf-hero,
  .pdf-tools-hero,
  .pdf-hero,
  .pdf-tool-filters,
  .pdf-tools-filters,
  [data-pdf-tool-filters] {
    position: relative !important;
    top: auto !important;
  }

  .pdf-tool-grid,
  .pdf-tools-grid,
  [data-pdf-tools-grid] {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    padding-inline: 0 !important;
  }
}

@media (max-width: 460px) {
  .pdf-tool-grid,
  .pdf-tools-grid,
  [data-pdf-tools-grid] {
    grid-template-columns: 1fr !important;
  }
}

/* FIM DOCSPACE V165 */
'@

function Aplicar-BlocoCss([string]$Caminho) {
    if (-not (Test-Path $Caminho)) { return }

    $Css = [System.IO.File]::ReadAllText($Caminho, [System.Text.Encoding]::UTF8)
    $Padrao = [regex]::Escape($Inicio) + ".*?" + [regex]::Escape($Fim)

    if ([regex]::IsMatch($Css, $Padrao, [System.Text.RegularExpressions.RegexOptions]::Singleline)) {
        $Css = [regex]::Replace(
            $Css,
            $Padrao,
            [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $BlocoCss.Trim() },
            [System.Text.RegularExpressions.RegexOptions]::Singleline
        )
    } else {
        $Css = $Css.TrimEnd() + "`r`n`r`n" + $BlocoCss.Trim() + "`r`n"
    }

    [System.IO.File]::WriteAllText($Caminho, $Css, $Utf8)
}

Write-Host "`n=== CORRIGINDO A CENTRAL DE FERRAMENTAS PDF ===" -ForegroundColor Cyan
Aplicar-BlocoCss $CssPrincipal
Aplicar-BlocoCss $CssLovable

Write-Host "`n=== ATUALIZANDO CACHE E VERSAO ===" -ForegroundColor Cyan

$Index = [System.IO.File]::ReadAllText($IndexPath, [System.Text.Encoding]::UTF8)
$Index = [regex]::Replace($Index, 'style\.css\?v=\d+', 'style.css?v=165')
$Index = [regex]::Replace($Index, 'lovable-original\.css\?v=\d+', 'lovable-original.css?v=165')
$Index = [regex]::Replace($Index, 'cache-reset-v\d+\.js\?v=\d+', 'cache-reset-v165.js?v=165')
[System.IO.File]::WriteAllText($IndexPath, $Index, $Utf8)

[System.IO.File]::WriteAllText((Join-Path $Projeto "VERSION.txt"), "v165`r`n", $Utf8)
[System.IO.File]::WriteAllText((Join-Path $Frontend "VERSION.txt"), "v165`r`n", $Utf8)
[System.IO.File]::WriteAllText(
    (Join-Path $Frontend "version.json"),
    '{"version":"1.65","build":165,"hosting":"github-pages"}' + "`r`n",
    $Utf8
)

$CacheAnterior = Get-ChildItem -LiteralPath $Frontend -Filter "cache-reset-v*.js" |
    Where-Object { $_.Name -ne "cache-reset-v165.js" } |
    Sort-Object Name -Descending |
    Select-Object -First 1

if ($CacheAnterior) {
    $Cache = [System.IO.File]::ReadAllText($CacheAnterior.FullName, [System.Text.Encoding]::UTF8)
    $Cache = [regex]::Replace($Cache, 'DOCSPACE_BUILD\s*=\s*"[^"]+"', 'DOCSPACE_BUILD = "1.65"')
    $Cache = [regex]::Replace($Cache, 'dataset\.docspaceBuild\s*=\s*"[^"]+"', 'dataset.docspaceBuild = "1.65"')
    $Cache = [regex]::Replace($Cache, 'docspace-cache-reset-v\d+', 'docspace-cache-reset-v165')
    $Cache = [regex]::Replace($Cache, 'set\("build",\s*"\d+"\)', 'set("build", "165")')
    [System.IO.File]::WriteAllText((Join-Path $Frontend "cache-reset-v165.js"), $Cache, $Utf8)
}

Write-Host "`n=== VALIDANDO ===" -ForegroundColor Cyan
node --check (Join-Path $Frontend "script.js")
if ($LASTEXITCODE -ne 0) { Falhar "O JavaScript do frontend possui erro." }

$CssTeste = [System.IO.File]::ReadAllText($CssPrincipal, [System.Text.Encoding]::UTF8)
if ($CssTeste -notmatch "DOCSPACE V165" -or $CssTeste -notmatch "height: clamp\(250px, 34vh, 390px\)") {
    Falhar "A correção visual não foi aplicada."
}

Write-Host "`n=== ENVIANDO PARA A MAIN ===" -ForegroundColor Cyan
git config user.name "DocSpace Publisher"
git config user.email "codebykaua@users.noreply.github.com"

$Remotos = @(git remote)
if ($Remotos -contains "origin") {
    git remote set-url origin $RepositorioUrl
} else {
    git remote add origin $RepositorioUrl
}

git add -A
$Alteracoes = git status --porcelain
if ($Alteracoes) {
    git commit -m "DocSpace v165 - exibe ferramentas PDF em zoom 100%"
    if ($LASTEXITCODE -ne 0) { Falhar "Não foi possível criar o commit." }
}

git push -u origin main
if ($LASTEXITCODE -ne 0) { Falhar "Não foi possível atualizar a branch main." }

Write-Host "`n=== PUBLICANDO O FRONTEND ===" -ForegroundColor Cyan
$Publicacao = Join-Path $env:TEMP "docspace-gh-pages-v165"
if (Test-Path $Publicacao) {
    Remove-Item $Publicacao -Recurse -Force -ErrorAction SilentlyContinue
}

git clone $RepositorioUrl $Publicacao
if ($LASTEXITCODE -ne 0) { Falhar "Não foi possível clonar o repositório para publicação." }

Push-Location $Publicacao
git checkout --orphan docspace-publicacao-v165
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
    commit -m "Publica DocSpace v165"

if ($LASTEXITCODE -ne 0) {
    Pop-Location
    Falhar "Não foi possível criar o commit da gh-pages."
}

git push origin HEAD:gh-pages --force
$Resultado = $LASTEXITCODE
Pop-Location

if ($Resultado -ne 0) { Falhar "Não foi possível atualizar a gh-pages." }

Write-Host "`n============================================" -ForegroundColor Green
Write-Host "DOCSPACE V165 PUBLICADO" -ForegroundColor Green
Write-Host "A biblioteca PDF agora fica visível em zoom 100%." -ForegroundColor Green
Write-Host "Site: ${SiteUrl}?build=165" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green

Start-Process "${SiteUrl}?build=165"
