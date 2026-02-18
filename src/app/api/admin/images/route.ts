import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const skipDb =
    process.env.SKIP_DATABASE === "1" ||
    !process.env.DATABASE_URL ||
    (process.env.VERCEL && process.env.DATABASE_URL?.startsWith("file:"));
  if (skipDb) {
    return NextResponse.json([]);
  }

  try {
    const images = await prisma.uploadedImage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error("[Admin Images]", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const skipDb =
    process.env.SKIP_DATABASE === "1" ||
    !process.env.DATABASE_URL ||
    (process.env.VERCEL && process.env.DATABASE_URL?.startsWith("file:"));
  if (skipDb) {
    return NextResponse.json({ error: "当前无数据库" }, { status: 400 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "缺少 id" }, { status: 400 });
    }

    await prisma.uploadedImage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Images]", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
