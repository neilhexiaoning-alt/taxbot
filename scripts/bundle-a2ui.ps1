#!/usr/bin/env pwsh
<#
.SYNOPSIS
Bundle A2UI assets. Windows PowerShell version of bundle-a2ui.sh
#>

param()

$ErrorActionPreference = 'Stop'

function Write-Error-Custom {
    param([string]$Message)
    Write-Error $Message
}

try {
    # Use the current working directory as root (pnpm sets this correctly)
    $RootDir = Get-Location | Select-Object -ExpandProperty Path
    
    $HashFile = Join-Path $RootDir "src/canvas-host/a2ui/.bundle.hash"
    $OutputFile = Join-Path $RootDir "src/canvas-host/a2ui/a2ui.bundle.js"
    $A2UIRendererDir = Join-Path $RootDir "vendor/a2ui/renderers/lit"
    $A2UIAppDir = Join-Path $RootDir "apps/shared/OpenClawKit/Tools/CanvasA2UI"

    Write-Host "RootDir: $RootDir"
    Write-Host "A2UIRendererDir: $A2UIRendererDir"
    Write-Host "A2UIAppDir: $A2UIAppDir"
    Write-Host "A2UIRendererDir exists: $(Test-Path $A2UIRendererDir)"
    Write-Host "A2UIAppDir exists: $(Test-Path $A2UIAppDir)"

    # Check if sources exist
    if (-not (Test-Path $A2UIRendererDir) -or -not (Test-Path $A2UIAppDir)) {
        Write-Host "A2UI sources missing; keeping prebuilt bundle."
        exit 0
    }

    # Compute hash using Node.js
    $InputPaths = @(
        (Join-Path $RootDir "package.json"),
        (Join-Path $RootDir "pnpm-lock.yaml"),
        $A2UIRendererDir,
        $A2UIAppDir
    )

    # Write Node script to a temp file to avoid quoting issues
    $TempScript = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), "hash-a2ui-$([System.IO.Path]::GetRandomFileName()).mjs")
    
    $NodeScriptContent = @'
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

const rootDir = process.env.ROOT_DIR ?? process.cwd();
const inputs = process.argv.slice(2);
const files = [];

async function walk(entryPath) {
  const st = await fs.stat(entryPath);
  if (st.isDirectory()) {
    const entries = await fs.readdir(entryPath);
    for (const entry of entries) {
      await walk(path.join(entryPath, entry));
    }
    return;
  }
  files.push(entryPath);
}

for (const input of inputs) {
  await walk(input);
}

function normalize(p) {
  return p.split(path.sep).join("/");
}

files.sort((a, b) => normalize(a).localeCompare(normalize(b)));

const hash = createHash("sha256");
for (const filePath of files) {
  const rel = normalize(path.relative(rootDir, filePath));
  hash.update(rel);
  hash.update("\0");
  hash.update(await fs.readFile(filePath));
  hash.update("\0");
}

process.stdout.write(hash.digest("hex"));
'@
    
    Set-Content -Path $TempScript -Value $NodeScriptContent -Encoding UTF8
    
    try {
        $env:ROOT_DIR = $RootDir
        $CurrentHash = & node $TempScript @InputPaths
    }
    finally {
        Remove-Item -Path $TempScript -ErrorAction SilentlyContinue
    }

    # Check if hash matches
    if ((Test-Path $HashFile) -and (Test-Path $OutputFile)) {
        $PreviousHash = Get-Content $HashFile -Raw
        if ($PreviousHash -eq $CurrentHash) {
            Write-Host "A2UI bundle up to date; skipping."
            exit 0
        }
    }

    # Build bundle
    Write-Host "Building A2UI bundle..."
    & pnpm -s exec tsc -p "$A2UIRendererDir/tsconfig.json"
    & rolldown -c "$A2UIAppDir/rolldown.config.mjs"

    # Save hash
    Set-Content -Path $HashFile -Value $CurrentHash -NoNewline

    Write-Host "A2UI bundle built successfully."
}
catch {
    Write-Error "A2UI bundling failed. Re-run with: pnpm canvas:a2ui:bundle"
    Write-Error "If this persists, verify pnpm deps and try again."
    exit 1
}
