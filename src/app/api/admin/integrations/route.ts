import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { encryptCredentials, decryptCredentials, maskCredentialsObject } from "@/lib/secret-manager";
import { getProviderSchema } from "@/lib/integrations/integration-manager";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const environment = searchParams.get("environment");

    const where: any = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (environment) where.environment = environment;

    const integrations = await prisma.apiIntegration.findMany({
      where,
      orderBy: [{ category: "asc" }, { name: "asc" }],
      include: {
        _count: { select: { logs: true, credentialVersions: true } },
      },
    });

    // Mask secrets for safe UI rendering
    const safeIntegrations = integrations.map((item) => {
      const decrypted = decryptCredentials(item.encryptedCredentials) || {};
      const masked = maskCredentialsObject(decrypted);

      return {
        id: item.id,
        name: item.name,
        category: item.category,
        provider: item.provider,
        environment: item.environment,
        mode: item.mode,
        status: item.status,
        baseUrl: item.baseUrl,
        sandboxUrl: item.sandboxUrl,
        apiVersion: item.apiVersion,
        maskedCredentials: masked,
        publicSettings: item.publicSettings ? JSON.parse(item.publicSettings) : {},
        webhookUrl: item.webhookUrl,
        hasWebhookSecret: Boolean(item.webhookSecretEncrypted),
        webhookEvents: item.webhookEvents ? JSON.parse(item.webhookEvents) : [],
        lastTestedAt: item.lastTestedAt,
        lastTestStatus: item.lastTestStatus,
        lastResponseTimeMs: item.lastResponseTimeMs,
        lastErrorMessage: item.lastErrorMessage,
        totalLogs: item._count.logs,
        totalVersions: item._count.credentialVersions,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    // Summary Telemetry
    const all = await prisma.apiIntegration.findMany({ select: { status: true, lastTestStatus: true } });
    const stats = {
      total: all.length,
      active: all.filter((i) => i.status === "ACTIVE").length,
      inactive: all.filter((i) => i.status === "INACTIVE" || i.status === "NOT_CONFIGURED").length,
      errors: all.filter((i) => i.status === "ERROR" || i.lastTestStatus === "FAILED").length,
      testing: all.filter((i) => i.status === "TESTING").length,
    };

    return NextResponse.json({
      success: true,
      stats,
      integrations: safeIntegrations,
    });
  } catch (error: any) {
    console.error("GET /api/admin/integrations error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      category,
      provider,
      environment = "DEVELOPMENT",
      mode = "TEST",
      status = "ACTIVE",
      baseUrl,
      sandboxUrl,
      apiVersion = "v1",
      credentials = {},
      publicSettings = {},
      webhookUrl,
      webhookSecret,
      webhookEvents = [],
      rateLimitPerMin = 60,
      timeoutSeconds = 10,
    } = body;

    if (!name || !category || !provider) {
      return NextResponse.json(
        { success: false, error: "Name, category, and provider are required" },
        { status: 400 }
      );
    }

    // Encrypt credentials at rest
    const encryptedCredentials = encryptCredentials(credentials);
    const webhookSecretEncrypted = webhookSecret ? encryptCredentials(webhookSecret) : null;

    const integration = await prisma.apiIntegration.create({
      data: {
        name,
        category,
        provider,
        environment,
        mode,
        status,
        baseUrl,
        sandboxUrl,
        apiVersion,
        encryptedCredentials,
        publicSettings: JSON.stringify(publicSettings),
        webhookUrl,
        webhookSecretEncrypted,
        webhookEvents: JSON.stringify(webhookEvents),
        rateLimitPerMin,
        timeoutSeconds,
        credentialVersions: {
          create: {
            versionNumber: 1,
            action: "CREATED",
            changedBy: "Super Admin",
            environment,
            note: "Initial integration setup",
          },
        },
      },
    });

    // Record Audit Log
    await prisma.auditLog.create({
      data: {
        action: "API_INTEGRATION_CREATED",
        targetType: "ApiIntegration",
        targetId: integration.id,
        entity: "ApiIntegration",
        field: "status",
        newValue: status,
        changedBy: "Super Admin",
      },
    });

    return NextResponse.json({
      success: true,
      message: `API integration '${name}' created successfully with encrypted credentials!`,
      integrationId: integration.id,
    });
  } catch (error: any) {
    console.error("POST /api/admin/integrations error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
