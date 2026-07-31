$ErrorActionPreference = "Stop"
$PSNativeCommandUseErrorActionPreference = $false

$Repositorio = "codebykaua/docspace"
$RepositorioUrl = "https://github.com/codebykaua/docspace.git"
$SiteUrl = "https://codebykaua.github.io/docspace/"
$Versao = "152"
$Gh = "$env:ProgramFiles\GitHub CLI\gh.exe"
$Raiz = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Raiz

if (-not (Test-Path $Gh)) { throw "GitHub CLI não encontrado." }
if (-not (Test-Path ".\frontend\index.html")) { throw "frontend\index.html não encontrado." }
if (-not (Test-Path ".\backend-worker\wrangler.toml")) { throw "backend-worker\wrangler.toml não encontrado." }

& $Gh auth status *> $null
if ($LASTEXITCODE -ne 0) { & $Gh auth login --web --git-protocol https }
if ($LASTEXITCODE -ne 0) { throw "Falha no login do GitHub." }

node --check ".\frontend\script.js"
if ($LASTEXITCODE -ne 0) { throw "Erro no frontend." }
node --check ".\backend-worker\src\worker.js"
if ($LASTEXITCODE -ne 0) { throw "Erro no Worker." }

# Atualiza main com os arquivos atuais.
if (-not (Test-Path ".git")) { git init }
git branch -M main
git config user.name "DocSpace Publisher"
git config user.email "codebykaua@users.noreply.github.com"
$remotos = @(git remote)
if ($remotos -contains "origin") { git remote set-url origin $RepositorioUrl } else { git remote add origin $RepositorioUrl }
git add -A
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) { git commit -m "DocSpace v$Versao" }
git push -u origin main --force
if ($LASTEXITCODE -ne 0) { throw "Falha ao atualizar a branch main." }

# Publica somente o conteúdo de frontend na raiz da gh-pages.
$Temp = Join-Path $env:TEMP "docspace-gh-pages-v$Versao"
if (Test-Path $Temp) { Remove-Item $Temp -Recurse -Force }
git clone $RepositorioUrl $Temp
if ($LASTEXITCODE -ne 0) { throw "Falha ao clonar o repositório." }
Push-Location $Temp
git checkout --orphan gh-pages
Get-ChildItem -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force
Get-ChildItem -LiteralPath (Join-Path $Raiz "frontend") -Force | Copy-Item -Destination $Temp -Recurse -Force
if (-not (Test-Path ".\index.html")) { Pop-Location; throw "index.html não foi copiado para gh-pages." }
if (-not (Test-Path ".\.nojekyll")) { New-Item ".\.nojekyll" -ItemType File -Force | Out-Null }
git add -A
git -c user.name="DocSpace Publisher" -c user.email="codebykaua@users.noreply.github.com" commit -m "Publica DocSpace v$Versao"
git push origin gh-pages --force
$PushPages = $LASTEXITCODE
Pop-Location
if ($PushPages -ne 0) { throw "Falha ao publicar gh-pages." }

# Configura Pages para gh-pages. Não tenta desativar workflow.
$Config = Join-Path $env:TEMP "docspace-pages-config.json"
[System.IO.File]::WriteAllText($Config, '{"build_type":"legacy","source":{"branch":"gh-pages","path":"/"}}', (New-Object System.Text.UTF8Encoding($false)))
& $Gh api --method PUT "repos/$Repositorio/pages" --input $Config *> $null
if ($LASTEXITCODE -ne 0) {
    & $Gh api --method DELETE "repos/$Repositorio/pages" *> $null
    Start-Sleep -Seconds 3
    & $Gh api --method POST "repos/$Repositorio/pages" --input $Config *> $null
}
if ($LASTEXITCODE -ne 0) { throw "Falha ao configurar GitHub Pages." }

# Publica Worker.
Push-Location ".\backend-worker"
npx --yes wrangler whoami *> $null
if ($LASTEXITCODE -ne 0) { npx --yes wrangler login }
npx --yes wrangler deploy
$WorkerExit = $LASTEXITCODE
Pop-Location
if ($WorkerExit -ne 0) { throw "Site publicado, mas Worker falhou." }

$UrlFinal = "${SiteUrl}?build=${Versao}"
Write-Host "PUBLICAÇÃO CONCLUÍDA" -ForegroundColor Green
Write-Host "Site: $UrlFinal" -ForegroundColor Green
Start-Process $UrlFinal
