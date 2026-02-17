#!/usr/bin/env node
/**
 * 根据 DATABASE_URL 选择 Prisma schema
 * Cloud Run / PostgreSQL 部署时使用 Postgres schema
 */
const fs = require("fs");
const path = require("path");

const dbUrl = process.env.DATABASE_URL || "";
const isPostgres = dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://");

const schemaDir = path.join(__dirname, "..", "prisma");
const mainSchema = path.join(schemaDir, "schema.prisma");
const postgresSchema = path.join(schemaDir, "schema.postgres.prisma");

if (isPostgres && fs.existsSync(postgresSchema)) {
  fs.copyFileSync(postgresSchema, mainSchema);
  console.log("Using PostgreSQL schema");
}
