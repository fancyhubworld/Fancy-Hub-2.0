export interface PageAuditIssue {
  id: string;
  category: "PERFORMANCE" | "ACCESSIBILITY" | "SEO" | "LINKS";
  severity: "critical" | "warning" | "info";
  title: string;
  message: string;
  recommendation: string;
}

export interface PageAuditReport {
  overallScore: number;
  performanceScore: number;
  accessibilityScore: number;
  seoScore: number;
  linksScore: number;
  issues: PageAuditIssue[];
  metrics: {
    totalSections: number;
    totalImages: number;
    missingAltCount: number;
    heavyAnimationCount: number;
    deadLinksCount: number;
    seoTitleLength: number;
    metaDescLength: number;
  };
}

export function runPageAudit(params: {
  page: {
    title?: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
    seoKeywords?: string | null;
  };
  sections: Array<{
    id: string;
    type: string;
    title?: string | null;
    settings?: any;
    style?: any;
    contentJson?: any;
  }>;
}): PageAuditReport {
  const issues: PageAuditIssue[] = [];
  const { page, sections } = params;

  let totalImages = 0;
  let missingAltCount = 0;
  let heavyAnimationCount = 0;
  let deadLinksCount = 0;

  // 1. Analyze Sections & Content
  sections.forEach((sec, idx) => {
    const data = { ...sec.settings, ...sec.contentJson };

    // Check images
    if (data.imageUrl || data.bannerUrl || data.image) {
      totalImages++;
      if (!data.altText && !data.imageAlt) {
        missingAltCount++;
        issues.push({
          id: `missing-alt-${sec.id}`,
          category: "ACCESSIBILITY",
          severity: "warning",
          title: `Missing Alt Text on ${sec.type}`,
          message: `Section #${idx + 1} (${sec.type}) has an image without descriptive alt text.`,
          recommendation: "Provide descriptive alt text for screen readers and Google Image search.",
        });
      }
    }

    // Check animations
    if (data.animation && data.animation.type !== "none" && data.animation.duration > 700) {
      heavyAnimationCount++;
      issues.push({
        id: `slow-animation-${sec.id}`,
        category: "PERFORMANCE",
        severity: "info",
        title: `Lengthy Animation on ${sec.type}`,
        message: `Section #${idx + 1} uses a slow animation duration (${data.animation.duration}ms).`,
        recommendation: "Reduce animation duration to 300-500ms for snappier mobile performance.",
      });
    }

    // Check links
    if (data.buttonLink === "#" || data.link === "#" || data.href === "") {
      deadLinksCount++;
      issues.push({
        id: `dead-link-${sec.id}`,
        category: "LINKS",
        severity: "critical",
        title: `Unlinked Button / Anchor on ${sec.type}`,
        message: `Section #${idx + 1} has a button pointing to an empty or dummy '#' anchor.`,
        recommendation: "Replace with a valid URL or category route (e.g. /category/sarees).",
      });
    }
  });

  // 2. Performance Scoring
  let performanceScore = 100;
  if (sections.length > 15) {
    performanceScore -= 15;
    issues.push({
      id: "too-many-widgets",
      category: "PERFORMANCE",
      severity: "warning",
      title: "Too Many Widgets on Single Page",
      message: `Page has ${sections.length} sections. Heavy pages can increase DOM complexity and load times.`,
      recommendation: "Consider consolidating widgets or using lazy-loading drawers.",
    });
  }
  if (heavyAnimationCount > 3) performanceScore -= 10;
  if (totalImages > 12) performanceScore -= 10;

  // 3. Accessibility Scoring
  let accessibilityScore = 100;
  if (missingAltCount > 0) {
    accessibilityScore -= Math.min(30, missingAltCount * 10);
  }

  // 4. SEO Scoring
  let seoScore = 100;
  const seoTitle = page.seoTitle || page.title || "";
  const metaDesc = page.seoDescription || "";

  if (seoTitle.length < 10) {
    seoScore -= 20;
    issues.push({
      id: "short-seo-title",
      category: "SEO",
      severity: "critical",
      title: "SEO Title Too Short",
      message: `Current title length is ${seoTitle.length} chars. Optimal is 45-65 chars.`,
      recommendation: "Add descriptive primary brand keywords and category names.",
    });
  }

  if (metaDesc.length < 40) {
    seoScore -= 20;
    issues.push({
      id: "short-meta-desc",
      category: "SEO",
      severity: "warning",
      title: "Meta Description Missing or Brief",
      message: `Meta description is ${metaDesc.length} chars. Optimal is 120-160 chars.`,
      recommendation: "Write an engaging value proposition with shipping guarantees and offers.",
    });
  }

  // 5. Links Scoring
  let linksScore = 100;
  if (deadLinksCount > 0) {
    linksScore -= Math.min(40, deadLinksCount * 15);
  }

  const overallScore = Math.round(
    performanceScore * 0.3 + accessibilityScore * 0.25 + seoScore * 0.25 + linksScore * 0.2
  );

  return {
    overallScore,
    performanceScore: Math.max(0, performanceScore),
    accessibilityScore: Math.max(0, accessibilityScore),
    seoScore: Math.max(0, seoScore),
    linksScore: Math.max(0, linksScore),
    issues,
    metrics: {
      totalSections: sections.length,
      totalImages,
      missingAltCount,
      heavyAnimationCount,
      deadLinksCount,
      seoTitleLength: seoTitle.length,
      metaDescLength: metaDesc.length,
    },
  };
}
