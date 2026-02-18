import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const getSkipDb = () =>
  process.env.SKIP_DATABASE === "1" ||
  !process.env.DATABASE_URL ||
  (process.env.VERCEL && process.env.DATABASE_URL?.startsWith("file:"));

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  if (getSkipDb()) return NextResponse.json({});

  try {
    const rows = await prisma.siteSettings.findMany();
    const settings: Record<string, unknown> = {};
    for (const row of rows) {
      try {
        settings[row.key] = JSON.parse(row.value);
      } catch {
        settings[row.key] = row.value;
      }
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("[Admin Settings]", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  if (getSkipDb()) {
    return NextResponse.json({ error: "当前无数据库" }, { status: 400 });
  }

  try {
    const body = await request.json();

    for (const [key, value] of Object.entries(body)) {
      const valueStr =
        typeof value === "object" ? JSON.stringify(value) : String(value);

      await prisma.siteSettings.upsert({
        where: { key },
        create: { key, value: valueStr },
        update: { value: valueStr },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Settings]", error);
    return NextResponse.json({ error: "保存失败" }, { status: 500 });
  }
}
