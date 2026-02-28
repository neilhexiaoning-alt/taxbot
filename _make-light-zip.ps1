$setupDir = "D:\ai\clawd\openclaw3\taxbot-setup"

# Remove ALL node_modules directories
Get-ChildItem $setupDir -Recurse -Directory -Filter 'node_modules' -ErrorAction SilentlyContinue |
  Sort-Object { $_.FullName.Length } -Descending |
  ForEach-Object {
    Write-Host "Removing: $($_.FullName)"
    cmd /c "rd /s /q `"$($_.FullName)`"" 2>&1 | Out-Null
  }
Write-Host "All node_modules cleaned"

# Create zip
$zip = "D:\ai\clawd\openclaw3\taxbot-setup.zip"
if (Test-Path $zip) { Remove-Item $zip -Force }
Write-Host "Creating taxbot-setup.zip ..."
Compress-Archive -Path "$setupDir\*" -DestinationPath $zip -CompressionLevel Fastest
$sizeMB = [math]::Round((Get-Item $zip).Length / 1MB, 1)
Write-Host "taxbot-setup.zip created (${sizeMB} MB)"
