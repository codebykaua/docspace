$ErrorActionPreference = "Continue"
$PSNativeCommandUseErrorActionPreference = $false

$Gh = "$env:ProgramFiles\GitHub CLI\gh.exe"
$Repositorio = "codebykaua/docspace"
$RepositorioUrl = "https://github.com/codebykaua/docspace.git"
$SiteUrl = "https://codebykaua.github.io/docspace/"
$RenderUrl = "https://gerador-de-documentos-1.onrender.com"
$Versao = "161"
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
    (Join-Path $env:USERPROFILE "Downloads\DocSpace-GitHub-v161*.zip"),
    (Join-Path $Projeto "DocSpace-GitHub-v161*.zip")
) -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if (-not $Zip) { Falhar "Baixe DocSpace-GitHub-v161.zip e deixe-o em Downloads ou na pasta do projeto." }

$Extracao = Join-Path $env:TEMP "docspace-atualizacao-v161"
if (Test-Path $Extracao) { Remove-Item $Extracao -Recurse -Force -ErrorAction SilentlyContinue }

Write-Host "`n=== EXTRAINDO A VERSAO 161 ===" -ForegroundColor Cyan
Expand-Archive -LiteralPath $Zip.FullName -DestinationPath $Extracao -Force
$Fonte = Join-Path $Extracao "DocSpace-Static-GitHub-v161"
if (-not (Test-Path (Join-Path $Fonte "frontend\index.html"))) { Falhar "O pacote v161 esta incompleto." }

Write-Host "`n=== INSTALANDO A CORRECAO DA CENTRAL PDF ===" -ForegroundColor Cyan
$DestinoFrontend = Join-Path $Projeto "frontend"
if (Test-Path $DestinoFrontend) { Remove-Item $DestinoFrontend -Recurse -Force -ErrorAction SilentlyContinue }
if (Test-Path $DestinoFrontend) { Falhar "Feche arquivos abertos da pasta frontend e tente novamente." }
Copy-Item (Join-Path $Fonte "frontend") $DestinoFrontend -Recurse -Force

$DestinoTools = Join-Path $Projeto "tools"
if (Test-Path $DestinoTools) { Remove-Item $DestinoTools -Recurse -Force -ErrorAction SilentlyContinue }
Copy-Item (Join-Path $Fonte "tools") $DestinoTools -Recurse -Force

foreach ($Arquivo in @("VERSION.txt", "package.json", "ALTERACOES_v161.md")) {
    $Origem = Join-Path $Fonte $Arquivo
    if (Test-Path $Origem) { Copy-Item $Origem (Join-Path $Projeto $Arquivo) -Force }
}

Write-Host "`n=== VALIDANDO A VERSAO ===" -ForegroundColor Cyan
node --check (Join-Path $Projeto "frontend\script.js")
Verificar-Saida "O JavaScript do frontend apresentou erro."
node --check (Join-Path $Projeto "backend-worker\src\worker.js")
Verificar-Saida "O JavaScript do Worker apresentou erro."
Push-Location $Projeto
npm run check
$ResultadoCheck = $LASTEXITCODE
Pop-Location
if ($ResultadoCheck -ne 0) { Falhar "A validacao estatica da v161 falhou." }

Write-Host "`n=== ENVIANDO A V161 PARA A MAIN ===" -ForegroundColor Cyan
Push-Location $Projeto
git config user.name "DocSpace Publisher"
git config user.email "codebykaua@users.noreply.github.com"
$Remotos = @(git remote)
if ($Remotos -contains "origin") { git remote set-url origin $RepositorioUrl } else { git remote add origin $RepositorioUrl }
git add -A
$Alteracoes = git status --porcelain
if ($Alteracoes) {
    git commit -m "DocSpace v161 - corrige layout PDF e carregamento de arquivos"
    Verificar-Saida "Nao foi possivel criar o commit da v161."
} else {
    Write-Host "Nenhuma alteracao nova para commit; continuando." -ForegroundColor Yellow
}
git push -u origin main
Verificar-Saida "Nao foi possivel atualizar a branch main."
Pop-Location

Write-Host "`n=== PUBLICANDO O FRONTEND NA GH-PAGES ===" -ForegroundColor Cyan
$Publicacao = Join-Path $env:TEMP "docspace-gh-pages-v161"
if (Test-Path $Publicacao) { Remove-Item $Publicacao -Recurse -Force -ErrorAction SilentlyContinue }
git clone $RepositorioUrl $Publicacao
Verificar-Saida "Nao foi possivel clonar o repositorio para publicacao."
Push-Location $Publicacao
git checkout --orphan docspace-publicacao-v161
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
git -c user.name="DocSpace Publisher" -c user.email="codebykaua@users.noreply.github.com" commit -m "Publica DocSpace v161"
if ($LASTEXITCODE -ne 0) {
    Pop-Location
    Falhar "Nao foi possivel criar o commit de publicacao."
}
git push origin HEAD:gh-pages --force
$ResultadoGhPages = $LASTEXITCODE
Pop-Location
if ($ResultadoGhPages -ne 0) { Falhar "Nao foi possivel atualizar a branch gh-pages." }

Write-Host "`n=== CONFIGURANDO O GITHUB PAGES ===" -ForegroundColor Cyan
$ConfigPages = Join-Path $env:TEMP "docspace-pages-v161.json"
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

Write-Host "`n=== TENTANDO PUBLICAR O CLOUDFLARE WORKER ===" -ForegroundColor Cyan
$WorkerPublicado = $false
$Backend = Join-Path $Projeto "backend-worker"
if (Test-Path (Join-Path $Backend "wrangler.toml")) {
    Push-Location $Backend
    npx --yes wrangler deploy
    if ($LASTEXITCODE -eq 0) { $WorkerPublicado = $true }
    Pop-Location
}
if (-not $WorkerPublicado) {
    Write-Host "O frontend sera publicado normalmente, mas o Worker nao foi atualizado." -ForegroundColor Yellow
    Write-Host "Para o Corretor processar os arquivos, entre na conta Cloudflare que possui docspace-api e o banco gerador_documentos_rurais." -ForegroundColor Yellow
}

Write-Host "`n=== AGUARDANDO O SITE ===" -ForegroundColor Cyan
$UrlFinal = "${SiteUrl}?build=${Versao}"
$Publicado = $false
for ($i = 1; $i -le 36; $i++) {
    Start-Sleep -Seconds 5
    try {
        $Resposta = Invoke-WebRequest -Uri $UrlFinal -UseBasicParsing -TimeoutSec 20
        if ($Resposta.StatusCode -eq 200 -and $Resposta.Content -match "cache-reset-v161") {
            $Publicado = $true
            break
        }
    } catch {
        Write-Host ("Tentativa {0}/36: aguardando o GitHub Pages..." -f $i)
    }
}

Write-Host "`n=== VERIFICANDO O SERVICO DE PDF ===" -ForegroundColor Cyan
$RenderPronto = $false
try {
    $Saude = Invoke-RestMethod -Uri "$RenderUrl/health" -Method Get -TimeoutSec 35
    if ($Saude.ok -eq $true) { $RenderPronto = $true }
} catch { }

Write-Host "`n=================================================" -ForegroundColor Green
if ($Publicado) {
    Write-Host "DOCSPACE V161 PUBLICADO" -ForegroundColor Green
    Write-Host "Layout PDF corrigido e seletor de arquivos atualizado." -ForegroundColor Green
} else {
    Write-Host "A publicacao foi enviada; o GitHub ainda esta atualizando o cache." -ForegroundColor Yellow
}
if ($WorkerPublicado -and $RenderPronto) {
    Write-Host "CORRETOR DE PDF: BACKEND ATIVO" -ForegroundColor Green
} else {
    Write-Host "CORRETOR DE PDF: A INTERFACE CARREGA OS ARQUIVOS, MAS O BACKEND PRECISA SER ATIVADO." -ForegroundColor Yellow
    if (-not $WorkerPublicado) { Write-Host "Pendente: publicar o Worker na conta Cloudflare correta." -ForegroundColor Yellow }
    if (-not $RenderPronto) { Write-Host "Pendente: verificar o servico pdf-server no Render." -ForegroundColor Yellow }
}
Write-Host "Site: $UrlFinal" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Start-Process $UrlFinal
