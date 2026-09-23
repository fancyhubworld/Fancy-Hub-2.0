import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all saved section templates
export async function GET() {
  try {
    const templates = await prisma.savedSectionTemplate.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, templates });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Save a section as reusable template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, type, description, contentJson, stylingJson, createdBy } = body;

    if (!name || !type) {
      return NextResponse.json({ success: false, error: "Name and type are required" }, { status: 400 });
    }

    const template = await prisma.savedSectionTemplate.create({
      data: {
        name,
        category: category || "CUSTOM",
        type,
        description: description || "Custom saved block",
        contentJson: typeof contentJson === "string" ? contentJson : JSON.stringify(contentJson || {}),
        stylingJson: typeof stylingJson === "string" ? stylingJson : JSON.stringify(stylingJson || {}),
        createdBy: createdBy || "Administrator",
      },
    });

    return NextResponse.json({ success: true, template });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
