@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
color 0A
title DocSpace v1.51 - GitHub Pages + Cloudflare Worker

set "ROOT=%~dp0"
set "WORKER_DIR=%ROOT%backend-worker"
set "FRONTEND_DIR=%ROOT%frontend"
set "BUILD_VERSION=151"
set "DEFAULT_REPO=docspace"

cls
echo ============================================================
echo       DOCSPACE v1.49 - PUBLICACAO COMPLETA AUTOMATICA
echo ============================================================
echo.
echo Este programa publica:
echo   1. Frontend atual no GitHub Pages
echo   2. API, IA, banco e Mercado Pago no Cloudflare Worker
echo.

if not exist "%FRONTEND_DIR%\index.html" goto :missing_files
if not exist "%ROOT%.github\workflows\pages.yml" goto :missing_files
if not exist "%WORKER_DIR%\wrangler.toml" goto :missing_files
if not exist "%WORKER_DIR%\src\worker.js" goto :missing_files

call :ensure_command git Git.Git "Git"
if errorlevel 1 goto :dependency_failed
call :ensure_command gh GitHub.cli "GitHub CLI"
if errorlevel 1 goto :dependency_failed
call :ensure_command node OpenJS.NodeJS.LTS "Node.js LTS"
if errorlevel 1 goto :dependency_failed
where npm >nul 2>&1
if errorlevel 1 goto :dependency_failed

call :step "Entrando no GitHub"
gh auth status >nul 2>&1
if errorlevel 1 (
    echo O navegador sera aberto para autorizar o GitHub.
    gh auth login --web --git-protocol https
    if errorlevel 1 goto :github_login_failed
)
gh auth setup-git >nul 2>&1
for /f "usebackq delims=" %%U in (`gh api user --jq .login`) do set "GITHUB_USER=%%U"
if not defined GITHUB_USER goto :github_login_failed

echo Conta GitHub: !GITHUB_USER!
set /p "GITHUB_REPO=Nome do repositorio [!DEFAULT_REPO!]: "
if not defined GITHUB_REPO set "GITHUB_REPO=!DEFAULT_REPO!"
set "FULL_REPO=!GITHUB_USER!/!GITHUB_REPO!"

if /I "!GITHUB_REPO!"=="!GITHUB_USER!.github.io" (
    set "SITE_URL=https://!GITHUB_USER!.github.io/"
) else (
    set "SITE_URL=https://!GITHUB_USER!.github.io/!GITHUB_REPO!/"
)
set "GITHUB_ORIGIN=https://!GITHUB_USER!.github.io"

echo.
echo Repositorio: !FULL_REPO!
echo Site final: !SITE_URL!
echo.

call :step "Preparando configuracao do Worker para o GitHub Pages"
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$p='%WORKER_DIR%\wrangler.toml'; $s=Get-Content -Raw -LiteralPath $p;" ^
  "$s=[regex]::Replace($s,'PUBLIC_APP_URL\s*=\s*\"[^\"]*\"','PUBLIC_APP_URL = \"!SITE_URL!\"');" ^
  "$origins='!GITHUB_ORIGIN!,https://*.github.io,https://docspace-web.pages.dev,https://*.pages.dev';" ^
  "$s=[regex]::Replace($s,'CORS_ALLOWED_ORIGINS\s*=\s*\"[^\"]*\"','CORS_ALLOWED_ORIGINS = \"'+$origins+'\"');" ^
  "Set-Content -LiteralPath $p -Value $s -Encoding UTF8"
if errorlevel 1 goto :config_failed

call :step "Validando projeto"
if exist "%ROOT%tools\check-static.mjs" (
    pushd "%ROOT%"
    call node tools\check-static.mjs
    set "CHECK_EXIT=!errorlevel!"
    popd
    if not "!CHECK_EXIT!"=="0" goto :check_failed
)
call node --check "%FRONTEND_DIR%\script.js"
if errorlevel 1 goto :check_failed
call node --check "%WORKER_DIR%\src\worker.js"
if errorlevel 1 goto :check_failed

call :step "Preparando repositorio GitHub"
pushd "%ROOT%"
if not exist ".git" git init
if errorlevel 1 goto :git_failed
git branch -M main

gh repo view "!FULL_REPO!" >nul 2>&1
if errorlevel 1 (
    echo Criando repositorio publico !FULL_REPO!...
    gh repo create "!FULL_REPO!" --public --description "DocSpace - documentos, PDF, Office e IA" --disable-issues --disable-wiki
    if errorlevel 1 goto :github_repo_failed
    set "REPO_EXISTED=0"
) else (
    set "REPO_EXISTED=1"
)

for /f "delims=" %%R in ('git remote') do set "HAS_REMOTE=1"
if defined HAS_REMOTE (
    git remote set-url origin "https://github.com/!FULL_REPO!.git"
) else (
    git remote add origin "https://github.com/!FULL_REPO!.git"
)

git add -A
git diff --cached --quiet
if errorlevel 1 (
    git -c user.name="DocSpace Publisher" -c user.email="docspace@users.noreply.github.com" commit -m "DocSpace v1.51 - GitHub Pages responsivo"
    if errorlevel 1 goto :git_failed
) else (
    echo Nenhuma alteracao nova para commit. Publicando a versao atual.
)

if "!REPO_EXISTED!"=="1" (
    git ls-remote --exit-code --heads origin main >nul 2>&1
    if not errorlevel 1 (
        echo.
        echo O repositorio ja possui a branch main.
        choice /C SN /N /M "Substituir a branch main pela versao atual do DocSpace? [S/N]: "
        if errorlevel 2 goto :cancelled
        git fetch origin main:refs/remotes/origin/main
        if errorlevel 1 goto :git_push_failed
        git push -u origin main --force-with-lease
    ) else (
        git push -u origin main
    )
) else (
    git push -u origin main
)
if errorlevel 1 goto :git_push_failed
popd

call :step "Ativando GitHub Pages pelo workflow"
gh api --method POST "repos/!FULL_REPO!/pages" -f build_type=workflow >nul 2>&1
if errorlevel 1 gh api --method PUT "repos/!FULL_REPO!/pages" -f build_type=workflow >nul 2>&1
if errorlevel 1 (
    echo Aviso: nao foi possivel alterar a fonte do Pages pela API.
    echo O workflow ainda foi enviado. Se necessario, abra Settings ^> Pages e escolha GitHub Actions.
)

rem Garante uma nova execucao depois de o Pages estar habilitado.
gh workflow run pages.yml --repo "!FULL_REPO!" >nul 2>&1

call :step "Publicando Cloudflare Worker"
call npx --yes wrangler whoami >nul 2>&1
if errorlevel 1 (
    echo O navegador sera aberto para autorizar o Cloudflare.
    call npx --yes wrangler login
    if errorlevel 1 goto :cloudflare_login_failed
)
pushd "%WORKER_DIR%"
call npx --yes wrangler deploy
set "WORKER_EXIT=!errorlevel!"
popd
if not "!WORKER_EXIT!"=="0" goto :worker_failed

call :step "Aguardando GitHub Actions publicar o site"
set "RUN_ID="
for /L %%N in (1,1,12) do (
    for /f "usebackq delims=" %%I in (`gh run list --repo "!FULL_REPO!" --workflow pages.yml --limit 1 --json databaseId --jq ".[0].databaseId" 2^>nul`) do set "RUN_ID=%%I"
    if defined RUN_ID goto :run_found
    timeout /t 5 /nobreak >nul
)
:run_found
if defined RUN_ID (
    echo Acompanhando execucao !RUN_ID!...
    gh run watch !RUN_ID! --repo "!FULL_REPO!" --exit-status
    if errorlevel 1 goto :pages_failed
) else (
    echo O workflow ainda nao apareceu na lista. Confira a aba Actions do repositorio.
)

call :step "Publicacao concluida"
echo.
echo ============================================================
echo             PUBLICACAO CONCLUIDA COM SUCESSO
echo ============================================================
echo.
echo Site atual: !SITE_URL!?build=!BUILD_VERSION!
echo Repositorio: https://github.com/!FULL_REPO!
echo API: Cloudflare Worker docspace-api

echo Abrindo o site atual...
start "" "!SITE_URL!?build=!BUILD_VERSION!^&t=%RANDOM%"
pause
exit /b 0

:ensure_command
where %~1 >nul 2>&1
if not errorlevel 1 exit /b 0
echo %~3 nao encontrado. Tentando instalar automaticamente...
where winget >nul 2>&1
if errorlevel 1 (
    echo ERRO: instale %~3 e execute novamente.
    exit /b 1
)
winget install --id %~2 -e --accept-package-agreements --accept-source-agreements
if errorlevel 1 exit /b 1
set "PATH=%PATH%;%ProgramFiles%\Git\cmd;%ProgramFiles%\GitHub CLI;%ProgramFiles%\nodejs"
where %~1 >nul 2>&1
if errorlevel 1 (
    echo Feche esta janela, abra novamente e execute o publicador.
    exit /b 1
)
exit /b 0

:step
echo.
echo ------------------------------------------------------------
echo %~1
echo ------------------------------------------------------------
exit /b 0

:missing_files
echo ERRO: projeto incompleto. Extraia o ZIP inteiro antes de executar.
goto :failure
:dependency_failed
echo ERRO: nao foi possivel instalar ou localizar as ferramentas necessarias.
goto :failure
:github_login_failed
echo ERRO: nao foi possivel autenticar no GitHub.
goto :failure
:github_repo_failed
echo ERRO: nao foi possivel criar ou acessar o repositorio GitHub.
goto :failure
:config_failed
echo ERRO: nao foi possivel atualizar wrangler.toml.
goto :failure
:check_failed
echo ERRO: a validacao local falhou. Nada foi publicado.
goto :failure
:git_failed
popd >nul 2>&1
echo ERRO: falha ao preparar o Git local.
goto :failure
:git_push_failed
popd >nul 2>&1
echo ERRO: falha ao enviar os arquivos ao GitHub.
goto :failure
:cloudflare_login_failed
echo ERRO: nao foi possivel autenticar no Cloudflare.
goto :failure
:worker_failed
echo ERRO: o frontend foi enviado ao GitHub, mas o Worker falhou.
goto :failure
:pages_failed
echo ERRO: o GitHub Actions encontrou um erro ao publicar o Pages.
echo Abra a aba Actions do repositorio para ver os detalhes.
goto :failure
:cancelled
popd >nul 2>&1
echo Publicacao cancelada para proteger a branch existente.
goto :failure
:failure
echo.
echo A publicacao foi interrompida. Leia a mensagem acima.
pause
exit /b 1
