# setup-taxbot.ps1
# TaxBot GUI installer. Run directly or via setup-taxbot.exe (ps2exe compiled).

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[System.Windows.Forms.Application]::EnableVisualStyles()

# ============ Resolve repo root ============
$script:repoRoot = $null
try { $script:repoRoot = Split-Path -Parent ([System.Diagnostics.Process]::GetCurrentProcess().MainModule.FileName) } catch {}
if (-not $script:repoRoot) { try { $script:repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path } catch {} }
if (-not $script:repoRoot) { try { $script:repoRoot = $PSScriptRoot } catch {} }
if (-not $script:repoRoot) { $script:repoRoot = (Get-Location).Path }
Set-Location $script:repoRoot

# ============ Color palette ============
$clrBg      = [System.Drawing.Color]::FromArgb(245, 248, 255)
$clrPanel   = [System.Drawing.Color]::White
$clrPrimary = [System.Drawing.Color]::FromArgb(30, 136, 229)
$clrText    = [System.Drawing.Color]::FromArgb(55, 65, 81)
$clrMuted   = [System.Drawing.Color]::FromArgb(140, 150, 165)
$clrGreen   = [System.Drawing.Color]::FromArgb(34, 139, 34)
$clrRed     = [System.Drawing.Color]::FromArgb(220, 38, 38)

# ============ Step definitions ============
$script:stepNames = @(
  "Checking environment",
  "Installing dependencies",
  "Configuring Electron",
  "Generating config files",
  "Creating desktop shortcut"
)
$script:stepLabels = @()
$script:installState = "ready"  # ready | running | done | error

# ============ Build main form ============
$form = New-Object System.Windows.Forms.Form
$form.Text = "TaxBot Setup"
$form.Size = New-Object System.Drawing.Size(580, 520)
$form.StartPosition = "CenterScreen"
$form.FormBorderStyle = "FixedDialog"
$form.MaximizeBox = $false
$form.BackColor = $clrBg
$form.Font = New-Object System.Drawing.Font("Microsoft YaHei UI", 9)

# Window icon
$iconPath = Join-Path $script:repoRoot 'ui\assets\icon.ico'
if (Test-Path $iconPath) {
  $form.Icon = New-Object System.Drawing.Icon($iconPath)
}

# ---- Title area ----
$titleLabel = New-Object System.Windows.Forms.Label
$titleLabel.Text = "TaxBot Setup"
$titleLabel.Font = New-Object System.Drawing.Font("Microsoft YaHei UI", 18, [System.Drawing.FontStyle]::Bold)
$titleLabel.ForeColor = $clrPrimary
$titleLabel.Location = New-Object System.Drawing.Point(30, 18)
$titleLabel.AutoSize = $true
$form.Controls.Add($titleLabel)

$subtitleLabel = New-Object System.Windows.Forms.Label
$subtitleLabel.Text = "AI Tax Assistant Installer"
$subtitleLabel.Font = New-Object System.Drawing.Font("Microsoft YaHei UI", 9)
$subtitleLabel.ForeColor = $clrMuted
$subtitleLabel.Location = New-Object System.Drawing.Point(32, 52)
$subtitleLabel.AutoSize = $true
$form.Controls.Add($subtitleLabel)

# ---- Separator ----
$sep1 = New-Object System.Windows.Forms.Label
$sep1.BorderStyle = "Fixed3D"
$sep1.Location = New-Object System.Drawing.Point(20, 76)
$sep1.Size = New-Object System.Drawing.Size(525, 2)
$form.Controls.Add($sep1)

# ---- Step list (left column) ----
$stepY = 90
for ($i = 0; $i -lt $script:stepNames.Count; $i++) {
  $lbl = New-Object System.Windows.Forms.Label
  $lbl.Text = [char]0x25CB + "  " + $script:stepNames[$i]   # ○
  $lbl.Font = New-Object System.Drawing.Font("Microsoft YaHei UI", 10)
  $lbl.ForeColor = $clrMuted
  $lbl.Location = New-Object System.Drawing.Point(35, $stepY)
  $lbl.Size = New-Object System.Drawing.Size(300, 24)
  $form.Controls.Add($lbl)
  $script:stepLabels += $lbl
  $stepY += 26
}

# ---- API Keys (hardcoded, hidden from user) ----
$script:minimaxApiKey = "sk-cp-n3XEMT92KQwkIndjyL2WjZtLCXvFAC4BFw8mQLJzRdeepNJoeMlAiAu_Yw5HdRbcSLyE1Y_znPWpjwsqMrq3W-XxrkpXhKnO9DbMHOWpeuB2AAAbrqJ_BgM"
$script:qwenApiKey = "sk-5786fd93bef34d75b214d50159550325"

# ---- Log area ----
$logBox = New-Object System.Windows.Forms.TextBox
$logBox.Multiline = $true
$logBox.ReadOnly = $true
$logBox.ScrollBars = "Vertical"
$logBox.Location = New-Object System.Drawing.Point(30, 228)
$logBox.Size = New-Object System.Drawing.Size(505, 158)
$logBox.Font = New-Object System.Drawing.Font("Consolas", 8.5)
$logBox.BackColor = [System.Drawing.Color]::FromArgb(250, 250, 252)
$logBox.ForeColor = $clrText
$form.Controls.Add($logBox)

# ---- Progress bar ----
$progressBar = New-Object System.Windows.Forms.ProgressBar
$progressBar.Location = New-Object System.Drawing.Point(30, 396)
$progressBar.Size = New-Object System.Drawing.Size(505, 20)
$progressBar.Style = "Continuous"
$progressBar.Value = 0
$form.Controls.Add($progressBar)

# ---- Action button ----
$actionBtn = New-Object System.Windows.Forms.Button
$actionBtn.Text = "Start Install"
$actionBtn.Font = New-Object System.Drawing.Font("Microsoft YaHei UI", 11, [System.Drawing.FontStyle]::Bold)
$actionBtn.Size = New-Object System.Drawing.Size(200, 40)
$actionBtn.Location = New-Object System.Drawing.Point(190, 426)
$actionBtn.BackColor = $clrPrimary
$actionBtn.ForeColor = [System.Drawing.Color]::White
$actionBtn.FlatStyle = "Flat"
$actionBtn.FlatAppearance.BorderSize = 0
$actionBtn.Cursor = [System.Windows.Forms.Cursors]::Hand
$form.Controls.Add($actionBtn)

# ---- Footer ----
$footerLabel = New-Object System.Windows.Forms.Label
$footerLabel.Text = "Install path: $script:repoRoot"
$footerLabel.Font = New-Object System.Drawing.Font("Microsoft YaHei UI", 8)
$footerLabel.ForeColor = $clrMuted
$footerLabel.Location = New-Object System.Drawing.Point(30, 475)
$footerLabel.Size = New-Object System.Drawing.Size(510, 18)
$form.Controls.Add($footerLabel)

# ============ Helper functions ============
function Write-Log($msg) {
  $logBox.AppendText("$msg`r`n")
  $logBox.ScrollToCaret()
  [System.Windows.Forms.Application]::DoEvents()
}

function Update-Step($index, $status) {
  $icons = @{ pending = [string][char]0x25CB; running = [string][char]0x25CF; done = [string][char]0x2713; error = [string][char]0x2717 }
  $colors = @{ pending = $clrMuted; running = $clrPrimary; done = $clrGreen; error = $clrRed }
  $script:stepLabels[$index].Text = "$($icons[$status])  $($script:stepNames[$index])"
  $script:stepLabels[$index].ForeColor = $colors[$status]
  if ($status -eq "running") {
    $script:stepLabels[$index].Font = New-Object System.Drawing.Font("Microsoft YaHei UI", 10, [System.Drawing.FontStyle]::Bold)
  } else {
    $script:stepLabels[$index].Font = New-Object System.Drawing.Font("Microsoft YaHei UI", 10)
  }
  $progressBar.Value = [math]::Min(100, [math]::Floor(($index + $(if ($status -eq "done") { 1 } else { 0.5 })) * 20))
  [System.Windows.Forms.Application]::DoEvents()
}

function Run-Process($exe, $arguments, $workDir) {
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = $exe
  $psi.Arguments = $arguments
  $psi.WorkingDirectory = if ($workDir) { $workDir } else { $script:repoRoot }
  $psi.UseShellExecute = $false
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true
  $psi.CreateNoWindow = $true
  $psi.WindowStyle = "Hidden"
  $psi.StandardOutputEncoding = [System.Text.Encoding]::UTF8
  $psi.StandardErrorEncoding = [System.Text.Encoding]::UTF8

  $proc = [System.Diagnostics.Process]::Start($psi)

  # Read output in chunks while process runs
  while (-not $proc.HasExited) {
    $line = $proc.StandardOutput.ReadLine()
    if ($line) { Write-Log $line }
    [System.Windows.Forms.Application]::DoEvents()
  }
  # Drain remaining output
  $remaining = $proc.StandardOutput.ReadToEnd()
  if ($remaining) {
    foreach ($l in ($remaining -split "`n")) {
      $lt = $l.Trim()
      if ($lt) { Write-Log $lt }
    }
  }
  $errOut = $proc.StandardError.ReadToEnd()
  if ($errOut) {
    foreach ($l in ($errOut -split "`n")) {
      $lt = $l.Trim()
      if ($lt) { Write-Log $lt }
    }
  }
  $proc.WaitForExit()
  return $proc.ExitCode
}

# ============ Installation logic ============
function Do-Install {
  $script:installState = "running"
  $actionBtn.Enabled = $false
  $actionBtn.Text = "Installing..."
  $actionBtn.BackColor = $clrMuted
  [System.Windows.Forms.Application]::DoEvents()

  try {
    # SSL workaround for machines with expired certs
    $env:NODE_TLS_REJECT_UNAUTHORIZED = '0'

    # ===== Step 1: Check environment =====
    Update-Step 0 "running"
    Write-Log "Checking bundled Node.js + pnpm..."

    $bundledNode = Join-Path $script:repoRoot 'node'
    $nodeCmd = Join-Path $bundledNode 'node.exe'
    $npmCli = Join-Path $bundledNode 'node_modules\npm\bin\npm-cli.js'
    $pnpmCjs = Join-Path $bundledNode 'node_modules\pnpm\bin\pnpm.cjs'

    if (-not (Test-Path $nodeCmd)) {
      throw "Bundled Node.js not found at: $nodeCmd"
    }

    $env:Path = "$bundledNode;$env:Path"
    $nodeVer = (& $nodeCmd -v 2>$null)
    Write-Log "Node.js $nodeVer"

    # Check if bundled pnpm works
    $pnpmOk = $false
    if (Test-Path $pnpmCjs) {
      try {
        $pnpmTestOut = (& $nodeCmd $pnpmCjs -v 2>$null) | Out-String
        if ($pnpmTestOut -match '^\d+\.\d+') {
          $pnpmOk = $true
          Write-Log "pnpm $($pnpmTestOut.Trim())"
        } else {
          Write-Log "Bundled pnpm returned unexpected output, will reinstall."
        }
      } catch {
        Write-Log "Bundled pnpm failed: $_"
      }
    } else {
      Write-Log "Bundled pnpm.cjs not found."
    }

    # If bundled pnpm doesn't work, install via bundled npm
    if (-not $pnpmOk) {
      Write-Log "Installing pnpm via bundled npm..."
      if (-not (Test-Path $npmCli)) {
        throw "Bundled npm not found at: $npmCli"
      }
      $exitCode = Run-Process $nodeCmd "`"$npmCli`" install -g pnpm --prefix `"$bundledNode`"" $bundledNode
      if ($exitCode -ne 0) {
        Write-Log "Retrying with npmmirror registry..."
        $exitCode = Run-Process $nodeCmd "`"$npmCli`" install -g pnpm --prefix `"$bundledNode`" --registry https://registry.npmmirror.com" $bundledNode
        if ($exitCode -ne 0) {
          throw "Failed to install pnpm (exit code $exitCode)"
        }
      }
      # Re-locate pnpm.cjs after npm install
      $pnpmCjs = Join-Path $bundledNode 'node_modules\pnpm\bin\pnpm.cjs'
      if (-not (Test-Path $pnpmCjs)) {
        throw "pnpm install succeeded but pnpm.cjs not found at: $pnpmCjs"
      }
      $pnpmVer = (& $nodeCmd $pnpmCjs -v 2>$null) | Out-String
      Write-Log "pnpm $($pnpmVer.Trim()) installed successfully"
    }
    Update-Step 0 "done"

    # ===== Step 2: Install dependencies =====
    Update-Step 1 "running"
    Write-Log "Running pnpm install (this may take a few minutes)..."

    $env:CI = 'true'
    $env:OPENCLAW_SKIP_POSTINSTALL = '1'

    $exitCode = Run-Process $nodeCmd "`"$pnpmCjs`" install --no-frozen-lockfile"
    if ($exitCode -ne 0) {
      Write-Log "Retrying with mirror registry..."
      $exitCode = Run-Process $nodeCmd "`"$pnpmCjs`" install --no-frozen-lockfile --registry https://registry.npmmirror.com"
      if ($exitCode -ne 0) {
        throw "Dependency install failed (exit code $exitCode)"
      }
    }
    Write-Log "Dependencies installed."
    Update-Step 1 "done"

    # ===== Step 3: Electron runtime + build check =====
    Update-Step 2 "running"
    Write-Log "Setting up Electron runtime..."

    $electronInstallJs = $null
    $candidates = @(
      (Join-Path $script:repoRoot 'node_modules\.pnpm\electron@*\node_modules\electron\install.js'),
      (Join-Path $script:repoRoot 'node_modules\electron\install.js')
    )
    foreach ($pattern in $candidates) {
      $found = Get-Item $pattern -ErrorAction SilentlyContinue | Select-Object -First 1
      if ($found) { $electronInstallJs = $found.FullName; break }
    }
    if (-not $electronInstallJs) {
      throw "Could not find electron install.js"
    }

    $electronDir = Split-Path -Parent $electronInstallJs
    $electronExe = Join-Path (Join-Path $electronDir 'dist') 'electron.exe'

    if (Test-Path $electronExe) {
      Write-Log "Electron already installed."
    } else {
      $bundledElectronDist = Join-Path $script:repoRoot 'electron-dist'
      if (Test-Path (Join-Path $bundledElectronDist 'electron.exe')) {
        Write-Log "Copying bundled Electron runtime..."
        $electronDistDir = Join-Path $electronDir 'dist'
        Copy-Item $bundledElectronDist $electronDistDir -Recurse -Force
        Write-Log "Electron installed (from bundle)."
      } else {
        Write-Log "Downloading Electron runtime..."
        Push-Location $electronDir
        $exitCode = Run-Process $nodeCmd "install.js" $electronDir
        Pop-Location
      }
      if (-not (Test-Path $electronExe)) {
        throw "Electron install failed"
      }
    }

    # Build check
    $distIndex = Join-Path $script:repoRoot 'dist\index.js'
    $distTaxchat = Join-Path $script:repoRoot 'dist\control-ui\taxchat.html'
    if ((Test-Path $distIndex) -and (Test-Path $distTaxchat)) {
      Write-Log "Build output present."
    } else {
      Write-Log "Building project (pnpm build)..."
      $exitCode = Run-Process $nodeCmd "`"$pnpmCjs`" build"
      if ($exitCode -ne 0) { throw "pnpm build failed (exit code $exitCode)" }
      Write-Log "Building UI (pnpm ui:build)..."
      $exitCode = Run-Process $nodeCmd "`"$pnpmCjs`" ui:build"
      if ($exitCode -ne 0) { throw "pnpm ui:build failed (exit code $exitCode)" }
      Write-Log "Build complete."
    }
    Update-Step 2 "done"

    # ===== Step 4: Config files =====
    Update-Step 3 "running"
    Write-Log "Generating configuration..."

    $openclawDir = Join-Path $env:USERPROFILE '.openclaw'
    if (-not (Test-Path $openclawDir)) {
      New-Item -ItemType Directory -Path $openclawDir -Force | Out-Null
    }

    $configFile = Join-Path $openclawDir 'openclaw.json'
    $mmKey = $script:minimaxApiKey
    $qwKey = $script:qwenApiKey

    $tokenBytes = New-Object byte[] 24
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($tokenBytes)
    $gatewayToken = [BitConverter]::ToString($tokenBytes) -replace '-', '' | ForEach-Object { $_.ToLower() }

    $configJson = @"
{
  "gateway": {
    "mode": "local",
    "port": 18789,
    "bind": "loopback",
    "controlUi": {
      "allowInsecureAuth": true
    },
    "auth": {
      "mode": "token",
      "token": "$gatewayToken"
    }
  },
  "agents": {
    "defaults": {
      "workspace": "~/.openclaw/workspace",
      "model": {
        "primary": "minimax/MiniMax-M2.5"
      },
      "imageModel": {
        "primary": "dashscope/qwen-vl-max"
      },
      "compaction": {
        "mode": "safeguard",
        "reserveTokensFloor": 4000
      },
      "maxConcurrent": 4,
      "verboseDefault": "on"
    }
  },
  "models": {
    "mode": "merge",
    "providers": {
      "minimax": {
        "baseUrl": "https://api.minimax.io/v1",
        "apiKey": "$mmKey",
        "api": "openai-completions",
        "models": [
          {
            "id": "MiniMax-M2.5",
            "name": "MiniMax M2.5 (Tool-Calling)",
            "reasoning": false,
            "input": ["text"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 204800,
            "maxTokens": 8192
          }
        ]
      },
      "dashscope": {
        "baseUrl": "https://dashscope.aliyuncs.com/compatible-mode/v1",
        "apiKey": "$qwKey",
        "api": "openai-completions",
        "models": [
          {
            "id": "qwen-vl-max",
            "name": "Qwen VL Max (Vision)",
            "reasoning": false,
            "input": ["image"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 32000,
            "maxTokens": 8192
          }
        ]
      }
    }
  },
  "hooks": {
    "internal": {
      "enabled": true,
      "entries": {
        "boot-md": { "enabled": true },
        "command-logger": { "enabled": true },
        "session-memory": { "enabled": true }
      }
    }
  },
  "tools": {
    "allow": ["read", "write", "edit", "exec", "web_search", "web_fetch", "image", "memory_search", "memory_get", "session_status", "gateway"]
  },
  "skills": {
    "allowBundled": ["contract-tax", "tax-review", "tax-risk"]
  },
  "commands": {
    "native": "auto",
    "nativeSkills": "auto"
  }
}
"@
    if (Test-Path $configFile) {
      Write-Log "Replacing existing config."
      Remove-Item $configFile -Force
    }
    [System.IO.File]::WriteAllText($configFile, $configJson, [System.Text.Encoding]::UTF8)
    Write-Log "Config created: $configFile"

    # Uninstall script
    $uninstallPs1 = Join-Path $script:repoRoot 'uninstall-taxbot.ps1'
    $uninstallCmd = Join-Path $script:repoRoot 'uninstall-taxbot.cmd'
    $uninstallContent = @'
$ErrorActionPreference = 'Stop'
function Write-Info($msg) { Write-Host "[taxbot] $msg" -ForegroundColor Cyan }
function Write-OK($msg)   { Write-Host "[taxbot] $msg" -ForegroundColor Green }
$openclawDir = Join-Path $env:USERPROFILE '.openclaw'
if (Test-Path $openclawDir) { Remove-Item $openclawDir -Recurse -Force; Write-OK "Removed $openclawDir" }
$desktop = [Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktop 'TaxBot.lnk'
if (Test-Path $shortcutPath) { Remove-Item $shortcutPath -Force; Write-OK "Removed shortcut" }
Write-OK "Done."
Read-Host "Press Enter to close"
'@
    [System.IO.File]::WriteAllText($uninstallPs1, $uninstallContent, [System.Text.Encoding]::UTF8)
    $uninstallCmdContent = "@echo off`r`nsetlocal`r`nset DIR=%~dp0`r`npowershell -ExecutionPolicy Bypass -File `"%DIR%uninstall-taxbot.ps1`"`r`nendlocal`r`n"
    [System.IO.File]::WriteAllText($uninstallCmd, $uninstallCmdContent, [System.Text.Encoding]::ASCII)
    Write-Log "Uninstall script created."
    Update-Step 3 "done"

    # ===== Step 5: Desktop shortcut =====
    Update-Step 4 "running"
    Write-Log "Creating desktop shortcut..."

    $desktop = [Environment]::GetFolderPath('Desktop')
    $shortcutPath = Join-Path $desktop 'TaxBot.lnk'
    $taxbotExe = Join-Path $script:repoRoot 'electron\TaxBot.exe'
    $scIconPath = Join-Path (Join-Path (Join-Path $script:repoRoot 'ui') 'assets') 'icon.ico'

    $wsh = New-Object -ComObject WScript.Shell
    $shortcut = $wsh.CreateShortcut($shortcutPath)
    if (Test-Path $taxbotExe) {
      $shortcut.TargetPath = $taxbotExe
    } else {
      $electronDistExe = Join-Path $script:repoRoot 'electron-dist\electron.exe'
      $appPath = Join-Path $script:repoRoot 'electron'
      if (Test-Path $electronDistExe) {
        $shortcut.TargetPath = $electronDistExe
        $shortcut.Arguments = "`"$appPath`""
      } else {
        $vbsPath = Join-Path $appPath 'start.vbs'
        $shortcut.TargetPath = "wscript.exe"
        $shortcut.Arguments = "`"$vbsPath`""
      }
    }
    $shortcut.WorkingDirectory = $script:repoRoot
    if (Test-Path $scIconPath) { $shortcut.IconLocation = $scIconPath }
    $shortcut.Description = "TaxBot - AI Tax Assistant"
    $shortcut.Save()
    Write-Log "Desktop shortcut created."
    Update-Step 4 "done"

    # ===== All done =====
    $progressBar.Value = 100
    $script:installState = "done"
    Write-Log ""
    Write-Log "Setup complete! Click the button below to launch TaxBot."
    $actionBtn.Enabled = $true
    $actionBtn.Text = "Launch TaxBot"
    $actionBtn.BackColor = $clrGreen
    [System.Windows.Forms.Application]::DoEvents()

  } catch {
    $script:installState = "error"
    # Mark current step as error
    for ($i = 0; $i -lt $script:stepNames.Count; $i++) {
      if ($script:stepLabels[$i].ForeColor -eq $clrPrimary) {
        Update-Step $i "error"
        break
      }
    }
    Write-Log ""
    Write-Log "ERROR: $_"
    Write-Log "$($_.ScriptStackTrace)"
    $actionBtn.Enabled = $true
    $actionBtn.Text = "Retry"
    $actionBtn.BackColor = $clrRed
    [System.Windows.Forms.Application]::DoEvents()
  }
}

# ============ Button click handler ============
$actionBtn.Add_Click({
  if ($script:installState -eq "done") {
    # Launch TaxBot
    $taxbotExe = Join-Path $script:repoRoot 'electron\TaxBot.exe'
    $vbsPath = Join-Path (Join-Path $script:repoRoot 'electron') 'start.vbs'
    if (Test-Path $taxbotExe) {
      Start-Process $taxbotExe -WorkingDirectory $script:repoRoot
    } elseif (Test-Path $vbsPath) {
      Start-Process "wscript.exe" -ArgumentList "`"$vbsPath`"" -WorkingDirectory $script:repoRoot
    }
    $form.Close()
  } else {
    # Start or retry install
    # Reset steps on retry
    if ($script:installState -eq "error") {
      for ($i = 0; $i -lt $script:stepNames.Count; $i++) {
        $script:stepLabels[$i].Text = [string][char]0x25CB + "  " + $script:stepNames[$i]
        $script:stepLabels[$i].ForeColor = $clrMuted
        $script:stepLabels[$i].Font = New-Object System.Drawing.Font("Microsoft YaHei UI", 10)
      }
      $progressBar.Value = 0
      $logBox.Clear()
    }
    Do-Install
  }
})

# ============ Show form ============
[void]$form.ShowDialog()
