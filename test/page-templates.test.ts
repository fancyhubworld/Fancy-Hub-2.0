import { PrismaClient } from "@prisma/client";
import { BUILTIN_PAGE_TEMPLATES, PageTemplateType } from "../src/lib/page-templates";

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

async function runPageTemplatesTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — PAGE TEMPLATES CATALOG & CUSTOM ENGINE TESTS");
  console.log("=======================================================================\n");

  try {
    // 1. Verify All 7 Required Built-in Templates
    console.log("--- PHASE 1: BUILT-IN TEMPLATES CATALOG ---");
    const requiredTypes: PageTemplateType[] = [
      "HOMEPAGE",
      "CATEGORY",
      "PRODUCT",
      "VENDOR_STORE",
      "BLOG",
      "LANDING",
      "CAMPAIGN",
    ];

    for (const type of requiredTypes) {
      const tpl = BUILTIN_PAGE_TEMPLATES.find((t) => t.type === type);
      assert(tpl !== undefined, `Found default page template for: ${type}`);
      assert(tpl!.sections.length >= 3, `  - Contains ${tpl!.sections.length} pre-configured widget sections`);
      assert(Boolean(tpl!.name), `  - Name: "${tpl!.name}"`);
      assert(Boolean(tpl!.description), `  - Description: "${tpl!.description.substring(0, 50)}..."`);
      assert(tpl!.isDefault === true, `  - isDefault: true`);
    }

    // 2. Test Creating Custom Page Template in Database
    console.log("\n--- PHASE 2: CREATING & PERSISTING CUSTOM PAGE TEMPLATE ---");
    const customTemplateData = {
      name: "Diwali 2026 Mega Saree Flash Sale",
      slug: `custom-diwali-flash-sale-${Date.now()}`,
      type: "CAMPAIGN",
      description: "Steep 60% discounts on Varanasi & Surat pure silk handloom sarees.",
      thumbnail: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
      isDefault: false,
      sectionsJson: JSON.stringify([
        {
          type: "FESTIVAL_BANNER",
          title: "Diwali Mega Saree Utsav",
          settings: { badge: "FESTIVE 2026", title: "Flat 60% OFF" },
        },
        {
          type: "FLASH_DEALS",
          title: "Midnight Lightning Deals",
          settings: { hoursRemaining: 8 },
        },
        {
          type: "PRODUCT_GRID",
          title: "Surat & Varanasi Bestsellers",
          dataSource: { type: "PRODUCTS", sourceType: "discounted", limit: 8 },
        },
      ]),
      createdBy: "Admin",
    };

    const createdTpl = await prisma.pageTemplate.create({
      data: customTemplateData,
    });

    assert(createdTpl.id !== undefined, `Created custom page template: "${createdTpl.name}"`);

    // Verify Read
    const fetchedTpl = await prisma.pageTemplate.findUnique({
      where: { id: createdTpl.id },
    });
    assert(fetchedTpl !== null, "Successfully queried custom page template from database");
    assert(fetchedTpl!.type === "CAMPAIGN", "Verified custom template type is 'CAMPAIGN'");

    const parsedSections = JSON.parse(fetchedTpl!.sectionsJson);
    assert(parsedSections.length === 3, "Parsed 3 custom widget sections in template");
    assert(parsedSections[0].type === "FESTIVAL_BANNER", "First section matches FESTIVAL_BANNER");

    // 3. Test Template Cleanup / Delete
    console.log("\n--- PHASE 3: CUSTOM TEMPLATE CLEANUP ---");
    await prisma.pageTemplate.delete({
      where: { id: createdTpl.id },
    });
    const checkDeleted = await prisma.pageTemplate.findUnique({
      where: { id: createdTpl.id },
    });
    assert(checkDeleted === null, "Deleted custom page template cleanly");

    console.log("\n=======================================================================");
    console.log(`Page Templates Test Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (error) {
    console.error("Test execution error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPageTemplatesTests();
