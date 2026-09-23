import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  slugifyCategory,
  computeFullPath,
  computeLevel,
  detectCircularDependency,
  getDescendantCategoryIds,
  invalidateCategoryCache,
} from "@/lib/categories";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        parent: true,
        children: {
          include: { _count: { select: { products: true, children: true } } },
        },
        _count: {
          select: { products: true, children: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id;
    const body = await request.json();

    const existingCat = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCat) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    const {
      name,
      slug: customSlug,
      parentId: newParentIdRaw,
      description,
      icon,
      image,
      bannerImage,
      mobileBanner,
      sortOrder,
      status,
      isFeatured,
      showInHeader,
      showOnHomepage,
      showInMobile,
      showInFooter,
      showInSearch,
      seoTitle,
      seoDescription,
      seoKeywords,
      canonicalUrl,
      commissionRate,
      displayMode,
    } = body;

    const targetParentId =
      newParentIdRaw === undefined
        ? existingCat.parentId
        : newParentIdRaw === null || newParentIdRaw === "null" || newParentIdRaw === "root"
        ? null
        : newParentIdRaw;

    // 1. Fetch all categories to check for cycles and path computations
    const allCats = await prisma.category.findMany({
      select: { id: true, slug: true, fullPath: true, parentId: true },
    });

    // 2. Circular Hierarchy Protection
    if (targetParentId && detectCircularDependency(categoryId, targetParentId, allCats)) {
      return NextResponse.json(
        {
          success: false,
          error: "Circular hierarchy detected! A category cannot be set as a child of its own descendant.",
        },
        { status: 400 }
      );
    }

    // 3. Compute New Slug & New FullPath
    const newSlug = customSlug && customSlug.trim()
      ? slugifyCategory(customSlug)
      : name && name !== existingCat.name
      ? slugifyCategory(name)
      : existingCat.slug;

    // Temporary map with target updated parent
    const categoryMap = new Map(allCats.map((c) => [c.id, { ...c }]));
    categoryMap.set(categoryId, { id: categoryId, slug: newSlug, fullPath: existingCat.fullPath, parentId: targetParentId });

    const newFullPath = computeFullPath(newSlug, targetParentId, categoryMap);
    const newLevel = computeLevel(targetParentId, categoryMap);

    // 4. Path Collision Check (if path changed)
    if (newFullPath !== existingCat.fullPath) {
      const collision = await prisma.category.findUnique({
        where: { fullPath: newFullPath },
      });
      if (collision && collision.id !== categoryId) {
        return NextResponse.json(
          {
            success: false,
            error: `A category with the path '/${newFullPath}' already exists. Please choose a different slug or parent.`,
          },
          { status: 409 }
        );
      }
    }

    const oldFullPath = existingCat.fullPath;
    const pathChanged = newFullPath !== oldFullPath;

    // 5. Update the Category
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: name !== undefined ? name.trim() : existingCat.name,
        slug: newSlug,
        fullPath: newFullPath,
        parentId: targetParentId,
        level: newLevel,
        description: description !== undefined ? description?.trim() : existingCat.description,
        icon: icon !== undefined ? icon : existingCat.icon,
        image: image !== undefined ? image : existingCat.image,
        bannerImage: bannerImage !== undefined ? bannerImage : existingCat.bannerImage,
        mobileBanner: mobileBanner !== undefined ? mobileBanner : existingCat.mobileBanner,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : existingCat.sortOrder,
        status: status !== undefined ? status : existingCat.status,
        isActive: status ? status === "ACTIVE" : existingCat.isActive,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existingCat.isFeatured,
        showInHeader: showInHeader !== undefined ? Boolean(showInHeader) : existingCat.showInHeader,
        showOnHomepage: showOnHomepage !== undefined ? Boolean(showOnHomepage) : existingCat.showOnHomepage,
        showInMobile: showInMobile !== undefined ? Boolean(showInMobile) : existingCat.showInMobile,
        showInFooter: showInFooter !== undefined ? Boolean(showInFooter) : existingCat.showInFooter,
        showInSearch: showInSearch !== undefined ? Boolean(showInSearch) : existingCat.showInSearch,
        seoTitle: seoTitle !== undefined ? seoTitle : existingCat.seoTitle,
        seoDescription: seoDescription !== undefined ? seoDescription : existingCat.seoDescription,
        seoKeywords: seoKeywords !== undefined ? seoKeywords : existingCat.seoKeywords,
        canonicalUrl: canonicalUrl !== undefined ? canonicalUrl : `/category/${newFullPath}`,
        commissionRate: commissionRate !== undefined ? (commissionRate === null ? null : Number(commissionRate)) : existingCat.commissionRate,
        displayMode: displayMode !== undefined ? displayMode : existingCat.displayMode,
      },
    });

    // 6. If path changed, create Redirect & Cascade path updates to all descendants
    if (pathChanged) {
      // Create Redirect record for old URL -> new URL
      await prisma.categoryRedirect.upsert({
        where: { sourcePath: oldFullPath },
        update: { destinationPath: newFullPath, categoryId },
        create: {
          sourcePath: oldFullPath,
          destinationPath: newFullPath,
          categoryId,
        },
      });

      // Find all descendants and update their paths
      const descendantIds = getDescendantCategoryIds(categoryId, allCats).filter((id) => id !== categoryId);
      if (descendantIds.length > 0) {
        const refreshedAllCats = await prisma.category.findMany({
          select: { id: true, slug: true, fullPath: true, parentId: true },
        });
        const refreshedMap = new Map(refreshedAllCats.map((c) => [c.id, c]));

        for (const descId of descendantIds) {
          const descCat = refreshedMap.get(descId);
          if (descCat) {
            const descOldPath = descCat.fullPath;
            const descNewPath = computeFullPath(descCat.slug, descCat.parentId, refreshedMap);
            const descNewLevel = computeLevel(descCat.parentId, refreshedMap);

            if (descNewPath !== descOldPath) {
              await prisma.category.update({
                where: { id: descId },
                data: {
                  fullPath: descNewPath,
                  level: descNewLevel,
                },
              });

              await prisma.categoryRedirect.upsert({
                where: { sourcePath: descOldPath },
                update: { destinationPath: descNewPath, categoryId: descId },
                create: {
                  sourcePath: descOldPath,
                  destinationPath: descNewPath,
                  categoryId: descId,
                },
              });
            }
          }
        }
      }
    }

    // 7. Invalidate Category Cache
    invalidateCategoryCache();

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: `Category '${updatedCategory.name}' updated successfully`,
    });
  } catch (error: any) {
    console.error("PATCH /api/admin/categories/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id;
    const { searchParams } = new URL(request.url);
    const permanent = searchParams.get("permanent") === "true";

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: { products: true, children: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    if (permanent) {
      // Hard delete only if zero products and zero children
      if (category._count.products > 0 || category._count.children > 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Cannot permanently delete: Category contains ${category._count.products} products and ${category._count.children} child categories. Use archive instead.`,
          },
          { status: 400 }
        );
      }
      await prisma.category.delete({ where: { id: categoryId } });
    } else {
      // Soft Delete / Archive (Recommended for data integrity)
      await prisma.category.update({
        where: { id: categoryId },
        data: {
          status: "ARCHIVED",
          isActive: false,
          showInHeader: false,
          showOnHomepage: false,
          showInMobile: false,
        },
      });
    }

    invalidateCategoryCache();

    return NextResponse.json({
      success: true,
      message: `Category '${category.name}' archived successfully`,
    });
  } catch (error: any) {
    console.error("DELETE /api/admin/categories/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
