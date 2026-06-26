$Root = $PSScriptRoot
Set-Location $Root

if (Test-Path "backend\.env") {
  Get-Content "backend\.env" | ForEach-Object {
    $Line = $_.Trim()
    if ($Line -and -not $Line.StartsWith("#")) {
      $Parts = $Line.Split("=", 2)
      if ($Parts.Count -eq 2) {
        [Environment]::SetEnvironmentVariable($Parts[0].Trim(), $Parts[1].Trim(), "Process")
      }
    }
  }
}

$BindHost = if ($env:HOST) { $env:HOST } else { "0.0.0.0" }
$Port = if ($env:PORT) { $env:PORT } else { "3050" }

Set-Location "backend"

if (Test-Path ".venv\Scripts\python.exe") {
  & ".venv\Scripts\python.exe" -m uvicorn app.main:app --reload --host $BindHost --port $Port
} else {
  & python -m uvicorn app.main:app --reload --host $BindHost --port $Port
}
