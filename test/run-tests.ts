import { lookupPincode, getEstimatedDeliveryDate } from "../src/lib/pincodes";
import { formatINR, calculateSavings } from "../src/lib/design-tokens";
import { generateOrderNumber } from "../src/lib/utils";
import { PRODUCTS_DATA, COUPONS_DATA, VENDORS_DATA } from "../src/data/mock-catalog";

console.log("🚀 Running FancyHub.in Production Test Suite...\n");

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    failed++;
  }
}

// 1. PIN Code Serviceability Test
const kolkataPin = lookupPincode("700023");
assert(kolkataPin.isServiceable === true, "Kolkata 700023 is serviceable");
assert(kolkataPin.city === "Kolkata", "700023 resolves to Kolkata");
assert(kolkataPin.deliveryDays === 2, "700023 delivery ETA is 2 days");

const mumbaiPin = lookupPincode("400050");
assert(mumbaiPin.city === "Mumbai", "400050 resolves to Mumbai");

const invalidPin = lookupPincode("000000");
assert(invalidPin.isServiceable === false, "000000 is recognized as invalid");

// 2. Pricing & Currency Formatting
assert(formatINR(1499).includes("1,499"), "1499 formats with Indian comma grouping ₹1,499");
const savings = calculateSavings(3999, 1499);
assert(savings.amount === 2500, "Savings amount is 3999 - 1499 = 2500");
assert(savings.percent === 63, "Savings percentage is 63%");

// 3. Multi-Vendor Catalog Integrity
assert(PRODUCTS_DATA.length >= 6, "At least 6 core products configured");
assert(VENDORS_DATA.length >= 5, "At least 5 Indian vendors configured");

// 4. Order Number Generation
const orderNo = generateOrderNumber();
assert(orderNo.startsWith("FH"), `Order Number starts with FH: ${orderNo}`);

// 5. Coupon System Verification
const firstCoupon = COUPONS_DATA.find(c => c.code === "FANCYFIRST");
assert(firstCoupon !== undefined, "FANCYFIRST coupon is present");
assert(firstCoupon?.value === 150, "FANCYFIRST discount value is ₹150");

console.log(`\n========================================`);
console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
console.log(`========================================`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!\n");
  process.exit(0);
}
