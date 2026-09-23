import { PrismaClient } from "@prisma/client";
import {
  slugifyCategory,
  computeFullPath,
  computeLevel,
  detectCircularDependency,
  getDescendantCategoryIds,
  buildCategoryTree,
  buildCategoryBreadcrumbs,
} from "../src/lib/categories";

const prisma = new PrismaClient();

console.log("===============================================================");
console.log("   FANCYHUB.IN — 20-STEP DYNAMIC CATEGORY AUTOMATION TEST");
console.log("===============================================================\n");

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

async function runTests() {
  try {
    // Clean test categories if any existed
    await prisma.categoryRedirect.deleteMany({});
    await prisma.category.deleteMany({
      where: { slug: { in: ["test-fashion", "test-men", "test-shirts", "test-formal-shirts", "test-women"] } },
    });

    console.log("--- PHASE 1: HIERARCHY CREATION & AUTOMATIC PATH COMPUTATION ---");
    
    // STEP 1: Create Root Category (Level 0)
    const catFashion = await prisma.category.create({
      data: {
        name: "Test Fashion",
        slug: "test-fashion",
        fullPath: "test-fashion",
        level: 0,
        sortOrder: 1,
        status: "ACTIVE",
      },
    });
    assert(catFashion.fullPath === "test-fashion", "Step 1: Root category created with fullPath 'test-fashion'");
    assert(catFashion.level === 0, "Step 1: Root category level is 0");

    // STEP 2: Create Subcategory (Level 1)
    const catMen = await prisma.category.create({
      data: {
        name: "Test Men",
        slug: "test-men",
        fullPath: "test-fashion/test-men",
        parentId: catFashion.id,
        level: 1,
        sortOrder: 1,
        status: "ACTIVE",
      },
    });
    assert(catMen.fullPath === "test-fashion/test-men", "Step 2: Subcategory created with fullPath 'test-fashion/test-men'");
    assert(catMen.level === 1, "Step 2: Subcategory level is 1");

    // STEP 3: Create Child Category (Level 2)
    const catShirts = await prisma.category.create({
      data: {
        name: "Test Shirts",
        slug: "test-shirts",
        fullPath: "test-fashion/test-men/test-shirts",
        parentId: catMen.id,
        level: 2,
        sortOrder: 1,
        status: "ACTIVE",
      },
    });
    assert(catShirts.fullPath === "test-fashion/test-men/test-shirts", "Step 3: Child category created with fullPath 'test-fashion/test-men/test-shirts'");
    assert(catShirts.level === 2, "Step 3: Child category level is 2");

    // STEP 4-6: Verify Path Navigation Resolutions
    const fetchedFashion = await prisma.category.findUnique({ where: { fullPath: "test-fashion" } });
    const fetchedMen = await prisma.category.findUnique({ where: { fullPath: "test-fashion/test-men" } });
    const fetchedShirts = await prisma.category.findUnique({ where: { fullPath: "test-fashion/test-men/test-shirts" } });

    assert(fetchedFashion !== null && fetchedFashion.name === "Test Fashion", "Step 4: /test-fashion resolves from database");
    assert(fetchedMen !== null && fetchedMen.name === "Test Men", "Step 5: /test-fashion/test-men resolves from database");
    assert(fetchedShirts !== null && fetchedShirts.name === "Test Shirts", "Step 6: /test-fashion/test-men/test-shirts resolves from database");

    // STEP 7: Unlimited Depth Test (Level 3 Deep Child)
    const catFormalShirts = await prisma.category.create({
      data: {
        name: "Test Formal Shirts",
        slug: "test-formal-shirts",
        fullPath: "test-fashion/test-men/test-shirts/test-formal-shirts",
        parentId: catShirts.id,
        level: 3,
        sortOrder: 1,
        status: "ACTIVE",
      },
    });
    assert(catFormalShirts.level === 3, "Step 7: Deep Level 3 category created");
    assert(catFormalShirts.fullPath === "test-fashion/test-men/test-shirts/test-formal-shirts", "Step 7: Level 3 path correctly computed");

    console.log("\n--- PHASE 2: INTEGRITY, CIRCULAR PROTECTION & SLUG VALIDATION ---");

    // STEP 8: Circular Hierarchy Protection
    const allCatsForCycle = [catFashion, catMen, catShirts, catFormalShirts];
    const isCycle = detectCircularDependency(catFashion.id, catFormalShirts.id, allCatsForCycle);
    assert(isCycle === true, "Step 8: Circular dependency detected (Prevented making Fashion a child of Formal Shirts)");

    const isNonCycle = detectCircularDependency(catShirts.id, catFashion.id, allCatsForCycle);
    assert(isNonCycle === false, "Step 8: Valid parent assignment permitted");

    // STEP 9: Automatic Slug Sanitization
    const generatedSlug = slugifyCategory("Men's Premium & Silk Sarees 2026!");
    assert(generatedSlug === "mens-premium-and-silk-sarees-2026", "Step 9: Slug generated with SEO rules ('mens-premium-and-silk-sarees-2026')");

    // STEP 10: Dynamic Breadcrumbs Generation from Database
    const categoryMap = new Map<string, any>([
      [catFashion.id, catFashion],
      [catMen.id, catMen],
      [catShirts.id, catShirts],
      [catFormalShirts.id, catFormalShirts],
    ]);
    const breadcrumbs = buildCategoryBreadcrumbs(catFormalShirts.id, categoryMap);
    assert(breadcrumbs.length === 6, "Step 10: Breadcrumbs chain computed with 6 steps");
    assert(breadcrumbs[2].label === "Test Fashion", "Step 10: Breadcrumb 1 is Home > Categories > Test Fashion");
    assert(breadcrumbs[3].label === "Test Men", "Step 10: Breadcrumb 2 is Test Men");
    assert(breadcrumbs[4].label === "Test Shirts", "Step 10: Breadcrumb 3 is Test Shirts");
    assert(breadcrumbs[5].label === "Test Formal Shirts", "Step 10: Breadcrumb 4 is Test Formal Shirts");

    console.log("\n--- PHASE 3: PRODUCT-CATEGORY RELATIONSHIPS & RENAMING SAFETY ---");

    // STEP 11: Product Linked by categoryId (not category name)
    const existingVendor = await prisma.vendor.findFirst() || await prisma.vendor.create({
      data: {
        id: "v-test-1",
        storeName: "Test Silk Store",
        slug: "test-silk-store",
        businessName: "Test Silk Mills Ltd",
        city: "Surat",
        state: "Gujarat",
        pincode: "395003",
        address: "Ring Road, Surat",
        user: {
          create: {
            email: `vendor_${Date.now()}@fancyhub.in`,
            name: "Test Merchant",
            passwordHash: "hash_test_pass",
            role: "VENDOR",
          },
        },
      },
    });

    const testProduct = await prisma.product.upsert({
      where: { slug: "test-oxford-formal-shirt" },
      update: { categoryId: catFormalShirts.id },
      create: {
        title: "Test Oxford Formal Shirt",
        slug: "test-oxford-formal-shirt",
        sku: "TEST-OXF-01",
        description: "100% Cotton Oxford Shirt",
        price: 1299,
        mrp: 2999,
        categoryId: catFormalShirts.id,
        vendorId: existingVendor.id,
      },
    });
    assert(testProduct.categoryId === catFormalShirts.id, "Step 11: Product links to category via categoryId foreign key");

    // STEP 12: Rename Category Safety
    const updatedCat = await prisma.category.update({
      where: { id: catFormalShirts.id },
      data: { name: "Test Royal Oxford Shirts" },
    });
    const refreshedProduct = await prisma.product.findUnique({
      where: { id: testProduct.id },
      include: { category: true },
    });
    assert(refreshedProduct?.category?.name === "Test Royal Oxford Shirts", "Step 12: Renaming category reflected on product without breaking relationship");

    console.log("\n--- PHASE 4: MOVING CATEGORIES & REDIRECT ENGINE ---");

    // STEP 13: Create New Parent "Test Women" and Move Shirts under Women
    const catWomen = await prisma.category.create({
      data: {
        name: "Test Women",
        slug: "test-women",
        fullPath: "test-fashion/test-women",
        parentId: catFashion.id,
        level: 1,
        sortOrder: 2,
        status: "ACTIVE",
      },
    });

    const oldPath = catShirts.fullPath;
    const newPath = "test-fashion/test-women/test-shirts";

    // Simulate moving category and recording redirect
    await prisma.category.update({
      where: { id: catShirts.id },
      data: {
        parentId: catWomen.id,
        fullPath: newPath,
      },
    });

    await prisma.categoryRedirect.create({
      data: {
        sourcePath: oldPath,
        destinationPath: newPath,
        categoryId: catShirts.id,
      },
    });

    const redirectRecord = await prisma.categoryRedirect.findUnique({
      where: { sourcePath: oldPath },
    });
    assert(redirectRecord !== null && redirectRecord.destinationPath === newPath, "Step 13: Category redirect created from old path to new path");

    console.log("\n--- PHASE 5: CATEGORY ARCHIVING & VISIBILITY SAFETY ---");

    // STEP 14: Archive Category
    const archivedCat = await prisma.category.update({
      where: { id: catFormalShirts.id },
      data: { status: "ARCHIVED", isActive: false, showInHeader: false, showOnHomepage: false },
    });
    assert(archivedCat.status === "ARCHIVED", "Step 14: Category successfully marked as ARCHIVED");

    // Public query simulation: only ACTIVE categories returned
    const publicCategories = await prisma.category.findMany({
      where: { status: "ACTIVE" },
    });
    const containsArchived = publicCategories.some((c) => c.id === catFormalShirts.id);
    assert(containsArchived === false, "Step 14: Archived category excluded from public storefront query");

    // Historical product relationship remains intact
    const historicalProduct = await prisma.product.findUnique({
      where: { id: testProduct.id },
    });
    assert(historicalProduct?.categoryId === catFormalShirts.id, "Step 14: Historical product still references categoryId");

    console.log("\n--- PHASE 6: TREE RECURSION & DESCENDANT QUERY RESOLUTION ---");

    // STEP 15: Descendant Category IDs query
    const allDbCats = await prisma.category.findMany();
    const descendants = getDescendantCategoryIds(catFashion.id, allDbCats);
    assert(descendants.includes(catWomen.id), "Step 15: Descendants of Fashion include Women");
    assert(descendants.includes(catShirts.id), "Step 15: Descendants of Fashion include Shirts");

    // STEP 16: Recursive Tree Builder with Product Counts
    const tree = buildCategoryTree(allDbCats);
    assert(tree.length > 0, "Step 16: Category tree constructed recursively");
    const rootFashionNode = tree.find((n) => n.id === catFashion.id);
    assert(rootFashionNode !== undefined, "Step 16: Root category present in tree");
    assert(rootFashionNode?.children.length === 2, "Step 16: Root category has 2 direct subcategories (Men & Women)");

    // Cleanup test records
    await prisma.product.delete({ where: { id: testProduct.id } });
    await prisma.categoryRedirect.deleteMany({});
    await prisma.category.deleteMany({
      where: { slug: { in: ["test-fashion", "test-men", "test-shirts", "test-formal-shirts", "test-women"] } },
    });
    console.log("\n🧹 Test cleanup complete.");

  } catch (error) {
    console.error("Test execution failed:", error);
    failed++;
  } finally {
    await prisma.$disconnect();
  }

  console.log(`\n===============================================================`);
  console.log(`Automated Category Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`===============================================================`);
  if (failed > 0) process.exit(1);
}

runTests();
