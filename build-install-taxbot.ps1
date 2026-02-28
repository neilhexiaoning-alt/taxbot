# build-install-taxbot.ps1
# [DEPRECATED] 旧版方案。新方案请使用 build-setup-taxbot.ps1。
# Build a single-file install-taxbot.exe using ps2exe.

$ErrorActionPreference = 'Stop'

function Write-Info($msg) { Write-Host "[taxbot] $msg" -ForegroundColor Cyan }
function Write-Warn($msg) { Write-Host "[taxbot] $msg" -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host "[taxbot] $msg" -ForegroundColor Red }

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoRoot

$inputScript = Join-Path $repoRoot 'install-taxbot.ps1'
if (-not (Test-Path $inputScript)) {
  Write-Err "Missing install-taxbot.ps1. Run that script generation first."
  exit 1
}

$ps2exe = Get-Module -ListAvailable -Name ps2exe | Select-Object -First 1
if (-not $ps2exe) {
  Write-Warn "ps2exe module not found. Installing to CurrentUser..."
  try {
    Set-PSRepository -Name 'PSGallery' -InstallationPolicy Trusted -ErrorAction SilentlyContinue
    Install-Module -Name ps2exe -Scope CurrentUser -Force
  } catch {
    Write-Err "Failed to install ps2exe. You can install it manually: Install-Module ps2exe -Scope CurrentUser"
    exit 1
  }
}

Import-Module ps2exe -ErrorAction Stop

$outputExe = Join-Path $repoRoot 'install-taxbot.exe'
$icon = Join-Path $repoRoot 'ui\assets\icon.ico'

$ps2exeArgs = @{
  InputFile = $inputScript
  OutputFile = $outputExe
  NoConsole = $true
  Title = 'Taxbot Installer'
  Product = 'Taxbot'
  Company = 'OpenClaw'
  Version = '1.0.0.0'
}

if (Test-Path $icon) {
  $ps2exeArgs.IconFile = $icon
}

Write-Info "Building $outputExe ..."
Invoke-PS2EXE @ps2exeArgs
Write-Info "Done. Output: $outputExe"