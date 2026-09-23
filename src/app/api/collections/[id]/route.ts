import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const collection = await prisma.collection.findUnique({
      where: { id: params.id },
      include: {
        products: {
          orderBy: { sortOrder: "asc" },
          include: {
            product: {
              include: { images: true, category: true, brand: true },
            },
          },
        },
      },
    });

    if (!collection) {
      return NextResponse.json({ success: false, error: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...collection,
        rulesJson: collection.rulesJson ? JSON.parse(collection.rulesJson) : null,
      },
    });
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
    const { name, slug, description, image, type, rulesJson, status, seoTitle, seoDescription, productIds } = body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (type) updateData.type = type;
    if (rulesJson !== undefined) updateData.rulesJson = JSON.stringify(rulesJson);
    if (status) updateData.status = status;
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription;

    if (productIds && Array.isArray(productIds)) {
      // Re-link products
      await prisma.collectionProductRel.deleteMany({ where: { collectionId: params.id } });
      await prisma.collectionProductRel.createMany({
        data: productIds.map((pId: string, idx: number) => ({
          collectionId: params.id,
          productId: pId,
          sortOrder: idx,
        })),
      });
    }

    const updated = await prisma.collection.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: `Collection '${updated.name}' updated successfully!`,
      data: updated,
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
    const collection = await prisma.collection.findUnique({ where: { id: params.id } });
    if (!collection) {
      return NextResponse.json({ success: false, error: "Collection not found" }, { status: 404 });
    }

    await prisma.collection.delete({ where: { id: params.id } });

    return NextResponse.json({
      success: true,
      message: `Collection '${collection.name}' deleted successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
