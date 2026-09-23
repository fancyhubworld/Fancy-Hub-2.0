import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { THEME_PRESETS, ThemeTokens, generateCssVariables } from "@/lib/theme-engine";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const record = await prisma.systemPageConfig.findUnique({
      where: { id: "theme-builder-config" },
    });

    let theme: ThemeTokens = THEME_PRESETS["fancyhub-classic"] || THEME_PRESETS["royal-blue"];

    if (record) {
      theme = JSON.parse(record.configJson);
    }

    const cssVariables = generateCssVariables(theme);

    return NextResponse.json({
      success: true,
      theme,
      cssVariables,
      activeMode: theme.activeMode || "light",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
