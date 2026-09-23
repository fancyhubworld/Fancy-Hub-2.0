import { NextRequest, NextResponse } from "next/server";
import { THEME_PRESETS, generateCssVariables } from "@/lib/theme-engine";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { theme } = body;

    const draftTheme = {
      ...(THEME_PRESETS["fancyhub-classic"] || {}),
      ...(theme || {}),
    };

    const cssVariables = generateCssVariables(draftTheme);

    return NextResponse.json({
      success: true,
      preview: draftTheme,
      cssVariables,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
