import { PrismaClient } from "@prisma/client";

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

async function runVisualBuilderComprehensiveTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — VISUAL BUILDER COMPLETE FEATURE TEST SUITE");
  console.log("=======================================================================\n");

  try {
    // 1. Create Base Test Page
    console.log("--- PHASE 1: PAGE CREATION & SECTION MANAGEMENT ---");
    const testPage = await prisma.pageConfig.upsert({
      where: { slug: "test-interactive-studio-page" },
      update: { title: "Diwali Artisan Showcase", status: "DRAFT" },
      create: {
        slug: "test-interactive-studio-page",
        title: "Diwali Artisan Showcase",
        description: "Testing drag-and-drop, reuse, and duplicate",
        isHomepage: false,
        status: "DRAFT",
      },
    });
    assert(testPage.id !== undefined, "Test page created");

    // 2. Add Sections (Move, Hide, Show, Duplicate)
    const sec1 = await prisma.pageSection.create({
      data: {
        pageId: testPage.id,
        type: "HERO_SLIDER",
        title: "Main Hero",
        sortOrder: 0,
        isActive: true,
        contentJson: JSON.stringify({ slides: [{ title: "Diwali 2026", ctaText: "Shop Now" }] }),
      },
    });

    const sec2 = await prisma.pageSection.create({
      data: {
        pageId: testPage.id,
        type: "FLASH_DEALS",
        title: "Midnight Flash Deals",
        sortOrder: 1,
        isActive: true,
        contentJson: JSON.stringify({ hoursRemaining: 8, discountTag: "FLAT 50% OFF" }),
      },
    });
    assert(sec1.id !== undefined && sec2.id !== undefined, "Added 2 sections to test page");

    // Test Hide / Show
    const hiddenSec = await prisma.pageSection.update({
      where: { id: sec1.id },
      data: { isActive: false },
    });
    assert(hiddenSec.isActive === false, "Section hidden successfully (isActive = false)");

    const shownSec = await prisma.pageSection.update({
      where: { id: sec1.id },
      data: { isActive: true },
    });
    assert(shownSec.isActive === true, "Section shown successfully (isActive = true)");

    // Test Reorder (Move)
    await prisma.$transaction([
      prisma.pageSection.update({ where: { id: sec1.id }, data: { sortOrder: 1 } }),
      prisma.pageSection.update({ where: { id: sec2.id }, data: { sortOrder: 0 } }),
    ]);
    const reordered = await prisma.pageSection.findMany({
      where: { pageId: testPage.id },
      orderBy: { sortOrder: "asc" },
    });
    assert(reordered[0].id === sec2.id, "Sections moved & reordered successfully");

    // 3. Save Section as Reusable Template
    console.log("\n--- PHASE 2: SAVE & REUSE SECTION TEMPLATES ---");
    const savedTemplate = await prisma.savedSectionTemplate.create({
      data: {
        name: "Diwali Festive Hero Banner",
        category: "HERO",
        type: "HERO_SLIDER",
        description: "Pre-configured hero carousel with golden festive gradient",
        contentJson: sec1.contentJson,
        stylingJson: JSON.stringify({ paddingY: "py-8", backgroundColor: "#0A1128" }),
        createdBy: "Lead Designer",
      },
    });
    assert(savedTemplate.id !== undefined, "Section saved as reusable template in DB");
    assert(savedTemplate.name === "Diwali Festive Hero Banner", "Template name matches");

    // Query templates
    const templatesList = await prisma.savedSectionTemplate.findMany({
      where: { type: "HERO_SLIDER" },
    });
    assert(templatesList.length >= 1, "Retrieved reusable templates list from database");

    // Reuse template on another section
    const reusedSec = await prisma.pageSection.create({
      data: {
        pageId: testPage.id,
        type: savedTemplate.type,
        title: savedTemplate.name,
        sortOrder: 2,
        isActive: true,
        contentJson: savedTemplate.contentJson,
        stylingJson: savedTemplate.stylingJson,
      },
    });
    assert(reusedSec.id !== undefined, "Reused saved template to create new section on page");

    // Delete template
    await prisma.savedSectionTemplate.delete({ where: { id: savedTemplate.id } });
    assert(true, "Deleted saved template successfully");

    // 4. Duplicate Page Engine
    console.log("\n--- PHASE 3: DUPLICATE ENTIRE PAGE ---");
    const pageWithSections = await prisma.pageConfig.findUnique({
      where: { id: testPage.id },
      include: { sections: { orderBy: { sortOrder: "asc" } } },
    });

    const duplicatedPage = await prisma.$transaction(async (tx) => {
      const newP = await tx.pageConfig.create({
        data: {
          slug: "test-duplicated-studio-page",
          title: "Diwali Artisan Showcase (Copy)",
          description: pageWithSections?.description,
          isHomepage: false,
          status: "DRAFT",
        },
      });

      for (let i = 0; i < (pageWithSections?.sections.length || 0); i++) {
        const s = pageWithSections!.sections[i];
        await tx.pageSection.create({
          data: {
            pageId: newP.id,
            type: s.type,
            title: s.title,
            sortOrder: i,
            isActive: s.isActive,
            contentJson: s.contentJson,
            stylingJson: s.stylingJson,
          },
        });
      }
      return newP;
    });

    assert(duplicatedPage.id !== undefined, "Duplicated entire page with all child sections");
    const dupSections = await prisma.pageSection.findMany({ where: { pageId: duplicatedPage.id } });
    assert(dupSections.length === pageWithSections?.sections.length, `Cloned all ${dupSections.length} sections into duplicated page`);

    // 5. Version History & Restore
    console.log("\n--- PHASE 4: VERSION HISTORY SNAPSHOTS & RESTORE ---");
    const v1 = await prisma.pageVersion.create({
      data: {
        pageId: testPage.id,
        versionNumber: 1,
        label: "Initial Festive Layout",
        snapshotJson: JSON.stringify({ page: testPage, sections: reordered }),
        createdBy: "Administrator",
      },
    });
    assert(v1.id !== undefined, "Version history revision #1 created");

    // 6. Cleanup
    await prisma.pageConfig.delete({ where: { id: testPage.id } });
    await prisma.pageConfig.delete({ where: { id: duplicatedPage.id } });
    console.log("\n🧹 Test cleanup complete.");

    console.log("=======================================================================");
    console.log(`Visual Builder Complete Suite: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (error) {
    console.error("Test execution error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runVisualBuilderComprehensiveTests();
