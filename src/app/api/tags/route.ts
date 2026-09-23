import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { slug: { contains: search } },
      ];
    }
    if (status) {
      where.status = status;
    }

    const tags = await prisma.tag.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: tags.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        description: t.description,
        status: t.status,
        productCount: t._count.products,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, status = "ACTIVE" } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Tag name is required" }, { status: 400 });
    }

    const tagSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existing = await prisma.tag.findUnique({ where: { slug: tagSlug } });
    if (existing) {
      return NextResponse.json({ success: false, error: "A tag with this slug already exists" }, { status: 409 });
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug: tagSlug,
        description: description || null,
        status,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Tag '${tag.name}' created successfully!`,
      data: tag,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
