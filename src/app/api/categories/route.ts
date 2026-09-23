import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const homepage = searchParams.get("homepage");
    const header = searchParams.get("header");
    const mobile = searchParams.get("mobile");
    const parentId = searchParams.get("parentId");
    const level = searchParams.get("level");

    const whereClause: any = {
      status: "ACTIVE",
    };

    if (featured === "true") whereClause.isFeatured = true;
    if (homepage === "true") whereClause.showOnHomepage = true;
    if (header === "true") whereClause.showInHeader = true;
    if (mobile === "true") whereClause.showInMobile = true;
    if (level !== null && level !== undefined) whereClause.level = parseInt(level, 10);
    if (parentId !== null) {
      whereClause.parentId = parentId === "root" || parentId === "null" ? null : parentId;
    }

    const categories = await prisma.category.findMany({
      where: whereClause,
      include: {
        _count: {
          select: { products: true, children: true },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    const sanitized = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      fullPath: cat.fullPath,
      description: cat.description,
      icon: cat.icon,
      image: cat.image,
      bannerImage: cat.bannerImage,
      mobileBanner: cat.mobileBanner,
      parentId: cat.parentId,
      level: cat.level,
      sortOrder: cat.sortOrder,
      isFeatured: cat.isFeatured,
      showInHeader: cat.showInHeader,
      showOnHomepage: cat.showOnHomepage,
      showInMobile: cat.showInMobile,
      seoTitle: cat.seoTitle,
      seoDescription: cat.seoDescription,
      productCount: cat._count.products,
      childCount: cat._count.children,
    }));

    return NextResponse.json({
      success: true,
      data: sanitized,
      count: sanitized.length,
    });
  } catch (error: any) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
