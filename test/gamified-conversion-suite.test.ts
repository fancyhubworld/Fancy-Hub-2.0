import { WIDGET_REGISTRY } from "../src/lib/widget-registry";
import {
  DEFAULT_FESTIVE_SLICES,
  validateIndianPhoneNumber,
  calculateSpinResult,
  generateScratchCardReward,
} from "../src/lib/gamification-engine";

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

async function runGamifiedConversionTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN 2.0 — GAMIFIED FESTIVE CONVERSION SUITE");
  console.log("=======================================================================\n");

  try {
    // -----------------------------------------------------------------------
    // 1. WIDGET REGISTRY INTEGRATION
    // -----------------------------------------------------------------------
    console.log("--- 1. WIDGET REGISTRY INTEGRATION ---");
    const spinWheelDef = WIDGET_REGISTRY["SPIN_WHEEL"];
    assert(spinWheelDef !== undefined, "SPIN_WHEEL widget is registered in WIDGET_REGISTRY");
    assert(spinWheelDef.category === "marketing", "Widget categorized under 'marketing'");
    assert(spinWheelDef.defaultSettings.requirePhone === true, "Phone number capture enabled by default");

    const scratchCardDef = WIDGET_REGISTRY["SCRATCH_CARD"];
    assert(scratchCardDef !== undefined, "SCRATCH_CARD widget is registered in WIDGET_REGISTRY");
    assert(scratchCardDef.category === "marketing", "Scratch Card categorized under 'marketing'");

    // -----------------------------------------------------------------------
    // 2. INDIAN MOBILE NUMBER VALIDATION (+91)
    // -----------------------------------------------------------------------
    console.log("\n--- 2. INDIAN MOBILE NUMBER VALIDATION (+91) ---");
    const valid1 = validateIndianPhoneNumber("9876543210");
    assert(valid1.isValid === true && valid1.sanitized === "9876543210", "Valid 10-digit number accepted");

    const valid2 = validateIndianPhoneNumber("+91 98765 43210");
    assert(valid2.isValid === true && valid2.sanitized === "9876543210", "Formatted +91 number sanitized & accepted");

    const valid3 = validateIndianPhoneNumber("09123456789");
    assert(valid3.isValid === true && valid3.sanitized === "9123456789", "Leading zero stripped & accepted");

    const invalid1 = validateIndianPhoneNumber("12345");
    assert(invalid1.isValid === false, "Short invalid number rejected");

    const invalid2 = validateIndianPhoneNumber("5555555555");
    assert(invalid2.isValid === false, "Number not starting with 6/7/8/9 rejected");

    // -----------------------------------------------------------------------
    // 3. WEIGHTED PROBABILITY & SPIN ANGLE MATH
    // -----------------------------------------------------------------------
    console.log("\n--- 3. WEIGHTED PROBABILITY & SPIN ANGLE MATH ---");
    const spin1 = calculateSpinResult(DEFAULT_FESTIVE_SLICES, "9876543210");
    assert(spin1.winningSlice !== undefined, "Calculated valid winning slice");
    assert(spin1.couponCode.length >= 5, `Generated active coupon code: ${spin1.couponCode}`);
    assert(spin1.spinAngle >= 1800, `Calculated realistic multi-rotation spin angle: ${spin1.spinAngle}°`);
    assert(spin1.expiresInMinutes === 30, "Enforced 30-minute urgency timer");

    // Test distribution across 1000 iterations to ensure all slices are winnable
    const winCounts: Record<string, number> = {};
    for (let i = 0; i < 1000; i++) {
      const res = calculateSpinResult(DEFAULT_FESTIVE_SLICES);
      winCounts[res.winningSlice.id] = (winCounts[res.winningSlice.id] || 0) + 1;
    }

    assert(winCounts["slice-diwali-500"] > 50, `₹500 OFF won ${winCounts["slice-diwali-500"]} times (expected ~150)`);
    assert(winCounts["slice-free-shipping"] > 150, `Free Shipping won ${winCounts["slice-free-shipping"]} times (expected ~300)`);
    assert(Object.keys(winCounts).length === DEFAULT_FESTIVE_SLICES.length, "All 5 configured festive slices were hit");

    // -----------------------------------------------------------------------
    // 4. SCRATCH CARD REWARDS GENERATION
    // -----------------------------------------------------------------------
    console.log("\n--- 4. SCRATCH CARD REWARDS GENERATION ---");
    const scratch = generateScratchCardReward();
    assert(scratch.id.startsWith("scratch-"), "Generated valid scratch reward ID");
    assert(scratch.couponCode.length >= 6, `Generated valid coupon code: ${scratch.couponCode}`);
    assert(scratch.minimumOrderValue > 0, `Configured minimum order value threshold (₹${scratch.minimumOrderValue})`);
    assert(scratch.validityHours === 24, "Configured 24-hour reward validity");

    console.log("\n=======================================================================");
    console.log(`Gamification Suite Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution error:", e);
    process.exit(1);
  }
}

runGamifiedConversionTests();
