import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(request: NextRequest) {
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
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "article";

    if (!file) {
      return NextResponse.json({ error: "未选择文件" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || ".jpg";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

    await mkdir(UPLOAD_DIR, { recursive: true });
    const filePath = path.join(UPLOAD_DIR, safeName);
    await writeFile(filePath, buffer);

    const url = `/uploads/${safeName}`;

    const image = await prisma.uploadedImage.create({
      data: {
        filename: file.name,
        url,
        category,
      },
    });

    return NextResponse.json({ success: true, image });
  } catch (error) {
    console.error("[Upload API]", error);
    return NextResponse.json({ error: "上传失败" }, { status: 500 });
  }
}
