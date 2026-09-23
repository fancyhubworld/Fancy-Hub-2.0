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
