import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { DEFAULT_SYSTEM_PAGES_CONFIG, SystemPageKey } from "@/lib/system-page-config";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageKey = searchParams.get("page") as SystemPageKey | null;

    const savedConfigs = await prisma.systemPageConfig.findMany();

    const configMap: any = { ...DEFAULT_SYSTEM_PAGES_CONFIG };

    for (const record of savedConfigs) {
      const key = record.id as SystemPageKey;
      if (configMap[key]) {
        try {
          configMap[key] = {
            ...configMap[key],
            ...JSON.parse(record.configJson),
          };
        } catch {}
      }
    }

    if (pageKey && configMap[pageKey]) {
      return NextResponse.json({ success: true, page: configMap[pageKey] });
    }

    return NextResponse.json({ success: true, pages: configMap });
  } catch (error: any) {
    return NextResponse.json({ success: true, pages: DEFAULT_SYSTEM_PAGES_CONFIG });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageKey, config } = body;

    if (!pageKey || !config) {
      return NextResponse.json({ success: false, error: "Missing pageKey or config" }, { status: 400 });
    }

    const value = JSON.stringify(config);

    await prisma.systemPageConfig.upsert({
      where: { id: pageKey },
      update: { configJson: value, updatedAt: new Date() },
      create: { id: pageKey, name: config.name || pageKey, configJson: value },
    });

    return NextResponse.json({
      success: true,
      message: `System page "${pageKey}" UI configuration updated successfully`,
      config,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
