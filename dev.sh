#!/usr/bin/env bash
set -e

# start backend dev
( cd backend && npm run dev ) &

# start frontend dev
( cd frontend && npm run dev ) &

# wait for both
wait
