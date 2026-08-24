param(
    [Parameter(Mandatory=$true)]
    [string]$Variant,

    [switch]$EnableHmiModbus,

    [switch]$EnableRemoteIoOutputMirror
)

$ErrorActionPreference = "Stop"

$safeVariant = $Variant -replace '[^a-zA-Z0-9_-]', '_'
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

$root = Split-Path -Parent $PSScriptRoot
$releaseDir = Join-Path $root "programs\releases"
New-Item -ItemType Directory -Force -Path $releaseDir | Out-Null

$outName = "mini_cell_${safeVariant}_${timestamp}.lua"
$out = Join-Path $releaseDir $outName

$hmiLayer = "hmi_modbus_noop.lua"
if ($EnableHmiModbus) {
    $hmiLayer = "hmi_modbus.lua"
}

$remoteIoLayer = "io_remote_mirror_noop.lua"
if ($EnableRemoteIoOutputMirror) {
    $remoteIoLayer = "io_remote_mirror.lua"
}

$parts = @(
    "config.lua",
    $remoteIoLayer,
    "io_sim.lua",
    $hmiLayer,
    "motion.lua",
    "station_filter_dispenser.lua",
    "station_clamp.lua",
    "station_glue.lua",
    "state_machine_once.lua"
)

$content = @(
    "-- Generated from fairino/source modules."
    "-- Variant: $safeVariant"
    "-- Generated: $timestamp"
    "-- Upload this uniquely named file to avoid Fairino WebApp cache/name confusion."
    ""
)

foreach ($part in $parts) {
    $path = Join-Path $PSScriptRoot $part
    $content += "-- BEGIN $part"
    $partContent = Get-Content -Path $path
    if ($part -eq "config.lua" -and $EnableHmiModbus) {
        $partContent = $partContent -replace '^HMI_MODBUS_ENABLED\s*=\s*0$', 'HMI_MODBUS_ENABLED = 1'
    }
    if ($part -eq "config.lua" -and $EnableRemoteIoOutputMirror) {
        $partContent = $partContent -replace '^REMOTE_IO_OUTPUT_MIRROR_ENABLED\s*=\s*0$', 'REMOTE_IO_OUTPUT_MIRROR_ENABLED = 1'
    }
    $content += $partContent
    $content += "-- END $part"
    $content += ""
}

Set-Content -Path $out -Value $content -Encoding ASCII

$latest = Join-Path $root "programs\mini_cell_${safeVariant}_latest.lua"
Copy-Item -Path $out -Destination $latest -Force

Write-Host "Generated release: $out"
Write-Host "Updated latest:    $latest"
