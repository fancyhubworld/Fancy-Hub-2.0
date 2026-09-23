import { NextResponse } from "next/server";
import {
  validateUploadFile,
  generatePresignedUploadUrl,
  getCloudStorageConfig,
} from "@/lib/cloud-storage-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { filename, mimeType, fileSize, folder = "banners" } = body;

    // Validate file properties
    const validation = validateUploadFile({
      filename,
      mimeType,
      fileSize: fileSize || 1024,
    });

    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const presignedData = generatePresignedUploadUrl({
      filename,
      mimeType,
      folder,
    });

    const storageConfig = getCloudStorageConfig();

    return NextResponse.json({
      success: true,
      storageProvider: storageConfig.provider,
      bucket: storageConfig.bucketName,
      region: storageConfig.region,
      presigned: presignedData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate presigned upload URL" },
      { status: 500 }
    );
  }
}
