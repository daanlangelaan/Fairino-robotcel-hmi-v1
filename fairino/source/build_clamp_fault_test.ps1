$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$out = Join-Path $root "programs\mini_cell_clamp_fault_test_generated.lua"
$parts = @(
    "config.lua",
    "io_remote_mirror_noop.lua",
    "io_sim.lua",
    "motion.lua",
    "station_clamp.lua",
    "main_clamp_fault_test.lua"
)

$content = @(
    "-- Generated from fairino/source modules."
    "-- Explicit clamp fault test."
    "-- Upload this file to the Fairino simulator/controller."
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
Write-Host "Generated $out"
