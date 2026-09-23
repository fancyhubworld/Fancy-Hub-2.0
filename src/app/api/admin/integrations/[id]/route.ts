import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { encryptCredentials, decryptCredentials, maskCredentialsObject } from "@/lib/secret-manager";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const integration = await prisma.apiIntegration.findUnique({
      where: { id: params.id },
      include: {
        logs: { take: 10, orderBy: { createdAt: "desc" } },
        credentialVersions: { orderBy: { versionNumber: "desc" } },
      },
    });

    if (!integration) {
      return NextResponse.json({ success: false, error: "Integration not found" }, { status: 404 });
    }

    const decrypted = decryptCredentials(integration.encryptedCredentials) || {};
    const masked = maskCredentialsObject(decrypted);

    return NextResponse.json({
      success: true,
      integration: {
        id: integration.id,
        name: integration.name,
        category: integration.category,
        provider: integration.provider,
        environment: integration.environment,
        mode: integration.mode,
        status: integration.status,
        baseUrl: integration.baseUrl,
        sandboxUrl: integration.sandboxUrl,
        apiVersion: integration.apiVersion,
        maskedCredentials: masked,
        publicSettings: integration.publicSettings ? JSON.parse(integration.publicSettings) : {},
        webhookUrl: integration.webhookUrl,
        hasWebhookSecret: Boolean(integration.webhookSecretEncrypted),
        webhookEvents: integration.webhookEvents ? JSON.parse(integration.webhookEvents) : [],
        lastTestedAt: integration.lastTestedAt,
        lastTestStatus: integration.lastTestStatus,
        lastResponseTimeMs: integration.lastResponseTimeMs,
        lastErrorMessage: integration.lastErrorMessage,
        logs: integration.logs,
        credentialVersions: integration.credentialVersions,
        createdAt: integration.createdAt,
        updatedAt: integration.updatedAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      name,
      status,
      mode,
      environment,
      baseUrl,
      sandboxUrl,
      apiVersion,
      credentials,
      publicSettings,
      webhookUrl,
      webhookSecret,
      webhookEvents,
    } = body;

    const existing = await prisma.apiIntegration.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Integration not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (status) updateData.status = status;
    if (mode) updateData.mode = mode;
    if (environment) updateData.environment = environment;
    if (baseUrl !== undefined) updateData.baseUrl = baseUrl;
    if (sandboxUrl !== undefined) updateData.sandboxUrl = sandboxUrl;
    if (apiVersion !== undefined) updateData.apiVersion = apiVersion;
    if (webhookUrl !== undefined) updateData.webhookUrl = webhookUrl;
    if (webhookEvents !== undefined) updateData.webhookEvents = JSON.stringify(webhookEvents);
    if (publicSettings !== undefined) updateData.publicSettings = JSON.stringify(publicSettings);

    if (credentials && Object.keys(credentials).length > 0) {
      // Merge with existing decrypted credentials if partial
      const existingDecrypted = decryptCredentials(existing.encryptedCredentials) || {};
      const merged = { ...existingDecrypted, ...credentials };
      updateData.encryptedCredentials = encryptCredentials(merged);
    }

    if (webhookSecret) {
      updateData.webhookSecretEncrypted = encryptCredentials(webhookSecret);
    }

    const updated = await prisma.apiIntegration.update({
      where: { id: params.id },
      data: updateData,
    });

    // Record Audit Log
    await prisma.auditLog.create({
      data: {
        action: "API_INTEGRATION_UPDATED",
        targetType: "ApiIntegration",
        targetId: updated.id,
        entity: "ApiIntegration",
        field: "status",
        newValue: updated.status,
        changedBy: "Super Admin",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Integration '${updated.name}' updated successfully!`,
      integrationId: updated.id,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existing = await prisma.apiIntegration.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Integration not found" }, { status: 404 });
    }

    await prisma.apiIntegration.delete({ where: { id: params.id } });

    await prisma.auditLog.create({
      data: {
        action: "API_INTEGRATION_DELETED",
        targetType: "ApiIntegration",
        targetId: params.id,
        entity: "ApiIntegration",
        changedBy: "Super Admin",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Integration '${existing.name}' removed successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
