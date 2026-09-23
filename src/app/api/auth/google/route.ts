import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateJwtToken, hashPassword, AuthUserPayload } from "@/lib/auth-engine";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, avatar, googleId, role = "CUSTOMER" } = body;

    const cleanEmail = (email || "google.user@fancyhub.in").toLowerCase().trim();
    const cleanName = name || "Google User";
    const cleanAvatar = avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120";

    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { vendor: true, customerProfile: true, identities: true },
    });

    const googleUserId = googleId || `g_${cleanEmail.replace(/[^a-zA-Z0-9]/g, "_")}`;

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          name: cleanName,
          avatar: cleanAvatar,
          passwordHash: hashPassword(`oauth-google-${Date.now()}`),
          role: role === "VENDOR" ? "VENDOR" : "CUSTOMER",
          status: "ACTIVE",
          isEmailVerified: true,
          isActive: true,
          lastLoginAt: new Date(),
          customerProfile: {
            create: {
              loyaltyPoints: 100,
            },
          },
          identities: {
            create: {
              provider: "GOOGLE",
              providerUserId: googleUserId,
              email: cleanEmail,
            },
          },
        },
        include: { vendor: true, customerProfile: true, identities: true },
      });
    } else {
      // Account linking for existing customer with verified Google email
      await prisma.userIdentity.upsert({
        where: { provider_providerUserId: { provider: "GOOGLE", providerUserId: googleUserId } },
        update: { email: cleanEmail },
        create: {
          userId: user.id,
          provider: "GOOGLE",
          providerUserId: googleUserId,
          email: cleanEmail,
        },
      });

      // Update lastLoginAt
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date(), isEmailVerified: true },
      });
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

    const response = NextResponse.json({
      success: true,
      message: "Google OAuth sign-in successful!",
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
    console.error("POST /api/auth/google error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Google OAuth authentication failed" },
      { status: 500 }
    );
  }
}
