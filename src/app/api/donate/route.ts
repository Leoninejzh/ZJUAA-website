import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const amount = Number(body.amount);
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const graduationYear = String(body.graduationYear || "").trim();
    const major = String(body.major || "").trim();
    const message = body.message ? String(body.message).trim() : null;
    const paymentMethod = body.paymentMethod === "card" ? "card" : "zelle";

    if (!amount || amount < 1 || !name || !email || !graduationYear || !major) {
      return NextResponse.json(
        { success: false, message: "请填写完整信息" },
        { status: 400 }
      );
    }

    const dbUrl = process.env.DATABASE_URL;
    const skipDb =
      process.env.SKIP_DATABASE === "1" ||
      !dbUrl ||
      (process.env.VERCEL && dbUrl.startsWith("file:"));

    if (!skipDb) {
      try {
        const { prisma } = await import("@/lib/prisma");
        await prisma.donation.create({
          data: {
            amount,
            name,
            email,
            graduationYear,
            major,
            message,
            paymentMethod,
          },
        });
      } catch (dbError) {
        console.error("[Donation API] DB error:", dbError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "捐赠信息已收到，感谢您的支持！",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Donation API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "提交失败，请稍后重试",
      },
      { status: 500 }
    );
  }
}
