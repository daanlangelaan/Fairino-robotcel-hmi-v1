@echo off
setlocal
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File ".\fairino\source\build_variant.ps1" -Variant "good_cycle"
echo.
echo Built unique release in fairino\programs\releases
echo Built latest copy: fairino\programs\mini_cell_good_cycle_latest.lua
echo.
pause
