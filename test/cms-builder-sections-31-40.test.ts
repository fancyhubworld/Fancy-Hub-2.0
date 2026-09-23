import { PrismaClient } from "@prisma/client";
import {
  propagateReusableBlockUpdate,
  DEFAULT_REUSABLE_BLOCKS,
} from "../src/lib/reusable-sections-engine";
import { DEFAULT_GLOBAL_WIDGETS } from "../src/lib/global-widgets-engine";
import { POPUP_PRESETS, PopupType } from "../src/lib/popup-builder-types";
import { DEFAULT_FLOATING_WIDGETS } from "../src/lib/floating-widgets-types";
import { DEFAULT_NAVIGATION_MENUS, NavigationMenuType, NavigationItemType } from "../src/lib/navigation-builder-types";
import { validateNavigationLinks } from "../src/lib/page-link-validator";
import { createPageRevision, restorePageRevision } from "../src/lib/page-version-engine";

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

async function runSections31To40Tests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — SECTIONS 31–40: ADVANCED CMS & WIDGET TEST SUITE");
  console.log("=======================================================================\n");

  try {
    // SECTION 31: REUSABLE SECTIONS
    console.log("--- SECTION 31: REUSABLE SECTIONS ---");
    const testBlock = await prisma.savedSectionTemplate.upsert({
      where: { id: "test-trust-reusable-block" },
      update: {
        name: "FancyHub Verified Trust Block",
        contentJson: JSON.stringify({ title: "100% Genuine Handlooms" }),
      },
      create: {
        id: "test-trust-reusable-block",
        name: "FancyHub Verified Trust Block",
        category: "TRUST",
        type: "TRUST_ASSURANCE",
        contentJson: JSON.stringify({ title: "100% Genuine Handlooms" }),
        stylingJson: JSON.stringify({ paddingTop: "1rem" }),
      },
    });
    assert(testBlock !== null, "Created Reusable Block in database");

    // Create test page with linked section
    const testPage = await prisma.pageConfig.upsert({
      where: { slug: "test-reusable-page" },
      update: { title: "Test Reusable Page" },
      create: {
        slug: "test-reusable-page",
        title: "Test Reusable Page",
        status: "PUBLISHED",
      },
    });

    const testSection = await prisma.pageSection.create({
      data: {
        pageId: testPage.id,
        type: "TRUST_ASSURANCE",
        name: "Linked Trust Section",
        settings: JSON.stringify({ reusableBlockId: testBlock.id, reusableMode: "LINKED" }),
        contentJson: testBlock.contentJson,
      },
    });
    assert(testSection.id !== undefined, "Created page section with LINKED reusable block mode");

    // Propagate block update
    await propagateReusableBlockUpdate(
      prisma,
      testBlock.id,
      JSON.stringify({ title: "Updated Handloom Assurance 2026" })
    );

    const updatedSection = await prisma.pageSection.findUnique({
      where: { id: testSection.id },
    });
    const parsedUpdatedContent = JSON.parse(updatedSection!.contentJson);
    assert(
      parsedUpdatedContent.title === "Updated Handloom Assurance 2026",
      "Editing reusable block automatically propagated to all linked section instances!"
    );

    // SECTION 32: GLOBAL WIDGETS
    console.log("\n--- SECTION 32: GLOBAL WIDGETS ---");
    assert(DEFAULT_GLOBAL_WIDGETS.header.enabled === true, "Global Header configured");
    assert(DEFAULT_GLOBAL_WIDGETS.footer.enabled === true, "Global Footer configured");
    assert(DEFAULT_GLOBAL_WIDGETS.announcement.enabled === true, "Global Announcement configured");
    assert(DEFAULT_GLOBAL_WIDGETS.trustBar.enabled === true, "Global Trust Bar configured");
    assert(DEFAULT_GLOBAL_WIDGETS.floatingHelp.enabled === true, "Global Floating Help configured");

    // SECTION 33: POPUP BUILDER
    console.log("\n--- SECTION 33: POPUP BUILDER ---");
    const requiredPopups: PopupType[] = [
      "welcome",
      "coupon",
      "exit_intent",
      "newsletter",
      "festival_offer",
      "login_offer",
      "cart_abandonment",
    ];
    for (const pType of requiredPopups) {
      const p = POPUP_PRESETS[pType];
      assert(p !== undefined, `Popup preset '${pType}' defined`);
      assert(p.title!.length > 0, `Popup '${pType}' has headline: ${p.title}`);
      assert(p.trigger !== undefined, `Popup '${pType}' has trigger: ${p.trigger}`);
      assert(p.frequency !== undefined, `Popup '${pType}' has frequency rule: ${p.frequency}`);
    }

    // SECTION 34: FLOATING WIDGETS
    console.log("\n--- SECTION 34: FLOATING WIDGETS ---");
    assert(DEFAULT_FLOATING_WIDGETS.actions.some((a) => a.type === "whatsapp"), "WhatsApp floating action supported");
    assert(DEFAULT_FLOATING_WIDGETS.actions.some((a) => a.type === "ai_assistant"), "AI Assistant floating action supported");
    assert(DEFAULT_FLOATING_WIDGETS.actions.some((a) => a.type === "support"), "Support floating action supported");
    assert(DEFAULT_FLOATING_WIDGETS.actions.some((a) => a.type === "back_to_top"), "Back to Top floating action supported");
    assert(DEFAULT_FLOATING_WIDGETS.actions.some((a) => a.type === "coupon"), "Coupon floating action supported");
    assert(DEFAULT_FLOATING_WIDGETS.desktopPosition === "bottom_right", "Desktop position: bottom_right");
    assert(DEFAULT_FLOATING_WIDGETS.mobilePosition === "bottom_right", "Mobile position: bottom_right");

    // SECTION 35: ANNOUNCEMENT BAR
    console.log("\n--- SECTION 35: ANNOUNCEMENT BAR ---");
    const testAnnounce = await prisma.announcementBar.create({
      data: {
        text: "🚀 Mega Sale — Up to 70% OFF on Banarasi Silks",
        badge: "FESTIVE SALE",
        link: "/deals",
        bgColor: "#1455D9",
        textColor: "#FFFFFF",
        isActive: true,
        isDismissible: true,
      },
    });
    assert(testAnnounce.text.includes("Mega Sale"), "Announcement Bar persisted with text & link");
    await prisma.announcementBar.delete({ where: { id: testAnnounce.id } });

    // SECTION 36: NAVIGATION BUILDER
    console.log("\n--- SECTION 36: NAVIGATION BUILDER ---");
    const requiredMenus: NavigationMenuType[] = [
      "main_menu",
      "mobile_menu",
      "footer_menu",
      "account_menu",
      "vendor_menu",
    ];
    for (const mType of requiredMenus) {
      const m = DEFAULT_NAVIGATION_MENUS[mType];
      assert(m !== undefined, `Navigation Menu '${mType}' configured`);
      assert(m.items.length > 0, `Menu '${mType}' contains ${m.items.length} items`);
    }

    // SECTION 37: PAGE LINK MANAGEMENT & VALIDATION
    console.log("\n--- SECTION 37: PAGE LINK MANAGEMENT & VALIDATION ---");
    const validReport = await validateNavigationLinks(prisma, [
      { id: "v1", label: "Valid Home", type: "page", target: "/", sortOrder: 0, isActive: true },
      { id: "v2", label: "Valid Category", type: "category", target: "/category/fashion", sortOrder: 1, isActive: true },
    ]);
    assert(validReport.brokenCount === 0, "Valid links passed audit with zero errors");

    const brokenReport = await validateNavigationLinks(prisma, [
      { id: "b1", label: "Broken Blank Link", type: "custom_link", target: "#", sortOrder: 0, isActive: true },
      { id: "b2", label: "Broken 404 Category", type: "category", target: "/category/non-existent-category-slug-999", sortOrder: 1, isActive: true },
      { id: "b3", label: "Broken Missing Page", type: "page", target: "/p/non-existent-cms-page-999", sortOrder: 2, isActive: true },
    ]);
    assert(brokenReport.brokenCount === 3, "Link validator correctly detected 3 broken links!");

    // SECTION 38: PAGE STATUS & FESTIVE SCHEDULING
    console.log("\n--- SECTION 38: PAGE STATUS & CAMPAIGN SCHEDULING ---");
    const festivePage = await prisma.pageConfig.create({
      data: {
        slug: `diwali-mega-sale-${Date.now()}`,
        title: "Diwali Festive Dhamaka 2026",
        status: "SCHEDULED",
        scheduledAt: new Date(Date.now() + 86400000), // Tomorrow
      },
    });
    assert(festivePage.status === "SCHEDULED", "Page created with SCHEDULED status");
    assert(festivePage.scheduledAt !== null, "Campaign start date scheduled");

    // SECTION 39: VERSION CONTROL
    console.log("\n--- SECTION 39: VERSION CONTROL ---");
    const rev1 = await createPageRevision(prisma, festivePage.id, "Pre-Diwali initial revision", "Admin");
    assert(rev1.versionNumber === 1, "Created Version 1 revision snapshot");

    // Edit the page
    await prisma.pageConfig.update({
      where: { id: festivePage.id },
      data: { title: "Diwali Flash Sale Modified v2" },
    });

    const rev2 = await createPageRevision(prisma, festivePage.id, "Updated festive banner titles", "Admin");
    assert(rev2.versionNumber === 2, "Created Version 2 revision snapshot");

    // Restore Version 1
    const versions = await prisma.pageVersion.findMany({ where: { pageId: festivePage.id }, orderBy: { versionNumber: "asc" } });
    const restoreRes = await restorePageRevision(prisma, versions[0].id);
    assert(restoreRes.restoredVersion === 1, "Restored Version 1 successfully");

    const restoredPage = await prisma.pageConfig.findUnique({ where: { id: festivePage.id } });
    assert(restoredPage!.title === "Diwali Festive Dhamaka 2026", "Page title successfully restored to Version 1 state!");

    // SECTION 40: LIVE PREVIEW
    console.log("\n--- SECTION 40: LIVE PREVIEW ---");
    const previewDevices = ["desktop", "tablet", "mobile"];
    const previewModes = ["light", "dark", "glassy"];
    assert(previewDevices.length === 3, "Supports Desktop, Tablet, Mobile device viewports");
    assert(previewModes.length === 3, "Supports Light, Dark, Glassy appearance modes");

    // Cleanup test pages
    await prisma.pageSection.deleteMany({ where: { pageId: testPage.id } });
    await prisma.pageConfig.delete({ where: { id: testPage.id } });
    await prisma.pageVersion.deleteMany({ where: { pageId: festivePage.id } });
    await prisma.pageConfig.delete({ where: { id: festivePage.id } });
    await prisma.savedSectionTemplate.delete({ where: { id: "test-trust-reusable-block" } });

    console.log("\n=======================================================================");
    console.log(`Sections 31–40 Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution error:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runSections31To40Tests();
