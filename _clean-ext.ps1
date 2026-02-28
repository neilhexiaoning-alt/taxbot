$extDir = "D:\ai\clawd\openclaw3\taxbot-inst\extensions"
Get-ChildItem -Path $extDir -Recurse -Directory -Filter "node_modules" -ErrorAction SilentlyContinue |
  Sort-Object { $_.FullName.Length } -Descending |
  ForEach-Object {
    Write-Host "Removing: $($_.FullName)"
    cmd /c "rd /s /q `"$($_.FullName)`"" 2>&1 | Out-Null
  }
Write-Host "Done cleaning extension node_modules"
