@echo off
cd /d "%~dp0\.."
set NODE_ENV=development
set ELECTRON_RUN_AS_NODE=
echo Starting OpenClaw Desktop...
node electron\launch.cjs
echo.
echo OpenClaw Desktop exited.
pause
