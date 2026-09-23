import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { THEME_PRESETS, ThemeTokens } from "@/lib/theme-engine";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const record = await prisma.systemPageConfig.findUnique({
      where: { id: "theme-builder-config" },
    });

    if (record) {
      const theme: ThemeTokens = JSON.parse(record.configJson);
      return NextResponse.json({ success: true, theme });
    }

    const legacy = await prisma.themeConfig.findUnique({
      where: { id: "global-theme" },
    });

    if (legacy) {
      const merged: ThemeTokens = {
        ...THEME_PRESETS["royal-blue"],
        ...(legacy as any),
      };
      return NextResponse.json({ success: true, theme: merged });
    }

    return NextResponse.json({ success: true, theme: THEME_PRESETS["royal-blue"] });
  } catch (error: any) {
    console.error("GET /api/public/theme error:", error);
    return NextResponse.json({ success: false, theme: THEME_PRESETS["royal-blue"] });
  } finally {
    await prisma.$disconnect();
  }
}
