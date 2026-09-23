import { NextRequest, NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/auth-engine";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cookieToken = request.cookies.get("fancyhub_session")?.value;
    const token = (authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null) || cookieToken;

    if (!token) {
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }

    const payload = verifyJwtToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, authenticated: false, error: "Invalid or expired session token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        role: true,
        status: true,
        isActive: true,
        isEmailVerified: true,
        createdAt: true,
        vendor: { select: { id: true, storeName: true, status: true } },
      },
    });

    if (!user || user.status === "SUSPENDED" || user.status === "BLOCKED" || !user.isActive) {
      return NextResponse.json({ success: false, authenticated: false, error: "Account inaccessible" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        userId: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        vendorId: user.vendor?.id,
        vendorStatus: user.vendor?.status,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
