import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createThemeExportPackage } from "@/lib/cms-governance-types";
import { DEFAULT_THEME_TOKENS, ThemeTokens } from "@/lib/theme-engine";

export async function GET() {
  try {
    const themeConfig = await prisma.systemPageConfig.findUnique({
      where: { id: "theme-builder-config" },
    });

    const navConfig = await prisma.systemPageConfig.findUnique({
      where: { id: "navigation-menus-config" },
    });

    const currentTheme: ThemeTokens = themeConfig
      ? JSON.parse(themeConfig.configJson)
      : DEFAULT_THEME_TOKENS;

    const navMenus = navConfig ? JSON.parse(navConfig.configJson) : {};

    const exportPackage = createThemeExportPackage(currentTheme, navMenus);

    return new NextResponse(JSON.stringify(exportPackage, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="fancyhub-theme-export-${Date.now()}.json"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
