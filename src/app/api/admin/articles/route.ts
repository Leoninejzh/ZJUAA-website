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

  if (getSkipDb()) return NextResponse.json([]);

  try {
    const articles = await prisma.article.findMany({
      orderBy: [{ sortOrder: "desc" }, { eventDate: "desc" }],
    });
    return NextResponse.json(articles);
  } catch (error) {
    console.error("[Admin Articles]", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  if (getSkipDb()) {
    return NextResponse.json({ error: "当前无数据库" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { title, content, coverImageUrl, type, eventDate, sortOrder } = body;

    const article = await prisma.article.create({
      data: {
        title: title || "未命名",
        content: content || "",
        coverImageUrl: coverImageUrl || null,
        type: type || "past",
        eventDate: eventDate ? new Date(eventDate) : null,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("[Admin Articles]", error);
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}
