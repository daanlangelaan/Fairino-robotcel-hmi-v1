@echo off
setlocal
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File ".\fairino\source\build_variant.ps1" -Variant "filter_empty_test"
echo.
echo Built unique release in fairino\programs\releases
echo Built latest copy: fairino\programs\mini_cell_filter_empty_test_latest.lua
echo.
pause
