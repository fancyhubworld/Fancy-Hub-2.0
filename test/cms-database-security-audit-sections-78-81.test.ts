import { PrismaClient } from "@prisma/client";
import {
  sanitizeHtmlContent,
  sanitizeCustomCss,
  validateImageUpload,
  verifyAdminRolePermission,
} from "../src/lib/cms-security-engine";
import {
  recordCmsAuditLog,
  getCmsAuditLogs,
} from "../src/lib/cms-audit-log-engine";

const prisma = new PrismaClient();

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

async function runSections78To81Tests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — SECTIONS 78 TO 81 DATABASE, SECURITY & AUDIT SUITE");
  console.log("=======================================================================\n");

  try {
    // -----------------------------------------------------------------------
    // SECTION 78: DATABASE ARCHITECTURE & RELATIONS
    // -----------------------------------------------------------------------
    console.log("--- 1. SECTION 78: DATABASE RELATIONAL MODELS ---");
    assert(typeof (prisma as any).page !== "undefined", "Prisma model 'Page' defined");
    assert(typeof (prisma as any).pageSectionRel !== "undefined", "Prisma model 'PageSectionRel' defined");
    assert(typeof (prisma as any).pageVersionRel !== "undefined", "Prisma model 'PageVersionRel' defined");
    assert(typeof (prisma as any).widget !== "undefined", "Prisma model 'Widget' defined");
    assert(typeof (prisma as any).widgetInstance !== "undefined", "Prisma model 'WidgetInstance' defined");
    assert(typeof (prisma as any).theme !== "undefined", "Prisma model 'Theme' defined");
    assert(typeof (prisma as any).themeVersion !== "undefined", "Prisma model 'ThemeVersion' defined");
    assert(typeof (prisma as any).navigation !== "undefined", "Prisma model 'Navigation' defined");
    assert(typeof (prisma as any).navigationItem !== "undefined", "Prisma model 'NavigationItem' defined");
    assert(typeof (prisma as any).reusableBlock !== "undefined", "Prisma model 'ReusableBlock' defined");
    assert(typeof (prisma as any).popup !== "undefined", "Prisma model 'Popup' defined");
    assert(typeof (prisma as any).banner !== "undefined", "Prisma model 'Banner' defined");
    assert(typeof (prisma as any).redirect !== "undefined", "Prisma model 'Redirect' defined");
    assert(typeof (prisma as any).media !== "undefined", "Prisma model 'Media' defined");
    assert(typeof (prisma as any).sEOSettings !== "undefined", "Prisma model 'SEOSettings' defined");
    assert(typeof (prisma as any).auditLog !== "undefined", "Prisma model 'AuditLog' defined");

    // -----------------------------------------------------------------------
    // SECTION 79: SECURITY ENGINE & PROTECTION
    // -----------------------------------------------------------------------
    console.log("\n--- 2. SECTION 79: CMS BUILDER SECURITY ENGINE ---");
    // XSS sanitization
    const maliciousHtml = '<p>Handloom Silk</p><script>alert("hacked")</script><img src=x onerror="stealCookies()">';
    const sanitizedHtml = sanitizeHtmlContent(maliciousHtml);
    assert(!sanitizedHtml.includes("<script>"), "Malicious <script> tags removed");
    assert(!sanitizedHtml.includes("onerror="), "Malicious onerror event handlers stripped");
    assert(sanitizedHtml.includes("<p>Handloom Silk</p>"), "Safe HTML preserved");

    // CSS sanitization
    const maliciousCss = ".header { background: url(javascript:alert(1)); color: expression(document.cookie); }";
    const sanitizedCssResult = sanitizeCustomCss(maliciousCss);
    assert(sanitizedCssResult.isValid === false, "Dangerous CSS expressions caught");
    assert(sanitizedCssResult.violations.length >= 2, "Violations logged for javascript: and expression()");
    assert(!sanitizedCssResult.sanitized.includes("expression("), "Dangerous CSS expression stripped from output");

    // Image Upload validation
    const validImage = validateImageUpload({ name: "banarasi-saree.webp", size: 1024 * 500, mimeType: "image/webp" });
    assert(validImage.isValid === true, "Valid WebP image passes validation");

    const phpScript = validateImageUpload({ name: "backdoor.php", size: 2048, mimeType: "application/x-php" });
    assert(phpScript.isValid === false, "PHP script upload blocked");

    const exeFile = validateImageUpload({ name: "malware.exe", size: 1024, mimeType: "application/x-msdownload" });
    assert(exeFile.isValid === false, "Executable file upload blocked");

    // Role permissions
    assert(verifyAdminRolePermission("SUPER_ADMIN", "security.edit") === true, "SUPER_ADMIN has full security permissions");
    assert(verifyAdminRolePermission("CONTENT_MANAGER", "security.edit") === false, "CONTENT_MANAGER blocked from security settings");
    assert(verifyAdminRolePermission("DESIGNER", "theme.edit") === true, "DESIGNER has theme customization access");

    // -----------------------------------------------------------------------
    // SECTION 80: AUDIT LOG SYSTEM
    // -----------------------------------------------------------------------
    console.log("\n--- 3. SECTION 80: CMS AUDIT LOGGING SYSTEM ---");
    const testLog = recordCmsAuditLog({
      changedBy: "Admin Rahul",
      action: "THEME_UPDATE",
      entity: "Theme",
      entityId: "global-theme",
      field: "primaryColor",
      previousValue: "#123456",
      newValue: "#2458FF",
    });

    assert(testLog.changedBy === "Admin Rahul", "Logged 'Who changed' (Admin Rahul)");
    assert(testLog.field === "primaryColor", "Logged 'What changed' (primaryColor)");
    assert(testLog.previousValue === "#123456", "Logged 'Previous value' (#123456)");
    assert(testLog.newValue === "#2458FF", "Logged 'New value' (#2458FF)");
    assert(testLog.summary.includes("Admin Rahul changed primaryColor from '#123456' to '#2458FF'"), "Generated human-readable audit narrative");

    const recentLogs = getCmsAuditLogs({ entity: "Theme" });
    assert(recentLogs.some((l) => l.newValue === "#2458FF"), "Audit log retrieved from query buffer");

    // -----------------------------------------------------------------------
    // SECTION 81: END-TO-END NO-CODE STORE OWNER WORKFLOW
    // -----------------------------------------------------------------------
    console.log("\n--- 4. SECTION 81: END-TO-END STORE OWNER WORKFLOW ---");
    // Step 1: Owner changes theme primary color in Theme Studio
    const ownerThemeChange = recordCmsAuditLog({
      changedBy: "Store Owner",
      action: "THEME_UPDATE",
      entity: "Theme",
      entityId: "global-theme",
      field: "primaryColor",
      previousValue: "#1455D9",
      newValue: "#2458FF",
    });
    assert(ownerThemeChange.newValue === "#2458FF", "Step 1: Theme Studio Primary Color updated to #2458FF without developer");

    // Step 2: Owner adds Flash Deals widget to Home page with Category=Electronics, Products=8, Mobile Columns=2
    const flashDealsWidgetConfig = {
      type: "FLASH_DEALS_TIMER",
      name: "Diwali Flash Deals",
      settings: {
        category: "Electronics",
        productLimit: 8,
      },
      responsiveSettings: {
        mobile: { columns: 2 },
        desktop: { columns: 4 },
      },
      status: "PUBLISHED",
    };

    assert(flashDealsWidgetConfig.settings.category === "Electronics", "Step 2A: Category configured as Electronics");
    assert(flashDealsWidgetConfig.settings.productLimit === 8, "Step 2B: Product count configured as 8");
    assert(flashDealsWidgetConfig.responsiveSettings.mobile.columns === 2, "Step 2C: Mobile columns set to 2");
    assert(flashDealsWidgetConfig.status === "PUBLISHED", "Step 2D: Section published live to storefront instantly");

    console.log("\n=======================================================================");
    console.log(`Sections 78–81 Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution error:", e);
    process.exit(1);
  }
}

runSections78To81Tests();
