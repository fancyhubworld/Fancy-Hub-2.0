import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { decryptCredentials } from "@/lib/secret-manager";
import { testProviderConnection, recordApiRequestLog } from "@/lib/integrations/integration-manager";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const integration = await prisma.apiIntegration.findUnique({
      where: { id: params.id },
    });

    if (!integration) {
      return NextResponse.json({ success: false, error: "Integration not found" }, { status: 404 });
    }

    const decrypted = decryptCredentials(integration.encryptedCredentials);
    if (!decrypted) {
      return NextResponse.json(
        { success: false, error: "Failed to decrypt credentials for testing" },
        { status: 500 }
      );
    }

    const testResult = await testProviderConnection(integration.provider, decrypted, {
      environment: integration.environment,
      mode: integration.mode,
      baseUrl: integration.baseUrl || undefined,
    });

    // Update integration health metrics
    await prisma.apiIntegration.update({
      where: { id: params.id },
      data: {
        lastTestedAt: new Date(),
        lastTestStatus: testResult.status,
        lastResponseTimeMs: testResult.responseTimeMs,
        lastErrorMessage: testResult.isSuccess ? null : testResult.message,
        status: testResult.isSuccess ? "ACTIVE" : "ERROR",
      },
    });

    // Record API Request Log
    await recordApiRequestLog(prisma, {
      integrationId: integration.id,
      provider: integration.provider,
      endpoint: integration.baseUrl || "health_probe",
      method: "GET",
      statusCode: testResult.statusCode,
      responseTimeMs: testResult.responseTimeMs,
      isSuccess: testResult.isSuccess,
      rawPayload: { mode: integration.mode, status: testResult.status },
      errorMessage: testResult.isSuccess ? undefined : testResult.message,
    });

    // Record Audit Log
    await prisma.auditLog.create({
      data: {
        action: "API_CONNECTION_TESTED",
        targetType: "ApiIntegration",
        targetId: integration.id,
        entity: "ApiIntegration",
        field: "lastTestStatus",
        newValue: testResult.status,
        changedBy: "Super Admin",
      },
    });

    return NextResponse.json({
      success: true,
      result: testResult,
    });
  } catch (error: any) {
    console.error("POST /api/admin/integrations/[id]/test error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
