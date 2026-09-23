import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { DEFAULT_PRODUCT_PAGE_BLOCKS, ProductPageBlock } from "@/lib/product-page-layout";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const config = await prisma.systemPageConfig.findUnique({
      where: { id: "product-page" },
    });

    if (!config) {
      return NextResponse.json({
        success: true,
        blocks: DEFAULT_PRODUCT_PAGE_BLOCKS,
        isCustom: false,
      });
    }

    const parsed = JSON.parse(config.configJson);
    return NextResponse.json({
      success: true,
      blocks: parsed.blocks || DEFAULT_PRODUCT_PAGE_BLOCKS,
      isCustom: true,
      updatedAt: config.updatedAt,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      blocks: DEFAULT_PRODUCT_PAGE_BLOCKS,
      isCustom: false,
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { blocks } = body;

    if (!blocks || !Array.isArray(blocks)) {
      return NextResponse.json({ success: false, error: "Invalid blocks payload" }, { status: 400 });
    }

    const updated = await prisma.systemPageConfig.upsert({
      where: { id: "product-page" },
      update: {
        name: "Product Detail Page",
        configJson: JSON.stringify({ blocks }),
      },
      create: {
        id: "product-page",
        name: "Product Detail Page",
        configJson: JSON.stringify({ blocks }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product page layout updated successfully",
      updatedAt: updated.updatedAt,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
