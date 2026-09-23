import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generatePasswordResetToken } from "@/lib/auth-engine";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      // Return 200 to prevent email enumeration attacks
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, a password reset link has been dispatched.",
      });
    }

    const resetToken = generatePasswordResetToken(cleanEmail);

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a password reset link has been dispatched.",
      resetUrl: process.env.NODE_ENV === "production" ? undefined : `/reset-password?token=${resetToken}&email=${encodeURIComponent(cleanEmail)}`,
      devToken: process.env.NODE_ENV === "production" ? undefined : resetToken,
    });
  } catch (error: any) {
    console.error("POST /api/auth/forgot-password error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
