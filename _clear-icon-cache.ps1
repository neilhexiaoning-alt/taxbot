$cacheDir = Join-Path $env:LOCALAPPDATA 'Microsoft\Windows\Explorer'
Get-ChildItem $cacheDir -Filter 'iconcache*' -ErrorAction SilentlyContinue | ForEach-Object {
  Remove-Item $_.FullName -Force -ErrorAction SilentlyContinue
  Write-Host "Deleted: $($_.Name)"
}
ie4uinit.exe -ClearIconCache
ie4uinit.exe -show
Write-Host "Done. If icon still shows old, restart Explorer (taskkill /f /im explorer.exe && start explorer.exe)"
