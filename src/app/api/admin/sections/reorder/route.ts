import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { sectionIds } = await req.json(); // Array of section IDs in new order

    if (!Array.isArray(sectionIds)) {
      return NextResponse.json({ success: false, error: "sectionIds must be an array" }, { status: 400 });
    }

    // Update each section sortOrder in a transaction
    await prisma.$transaction(
      sectionIds.map((id, index) =>
        prisma.pageSection.update({
          where: { id },
          data: { sortOrder: index + 1 },
        })
      )
    );

    return NextResponse.json({ success: true, message: "Sections reordered successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
