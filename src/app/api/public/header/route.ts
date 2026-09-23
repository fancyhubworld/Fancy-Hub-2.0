import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { DEFAULT_HEADER_ELEMENTS } from "@/lib/header-builder-types";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const config = await prisma.systemPageConfig.findUnique({
      where: { id: "header-builder-config" },
    });

    if (!config) {
      return NextResponse.json({
        success: true,
        header: {
          id: "header-builder-config",
          isSticky: true,
          desktopLayoutType: "standard",
          mobileLayoutType: "standard",
          elements: DEFAULT_HEADER_ELEMENTS,
        },
      });
    }

    const parsed = JSON.parse(config.configJson);
    return NextResponse.json({
      success: true,
      header: parsed,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      header: {
        id: "header-builder-config",
        isSticky: true,
        desktopLayoutType: "standard",
        mobileLayoutType: "standard",
        elements: DEFAULT_HEADER_ELEMENTS,
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}
