import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { buildCategoryBreadcrumbs } from "@/lib/categories";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
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

    if (!category || category.status === "ARCHIVED") {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    const allCats = await prisma.category.findMany({
      select: { id: true, name: true, fullPath: true, parentId: true },
    });
    const categoryMap = new Map(allCats.map((c) => [c.id, c]));
    const breadcrumbs = buildCategoryBreadcrumbs(category.id, categoryMap);

    return NextResponse.json({
      success: true,
      data: {
        ...category,
        productCount: category._count.products,
        breadcrumbs,
      },
    });
  } catch (error: any) {
    console.error("GET /api/categories/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, slug, parentId, description, icon, image, sortOrder, status, isFeatured, seoTitle, seoDescription, seoKeywords } = body;

    const existing = await prisma.category.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    const updated = await prisma.category.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(parentId !== undefined && { parentId }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(image !== undefined && { image }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(status && { status }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(seoTitle !== undefined && { seoTitle }),
        ...(seoDescription !== undefined && { seoDescription }),
        ...(seoKeywords !== undefined && { seoKeywords }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Category '${updated.name}' updated successfully!`,
      category: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, sortOrder, parentId } = body;

    const updated = await prisma.category.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(parentId !== undefined && { parentId }),
      },
    });

    return NextResponse.json({
      success: true,
      category: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";
    const moveToCategoryId = searchParams.get("moveToCategoryId");

    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: { _count: { select: { products: true, children: true } } },
    });

    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    const hasDependencies = category._count.products > 0 || category._count.children > 0;

    if (hasDependencies && !force) {
      return NextResponse.json(
        {
          success: false,
          requiresConfirmation: true,
          error: `This category is currently being used by ${category._count.products} products and ${category._count.children} child categories. Move them before deletion.`,
          dependencies: {
            products: category._count.products,
            children: category._count.children,
          },
        },
        { status: 409 }
      );
    }

    if (moveToCategoryId) {
      await prisma.product.updateMany({
        where: { categoryId: params.id },
        data: { categoryId: moveToCategoryId },
      });
      await prisma.category.updateMany({
        where: { parentId: params.id },
        data: { parentId: moveToCategoryId },
      });
    }

    await prisma.category.delete({ where: { id: params.id } });

    return NextResponse.json({
      success: true,
      message: `Category '${category.name}' deleted successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
