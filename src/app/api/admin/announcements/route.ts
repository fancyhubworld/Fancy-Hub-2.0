import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const bars = await prisma.announcementBar.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, announcements: bars });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const created = await prisma.announcementBar.create({
      data: {
        text: body.text,
        badge: body.badge,
        link: body.link,
        bgColor: body.bgColor || "#1455D9",
        textColor: body.textColor || "#FFFFFF",
        isActive: body.isActive !== false,
        isDismissible: body.isDismissible !== false,
        sortOrder: body.sortOrder || 0,
      },
    });
    return NextResponse.json({ success: true, announcement: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
