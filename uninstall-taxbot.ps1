$ErrorActionPreference = 'Stop'
function Write-Info($msg) { Write-Host "[taxbot] $msg" -ForegroundColor Cyan }
function Write-OK($msg)   { Write-Host "[taxbot] $msg" -ForegroundColor Green }
$openclawDir = Join-Path $env:USERPROFILE '.openclaw'
if (Test-Path $openclawDir) { Remove-Item $openclawDir -Recurse -Force; Write-OK "Removed $openclawDir" }
$desktop = [Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktop 'Taxbot.lnk'
if (Test-Path $shortcutPath) { Remove-Item $shortcutPath -Force; Write-OK "Removed shortcut" }
Write-OK "Done."
Read-Host "Press Enter to close"
