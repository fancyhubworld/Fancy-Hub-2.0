import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const section = await prisma.pageSection.findUnique({
      where: { id: params.id },
    });

    if (!section) {
      return NextResponse.json({ success: false, error: "Section not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, section });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await prisma.pageSection.update({
      where: { id: params.id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        badgeText: body.badgeText,
        isActive: body.isActive,
        desktopVisible: body.desktopVisible,
        mobileVisible: body.mobileVisible,
        sortOrder: body.sortOrder,
        contentJson: typeof body.contentJson === "object" ? JSON.stringify(body.contentJson) : body.contentJson,
        stylingJson: typeof body.stylingJson === "object" ? JSON.stringify(body.stylingJson) : body.stylingJson,
      },
    });

    return NextResponse.json({ success: true, section: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.pageSection.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Section deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
