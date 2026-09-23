import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  verifyPhoneOtp,
  normalizeIndianPhoneNumber,
  generateJwtToken,
  hashPassword,
  AuthUserPayload,
} from "@/lib/auth-engine";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, otp, name } = body;

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, error: "Phone number and OTP code are required" },
        { status: 400 }
      );
    }

    const normalized = normalizeIndianPhoneNumber(phone);
    const isValid = verifyPhoneOtp(normalized, otp);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired OTP code" },
        { status: 401 }
      );
    }

    // Find or create user with verified phone
    let user = await prisma.user.findUnique({
      where: { phone: normalized },
      include: { customerProfile: true, vendor: true },
    });

    if (!user) {
      const generatedEmail = `user.${normalized.replace(/\D/g, "")}@fancyhub.in`;
      user = await prisma.user.create({
        data: {
          name: name || `Customer ${normalized.slice(-4)}`,
          phone: normalized,
          email: generatedEmail,
          passwordHash: hashPassword(`otp-${Date.now()}`),
          role: "CUSTOMER",
          isPhoneVerified: true,
          isActive: true,
          customerProfile: {
            create: {
              loyaltyPoints: 100,
            },
          },
        },
        include: { customerProfile: true, vendor: true },
      });
    } else {
      if (!user.isPhoneVerified) {
        await prisma.user.update({
          where: { id: user.id },
          data: { isPhoneVerified: true },
        });
      }
    }

    const payload: AuthUserPayload = {
      userId: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: user.role as any,
      avatar: user.avatar,
      vendorId: user.vendor?.id,
    };

    const token = generateJwtToken(payload);

    return NextResponse.json({
      success: true,
      message: "Phone verified successfully!",
      user: payload,
      token,
    });
  } catch (error: any) {
    console.error("POST /api/auth/otp/verify error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "OTP verification failed" },
      { status: 500 }
    );
  }
}
