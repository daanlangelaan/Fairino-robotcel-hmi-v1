@echo off
setlocal
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File ".\fairino\source\build_glue_variant.ps1" -Variant "glue_servoj_home_test"
echo.
echo Built unique glue release in fairino\programs\releases
echo Built latest copy: fairino\programs\mini_cell_glue_servoj_home_test_latest.lua
echo.
pause
