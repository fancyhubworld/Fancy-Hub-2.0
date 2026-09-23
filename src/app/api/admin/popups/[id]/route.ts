import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await prisma.marketingPopup.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        badgeText: body.badgeText,
        imageUrl: body.imageUrl,
        buttonText: body.buttonText,
        buttonLink: body.buttonLink,
        couponCode: body.couponCode,
        triggerType: body.triggerType,
        delaySeconds: body.delaySeconds !== undefined ? Number(body.delaySeconds) : undefined,
        scrollPercent: body.scrollPercent !== undefined ? Number(body.scrollPercent) : undefined,
        isActive: body.isActive,
        maxDisplaysPerUser: body.maxDisplaysPerUser !== undefined ? Number(body.maxDisplaysPerUser) : undefined,
      },
    });
    return NextResponse.json({ success: true, popup: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.marketingPopup.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
