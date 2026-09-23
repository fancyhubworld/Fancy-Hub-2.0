import { PrismaClient } from "@prisma/client";
import { invalidateCategoryCache } from "../src/lib/categories";

const prisma = new PrismaClient();

const mobileList = [
  { name: "Smartphones", slug: "smartphones", desc: "Latest 5G Android & iOS flagship and budget smartphones" },
  { name: "Feature Phones", slug: "feature-phones", desc: "Durable keypad, long battery life & dual-SIM basic mobile phones" },
  { name: "Refurbished Phones", slug: "refurbished-phones", desc: "Certified pre-owned and refurbished phones with warranty" },
  { name: "Phone Cases", slug: "phone-cases", desc: "Shockproof back covers, leather flip cases, silicone & aesthetic covers" },
  { name: "Screen Protectors", slug: "screen-protectors", desc: "Tempered glass, matte screen guards, privacy & edge-to-edge protectors" },
  { name: "Chargers", slug: "chargers", desc: "Fast chargers, GaN adapters, USB-C PD power bricks & warp chargers" },
  { name: "Power Banks", slug: "power-banks", desc: "10,000mAh, 20,000mAh fast-charging portable power banks" },
  { name: "Mobile Cables", slug: "mobile-cables", desc: "Braided USB Type-C, Lightning, Micro-USB & high-speed data cables" },
  { name: "Car Chargers", slug: "car-chargers", desc: "Dual port fast car chargers & magnetic dashboard charging mounts" },
  { name: "Wireless Chargers", slug: "wireless-chargers", desc: "Qi certified wireless charging pads, stands & MagSafe chargers" },
];

async function main() {
  console.log("📱 Seeding Mobile Phones & 10 Subcategories into Database...");

  // 1. Create Root Category: Mobile Phones
  const root = await prisma.category.upsert({
    where: { fullPath: "mobile-phones" },
    update: {
      name: "Mobile Phones",
      slug: "mobile-phones",
      fullPath: "mobile-phones",
      description: "Explore latest smartphones, 5G devices, feature phones, cases, chargers and mobile accessories.",
      icon: "Smartphone",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
      bannerImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600&auto=format&fit=crop&q=80",
      isFeatured: true,
      showInHeader: true,
      showOnHomepage: true,
      showInMobile: true,
      showInFooter: true,
      showInSearch: true,
      status: "ACTIVE",
      level: 0,
      sortOrder: 4,
      seoTitle: "Mobile Phones Online - 5G Smartphones & Accessories | FancyHub.in",
      seoDescription: "Shop top smartphones, feature phones, chargers, power banks & screen guards at best prices on FancyHub.in.",
    },
    create: {
      id: "cat-mobile-phones",
      name: "Mobile Phones",
      slug: "mobile-phones",
      fullPath: "mobile-phones",
      description: "Explore latest smartphones, 5G devices, feature phones, cases, chargers and mobile accessories.",
      icon: "Smartphone",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
      bannerImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600&auto=format&fit=crop&q=80",
      isFeatured: true,
      showInHeader: true,
      showOnHomepage: true,
      showInMobile: true,
      showInFooter: true,
      showInSearch: true,
      status: "ACTIVE",
      level: 0,
      sortOrder: 4,
      seoTitle: "Mobile Phones Online - 5G Smartphones & Accessories | FancyHub.in",
      seoDescription: "Shop top smartphones, feature phones, chargers, power banks & screen guards at best prices on FancyHub.in.",
    },
  });

  console.log(`✅ Root category created: ${root.name} (/${root.fullPath}) [ID: ${root.id}]`);

  // 2. Create 10 Subcategories under Mobile Phones
  let sort = 1;
  for (const item of mobileList) {
    const fullPath = `mobile-phones/${item.slug}`;
    const sub = await prisma.category.upsert({
      where: { fullPath },
      update: {
        name: item.name,
        slug: item.slug,
        fullPath,
        parentId: root.id,
        level: 1,
        description: item.desc,
        status: "ACTIVE",
        isFeatured: sort <= 5,
        showInHeader: true,
        showOnHomepage: true,
        showInMobile: true,
        showInFooter: true,
        showInSearch: true,
        sortOrder: sort,
        seoTitle: `${item.name} Online - Best Deals & Offers | FancyHub.in`,
        seoDescription: `Buy ${item.name} at best prices with manufacturer warranty and fast shipping on FancyHub.in.`,
      },
      create: {
        id: `cat-${item.slug}`,
        name: item.name,
        slug: item.slug,
        fullPath,
        parentId: root.id,
        level: 1,
        description: item.desc,
        status: "ACTIVE",
        isFeatured: sort <= 5,
        showInHeader: true,
        showOnHomepage: true,
        showInMobile: true,
        showInFooter: true,
        showInSearch: true,
        sortOrder: sort,
        seoTitle: `${item.name} Online - Best Deals & Offers | FancyHub.in`,
        seoDescription: `Buy ${item.name} at best prices with manufacturer warranty and fast shipping on FancyHub.in.`,
      },
    });

    // Create redirect from prefixed slug e.g. "mobile phones-smartphones" -> "mobile-phones/smartphones"
    const alternateSlug = `mobile-phones-${item.slug}`;
    await prisma.categoryRedirect.upsert({
      where: { sourcePath: alternateSlug },
      update: { destinationPath: fullPath, categoryId: sub.id },
      create: { sourcePath: alternateSlug, destinationPath: fullPath, categoryId: sub.id },
    });

    console.log(`  └─ [${sort}/10] ${sub.name} (/${sub.fullPath})`);
    sort++;
  }

  invalidateCategoryCache();
  console.log("\n🎉 Successfully added Mobile Phones and all 10 Subcategories to the database!");
}

main()
  .catch((e) => {
    console.error("Error inserting mobile phone categories:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
