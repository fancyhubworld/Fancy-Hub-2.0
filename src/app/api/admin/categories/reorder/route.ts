import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { invalidateCategoryCache } from "@/lib/categories";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body; // Array of { id: string, sortOrder: number, parentId?: string | null }

    if (!Array.isArray(items)) {
      return NextResponse.json({ success: false, error: "Items array is required" }, { status: 400 });
    }

    for (const item of items) {
      if (item.id && typeof item.sortOrder === "number") {
        await prisma.category.update({
          where: { id: item.id },
          data: {
            sortOrder: item.sortOrder,
            ...(item.parentId !== undefined ? { parentId: item.parentId } : {}),
          },
        });
      }
    }

    invalidateCategoryCache();

    return NextResponse.json({
      success: true,
      message: "Categories reordered successfully",
    });
  } catch (error: any) {
    console.error("POST /api/admin/categories/reorder error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
