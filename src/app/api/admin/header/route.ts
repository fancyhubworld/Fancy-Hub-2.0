import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { DEFAULT_HEADER_ELEMENTS, HeaderBuilderConfig } from "@/lib/header-builder-types";

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
        isCustom: false,
      });
    }

    const parsed = JSON.parse(config.configJson);
    return NextResponse.json({
      success: true,
      header: parsed,
      isCustom: true,
      updatedAt: config.updatedAt,
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
      isCustom: false,
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { elements, desktopLayoutType, mobileLayoutType, isSticky } = body;

    if (!elements || !Array.isArray(elements)) {
      return NextResponse.json({ success: false, error: "Invalid elements payload" }, { status: 400 });
    }

    const headerPayload: HeaderBuilderConfig = {
      id: "header-builder-config",
      isSticky: isSticky ?? true,
      desktopLayoutType: desktopLayoutType || "standard",
      mobileLayoutType: mobileLayoutType || "standard",
      elements,
      updatedAt: new Date().toISOString(),
    };

    const updated = await prisma.systemPageConfig.upsert({
      where: { id: "header-builder-config" },
      update: {
        name: "Global Header Configuration",
        configJson: JSON.stringify(headerPayload),
      },
      create: {
        id: "header-builder-config",
        name: "Global Header Configuration",
        configJson: JSON.stringify(headerPayload),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Header configuration saved successfully",
      header: headerPayload,
      updatedAt: updated.updatedAt,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
