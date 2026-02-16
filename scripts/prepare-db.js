#!/usr/bin/env node
/**
 * 根据 DATABASE_URL 选择 Prisma schema
 * Vercel 部署时若 DATABASE_URL 为 postgresql，使用 Postgres schema
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const dbUrl = process.env.DATABASE_URL || "";
const isPostgres = dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://");

const schemaDir = path.join(__dirname, "..", "prisma");
const mainSchema = path.join(schemaDir, "schema.prisma");
const postgresSchema = path.join(schemaDir, "schema.postgres.prisma");

if (isPostgres && fs.existsSync(postgresSchema)) {
  fs.copyFileSync(postgresSchema, mainSchema);
  console.log("Using PostgreSQL schema");
  try {
    execSync("npx prisma db push", { stdio: "inherit" });
  } catch (e) {
    console.warn("prisma db push failed (tables may already exist)");
  }
}
