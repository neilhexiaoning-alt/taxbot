# install-taxbot.ps1
# [DEPRECATED] 旧版方案：构建完整 Electron 安装包。
# 新方案请使用 setup-taxbot.ps1（轻量级配置脚本 + 桌面快捷方式）。
#
# Builds OpenClaw and creates a TaxBot installable executable + desktop shortcut.
# Run in an elevated PowerShell if you want to install Node/pnpm globally.

$ErrorActionPreference = 'Stop'

function Write-Info($msg) { Write-Host "[taxbot] $msg" -ForegroundColor Cyan }
function Write-Warn($msg) { Write-Host "[taxbot] $msg" -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host "[taxbot] $msg" -ForegroundColor Red }

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoRoot

Write-Info "Repo: $repoRoot"

# 1) Ensure Node 22+
$nodeOk = $false
try {
  $nodeVersion = node -v
  $nodeOk = $nodeVersion -match '^v(2[2-9]|[3-9]\d)\.'
  Write-Info "Node: $nodeVersion"
} catch {
  Write-Warn "Node.js not found. Please install Node 22+ from https://nodejs.org/"
}

if (-not $nodeOk) {
  Write-Err "Node 22+ is required. Aborting."
  exit 1
}

# 2) Ensure pnpm
$pnpmOk = $true
try {
  $pnpmVersion = pnpm -v
  Write-Info "pnpm: $pnpmVersion"
} catch {
  $pnpmOk = $false
}

if (-not $pnpmOk) {
  Write-Warn "pnpm not found. Installing pnpm globally..."
  try {
    npm i -g pnpm
  } catch {
    Write-Err "Failed to install pnpm. Please run: npm i -g pnpm"
    exit 1
  }
}

# 3) Install deps + build
Write-Info "Installing dependencies..."
pnpm install

Write-Info "Building app..."
pnpm build
pnpm ui:build

# 4) Build Windows installer
Write-Info "Packaging Windows installer..."
pnpm electron:build

# 5) Find the installer exe and copy/rename to taxbot.exe
$distDir = Join-Path $repoRoot 'dist-electron'
if (-not (Test-Path $distDir)) {
  Write-Err "dist-electron not found. Build failed?"
  exit 1
}

$installer = Get-ChildItem -Path $distDir -Filter *.exe -Recurse | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $installer) {
  Write-Err "No .exe installer found in dist-electron."
  exit 1
}

$taxbotExe = Join-Path $distDir 'taxbot.exe'
Copy-Item $installer.FullName $taxbotExe -Force
Write-Info "Installer copied to: $taxbotExe"

# 6) Create desktop shortcut
$desktop = [Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktop 'TaxBot.lnk'
$wsh = New-Object -ComObject WScript.Shell
$shortcut = $wsh.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $taxbotExe
$shortcut.WorkingDirectory = $distDir
$shortcut.IconLocation = $taxbotExe
$shortcut.Save()

Write-Info "Desktop shortcut created: $shortcutPath"
Write-Info "Done. Run taxbot.exe to install."