import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_THEME_TOKENS } from "@/lib/theme-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { scope, targetId } = body; // scope: 'THEME' | 'PAGE' | 'SECTION' | 'WIDGET'

    if (scope === "THEME") {
      await prisma.systemPageConfig.upsert({
        where: { id: "theme-builder-config" },
        update: {
          name: "Default FancyHub Theme",
          configJson: JSON.stringify(DEFAULT_THEME_TOKENS),
        },
        create: {
          id: "theme-builder-config",
          name: "Default FancyHub Theme",
          configJson: JSON.stringify(DEFAULT_THEME_TOKENS),
        },
      });
      return NextResponse.json({ success: true, message: "Theme reset to default factory tokens." });
    }

    if (scope === "PAGE" && targetId) {
      // Reset page sections back to standard starter layout
      await prisma.pageSection.deleteMany({ where: { pageId: targetId } });
      await prisma.pageConfig.update({
        where: { id: targetId },
        data: { status: "DRAFT", layoutType: "DEFAULT", updatedAt: new Date() },
      });
      return NextResponse.json({ success: true, message: `Page '${targetId}' reset to default blank state.` });
    }

    if (scope === "SECTION" && targetId) {
      await prisma.pageSection.update({
        where: { id: targetId },
        data: {
          contentJson: "{}",
          stylingJson: "{}",
          settings: "{}",
          style: "{}",
          updatedAt: new Date(),
        },
      });
      return NextResponse.json({ success: true, message: `Section '${targetId}' styling reset.` });
    }

    return NextResponse.json({ success: false, error: "Invalid reset scope." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
