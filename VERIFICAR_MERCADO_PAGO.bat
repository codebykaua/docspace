@echo off
setlocal
cd /d "%~dp0backend-worker"

echo ====================================================
echo  DocSpace v1.43 - Verificar Mercado Pago
echo ====================================================
echo.

echo [Public Key no wrangler.toml]
findstr /C:"MERCADO_PAGO_PUBLIC_KEY" wrangler.toml
if errorlevel 1 echo NAO ENCONTRADA

echo.
echo [Segredos cadastrados no Worker]
call npx wrangler secret list

echo.
echo Devem existir:
echo - MERCADO_PAGO_ACCESS_TOKEN
echo - MERCADO_PAGO_WEBHOOK_SECRET
echo - APP_SECRET
echo.
echo Depois de qualquer alteracao, execute PUBLICAR_BACKEND_IA.bat.
pause
