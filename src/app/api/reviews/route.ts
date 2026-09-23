import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, rating, comment, title, userName, userEmail, isVerifiedPurchase } = body;

    if (!productId || !rating) {
      return NextResponse.json({ success: false, error: "Product ID and rating (1-5) are required" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: "Rating must be between 1 and 5 stars" }, { status: 400 });
    }

    // Resolve user ID
    let user = await prisma.user.findFirst({
      where: userEmail ? { email: userEmail } : undefined,
    });
    if (!user) {
      user = await prisma.user.findFirst() || await prisma.user.create({
        data: {
          email: userEmail || `reviewer-${Date.now()}@fancyhub.in`,
          name: userName || "Customer",
          role: "CUSTOMER",
          passwordHash: "REVIEWER_PASSWORD_HASH_2026",
        },
      });
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        productId,
        rating: Number(rating),
        title: title || "Verified Purchase",
        comment: comment || "",
        isVerifiedPurchase: Boolean(isVerifiedPurchase),
        isApproved: true,
      },
    });

    return NextResponse.json({
      success: true,
      review,
      message: "Review submitted successfully!",
    });
  } catch (error: any) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    const where: any = { isApproved: true };
    if (productId) where.productId = productId;

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, count: reviews.length, reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
