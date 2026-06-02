@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\fairino\source\build_variant.ps1" -Variant "fk_document_cycle_hmi" -EnableHmiModbus
pause
