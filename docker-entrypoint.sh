#!/bin/sh
set -e
# Initialize DB schema on first run
npx prisma db push --accept-data-loss --skip-generate 2>/dev/null || true
exec node server.js
