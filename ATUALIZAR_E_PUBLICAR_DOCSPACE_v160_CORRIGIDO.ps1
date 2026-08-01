$ErrorActionPreference = "Continue"
$PSNativeCommandUseErrorActionPreference = $false

$Gh = "$env:ProgramFiles\GitHub CLI\gh.exe"
$Repositorio = "codebykaua/docspace"
$RepositorioUrl = "https://github.com/codebykaua/docspace.git"
$SiteUrl = "https://codebykaua.github.io/docspace/"
$RenderUrl = "https://gerador-de-documentos-1.onrender.com"
$Versao = "160"
$Projeto = (Get-Location).Path
$FrontendProjeto = Join-Path $Projeto "frontend"

function Falhar([string]$Mensagem) {
    Write-Host "`nERRO: $Mensagem" -ForegroundColor Red
    exit 1
}

function Verificar-Saida([string]$Mensagem) {
    if ($LASTEXITCODE -ne 0) { Falhar $Mensagem }
}

if (-not (Test-Path $Gh)) { Falhar "GitHub CLI não encontrado em $Gh." }
if (-not (Test-Path (Join-Path $FrontendProjeto "index.html"))) { Falhar "Execute este arquivo na pasta principal do DocSpace." }

$Zip = Get-ChildItem -Path @(
    (Join-Path $env:USERPROFILE "Downloads\DocSpace-GitHub-v160*.zip"),
    (Join-Path $Projeto "DocSpace-GitHub-v160*.zip")
) -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if (-not $Zip) { Falhar "Baixe DocSpace-GitHub-v160.zip e deixe-o em Downloads ou na pasta do projeto." }

$Extracao = Join-Path $env:TEMP "docspace-atualizacao-v160"
if (Test-Path $Extracao) { Remove-Item $Extracao -Recurse -Force -ErrorAction SilentlyContinue }

Write-Host "`n=== EXTRAINDO A VERSÃO 160 ===" -ForegroundColor Cyan
Expand-Archive -LiteralPath $Zip.FullName -DestinationPath $Extracao -Force

$Fonte = Join-Path $Extracao "DocSpace-Static-GitHub-v160"
if (-not (Test-Path (Join-Path $Fonte "frontend\index.html"))) { Falhar "O pacote v160 está incompleto." }
if (-not (Test-Path (Join-Path $Fonte "pdf-server\app\main.py"))) { Falhar "O serviço Corretor de PDFs não está no pacote." }

Write-Host "`n=== INSTALANDO O CORRETOR DE PDFs EM LOTE ===" -ForegroundColor Cyan
foreach ($Pasta in @("frontend", "backend-worker", "tools", "pdf-server")) {
    $Destino = Join-Path $Projeto $Pasta
    if (Test-Path $Destino) {
        Remove-Item $Destino -Recurse -Force -ErrorAction SilentlyContinue
        if (Test-Path $Destino) { Falhar "Feche arquivos da pasta $Pasta e tente novamente." }
    }
    Copy-Item (Join-Path $Fonte $Pasta) $Destino -Recurse -Force
}

foreach ($Arquivo in @(
    "VERSION.txt", "package.json", "render.yaml", "ALTERACOES_v160.md",
    "PUBLICAR_GITHUB_PAGES_E_WORKER.ps1", "PUBLICAR_TUDO_DOCSPACE.bat",
    "PUBLICAR_TUDO_GITHUB_E_WORKER.bat", ".gitignore"
)) {
    $Origem = Join-Path $Fonte $Arquivo
    if (Test-Path $Origem) { Copy-Item $Origem (Join-Path $Projeto $Arquivo) -Force }
}

Write-Host "`n=== VALIDANDO A VERSÃO ===" -ForegroundColor Cyan
node --check (Join-Path $Projeto "frontend\script.js")
Verificar-Saida "O JavaScript do frontend apresentou erro."
node --check (Join-Path $Projeto "backend-worker\src\worker.js")
Verificar-Saida "O JavaScript do Worker apresentou erro."

Push-Location $Projeto
npm run check
$ResultadoCheck = $LASTEXITCODE
Pop-Location
if ($ResultadoCheck -ne 0) { Falhar "A validação estática da v160 falhou." }

# Procura um interpretador Python realmente funcional.
# Alguns ambientes Windows possuem um atalho do uv chamado "python" que existe no PATH,
# mas não consegue iniciar o processo filho. Nesse caso, usamos o launcher "py -3"
# ou simplesmente deixamos a validação para o Docker do Render.
$PythonExecutavel = $null
$PythonPrefixo = @()

$PyLauncher = Get-Command py -ErrorAction SilentlyContinue
if ($PyLauncher) {
    & $PyLauncher.Source -3 -c "import sys; print(sys.version_info[:2])" *> $null
    if ($LASTEXITCODE -eq 0) {
        $PythonExecutavel = $PyLauncher.Source
        $PythonPrefixo = @("-3")
    }
}

if (-not $PythonExecutavel) {
    foreach ($NomePython in @("python", "python3")) {
        $ComandoPython = Get-Command $NomePython -ErrorAction SilentlyContinue
        if ($ComandoPython) {
            & $ComandoPython.Source -c "import sys; print(sys.version_info[:2])" *> $null
            if ($LASTEXITCODE -eq 0) {
                $PythonExecutavel = $ComandoPython.Source
                $PythonPrefixo = @()
                break
            }
        }
    }
}

if ($PythonExecutavel) {
    & $PythonExecutavel @PythonPrefixo -m py_compile `
        (Join-Path $Projeto "pdf-server\app\main.py") `
        (Join-Path $Projeto "pdf-server\app\processor.py")
    Verificar-Saida "O serviço Python apresentou erro de sintaxe."
} else {
    Write-Host "Python local não está funcional; a validação será feita pelo Docker do Render." -ForegroundColor Yellow
}

Write-Host "`n=== ENVIANDO A V160 PARA A MAIN ===" -ForegroundColor Cyan
git config user.name "DocSpace Publisher"
git config user.email "codebykaua@users.noreply.github.com"

$Remotos = @(git remote)
if ($Remotos -contains "origin") { git remote set-url origin $RepositorioUrl } else { git remote add origin $RepositorioUrl }

git add -A
$Alteracoes = git status --porcelain
if ($Alteracoes) {
    git commit -m "DocSpace v160 - Corretor e Validador de PDFs em lote"
    Verificar-Saida "Não foi possível criar o commit da v160."
} else {
    Write-Host "Nenhuma alteração nova para commit; continuando." -ForegroundColor Yellow
}

git push -u origin main
Verificar-Saida "Não foi possível atualizar a branch main."

Write-Host "`n=== PUBLICANDO O CLOUDFLARE WORKER ===" -ForegroundColor Cyan
Push-Location (Join-Path $Projeto "backend-worker")
npx --yes wrangler deploy
$ResultadoWorker = $LASTEXITCODE
Pop-Location
if ($ResultadoWorker -ne 0) { Falhar "Não foi possível publicar o Worker da v160." }

Write-Host "`n=== PUBLICANDO O FRONTEND NA GH-PAGES ===" -ForegroundColor Cyan
$Publicacao = Join-Path $env:TEMP "docspace-gh-pages-v160"
if (Test-Path $Publicacao) { Remove-Item $Publicacao -Recurse -Force -ErrorAction SilentlyContinue }

git clone $RepositorioUrl $Publicacao
Verificar-Saida "Não foi possível clonar o repositório para publicação."

Push-Location $Publicacao
git checkout --orphan docspace-publicacao-v160
if ($LASTEXITCODE -ne 0) {
    Pop-Location
    Falhar "Não foi possível criar a branch temporária de publicação."
}

Get-ChildItem -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force
Get-ChildItem -LiteralPath $FrontendProjeto -Force | Copy-Item -Destination $Publicacao -Recurse -Force
if (-not (Test-Path (Join-Path $Publicacao "index.html"))) {
    Pop-Location
    Falhar "O index.html não foi copiado para a raiz da publicação."
}
New-Item -Path (Join-Path $Publicacao ".nojekyll") -ItemType File -Force | Out-Null

git add -A
git -c user.name="DocSpace Publisher" -c user.email="codebykaua@users.noreply.github.com" commit -m "Publica DocSpace v160"
if ($LASTEXITCODE -ne 0) {
    Pop-Location
    Falhar "Não foi possível criar o commit de publicação."
}

git push origin HEAD:gh-pages --force
$ResultadoGhPages = $LASTEXITCODE
Pop-Location
if ($ResultadoGhPages -ne 0) { Falhar "Não foi possível atualizar a branch gh-pages." }

Write-Host "`n=== CONFIGURANDO O GITHUB PAGES ===" -ForegroundColor Cyan
$ConfigPages = Join-Path $env:TEMP "docspace-pages-v160.json"
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
if ($ResultadoPages -ne 0) { Falhar "Não foi possível configurar o GitHub Pages." }

Write-Host "`n=== AGUARDANDO O SITE ===" -ForegroundColor Cyan
$UrlFinal = "${SiteUrl}?build=${Versao}"
$Publicado = $false
for ($i = 1; $i -le 36; $i++) {
    Start-Sleep -Seconds 5
    try {
        $Resposta = Invoke-WebRequest -Uri $UrlFinal -UseBasicParsing -TimeoutSec 20
        if ($Resposta.StatusCode -eq 200 -and $Resposta.Content -match "cache-reset-v160") {
            $Publicado = $true
            break
        }
    } catch {
        Write-Host ("Tentativa {0}/36: aguardando o GitHub Pages..." -f $i)
    }
}

Write-Host "`n=== VERIFICANDO O SERVIÇO PESADO ===" -ForegroundColor Cyan
$RenderPronto = $false
for ($i = 1; $i -le 24; $i++) {
    try {
        $Saude = Invoke-RestMethod -Uri "$RenderUrl/health" -Method Get -TimeoutSec 30
        if ($Saude.version -eq "1.60.0" -and $Saude.ok -eq $true) {
            $RenderPronto = $true
            break
        }
    } catch { }
    if ($i -lt 24) {
        Write-Host ("Tentativa {0}/24: aguardando o Render publicar o pdf-server..." -f $i)
        Start-Sleep -Seconds 15
    }
}

Write-Host "`n=================================================" -ForegroundColor Green
if ($Publicado) {
    Write-Host "FRONTEND E WORKER V160 PUBLICADOS" -ForegroundColor Green
} else {
    Write-Host "A publicação foi enviada; o GitHub ainda está atualizando o cache." -ForegroundColor Yellow
}

if ($RenderPronto) {
    Write-Host "SERVIÇO DE CORREÇÃO DE PDFs V160 ATIVO" -ForegroundColor Green
    Write-Host "PDF individual, vários PDFs e ZIP: liberados" -ForegroundColor Green
    Write-Host "Fila persistente e download final em ZIP: ativos" -ForegroundColor Green
} else {
    Write-Host "ATENÇÃO: O SERVIÇO DO RENDER AINDA NÃO ESTÁ NA V160." -ForegroundColor Yellow
    Write-Host "No Render, configure o serviço gerador-de-documentos-1 para usar:" -ForegroundColor Yellow
    Write-Host "Repositório: https://github.com/codebykaua/docspace" -ForegroundColor Yellow
    Write-Host "Root Directory: pdf-server" -ForegroundColor Yellow
    Write-Host "Dockerfile: Dockerfile" -ForegroundColor Yellow
    Write-Host "Mantenha o RENDER_API_SECRET já configurado e faça Manual Deploy." -ForegroundColor Yellow
}

Write-Host "Site: $UrlFinal" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Start-Process $UrlFinal
