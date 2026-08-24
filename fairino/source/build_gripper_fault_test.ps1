$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$out = Join-Path $root "programs\mini_cell_gripper_fault_test_generated.lua"
$parts = @(
    "config.lua",
    "io_remote_mirror_noop.lua",
    "io_sim.lua",
    "motion.lua",
    "main_gripper_fault_test.lua"
)

$content = @(
    "-- Generated from fairino/source modules."
    "-- Explicit gripper fault test: pick only, then DO4 red fault, no place move."
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
