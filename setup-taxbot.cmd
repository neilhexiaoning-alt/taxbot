@echo off
setlocal
set "DIR=%~dp0"
powershell -ExecutionPolicy Bypass -File "%DIR%setup-taxbot.ps1"
endlocal
