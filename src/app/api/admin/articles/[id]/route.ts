import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const article = await prisma.article.findUnique({
      where: { id: params.id },
    });
    if (!article) {
      return NextResponse.json({ error: "未找到" }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch (error) {
    console.error("[Admin Article]", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, content, coverImageUrl, type, eventDate, sortOrder } = body;

    const article = await prisma.article.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(coverImageUrl !== undefined && { coverImageUrl }),
        ...(type !== undefined && { type }),
        ...(eventDate !== undefined && {
          eventDate: eventDate ? new Date(eventDate) : null,
        }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("[Admin Article]", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    await prisma.article.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Article]", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
