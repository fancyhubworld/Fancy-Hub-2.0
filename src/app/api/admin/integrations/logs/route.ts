import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get("provider");
    const integrationId = searchParams.get("integrationId");
    const isSuccess = searchParams.get("isSuccess");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const where: any = {};
    if (provider) where.provider = provider;
    if (integrationId) where.integrationId = integrationId;
    if (isSuccess !== null && isSuccess !== undefined && isSuccess !== "") {
      where.isSuccess = isSuccess === "true";
    }

    const logs = await prisma.apiRequestLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 100),
      include: {
        integration: { select: { name: true, category: true } },
      },
    });

    const totalLogs = await prisma.apiRequestLog.count({ where });

    return NextResponse.json({
      success: true,
      total: totalLogs,
      logs,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
