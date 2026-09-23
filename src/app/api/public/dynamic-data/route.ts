import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "products"; // 'products' | 'categories' | 'vendors'
    const limit = parseInt(searchParams.get("limit") || "8", 10);
    const sourceType = searchParams.get("sourceType") || searchParams.get("filter") || "latest";
    const categorySlug = searchParams.get("categorySlug") || searchParams.get("category");
    const categoryId = searchParams.get("categoryId");
    const vendorSlug = searchParams.get("vendorSlug") || searchParams.get("vendor");
    const vendorId = searchParams.get("vendorId");
    const query = searchParams.get("query") || searchParams.get("search");
    const manualIds = searchParams.get("manualIds")?.split(",").filter(Boolean) || [];
    const parentId = searchParams.get("parentId");
    const sortBy = searchParams.get("sortBy") || "newest";

    // 1. PRODUCTS DYNAMIC QUERY
    if (type === "products") {
      const whereClause: any = {
        status: { in: ["ACTIVE", "PUBLISHED"] },
      };

      if (categorySlug) {
        whereClause.category = { slug: categorySlug };
      } else if (categoryId) {
        whereClause.categoryId = categoryId;
      }

      if (vendorSlug) {
        whereClause.vendor = { slug: vendorSlug };
      } else if (vendorId) {
        whereClause.vendorId = vendorId;
      }

      if (query) {
        whereClause.OR = [
          { title: { contains: query } },
          { description: { contains: query } },
        ];
      }

      if (sourceType === "discounted" || sourceType === "flash_deals" || sourceType === "deals") {
        whereClause.OR = [
          { discountPercent: { gt: 0 } },
          { isFlashDeal: true },
        ];
      }

      if (sourceType === "featured" || sourceType === "trending") {
        whereClause.isFeatured = true;
      }

      if (sourceType === "manual" && manualIds.length > 0) {
        whereClause.id = { in: manualIds };
      }

      // Ordering
      let orderBy: any = [{ createdAt: "desc" }];
      if (sourceType === "best_selling" || sortBy === "rating") {
        orderBy = [{ ratings: "desc" }, { reviewCount: "desc" }];
      } else if (sortBy === "price_asc") {
        orderBy = [{ price: "asc" }];
      } else if (sortBy === "price_desc") {
        orderBy = [{ price: "desc" }];
      } else if (sourceType === "trending") {
        orderBy = [{ reviewCount: "desc" }, { createdAt: "desc" }];
      }

      const products = await prisma.product.findMany({
        where: whereClause,
        include: {
          images: true,
          category: { select: { id: true, name: true, slug: true } },
          vendor: { select: { id: true, storeName: true, slug: true, isVerified: true } },
        },
        orderBy,
        take: limit,
      });

      // Format clean response
      const sanitized = products.map((p) => {
        const primaryImage = p.images?.find((img) => img.isPrimary)?.url || p.images?.[0]?.url || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80";
        const discount = p.discountPercent || (p.mrp && p.mrp > p.price
          ? Math.round(((p.mrp - p.price) / p.mrp) * 100)
          : 0);

        return {
          id: p.id,
          name: p.title,
          slug: p.slug,
          price: p.price,
          originalPrice: p.mrp || p.price,
          discount,
          rating: p.ratings || 4.8,
          reviewCount: p.reviewCount || 120,
          image: primaryImage,
          categoryName: p.category?.name || "General",
          categorySlug: p.category?.slug || "general",
          vendorName: p.vendor?.storeName || "FancyHub Artisan",
          vendorSlug: p.vendor?.slug || "artisan",
          isVerified: p.vendor?.isVerified ?? true,
          badge: discount >= 40 ? "MEGA SAVER" : p.isFeatured ? "FEATURED" : undefined,
        };
      });

      return NextResponse.json({
        success: true,
        type: "products",
        sourceType,
        count: sanitized.length,
        data: sanitized,
      });
    }

    // 2. CATEGORIES DYNAMIC QUERY (Single source of truth from DB)
    if (type === "categories") {
      const whereClause: any = {
        status: "ACTIVE",
      };

      if (parentId === "root") {
        whereClause.parentId = null;
      } else if (parentId) {
        whereClause.parentId = parentId;
      }

      if (sourceType === "featured") {
        whereClause.isFeatured = true;
      } else if (sourceType === "homepage") {
        whereClause.showOnHomepage = true;
      }

      let orderBy: any = [{ sortOrder: "asc" }, { name: "asc" }];
      if (sortBy === "name_asc") orderBy = [{ name: "asc" }];
      else if (sortBy === "name_desc") orderBy = [{ name: "desc" }];

      const categories = await prisma.category.findMany({
        where: whereClause,
        include: {
          _count: {
            select: { products: true, children: true },
          },
        },
        orderBy,
        take: limit,
      });

      const sanitized = categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || "Authentic marketplace category",
        image: c.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80",
        icon: c.icon || "Sparkles",
        count: `${c._count.products} Items`,
        productCount: c._count.products,
        childCount: c._count.children,
        isFeatured: c.isFeatured,
        sortOrder: c.sortOrder,
      }));

      return NextResponse.json({
        success: true,
        type: "categories",
        count: sanitized.length,
        data: sanitized,
      });
    }

    // 3. VENDORS DYNAMIC QUERY
    if (type === "vendors") {
      const vendors = await prisma.vendor.findMany({
        where: { status: { in: ["APPROVED", "ACTIVE"] } },
        include: {
          _count: { select: { products: true } },
        },
        orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
        take: limit,
      });

      const sanitized = vendors.map((v) => ({
        id: v.id,
        name: v.storeName,
        slug: v.slug,
        city: v.city ? `${v.city}, ${v.state || "India"}` : "India",
        rating: v.rating || 4.9,
        productsCount: v._count.products,
        badge: v.isVerified ? "VERIFIED WEAVER" : "SELLER",
        avatar: v.storeLogo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        banner: v.storeBanner || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
      }));

      return NextResponse.json({
        success: true,
        type: "vendors",
        count: sanitized.length,
        data: sanitized,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid dynamic query type" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
