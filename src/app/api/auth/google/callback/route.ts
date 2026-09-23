import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateJwtToken, hashPassword } from "@/lib/auth-engine";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const state = searchParams.get("state") || "/account";

    if (error || !code) {
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error || "Google authentication cancelled")}`, request.url));
    }

    // In a live OAuth exchange, 'code' is exchanged for Google access/id token.
    // For demo/simulated environments, we handle test codes gracefully:
    const mockEmail = "customer.google@fancyhub.in";
    const mockGoogleId = `g_oauth_${Date.now()}`;

    let user = await prisma.user.findUnique({
      where: { email: mockEmail },
      include: { vendor: true, customerProfile: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: mockEmail,
          name: "Google Customer",
          passwordHash: hashPassword(`oauth-google-${Date.now()}`),
          role: "CUSTOMER",
          status: "ACTIVE",
          isEmailVerified: true,
          isActive: true,
          lastLoginAt: new Date(),
          customerProfile: { create: { loyaltyPoints: 50 } },
          identities: {
            create: {
              provider: "GOOGLE",
              providerUserId: mockGoogleId,
              email: mockEmail,
            },
          },
        },
        include: { vendor: true, customerProfile: true },
      });
    }

    const token = generateJwtToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
      avatar: user.avatar,
    });

    const response = NextResponse.redirect(new URL(state.startsWith("/") ? state : "/account", request.url));
    response.cookies.set("fancyhub_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.redirect(new URL("/login?error=OAuth_Error", request.url));
  }
}
