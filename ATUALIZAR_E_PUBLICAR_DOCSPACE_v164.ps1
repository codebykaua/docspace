# DocSpace v1.64 - corrige a central de ferramentas PDF e o health check do Render.
# Atualiza main, GitHub Pages, tenta publicar o Worker e aguarda o Render.

[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$ErrorActionPreference = "Continue"
$PSNativeCommandUseErrorActionPreference = $false

$Gh = "$env:ProgramFiles\GitHub CLI\gh.exe"
$Repositorio = "codebykaua/docspace"
$RepositorioUrl = "https://github.com/codebykaua/docspace.git"
$SiteUrl = "https://codebykaua.github.io/docspace/"
$RenderUrl = "https://gerador-de-documentos-3a8t.onrender.com"
$Versao = "164"
$Projeto = (Get-Location).Path
$DatabaseIdEsperado = "2f8261c2-0c2f-49c4-8080-6c78320367c1"

function Falhar([string]$Mensagem) {
    Write-Host "`nERRO: $Mensagem" -ForegroundColor Red
    exit 1
}

function Executar-Nativo {
    param([scriptblock]$Comando)
    $Anterior = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
        $Texto = (& $Comando 2>&1 | Out-String)
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

if (-not (Test-Path $Gh)) { Falhar "GitHub CLI nao encontrado em $Gh." }
if (-not (Test-Path (Join-Path $Projeto "frontend\index.html"))) {
    Falhar "Execute este arquivo na pasta principal do DocSpace."
}

$Zip = Get-ChildItem -Path @(
    (Join-Path $env:USERPROFILE "Downloads\DocSpace-GitHub-v164*.zip"),
    (Join-Path $Projeto "DocSpace-GitHub-v164*.zip")
) -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if (-not $Zip) {
    Falhar "Baixe DocSpace-GitHub-v164.zip e deixe-o em Downloads ou na pasta do projeto."
}

$Extracao = Join-Path $env:TEMP "docspace-atualizacao-v164"
if (Test-Path $Extracao) { Remove-Item $Extracao -Recurse -Force -ErrorAction SilentlyContinue }

Write-Host "`n=== EXTRAINDO A VERSAO 164 ===" -ForegroundColor Cyan
Expand-Archive -LiteralPath $Zip.FullName -DestinationPath $Extracao -Force
$Fonte = Join-Path $Extracao "DocSpace-Static-GitHub-v164"
if (-not (Test-Path (Join-Path $Fonte "frontend\index.html"))) { Falhar "O pacote v164 esta incompleto." }

Write-Host "`n=== INSTALANDO AS CORRECOES ===" -ForegroundColor Cyan
foreach ($Pasta in @("frontend", "backend-worker", "pdf-server", "tools")) {
    $Destino = Join-Path $Projeto $Pasta
    if (Test-Path $Destino) { Remove-Item $Destino -Recurse -Force -ErrorAction SilentlyContinue }
    if (Test-Path $Destino) { Falhar "Feche arquivos abertos da pasta $Pasta e execute novamente." }
    Copy-Item (Join-Path $Fonte $Pasta) $Destino -Recurse -Force
}
foreach ($Arquivo in @("VERSION.txt", "package.json", "render.yaml", "ALTERACOES_v164.md")) {
    $Origem = Join-Path $Fonte $Arquivo
    if (Test-Path $Origem) { Copy-Item $Origem (Join-Path $Projeto $Arquivo) -Force }
}

Write-Host "`n=== VALIDANDO A VERSAO ===" -ForegroundColor Cyan
node --check (Join-Path $Projeto "frontend\script.js")
Verificar-Saida "O JavaScript do frontend apresentou erro."
node --check (Join-Path $Projeto "backend-worker\src\worker.js")
Verificar-Saida "O JavaScript do Worker apresentou erro."

$PythonValidado = $false
$Py = Get-Command py -ErrorAction SilentlyContinue
if ($Py) {
    & py -3 -m py_compile (Join-Path $Projeto "pdf-server\app\main.py") (Join-Path $Projeto "pdf-server\app\processor.py") 2>$null
    if ($LASTEXITCODE -eq 0) { $PythonValidado = $true }
}
if (-not $PythonValidado) {
    $Python = Get-Command python -ErrorAction SilentlyContinue
    if ($Python) {
        & python -m py_compile (Join-Path $Projeto "pdf-server\app\main.py") (Join-Path $Projeto "pdf-server\app\processor.py") 2>$null
        if ($LASTEXITCODE -eq 0) { $PythonValidado = $true }
    }
}
if ($PythonValidado) {
    Write-Host "Python validado localmente." -ForegroundColor Green
} else {
    Write-Host "Python local indisponivel; o Docker validara as dependencias no Render." -ForegroundColor Yellow
}

Push-Location $Projeto
npm run check
$ResultadoCheck = $LASTEXITCODE
Pop-Location
if ($ResultadoCheck -ne 0) { Falhar "A validacao estatica da v164 falhou." }

$Css = [System.IO.File]::ReadAllText((Join-Path $Projeto "frontend\lovable-original.css"), [System.Text.Encoding]::UTF8)
$Js = [System.IO.File]::ReadAllText((Join-Path $Projeto "frontend\script.js"), [System.Text.Encoding]::UTF8)
$MainPy = [System.IO.File]::ReadAllText((Join-Path $Projeto "pdf-server\app\main.py"), [System.Text.Encoding]::UTF8)
if ($Css -notmatch "DocSpace v164") { Falhar "A correcao visual da central PDF nao foi instalada." }
if ($Js -notmatch "resetPdfToolsViewport") { Falhar "A correcao da rolagem da central PDF nao foi instalada." }
if ($MainPy -notmatch '@app.get\("/ready"\)' -or $MainPy -notmatch '"ready": ready') {
    Falhar "A correcao do health check do Render nao foi instalada."
}

Write-Host "`n=== ENVIANDO A V164 PARA A MAIN ===" -ForegroundColor Cyan
Push-Location $Projeto
git config user.name "DocSpace Publisher"
git config user.email "codebykaua@users.noreply.github.com"
$Remotos = @(git remote)
if ($Remotos -contains "origin") { git remote set-url origin $RepositorioUrl } else { git remote add origin $RepositorioUrl }
git add -A
$Alteracoes = git status --porcelain
if ($Alteracoes) {
    git commit -m "DocSpace v164 - corrige central PDF e Render 503"
    Verificar-Saida "Nao foi possivel criar o commit da v164."
} else {
    Write-Host "Nenhuma alteracao nova para commit; continuando." -ForegroundColor Yellow
}
git push -u origin main
Verificar-Saida "Nao foi possivel atualizar a branch main."
Pop-Location

Write-Host "`n=== PUBLICANDO O FRONTEND NA GH-PAGES ===" -ForegroundColor Cyan
$Publicacao = Join-Path $env:TEMP "docspace-gh-pages-v164"
if (Test-Path $Publicacao) { Remove-Item $Publicacao -Recurse -Force -ErrorAction SilentlyContinue }
git clone $RepositorioUrl $Publicacao
Verificar-Saida "Nao foi possivel clonar o repositorio para publicacao."
Push-Location $Publicacao
git checkout --orphan docspace-publicacao-v164
if ($LASTEXITCODE -ne 0) {
    Pop-Location
    Falhar "Nao foi possivel criar a branch temporaria de publicacao."
}
Get-ChildItem -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force
Get-ChildItem -LiteralPath (Join-Path $Projeto "frontend") -Force | Copy-Item -Destination $Publicacao -Recurse -Force
if (-not (Test-Path (Join-Path $Publicacao "index.html"))) {
    Pop-Location
    Falhar "O index.html nao foi copiado para a raiz da publicacao."
}
New-Item -Path (Join-Path $Publicacao ".nojekyll") -ItemType File -Force | Out-Null
git add -A
git -c user.name="DocSpace Publisher" -c user.email="codebykaua@users.noreply.github.com" commit -m "Publica DocSpace v164"
if ($LASTEXITCODE -ne 0) {
    Pop-Location
    Falhar "Nao foi possivel criar o commit de publicacao."
}
git push origin HEAD:gh-pages --force
$ResultadoGhPages = $LASTEXITCODE
Pop-Location
if ($ResultadoGhPages -ne 0) { Falhar "Nao foi possivel atualizar a branch gh-pages." }

Write-Host "`n=== CONFIGURANDO O GITHUB PAGES ===" -ForegroundColor Cyan
$ConfigPages = Join-Path $env:TEMP "docspace-pages-v164.json"
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
$Backend = Join-Path $Projeto "backend-worker"
$ConfigAtiva = Join-Path $Backend "wrangler-active-v164.toml"
$TomlOriginal = [System.IO.File]::ReadAllText((Join-Path $Backend "wrangler.toml"), [System.Text.Encoding]::UTF8)
$TomlSemConta = [regex]::Replace($TomlOriginal, '(?m)^account_id\s*=.*\r?\n?', '')
[System.IO.File]::WriteAllText($ConfigAtiva, $TomlSemConta, [System.Text.UTF8Encoding]::new($false))

Push-Location $Backend
$ListaD1 = Executar-Nativo { npx --yes wrangler d1 list --config .\wrangler-active-v164.toml --json }
Pop-Location
Remove-Item $ConfigAtiva -Force -ErrorAction SilentlyContinue

$WorkerPublicado = $false
$ContaCorreta = $false
if ($ListaD1.ExitCode -eq 0) {
    try {
        $Bancos = $ListaD1.Text | ConvertFrom-Json
        $Banco = @($Bancos) | Where-Object { ($_.uuid -eq $DatabaseIdEsperado) -or ($_.id -eq $DatabaseIdEsperado) } | Select-Object -First 1
        $ContaCorreta = [bool]$Banco
    } catch {
        Write-Host "Nao foi possivel interpretar a lista D1 da conta atual." -ForegroundColor Yellow
    }
}

if ($ContaCorreta) {
    # A conta autenticada possui o banco original. Remove o account_id antigo e usa a conta ativa.
    [System.IO.File]::WriteAllText((Join-Path $Backend "wrangler.toml"), $TomlSemConta, [System.Text.UTF8Encoding]::new($false))
    Push-Location $Backend
    $Segredos = Executar-Nativo { npx --yes wrangler secret list }
    if ($Segredos.ExitCode -eq 0 -and $Segredos.Text -match "RENDER_API_SECRET") {
        npx --yes wrangler deploy
        if ($LASTEXITCODE -eq 0) { $WorkerPublicado = $true }
    } else {
        Write-Host "RENDER_API_SECRET nao foi encontrado no Worker desta conta." -ForegroundColor Yellow
    }
    Pop-Location
} else {
    Write-Host "A conta Cloudflare autenticada nao possui o D1 original do DocSpace." -ForegroundColor Yellow
    Write-Host "O frontend foi publicado, mas o Worker nao foi alterado." -ForegroundColor Yellow
    Write-Host "Entre na conta que possui o banco $DatabaseIdEsperado e execute novamente." -ForegroundColor Yellow
}

Write-Host "`n=== AGUARDANDO O GITHUB PAGES ===" -ForegroundColor Cyan
$UrlFinal = "${SiteUrl}?build=${Versao}"
$SitePublicado = $false
for ($i = 1; $i -le 36; $i++) {
    Start-Sleep -Seconds 5
    try {
        $Resposta = Invoke-WebRequest -Uri $UrlFinal -UseBasicParsing -TimeoutSec 20
        if ($Resposta.StatusCode -eq 200 -and $Resposta.Content -match "cache-reset-v164") {
            $SitePublicado = $true
            break
        }
    } catch {
        Write-Host ("GitHub Pages: tentativa {0}/36..." -f $i)
    }
}

Write-Host "`n=== AGUARDANDO O NOVO DEPLOY DO RENDER ===" -ForegroundColor Cyan
$RenderPronto = $false
$RenderSaudavel = $false
$RenderHealth = $null
for ($i = 1; $i -le 48; $i++) {
    try {
        $RenderHealth = Invoke-RestMethod -Uri "$RenderUrl/health?build=164" -Method Get -TimeoutSec 30
        if ($RenderHealth.ok -and [string]$RenderHealth.version -eq "1.64.0") {
            $RenderSaudavel = $true
            $RenderPronto = [bool]$RenderHealth.ready
            break
        }
    } catch {
        Write-Host ("Render: tentativa {0}/48; aguardando construcao ou inicializacao..." -f $i)
    }
    Start-Sleep -Seconds 15
}

Write-Host "`n=================================================" -ForegroundColor Green
if ($SitePublicado) {
    Write-Host "FRONTEND V164 PUBLICADO" -ForegroundColor Green
} else {
    Write-Host "Frontend enviado; o cache do GitHub ainda pode estar atualizando." -ForegroundColor Yellow
}
if ($WorkerPublicado) {
    Write-Host "CLOUDFLARE WORKER PUBLICADO" -ForegroundColor Green
} else {
    Write-Host "Worker pendente: confira a conta Cloudflare autenticada." -ForegroundColor Yellow
}
if ($RenderSaudavel -and $RenderPronto) {
    Write-Host "RENDER V164 ATIVO E PRONTO" -ForegroundColor Green
} elseif ($RenderSaudavel) {
    Write-Host "Render respondeu, mas ainda nao esta pronto." -ForegroundColor Yellow
    if ($RenderHealth.missingDependencies) {
        Write-Host ("Dependencias ausentes: " + (($RenderHealth.missingDependencies | ForEach-Object { [string]$_ }) -join ", ")) -ForegroundColor Yellow
    }
    if (-not $RenderHealth.renderSecretConfigured) {
        Write-Host "RENDER_API_SECRET nao foi reconhecido no Render." -ForegroundColor Yellow
    }
} else {
    Write-Host "Render ainda nao publicou a v164." -ForegroundColor Yellow
    Write-Host "No Render, use Manual Deploy -> Deploy latest commit e acompanhe os Logs." -ForegroundColor Yellow
}
Write-Host "Site: $UrlFinal" -ForegroundColor Green
Write-Host "Render: $RenderUrl/health" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Start-Process $UrlFinal
