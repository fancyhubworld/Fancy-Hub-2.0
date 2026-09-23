import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_NAVIGATION_MENUS, NavigationMenuConfig, NavigationMenuType } from "@/lib/navigation-builder-types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const menuType = searchParams.get("type") as NavigationMenuType | null;

    const config = await prisma.systemPageConfig.findUnique({
      where: { id: "navigation-menus-config" },
    });

    const allMenus: Record<NavigationMenuType, NavigationMenuConfig> = config
      ? JSON.parse(config.configJson)
      : DEFAULT_NAVIGATION_MENUS;

    if (menuType && allMenus[menuType]) {
      return NextResponse.json({ success: true, menu: allMenus[menuType] });
    }

    return NextResponse.json({ success: true, menus: allMenus });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { menuType, menuData } = body;

    const existingConfig = await prisma.systemPageConfig.findUnique({
      where: { id: "navigation-menus-config" },
    });

    const allMenus: Record<NavigationMenuType, NavigationMenuConfig> = existingConfig
      ? JSON.parse(existingConfig.configJson)
      : { ...DEFAULT_NAVIGATION_MENUS };

    if (menuType && menuData) {
      allMenus[menuType as NavigationMenuType] = menuData;
    }

    const saved = await prisma.systemPageConfig.upsert({
      where: { id: "navigation-menus-config" },
      update: {
        name: "Website Navigation Menus",
        configJson: JSON.stringify(allMenus),
      },
      create: {
        id: "navigation-menus-config",
        name: "Website Navigation Menus",
        configJson: JSON.stringify(allMenus),
      },
    });

    return NextResponse.json({ success: true, menus: JSON.parse(saved.configJson) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
