export interface PageHealthAuditReport {
  performanceScore: number; // 0 - 100
  accessibilityScore: number; // 0 - 100
  seoScore: number; // 0 - 100
  brokenLinksCount: number;
  totalWidgets: number;
  totalImages: number;
  warnings: Array<{
    category: "PERFORMANCE" | "ACCESSIBILITY" | "SEO" | "LINKS";
    severity: "HIGH" | "MEDIUM" | "LOW";
    message: string;
  }>;
}

export interface AuditInputPage {
  title?: string;
  metaDescription?: string;
  sections?: any[];
  images?: Array<{ url: string; altText?: string; sizeBytes?: number }>;
  links?: string[];
  animatedWidgetCount?: number;
}

export function auditPageHealth(page: AuditInputPage): PageHealthAuditReport {
  let perf = 100;
  let a11y = 100;
  let seo = 100;
  let brokenLinks = 0;
  const warnings: PageHealthAuditReport["warnings"] = [];

  const sectionsCount = page.sections?.length || 0;
  const images = page.images || [];
  const animatedCount = page.animatedWidgetCount || 0;

  // 1. PERFORMANCE CHECKS
  if (sectionsCount > 15) {
    perf -= 12;
    warnings.push({
      category: "PERFORMANCE",
      severity: "MEDIUM",
      message: `Page contains ${sectionsCount} sections (recommended maximum: 12-15) which may impact initial render time.`,
    });
  }

  if (animatedCount > 8) {
    perf -= 8;
    warnings.push({
      category: "PERFORMANCE",
      severity: "LOW",
      message: `Too many active CSS animations (${animatedCount}). High CPU usage on mobile devices.`,
    });
  }

  for (const img of images) {
    if (img.sizeBytes && img.sizeBytes > 500 * 1024) {
      perf -= 10;
      warnings.push({
        category: "PERFORMANCE",
        severity: "HIGH",
        message: `Huge image detected (${(img.sizeBytes / 1024).toFixed(0)} KB) at ${img.url.slice(0, 40)}... Compress or convert to WebP.`,
      });
      break;
    }
  }

  // 2. ACCESSIBILITY CHECKS
  let missingAlt = 0;
  for (const img of images) {
    if (!img.altText || img.altText.trim().length === 0) {
      missingAlt++;
    }
  }
  if (missingAlt > 0) {
    a11y -= Math.min(30, missingAlt * 10);
    warnings.push({
      category: "ACCESSIBILITY",
      severity: "HIGH",
      message: `${missingAlt} images are missing descriptive Alt Text for screen readers.`,
    });
  }

  // 3. SEO CHECKS
  if (!page.title || page.title.length < 10) {
    seo -= 25;
    warnings.push({
      category: "SEO",
      severity: "HIGH",
      message: "Page SEO Title is missing or too short (under 10 characters).",
    });
  }
  if (!page.metaDescription || page.metaDescription.length < 50) {
    seo -= 20;
    warnings.push({
      category: "SEO",
      severity: "MEDIUM",
      message: "Meta description is missing or too short for optimal Google click-through rates.",
    });
  }

  // 4. BROKEN LINKS CHECKS
  if (page.links) {
    for (const link of page.links) {
      if (link === "#" || link === "" || link.includes("404")) {
        brokenLinks++;
      }
    }
    if (brokenLinks > 0) {
      seo -= brokenLinks * 5;
      warnings.push({
        category: "LINKS",
        severity: "HIGH",
        message: `${brokenLinks} broken or placeholder link(s) detected.`,
      });
    }
  }

  return {
    performanceScore: Math.max(0, perf),
    accessibilityScore: Math.max(0, a11y),
    seoScore: Math.max(0, seo),
    brokenLinksCount: brokenLinks,
    totalWidgets: sectionsCount,
    totalImages: images.length,
    warnings,
  };
}
