$f = Join-Path $env:USERPROFILE '.openclaw\agents\main\sessions\sessions.json'
$j = Get-Content $f -Raw | ConvertFrom-Json
$j.taxchat.PSObject.Properties.Remove('skillsSnapshot')
$out = $j | ConvertTo-Json -Depth 20
Set-Content -Path $f -Value $out -Encoding UTF8
Write-Host "Cleared skillsSnapshot"
