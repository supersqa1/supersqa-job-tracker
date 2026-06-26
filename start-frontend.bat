@echo off
setlocal

cd /d "%~dp0"

if exist "frontend\.env.local" (
  for /f "usebackq eol=# tokens=1,* delims==" %%A in ("frontend\.env.local") do (
    if not "%%A"=="" set "%%A=%%B"
  )
)

if "%FRONTEND_HOST%"=="" set "FRONTEND_HOST=0.0.0.0"
if "%FRONTEND_PORT%"=="" set "FRONTEND_PORT=8050"

cd frontend

node_modules\.bin\next.cmd dev -H "%FRONTEND_HOST%" -p "%FRONTEND_PORT%"
