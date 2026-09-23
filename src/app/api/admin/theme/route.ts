import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { THEME_PRESETS, ThemeTokens } from "@/lib/theme-engine";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const record = await prisma.systemPageConfig.findUnique({
      where: { id: "theme-builder-config" },
    });

    if (record) {
      const theme: ThemeTokens = JSON.parse(record.configJson);
      return NextResponse.json({ success: true, theme, presets: THEME_PRESETS });
    }

    // Fallback to legacy themeConfig or default
    const legacy = await prisma.themeConfig.findUnique({
      where: { id: "global-theme" },
    });

    if (legacy) {
      const merged: ThemeTokens = {
        ...THEME_PRESETS["royal-blue"],
        ...(legacy as any),
        // Ensure all 15 tokens exist
        primaryColor: legacy.primaryColor || "#1455D9",
        secondaryColor: legacy.secondaryColor || "#F7941D",
        accentColor: legacy.accentColor || "#6366F1",
        backgroundColor: legacy.backgroundColor || "#F8FAFC",
        cardColor: legacy.cardColor || "#FFFFFF",
        textColor: legacy.textColor || "#0F172A",
        borderColor: legacy.borderColor || "#E2E8F0",
      };
      return NextResponse.json({ success: true, theme: merged, presets: THEME_PRESETS });
    }

    return NextResponse.json({ success: true, theme: THEME_PRESETS["royal-blue"], presets: THEME_PRESETS });
  } catch (error: any) {
    console.error("GET /api/admin/theme error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: Request) {
  try {
    const body: ThemeTokens = await req.json();

    const fullTheme: ThemeTokens = {
      name: body.name || "Custom Theme",
      primaryColor: body.primaryColor || "#1455D9",
      secondaryColor: body.secondaryColor || "#F7941D",
      accentColor: body.accentColor || "#6366F1",
      successColor: body.successColor || "#10B981",
      warningColor: body.warningColor || "#F59E0B",
      dangerColor: body.dangerColor || "#EF4444",
      infoColor: body.infoColor || "#0EA5E9",
      backgroundColor: body.backgroundColor || "#F8FAFC",
      surfaceColor: body.surfaceColor || "#F1F5F9",
      cardColor: body.cardColor || "#FFFFFF",
      textColor: body.textColor || "#0F172A",
      mutedTextColor: body.mutedTextColor || "#64748B",
      borderColor: body.borderColor || "#E2E8F0",
      inputColor: body.inputColor || "#FFFFFF",
      buttonColor: body.buttonColor || body.primaryColor || "#1455D9",
      fontFamily: body.fontFamily || "Inter",
      borderRadius: body.borderRadius || "1rem",
      glassyBlur: Number(body.glassyBlur) || 16,
      glassyOpacity: Number(body.glassyOpacity) || 0.7,
      buttonStyle: body.buttonStyle || "pill",
      cardStyle: body.cardStyle || "glass-card",
      activePreset: body.activePreset || "royal-blue",
      activeMode: body.activeMode || "light",
      customCss: body.customCss || null,
    };

    // 1. Persist to systemPageConfig for full token schema
    await prisma.systemPageConfig.upsert({
      where: { id: "theme-builder-config" },
      update: {
        name: "Global Theme & Design System",
        configJson: JSON.stringify(fullTheme),
      },
      create: {
        id: "theme-builder-config",
        name: "Global Theme & Design System",
        configJson: JSON.stringify(fullTheme),
      },
    });

    // 2. Synchronize legacy themeConfig table
    try {
      await prisma.themeConfig.upsert({
        where: { id: "global-theme" },
        update: {
          name: fullTheme.name,
          primaryColor: fullTheme.primaryColor,
          secondaryColor: fullTheme.secondaryColor,
          accentColor: fullTheme.accentColor,
          backgroundColor: fullTheme.backgroundColor,
          cardColor: fullTheme.cardColor,
          textColor: fullTheme.textColor,
          borderColor: fullTheme.borderColor,
          fontFamily: fullTheme.fontFamily,
          borderRadius: fullTheme.borderRadius,
          glassyBlur: fullTheme.glassyBlur,
          glassyOpacity: fullTheme.glassyOpacity,
          buttonStyle: fullTheme.buttonStyle,
          cardStyle: fullTheme.cardStyle,
          activePreset: fullTheme.activePreset,
          activeMode: fullTheme.activeMode,
          customCss: JSON.stringify(fullTheme),
        },
        create: {
          id: "global-theme",
          name: fullTheme.name,
          primaryColor: fullTheme.primaryColor,
          secondaryColor: fullTheme.secondaryColor,
          accentColor: fullTheme.accentColor,
          backgroundColor: fullTheme.backgroundColor,
          cardColor: fullTheme.cardColor,
          textColor: fullTheme.textColor,
          borderColor: fullTheme.borderColor,
          fontFamily: fullTheme.fontFamily,
          borderRadius: fullTheme.borderRadius,
          glassyBlur: fullTheme.glassyBlur,
          glassyOpacity: fullTheme.glassyOpacity,
          buttonStyle: fullTheme.buttonStyle,
          cardStyle: fullTheme.cardStyle,
          activePreset: fullTheme.activePreset,
          activeMode: fullTheme.activeMode,
          customCss: JSON.stringify(fullTheme),
        },
      });
    } catch (e) {
      // Non-blocking sync
    }

    return NextResponse.json({ success: true, theme: fullTheme });
  } catch (error: any) {
    console.error("POST /api/admin/theme error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
