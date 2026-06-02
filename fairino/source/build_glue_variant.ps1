param(
    [string]$Variant = "glue_j6_test"
)

$ErrorActionPreference = "Stop"

$safeVariant = $Variant -replace '[^a-zA-Z0-9_-]', '_'
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

$root = Split-Path -Parent $PSScriptRoot
$releaseDir = Join-Path $root "programs\releases"
New-Item -ItemType Directory -Force -Path $releaseDir | Out-Null

$outName = "mini_cell_${safeVariant}_${timestamp}.lua"
$out = Join-Path $releaseDir $outName

$parts = @(
    "config.lua",
    "io_sim.lua",
    "motion.lua",
    "station_glue.lua",
    "main_glue_test.lua"
)

$content = @(
    "-- Generated from fairino/source modules."
    "-- Variant: $safeVariant"
    "-- Generated: $timestamp"
    "-- Glue/J6 test build."
    "-- Upload this uniquely named file to avoid Fairino WebApp cache/name confusion."
    ""
)

foreach ($part in $parts) {
    $path = Join-Path $PSScriptRoot $part
    $content += "-- BEGIN $part"
    $content += Get-Content -Path $path
    $content += "-- END $part"
    $content += ""
}

Set-Content -Path $out -Value $content -Encoding ASCII

$latest = Join-Path $root "programs\mini_cell_${safeVariant}_latest.lua"
Copy-Item -Path $out -Destination $latest -Force

Write-Host "Generated glue release: $out"
Write-Host "Updated latest:        $latest"
