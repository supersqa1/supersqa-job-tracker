#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")"

if [ -f backend/.env ]; then
  set -a
  . backend/.env
  set +a
fi

HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-3050}"

cd backend

if [ -x .venv/bin/python ]; then
  PYTHON=.venv/bin/python
else
  PYTHON=python3
fi

exec "$PYTHON" -m uvicorn app.main:app --reload --host "$HOST" --port "$PORT"
