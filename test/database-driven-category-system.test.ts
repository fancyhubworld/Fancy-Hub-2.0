import prisma from "../src/lib/prisma";
import {
  slugifyCategory,
  computeFullPath,
  computeLevel,
  detectCircularDependency,
  buildCategoryTree,
  buildCategoryBreadcrumbs,
} from "../src/lib/categories";

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

async function runCategorySystemTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN 2.0 — DATABASE-DRIVEN CATEGORY SYSTEM SUITE");
  console.log("=======================================================================\n");

  try {
    // -----------------------------------------------------------------------
    // 1. UNLIMITED NESTED HIERARCHY & PARENT-CHILD INTEGRITY
    // -----------------------------------------------------------------------
    console.log("--- 1. UNLIMITED NESTED HIERARCHY & TREE BUILDER ---");
    const mockFlat = [
      { id: "c-root", name: "Fashion", slug: "fashion", fullPath: "fashion", parentId: null, level: 0, sortOrder: 1, status: "ACTIVE" },
      { id: "c-men", name: "Men", slug: "men", fullPath: "fashion/men", parentId: "c-root", level: 1, sortOrder: 1, status: "ACTIVE" },
      { id: "c-shirts", name: "Shirts", slug: "shirts", fullPath: "fashion/men/shirts", parentId: "c-men", level: 2, sortOrder: 1, status: "ACTIVE" },
      { id: "c-formal", name: "Formal Shirts", slug: "formal-shirts", fullPath: "fashion/men/shirts/formal-shirts", parentId: "c-shirts", level: 3, sortOrder: 1, status: "ACTIVE" },
      { id: "c-women", name: "Women", slug: "women", fullPath: "fashion/women", parentId: "c-root", level: 1, sortOrder: 2, status: "ACTIVE" },
      { id: "c-sarees", name: "Sarees", slug: "sarees", fullPath: "fashion/women/sarees", parentId: "c-women", level: 2, sortOrder: 1, status: "ACTIVE" },
    ];

    const tree = buildCategoryTree(mockFlat);
    assert(tree.length === 1, "Root category tree has 1 top-level node (Fashion)");
    assert(tree[0].name === "Fashion", "Top-level node is 'Fashion'");
    assert(tree[0].children.length === 2, "Fashion has 2 Level 1 children (Men, Women)");
    
    const menNode = tree[0].children.find((c) => c.slug === "men");
    assert(menNode !== undefined, "Found 'Men' under Fashion");
    assert(menNode!.children.length === 1, "Men has 1 Level 2 child (Shirts)");
    
    const shirtsNode = menNode!.children[0];
    assert(shirtsNode.slug === "shirts", "Level 2 node is 'Shirts'");
    assert(shirtsNode.children.length === 1, "Shirts has 1 Level 3 deep nested child (Formal Shirts)");
    assert(shirtsNode.children[0].fullPath === "fashion/men/shirts/formal-shirts", "Level 3 fullPath verified: fashion/men/shirts/formal-shirts");

    // -----------------------------------------------------------------------
    // 2. SLUG GENERATION & PATH COMPUTATION
    // -----------------------------------------------------------------------
    console.log("\n--- 2. SLUG GENERATION & PATH COMPUTATION ---");
    assert(slugifyCategory("Men's Pure Silk Shirts & Kurtas!") === "mens-pure-silk-shirts-and-kurtas", "Slugify sanitizes punctuation, apostrophes, and ampersands");
    
    const categoryMap = new Map(mockFlat.map((c) => [c.id, c]));
    const computedPath = computeFullPath("casual-shirts", "c-men", categoryMap);
    assert(computedPath === "fashion/men/casual-shirts", "Dynamically computed recursive parent path: fashion/men/casual-shirts");
    
    const computedLevel = computeLevel("c-shirts", categoryMap);
    assert(computedLevel === 3, `Calculated correct depth level: ${computedLevel}`);

    // -----------------------------------------------------------------------
    // 3. CIRCULAR HIERARCHY PROTECTION
    // -----------------------------------------------------------------------
    console.log("\n--- 3. CIRCULAR HIERARCHY PROTECTION ---");
    const isCycle1 = detectCircularDependency("c-root", "c-shirts", mockFlat);
    assert(isCycle1 === true, "Safeguard caught cycle: Fashion cannot become a child of Shirts");

    const isCycle2 = detectCircularDependency("c-shirts", "c-root", mockFlat);
    assert(isCycle2 === false, "Valid assignment: Shirts can be a direct child of Fashion");

    // -----------------------------------------------------------------------
    // 4. DYNAMIC BREADCRUMBS GENERATION
    // -----------------------------------------------------------------------
    console.log("\n--- 4. DYNAMIC BREADCRUMBS GENERATION ---");
    const breadcrumbMap = new Map(mockFlat.map((c) => [c.id, { id: c.id, name: c.name, fullPath: c.fullPath, parentId: c.parentId }]));
    const crumbs = buildCategoryBreadcrumbs("c-formal", breadcrumbMap);
    assert(crumbs.length === 6, `Generated complete 6-step breadcrumb chain (Found: ${crumbs.length})`);
    assert(crumbs[0].label === "Home", "Crumbs step 1: Home");
    assert(crumbs[1].label === "Categories", "Crumbs step 2: Categories");
    assert(crumbs[2].label === "Fashion" && crumbs[2].href === "/category/fashion", "Crumbs step 3: Fashion (/category/fashion)");
    assert(crumbs[3].label === "Men" && crumbs[3].href === "/category/fashion/men", "Crumbs step 4: Men (/category/fashion/men)");
    assert(crumbs[4].label === "Shirts" && crumbs[4].href === "/category/fashion/men/shirts", "Crumbs step 5: Shirts (/category/fashion/men/shirts)");
    assert(crumbs[5].label === "Formal Shirts" && crumbs[5].href === "/category/fashion/men/shirts/formal-shirts", "Crumbs step 6: Formal Shirts (/category/fashion/men/shirts/formal-shirts)");

    // -----------------------------------------------------------------------
    // 5. DATABASE INTEGRATION & PRISMA CATEGORY OPERATIONS
    // -----------------------------------------------------------------------
    console.log("\n--- 5. DATABASE PRISMA INTEGRATION ---");
    const dbCategories = await prisma.category.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true, slug: true, fullPath: true, parentId: true },
    });
    assert(dbCategories.length > 0, `Database contains ${dbCategories.length} active categories`);

    // Verify Fashion / Menswear root in DB
    const fashionOrMenswear = dbCategories.find((c) => c.slug === "menswear" || c.slug === "fashion" || c.parentId === null);
    assert(fashionOrMenswear !== undefined, `Verified root category in DB: ${fashionOrMenswear?.name} (${fashionOrMenswear?.slug})`);

    console.log("\n=======================================================================");
    console.log(`Category System Test Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution error:", e);
    process.exit(1);
  }
}

runCategorySystemTests();
