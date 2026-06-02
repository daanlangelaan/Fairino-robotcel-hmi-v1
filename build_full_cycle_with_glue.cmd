@echo off
setlocal
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File ".\fairino\source\build_variant.ps1" -Variant "full_cycle_with_glue"
echo.
echo Built unique full-cycle release in fairino\programs\releases
echo Built latest copy: fairino\programs\mini_cell_full_cycle_with_glue_latest.lua
echo.
pause
