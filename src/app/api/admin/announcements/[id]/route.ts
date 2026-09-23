import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await prisma.announcementBar.update({
      where: { id: params.id },
      data: {
        text: body.text,
        badge: body.badge,
        link: body.link,
        bgColor: body.bgColor,
        textColor: body.textColor,
        isActive: body.isActive,
        isDismissible: body.isDismissible,
        sortOrder: body.sortOrder,
      },
    });
    return NextResponse.json({ success: true, announcement: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.announcementBar.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
