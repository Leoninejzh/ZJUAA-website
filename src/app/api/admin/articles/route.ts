import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

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
