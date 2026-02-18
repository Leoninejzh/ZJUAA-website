#!/usr/bin/env node
/**
 * 根据 DATABASE_URL 选择 Prisma schema
 * file: -> SQLite (本地开发) | postgresql: -> PostgreSQL (Supabase/Cloud)
 */
const fs = require("fs");
const path = require("path");

// 加载环境变量：.env.local 优先（本地），CI/Docker 已设置则跳过
const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env");
const envLocalPath = path.join(root, ".env.local");
if (!process.env.DATABASE_URL) {
  if (fs.existsSync(envLocalPath)) require("dotenv").config({ path: envLocalPath });
  if (fs.existsSync(envPath)) require("dotenv").config({ path: envPath, override: false });
}

const dbUrl = process.env.DATABASE_URL || "";
const isPostgres = dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://");
const isSqlite = dbUrl.startsWith("file:");

const schemaDir = path.join(__dirname, "..", "prisma");
const mainSchema = path.join(schemaDir, "schema.prisma");

if (isPostgres) {
  const postgresSchema = path.join(schemaDir, "schema.postgres.prisma");
  if (fs.existsSync(postgresSchema)) {
    fs.copyFileSync(postgresSchema, mainSchema);
    console.log("Using PostgreSQL schema");
  }
} else if (isSqlite) {
  const sqliteSchema = path.join(schemaDir, "schema.sqlite.prisma");
  if (fs.existsSync(sqliteSchema)) {
    fs.copyFileSync(sqliteSchema, mainSchema);
    console.log("Using SQLite schema (local dev)");
  }
}
