#!/usr/bin/env node
/**
 * 加载 .env 和 .env.local 后执行命令（.env.local 覆盖）
 * 用于确保 prisma 等命令使用正确的环境变量
 */
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.join(__dirname, "..");
require("dotenv").config({ path: path.join(root, ".env") });
require("dotenv").config({ path: path.join(root, ".env.local"), override: true });

const [cmd, ...args] = process.argv.slice(2);
if (!cmd) {
  console.error("Usage: node scripts/run-with-env.js <command> [args...]");
  process.exit(1);
}

const result = spawnSync(cmd, args, {
  env: process.env,
  stdio: "inherit",
  shell: true,
});
process.exit(result.status ?? 1);
