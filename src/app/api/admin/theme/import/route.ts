import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateThemeImportPackage } from "@/lib/cms-governance-types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateThemeImportPackage(body);

    if (!validation.isValid || !validation.theme) {
      return NextResponse.json(
        { success: false, error: validation.error || "Corrupted theme format" },
        { status: 400 }
      );
    }

    // Save imported theme tokens
    const saved = await prisma.systemPageConfig.upsert({
      where: { id: "theme-builder-config" },
      update: {
        name: `Imported Theme: ${validation.theme.name || "Custom"}`,
        configJson: JSON.stringify(validation.theme),
      },
      create: {
        id: "theme-builder-config",
        name: `Imported Theme: ${validation.theme.name || "Custom"}`,
        configJson: JSON.stringify(validation.theme),
      },
    });

    // If navigation menus included, restore them too
    if (body.navigationMenus && typeof body.navigationMenus === "object") {
      await prisma.systemPageConfig.upsert({
        where: { id: "navigation-menus-config" },
        update: {
          name: "Website Navigation Menus",
          configJson: JSON.stringify(body.navigationMenus),
        },
        create: {
          id: "navigation-menus-config",
          name: "Website Navigation Menus",
          configJson: JSON.stringify(body.navigationMenus),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Theme package successfully imported & applied live!",
      theme: JSON.parse(saved.configJson),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
