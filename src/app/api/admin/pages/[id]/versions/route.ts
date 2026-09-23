import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all version history milestones for a page
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const versions = await prisma.pageVersion.findMany({
      where: { pageId: params.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, versions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create a new version snapshot
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { label, note, createdBy, snapshotJson } = body;

    // Determine next version number
    const lastVersion = await prisma.pageVersion.findFirst({
      where: { pageId: params.id },
      orderBy: { versionNumber: "desc" },
    });
    const versionNumber = (lastVersion?.versionNumber || 0) + 1;

    let finalSnapshot = snapshotJson;
    if (!finalSnapshot) {
      const page = await prisma.pageConfig.findUnique({
        where: { id: params.id },
        include: { sections: { orderBy: { sortOrder: "asc" } } },
      });
      finalSnapshot = JSON.stringify(page);
    }

    const version = await prisma.pageVersion.create({
      data: {
        pageId: params.id,
        versionNumber,
        label: label || `Revision v${versionNumber}`,
        note: note || "Manual visual builder snapshot",
        snapshotJson: typeof finalSnapshot === "string" ? finalSnapshot : JSON.stringify(finalSnapshot),
        createdBy: createdBy || "Administrator",
      },
    });

    return NextResponse.json({ success: true, version });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
