import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params?.slug;
    if (!slug) {
      return NextResponse.json({ success: false, error: "Product slug is required" }, { status: 400 });
    }

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ slug: slug }, { id: slug }],
        status: "PUBLISHED",
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        category: true,
        vendor: true,
        brand: true,
        tagRels: { include: { tag: true } },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    // Calculate rating summary
    const totalReviews = product.reviews.length;
    const avgRating =
      totalReviews > 0
        ? Math.round((product.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10
        : 4.8;

    // Fetch related products in the same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        status: "PUBLISHED",
      },
      include: { images: true },
      take: 6,
    });

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        rating: avgRating,
        reviewCount: totalReviews,
      },
      relatedProducts,
    });
  } catch (error: any) {
    console.error("GET /api/products/[slug] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
