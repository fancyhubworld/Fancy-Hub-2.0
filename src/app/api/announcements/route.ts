import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    const announcements = await prisma.announcementBar.findMany({
      where: {
        isActive: true,
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: now }, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: null },
          { startDate: null, endDate: { gte: now } },
        ],
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: announcements,
      activeAnnouncement: announcements[0] || null,
    });
  } catch (error: any) {
    console.error("GET /api/announcements error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, badge, link, bgColor = "#1455D9", textColor = "#FFFFFF", isActive = true, isDismissible = true, sortOrder = 0, startDate, endDate } = body;

    if (!text) {
      return NextResponse.json({ success: false, error: "Announcement text is required" }, { status: 400 });
    }

    const created = await prisma.announcementBar.create({
      data: {
        text,
        badge: badge || null,
        link: link || null,
        bgColor,
        textColor,
        isActive,
        isDismissible,
        sortOrder,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Announcement created successfully!",
      data: created,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
