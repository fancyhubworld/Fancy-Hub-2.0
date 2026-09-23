import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { SECTION_REGISTRY, SectionType } from "@/lib/page-builder";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pageId = searchParams.get("pageId");
    const slug = searchParams.get("slug");

    let whereClause: any = {};
    if (pageId) {
      whereClause.pageId = pageId;
    } else if (slug) {
      const page = await prisma.pageConfig.findUnique({ where: { slug } });
      if (page) whereClause.pageId = page.id;
    }

    const sections = await prisma.pageSection.findMany({
      where: whereClause,
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ success: true, sections });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const type = body.type as SectionType;
    const desc = SECTION_REGISTRY[type];

    // Find highest current sortOrder for this page
    const lastSection = await prisma.pageSection.findFirst({
      where: { pageId: body.pageId },
      orderBy: { sortOrder: "desc" },
    });
    const nextOrder = (lastSection?.sortOrder ?? 0) + 1;

    const newSection = await prisma.pageSection.create({
      data: {
        pageId: body.pageId,
        type: body.type,
        title: body.title || desc?.name || "New Section",
        subtitle: body.subtitle || desc?.description || "",
        badgeText: body.badgeText || null,
        sortOrder: nextOrder,
        isActive: body.isActive !== false,
        desktopVisible: body.desktopVisible !== false,
        mobileVisible: body.mobileVisible !== false,
        contentJson: body.contentJson || JSON.stringify(desc?.defaultContent || {}),
        stylingJson: body.stylingJson || JSON.stringify(desc?.defaultStyling || {}),
      },
    });

    return NextResponse.json({ success: true, section: newSection });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
