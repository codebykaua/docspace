# DocSpace v1.60 - corrige a conta Cloudflare com segurança e continua a publicação
# Não migra nem recria o D1 automaticamente.

[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$ErrorActionPreference = "Stop"
$PSNativeCommandUseErrorActionPreference = $false

$Raiz = (Get-Location).Path
$WranglerToml = Join-Path $Raiz "backend-worker\wrangler.toml"
$Atualizador = Join-Path $Raiz "ATUALIZAR_E_PUBLICAR_DOCSPACE_v160_CORRIGIDO.ps1"
$DatabaseIdEsperado = "2f8261c2-0c2f-49c4-8080-6c78320367c1"
$DatabaseNomeEsperado = "gerador_documentos_rurais"

if (-not (Test-Path $WranglerToml)) {
    throw "Não encontrei backend-worker\wrangler.toml. Execute na pasta principal do DocSpace."
}

if (-not (Test-Path $Atualizador)) {
    throw "Não encontrei ATUALIZAR_E_PUBLICAR_DOCSPACE_v160_CORRIGIDO.ps1 na pasta do projeto."
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

    return [pscustomobject]@{
        Text = $Texto
        ExitCode = $Codigo
    }
}

function Get-ContaAtual {
    $Resultado = Invoke-NativeText { npx --yes wrangler whoami }
    Write-Host $Resultado.Text

    if ($Resultado.ExitCode -ne 0) {
        return $null
    }

    $Ids = [regex]::Matches($Resultado.Text, '(?i)\b[a-f0-9]{32}\b') |
        ForEach-Object { $_.Value.ToLowerInvariant() } |
        Select-Object -Unique

    if (@($Ids).Count -eq 1) {
        return @($Ids)[0]
    }

    return $null
}

function Test-BancoNaContaAtual {
    $Resultado = Invoke-NativeText { npx --yes wrangler d1 list --json }

    if ($Resultado.ExitCode -ne 0) {
        Write-Host $Resultado.Text -ForegroundColor Yellow
        return $false
    }

    try {
        $Lista = $Resultado.Text | ConvertFrom-Json
    }
    catch {
        Write-Host "Não foi possível interpretar a lista do D1." -ForegroundColor Yellow
        Write-Host $Resultado.Text
        return $false
    }

    $BancoExato = @($Lista) | Where-Object {
        ($_.uuid -eq $DatabaseIdEsperado) -or
        ($_.id -eq $DatabaseIdEsperado)
    } | Select-Object -First 1

    if ($BancoExato) {
        Write-Host "Banco D1 correto encontrado: $DatabaseNomeEsperado" -ForegroundColor Green
        return $true
    }

    $MesmoNome = @($Lista) | Where-Object { $_.name -eq $DatabaseNomeEsperado } | Select-Object -First 1
    if ($MesmoNome) {
        Write-Host "Existe um banco com o mesmo nome, mas com outro ID. Nada será alterado automaticamente." -ForegroundColor Yellow
    }

    return $false
}

Write-Host "`n=== VERIFICANDO A CONTA CLOUDFLARE ===" -ForegroundColor Cyan
$ContaAtual = Get-ContaAtual
$BancoCorreto = Test-BancoNaContaAtual

if (-not $ContaAtual -or -not $BancoCorreto) {
    Write-Host "`nA conta autenticada não possui o banco D1 original do DocSpace." -ForegroundColor Yellow
    Write-Host "Será aberto um novo login. Entre na conta Cloudflare que contém:" -ForegroundColor Yellow
    Write-Host "- Worker: docspace-api" -ForegroundColor Yellow
    Write-Host "- D1: gerador_documentos_rurais" -ForegroundColor Yellow
    Write-Host "- ID esperado do D1: $DatabaseIdEsperado" -ForegroundColor Yellow

    $Logout = Invoke-NativeText { npx --yes wrangler logout }
    $Login = Invoke-NativeText { npx --yes wrangler login }
    Write-Host $Login.Text

    if ($Login.ExitCode -ne 0) {
        throw "O login da Cloudflare não foi concluído."
    }

    Write-Host "`n=== CONFERINDO A NOVA CONTA ===" -ForegroundColor Cyan
    $ContaAtual = Get-ContaAtual
    $BancoCorreto = Test-BancoNaContaAtual
}

if (-not $ContaAtual -or -not $BancoCorreto) {
    Write-Host "`nNÃO ALTEREI o account_id nem o banco de dados." -ForegroundColor Red
    Write-Host "A conta selecionada ainda não possui o D1 original do DocSpace." -ForegroundColor Red
    Write-Host "Entre na conta proprietária do Worker docspace-api e execute este arquivo novamente." -ForegroundColor Red
    exit 2
}

Write-Host "`n=== CORRIGINDO O ACCOUNT_ID COM SEGURANÇA ===" -ForegroundColor Cyan

$Backup = "$WranglerToml.backup-antes-correcao"
Copy-Item $WranglerToml $Backup -Force

$Toml = [System.IO.File]::ReadAllText($WranglerToml, [System.Text.Encoding]::UTF8)

if ($Toml -match '(?m)^account_id\s*=') {
    $Toml = [regex]::Replace(
        $Toml,
        '(?m)^account_id\s*=\s*"[^"]*"\s*$',
        "account_id = `"$ContaAtual`""
    )
}
else {
    $Toml = $Toml -replace '(?m)^(workers_dev\s*=\s*true\s*)$', "`$1`r`naccount_id = `"$ContaAtual`""
}

[System.IO.File]::WriteAllText(
    $WranglerToml,
    $Toml,
    [System.Text.UTF8Encoding]::new($false)
)

Write-Host "Conta configurada: $ContaAtual" -ForegroundColor Green
Write-Host "Backup criado: $Backup" -ForegroundColor DarkGray

Write-Host "`n=== CONTINUANDO A PUBLICAÇÃO DA V160 ===" -ForegroundColor Cyan
& $Atualizador

if ($LASTEXITCODE -ne 0) {
    throw "O atualizador terminou com erro."
}
