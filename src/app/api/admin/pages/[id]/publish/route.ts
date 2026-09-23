import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      seoTitle,
      seoDescription,
      seoKeywords,
      layoutType,
      headerStyle,
      footerStyle,
      sections,
      isDraft,
      scheduledAt,
      versionLabel,
    } = body;

    // If saving draft only:
    if (isDraft) {
      const updatedPage = await prisma.pageConfig.update({
        where: { id: params.id },
        data: {
          draftJson: JSON.stringify({
            title,
            description,
            seoTitle,
            seoDescription,
            seoKeywords,
            layoutType,
            headerStyle,
            footerStyle,
            sections,
          }),
          status: "DRAFT",
          scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        },
      });
      return NextResponse.json({ success: true, message: "Draft saved successfully", page: updatedPage });
    }

    // Atomic Publish Transaction:
    // 1. Update PageConfig
    // 2. Delete old sections and recreate new sections in updated order
    // 3. Create version milestone snapshot
    const result = await prisma.$transaction(async (tx) => {
      const page = await tx.pageConfig.update({
        where: { id: params.id },
        data: {
          title: title !== undefined ? title : undefined,
          description: description !== undefined ? description : undefined,
          seoTitle: seoTitle !== undefined ? seoTitle : undefined,
          seoDescription: seoDescription !== undefined ? seoDescription : undefined,
          seoKeywords: seoKeywords !== undefined ? seoKeywords : undefined,
          layoutType: layoutType !== undefined ? layoutType : undefined,
          headerStyle: headerStyle !== undefined ? headerStyle : undefined,
          footerStyle: footerStyle !== undefined ? footerStyle : undefined,
          status: scheduledAt ? "SCHEDULED" : "PUBLISHED",
          scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
          draftJson: null,
        },
      });

      if (Array.isArray(sections)) {
        // Remove existing sections
        await tx.pageSection.deleteMany({
          where: { pageId: params.id },
        });

        // Insert new sections
        for (let i = 0; i < sections.length; i++) {
          const s = sections[i];
          await tx.pageSection.create({
            data: {
              pageId: params.id,
              type: s.type,
              title: s.title || null,
              subtitle: s.subtitle || null,
              badgeText: s.badgeText || null,
              sortOrder: i,
              isActive: s.isActive !== undefined ? s.isActive : true,
              desktopVisible: s.desktopVisible !== undefined ? s.desktopVisible : true,
              mobileVisible: s.mobileVisible !== undefined ? s.mobileVisible : true,
              contentJson: typeof s.contentJson === "string" ? s.contentJson : JSON.stringify(s.contentJson || {}),
              stylingJson: typeof s.stylingJson === "string" ? s.stylingJson : JSON.stringify(s.stylingJson || {}),
            },
          });
        }
      }

      // Create version snapshot
      const lastVersion = await tx.pageVersion.findFirst({
        where: { pageId: params.id },
        orderBy: { versionNumber: "desc" },
      });
      const versionNumber = (lastVersion?.versionNumber || 0) + 1;

      await tx.pageVersion.create({
        data: {
          pageId: params.id,
          versionNumber,
          label: versionLabel || (scheduledAt ? `Scheduled v${versionNumber}` : `Published v${versionNumber}`),
          note: scheduledAt ? `Scheduled for launch at ${new Date(scheduledAt).toLocaleString()}` : "Live published via Visual Builder",
          snapshotJson: JSON.stringify({ page, sections }),
          createdBy: "Administrator",
        },
      });

      return page;
    });

    return NextResponse.json({ success: true, message: "Page published live successfully", page: result });
  } catch (error: any) {
    console.error("Publish error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
