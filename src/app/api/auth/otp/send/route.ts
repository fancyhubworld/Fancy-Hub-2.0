import { NextRequest, NextResponse } from "next/server";
import { generatePhoneOtp, normalizeIndianPhoneNumber } from "@/lib/auth-engine";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone number is required" }, { status: 400 });
    }

    const normalized = normalizeIndianPhoneNumber(phone);
    const { otp, expiresAt } = generatePhoneOtp(normalized);

    // In production, dispatch SMS via Twilio / Fast2SMS / MSG91.
    // For development, OTP is returned in the response payload.
    return NextResponse.json({
      success: true,
      message: `6-digit OTP sent to ${normalized}. Valid for 3 minutes.`,
      phone: normalized,
      expiresAt: expiresAt.toISOString(),
      devOtp: process.env.NODE_ENV === "production" ? undefined : otp,
    });
  } catch (error: any) {
    console.error("POST /api/auth/otp/send error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to dispatch OTP" },
      { status: 500 }
    );
  }
}
