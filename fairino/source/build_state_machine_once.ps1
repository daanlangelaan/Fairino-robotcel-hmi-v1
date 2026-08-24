$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$out = Join-Path $root "programs\mini_cell_state_machine_once_generated.lua"
$parts = @(
    "config.lua",
    "io_remote_mirror_noop.lua",
    "io_sim.lua",
    "hmi_modbus.lua",
    "motion.lua",
    "station_filter_dispenser.lua",
    "station_clamp.lua",
    "station_glue.lua",
    "state_machine_once.lua"
)

$content = @(
    "-- Generated from fairino/source modules."
    "-- Finite state-machine simulator POC."
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
