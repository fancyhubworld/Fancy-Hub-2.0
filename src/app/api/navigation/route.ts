import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getDatabaseCategoryTree } from "@/lib/categories";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const navigations = await prisma.navigation.findMany({
      where: { isActive: true },
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
      orderBy: { name: "asc" },
    });

    const categoryTree = await getDatabaseCategoryTree();

    return NextResponse.json({
      success: true,
      data: navigations,
      categoryTree,
    });
  } catch (error: any) {
    console.error("GET /api/navigation error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, handle, location = "HEADER", isActive = true, items = [] } = body;

    if (!name || !handle) {
      return NextResponse.json({ success: false, error: "Name and handle are required" }, { status: 400 });
    }

    const navigation = await prisma.navigation.create({
      data: {
        name,
        handle,
        location,
        isActive,
        items: {
          create: items.map((item: any, idx: number) => ({
            title: item.title,
            url: item.url,
            target: item.target || "_self",
            sortOrder: item.sortOrder ?? idx,
            icon: item.icon || null,
            badge: item.badge || null,
            isMegaMenu: item.isMegaMenu ?? false,
            megaMenuJson: item.megaMenuJson ? JSON.stringify(item.megaMenuJson) : null,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({
      success: true,
      message: `Navigation '${navigation.name}' created successfully!`,
      data: navigation,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
