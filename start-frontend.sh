#!/usr/bin/env sh
set -eu

cd "$(dirname "$0")"

if [ -f frontend/.env.local ]; then
  set -a
  . frontend/.env.local
  set +a
fi

FRONTEND_HOST="${FRONTEND_HOST:-0.0.0.0}"
FRONTEND_PORT="${FRONTEND_PORT:-8050}"

cd frontend

exec ./node_modules/.bin/next dev -H "$FRONTEND_HOST" -p "$FRONTEND_PORT"
