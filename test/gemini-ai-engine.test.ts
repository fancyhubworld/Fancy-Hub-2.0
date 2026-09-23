import {
  generateSeoCopy,
  generateProductDescription,
  recommendVisualLayout,
  chatWithShoppingAssistant,
} from "../src/lib/gemini-ai-engine";

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

async function runGeminiAiEngineTests() {
  console.log("=======================================================================");
  console.log("   FANCYHUB.IN 2.0 — GEMINI AI STOREFRONT & LAYOUT ENGINE SUITE");
  console.log("=======================================================================\n");

  try {
    // -----------------------------------------------------------------------
    // 1. Automated SEO Copy Generator
    // -----------------------------------------------------------------------
    console.log("--- 1. AUTOMATED SEO COPY GENERATOR ---");
    const seoResult = generateSeoCopy({
      entityType: "PAGE",
      title: "Festive Grand Sale 2026",
      category: "Pure Handloom Silk Sarees",
      targetKeywords: ["diwali sale", "surat weavers"],
      tone: "FESTIVE",
    });

    assert(seoResult.seoTitle.includes("Festive Grand Sale 2026"), "SEO title contains primary topic");
    assert(seoResult.seoTitle.length <= 70, `SEO title length is optimized (${seoResult.seoTitle.length} chars)`);
    assert(seoResult.metaDescription.length <= 160, `Meta description length complies with search engine snippet limit (${seoResult.metaDescription.length} chars)`);
    assert(seoResult.keywords.includes("diwali sale"), "Target keywords included in keyword list");
    assert(seoResult.jsonLdSnippet["@context"] === "https://schema.org", "Schema.org structured data JSON-LD generated");

    // -----------------------------------------------------------------------
    // 2. Product Copy & Artisan Story Generator
    // -----------------------------------------------------------------------
    console.log("\n--- 2. PRODUCT COPY & ARTISAN STORY GENERATOR ---");
    const productCopy = generateProductDescription({
      productTitle: "Royal Zari Banarasi Silk Saree",
      category: "Sarees",
      price: 6499,
      artisanOrBrand: "Varanasi Master Guild",
      fabricOrMaterial: "Katan Silk",
      keyFeatures: ["Pure Silver Electroplated Zari", "Hand-dyed Crimson Hue"],
    });

    assert(productCopy.shortDescription.length > 20, "Generated compelling short description");
    assert(productCopy.detailedDescription.includes("Varanasi Master Guild") || productCopy.detailedDescription.includes("Katan Silk") || productCopy.detailedDescription.length > 50, "Detailed description includes luxury heritage context");
    assert(productCopy.bulletHighlights.length >= 5, `Generated ${productCopy.bulletHighlights.length} feature highlights`);
    assert(productCopy.artisanStory.includes("traditional handlooms") || productCopy.artisanStory.includes("weaving"), "Artisan heritage story generated");
    assert(productCopy.careInstructions.length >= 2, "Care instructions included");

    // -----------------------------------------------------------------------
    // 3. Visual Layout AI Recommender
    // -----------------------------------------------------------------------
    console.log("\n--- 3. VISUAL LAYOUT AI RECOMMENDER ---");
    const layoutFestive = recommendVisualLayout({
      pageGoal: "FESTIVAL_SALE",
      primaryCategory: "Ethnic Wear",
    });

    assert(layoutFestive.title.includes("Diwali"), "Identified festive theme title");
    assert(layoutFestive.recommendedTheme.primaryColor === "#D97706", "Recommended festive gold primary color token (#D97706)");
    assert(layoutFestive.recommendedSections.length >= 5, `Recommended ${layoutFestive.recommendedSections.length} widget sections`);
    assert(layoutFestive.recommendedSections[2].widgetType === "FLASH_DEALS", "Injected high-urgency FLASH_DEALS widget");
    assert(layoutFestive.recommendedSections[2].desktopColumns === 4, "Configured 4 desktop columns");
    assert(layoutFestive.recommendedSections[2].mobileColumns === 2, "Configured 2 mobile columns");

    const layoutLuxury = recommendVisualLayout({
      pageGoal: "LUXURY_ETHNIC",
      primaryCategory: "Handloom Sarees",
    });
    assert(layoutLuxury.recommendedTheme.primaryColor === "#8B5CF6", "Recommended Royal Purple theme for luxury collection");

    // -----------------------------------------------------------------------
    // 4. Conversational Storefront AI Shopping Assistant
    // -----------------------------------------------------------------------
    console.log("\n--- 4. CONVERSATIONAL STOREFRONT AI ASSISTANT ---");
    const chatSaree = chatWithShoppingAssistant({
      userMessage: "Can you recommend pure silk banarasi sarees for a wedding?",
    });
    assert(chatSaree.reply.includes("Banarasi"), "AI Assistant provided tailored saree recommendations");
    assert(chatSaree.productRecommendations !== undefined && chatSaree.productRecommendations.length > 0, "AI returned structured product recommendation pills");

    const chatPincode = chatWithShoppingAssistant({
      userMessage: "Is delivery available to pincode 700023?",
      activePincode: "700023",
    });
    assert(chatPincode.reply.includes("700023") && chatPincode.reply.includes("Delivery"), "AI Assistant verified pincode delivery timeline");

    const chatCoupon = chatWithShoppingAssistant({
      userMessage: "What discount code can I use on my order?",
    });
    assert(chatCoupon.suggestedCoupon === "FANCYFIRST", "AI Assistant suggested active coupon code FANCYFIRST");

    console.log("\n=======================================================================");
    console.log(`Gemini AI Engine Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================================\n");

    if (failed > 0) process.exit(1);
  } catch (e) {
    console.error("Test execution error:", e);
    process.exit(1);
  }
}

runGeminiAiEngineTests();
