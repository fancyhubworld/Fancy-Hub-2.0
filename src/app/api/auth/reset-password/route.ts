import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPasswordResetToken, hashPassword } from "@/lib/auth-engine";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, token, newPassword } = body;

    if (!email || !token || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Email, token, and new password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const isValid = verifyPasswordResetToken(cleanEmail, token);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired password reset token" },
        { status: 401 }
      );
    }

    const newPasswordHash = hashPassword(newPassword);

    await prisma.user.update({
      where: { email: cleanEmail },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully! You can now sign in with your new password.",
    });
  } catch (error: any) {
    console.error("POST /api/auth/reset-password error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to reset password" },
      { status: 500 }
    );
  }
}
