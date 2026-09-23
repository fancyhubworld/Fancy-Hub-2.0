import {
  saveAutosaveDraft,
  getAutosaveDraft,
  clearAutosaveDraft,
  shouldPromptRestore,
} from "../src/lib/autosave-engine";

import {
  RESPONSIVE_BREAKPOINTS,
  getViewportWidth,
} from "../src/lib/responsive-breakpoints";

import {
  calculateContrastRatio,
  getRelativeLuminance,
  auditThemeAccessibility,
} from "../src/lib/a11y-engine";

import {
  DEFAULT_DESIGN_TOKENS,
  exportTokensToCssVariables,
} from "../src/lib/design-tokens-engine";

import {
  ANIMATION_TYPES_LIST,
  getAnimationStyles,
  DEFAULT_ANIMATION_CONFIG,
} from "../src/lib/animation-system";

import {
  runPageAudit,
} from "../src/lib/page-audit-engine";

import {
  INITIAL_MEDIA_LIBRARY,
  validateImageAltText,
} from "../src/lib/media-library-engine";

import {
  getAllMarketplacePlugins,
  getInstalledWidgetPlugins,
  installWidgetPlugin,
  uninstallWidgetPlugin,
} from "../src/lib/widget-marketplace-engine";

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

// Mock localStorage in Node test environment
const mockStorage: Record<string, string> = {};
(global as any).window = {
  localStorage: {
    getItem: (key: string) => mockStorage[key] || null,
    setItem: (key: string, val: string) => { mockStorage[key] = val; },
    removeItem: (key: string) => { delete mockStorage[key]; },
  },
};
(global as any).localStorage = (global as any).window.localStorage;

async function runSections67To75Tests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — SECTIONS 67 TO 75 COMPREHENSIVE TEST SUITE");
  console.log("=======================================================================\n");

  try {
    // -----------------------------------------------------------------------
    // SECTION 67: AUTOSAVE & BROWSER CRASH RECOVERY
    // -----------------------------------------------------------------------
    console.log("--- 1. SECTION 67: AUTOSAVE & RECOVERY ENGINE ---");
    const testSlug = "diwali-mega-sale";
    const draftData = {
      sections: [{ id: "sec_hero", type: "HERO_SLIDER", title: "Diwali 2026" }],
      page: { title: "Diwali Mega Sale 2026", slug: testSlug },
    };

    const savedOk = saveAutosaveDraft(testSlug, draftData, "Autosave-10:30");
    assert(savedOk === true, "Autosave draft stored successfully in local storage");

    const retrievedDraft = getAutosaveDraft<typeof draftData>(testSlug);
    assert(retrievedDraft !== null, "Autosaved draft retrieved from storage");
    assert(retrievedDraft?.data.sections.length === 1, "Draft data matches saved payload");

    const restoreCheck = shouldPromptRestore(testSlug, Date.now() - 10000);
    assert(restoreCheck.shouldPrompt === true, "Prompt 'Restore unsaved changes?' triggered for newer local draft");

    clearAutosaveDraft(testSlug);
    assert(getAutosaveDraft(testSlug) === null, "Autosaved draft cleared after dismissal/publish");

    // -----------------------------------------------------------------------
    // SECTION 68: RESPONSIVE BREAKPOINTS PREVIEW
    // -----------------------------------------------------------------------
    console.log("\n--- 2. SECTION 68: RESPONSIVE BREAKPOINTS SYSTEM ---");
    assert(RESPONSIVE_BREAKPOINTS.desktop.defaultWidth === 1440, "Desktop default breakpoint is 1440px");
    assert(RESPONSIVE_BREAKPOINTS.tablet.defaultWidth === 768, "Tablet default breakpoint is 768px");
    assert(RESPONSIVE_BREAKPOINTS.mobile.defaultWidth === 390, "Mobile default breakpoint is 390px");

    assert(getViewportWidth("desktop") === 1440, "getViewportWidth(desktop) returns 1440");
    assert(getViewportWidth("tablet") === 768, "getViewportWidth(tablet) returns 768");
    assert(getViewportWidth("mobile") === 390, "getViewportWidth(mobile) returns 390");
    assert(getViewportWidth("desktop", 1920) === 1920, "Custom desktop width (1920px) handled correctly");

    // -----------------------------------------------------------------------
    // SECTION 69: ACCESSIBILITY & CONTRAST WARNING ENGINE
    // -----------------------------------------------------------------------
    console.log("\n--- 3. SECTION 69: ACCESSIBILITY & CONTRAST VALIDATION ---");
    const blackOnWhite = calculateContrastRatio("#000000", "#FFFFFF");
    assert(blackOnWhite.ratio >= 21.0, "Black on White contrast ratio is 21:1 (WCAG AAA)");
    assert(blackOnWhite.isNormalTextAAA === true, "Black on White passes WCAG AAA");

    // Low contrast test (e.g. Light gray on white)
    const lowContrast = calculateContrastRatio("#A0AEC0", "#FFFFFF");
    assert(lowContrast.isNormalTextAA === false, "Low contrast color pair fails WCAG AA (< 4.5:1)");
    assert(typeof lowContrast.warning === "string", "Contrast warning message generated for unreadable text");

    const a11yThemeAudit = auditThemeAccessibility({
      textColor: "#0F172A",
      backgroundColor: "#FFFFFF",
      primaryColor: "#1455D9",
      cardColor: "#FFFFFF",
    });
    assert(a11yThemeAudit.score >= 75, "Theme accessibility score evaluated properly");

    // -----------------------------------------------------------------------
    // SECTION 70: DESIGN TOKENS SYSTEM
    // -----------------------------------------------------------------------
    console.log("\n--- 4. SECTION 70: CENTRALIZED DESIGN TOKENS ---");
    assert(DEFAULT_DESIGN_TOKENS.colors.primary === "#1455D9", "Design token primary color defined");
    assert(DEFAULT_DESIGN_TOKENS.typography.fontHeading.includes("Plus Jakarta Sans"), "Design token heading font defined");
    assert(DEFAULT_DESIGN_TOKENS.breakpoints.desktop === "1440px", "Design token desktop breakpoint matches 1440px");
    assert(DEFAULT_DESIGN_TOKENS.radius.full === "9999px", "Design token pill radius defined");

    const cssTokens = exportTokensToCssVariables(DEFAULT_DESIGN_TOKENS);
    assert(cssTokens["--color-primary"] === "#1455D9", "CSS variable token --color-primary exported");
    assert(cssTokens["--bp-desktop"] === "1440px", "CSS variable token --bp-desktop exported");

    // -----------------------------------------------------------------------
    // SECTION 71: ANIMATION SYSTEM
    // -----------------------------------------------------------------------
    console.log("\n--- 5. SECTION 71: ANIMATION ENGINE & REDUCED MOTION ---");
    assert(ANIMATION_TYPES_LIST.length >= 8, "8+ Animation types registered (fade, slide, scale, float, reveal)");
    
    const animStyles = getAnimationStyles({
      type: "slide-up",
      duration: 500,
      delay: 100,
      easing: "spring",
    });
    assert(animStyles.className.includes("animate-slideUp"), "Animation class applied for slide-up");
    assert(animStyles.className.includes("motion-reduce:animate-none"), "prefers-reduced-motion fallback class included");
    assert(animStyles.style.animationDuration === "500ms", "Animation duration style set to 500ms");

    // -----------------------------------------------------------------------
    // SECTION 72: PAGE AUDIT & HEALTH SCORE ENGINE
    // -----------------------------------------------------------------------
    console.log("\n--- 6. SECTION 72: PAGE PERFORMANCE & HEALTH AUDIT ---");
    const mockAudit = runPageAudit({
      page: {
        title: "Test Page",
        seoTitle: "Shop Handwoven Pure Silk Sarees Online | FancyHub India",
        seoDescription: "Explore authentic Silk Mark certified Banarasi & Kanjivaram silk sarees online at FancyHub with free insured shipping.",
      },
      sections: [
        { id: "s1", type: "HERO_SLIDER", settings: { bannerUrl: "https://image.jpg", altText: "Banarasi silk saree banner" } },
        { id: "s2", type: "PRODUCT_GRID", settings: { limit: 8 } },
        { id: "s3", type: "TESTIMONIALS", settings: { image: "https://artisan.jpg" } }, // missing alt
      ],
    });

    assert(mockAudit.overallScore > 70, "Page overall quality score computed");
    assert(mockAudit.accessibilityScore < 100, "Accessibility score penalized for missing image alt text");
    assert(mockAudit.metrics.missingAltCount === 1, "Missing alt text counter recorded correctly");
    assert(mockAudit.issues.some((i) => i.category === "ACCESSIBILITY"), "Accessibility issue generated with actionable fix recommendation");

    // -----------------------------------------------------------------------
    // SECTIONS 73 & 74: MEDIA LIBRARY & ALT TEXT PROMPTING
    // -----------------------------------------------------------------------
    console.log("\n--- 7. SECTIONS 73 & 74: MEDIA LIBRARY & ALT TEXT ENFORCEMENT ---");
    assert(INITIAL_MEDIA_LIBRARY.length >= 3, "Initial Media Library has pre-populated assets");
    assert(INITIAL_MEDIA_LIBRARY[0].responsiveUrls?.thumbnail !== undefined, "Responsive image URLs generated");

    const validAlt = validateImageAltText({ altText: "Master artisan Rameshwar Lal at Jacquard loom" });
    assert(validAlt.isValid === true, "Valid descriptive alt text passes validation");

    const invalidAlt = validateImageAltText({ altText: "" });
    assert(invalidAlt.isValid === false, "Missing alt text caught with SEO & Accessibility warning");

    // -----------------------------------------------------------------------
    // SECTION 75: WIDGET MARKETPLACE ARCHITECTURE
    // -----------------------------------------------------------------------
    console.log("\n--- 8. SECTION 75: WIDGET MARKETPLACE & EXTENSIBILITY ---");
    const allPlugins = getAllMarketplacePlugins();
    assert(allPlugins.length >= 4, "Marketplace plugins registry contains 4+ modular widgets");
    
    const instaPlugin = allPlugins.find((p) => p.widgetType === "INSTAGRAM_REELS_FEED");
    assert(instaPlugin !== undefined, "Instagram Reels widget plugin exists in marketplace");
    assert(instaPlugin?.category === "MEDIA", "Plugin categorized under MEDIA");

    const installOk = installWidgetPlugin("plugin-3d-model");
    assert(installOk === true, "3D Model Viewer widget installed dynamically without core rewrites");
    assert(getInstalledWidgetPlugins().some((p) => p.id === "plugin-3d-model"), "Installed widgets list reflects new plugin");

    uninstallWidgetPlugin("plugin-3d-model");
    assert(!getInstalledWidgetPlugins().some((p) => p.id === "plugin-3d-model"), "Plugin uninstalled cleanly");

    console.log("\n=======================================================================");
    console.log(`Sections 67–75 Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution error:", e);
    process.exit(1);
  }
}

runSections67To75Tests();
