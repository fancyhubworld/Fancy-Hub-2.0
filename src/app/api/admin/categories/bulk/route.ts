import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { invalidateCategoryCache } from "@/lib/categories";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, categoryIds } = body;

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "categoryIds array is required" },
        { status: 400 }
      );
    }

    if (action === "ACTIVATE") {
      await prisma.category.updateMany({
        where: { id: { in: categoryIds } },
        data: {
          status: "ACTIVE",
          isActive: true,
          showInHeader: true,
          showOnHomepage: true,
          showInMobile: true,
        },
      });
      invalidateCategoryCache();
      return NextResponse.json({
        success: true,
        message: `Successfully activated ${categoryIds.length} categories`,
      });
    }

    if (action === "DEACTIVATE") {
      await prisma.category.updateMany({
        where: { id: { in: categoryIds } },
        data: {
          status: "INACTIVE",
          isActive: false,
          showInHeader: false,
          showOnHomepage: false,
          showInMobile: false,
        },
      });
      invalidateCategoryCache();
      return NextResponse.json({
        success: true,
        message: `Successfully deactivated ${categoryIds.length} categories`,
      });
    }

    if (action === "DELETE" || action === "ARCHIVE") {
      // 1. Fetch count of products and children for all target categories
      const categories = await prisma.category.findMany({
        where: { id: { in: categoryIds } },
        include: {
          _count: {
            select: { products: true, children: true },
          },
        },
      });

      const unsafeCategories = categories.filter(
        (c) => c._count.products > 0 || c._count.children > 0
      );

      if (unsafeCategories.length > 0 && body.force !== true) {
        return NextResponse.json(
          {
            success: false,
            error: `Cannot delete: ${unsafeCategories.length} categories contain active products or subcategories. Reassign products or use force archive.`,
            unsafeCategories: unsafeCategories.map((c) => ({
              id: c.id,
              name: c.name,
              productCount: c._count.products,
              childCount: c._count.children,
            })),
          },
          { status: 400 }
        );
      }

      // Safe Soft-Delete / Archive
      await prisma.category.updateMany({
        where: { id: { in: categoryIds } },
        data: {
          status: "ARCHIVED",
          isActive: false,
          showInHeader: false,
          showOnHomepage: false,
          showInMobile: false,
        },
      });

      invalidateCategoryCache();
      return NextResponse.json({
        success: true,
        message: `Successfully archived ${categoryIds.length} categories`,
      });
    }

    return NextResponse.json(
      { success: false, error: `Invalid bulk action: ${action}` },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("POST /api/admin/categories/bulk error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Bulk operation failed" },
      { status: 500 }
    );
  }
}
