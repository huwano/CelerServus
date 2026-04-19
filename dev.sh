#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="${ROOT_DIR}/backend"
FRONTEND_DIR="${ROOT_DIR}/frontend"
BACKEND_ENV_FILE="${BACKEND_DIR}/.env"
BACKEND_STORAGE_MODE="${BACKEND_STORAGE_MODE:-postgres}"
BACKEND_PORT="${PORT:-${BACKEND_PORT:-3000}}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"
FRONTEND_ORIGIN="${FRONTEND_ORIGIN:-http://localhost:${FRONTEND_PORT}}"
VITE_API_URL="${VITE_API_URL:-http://localhost:${BACKEND_PORT}}"
VITE_BACKEND_PORT="${VITE_BACKEND_PORT:-${BACKEND_PORT}}"
VITE_FRONTEND_PORT="${VITE_FRONTEND_PORT:-${FRONTEND_PORT}}"

if [[ -f "${BACKEND_ENV_FILE}" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "${BACKEND_ENV_FILE}"
  set +a
fi

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]]; then
    kill "${BACKEND_PID}" 2>/dev/null || true
  fi

  if [[ -n "${FRONTEND_PID:-}" ]]; then
    kill "${FRONTEND_PID}" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

check_port_free() {
  local port="$1"
  local label="$2"

  if lsof_output="$(lsof -iTCP:"${port}" -sTCP:LISTEN -n -P 2>/dev/null)" && [[ -n "${lsof_output}" ]]; then
    echo "[dev] ${label}-Port ${port} ist bereits belegt:"
    echo "${lsof_output}"
    echo "[dev] Beende den laufenden Prozess oder starte mit anderem Port, z. B.:"
    if [[ "${label}" == "Backend" ]]; then
      echo "[dev]   PORT=3010 VITE_API_URL=http://localhost:3010 ./dev.sh"
    else
      echo "[dev]   FRONTEND_PORT=5174 FRONTEND_ORIGIN=http://localhost:5174 ./dev.sh"
    fi
    exit 1
  fi
}

if [[ "${BACKEND_STORAGE_MODE}" == "memory" ]]; then
  unset DATABASE_URL
  echo "[dev] BACKEND_STORAGE_MODE=memory gesetzt. Backend startet mit In-Memory-Repositories."
elif [[ -n "${DATABASE_URL:-}" ]]; then
  echo "[dev] Initialisiere PostgreSQL-Schema und Seed-Daten ..."
  if ! (
    cd "${BACKEND_DIR}"
    npm run db:init
  ); then
    echo
    echo "[dev] PostgreSQL-Initialisierung fehlgeschlagen."
    echo "[dev] Pruefe backend/.env und insbesondere DATABASE_URL."
    echo "[dev] Fuer reines Weiterentwickeln ohne Datenbank kannst du starten mit:"
    echo "[dev]   BACKEND_STORAGE_MODE=memory ./dev.sh"
    exit 1
  fi
else
  echo "[dev] DATABASE_URL nicht gesetzt. Backend startet mit In-Memory-Repositories."
fi

check_port_free "${BACKEND_PORT}" "Backend"
check_port_free "${FRONTEND_PORT}" "Frontend"

echo "[dev] Starte Backend ..."
(
  cd "${BACKEND_DIR}"
  export BACKEND_STORAGE_MODE
  export BACKEND_PORT
  export FRONTEND_ORIGIN
  export PORT="${BACKEND_PORT}"
  if [[ -n "${DATABASE_URL:-}" ]]; then
    export DATABASE_URL
  else
    unset DATABASE_URL
  fi
  if [[ -n "${DATABASE_SSL:-}" ]]; then
    export DATABASE_SSL
  else
    unset DATABASE_SSL
  fi
  if [[ -n "${SESSION_COOKIE_SECURE:-}" ]]; then
    export SESSION_COOKIE_SECURE
  else
    unset SESSION_COOKIE_SECURE
  fi
  if [[ -n "${SESSION_COOKIE_SAME_SITE:-}" ]]; then
    export SESSION_COOKIE_SAME_SITE
  else
    unset SESSION_COOKIE_SAME_SITE
  fi
  if [[ -n "${SESSION_SECRET:-}" ]]; then
    export SESSION_SECRET
  else
    unset SESSION_SECRET
  fi
  npm run dev
) &
BACKEND_PID=$!

echo "[dev] Starte Frontend ..."
(
  cd "${FRONTEND_DIR}"
  export FRONTEND_PORT
  export VITE_API_URL
  export VITE_BACKEND_PORT
  export VITE_FRONTEND_PORT
  npm run dev
) &
FRONTEND_PID=$!

wait "${BACKEND_PID}" "${FRONTEND_PID}"
