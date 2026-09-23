import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json().catch(() => ({}));
    const { title, slug } = body;

    const sourcePage = await prisma.pageConfig.findUnique({
      where: { id: params.id },
      include: {
        sections: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!sourcePage) {
      return NextResponse.json({ success: false, error: "Source page not found" }, { status: 404 });
    }

    const uniqueSuffix = Date.now().toString().slice(-4);
    const newSlug = slug || `${sourcePage.slug}-copy-${uniqueSuffix}`;
    const newTitle = title || `${sourcePage.title} (Copy)`;

    const duplicated = await prisma.$transaction(async (tx) => {
      const newPage = await tx.pageConfig.create({
        data: {
          slug: newSlug,
          title: newTitle,
          description: sourcePage.description,
          seoTitle: sourcePage.seoTitle,
          seoDescription: sourcePage.seoDescription,
          seoKeywords: sourcePage.seoKeywords,
          isHomepage: false,
          status: "DRAFT",
          layoutType: sourcePage.layoutType,
          headerStyle: sourcePage.headerStyle,
          footerStyle: sourcePage.footerStyle,
        },
      });

      for (let i = 0; i < sourcePage.sections.length; i++) {
        const sec = sourcePage.sections[i];
        await tx.pageSection.create({
          data: {
            pageId: newPage.id,
            type: sec.type,
            title: sec.title,
            subtitle: sec.subtitle,
            badgeText: sec.badgeText,
            sortOrder: i,
            isActive: sec.isActive,
            desktopVisible: sec.desktopVisible,
            mobileVisible: sec.mobileVisible,
            contentJson: sec.contentJson,
            stylingJson: sec.stylingJson,
          },
        });
      }

      return newPage;
    });

    return NextResponse.json({ success: true, page: duplicated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
