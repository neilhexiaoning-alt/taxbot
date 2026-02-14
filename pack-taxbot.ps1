# pack-taxbot.ps1
# Pack TaxBot runtime files into taxbot-dist folder (no source code).
# Copy that folder to a new PC, then double-click setup-taxbot.exe.
#
# Usage: powershell -ExecutionPolicy Bypass -File pack-taxbot.ps1

$ErrorActionPreference = 'Stop'

function Write-Info($msg) { Write-Host "[pack] $msg" -ForegroundColor Cyan }
function Write-Warn($msg) { Write-Host "[pack] $msg" -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host "[pack] $msg" -ForegroundColor Red }
function Write-OK($msg)   { Write-Host "[pack] $msg" -ForegroundColor Green }

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoRoot

$outDir = Join-Path $repoRoot 'taxbot-dist'

Write-Info "========================================="
Write-Info "  TaxBot Distribution Packager"
Write-Info "========================================="
Write-Info "Source: $repoRoot"
Write-Info "Output: $outDir"
Write-Host ""

# -- Pre-check --
$distIndex = Join-Path $repoRoot 'dist\index.js'
$distTaxchat = Join-Path $repoRoot 'dist\control-ui\taxchat.html'
if (-not (Test-Path $distIndex) -or -not (Test-Path $distTaxchat)) {
  Write-Err "dist/ incomplete. Run: pnpm build ; pnpm ui:build"
  exit 1
}

# -- Clean old output --
if (Test-Path $outDir) {
  Write-Warn "Removing old taxbot-dist ..."
  Remove-Item $outDir -Recurse -Force
}
New-Item -ItemType Directory -Path $outDir -Force | Out-Null

# ========================================
# Helpers
# ========================================
function Copy-ToOut {
  param([string]$RelPath)
  $src = Join-Path $repoRoot $RelPath
  $dst = Join-Path $outDir $RelPath
  if (-not (Test-Path $src)) {
    Write-Warn "  skip (missing): $RelPath"
    return
  }
  $dstDir = Split-Path -Parent $dst
  if (-not (Test-Path $dstDir)) {
    New-Item -ItemType Directory -Path $dstDir -Force | Out-Null
  }
  Copy-Item $src $dst -Force
}

function Copy-DirToOut {
  param([string]$RelPath)
  $src = Join-Path $repoRoot $RelPath
  $dst = Join-Path $outDir $RelPath
  if (-not (Test-Path $src)) {
    Write-Warn "  skip (missing): $RelPath"
    return
  }
  $dstDir = Split-Path -Parent $dst
  if (-not (Test-Path $dstDir)) {
    New-Item -ItemType Directory -Path $dstDir -Force | Out-Null
  }
  Copy-Item $src $dst -Recurse -Force
}

# ========================================
# 1) Root files
# ========================================
Write-Info "[1/9] Root files ..."
$rootFiles = @(
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'openclaw.mjs',
  'setup-taxbot.ps1',
  'setup-taxbot.cmd',
  'setup-taxbot.exe'
)
foreach ($f in $rootFiles) {
  Copy-ToOut $f
}
Write-OK "Root files"

# ========================================
# 2) dist/ - compiled application
# ========================================
Write-Info "[2/9] dist/ ..."
Copy-DirToOut 'dist'
# Write buildstamp so run-node.mjs won't try to rebuild
$stampPath = Join-Path $outDir 'dist\.buildstamp'
[System.IO.File]::WriteAllText($stampPath, "$([DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds())`n")
Write-OK "dist/"

# ========================================
# 3) electron/ - Electron shell
# ========================================
Write-Info "[3/9] electron/ ..."
$electronFiles = @(
  'electron\main.cjs',
  'electron\preload.cjs',
  'electron\launch.cjs',
  'electron\start.vbs',
  'electron\start.cmd',
  'electron\package.json'
)
foreach ($f in $electronFiles) {
  Copy-ToOut $f
}
if (Test-Path (Join-Path $repoRoot 'electron\TaxBot.exe')) {
  Copy-ToOut 'electron\TaxBot.exe'
}
Write-OK "electron/"

# ========================================
# 4) ui/ - package.json + assets
# ========================================
Write-Info "[4/9] ui/ ..."
Copy-ToOut 'ui\package.json'
Copy-DirToOut 'ui\assets'
Write-OK "ui/"

# ========================================
# 5) scripts/ - runtime scripts
# ========================================
Write-Info "[5/9] scripts/ ..."
$scriptFiles = @(
  'scripts\run-node.mjs',
  'scripts\postinstall.js',
  'scripts\setup-git-hooks.js'
)
foreach ($f in $scriptFiles) {
  Copy-ToOut $f
}
Write-OK "scripts/"

# ========================================
# 6) packages/ - workspace sub-packages
# ========================================
Write-Info "[6/9] packages/ ..."
$workspacePackages = @('clawdbot', 'moltbot')
foreach ($pkg in $workspacePackages) {
  $pkgSrc = Join-Path $repoRoot "packages\$pkg"
  if (-not (Test-Path $pkgSrc)) { continue }
  $pkgDst = Join-Path $outDir "packages\$pkg"
  New-Item -ItemType Directory -Path $pkgDst -Force | Out-Null
  $pkgJson = Join-Path $pkgSrc 'package.json'
  if (Test-Path $pkgJson) {
    Copy-Item $pkgJson (Join-Path $pkgDst 'package.json') -Force
  }
  $distSrc = Join-Path $pkgSrc 'dist'
  if (Test-Path $distSrc) {
    Copy-Item $distSrc (Join-Path $pkgDst 'dist') -Recurse -Force
  }
  $scriptsSrc = Join-Path $pkgSrc 'scripts'
  if (Test-Path $scriptsSrc) {
    Copy-Item $scriptsSrc (Join-Path $pkgDst 'scripts') -Recurse -Force
  }
  $binSrc = Join-Path $pkgSrc 'bin'
  if (Test-Path $binSrc) {
    Copy-Item $binSrc (Join-Path $pkgDst 'bin') -Recurse -Force
  }
}
Write-OK "packages/"

# ========================================
# 7) extensions/ - package.json + manifest + dist/index
# ========================================
Write-Info "[7/9] extensions/ ..."
$extRoot = Join-Path $repoRoot 'extensions'
$extCount = 0
if (Test-Path $extRoot) {
  Get-ChildItem $extRoot -Directory | ForEach-Object {
    $extPkgJson = Join-Path $_.FullName 'package.json'
    $pluginManifest = Join-Path $_.FullName 'openclaw.plugin.json'
    # Include extension if it has package.json OR openclaw.plugin.json
    if ((Test-Path $extPkgJson) -or (Test-Path $pluginManifest)) {
      $dstDir = Join-Path $outDir "extensions\$($_.Name)"
      New-Item -ItemType Directory -Path $dstDir -Force | Out-Null
      if (Test-Path $extPkgJson) {
        Copy-Item $extPkgJson (Join-Path $dstDir 'package.json') -Force
      }
      if (Test-Path $pluginManifest) {
        Copy-Item $pluginManifest (Join-Path $dstDir 'openclaw.plugin.json') -Force
      }
      # Copy dist/ if present (compiled plugin code)
      $pluginDist = Join-Path $_.FullName 'dist'
      if (Test-Path $pluginDist) {
        Copy-Item $pluginDist (Join-Path $dstDir 'dist') -Recurse -Force
      }
      # Copy all .js / .ts source files (excluding tests)
      Get-ChildItem -Path $_.FullName -File | Where-Object { ($_.Extension -eq '.js' -or $_.Extension -eq '.ts') -and $_.Name -notmatch '\.test\.' } | ForEach-Object {
        Copy-Item $_.FullName (Join-Path $dstDir $_.Name) -Force
      }
      $extCount++
    }
  }
}
Write-OK "extensions/ ($extCount plugins)"

# ========================================
# 8) docs/reference/templates
# ========================================
Write-Info "[8/9] docs/reference/templates ..."
Copy-DirToOut 'docs\reference\templates'
Write-OK "docs/reference/templates"

# ========================================
# 9) skills/
# ========================================
Write-Info "[9/9] skills/ ..."
Copy-DirToOut 'skills'
Write-OK "skills/"

# -- patches/ placeholder --
New-Item -ItemType Directory -Path (Join-Path $outDir 'patches') -Force | Out-Null

# ========================================
# 10) Electron runtime binary
# ========================================
Write-Info "[10] Bundling Electron runtime ..."
$electronDistSrc = $null
$electronCandidates = @(
  (Join-Path $repoRoot 'node_modules\.pnpm\electron@*\node_modules\electron\dist'),
  (Join-Path $repoRoot 'node_modules\electron\dist')
)
foreach ($pattern in $electronCandidates) {
  $found = Get-Item $pattern -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($found -and (Test-Path (Join-Path $found.FullName 'electron.exe'))) {
    $electronDistSrc = $found.FullName
    break
  }
}
if ($electronDistSrc) {
  $electronDstDir = Join-Path $outDir 'electron-dist'
  Copy-Item $electronDistSrc $electronDstDir -Recurse -Force
  $edSize = [math]::Round((Get-ChildItem $electronDstDir -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB, 1)
  Write-OK "Electron runtime ($edSize MB)"
} else {
  Write-Warn "Electron dist not found locally, will be downloaded on target"
}

# ========================================
# 11) Node.js + pnpm runtime
# ========================================
Write-Info "[10] Bundling Node.js + pnpm ..."
$nodeExe = (Get-Command node).Source
$nodeSrcDir = Split-Path $nodeExe
$nodeDstDir = Join-Path $outDir 'node'
New-Item -ItemType Directory -Path $nodeDstDir -Force | Out-Null

# Copy node.exe
Copy-Item (Join-Path $nodeSrcDir 'node.exe') (Join-Path $nodeDstDir 'node.exe') -Force

# Copy npm/npx scripts and node_modules (npm package)
foreach ($f in @('npm', 'npm.cmd', 'npm.ps1', 'npx', 'npx.cmd', 'npx.ps1')) {
  $src = Join-Path $nodeSrcDir $f
  if (Test-Path $src) { Copy-Item $src (Join-Path $nodeDstDir $f) -Force }
}
$npmModSrc = Join-Path $nodeSrcDir 'node_modules'
if (Test-Path $npmModSrc) {
  Copy-Item $npmModSrc (Join-Path $nodeDstDir 'node_modules') -Recurse -Force
}

# Install a clean pnpm into the bundled node directory via npm
Write-Info "  Installing pnpm into bundled node via npm ..."
$bundledNodeExe = Join-Path $nodeDstDir 'node.exe'
$bundledNpmCli = Join-Path $nodeDstDir 'node_modules\npm\bin\npm-cli.js'
if (-not (Test-Path $bundledNpmCli)) {
  Write-Err "Bundled npm not found at $bundledNpmCli"
  exit 1
}
$env:PATH = "$nodeDstDir;$env:PATH"
& $bundledNodeExe $bundledNpmCli install -g pnpm --prefix $nodeDstDir 2>&1 | Out-Null

# Verify pnpm works
$pnpmCjsPath = Join-Path $nodeDstDir 'node_modules\pnpm\bin\pnpm.cjs'
if (Test-Path $pnpmCjsPath) {
  $pnpmVer = (& $bundledNodeExe $pnpmCjsPath -v 2>&1) | Out-String
  if ($pnpmVer -match '^\d+\.\d+') {
    Write-OK "Node.js + pnpm $($pnpmVer.Trim()) bundled"
  } else {
    Write-Err "pnpm installed but returned unexpected output: $pnpmVer"
    Write-Warn "Setup script will auto-install pnpm on target machine"
  }
} else {
  Write-Warn "pnpm.cjs not found after install; setup script will handle installation on target"
}

# ========================================
# Summary
# ========================================
Write-Host ""
$fileCount = (Get-ChildItem $outDir -Recurse -File).Count
$sizeMB = [math]::Round((Get-ChildItem $outDir -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB, 1)

Write-Info "========================================="
Write-OK  "  Done!"
Write-Info "========================================="
Write-Host ""
Write-Info "Output:  $outDir"
Write-Info "Files:   $fileCount"
Write-Info "Size:    ${sizeMB} MB"

# ========================================
# Create zip for distribution
# ========================================
$zipPath = Join-Path $repoRoot 'taxbot-dist.zip'
if (Test-Path $zipPath) {
  Remove-Item $zipPath -Force
}
Write-Info "Creating taxbot-dist.zip ..."
Compress-Archive -Path $outDir -DestinationPath $zipPath -CompressionLevel Optimal
$zipSizeMB = [math]::Round((Get-Item $zipPath).Length / 1MB, 1)
Write-OK "taxbot-dist.zip created (${zipSizeMB} MB)"

Write-Host ""
Write-Info "Next steps:"
Write-Info "  1. Copy taxbot-dist.zip to target PC"
Write-Info "  2. Unzip and double-click setup-taxbot.exe"
Write-Host ""
