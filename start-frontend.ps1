$Root = $PSScriptRoot
Set-Location $Root

if (Test-Path "frontend\.env.local") {
  Get-Content "frontend\.env.local" | ForEach-Object {
    $Line = $_.Trim()
    if ($Line -and -not $Line.StartsWith("#")) {
      $Parts = $Line.Split("=", 2)
      if ($Parts.Count -eq 2) {
        [Environment]::SetEnvironmentVariable($Parts[0].Trim(), $Parts[1].Trim(), "Process")
      }
    }
  }
}

$BindHost = if ($env:FRONTEND_HOST) { $env:FRONTEND_HOST } else { "0.0.0.0" }
$Port = if ($env:FRONTEND_PORT) { $env:FRONTEND_PORT } else { "8050" }

Set-Location "frontend"

& "node_modules\.bin\next.cmd" dev -H $BindHost -p $Port
