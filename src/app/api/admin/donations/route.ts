import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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
