import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { encryptCredentials } from "@/lib/secret-manager";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { newCredentials, note = "Rotated credentials", changedBy = "Super Admin" } = body;

    if (!newCredentials || Object.keys(newCredentials).length === 0) {
      return NextResponse.json({ success: false, error: "New credentials are required" }, { status: 400 });
    }

    const integration = await prisma.apiIntegration.findUnique({
      where: { id: params.id },
      include: { credentialVersions: { orderBy: { versionNumber: "desc" } } },
    });

    if (!integration) {
      return NextResponse.json({ success: false, error: "Integration not found" }, { status: 404 });
    }

    const currentVersion = integration.credentialVersions[0]?.versionNumber || 1;
    const nextVersion = currentVersion + 1;

    const encryptedCredentials = encryptCredentials(newCredentials);

    await prisma.$transaction([
      prisma.apiIntegration.update({
        where: { id: params.id },
        data: {
          encryptedCredentials,
          lastTestedAt: null,
          lastTestStatus: "TESTING",
        },
      }),
      prisma.apiCredentialHistory.create({
        data: {
          integrationId: params.id,
          versionNumber: nextVersion,
          action: "ROTATED",
          changedBy,
          environment: integration.environment,
          note,
        },
      }),
      prisma.auditLog.create({
        data: {
          action: "API_CREDENTIALS_ROTATED",
          targetType: "ApiIntegration",
          targetId: params.id,
          entity: "ApiIntegration",
          field: "encryptedCredentials",
          newValue: `v${nextVersion}`,
          changedBy,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `Credentials rotated to version ${nextVersion} successfully!`,
      version: nextVersion,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
