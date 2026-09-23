import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, generateJwtToken, AuthUserPayload } from "@/lib/auth-engine";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, password, role = "CUSTOMER" } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check existing
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        phone: phone ? phone.trim() : null,
        passwordHash,
        role: role === "VENDOR" ? "VENDOR" : "CUSTOMER",
        isActive: true,
        isEmailVerified: false,
        customerProfile: {
          create: {
            loyaltyPoints: 100, // 100 welcome bonus points
          },
        },
      },
      include: { customerProfile: true },
    });

    const payload: AuthUserPayload = {
      userId: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: user.role as any,
      avatar: user.avatar,
    };

    const token = generateJwtToken(payload);

    return NextResponse.json({
      success: true,
      message: "Account registered successfully!",
      user: payload,
      token,
    });
  } catch (error: any) {
    console.error("POST /api/auth/register error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}
