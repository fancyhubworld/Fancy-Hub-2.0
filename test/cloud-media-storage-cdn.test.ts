import {
  getCloudStorageConfig,
  validateUploadFile,
  resolveCdnUrl,
  generatePresignedUploadUrl,
  ALLOWED_IMAGE_MIME_TYPES,
  ALLOWED_FILE_EXTENSIONS,
} from "../src/lib/cloud-storage-engine";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

async function runCloudMediaStorageTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN 2.0 — CLOUD MEDIA STORAGE & CDN INTEGRATION SUITE");
  console.log("=======================================================================\n");

  try {
    // -----------------------------------------------------------------------
    // 1. Storage Provider Configuration & CDN Resolution
    // -----------------------------------------------------------------------
    console.log("--- 1. CLOUD STORAGE PROVIDER RESOLUTION ---");
    const config = getCloudStorageConfig();
    assert(config.provider !== undefined, `Resolved active storage provider: ${config.provider}`);
    assert(config.cdnBaseUrl.startsWith("http"), `Resolved CDN base URL: ${config.cdnBaseUrl}`);

    const resolvedUrl = resolveCdnUrl("festive-banner-2026.webp", "banners");
    assert(resolvedUrl.includes("/banners/festive-banner-2026.webp"), `Generated CDN asset URL: ${resolvedUrl}`);

    // -----------------------------------------------------------------------
    // 2. File Mime & Extension Validation (Security)
    // -----------------------------------------------------------------------
    console.log("\n--- 2. FILE MIME & EXTENSION VALIDATION ---");
    const validJpg = validateUploadFile({ filename: "saree-photo.jpg", mimeType: "image/jpeg", fileSize: 500000 });
    assert(validJpg.isValid === true, "Valid JPEG image allowed");

    const validWebp = validateUploadFile({ filename: "banner.webp", mimeType: "image/webp", fileSize: 800000 });
    assert(validWebp.isValid === true, "Valid WebP image allowed");

    const validSvg = validateUploadFile({ filename: "logo.svg", mimeType: "image/svg+xml", fileSize: 20000 });
    assert(validSvg.isValid === true, "Valid SVG vector allowed");

    const invalidExe = validateUploadFile({ filename: "malware.exe", mimeType: "application/x-msdownload", fileSize: 50000 });
    assert(invalidExe.isValid === false, "Dangerous executable (.exe) rejected");

    const invalidPhp = validateUploadFile({ filename: "exploit.php", mimeType: "text/php", fileSize: 1000 });
    assert(invalidPhp.isValid === false, "Malicious PHP script rejected");

    const oversized = validateUploadFile({ filename: "huge-image.png", mimeType: "image/png", fileSize: 25 * 1024 * 1024, maxSizeBytes: 10 * 1024 * 1024 });
    assert(oversized.isValid === false, "Oversized file (>10MB limit) rejected");

    // -----------------------------------------------------------------------
    // 3. Presigned Upload URL Generation
    // -----------------------------------------------------------------------
    console.log("\n--- 3. PRESIGNED UPLOAD URL GENERATION ---");
    const presigned = generatePresignedUploadUrl({
      filename: "diwali-grand-sale-hero.png",
      mimeType: "image/png",
      folder: "campaigns",
      expiresInSeconds: 600,
    });

    assert(typeof presigned.uploadUrl === "string" && presigned.uploadUrl.length > 30, "Generated signed upload URL with authentication query params");
    assert(presigned.fileKey.startsWith("campaigns/"), "File key contains designated target folder (campaigns/)");
    assert(presigned.fileKey.includes("diwali-grand-sale-hero.png"), "File key preserves clean sanitized filename");
    assert(presigned.expiresInSeconds === 600, "Presigned expiration window matches 600 seconds");
    assert(presigned.headers["Cache-Control"] !== undefined, "Headers include immutable CDN caching directive");

    // -----------------------------------------------------------------------
    // 4. Responsive Breakpoint Image Variants
    // -----------------------------------------------------------------------
    console.log("\n--- 4. RESPONSIVE BREAKPOINT IMAGE VARIANTS ---");
    assert(presigned.responsiveUrls.thumbnail.includes("w=300"), "Thumbnail variant generated (300px width)");
    assert(presigned.responsiveUrls.medium.includes("w=800"), "Medium variant generated (800px width)");
    assert(presigned.responsiveUrls.large.includes("w=1400"), "Large high-res variant generated (1400px width)");
    assert(presigned.responsiveUrls.webp.includes("fm=webp"), "WebP compressed format variant generated");

    console.log("\n=======================================================================");
    console.log(`Cloud Media Storage Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution error:", e);
    process.exit(1);
  }
}

runCloudMediaStorageTests();
