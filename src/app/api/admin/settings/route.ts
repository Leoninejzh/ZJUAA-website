import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SITE_SETTINGS } from "@/lib/default-settings";

const getSkipDb = () =>
  process.env.SKIP_DATABASE === "1" ||
  !process.env.DATABASE_URL ||
  (process.env.VERCEL && process.env.DATABASE_URL?.startsWith("file:"));

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const merged = { ...DEFAULT_SITE_SETTINGS } as Record<string, unknown>;

  if (getSkipDb()) return NextResponse.json(merged);

  try {
    const rows = await prisma.siteSettings.findMany();
    for (const row of rows) {
      try {
        merged[row.key] = JSON.parse(row.value);
      } catch {
        merged[row.key] = row.value;
      }
    }
    return NextResponse.json(merged);
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
    return NextResponse.json(
      {
        error:
          "当前无数据库。请在 .env.local 中配置 DATABASE_URL。本地开发可用 SQLite：file:./prisma/dev.db",
      },
      { status: 400 }
    );
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const validKeys = new Set(Object.keys(DEFAULT_SITE_SETTINGS));

    for (const [key, value] of Object.entries(body)) {
      if (!validKeys.has(key)) continue;
      const valueStr =
        value === undefined || value === null
          ? ""
          : typeof value === "object"
            ? JSON.stringify(value)
            : String(value);

      await prisma.siteSettings.upsert({
        where: { key },
        create: { key, value: valueStr },
        update: { value: valueStr },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Settings]", error);
    const msg =
      error instanceof Error ? error.message : "数据库连接或写入失败";
    return NextResponse.json(
      { error: `保存失败: ${msg}` },
      { status: 500 }
    );
  }
}
