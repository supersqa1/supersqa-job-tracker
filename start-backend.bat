@echo off
setlocal

cd /d "%~dp0"

if exist "backend\.env" (
  for /f "usebackq eol=# tokens=1,* delims==" %%A in ("backend\.env") do (
    if not "%%A"=="" set "%%A=%%B"
  )
)

if "%HOST%"=="" set "HOST=0.0.0.0"
if "%PORT%"=="" set "PORT=3050"

cd backend

if exist ".venv\Scripts\python.exe" (
  ".venv\Scripts\python.exe" -m uvicorn app.main:app --reload --host "%HOST%" --port "%PORT%"
) else (
  python -m uvicorn app.main:app --reload --host "%HOST%" --port "%PORT%"
)
