# build-taxbot-sfx.ps1
# Build a single-file 7z SFX installer that extracts to a chosen folder
# and launches the app automatically.

$ErrorActionPreference = 'Stop'

function Write-Info($msg) { Write-Host "[taxbot] $msg" -ForegroundColor Cyan }
function Write-Warn($msg) { Write-Host "[taxbot] $msg" -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host "[taxbot] $msg" -ForegroundColor Red }

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoRoot

Write-Info "Repo: $repoRoot"

function Find-7zSfx {
  $candidates = @(
    "C:\Program Files\7-Zip\7z.sfx",
    "C:\Program Files (x86)\7-Zip\7z.sfx"
  )
  foreach ($path in $candidates) {
    if (Test-Path $path) { return $path }
  }
  return $null
}

$sevenZip = Get-Command 7z -ErrorAction SilentlyContinue
if (-not $sevenZip) {
  Write-Err "7-Zip CLI not found (7z). Install 7-Zip first, then re-run."
  exit 1
}

$sfxModule = Find-7zSfx
if (-not $sfxModule) {
  Write-Err "7z.sfx not found. Ensure 7-Zip is installed (default path)."
  exit 1
}

$distDir = Join-Path $repoRoot "dist-electron"
$unpackedDir = Join-Path $distDir "win-unpacked"
$stagingDir = Join-Path $distDir "taxbot-sfx-stage"

if (-not (Test-Path $unpackedDir)) {
  Write-Warn "win-unpacked not found. Running electron pack..."
  pnpm electron:pack
}

if (-not (Test-Path $unpackedDir)) {
  Write-Err "win-unpacked still missing. Build failed?"
  exit 1
}

# Find the main exe inside win-unpacked
$appExe = Get-ChildItem -Path $unpackedDir -Filter *.exe | Select-Object -First 1
if (-not $appExe) {
  Write-Err "No .exe found in win-unpacked."
  exit 1
}

if (Test-Path $stagingDir) {
  Remove-Item $stagingDir -Recurse -Force
}
New-Item -ItemType Directory -Path $stagingDir | Out-Null

Write-Info "Staging files..."
$robocopyLog = Join-Path $distDir "taxbot-robocopy.log"
if (Test-Path $robocopyLog) { Remove-Item $robocopyLog -Force }
# Use robocopy to handle long paths and preserve junctions/symlinks.
$rc = Start-Process -FilePath "robocopy" -ArgumentList @(
  "`"$unpackedDir`"",
  "`"$stagingDir`"",
  "/E",
  "/COPY:DAT",
  "/SL",
  "/R:2",
  "/W:1",
  "/NFL",
  "/NDL",
  "/NJH",
  "/NJS",
  "/NP",
  "/LOG:`"$robocopyLog`""
) -NoNewWindow -Wait -PassThru

if ($rc.ExitCode -ge 8) {
  Write-Err "Robocopy failed (exit code $($rc.ExitCode)). See $robocopyLog"
  exit 1
}

$taxbotExeName = "taxbot.exe"
$taxbotExePath = Join-Path $stagingDir $taxbotExeName
Copy-Item $appExe.FullName $taxbotExePath -Force

$vbsPath = Join-Path $stagingDir "create-shortcut.vbs"
$vbs = @'
Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")
scriptPath = WScript.ScriptFullName
installDir = fso.GetParentFolderName(scriptPath)
exePath = installDir & "\taxbot.exe"
desktop = shell.SpecialFolders("Desktop")
shortcutPath = desktop & "\TaxBot.lnk"

Set shortcut = shell.CreateShortcut(shortcutPath)
shortcut.TargetPath = exePath
shortcut.WorkingDirectory = installDir
shortcut.IconLocation = exePath
shortcut.Save

shell.Run Chr(34) & exePath & Chr(34), 1, False
'@
$vbs | Set-Content -Path $vbsPath -NoNewline

$archivePath = Join-Path $distDir "taxbot.7z"
$sfxConfigPath = Join-Path $distDir "taxbot-sfx.txt"
$outputExe = Join-Path $distDir "taxbot-installer.exe"

Write-Info "Creating 7z archive..."
if (Test-Path $archivePath) { Remove-Item $archivePath -Force }
& $sevenZip.Source a -t7z $archivePath "$stagingDir\*" | Out-Null

$defaultInstallDir = Join-Path $env:LOCALAPPDATA "TaxBot"
$config = @"
;!@Install@!UTF-8!
Title="TaxBot Installer"
InstallPath="$defaultInstallDir"
GUIMode="1"
RunProgram="wscript.exe create-shortcut.vbs"
;!@InstallEnd@!
"@

$config | Set-Content -Path $sfxConfigPath -NoNewline

Write-Info "Building SFX installer..."
if (Test-Path $outputExe) { Remove-Item $outputExe -Force }
cmd /c copy /b "`"$sfxModule`"+`"$sfxConfigPath`"+`"$archivePath`" `"$outputExe`"" | Out-Null

Write-Info "Done. Output: $outputExe"
