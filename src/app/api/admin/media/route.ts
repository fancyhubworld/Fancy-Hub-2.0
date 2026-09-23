import { NextRequest, NextResponse } from "next/server";
import { INITIAL_MEDIA_LIBRARY, MediaAsset, validateImageAltText } from "@/lib/media-library-engine";

let mediaStore: MediaAsset[] = [...INITIAL_MEDIA_LIBRARY];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase();
    const folder = searchParams.get("folder");

    let result = [...mediaStore];

    if (folder && folder !== "ALL") {
      result = result.filter((m) => m.folder.toLowerCase() === folder.toLowerCase());
    }

    if (search) {
      result = result.filter(
        (m) =>
          m.filename.toLowerCase().includes(search) ||
          m.title.toLowerCase().includes(search) ||
          m.altText.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      assets: result,
      total: result.length,
      folders: ["ALL", "Banners", "Products", "Artisans", "Logos", "Campaigns"],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const altValidation = validateImageAltText(body);

    const newAsset: MediaAsset = {
      id: `media_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      filename: body.filename || `upload_${Date.now()}.jpg`,
      url: body.url || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=80",
      fileSize: body.fileSize || 120000,
      mimeType: body.mimeType || "image/jpeg",
      dimensions: body.dimensions || { width: 1200, height: 800 },
      folder: body.folder || "Banners",
      altText: body.altText || "",
      title: body.title || body.filename || "Uploaded Image Asset",
      caption: body.caption || "",
      responsiveUrls: {
        thumbnail: body.url ? `${body.url}&w=300` : "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&q=80",
        medium: body.url ? `${body.url}&w=800` : "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
        large: body.url || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=80",
        webp: body.url ? `${body.url}&fm=webp` : "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&fm=webp&q=80",
      },
      createdAt: new Date().toISOString(),
    };

    mediaStore = [newAsset, ...mediaStore];

    return NextResponse.json({
      success: true,
      asset: newAsset,
      altWarning: !altValidation.isValid ? altValidation.warning : undefined,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Asset ID required" }, { status: 400 });
    }

    const index = mediaStore.findIndex((m) => m.id === body.id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Media asset not found" }, { status: 404 });
    }

    mediaStore[index] = {
      ...mediaStore[index],
      title: body.title !== undefined ? body.title : mediaStore[index].title,
      altText: body.altText !== undefined ? body.altText : mediaStore[index].altText,
      caption: body.caption !== undefined ? body.caption : mediaStore[index].caption,
      folder: body.folder !== undefined ? body.folder : mediaStore[index].folder,
    };

    return NextResponse.json({ success: true, asset: mediaStore[index] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Asset ID required" }, { status: 400 });
    }

    mediaStore = mediaStore.filter((m) => m.id !== id);
    return NextResponse.json({ success: true, message: "Asset deleted from library" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
