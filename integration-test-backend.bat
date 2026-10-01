@echo off
setlocal

cd /d "%~dp0backend"

if exist ".venv\Scripts\python.exe" (
  ".venv\Scripts\python.exe" -m pytest --version >nul 2>nul
  if not errorlevel 1 (
    ".venv\Scripts\python.exe" -m pytest tests/test_auth_api.py tests/test_applications_api.py
    exit /b %errorlevel%
  )
)

python -m pytest tests/test_auth_api.py tests/test_applications_api.py
