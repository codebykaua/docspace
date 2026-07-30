@echo off
setlocal
cd /d "%~dp0backend-worker"

echo ==============================================
echo  DocSpace v1.43 - Configurar chave da IA
echo ==============================================
echo.
echo A chave sera solicitada pelo Wrangler e salva como segredo no Cloudflare.
echo Ela nao sera gravada nos arquivos do projeto.
echo.
call npx wrangler secret put AI_API_KEY
if errorlevel 1 (
  echo.
  echo Nao foi possivel salvar a chave.
  pause
  exit /b 1
)

echo.
echo Chave salva. Execute PUBLICAR_BACKEND_IA.bat em seguida.
pause
