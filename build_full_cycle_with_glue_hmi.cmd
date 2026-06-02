@echo off
setlocal
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File ".\fairino\source\build_variant.ps1" -Variant "full_cycle_with_glue_hmi" -EnableHmiModbus
echo.
echo Built unique HMI-enabled full-cycle release in fairino\programs\releases
echo Built latest copy: fairino\programs\mini_cell_full_cycle_with_glue_hmi_latest.lua
echo.
pause
