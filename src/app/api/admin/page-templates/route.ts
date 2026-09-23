import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { BUILTIN_PAGE_TEMPLATES } from "@/lib/page-templates";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    // Fetch custom templates from database
    const dbTemplates = await prisma.pageTemplate.findMany({
      orderBy: { createdAt: "desc" },
    });

    const parsedDbTemplates = dbTemplates.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      type: t.type,
      description: t.description || "Custom page template",
      thumbnail: t.thumbnail || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
      isDefault: false,
      sections: JSON.parse(t.sectionsJson || "[]"),
      styling: t.stylingJson ? JSON.parse(t.stylingJson) : undefined,
      createdBy: t.createdBy,
      createdAt: t.createdAt,
    }));

    let all = [...BUILTIN_PAGE_TEMPLATES, ...parsedDbTemplates];

    if (type && type !== "ALL") {
      all = all.filter((t) => t.type === type);
    }

    return NextResponse.json({
      success: true,
      count: all.length,
      templates: all,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      count: BUILTIN_PAGE_TEMPLATES.length,
      templates: BUILTIN_PAGE_TEMPLATES,
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type = "CUSTOM", description, thumbnail, sections, styling } = body;

    if (!name || !sections || !Array.isArray(sections)) {
      return NextResponse.json({ success: false, error: "Missing required template fields" }, { status: 400 });
    }

    const slug = `tpl-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

    const created = await prisma.pageTemplate.create({
      data: {
        name,
        slug,
        type,
        description: description || `Custom ${type} page template`,
        thumbnail: thumbnail || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
        isDefault: false,
        sectionsJson: JSON.stringify(sections),
        stylingJson: styling ? JSON.stringify(styling) : null,
        createdBy: "Admin",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Page template "${name}" created successfully!`,
      template: {
        ...created,
        sections,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
