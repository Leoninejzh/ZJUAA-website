#!/bin/sh
set -e
# 启动前同步数据库表结构（PostgreSQL）
npx prisma db push --skip-generate 2>/dev/null || true
exec node server.js
