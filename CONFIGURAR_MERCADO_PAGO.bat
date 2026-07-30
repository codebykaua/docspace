@echo off
setlocal
cd /d "%~dp0backend-worker"

echo ====================================================
echo  DocSpace v1.43 - Configurar Mercado Pago
echo ====================================================
echo.

findstr /C:"MERCADO_PAGO_PUBLIC_KEY" wrangler.toml >nul
if errorlevel 1 (
  echo ATENCAO: MERCADO_PAGO_PUBLIC_KEY nao foi encontrada em backend-worker\wrangler.toml.
  echo Adicione a Public Key de producao ou teste antes de publicar o Worker.
  echo.
) else (
  echo Public Key encontrada em wrangler.toml.
  echo.
)

echo Os valores privados abaixo serao solicitados pelo Wrangler e nao serao gravados no projeto.
echo.

echo [1/3] Access Token privado do Mercado Pago
call npx wrangler secret put MERCADO_PAGO_ACCESS_TOKEN
if errorlevel 1 goto :erro

echo.
echo [2/3] Assinatura secreta do webhook do Mercado Pago
call npx wrangler secret put MERCADO_PAGO_WEBHOOK_SECRET
if errorlevel 1 goto :erro

echo.
echo [3/3] Segredo longo e aleatorio para sessoes e tokens do DocSpace
call npx wrangler secret put APP_SECRET
if errorlevel 1 goto :erro

echo.
echo Configuracao concluida. Execute PUBLICAR_BACKEND_IA.bat.
pause
exit /b 0

:erro
echo.
echo Nao foi possivel salvar um dos segredos.
pause
exit /b 1
