import crypto from "crypto";

export type CloudStorageProvider = "AWS_S3" | "CLOUDFLARE_R2" | "GOOGLE_CLOUD_STORAGE" | "LOCAL";

export interface StorageConfig {
  provider: CloudStorageProvider;
  bucketName: string;
  region: string;
  cdnBaseUrl: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  endpoint?: string;
}

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
  "image/gif",
];

export const ALLOWED_FILE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg", ".gif"];

/**
 * Resolves current Cloud Storage configuration from environment variables
 */
export function getCloudStorageConfig(): StorageConfig {
  const cdnBaseUrl = process.env.NEXT_PUBLIC_CDN_URL || "https://cdn.fancyhub.in";
  const s3Bucket = process.env.AWS_S3_BUCKET;
  const r2Bucket = process.env.R2_BUCKET_NAME;
  const gcsBucket = process.env.GCS_BUCKET_NAME;

  if (r2Bucket) {
    return {
      provider: "CLOUDFLARE_R2",
      bucketName: r2Bucket,
      region: "auto",
      cdnBaseUrl,
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      endpoint: process.env.R2_ENDPOINT,
    };
  }

  if (s3Bucket) {
    return {
      provider: "AWS_S3",
      bucketName: s3Bucket,
      region: process.env.AWS_REGION || "ap-south-1",
      cdnBaseUrl,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };
  }

  if (gcsBucket) {
    return {
      provider: "GOOGLE_CLOUD_STORAGE",
      bucketName: gcsBucket,
      region: "asia-south1",
      cdnBaseUrl,
    };
  }

  return {
    provider: "LOCAL",
    bucketName: "local-media-uploads",
    region: "local",
    cdnBaseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  };
}

/**
 * Validates file upload parameters before generating presigned URLs or writing to storage
 */
export function validateUploadFile(params: {
  filename: string;
  mimeType: string;
  fileSize: number; // in bytes
  maxSizeBytes?: number;
}): { isValid: boolean; error?: string } {
  const { filename, mimeType, fileSize, maxSizeBytes = 10 * 1024 * 1024 } = params;

  if (!filename || filename.trim().length === 0) {
    return { isValid: false, error: "Filename is required" };
  }

  const ext = "." + filename.split(".").pop()?.toLowerCase();
  if (!ALLOWED_FILE_EXTENSIONS.includes(ext)) {
    return {
      isValid: false,
      error: `File extension '${ext}' is not allowed. Supported formats: JPEG, PNG, WebP, AVIF, SVG, GIF.`,
    };
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.includes(mimeType)) {
    return {
      isValid: false,
      error: `MIME type '${mimeType}' is not an allowed image format.`,
    };
  }

  if (fileSize > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size (${Math.round(fileSize / (1024 * 1024))}MB) exceeds the maximum allowed limit of ${Math.round(maxSizeBytes / (1024 * 1024))}MB.`,
    };
  }

  return { isValid: true };
}

/**
 * Generates secure CDN public URL for an asset key
 */
export function resolveCdnUrl(key: string, folder: string = "general"): string {
  const config = getCloudStorageConfig();
  const cleanKey = key.replace(/^\/+/, "");
  return `${config.cdnBaseUrl.replace(/\/+$/, "")}/${folder}/${cleanKey}`;
}

export interface PresignedUrlResult {
  uploadUrl: string;
  fileKey: string;
  publicCdnUrl: string;
  expiresInSeconds: number;
  headers: Record<string, string>;
  responsiveUrls: {
    thumbnail: string;
    medium: string;
    large: string;
    webp: string;
  };
}

/**
 * Generates secure time-limited Presigned Upload URL for direct browser-to-cloud uploads
 */
export function generatePresignedUploadUrl(params: {
  filename: string;
  mimeType: string;
  folder?: string;
  expiresInSeconds?: number;
}): PresignedUrlResult {
  const { filename, mimeType, folder = "banners", expiresInSeconds = 300 } = params;
  const config = getCloudStorageConfig();

  const timestamp = Date.now();
  const randomSuffix = crypto.randomBytes(4).toString("hex");
  const cleanFilename = filename.toLowerCase().replace(/[^a-z0-9.]/g, "-");
  const fileKey = `${folder}/${timestamp}-${randomSuffix}-${cleanFilename}`;

  // Generate simulated S3/R2 presigned upload endpoint with signed auth params
  const signature = crypto
    .createHmac("sha256", config.secretAccessKey || "mock_media_secret_key_2026")
    .update(`${fileKey}|${mimeType}|${timestamp}`)
    .digest("hex");

  const uploadEndpoint =
    config.provider === "AWS_S3"
      ? `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${fileKey}`
      : config.provider === "CLOUDFLARE_R2"
      ? `https://${config.bucketName}.r2.cloudflarestorage.com/${fileKey}`
      : `/api/admin/media/upload?key=${encodeURIComponent(fileKey)}`;

  const uploadUrl = `${uploadEndpoint}?X-Amz-Signature=${signature}&X-Amz-Expires=${expiresInSeconds}`;
  const publicCdnUrl = resolveCdnUrl(cleanFilename, folder);

  return {
    uploadUrl,
    fileKey,
    publicCdnUrl,
    expiresInSeconds,
    headers: {
      "Content-Type": mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
    responsiveUrls: {
      thumbnail: `${publicCdnUrl}?w=300&q=80`,
      medium: `${publicCdnUrl}?w=800&q=80`,
      large: `${publicCdnUrl}?w=1400&q=85`,
      webp: `${publicCdnUrl}?fm=webp&q=80`,
    },
  };
}
