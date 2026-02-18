#!/usr/bin/env node
/**
 * 数据库连接诊断脚本 (Supabase)
 * 用法: npm run db:fix 或 node scripts/fix-db.js
 */
const { PrismaClient } = require("@prisma/client");

async function fixConnection() {
  const originalUrl = process.env.DATABASE_URL || "";
  if (!originalUrl) {
    console.error("❌ 错误: 未检测到 DATABASE_URL。请检查 .env 文件。");
    return;
  }

  // 自动添加 connect_timeout，避免长时间挂起
  const optimizedUrl = originalUrl.includes("?")
    ? `${originalUrl}&connect_timeout=30`
    : `${originalUrl}?connect_timeout=30`;

  const target = optimizedUrl.split("@")[1] || "***";
  console.log("🚀 开始诊断 ZJUAA 数据库连接...");
  console.log(`📡 目标地址: ${target}`);

  const prisma = new PrismaClient({
    datasources: { db: { url: optimizedUrl } },
  });

  try {
    console.log("\n🔗 [1/3] 正在尝试物理连接 (5432 端口)...");
    await prisma.$connect();
    console.log("✅ 物理连接成功！网络通路已打开。");

    console.log("\n🏗️ [2/3] 正在验证数据表结构...");
    await prisma.siteSettings.findMany({ take: 1 });
    console.log("✅ 数据库架构验证通过。");

    console.log("\n🌟 [3/3] 检查 NextAuth 安全密钥...");
    if (!process.env.NEXTAUTH_SECRET) {
      console.error("❌ 错误: 发现缺失 NEXTAUTH_SECRET，这将导致管理后台加载失败。");
    } else {
      console.log("✅ 所有配置项检查完毕，一切正常！");
    }
  } catch (error) {
    console.error("\n❌ 诊断发现问题:");

    if (error.message?.includes("Can't reach database server")) {
      console.error("💡 原因: 网络无法到达服务器。");
      console.error("👉 解决建议:");
      console.error("  1. 登录 Supabase -> Project Settings -> Database -> 取消 IPv6 限制（如有）。");
      console.error("  2. 检查 Supabase 密码是否包含 @ 或 #，若有请将其转义（@ 为 %40, # 为 %23）。");
    } else if (error.code === "P2021" || error.message?.includes("does not exist")) {
      console.error("💡 原因: 数据库已连通，但【表不存在】。");
      console.error("👉 解决建议: 在终端运行 'npx prisma db push'。");
    } else if (
      error.message?.includes("authentication failed") ||
      error.message?.includes("password")
    ) {
      console.error("💡 原因: 【用户名或密码错误】。");
      console.error("👉 解决: 检查 Supabase 密码。如果含特殊字符（如 @），需转义为 %40。");
    } else {
      console.error(`详细错误信息: ${error.message}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

fixConnection();
