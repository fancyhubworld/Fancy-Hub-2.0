import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tag = await prisma.tag.findUnique({
      where: { id: params.id },
      include: {
        products: {
          include: {
            product: {
              select: { id: true, title: true, slug: true, price: true, mrp: true },
            },
          },
        },
      },
    });

    if (!tag) {
      return NextResponse.json({ success: false, error: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: tag });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, slug, description, status } = body;

    const tag = await prisma.tag.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Tag '${tag.name}' updated successfully!`,
      data: tag,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tag = await prisma.tag.findUnique({ where: { id: params.id } });
    if (!tag) {
      return NextResponse.json({ success: false, error: "Tag not found" }, { status: 404 });
    }

    await prisma.tag.delete({ where: { id: params.id } });

    return NextResponse.json({
      success: true,
      message: `Tag '${tag.name}' deleted successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
