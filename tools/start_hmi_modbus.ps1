param(
    [string]$FairinoHost = "192.168.92.130",
    [int]$HmiPort = 8787,
    [switch]$SkipAliasRestore
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$hmiServer = Join-Path $projectRoot "hmi\server.mjs"
$aliasRestore = Join-Path $projectRoot "fairino\tools\restore_hmi_modbus_aliases.ps1"
$bundledNode = "C:\Users\Daan\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$stdoutLogPath = Join-Path $projectRoot "hmi\hmi_modbus_server.out.log"
$stderrLogPath = Join-Path $projectRoot "hmi\hmi_modbus_server.err.log"
$url = "http://127.0.0.1:$HmiPort/"

function Write-Step($message) {
    Write-Host ""
    Write-Host "== $message ==" -ForegroundColor Cyan
}

function Find-Node {
    if (Test-Path $bundledNode) {
        return $bundledNode
    }

    $cmd = Get-Command node.exe -ErrorAction SilentlyContinue
    if ($cmd) {
        return $cmd.Source
    }

    throw "Node.js niet gevonden. Verwachte runtime bestaat niet: $bundledNode"
}

Write-Host "Fairino HMI Modbus starter" -ForegroundColor Green
Write-Host "Project:      $projectRoot"
Write-Host "Fairino host: $FairinoHost"
Write-Host "HMI URL:      $url"

Write-Step "Oude lokale HMI server stoppen"
$oldServers = Get-CimInstance Win32_Process |
    Where-Object { $_.Name -match "node" -and $_.CommandLine -match "hmi\\server\.mjs|hmi/server\.mjs|server\.mjs" }

foreach ($server in $oldServers) {
    Write-Host "Stop node process $($server.ProcessId)"
    Stop-Process -Id $server.ProcessId -Force
}

if (-not $SkipAliasRestore -and (Test-Path $aliasRestore)) {
    Write-Step "Modbus aliases herstellen/controleren"
    try {
        & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $aliasRestore -FairinoHost $FairinoHost
    } catch {
        Write-Warning "Alias restore is niet gelukt. De VM/WebApp is mogelijk nog niet klaar: $($_.Exception.Message)"
        Write-Warning "De HMI start wel door; run dit script opnieuw zodra de VM helemaal opgestart is."
    }
}

Write-Step "HMI bridge starten in Modbus mode"
$node = Find-Node
$env:HMI_BRIDGE_MODE = "modbus"
$env:FAIRINO_HOST = $FairinoHost
$env:PORT = [string]$HmiPort

if (Test-Path $stdoutLogPath) {
    Remove-Item -LiteralPath $stdoutLogPath -Force
}
if (Test-Path $stderrLogPath) {
    Remove-Item -LiteralPath $stderrLogPath -Force
}

Start-Process -FilePath $node `
    -ArgumentList @("hmi\server.mjs") `
    -WorkingDirectory $projectRoot `
    -WindowStyle Hidden `
    -RedirectStandardOutput $stdoutLogPath `
    -RedirectStandardError $stderrLogPath

Start-Sleep -Seconds 1

Write-Step "HMI verbinding controleren"
try {
    $response = Invoke-WebRequest -Uri "$($url)api/registers" -UseBasicParsing -TimeoutSec 3
    $status = $response.Content | ConvertFrom-Json
    Write-Host "Bridge mode:  $($status.mode)"
    Write-Host "Endpoint:     $($status.endpoint)"
    Write-Host "Connected:    $($status.connected)"
} catch {
    Write-Warning "HMI server is gestart, maar /api/registers antwoordde nog niet: $($_.Exception.Message)"
}

Write-Step "Browser openen"
Start-Process $url

Write-Host ""
Write-Host "Klaar. Controleer in de HMI de lampjes 'Modbus' en 'Robot HB'." -ForegroundColor Green
Write-Host "Let op: het Fairino Lua teaching-programma moet zelf ook draaien voor Robot HB."
Write-Host ""
Write-Host "Dit venster sluit over 8 seconden..."
Start-Sleep -Seconds 8
