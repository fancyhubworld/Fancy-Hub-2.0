import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { DEFAULT_FOOTER_CONFIG, FooterBuilderConfig } from "@/lib/footer-builder-types";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const record = await prisma.systemPageConfig.findUnique({
      where: { id: "footer-builder-config" },
    });

    if (!record) {
      return NextResponse.json({
        success: true,
        footer: DEFAULT_FOOTER_CONFIG,
      });
    }

    const config: FooterBuilderConfig = JSON.parse(record.configJson);
    return NextResponse.json({
      success: true,
      footer: config,
    });
  } catch (error: any) {
    console.error("GET /api/public/footer error:", error);
    return NextResponse.json({
      success: true,
      footer: DEFAULT_FOOTER_CONFIG,
    });
  } finally {
    await prisma.$disconnect();
  }
}
