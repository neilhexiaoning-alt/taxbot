$nodeExe = (Get-Command node).Source
$nodeDir = Split-Path $nodeExe
Write-Host "Node dir: $nodeDir"
$sizeBytes = (Get-ChildItem $nodeDir -Recurse -File | Measure-Object -Property Length -Sum).Sum
$sizeMB = [math]::Round($sizeBytes / 1MB, 1)
Write-Host "Size: $sizeMB MB"
Write-Host "---"
Get-ChildItem $nodeDir -Depth 0 | ForEach-Object {
  if ($_.PSIsContainer) {
    $dirSize = (Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    $dirSizeMB = [math]::Round($dirSize / 1MB, 1)
    Write-Host "  [DIR] $($_.Name)  ($dirSizeMB MB)"
  } else {
    $fileSizeMB = [math]::Round($_.Length / 1MB, 1)
    Write-Host "  [FILE] $($_.Name)  ($fileSizeMB MB)"
  }
}
