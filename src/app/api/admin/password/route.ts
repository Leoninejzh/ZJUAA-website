import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { newPassword, username } = body;

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json(
        { error: "新密码至少 6 位" },
        { status: 400 }
      );
    }

    const dbUrl = process.env.DATABASE_URL;
    const skipDb =
      process.env.SKIP_DATABASE === "1" ||
      !dbUrl ||
      (process.env.VERCEL && dbUrl.startsWith("file:"));

    if (skipDb) {
      return NextResponse.json(
        { error: "当前无数据库，无法修改密码。请在环境变量中配置 ADMIN_PASSWORD" },
        { status: 400 }
      );
    }

    const hashValue = await hash(newPassword, 10);

    await prisma.siteSettings.upsert({
      where: { key: "admin_password_hash" },
      create: { key: "admin_password_hash", value: hashValue },
      update: { value: hashValue },
    });

    if (username && typeof username === "string" && username.length >= 2) {
      await prisma.siteSettings.upsert({
        where: { key: "admin_username" },
        create: { key: "admin_username", value: username },
        update: { value: username },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Password]", error);
    return NextResponse.json({ error: "修改失败" }, { status: 500 });
  }
}
