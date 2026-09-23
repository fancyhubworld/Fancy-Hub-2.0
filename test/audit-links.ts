import fs from "fs";
import path from "path";
import { ROUTES } from "../src/lib/routes";
import { CATEGORIES_DATA, PRODUCTS_DATA, TAGS_DATA, BRANDS_DATA, VENDORS_DATA } from "../src/data/mock-catalog";

console.log("=================================================");
console.log("   FANCYHUB.IN — COMPREHENSIVE LINK & ROUTE AUDIT");
console.log("=================================================\n");

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

// 1. Check Catalog Data Integrity
console.log("1. Catalog Data Integrity:");
assert(CATEGORIES_DATA.length >= 8, `Categories loaded (${CATEGORIES_DATA.length})`);
assert(PRODUCTS_DATA.length >= 6, `Products loaded (${PRODUCTS_DATA.length})`);
assert(TAGS_DATA.length >= 6, `Tags loaded (${TAGS_DATA.length})`);
assert(BRANDS_DATA.length >= 4, `Brands loaded (${BRANDS_DATA.length})`);
assert(VENDORS_DATA.length >= 3, `Vendors loaded (${VENDORS_DATA.length})`);

// 2. Check Route Helper Methods
console.log("\n2. Centralized Route Helpers:");
assert(ROUTES.category("fashion") === "/category/fashion", "ROUTES.category('fashion') works");
assert(ROUTES.category("sarees", "fashion") === "/category/fashion/sarees", "ROUTES.category('sarees', 'fashion') hierarchical works");
assert(ROUTES.tag("trending") === "/tag/trending", "ROUTES.tag('trending') works");
assert(ROUTES.brand("fancyhub-audio") === "/brand/fancyhub-audio", "ROUTES.brand('fancyhub-audio') works");
assert(ROUTES.vendor("surat-silk-mills") === "/vendor/surat-silk-mills", "ROUTES.vendor('surat-silk-mills') works");
assert(ROUTES.product("fancyhub-pro-anc-earbuds") === "/product/fancyhub-pro-anc-earbuds", "ROUTES.product() works");
assert(ROUTES.orderDetail("FH89201") === "/orders/FH89201", "ROUTES.orderDetail() works");
assert(ROUTES.orderSuccess("FH89201") === "/order-success/FH89201", "ROUTES.orderSuccess() works");
assert(ROUTES.search("saree", "fashion") === "/search?q=saree&cat=fashion", "ROUTES.search() works");

// 3. Scan Files for Dead Links (href="#" or empty href)
console.log("\n3. Dead Link Scan in src/:");
function scanDir(dir: string, fileList: string[] = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath, fileList);
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allSrcFiles = scanDir(path.resolve(__dirname, "../src"));
let deadLinksFound = 0;
let emptyHrefsFound = 0;

for (const file of allSrcFiles) {
  const content = fs.readFileSync(file, "utf8");
  if (content.includes('href="#"') || content.includes("href={'#'}")) {
    console.error(`  [DEAD LINK] Found href="#" in ${file}`);
    deadLinksFound++;
  }
  if (content.includes('href=""') || content.includes("href={''}")) {
    console.error(`  [EMPTY LINK] Found href="" in ${file}`);
    emptyHrefsFound++;
  }
}

assert(deadLinksFound === 0, `Zero href="#" found across all source files (${allSrcFiles.length} files scanned)`);
assert(emptyHrefsFound === 0, `Zero href="" found across all source files`);

// 4. Verify Route Page Files Exist in File System
console.log("\n4. Route Filesystem Verification:");
const expectedPages = [
  "src/app/page.tsx",
  "src/app/not-found.tsx",
  "src/app/error.tsx",
  "src/app/loading.tsx",
  "src/app/search/page.tsx",
  "src/app/categories/page.tsx",
  "src/app/category/[...slug]/page.tsx",
  "src/app/products/page.tsx",
  "src/app/deals/page.tsx",
  "src/app/offers/page.tsx",
  "src/app/flash-sale/page.tsx",
  "src/app/new-arrivals/page.tsx",
  "src/app/best-sellers/page.tsx",
  "src/app/brands/page.tsx",
  "src/app/brand/[slug]/page.tsx",
  "src/app/tag/[slug]/page.tsx",
  "src/app/vendors/page.tsx",
  "src/app/compare/page.tsx",
  "src/app/wallet/page.tsx",
  "src/app/coupons/page.tsx",
  "src/app/notifications/page.tsx",
  "src/app/messages/page.tsx",
  "src/app/orders/page.tsx",
  "src/app/orders/[id]/page.tsx",
  "src/app/order-success/page.tsx",
  "src/app/order-success/[id]/page.tsx",
  "src/app/wishlist/page.tsx",
  "src/app/login/page.tsx",
  "src/app/register/page.tsx",
  "src/app/forgot-password/page.tsx",
  "src/app/reset-password/page.tsx",
  "src/app/verify-email/page.tsx",
  "src/app/verify-phone/page.tsx",
  "src/app/account/profile/page.tsx",
  "src/app/account/reviews/page.tsx",
  "src/app/account/security/page.tsx",
  "src/app/account/settings/page.tsx",
  "src/app/vendor/login/page.tsx",
  "src/app/vendor/products/new/page.tsx",
  "src/app/vendor/products/[id]/edit/page.tsx",
  "src/app/vendor/orders/[id]/page.tsx",
  "src/app/vendor/analytics/page.tsx",
  "src/app/vendor/customers/page.tsx",
  "src/app/vendor/reviews/page.tsx",
  "src/app/vendor/wallet/page.tsx",
  "src/app/vendor/shipping/page.tsx",
  "src/app/vendor/store/page.tsx",
  "src/app/vendor/store/settings/page.tsx",
  "src/app/vendor/store/seo/page.tsx",
  "src/app/vendor/staff/page.tsx",
  "src/app/vendor/messages/page.tsx",
  "src/app/vendor/announcements/page.tsx",
  "src/app/vendor/support/page.tsx",
  "src/app/admin/page.tsx",
  "src/app/admin/login/page.tsx",
  "src/app/admin/categories/page.tsx",
  "src/app/admin/vendors/[id]/page.tsx",
  "src/app/admin/products/page.tsx",
  "src/app/admin/brands/page.tsx",
  "src/app/admin/tags/page.tsx",
  "src/app/admin/orders/page.tsx",
  "src/app/admin/customers/page.tsx",
  "src/app/admin/payments/page.tsx",
  "src/app/admin/commissions/page.tsx",
  "src/app/admin/coupons/page.tsx",
  "src/app/admin/reviews/page.tsx",
  "src/app/admin/returns/page.tsx",
  "src/app/admin/refunds/page.tsx",
  "src/app/admin/shipping/page.tsx",
  "src/app/admin/theme-studio/page.tsx",
  "src/app/admin/visual-builder/page.tsx",
  "src/app/admin/banners/page.tsx",
  "src/app/admin/pages/page.tsx",
  "src/app/p/[slug]/page.tsx",
  "src/app/admin/menus/page.tsx",
  "src/app/admin/users/page.tsx",
  "src/app/admin/roles/page.tsx",
  "src/app/admin/notifications/page.tsx",
  "src/app/admin/plans/page.tsx",
  "src/app/admin/audit-logs/page.tsx",
  "src/app/admin/reports/page.tsx",
  "src/app/admin/security/page.tsx",
  "src/app/admin/media/page.tsx",
  "src/app/admin/widget-marketplace/page.tsx",
  "src/app/admin/website-control/page.tsx",
  "src/app/admin/redirects/page.tsx",
  "src/app/admin/theme-versions/page.tsx",
  "src/app/admin/scheduled-changes/page.tsx",
];

for (const p of expectedPages) {
  const fullPath = path.resolve(__dirname, "..", p);
  assert(fs.existsSync(fullPath), `Page exists: ${p}`);
}

console.log(`\nAudit Complete: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("ALL LINK AUDITS & ROUTE TESTS PASSED 100%!");
}
