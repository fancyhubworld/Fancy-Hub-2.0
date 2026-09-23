import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const page = await prisma.pageConfig.findUnique({
      where: { id: params.id },
      include: {
        sections: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!page) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await prisma.pageConfig.update({
      where: { id: params.id },
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        seoKeywords: body.seoKeywords,
        isHomepage: body.isHomepage,
        status: body.status,
        layoutType: body.layoutType,
        headerStyle: body.headerStyle,
        footerStyle: body.footerStyle,
      },
    });

    return NextResponse.json({ success: true, page: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const page = await prisma.pageConfig.findUnique({ where: { id: params.id } });
    if (page?.isHomepage) {
      return NextResponse.json({ success: false, error: "Cannot delete default homepage" }, { status: 400 });
    }

    await prisma.pageConfig.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Page deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
