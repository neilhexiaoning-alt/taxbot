# build-setup-taxbot.ps1
# 将 setup-taxbot.ps1 编译为可独立分发的 setup-taxbot.exe。
# 使用 ps2exe 模块（自动安装）。
#
# 用法：powershell -ExecutionPolicy Bypass -File build-setup-taxbot.ps1

$ErrorActionPreference = 'Stop'

function Write-Info($msg) { Write-Host "[build] $msg" -ForegroundColor Cyan }
function Write-Warn($msg) { Write-Host "[build] $msg" -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host "[build] $msg" -ForegroundColor Red }
function Write-OK($msg)   { Write-Host "[build] $msg" -ForegroundColor Green }

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoRoot

$inputScript = Join-Path $repoRoot 'setup-taxbot.ps1'
if (-not (Test-Path $inputScript)) {
  Write-Err "找不到 setup-taxbot.ps1"
  exit 1
}

# 检查/安装 ps2exe 模块
$ps2exe = Get-Module -ListAvailable -Name ps2exe | Select-Object -First 1
if (-not $ps2exe) {
  Write-Warn "ps2exe 模块未安装，正在安装 ..."
  try {
    Set-PSRepository -Name 'PSGallery' -InstallationPolicy Trusted -ErrorAction SilentlyContinue
    Install-Module -Name ps2exe -Scope CurrentUser -Force
  } catch {
    Write-Err "ps2exe 安装失败，请手动安装: Install-Module ps2exe -Scope CurrentUser"
    exit 1
  }
}

Import-Module ps2exe -ErrorAction Stop

$outputExe = Join-Path $repoRoot 'setup-taxbot.exe'
$icon = Join-Path (Join-Path (Join-Path $repoRoot 'ui') 'assets') 'icon.ico'

$ps2exeArgs = @{
  InputFile  = $inputScript
  OutputFile = $outputExe
  NoConsole  = $false       # 保留控制台，显示安装进度
  Title      = 'TaxBot Setup'
  Product    = 'TaxBot'
  Company    = 'OpenClaw'
  Version    = '1.0.0.0'
  Description = 'TaxBot (智税宝) 安装配置脚本'
}

if (Test-Path $icon) {
  $ps2exeArgs.IconFile = $icon
  Write-Info "使用图标: $icon"
}

Write-Info "正在编译 $outputExe ..."
Invoke-PS2EXE @ps2exeArgs

if (Test-Path $outputExe) {
  Write-OK "编译完成: $outputExe"
  $size = [math]::Round((Get-Item $outputExe).Length / 1KB, 1)
  Write-Info "文件大小: ${size} KB"
} else {
  Write-Err "编译失败，输出文件未生成"
  exit 1
}
