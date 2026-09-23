import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  slugifyCategory,
  computeFullPath,
  computeLevel,
  detectCircularDependency,
  invalidateCategoryCache,
} from "@/lib/categories";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const whereClause: any = {};
    if (status && status !== "ALL") {
      whereClause.status = status;
    }
    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { slug: { contains: search } },
        { fullPath: { contains: search } },
      ];
    }

    const categories = await prisma.category.findMany({
      where: whereClause,
      include: {
        parent: {
          select: { id: true, name: true, slug: true, fullPath: true },
        },
        children: {
          select: { id: true, name: true, slug: true, fullPath: true, status: true },
        },
        _count: {
          select: { products: true, children: true },
        },
      },
      orderBy: [{ level: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({
      success: true,
      data: categories,
      total: categories.length,
    });
  } catch (error: any) {
    console.error("GET /api/admin/categories error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug: customSlug,
      parentId,
      description,
      icon,
      image,
      bannerImage,
      mobileBanner,
      sortOrder = 0,
      status = "ACTIVE",
      isFeatured = false,
      showInHeader = true,
      showOnHomepage = true,
      showInMobile = true,
      showInFooter = true,
      showInSearch = true,
      seoTitle,
      seoDescription,
      seoKeywords,
      canonicalUrl,
      commissionRate,
      displayMode = "DEFAULT",
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Category name is required" }, { status: 400 });
    }

    // 1. Generate SEO-friendly slug if not provided
    const baseSlug = customSlug && customSlug.trim() ? slugifyCategory(customSlug) : slugifyCategory(name);

    // 2. Fetch all existing categories to compute hierarchy, level, and paths
    const allCats = await prisma.category.findMany({
      select: { id: true, slug: true, fullPath: true, parentId: true },
    });
    const categoryMap = new Map(allCats.map((c) => [c.id, c]));

    // 3. Compute fullPath and level
    const targetParentId = parentId && parentId !== "null" && parentId !== "root" ? parentId : null;
    const computedFullPath = computeFullPath(baseSlug, targetParentId, categoryMap);
    const computedLevel = computeLevel(targetParentId, categoryMap);

    // 4. Validate Path Uniqueness
    const existing = await prisma.category.findUnique({
      where: { fullPath: computedFullPath },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: `A category with the path '/${computedFullPath}' already exists. Please use a unique slug or name.`,
        },
        { status: 409 }
      );
    }

    // 5. Create category in Database
    const newCategory = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: baseSlug,
        fullPath: computedFullPath,
        parentId: targetParentId,
        level: computedLevel,
        description: description?.trim() || null,
        icon: icon || null,
        image: image || null,
        bannerImage: bannerImage || null,
        mobileBanner: mobileBanner || null,
        sortOrder: Number(sortOrder) || 0,
        status: status || "ACTIVE",
        isActive: status === "ACTIVE",
        isFeatured: Boolean(isFeatured),
        showInHeader: Boolean(showInHeader),
        showOnHomepage: Boolean(showOnHomepage),
        showInMobile: Boolean(showInMobile),
        showInFooter: Boolean(showInFooter),
        showInSearch: Boolean(showInSearch),
        seoTitle: seoTitle || `${name} Online Shopping | FancyHub.in`,
        seoDescription: seoDescription || `Shop latest ${name} collection with authentic quality on FancyHub.in`,
        seoKeywords: seoKeywords || null,
        canonicalUrl: canonicalUrl || `/category/${computedFullPath}`,
        commissionRate: commissionRate !== undefined && commissionRate !== null ? Number(commissionRate) : null,
        displayMode: displayMode || "DEFAULT",
      },
    });

    // 6. Invalidate Fast In-Memory Cache
    invalidateCategoryCache();

    return NextResponse.json({
      success: true,
      data: newCategory,
      message: `Category '${newCategory.name}' created successfully at /${newCategory.fullPath}`,
    });
  } catch (error: any) {
    console.error("POST /api/admin/categories error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
