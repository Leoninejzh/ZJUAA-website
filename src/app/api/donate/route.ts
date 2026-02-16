import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log donation data (for debugging / future DB integration)
    console.log("[Donation API] Received donation:", {
      timestamp: new Date().toISOString(),
      amount: body.amount,
      name: body.name,
      email: body.email,
      graduationYear: body.graduationYear,
      major: body.major,
      message: body.message,
      paymentMethod: body.paymentMethod,
    });

    // Simulate successful processing
    // TODO: Integrate with database (e.g., Prisma, Supabase)
    // TODO: Integrate Stripe/PayPal for card payments
    // TODO: Send confirmation email

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
