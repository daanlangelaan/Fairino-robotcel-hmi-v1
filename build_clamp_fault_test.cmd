@echo off
setlocal
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File ".\fairino\source\build_clamp_fault_test.ps1"
echo.
echo Built: fairino\programs\mini_cell_clamp_fault_test_generated.lua
echo.
pause
