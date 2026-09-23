import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getDatabaseCategoryTree } from "@/lib/categories";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { location: string } }
) {
  try {
    const loc = params.location.toUpperCase();
    const navigation = await prisma.navigation.findFirst({
      where: {
        location: loc,
        isActive: true,
      },
      include: {
        items: {
          where: { parentId: null },
          orderBy: { sortOrder: "asc" },
          include: {
            children: {
              orderBy: { sortOrder: "asc" },
            },
          },
        },
      },
    });

    const categoryTree = await getDatabaseCategoryTree();

    return NextResponse.json({
      success: true,
      location: loc,
      data: navigation || null,
      categoryTree,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
