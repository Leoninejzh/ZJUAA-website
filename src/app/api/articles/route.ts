import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json([]);
  }
  try {
    const { prisma } = await import("@/lib/prisma");
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "past" | "upcoming"

    const where = type ? { type } : {};
    const articles = await prisma.article.findMany({
      where,
      orderBy: [{ sortOrder: "desc" }, { eventDate: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("[Articles API]", error);
    return NextResponse.json([], { status: 200 });
  }
}
