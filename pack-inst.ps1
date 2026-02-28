# pack-inst.ps1
# Create taxbot-inst/ — a clean, distributable installer folder directly from source repo.
# Does NOT depend on taxbot-dist/. Generates taxbot-inst.zip for distribution.
#
# Usage: powershell -ExecutionPolicy Bypass -File pack-inst.ps1

$ErrorActionPreference = 'Stop'

function Write-Info($msg) { Write-Host "[pack-inst] $msg" -ForegroundColor Cyan }
function Write-Warn($msg) { Write-Host "[pack-inst] $msg" -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host "[pack-inst] $msg" -ForegroundColor Red }
function Write-OK($msg)   { Write-Host "[pack-inst] $msg" -ForegroundColor Green }

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoRoot

$outDir = Join-Path $repoRoot 'taxbot-setup'

Write-Info "========================================="
Write-Info "  TaxBot Installer Packager"
Write-Info "========================================="
Write-Info "Source: $repoRoot"
Write-Info "Output: $outDir"
Write-Host ""

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
# Pre-check: dist/ must be built
# ========================================
$distIndex = Join-Path $repoRoot 'dist\index.mjs'
$distEntry = Join-Path $repoRoot 'dist\entry.mjs'
$distTaxchat = Join-Path $repoRoot 'dist\control-ui\taxchat.html'
if (-not (Test-Path $distIndex) -or -not (Test-Path $distEntry) -or -not (Test-Path $distTaxchat)) {
  Write-Err "dist/ incomplete. Run: pnpm build ; pnpm ui:build"
  exit 1
}

# ========================================
# Clean old output
# ========================================
if (Test-Path $outDir) {
  Write-Warn "Removing old taxbot-inst ..."
  Remove-Item $outDir -Recurse -Force
}
New-Item -ItemType Directory -Path $outDir -Force | Out-Null

# ========================================
# 1) Root files
# ========================================
Write-Info "[1/10] Root files ..."
$rootFiles = @(
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'openclaw.mjs',
  'setup-taxbot.ps1',
  'setup-taxbot.cmd',
  'setup-taxbot.exe',
  'uninstall-taxbot.ps1',
  'uninstall-taxbot.cmd'
)
foreach ($f in $rootFiles) {
  Copy-ToOut $f
}
# Patch package.json: replace source build scripts with no-ops
$distPkgJson = Join-Path $outDir 'package.json'
if (Test-Path $distPkgJson) {
  $pkgContent = [System.IO.File]::ReadAllText($distPkgJson, [System.Text.Encoding]::UTF8)
  $pkgContent = $pkgContent -replace '"build"\s*:\s*"(?:[^"\\]|\\.)*"', '"build": "echo dist already built"'
  $pkgContent = $pkgContent -replace '"build:plugin-sdk:dts"\s*:\s*"(?:[^"\\]|\\.)*"', '"build:plugin-sdk:dts": "echo skip"'
  $pkgContent = $pkgContent -replace '"canvas:a2ui:bundle"\s*:\s*"(?:[^"\\]|\\.)*"', '"canvas:a2ui:bundle": "echo skip"'
  $pkgContent = $pkgContent -replace '"ui:build"\s*:\s*"(?:[^"\\]|\\.)*"', '"ui:build": "echo ui already built"'
  $pkgContent = $pkgContent -replace '"check"\s*:\s*"(?:[^"\\]|\\.)*"', '"check": "echo skip"'
  $pkgContent = $pkgContent -replace '"check:docs"\s*:\s*"(?:[^"\\]|\\.)*"', '"check:docs": "echo skip"'
  $pkgContent = $pkgContent -replace '"check:loc"\s*:\s*"(?:[^"\\]|\\.)*"', '"check:loc": "echo skip"'
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($distPkgJson, $pkgContent, $utf8NoBom)
  Write-Info "  Patched package.json build scripts"
}
Write-OK "Root files"

# ========================================
# 2) dist/ - compiled application
# ========================================
Write-Info "[2/10] dist/ ..."
Copy-DirToOut 'dist'
$stampPath = Join-Path $outDir 'dist\.buildstamp'
[System.IO.File]::WriteAllText($stampPath, "$([DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds())`n")
Write-OK "dist/"

# ========================================
# 3) electron/ - Electron shell
# ========================================
Write-Info "[3/10] electron/ ..."
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
Write-Info "[4/10] ui/ ..."
Copy-ToOut 'ui\package.json'
Copy-DirToOut 'ui\assets'
Write-OK "ui/"

# ========================================
# 5) scripts/ - runtime scripts
# ========================================
Write-Info "[5/10] scripts/ ..."
$scriptFiles = @(
  'scripts\run-node.mjs',
  'scripts\postinstall.js',
  'scripts\setup-git-hooks.js',
  'scripts\open-gui.cjs'
)
foreach ($f in $scriptFiles) {
  Copy-ToOut $f
}
Write-OK "scripts/"

# ========================================
# 6) packages/ - workspace sub-packages
# ========================================
Write-Info "[6/10] packages/ ..."
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
# 7) extensions/ - plugin manifests + dist
# ========================================
Write-Info "[7/10] extensions/ ..."
$extRoot = Join-Path $repoRoot 'extensions'
$extCount = 0
if (Test-Path $extRoot) {
  Get-ChildItem $extRoot -Directory | ForEach-Object {
    $extPkgJson = Join-Path $_.FullName 'package.json'
    $pluginManifest = Join-Path $_.FullName 'openclaw.plugin.json'
    if ((Test-Path $extPkgJson) -or (Test-Path $pluginManifest)) {
      $dstDir = Join-Path $outDir "extensions\$($_.Name)"
      New-Item -ItemType Directory -Path $dstDir -Force | Out-Null
      if (Test-Path $extPkgJson) {
        Copy-Item $extPkgJson (Join-Path $dstDir 'package.json') -Force
      }
      if (Test-Path $pluginManifest) {
        Copy-Item $pluginManifest (Join-Path $dstDir 'openclaw.plugin.json') -Force
      }
      $pluginDist = Join-Path $_.FullName 'dist'
      if (Test-Path $pluginDist) {
        Copy-Item $pluginDist (Join-Path $dstDir 'dist') -Recurse -Force
      }
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
Write-Info "[8/10] docs/reference/templates ..."
Copy-DirToOut 'docs\reference\templates'
Write-OK "docs/reference/templates"

# ========================================
# 9) skills/
# ========================================
Write-Info "[9/10] skills/ ..."
Copy-DirToOut 'skills'
Write-OK "skills/"

# -- patches/ placeholder --
New-Item -ItemType Directory -Path (Join-Path $outDir 'patches') -Force | Out-Null

# ========================================
# 10) Electron runtime + Node.js + pnpm
# ========================================
Write-Info "[10/10] Bundling Electron runtime ..."
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

Write-Info "Bundling Node.js + pnpm ..."
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

# Install pnpm into bundled node
Write-Info "  Installing pnpm into bundled node via npm ..."
$bundledNodeExe = Join-Path $nodeDstDir 'node.exe'
$bundledNpmCli = Join-Path $nodeDstDir 'node_modules\npm\bin\npm-cli.js'
if (-not (Test-Path $bundledNpmCli)) {
  Write-Err "Bundled npm not found at $bundledNpmCli"
  exit 1
}
$env:PATH = "$nodeDstDir;$env:PATH"
& $bundledNodeExe $bundledNpmCli install -g pnpm --prefix $nodeDstDir 2>&1 | Out-Null

# Verify pnpm
$pnpmCjsPath = Join-Path $nodeDstDir 'node_modules\pnpm\bin\pnpm.cjs'
if (Test-Path $pnpmCjsPath) {
  $pnpmVer = (& $bundledNodeExe $pnpmCjsPath -v 2>&1) | Out-String
  if ($pnpmVer -match '^\d+\.\d+') {
    Write-OK "Node.js + pnpm $($pnpmVer.Trim()) bundled"
  } else {
    Write-Err "pnpm returned unexpected output: $pnpmVer"
    Write-Warn "Setup script will auto-install pnpm on target machine"
  }
} else {
  Write-Warn "pnpm.cjs not found; setup script will handle installation on target"
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
# Create zip
# ========================================
$zipPath = Join-Path $repoRoot 'taxbot-setup.zip'
if (Test-Path $zipPath) {
  Remove-Item $zipPath -Force
}
Write-Info "Creating taxbot-setup.zip ..."
Compress-Archive -Path "$outDir\*" -DestinationPath $zipPath -CompressionLevel Fastest
$zipSizeMB = [math]::Round((Get-Item $zipPath).Length / 1MB, 1)
Write-OK "taxbot-setup.zip created (${zipSizeMB} MB)"

Write-Host ""
Write-Info "Next steps:"
Write-Info "  1. Copy taxbot-setup.zip to target PC"
Write-Info "  2. Unzip and double-click setup-taxbot.exe (or setup-taxbot.cmd)"
Write-Host ""
