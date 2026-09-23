import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  slugifyCategory,
  computeFullPath,
  computeLevel,
  invalidateCategoryCache,
} from "@/lib/categories";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { csvData } = body; // CSV string

    if (!csvData || typeof csvData !== "string") {
      return NextResponse.json({ success: false, error: "csvData string is required" }, { status: 400 });
    }

    const lines = csvData.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length <= 1) {
      return NextResponse.json({ success: false, error: "CSV contains no data rows" }, { status: 400 });
    }

    const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const nameIdx = header.indexOf("name");
    const slugIdx = header.indexOf("slug");
    const parentSlugIdx = header.indexOf("parentslug");
    const descIdx = header.indexOf("description");
    const sortIdx = header.indexOf("sortorder");

    if (nameIdx === -1) {
      return NextResponse.json({ success: false, error: "CSV header must contain 'name' column" }, { status: 400 });
    }

    let createdCount = 0;
    let updatedCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(",").map((c) => c.trim());
      const name = row[nameIdx];
      if (!name) continue;

      const slug = slugIdx !== -1 && row[slugIdx] ? slugifyCategory(row[slugIdx]) : slugifyCategory(name);
      const parentSlug = parentSlugIdx !== -1 && row[parentSlugIdx] ? row[parentSlugIdx] : null;
      const description = descIdx !== -1 && row[descIdx] ? row[descIdx] : null;
      const sortOrder = sortIdx !== -1 && row[sortIdx] ? parseInt(row[sortIdx], 10) || 0 : 0;

      let parentId: string | null = null;
      if (parentSlug) {
        const parentCat = await prisma.category.findFirst({
          where: { slug: parentSlug, status: "ACTIVE" },
        });
        if (parentCat) parentId = parentCat.id;
      }

      const allCats = await prisma.category.findMany({
        select: { id: true, slug: true, fullPath: true, parentId: true },
      });
      const categoryMap = new Map(allCats.map((c) => [c.id, c]));
      const computedPath = computeFullPath(slug, parentId, categoryMap);
      const computedLevel = computeLevel(parentId, categoryMap);

      const existing = await prisma.category.findUnique({
        where: { fullPath: computedPath },
      });

      if (existing) {
        await prisma.category.update({
          where: { id: existing.id },
          data: {
            name,
            description: description || existing.description,
            sortOrder,
          },
        });
        updatedCount++;
      } else {
        await prisma.category.create({
          data: {
            name,
            slug,
            fullPath: computedPath,
            parentId,
            level: computedLevel,
            description,
            sortOrder,
            status: "ACTIVE",
            isActive: true,
            showInHeader: true,
            showOnHomepage: true,
            showInMobile: true,
          },
        });
        createdCount++;
      }
    }

    invalidateCategoryCache();

    return NextResponse.json({
      success: true,
      message: `CSV Imported successfully: ${createdCount} created, ${updatedCount} updated.`,
      createdCount,
      updatedCount,
    });
  } catch (error: any) {
    console.error("POST /api/admin/categories/import error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
