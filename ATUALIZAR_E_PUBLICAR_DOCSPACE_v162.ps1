$ErrorActionPreference = "Continue"
$PSNativeCommandUseErrorActionPreference = $false

$Gh = "$env:ProgramFiles\GitHub CLI\gh.exe"
$Repositorio = "codebykaua/docspace"
$RepositorioUrl = "https://github.com/codebykaua/docspace.git"
$SiteUrl = "https://codebykaua.github.io/docspace/"
$Versao = "162"
$Projeto = (Get-Location).Path

function Falhar([string]$Mensagem) {
    Write-Host "`nERRO: $Mensagem" -ForegroundColor Red
    exit 1
}

function Verificar-Saida([string]$Mensagem) {
    if ($LASTEXITCODE -ne 0) { Falhar $Mensagem }
}

if (-not (Test-Path $Gh)) { Falhar "GitHub CLI nao encontrado em $Gh." }
if (-not (Test-Path (Join-Path $Projeto "frontend\index.html"))) { Falhar "Execute este arquivo na pasta principal do DocSpace." }

$Zip = Get-ChildItem -Path @(
    (Join-Path $env:USERPROFILE "Downloads\DocSpace-GitHub-v162*.zip"),
    (Join-Path $Projeto "DocSpace-GitHub-v162*.zip")
) -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if (-not $Zip) { Falhar "Baixe DocSpace-GitHub-v162.zip e deixe-o em Downloads ou na pasta do projeto." }

$Extracao = Join-Path $env:TEMP "docspace-atualizacao-v162"
if (Test-Path $Extracao) { Remove-Item $Extracao -Recurse -Force -ErrorAction SilentlyContinue }

Write-Host "`n=== EXTRAINDO A VERSAO 162 ===" -ForegroundColor Cyan
Expand-Archive -LiteralPath $Zip.FullName -DestinationPath $Extracao -Force
$Fonte = Join-Path $Extracao "DocSpace-Static-GitHub-v162"
if (-not (Test-Path (Join-Path $Fonte "frontend\index.html"))) { Falhar "O pacote v162 esta incompleto." }

Write-Host "`n=== INSTALANDO A CORRECAO DE ROLAGEM E REDIMENSIONAMENTO ===" -ForegroundColor Cyan
$DestinoFrontend = Join-Path $Projeto "frontend"
if (Test-Path $DestinoFrontend) { Remove-Item $DestinoFrontend -Recurse -Force -ErrorAction SilentlyContinue }
if (Test-Path $DestinoFrontend) { Falhar "Feche arquivos abertos da pasta frontend e tente novamente." }
Copy-Item (Join-Path $Fonte "frontend") $DestinoFrontend -Recurse -Force

$DestinoTools = Join-Path $Projeto "tools"
if (Test-Path $DestinoTools) { Remove-Item $DestinoTools -Recurse -Force -ErrorAction SilentlyContinue }
Copy-Item (Join-Path $Fonte "tools") $DestinoTools -Recurse -Force

foreach ($Arquivo in @("VERSION.txt", "package.json", "ALTERACOES_v162.md")) {
    $Origem = Join-Path $Fonte $Arquivo
    if (Test-Path $Origem) { Copy-Item $Origem (Join-Path $Projeto $Arquivo) -Force }
}

Write-Host "`n=== VALIDANDO A VERSAO ===" -ForegroundColor Cyan
node --check (Join-Path $Projeto "frontend\script.js")
Verificar-Saida "O JavaScript do frontend apresentou erro."
node --check (Join-Path $Projeto "backend-worker\src\worker.js")
Verificar-Saida "O JavaScript do Worker apresentou erro."

$Css = Get-Content -Raw -Encoding UTF8 (Join-Path $Projeto "frontend\lovable-original.css")
if ($Css -notmatch "DocSpace v162") { Falhar "A correcao responsiva v162 nao foi instalada." }
if ($Css -notmatch "grid-template-rows: auto minmax\(0, 1fr\) auto") { Falhar "A estrutura de rolagem v162 nao foi instalada." }

Push-Location $Projeto
npm run check
$ResultadoCheck = $LASTEXITCODE
Pop-Location
if ($ResultadoCheck -ne 0) { Falhar "A validacao estatica da v162 falhou." }

Write-Host "`n=== ENVIANDO A V162 PARA A MAIN ===" -ForegroundColor Cyan
Push-Location $Projeto
git config user.name "DocSpace Publisher"
git config user.email "codebykaua@users.noreply.github.com"
$Remotos = @(git remote)
if ($Remotos -contains "origin") { git remote set-url origin $RepositorioUrl } else { git remote add origin $RepositorioUrl }
git add -A
$Alteracoes = git status --porcelain
if ($Alteracoes) {
    git commit -m "DocSpace v162 - corrige rolagem e redimensionamento"
    Verificar-Saida "Nao foi possivel criar o commit da v162."
} else {
    Write-Host "Nenhuma alteracao nova para commit; continuando." -ForegroundColor Yellow
}
git push -u origin main
Verificar-Saida "Nao foi possivel atualizar a branch main."
Pop-Location

Write-Host "`n=== PUBLICANDO O FRONTEND NA GH-PAGES ===" -ForegroundColor Cyan
$Publicacao = Join-Path $env:TEMP "docspace-gh-pages-v162"
if (Test-Path $Publicacao) { Remove-Item $Publicacao -Recurse -Force -ErrorAction SilentlyContinue }
git clone $RepositorioUrl $Publicacao
Verificar-Saida "Nao foi possivel clonar o repositorio para publicacao."
Push-Location $Publicacao
git checkout --orphan docspace-publicacao-v162
if ($LASTEXITCODE -ne 0) {
    Pop-Location
    Falhar "Nao foi possivel criar a branch temporaria de publicacao."
}
Get-ChildItem -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force
Get-ChildItem -LiteralPath $DestinoFrontend -Force | Copy-Item -Destination $Publicacao -Recurse -Force
if (-not (Test-Path (Join-Path $Publicacao "index.html"))) {
    Pop-Location
    Falhar "O index.html nao foi copiado para a raiz da publicacao."
}
New-Item -Path (Join-Path $Publicacao ".nojekyll") -ItemType File -Force | Out-Null
git add -A
git -c user.name="DocSpace Publisher" -c user.email="codebykaua@users.noreply.github.com" commit -m "Publica DocSpace v162"
if ($LASTEXITCODE -ne 0) {
    Pop-Location
    Falhar "Nao foi possivel criar o commit de publicacao."
}
git push origin HEAD:gh-pages --force
$ResultadoGhPages = $LASTEXITCODE
Pop-Location
if ($ResultadoGhPages -ne 0) { Falhar "Nao foi possivel atualizar a branch gh-pages." }

Write-Host "`n=== CONFIGURANDO O GITHUB PAGES ===" -ForegroundColor Cyan
$ConfigPages = Join-Path $env:TEMP "docspace-pages-v162.json"
[System.IO.File]::WriteAllText(
    $ConfigPages,
    '{"build_type":"legacy","source":{"branch":"gh-pages","path":"/"}}',
    [System.Text.UTF8Encoding]::new($false)
)
& $Gh api --method PUT "repos/$Repositorio/pages" --input $ConfigPages 2>$null
$ResultadoPages = $LASTEXITCODE
if ($ResultadoPages -ne 0) {
    & $Gh api --method DELETE "repos/$Repositorio/pages" 2>$null
    Start-Sleep -Seconds 3
    & $Gh api --method POST "repos/$Repositorio/pages" --input $ConfigPages
    $ResultadoPages = $LASTEXITCODE
}
if ($ResultadoPages -ne 0) { Falhar "Nao foi possivel configurar o GitHub Pages." }

Write-Host "`n=== AGUARDANDO O SITE ===" -ForegroundColor Cyan
$UrlFinal = "${SiteUrl}?build=${Versao}"
$Publicado = $false
for ($i = 1; $i -le 36; $i++) {
    Start-Sleep -Seconds 5
    try {
        $Resposta = Invoke-WebRequest -Uri $UrlFinal -UseBasicParsing -TimeoutSec 20
        if ($Resposta.StatusCode -eq 200 -and $Resposta.Content -match "cache-reset-v162") {
            $Publicado = $true
            break
        }
    } catch {
        Write-Host ("Tentativa {0}/36: aguardando o GitHub Pages..." -f $i)
    }
}

Write-Host "`n=================================================" -ForegroundColor Green
if ($Publicado) {
    Write-Host "DOCSPACE V162 PUBLICADO" -ForegroundColor Green
    Write-Host "Rolagem e redimensionamento corrigidos para zoom de 100%." -ForegroundColor Green
} else {
    Write-Host "A publicacao foi enviada; o GitHub ainda esta atualizando o cache." -ForegroundColor Yellow
}
Write-Host "O Cloudflare Worker nao foi alterado nesta versao." -ForegroundColor Cyan
Write-Host "Site: $UrlFinal" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Start-Process $UrlFinal
