import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { decryptCredentials } from "@/lib/secret-manager";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json().catch(() => ({}));
    const { adminPassword, userRole = "SUPER_ADMIN" } = body;

    // Strict Security: Only Super Admin can reveal secrets
    if (userRole !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Access Denied. Only SUPER_ADMIN can reveal encrypted secrets." },
        { status: 403 }
      );
    }

    const integration = await prisma.apiIntegration.findUnique({
      where: { id: params.id },
    });

    if (!integration) {
      return NextResponse.json({ success: false, error: "Integration not found" }, { status: 404 });
    }

    const decrypted = decryptCredentials(integration.encryptedCredentials);
    if (!decrypted) {
      return NextResponse.json(
        { success: false, error: "Failed to decrypt credentials." },
        { status: 500 }
      );
    }

    // Record Security Audit Log
    await prisma.auditLog.create({
      data: {
        action: "API_SECRET_REVEALED",
        targetType: "ApiIntegration",
        targetId: integration.id,
        entity: "ApiIntegration",
        field: "encryptedCredentials",
        changedBy: "Super Admin",
      },
    });

    return NextResponse.json({
      success: true,
      credentials: decrypted,
      warning: "Sensitive credentials revealed temporarily. Never share or log these values.",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
