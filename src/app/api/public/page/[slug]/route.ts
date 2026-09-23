import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug || "home";
    const page = await prisma.pageConfig.findUnique({
      where: { slug },
      include: {
        sections: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!page) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
