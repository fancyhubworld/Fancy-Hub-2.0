import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { propagateReusableBlockUpdate, DEFAULT_REUSABLE_BLOCKS } from "@/lib/reusable-sections-engine";

export async function GET() {
  try {
    const templates = await prisma.savedSectionTemplate.findMany({
      orderBy: { updatedAt: "desc" },
    });

    if (templates.length === 0) {
      // Seed default reusable blocks
      for (const block of DEFAULT_REUSABLE_BLOCKS) {
        await prisma.savedSectionTemplate.upsert({
          where: { id: block.id },
          update: {},
          create: {
            id: block.id,
            name: block.name,
            category: block.category,
            type: block.type,
            description: block.description,
            contentJson: block.contentJson,
            stylingJson: block.stylingJson,
          },
        });
      }
      const seeded = await prisma.savedSectionTemplate.findMany({
        orderBy: { updatedAt: "desc" },
      });
      return NextResponse.json({ success: true, blocks: seeded });
    }

    return NextResponse.json({ success: true, blocks: templates });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category = "CUSTOM", type, description, contentJson, stylingJson, mode = "LINKED" } = body;

    const created = await prisma.savedSectionTemplate.create({
      data: {
        name,
        category,
        type,
        description,
        contentJson: typeof contentJson === "object" ? JSON.stringify(contentJson) : contentJson || "{}",
        stylingJson: typeof stylingJson === "object" ? JSON.stringify(stylingJson) : stylingJson || "{}",
      },
    });

    return NextResponse.json({ success: true, block: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, contentJson, stylingJson } = body;

    const cJson = typeof contentJson === "object" ? JSON.stringify(contentJson) : contentJson;
    const sJson = typeof stylingJson === "object" ? JSON.stringify(stylingJson) : stylingJson;

    const updated = await propagateReusableBlockUpdate(prisma, id, cJson, sJson);
    return NextResponse.json({ success: true, block: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
