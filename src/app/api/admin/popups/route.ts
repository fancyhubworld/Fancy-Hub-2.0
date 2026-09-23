import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const popups = await prisma.marketingPopup.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, popups });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const created = await prisma.marketingPopup.create({
      data: {
        title: body.title,
        description: body.description,
        badgeText: body.badgeText,
        imageUrl: body.imageUrl,
        buttonText: body.buttonText || "CLAIM OFFER",
        buttonLink: body.buttonLink || "/register",
        couponCode: body.couponCode,
        triggerType: body.triggerType || "DELAY",
        delaySeconds: Number(body.delaySeconds) || 5,
        scrollPercent: Number(body.scrollPercent) || 40,
        isActive: body.isActive !== false,
        maxDisplaysPerUser: Number(body.maxDisplaysPerUser) || 2,
      },
    });
    return NextResponse.json({ success: true, popup: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
