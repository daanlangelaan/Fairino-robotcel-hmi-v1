@echo off
setlocal
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File ".\fairino\source\build_glue_test.ps1"
echo.
echo Built: fairino\programs\mini_cell_glue_test_generated.lua
echo.
pause
