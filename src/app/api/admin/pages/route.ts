import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ensureRequiredPages } from "@/lib/seed-pages";

const prisma = new PrismaClient();

export async function GET() {
  try {
    await ensureRequiredPages(prisma);

    const pages = await prisma.pageConfig.findMany({
      include: {
        sections: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: [{ isHomepage: "desc" }, { title: "asc" }],
    });
    return NextResponse.json({ success: true, pages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = (body.slug || body.title || "new-page")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newPage = await prisma.pageConfig.create({
      data: {
        title: body.title || "Untitled Page",
        slug,
        description: body.description || "",
        seoTitle: body.seoTitle || body.title,
        seoDescription: body.seoDescription || body.description,
        seoKeywords: body.seoKeywords || "",
        isHomepage: body.isHomepage || false,
        status: body.status || "PUBLISHED",
        layoutType: body.layoutType || "DEFAULT",
        headerStyle: body.headerStyle || "DEFAULT",
        footerStyle: body.footerStyle || "DEFAULT",
      },
    });

    return NextResponse.json({ success: true, page: newPage });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
