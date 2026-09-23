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

async function runDynamicDataSourceTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN — DYNAMIC DATA SOURCE & CATEGORY SYSTEM TESTS");
  console.log("=======================================================================\n");

  try {
    // 1. Test Dynamic Category Database Integration
    console.log("--- PHASE 1: DATABASE-DRIVEN CATEGORY QUERIES ---");
    const allCategories = await prisma.category.findMany({
      where: { status: "ACTIVE" },
      include: { _count: { select: { products: true, children: true } } },
      orderBy: { sortOrder: "asc" },
    });

    assert(allCategories.length >= 10, `Loaded ${allCategories.length} live database categories`);
    const rootCategories = allCategories.filter((c) => !c.parentId);
    assert(rootCategories.length >= 4, `Found ${rootCategories.length} root departments (Menswear, Womenswear, Mobile Phones, etc.)`);

    const menswearRoot = allCategories.find((c) => c.slug === "menswear");
    assert(menswearRoot !== undefined, "Found 'menswear' root category in database");

    const menswearSubcats = allCategories.filter((c) => c.parentId === menswearRoot?.id);
    assert(menswearSubcats.length >= 10, `Found ${menswearSubcats.length} subcategories under Menswear root`);

    // 2. Test Dynamic Category Filter on Products
    console.log("\n--- PHASE 2: DYNAMIC PRODUCT QUERIES BY CATEGORY ---");
    // Insert a test product under Menswear if needed or query existing
    const testCategory = menswearSubcats[0] || menswearRoot;
    const testVendor = await prisma.vendor.findFirst() || await prisma.vendor.create({
      data: {
        storeName: "Surat Silk Mills",
        slug: "surat-silk-mills",
        email: "seller@suratsilk.in",
        phone: "+919876543210",
        city: "Surat",
        state: "Gujarat",
        status: "ACTIVE",
        isVerified: true,
      },
    });

    const prod1 = await prisma.product.create({
      data: {
        title: "Dynamic Cotton Linen Shirt",
        slug: `dynamic-cotton-linen-shirt-${Date.now()}`,
        sku: `SKU-DYN-${Date.now()}`,
        description: "100% pure organic cotton handcrafted casual shirt",
        price: 1499,
        mrp: 2999,
        discountPercent: 50,
        categoryId: testCategory!.id,
        vendorId: testVendor.id,
        status: "PUBLISHED",
        isFeatured: true,
        ratings: 4.9,
        reviewCount: 88,
      },
    });
    assert(prod1.id !== undefined, `Created test product under category '${testCategory!.name}'`);

    // Query by Category Slug
    const categoryProducts = await prisma.product.findMany({
      where: { status: "PUBLISHED", category: { slug: testCategory!.slug } },
      include: { category: true, vendor: true },
    });
    assert(categoryProducts.some((p) => p.id === prod1.id), `Category query '${testCategory!.slug}' returned dynamic test product`);

    // 3. Test Dynamic Strategy: Discounted
    console.log("\n--- PHASE 3: DYNAMIC PRODUCT STRATEGY: DISCOUNTED ---");
    const discountedProducts = await prisma.product.findMany({
      where: { status: "PUBLISHED", discountPercent: { gt: 0 } },
    });
    assert(discountedProducts.some((p) => p.id === prod1.id), "Discounted query strategy returned discounted products");

    // 4. Test Dynamic Strategy: Trending / Featured
    console.log("\n--- PHASE 4: DYNAMIC PRODUCT STRATEGY: TRENDING & FEATURED ---");
    const featuredProducts = await prisma.product.findMany({
      where: { status: "PUBLISHED", isFeatured: true },
    });
    assert(featuredProducts.some((p) => p.id === prod1.id), "Featured query strategy returned featured products");

    // 5. Test Dynamic Strategy: Vendor
    console.log("\n--- PHASE 5: DYNAMIC PRODUCT STRATEGY: BY VENDOR ---");
    const vendorProducts = await prisma.product.findMany({
      where: { status: "PUBLISHED", vendor: { slug: testVendor!.slug } },
    });
    assert(vendorProducts.some((p) => p.id === prod1.id), `Vendor query '${testVendor!.slug}' returned vendor products`);

    // 6. Test Dynamic Strategy: Search Query
    console.log("\n--- PHASE 6: DYNAMIC PRODUCT STRATEGY: SEARCH QUERY ---");
    const searchResults = await prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: "Linen" } },
          { description: { contains: "Linen" } },
        ],
      },
    });
    assert(searchResults.some((p) => p.id === prod1.id), "Search query 'Linen' returned matching product");

    // 7. Cleanup
    await prisma.product.delete({ where: { id: prod1.id } });
    console.log("\n🧹 Test cleanup complete.");

    console.log("=======================================================================");
    console.log(`Dynamic Data Source Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (error) {
    console.error("Test execution error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runDynamicDataSourceTests();
