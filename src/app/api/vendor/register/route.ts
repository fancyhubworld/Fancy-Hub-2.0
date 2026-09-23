import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, generateJwtToken, AuthUserPayload } from "@/lib/auth-engine";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      ownerName,
      email,
      phone,
      password,
      storeName,
      businessName,
      businessType = "Proprietorship",
      panNumber,
      gstin,
      city,
      state,
      pincode,
      address,
      bankName,
      accountNumber,
      ifscCode,
      upiId,
    } = body;

    if (!email || !storeName || !ownerName || !city || !pincode) {
      return NextResponse.json(
        { success: false, error: "Owner name, email, store name, city, and pincode are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const storeSlug = storeName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check existing User
    let user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: ownerName.trim(),
          email: cleanEmail,
          phone: phone ? phone.trim() : null,
          passwordHash: hashPassword(password || "FancyVendor@2026"),
          role: "VENDOR",
          isActive: true,
        },
      });
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: "VENDOR" },
      });
    }

    // Create Vendor Record in PENDING status
    const vendor = await prisma.vendor.create({
      data: {
        userId: user.id,
        storeName: storeName.trim(),
        slug: storeSlug,
        businessName: businessName?.trim() || storeName.trim(),
        businessType,
        panNumber: panNumber?.trim() || null,
        gstin: gstin?.trim() || null,
        city: city.trim(),
        state: state?.trim() || "India",
        pincode: pincode.trim(),
        address: address?.trim() || city.trim(),
        bankName: bankName?.trim() || null,
        accountNumber: accountNumber?.trim() || null,
        ifscCode: ifscCode?.trim() || null,
        upiId: upiId?.trim() || null,
        status: "PENDING", // Requires Admin Approval
        isVerified: false,
        commissionRate: 10.0,
      },
    });

    const payload: AuthUserPayload = {
      userId: user.id,
      email: user.email,
      phone: user.phone,
      name: vendor.storeName,
      role: "VENDOR",
      vendorId: vendor.id,
    };

    const token = generateJwtToken(payload);

    return NextResponse.json({
      success: true,
      message: "Vendor onboarding application submitted successfully! Pending Admin KYC verification.",
      vendor: {
        id: vendor.id,
        storeName: vendor.storeName,
        slug: vendor.slug,
        status: vendor.status,
      },
      user: payload,
      token,
    });
  } catch (error: any) {
    console.error("POST /api/vendor/register error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Vendor registration failed" },
      { status: 500 }
    );
  }
}
