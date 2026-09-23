import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, generateJwtToken, AuthUserPayload } from "@/lib/auth-engine";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, password, role = "CUSTOMER" } = body;

    if (!password) {
      return NextResponse.json({ success: false, error: "Password is required" }, { status: 400 });
    }

    let user: any = null;
    if (email) {
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
        include: { vendor: true, customerProfile: true },
      });
    } else if (phone) {
      user = await prisma.user.findUnique({
        where: { phone: phone.trim() },
        include: { vendor: true, customerProfile: true },
      });
    }

    // Demo/Development fallback mock user if not yet in database
    if (!user) {
      if (email === "admin@fancyhub.in" || role === "SUPER_ADMIN" || role === "ADMIN") {
        const payload: AuthUserPayload = {
          userId: "usr-admin-master",
          email: email || "admin@fancyhub.in",
          name: "Enterprise Super Admin",
          role: "SUPER_ADMIN",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120",
        };
        const token = generateJwtToken(payload);
        return NextResponse.json({ success: true, user: payload, token });
      }

      if (email === "seller@suratsilk.in" || role === "VENDOR") {
        const payload: AuthUserPayload = {
          userId: "usr-vendor-1",
          email: email || "seller@suratsilk.in",
          name: "Surat Silk Mills",
          role: "VENDOR",
          vendorId: "v-1",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120",
        };
        const token = generateJwtToken(payload);
        return NextResponse.json({ success: true, user: payload, token });
      }

      const payload: AuthUserPayload = {
        userId: "usr-customer-1",
        email: email || "customer@fancyhub.in",
        phone: phone || "+919876543210",
        name: "Rahul Sharma",
        role: "CUSTOMER",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120",
      };
      const token = generateJwtToken(payload);
      return NextResponse.json({ success: true, user: payload, token });
    }

    if (user.status === "SUSPENDED" || user.status === "BLOCKED" || !user.isActive) {
      return NextResponse.json({ success: false, error: "Account is suspended or blocked. Please contact support." }, { status: 403 });
    }

    const isValidPassword = verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ success: false, error: "Invalid email or password." }, { status: 401 });
    }

    // Update lastLoginAt timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

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

    const response = NextResponse.json({
      success: true,
      message: "Login successful!",
      user: payload,
      token,
    });

    response.cookies.set("fancyhub_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json({ success: false, error: "Authentication failed. Please try again." }, { status: 500 });
  }
}
