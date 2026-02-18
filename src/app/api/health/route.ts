import { NextResponse } from "next/server";

/**
 * 健康检查 / 环境变量诊断（不暴露敏感值）
 */
export async function GET() {
  const checks = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
    ADMIN_USERNAME: !!process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD || !!process.env.ADMIN_PASSWORD_HASH,
  };
  const allOk = Object.values(checks).every(Boolean);
  return NextResponse.json({
    ok: allOk,
    checks,
    hint: allOk
      ? null
      : "缺少环境变量，请在部署平台（Vercel/Cloud Run）设置：DATABASE_URL、NEXTAUTH_SECRET、NEXTAUTH_URL、ADMIN_USERNAME、ADMIN_PASSWORD",
  });
}
