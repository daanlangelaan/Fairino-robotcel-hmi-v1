@echo off
setlocal
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File ".\fairino\source\build_state_machine_once.ps1"
echo.
echo Built: fairino\programs\mini_cell_state_machine_once_generated.lua
echo.
pause
