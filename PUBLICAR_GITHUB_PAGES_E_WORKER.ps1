$ErrorActionPreference = "Continue"
$PSNativeCommandUseErrorActionPreference = $false

$Gh = "$env:ProgramFiles\GitHub CLI\gh.exe"
$Repositorio = "codebykaua/docspace"
$RepositorioUrl = "https://github.com/codebykaua/docspace.git"
$SiteUrl = "https://codebykaua.github.io/docspace/"
$Versao = "155"
$Raiz = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Raiz

function Falhar([string]$Mensagem) { Write-Host "`nERRO: $Mensagem" -ForegroundColor Red; exit 1 }
function Verificar([string]$Mensagem) { if ($LASTEXITCODE -ne 0) { Falhar $Mensagem } }

if (-not (Test-Path $Gh)) { Falhar "GitHub CLI não encontrado." }
if (-not (Test-Path ".\frontend\index.html")) { Falhar "frontend\index.html não encontrado." }
if (-not (Test-Path ".\backend-worker\src\worker.js")) { Falhar "Worker não encontrado." }

node --check ".\frontend\script.js"
Verificar "Erro no JavaScript do frontend."
node --check ".\backend-worker\src\worker.js"
Verificar "Erro no JavaScript do Worker."

git config user.name "DocSpace Publisher"
git config user.email "codebykaua@users.noreply.github.com"
$Remotos = @(git remote)
if ($Remotos -contains "origin") { git remote set-url origin $RepositorioUrl } else { git remote add origin $RepositorioUrl }
git add -A
if (git status --porcelain) { git commit -m "DocSpace v155 - interface compacta em 100 por cento"; Verificar "Falha ao criar commit." }
git push -u origin main
Verificar "Falha ao atualizar a branch main."

$Temp = Join-Path $env:TEMP "docspace-gh-pages-v155"
if (Test-Path $Temp) { Remove-Item $Temp -Recurse -Force -ErrorAction SilentlyContinue }
git clone $RepositorioUrl $Temp
Verificar "Falha ao clonar o repositório."
Push-Location $Temp
git checkout --orphan docspace-publicacao-v155
if ($LASTEXITCODE -ne 0) { Pop-Location; Falhar "Falha ao criar publicação limpa." }
Get-ChildItem -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force
Get-ChildItem -LiteralPath (Join-Path $Raiz "frontend") -Force | Copy-Item -Destination $Temp -Recurse -Force
New-Item -Path ".\.nojekyll" -ItemType File -Force | Out-Null
git add -A
git -c user.name="DocSpace Publisher" -c user.email="codebykaua@users.noreply.github.com" commit -m "Publica DocSpace v155"
if ($LASTEXITCODE -ne 0) { Pop-Location; Falhar "Falha ao criar commit da gh-pages." }
git push origin HEAD:gh-pages --force
$PagesPush = $LASTEXITCODE
Pop-Location
if ($PagesPush -ne 0) { Falhar "Falha ao atualizar gh-pages." }

$Config = Join-Path $env:TEMP "docspace-pages-v155.json"
[System.IO.File]::WriteAllText($Config, '{"build_type":"legacy","source":{"branch":"gh-pages","path":"/"}}', [System.Text.UTF8Encoding]::new($false))
& $Gh api --method PUT "repos/$Repositorio/pages" --input $Config 2>$null
if ($LASTEXITCODE -ne 0) {
    & $Gh api --method DELETE "repos/$Repositorio/pages" 2>$null
    Start-Sleep -Seconds 3
    & $Gh api --method POST "repos/$Repositorio/pages" --input $Config
}
if ($LASTEXITCODE -ne 0) { Falhar "Falha ao configurar GitHub Pages." }

Push-Location ".\backend-worker"
npx --yes wrangler whoami *> $null
if ($LASTEXITCODE -ne 0) { npx --yes wrangler login }
npx --yes wrangler deploy
$Worker = $LASTEXITCODE
Pop-Location
if ($Worker -ne 0) { Falhar "O Worker não foi publicado." }

$UrlFinal = "${SiteUrl}?build=${Versao}"
Write-Host "`nDOCSPACE V155 PUBLICADO" -ForegroundColor Green
Write-Host "Site: $UrlFinal" -ForegroundColor Green
Start-Process $UrlFinal
