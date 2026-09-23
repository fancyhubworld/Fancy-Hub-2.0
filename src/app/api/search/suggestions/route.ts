import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();

    if (q.length < 2) {
      return NextResponse.json({
        success: true,
        query: q,
        suggestions: {
          products: [],
          categories: [],
          brands: [],
          tags: [],
          popularSearches: ["Sarees", "Kurtas", "Smartphones", "Handmade Decor", "Silk Shirts", "TWS Earbuds"],
        },
      });
    }

    const [products, categories, brands, tags] = await Promise.all([
      prisma.product.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: q } },
            { sku: { contains: q } },
            { description: { contains: q } },
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          mrp: true,
          images: { take: 1, select: { url: true } },
          category: { select: { name: true, fullPath: true } },
        },
        take: 6,
      }),
      prisma.category.findMany({
        where: {
          status: "ACTIVE",
          OR: [
            { name: { contains: q } },
            { slug: { contains: q } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          fullPath: true,
          icon: true,
          _count: { select: { products: true } },
        },
        take: 4,
      }),
      prisma.brand.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { slug: { contains: q } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
        },
        take: 3,
      }),
      prisma.tag.findMany({
        where: {
          status: "ACTIVE",
          OR: [
            { name: { contains: q } },
            { slug: { contains: q } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
        take: 3,
      }),
    ]);

    return NextResponse.json({
      success: true,
      query: q,
      suggestions: {
        products: products.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          price: p.price,
          mrp: p.mrp,
          url: `/product/${p.slug}`,
          image: p.images[0]?.url || null,
          categoryName: p.category?.name || null,
        })),
        categories: categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          fullPath: c.fullPath,
          url: `/category/${c.fullPath}`,
          productCount: c._count.products,
        })),
        brands: brands.map((b) => ({
          id: b.id,
          name: b.name,
          slug: b.slug,
          url: `/brand/${b.slug}`,
          logo: b.logo,
        })),
        tags: tags.map((t) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          url: `/tag/${t.slug}`,
        })),
      },
    });
  } catch (error: any) {
    console.error("GET /api/search/suggestions error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
