import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { duplicateThemePreset } from "@/lib/cms-governance-types";
import { DEFAULT_THEME_TOKENS, ThemeTokens } from "@/lib/theme-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sourcePresetKey = "fancyhub-classic", newThemeName } = body;

    if (!newThemeName || !newThemeName.trim()) {
      return NextResponse.json(
        { success: false, error: "New theme name is required." },
        { status: 400 }
      );
    }

    const newKey = `theme-clone-${Date.now()}`;
    const clonedTheme = duplicateThemePreset(sourcePresetKey, newThemeName.trim(), newKey);

    // Save as active custom theme configuration
    const saved = await prisma.systemPageConfig.upsert({
      where: { id: "theme-builder-config" },
      update: {
        name: `Theme: ${clonedTheme.name}`,
        configJson: JSON.stringify(clonedTheme),
      },
      create: {
        id: "theme-builder-config",
        name: `Theme: ${clonedTheme.name}`,
        configJson: JSON.stringify(clonedTheme),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully cloned theme to '${newThemeName}'!`,
      theme: JSON.parse(saved.configJson),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
