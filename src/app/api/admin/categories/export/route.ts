import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: { select: { name: true, slug: true } },
        _count: { select: { products: true, children: true } },
      },
      orderBy: [{ level: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    });

    const headers = [
      "ID",
      "Name",
      "Slug",
      "FullPath",
      "Parent Name",
      "Parent Slug",
      "Level",
      "Sort Order",
      "Status",
      "Product Count",
      "Child Count",
      "Created At",
    ];

    const rows = categories.map((c) => [
      `"${c.id}"`,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.slug}"`,
      `"${c.fullPath}"`,
      `"${(c.parent?.name || "").replace(/"/g, '""')}"`,
      `"${c.parent?.slug || ""}"`,
      c.level,
      c.sortOrder,
      `"${c.status}"`,
      c._count.products,
      c._count.children,
      `"${c.createdAt.toISOString()}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="fancyhub_categories_${Date.now()}.csv"`,
      },
    });
  } catch (error: any) {
    console.error("GET /api/admin/categories/export error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
