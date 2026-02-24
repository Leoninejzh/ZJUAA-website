import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function deleteDonationById(id: string) {
  const dbUrl = process.env.DATABASE_URL;
  const skipDb =
    process.env.SKIP_DATABASE === "1" ||
    !dbUrl ||
    (process.env.VERCEL && dbUrl.startsWith("file:"));

  if (skipDb) {
    return NextResponse.json({ error: "当前无数据库" }, { status: 400 });
  }

  try {
    await prisma.donation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Donations Delete]", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "缺少 id 参数" }, { status: 400 });
  }
  return deleteDonationById(id);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }
  let id: string | null = null;
  try {
    const body = await request.json();
    if (body?.action === "delete") {
      id = (body?.id ?? body?.donationId) as string;
    }
  } catch {
    // ignore
  }
  if (!id) {
    return NextResponse.json({ error: "缺少 id 参数" }, { status: 400 });
  }
  return deleteDonationById(id);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const dbUrl = process.env.DATABASE_URL;
    const skipDb =
      process.env.SKIP_DATABASE === "1" ||
      !dbUrl ||
      (process.env.VERCEL && dbUrl.startsWith("file:"));

    if (skipDb) {
      return NextResponse.json([]);
    }

    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(donations);
  } catch (error) {
    console.error("[Admin Donations]", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }
}
