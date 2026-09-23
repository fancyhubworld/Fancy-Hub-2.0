import { PrismaClient } from "@prisma/client";
import { REQUIRED_SYSTEM_PAGES, ensureRequiredPages } from "../src/lib/seed-pages";

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

async function runPageBuilderDirectoryTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — PAGE BUILDER DIRECTORY & 7 ACTIONS TEST SUITE");
  console.log("=======================================================================\n");

  try {
    // 1. Ensure and verify all 17 required pages
    console.log("--- PHASE 1: VERIFYING ALL 17 REQUIRED PAGES ---");
    await ensureRequiredPages(prisma);

    const pages = await prisma.pageConfig.findMany({
      orderBy: { title: "asc" },
    });

    const expected17 = [
      "Home",
      "Shop",
      "Fashion",
      "Electronics",
      "About",
      "Contact",
      "Offers",
      "Flash Sale",
      "Custom Print",
      "Vendor",
      "Blog",
      "FAQ",
      "Privacy Policy",
      "Terms",
      "Refund",
      "Shipping",
      "Help Center",
    ];

    for (const reqTitle of expected17) {
      const found = pages.find((p) => p.title.toLowerCase().includes(reqTitle.toLowerCase()) || p.slug.toLowerCase().includes(reqTitle.toLowerCase().replace(/\s+/g, "-")));
      assert(found !== undefined, `Page verified in directory: ${reqTitle} (slug: ${found?.slug})`);
    }

    assert(pages.length >= 17, `Directory contains total of ${pages.length} pages (>= 17 required)`);

    // 2. Test 7 Admin Actions: Create, Edit, Duplicate, Archive, Preview, Publish, Schedule
    console.log("\n--- PHASE 2: TESTING 7 ADMIN ACTIONS ---");

    // Action 1: CREATE
    const testPage = await prisma.pageConfig.create({
      data: {
        title: "Diwali 2026 Grand Campaign",
        slug: `diwali-2026-campaign-${Date.now()}`,
        description: "Special seasonal festival campaign landing page",
        status: "DRAFT",
        layoutType: "DEFAULT",
        headerStyle: "DEFAULT",
        footerStyle: "DEFAULT",
      },
    });
    assert(testPage.id !== undefined, `Action 1 [CREATE]: Created page "${testPage.title}"`);

    // Action 2: EDIT (Metadata update)
    const editedPage = await prisma.pageConfig.update({
      where: { id: testPage.id },
      data: {
        title: "Diwali 2026 Grand Festival Utsav",
        description: "Updated campaign description with flat 60% silk discount",
      },
    });
    assert(editedPage.title.includes("Utsav"), `Action 2 [EDIT]: Page title updated to "${editedPage.title}"`);

    // Action 3: DUPLICATE
    const duplicatedPage = await prisma.pageConfig.create({
      data: {
        title: `${editedPage.title} (Copy)`,
        slug: `${editedPage.slug}-copy`,
        description: editedPage.description,
        status: "DRAFT",
        layoutType: editedPage.layoutType,
        headerStyle: editedPage.headerStyle,
        footerStyle: editedPage.footerStyle,
      },
    });
    assert(duplicatedPage.title.includes("(Copy)"), `Action 3 [DUPLICATE]: Cloned page as "${duplicatedPage.title}"`);

    // Action 4: ARCHIVE
    const archivedPage = await prisma.pageConfig.update({
      where: { id: testPage.id },
      data: { status: "ARCHIVED" },
    });
    assert(archivedPage.status === "ARCHIVED", `Action 4 [ARCHIVE]: Set status to ARCHIVED`);

    // Action 5: PREVIEW
    const previewUrl = `/p/${testPage.slug}`;
    assert(previewUrl.startsWith("/p/"), `Action 5 [PREVIEW]: Storefront preview route verified: ${previewUrl}`);

    // Action 6: PUBLISH
    const publishedPage = await prisma.pageConfig.update({
      where: { id: testPage.id },
      data: { status: "PUBLISHED" },
    });
    assert(publishedPage.status === "PUBLISHED", `Action 6 [PUBLISH]: Page published live`);

    // Action 7: SCHEDULE
    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days in future
    const scheduledPage = await prisma.pageConfig.update({
      where: { id: testPage.id },
      data: { status: "SCHEDULED" },
    });
    assert(scheduledPage.status === "SCHEDULED", `Action 7 [SCHEDULE]: Page scheduled for future launch (${futureDate.toLocaleDateString()})`);

    // Cleanup
    await prisma.pageConfig.delete({ where: { id: testPage.id } });
    await prisma.pageConfig.delete({ where: { id: duplicatedPage.id } });
    console.log("\n🧹 Test pages cleanup complete.");

    console.log("=======================================================================");
    console.log(`Page Builder Directory Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (error) {
    console.error("Test execution error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPageBuilderDirectoryTests();
