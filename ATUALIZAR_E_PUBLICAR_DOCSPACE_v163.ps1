# DocSpace v1.63 - corrige a conversao Word/IA para PDF no servidor.
# Publica frontend e Worker sem trocar ou recriar o banco D1.

[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$ErrorActionPreference = "Continue"
$PSNativeCommandUseErrorActionPreference = $false

$Gh = "$env:ProgramFiles\GitHub CLI\gh.exe"
$Repositorio = "codebykaua/docspace"
$RepositorioUrl = "https://github.com/codebykaua/docspace.git"
$SiteUrl = "https://codebykaua.github.io/docspace/"
$Versao = "163"
$Projeto = (Get-Location).Path
$DatabaseIdEsperado = "2f8261c2-0c2f-49c4-8080-6c78320367c1"

function Falhar([string]$Mensagem) {
    Write-Host "`nERRO: $Mensagem" -ForegroundColor Red
    exit 1
}

function Invoke-NativeText {
    param([scriptblock]$Command)
    $Anterior = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
        $Texto = (& $Command 2>&1 | Out-String)
        $Codigo = $LASTEXITCODE
    }
    finally {
        $ErrorActionPreference = $Anterior
    }
    return [pscustomobject]@{ Text = $Texto; ExitCode = $Codigo }
}

function Verificar-Saida([string]$Mensagem) {
    if ($LASTEXITCODE -ne 0) { Falhar $Mensagem }
}

function Testar-D1Original {
    Push-Location (Join-Path $Projeto "backend-worker")
    $Resultado = Invoke-NativeText { npx --yes wrangler d1 list --json }
    Pop-Location

    if ($Resultado.ExitCode -ne 0) {
        Write-Host $Resultado.Text -ForegroundColor Yellow
        return $false
    }

    try {
        $Lista = $Resultado.Text | ConvertFrom-Json
    }
    catch {
        Write-Host "Nao foi possivel interpretar a lista do D1." -ForegroundColor Yellow
        Write-Host $Resultado.Text
        return $false
    }

    $Banco = @($Lista) | Where-Object {
        ($_.uuid -eq $DatabaseIdEsperado) -or ($_.id -eq $DatabaseIdEsperado)
    } | Select-Object -First 1

    return [bool]$Banco
}

if (-not (Test-Path $Gh)) { Falhar "GitHub CLI nao encontrado em $Gh." }
if (-not (Test-Path (Join-Path $Projeto "frontend\index.html"))) {
    Falhar "Execute este arquivo na pasta principal do DocSpace."
}

$Zip = Get-ChildItem -Path @(
    (Join-Path $env:USERPROFILE "Downloads\DocSpace-GitHub-v163*.zip"),
    (Join-Path $Projeto "DocSpace-GitHub-v163*.zip")
) -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if (-not $Zip) {
    Falhar "Baixe DocSpace-GitHub-v163.zip e deixe-o em Downloads ou na pasta do projeto."
}

$Extracao = Join-Path $env:TEMP "docspace-atualizacao-v163"
if (Test-Path $Extracao) { Remove-Item $Extracao -Recurse -Force -ErrorAction SilentlyContinue }

Write-Host "`n=== EXTRAINDO A VERSAO 163 ===" -ForegroundColor Cyan
Expand-Archive -LiteralPath $Zip.FullName -DestinationPath $Extracao -Force
$Fonte = Join-Path $Extracao "DocSpace-Static-GitHub-v163"
if (-not (Test-Path (Join-Path $Fonte "frontend\index.html"))) { Falhar "O pacote v163 esta incompleto." }

Write-Host "`n=== INSTALANDO A CORRECAO DA CONVERSAO PDF ===" -ForegroundColor Cyan
foreach ($Pasta in @("frontend", "backend-worker", "tools")) {
    $Destino = Join-Path $Projeto $Pasta
    if (Test-Path $Destino) { Remove-Item $Destino -Recurse -Force -ErrorAction SilentlyContinue }
    if (Test-Path $Destino) { Falhar "Feche arquivos abertos da pasta $Pasta e tente novamente." }
    Copy-Item (Join-Path $Fonte $Pasta) $Destino -Recurse -Force
}

foreach ($Arquivo in @("VERSION.txt", "package.json", "ALTERACOES_v163.md")) {
    $Origem = Join-Path $Fonte $Arquivo
    if (Test-Path $Origem) { Copy-Item $Origem (Join-Path $Projeto $Arquivo) -Force }
}

Write-Host "`n=== VALIDANDO A VERSAO ===" -ForegroundColor Cyan
node --check (Join-Path $Projeto "frontend\script.js")
Verificar-Saida "O JavaScript do frontend apresentou erro."
node --check (Join-Path $Projeto "backend-worker\src\worker.js")
Verificar-Saida "O JavaScript do Worker apresentou erro."

$WorkerTexto = [System.IO.File]::ReadAllText(
    (Join-Path $Projeto "backend-worker\src\worker.js"),
    [System.Text.Encoding]::UTF8
)
if ($WorkerTexto -notmatch '"X-Render-Secret": renderSecret') {
    Falhar "A correcao de autenticacao do conversor nao foi instalada."
}
if ($WorkerTexto -notmatch 'O servidor de conversao recusou a autenticacao' -and
    $WorkerTexto -notmatch 'O servidor de conversão recusou a autenticação') {
    Falhar "A validacao detalhada do conversor nao foi instalada."
}

Push-Location $Projeto
npm run check
$ResultadoCheck = $LASTEXITCODE
Pop-Location
if ($ResultadoCheck -ne 0) { Falhar "A validacao estatica da v163 falhou." }

Write-Host "`n=== ENVIANDO A V163 PARA A MAIN ===" -ForegroundColor Cyan
Push-Location $Projeto
git config user.name "DocSpace Publisher"
git config user.email "codebykaua@users.noreply.github.com"
$Remotos = @(git remote)
if ($Remotos -contains "origin") { git remote set-url origin $RepositorioUrl } else { git remote add origin $RepositorioUrl }
git add -A
$Alteracoes = git status --porcelain
if ($Alteracoes) {
    git commit -m "DocSpace v163 - corrige conversao Word e IA para PDF"
    Verificar-Saida "Nao foi possivel criar o commit da v163."
} else {
    Write-Host "Nenhuma alteracao nova para commit; continuando." -ForegroundColor Yellow
}
git push -u origin main
Verificar-Saida "Nao foi possivel atualizar a branch main."
Pop-Location

Write-Host "`n=== PUBLICANDO O FRONTEND NA GH-PAGES ===" -ForegroundColor Cyan
$Publicacao = Join-Path $env:TEMP "docspace-gh-pages-v163"
if (Test-Path $Publicacao) { Remove-Item $Publicacao -Recurse -Force -ErrorAction SilentlyContinue }
git clone $RepositorioUrl $Publicacao
Verificar-Saida "Nao foi possivel clonar o repositorio para publicacao."
Push-Location $Publicacao
git checkout --orphan docspace-publicacao-v163
if ($LASTEXITCODE -ne 0) {
    Pop-Location
    Falhar "Nao foi possivel criar a branch temporaria de publicacao."
}
Get-ChildItem -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force
Get-ChildItem -LiteralPath (Join-Path $Projeto "frontend") -Force |
    Copy-Item -Destination $Publicacao -Recurse -Force
if (-not (Test-Path (Join-Path $Publicacao "index.html"))) {
    Pop-Location
    Falhar "O index.html nao foi copiado para a raiz da publicacao."
}
New-Item -Path (Join-Path $Publicacao ".nojekyll") -ItemType File -Force | Out-Null
git add -A
git -c user.name="DocSpace Publisher" -c user.email="codebykaua@users.noreply.github.com" commit -m "Publica DocSpace v163"
if ($LASTEXITCODE -ne 0) {
    Pop-Location
    Falhar "Nao foi possivel criar o commit de publicacao."
}
git push origin HEAD:gh-pages --force
$ResultadoGhPages = $LASTEXITCODE
Pop-Location
if ($ResultadoGhPages -ne 0) { Falhar "Nao foi possivel atualizar a branch gh-pages." }

Write-Host "`n=== CONFIGURANDO O GITHUB PAGES ===" -ForegroundColor Cyan
$ConfigPages = Join-Path $env:TEMP "docspace-pages-v163.json"
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

Write-Host "`n=== CONFERINDO A CONTA CLOUDFLARE ===" -ForegroundColor Cyan
$BancoCorreto = Testar-D1Original
if (-not $BancoCorreto) {
    Write-Host "A conta Cloudflare atual nao possui o banco D1 original do DocSpace." -ForegroundColor Yellow
    Write-Host "O navegador sera aberto. Entre na conta que possui:" -ForegroundColor Yellow
    Write-Host "- Worker: docspace-api" -ForegroundColor Yellow
    Write-Host "- D1: gerador_documentos_rurais" -ForegroundColor Yellow
    Write-Host "- D1 ID: $DatabaseIdEsperado" -ForegroundColor Yellow

    Push-Location (Join-Path $Projeto "backend-worker")
    $Logout = Invoke-NativeText { npx --yes wrangler logout }
    $Login = Invoke-NativeText { npx --yes wrangler login }
    Pop-Location
    Write-Host $Login.Text
    if ($Login.ExitCode -ne 0) { Falhar "O login da Cloudflare nao foi concluido." }
    $BancoCorreto = Testar-D1Original
}

if (-not $BancoCorreto) {
    Falhar "A conta selecionada ainda nao possui o D1 original. Nada foi migrado ou recriado."
}

Write-Host "`n=== CONFERINDO O SEGREDO DO RENDER ===" -ForegroundColor Cyan
Push-Location (Join-Path $Projeto "backend-worker")
$Segredos = Invoke-NativeText { npx --yes wrangler secret list }
Pop-Location
if ($Segredos.ExitCode -ne 0) {
    Write-Host $Segredos.Text -ForegroundColor Yellow
    Falhar "Nao foi possivel consultar os segredos do Worker."
}
if ($Segredos.Text -notmatch "RENDER_API_SECRET") {
    Falhar "RENDER_API_SECRET nao existe no Worker. Cadastre nele o mesmo valor configurado no Render e execute novamente."
}

Write-Host "`n=== PUBLICANDO O CLOUDFLARE WORKER ===" -ForegroundColor Cyan
Push-Location (Join-Path $Projeto "backend-worker")
npx --yes wrangler deploy
$ResultadoWorker = $LASTEXITCODE
Pop-Location
if ($ResultadoWorker -ne 0) { Falhar "Nao foi possivel publicar o Worker da v163." }

Write-Host "`n=== AGUARDANDO O SITE ===" -ForegroundColor Cyan
$UrlFinal = "${SiteUrl}?build=${Versao}"
$Publicado = $false
for ($i = 1; $i -le 36; $i++) {
    Start-Sleep -Seconds 5
    try {
        $Resposta = Invoke-WebRequest -Uri $UrlFinal -UseBasicParsing -TimeoutSec 20
        if ($Resposta.StatusCode -eq 200 -and $Resposta.Content -match "cache-reset-v163") {
            $Publicado = $true
            break
        }
    }
    catch {
        Write-Host ("Tentativa {0}/36: aguardando o GitHub Pages..." -f $i)
    }
}

Write-Host "`n=================================================" -ForegroundColor Green
if ($Publicado) {
    Write-Host "DOCSPACE V163 PUBLICADO" -ForegroundColor Green
} else {
    Write-Host "A publicacao foi enviada; o GitHub ainda esta atualizando o cache." -ForegroundColor Yellow
}
Write-Host "Conversao Word/IA para PDF autenticada e com novas tentativas automaticas." -ForegroundColor Green
Write-Host "Site: $UrlFinal" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Start-Process $UrlFinal
