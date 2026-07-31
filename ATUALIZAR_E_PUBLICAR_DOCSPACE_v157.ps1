$ErrorActionPreference = "Continue"
$PSNativeCommandUseErrorActionPreference = $false

$Gh = "$env:ProgramFiles\GitHub CLI\gh.exe"
$Repositorio = "codebykaua/docspace"
$RepositorioUrl = "https://github.com/codebykaua/docspace.git"
$SiteUrl = "https://codebykaua.github.io/docspace/"
$Versao = "157"
$Projeto = (Get-Location).Path
$FrontendProjeto = Join-Path $Projeto "frontend"
$BackendProjeto = Join-Path $Projeto "backend-worker"

function Falhar([string]$Mensagem) {
    Write-Host "`nERRO: $Mensagem" -ForegroundColor Red
    exit 1
}

function Verificar-Saida([string]$Mensagem) {
    if ($LASTEXITCODE -ne 0) { Falhar $Mensagem }
}

if (-not (Test-Path $Gh)) { Falhar "GitHub CLI não encontrado em $Gh." }
if (-not (Test-Path (Join-Path $FrontendProjeto "index.html"))) { Falhar "Execute este arquivo na pasta principal do DocSpace." }
if (-not (Test-Path (Join-Path $BackendProjeto "wrangler.toml"))) { Falhar "A pasta backend-worker não foi encontrada." }

$Zip = Get-ChildItem -Path @(
    (Join-Path $env:USERPROFILE "Downloads\DocSpace-GitHub-v157*.zip"),
    (Join-Path $Projeto "DocSpace-GitHub-v157*.zip")
) -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if (-not $Zip) { Falhar "Baixe DocSpace-GitHub-v157.zip e deixe-o em Downloads ou na pasta do projeto." }

$Extracao = Join-Path $env:TEMP "docspace-atualizacao-v157"
if (Test-Path $Extracao) { Remove-Item $Extracao -Recurse -Force -ErrorAction SilentlyContinue }

Write-Host "`n=== EXTRAINDO A VERSÃO 157 ===" -ForegroundColor Cyan
Expand-Archive -LiteralPath $Zip.FullName -DestinationPath $Extracao -Force

$Fonte = Join-Path $Extracao "DocSpace-Static-GitHub-v157"
if (-not (Test-Path (Join-Path $Fonte "frontend\index.html"))) { Falhar "O pacote v157 está incompleto." }
if (-not (Test-Path (Join-Path $Fonte "backend-worker\src\worker.js"))) { Falhar "O Worker v157 não foi encontrado." }

Write-Host "`n=== INSTALANDO O POWERPOINT VISUAL COM IMAGENS REAIS ===" -ForegroundColor Cyan
if (Test-Path $FrontendProjeto) {
    Remove-Item $FrontendProjeto -Recurse -Force -ErrorAction SilentlyContinue
    if (Test-Path $FrontendProjeto) { Falhar "Feche arquivos do frontend que estejam abertos e tente novamente." }
}
Copy-Item (Join-Path $Fonte "frontend") $FrontendProjeto -Recurse -Force
Copy-Item (Join-Path $Fonte "backend-worker\src\worker.js") (Join-Path $BackendProjeto "src\worker.js") -Force
Copy-Item (Join-Path $Fonte "VERSION.txt") (Join-Path $Projeto "VERSION.txt") -Force
Copy-Item (Join-Path $Fonte "ALTERACOES_v157.md") (Join-Path $Projeto "ALTERACOES_v157.md") -Force

Write-Host "`n=== VALIDANDO A VERSÃO ===" -ForegroundColor Cyan
node --check (Join-Path $FrontendProjeto "script.js")
Verificar-Saida "O JavaScript do frontend apresentou erro."
node --check (Join-Path $BackendProjeto "src\worker.js")
Verificar-Saida "O JavaScript do Worker apresentou erro."

$Script = [System.IO.File]::ReadAllText((Join-Path $FrontendProjeto "script.js"), [System.Text.Encoding]::UTF8)
$Css = [System.IO.File]::ReadAllText((Join-Path $FrontendProjeto "lovable-original.css"), [System.Text.Encoding]::UTF8)
$Worker = [System.IO.File]::ReadAllText((Join-Path $BackendProjeto "src\worker.js"), [System.Text.Encoding]::UTF8)
$Index = [System.IO.File]::ReadAllText((Join-Path $FrontendProjeto "index.html"), [System.Text.Encoding]::UTF8)

if ($Script -notmatch "renderPowerpointEditor" -or $Script -notmatch "office-powerpoint") { Falhar "O Editor PowerPoint não foi instalado." }
if ($Css -notmatch "DocSpace v157" -or $Css -notmatch "powerpoint-layout-cover") { Falhar "Os novos layouts visuais do PowerPoint não foram instalados." }
if ($Worker -notmatch "office-powerpoint" -or $Worker -notmatch "searchPresentationMedia") { Falhar "A IA e a busca de imagens do PowerPoint não foram instaladas no Worker." }
if ($Index -notmatch "pptxgenjs@4.0.1" -or $Index -notmatch 'data-view="powerpoint"') { Falhar "A biblioteca PowerPoint não foi instalada no HTML." }

Write-Host "`n=== ENVIANDO A V157 PARA A MAIN ===" -ForegroundColor Cyan
git config user.name "DocSpace Publisher"
git config user.email "codebykaua@users.noreply.github.com"

$Remotos = @(git remote)
if ($Remotos -contains "origin") { git remote set-url origin $RepositorioUrl } else { git remote add origin $RepositorioUrl }

git add -A
$Alteracoes = git status --porcelain
if ($Alteracoes) {
    git commit -m "DocSpace v157 - PowerPoint visual com imagens e ícones SVG"
    Verificar-Saida "Não foi possível criar o commit da v157."
} else {
    Write-Host "Nenhuma alteração nova para commit; continuando." -ForegroundColor Yellow
}

git push -u origin main
Verificar-Saida "Não foi possível atualizar a branch main."

Write-Host "`n=== PUBLICANDO O FRONTEND NA GH-PAGES ===" -ForegroundColor Cyan
$Publicacao = Join-Path $env:TEMP "docspace-gh-pages-v157"
if (Test-Path $Publicacao) { Remove-Item $Publicacao -Recurse -Force -ErrorAction SilentlyContinue }

git clone $RepositorioUrl $Publicacao
Verificar-Saida "Não foi possível clonar o repositório para publicação."

Push-Location $Publicacao
git checkout --orphan docspace-publicacao-v157
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
git -c user.name="DocSpace Publisher" -c user.email="codebykaua@users.noreply.github.com" commit -m "Publica DocSpace v157"
if ($LASTEXITCODE -ne 0) {
    Pop-Location
    Falhar "Não foi possível criar o commit de publicação."
}

git push origin HEAD:gh-pages --force
$ResultadoGhPages = $LASTEXITCODE
Pop-Location
if ($ResultadoGhPages -ne 0) { Falhar "Não foi possível atualizar a branch gh-pages." }

Write-Host "`n=== CONFIGURANDO O GITHUB PAGES ===" -ForegroundColor Cyan
$ConfigPages = Join-Path $env:TEMP "docspace-pages-v157.json"
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

Write-Host "`n=== PUBLICANDO A IA DO POWERPOINT NO CLOUDFLARE ===" -ForegroundColor Cyan
Push-Location $BackendProjeto
npx --yes wrangler whoami *> $null
if ($LASTEXITCODE -ne 0) { npx --yes wrangler login }
npx --yes wrangler deploy
$ResultadoWorker = $LASTEXITCODE
Pop-Location
if ($ResultadoWorker -ne 0) { Falhar "O GitHub foi atualizado, mas o Worker não foi publicado." }

Write-Host "`n=== AGUARDANDO O SITE RESPONDER ===" -ForegroundColor Cyan
$UrlFinal = "${SiteUrl}?build=${Versao}"
$Publicado = $false
for ($i = 1; $i -le 36; $i++) {
    Start-Sleep -Seconds 5
    try {
        $Resposta = Invoke-WebRequest -Uri $UrlFinal -UseBasicParsing -TimeoutSec 20
        if ($Resposta.StatusCode -eq 200 -and $Resposta.Content -match "cache-reset-v157") {
            $Publicado = $true
            break
        }
    } catch {
        Write-Host ("Tentativa {0}/36: aguardando o GitHub Pages..." -f $i)
    }
}

Write-Host "`n=================================================" -ForegroundColor Green
if ($Publicado) {
    Write-Host "DOCSPACE V157 PUBLICADO COM SUCESSO" -ForegroundColor Green
} else {
    Write-Host "A publicação terminou, mas o GitHub ainda está atualizando o cache." -ForegroundColor Yellow
}
Write-Host "Site: $UrlFinal" -ForegroundColor Green
Write-Host "PowerPoint: layouts profissionais, fotografias reais e ícones SVG" -ForegroundColor Green
Write-Host "Office: Word, Excel e PowerPoint com IA contextual" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

Start-Process $UrlFinal
