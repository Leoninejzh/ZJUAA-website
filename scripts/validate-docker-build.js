#!/usr/bin/env node
/**
 * 验证 Docker 构建所需文件与步骤（无需 Docker / gcloud）
 * 用于本地自检，Cloud Build 在 Linux 环境无 EPERM 问题
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const required = [
  "package.json",
  "package-lock.json",
  "prisma/schema.prisma",
  "prisma/schema.postgres.prisma",
  "scripts/prepare-db.js",
  "Dockerfile",
  "docker-entrypoint.sh",
  "next.config.js",
];

let ok = true;
for (const f of required) {
  const p = path.join(root, f);
  if (!fs.existsSync(p)) {
    console.error("❌ 缺失:", f);
    ok = false;
  } else {
    console.log("✓", f);
  }
}

if (!ok) {
  console.error("\n部分文件缺失，请检查。");
  process.exit(1);
}

// 模拟 prepare-db（会覆盖 schema.prisma，验证后恢复）
const schemaPath = path.join(root, "prisma/schema.prisma");
const backup = fs.readFileSync(schemaPath, "utf8");
try {
  process.env.DATABASE_URL = "postgresql://test@localhost:5432/test";
  require("./prepare-db.js");
  const schema = fs.readFileSync(schemaPath, "utf8");
  if (!schema.includes('provider = "postgresql"')) {
    console.error("❌ prepare-db 未正确切换为 PostgreSQL schema");
    process.exit(1);
  }
  console.log("\n✓ prepare-db 切换 Postgres schema 正常");
} finally {
  fs.writeFileSync(schemaPath, backup);
}

console.log("\n✅ Docker 构建前置检查通过");
console.log("   Cloud Build 在 Linux 环境执行，无 Windows EPERM 问题");
console.log("   推送至 GitHub 后由 Cloud Build 自动构建即可");
