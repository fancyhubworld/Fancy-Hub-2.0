import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vendorId = params.id;
    const body = await request.json().catch(() => ({}));
    const { action = "APPROVE", commissionRate = 10.0 } = body;

    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      return NextResponse.json({ success: false, error: "Vendor not found" }, { status: 404 });
    }

    if (action === "REJECT") {
      const updated = await prisma.vendor.update({
        where: { id: vendorId },
        data: {
          status: "REJECTED",
          isVerified: false,
        },
      });
      return NextResponse.json({
        success: true,
        message: `Vendor '${vendor.storeName}' application rejected.`,
        vendor: updated,
      });
    }

    // Approve
    const updated = await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        status: "APPROVED",
        isVerified: true,
        commissionRate: Number(commissionRate),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Vendor '${vendor.storeName}' successfully APPROVED with ${commissionRate}% commission!`,
      vendor: updated,
    });
  } catch (error: any) {
    console.error("POST /api/admin/vendors/[id]/approve error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process vendor approval" },
      { status: 500 }
    );
  }
}
