import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
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
