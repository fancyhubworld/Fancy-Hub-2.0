import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;

    const collections = await prisma.collection.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: collections.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        image: c.image,
        type: c.type,
        rulesJson: c.rulesJson ? JSON.parse(c.rulesJson) : null,
        status: c.status,
        productCount: c._count.products,
        seoTitle: c.seoTitle,
        seoDescription: c.seoDescription,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, image, type = "MANUAL", rulesJson, status = "ACTIVE", seoTitle, seoDescription, productIds = [] } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Collection name is required" }, { status: 400 });
    }

    const colSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existing = await prisma.collection.findUnique({ where: { slug: colSlug } });
    if (existing) {
      return NextResponse.json({ success: false, error: "A collection with this slug already exists" }, { status: 409 });
    }

    const collection = await prisma.collection.create({
      data: {
        name,
        slug: colSlug,
        description: description || null,
        image: image || null,
        type,
        rulesJson: rulesJson ? JSON.stringify(rulesJson) : null,
        status,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        products: {
          create: productIds.map((pId: string, index: number) => ({
            productId: pId,
            sortOrder: index,
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Collection '${collection.name}' created successfully!`,
      data: collection,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
