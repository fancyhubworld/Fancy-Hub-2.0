import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { DEFAULT_CATEGORY_PAGE_BLOCKS } from "@/lib/category-page-layout";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const config = await prisma.systemPageConfig.findUnique({
      where: { id: "category-page" },
    });

    if (!config) {
      return NextResponse.json({
        success: true,
        blocks: DEFAULT_CATEGORY_PAGE_BLOCKS,
      });
    }

    const parsed = JSON.parse(config.configJson);
    return NextResponse.json({
      success: true,
      blocks: parsed.blocks || DEFAULT_CATEGORY_PAGE_BLOCKS,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      blocks: DEFAULT_CATEGORY_PAGE_BLOCKS,
    });
  } finally {
    await prisma.$disconnect();
  }
}
