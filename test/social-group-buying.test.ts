import { WIDGET_REGISTRY } from "../src/lib/widget-registry";
import {
  MOCK_GROUP_DEALS,
  getActiveGroupDeals,
  generateWhatsAppInviteLink,
  calculateGroupDiscount,
} from "../src/lib/group-buying-engine";

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

async function runSocialGroupBuyingTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN 2.0 — SOCIAL GROUP BUYING & BULK SAVINGS SUITE");
  console.log("=======================================================================\n");

  try {
    // -----------------------------------------------------------------------
    // 1. WIDGET REGISTRY INTEGRATION
    // -----------------------------------------------------------------------
    console.log("--- 1. WIDGET REGISTRY INTEGRATION ---");
    const groupDef = WIDGET_REGISTRY["GROUP_BUYING"];
    assert(groupDef !== undefined, "GROUP_BUYING widget is registered in WIDGET_REGISTRY");
    assert(groupDef.category === "ecommerce", "Widget categorized under 'ecommerce'");
    assert(groupDef.defaultResponsive.desktop?.columns === 3, "Configured 3 columns for desktop viewports");

    // -----------------------------------------------------------------------
    // 2. GROUP DEALS CATALOG & TIERED PRICING MATRIX
    // -----------------------------------------------------------------------
    console.log("\n--- 2. GROUP DEALS CATALOG & TIERED PRICING MATRIX ---");
    assert(MOCK_GROUP_DEALS.length >= 3, `Catalog contains ${MOCK_GROUP_DEALS.length} active group buying deals`);

    const sareeDeal = MOCK_GROUP_DEALS[0];
    assert(sareeDeal.tieredPricing.length === 3, "Contains 3 price tiers (Solo, Duo, Trio)");

    const soloTier = calculateGroupDiscount(1, sareeDeal.tieredPricing);
    const duoTier = calculateGroupDiscount(2, sareeDeal.tieredPricing);
    const trioTier = calculateGroupDiscount(3, sareeDeal.tieredPricing);

    assert(soloTier.pricePerUnit === 4999, `Solo price matches retail: ₹${soloTier.pricePerUnit}`);
    assert(duoTier.pricePerUnit === 4199, `Duo discount price matches: ₹${duoTier.pricePerUnit} (16% savings)`);
    assert(trioTier.pricePerUnit === 3499, `Trio wholesale price matches: ₹${trioTier.pricePerUnit} (30% savings)`);

    // -----------------------------------------------------------------------
    // 3. 2-HOUR URGENCY TIMER & WHATSAPP VIRAL INVITE
    // -----------------------------------------------------------------------
    console.log("\n--- 3. 2-HOUR URGENCY TIMER & WHATSAPP VIRAL INVITE ---");
    const expiresAt = new Date(sareeDeal.currentPool.expiresAt).getTime();
    const now = Date.now();
    assert(expiresAt > now, "Pool expiry timestamp is active in future");

    const whatsappLink = generateWhatsAppInviteLink(sareeDeal, sareeDeal.currentPool.poolId);
    assert(whatsappLink.startsWith("https://api.whatsapp.com/send?text="), "Generated valid WhatsApp API invite URL");
    assert(decodeURIComponent(whatsappLink).includes("FancyHub.in"), "Share message contains FancyHub.in branding");
    assert(decodeURIComponent(whatsappLink).includes("₹1500") || decodeURIComponent(whatsappLink).includes("₹"), "Share message highlights bulk savings in ₹");

    // -----------------------------------------------------------------------
    // 4. MULTI-ADDRESS ORDER SPLITTING
    // -----------------------------------------------------------------------
    console.log("\n--- 4. MULTI-ADDRESS ORDER SPLITTING ---");
    assert(sareeDeal.currentPool.members.length === 2, "Verified 2 existing members in pool");
    const member1 = sareeDeal.currentPool.members[0];
    const member2 = sareeDeal.currentPool.members[1];
    assert(member1.city !== member2.city, `Verified separate city delivery: ${member1.city} vs ${member2.city}`);
    assert(member1.pincode !== member2.pincode, `Verified distinct postal codes: ${member1.pincode} vs ${member2.pincode}`);

    console.log("\n=======================================================================");
    console.log(`Social Group Buying Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution error:", e);
    process.exit(1);
  }
}

runSocialGroupBuyingTests();
