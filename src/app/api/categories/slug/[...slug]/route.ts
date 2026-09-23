import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { buildCategoryBreadcrumbs, getDescendantCategoryIds } from "@/lib/categories";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] | string } }
) {
  try {
    const slugParts = Array.isArray(params.slug) ? params.slug : [params.slug];
    const fullPath = slugParts.join("/");

    // 1. Check for Active Category by exact fullPath
    let category = await prisma.category.findUnique({
      where: { fullPath },
      include: {
        children: {
          where: { status: "ACTIVE" },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          include: {
            _count: { select: { products: true } },
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    // 2. Check for 301/308 Redirect in CategoryRedirect table if not found
    if (!category) {
      const redirectRecord = await prisma.categoryRedirect.findUnique({
        where: { sourcePath: fullPath },
      });

      if (redirectRecord) {
        return NextResponse.json({
          success: true,
          redirected: true,
          destinationPath: redirectRecord.destinationPath,
          destinationUrl: `/category/${redirectRecord.destinationPath}`,
        });
      }

      // Check fallback by last slug item for backwards compatibility
      const lastSlug = slugParts[slugParts.length - 1];
      const fallbackCat = await prisma.category.findFirst({
        where: { slug: lastSlug, status: "ACTIVE" },
        include: {
          children: {
            where: { status: "ACTIVE" },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            include: { _count: { select: { products: true } } },
          },
          _count: { select: { products: true } },
        },
      });

      if (fallbackCat && fallbackCat.fullPath !== fullPath) {
        return NextResponse.json({
          success: true,
          redirected: true,
          destinationPath: fallbackCat.fullPath,
          destinationUrl: `/category/${fallbackCat.fullPath}`,
        });
      }

      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    if (category.status === "ARCHIVED") {
      return NextResponse.json({ success: false, error: "Category is archived" }, { status: 404 });
    }

    // 3. Fetch all categories to build dynamic breadcrumbs & descendant IDs
    const allCats = await prisma.category.findMany({
      select: { id: true, name: true, fullPath: true, parentId: true },
    });
    const categoryMap = new Map(allCats.map((c) => [c.id, c]));
    const breadcrumbs = buildCategoryBreadcrumbs(category.id, categoryMap);
    const descendantIds = getDescendantCategoryIds(category.id, allCats);

    // 4. Fetch Products belonging to this category or its descendants
    const products = await prisma.product.findMany({
      where: {
        categoryId: { in: descendantIds },
        status: "ACTIVE",
      },
      include: {
        brand: true,
        vendor: true,
        images: true,
        variants: true,
      },
      take: 40,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...category,
        productCount: category._count.products,
        breadcrumbs,
        products,
        descendantCount: descendantIds.length,
      },
    });
  } catch (error: any) {
    console.error("GET /api/categories/slug/[...slug] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
