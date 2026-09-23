import { PrismaClient } from "@prisma/client";
import { invalidateCategoryCache } from "../src/lib/categories";

const prisma = new PrismaClient();

const womenswearList = [
  { name: "Women's Dresses", slug: "womens-dresses", desc: "Maxi, midi, cocktail, wrap, a-line & party dresses" },
  { name: "Women's Tops", slug: "womens-tops", desc: "Crop tops, blouses, peplum, formal & casual shirts" },
  { name: "Women's T-Shirts", slug: "womens-tshirts", desc: "Graphic, oversized, crew neck & boyfriend tees" },
  { name: "Women's Jeans", slug: "womens-jeans", desc: "High-waist, skinny, mom jeans, flared & straight fit denim" },
  { name: "Women's Skirts", slug: "womens-skirts", desc: "Pleated, pencil, flared, mini, midi & maxi skirts" },
  { name: "Women's Jackets", slug: "womens-jackets", desc: "Denim jackets, shrugs, blazers, coats & bombers" },
  { name: "Women's Ethnic Wear", slug: "womens-ethnic-wear", desc: "Lehengas, anarkalis, sharara sets & festive wear" },
  { name: "Women's Kurtis", slug: "womens-kurtis", desc: "Chikankari, printed, cotton, silk & designer kurtis" },
  { name: "Women's Sarees", slug: "womens-sarees", desc: "Banarasi, Kanjivaram, Chiffon, Georgette & Silk sarees" },
  { name: "Women's Leggings", slug: "womens-leggings", desc: "Churidar, ankle-length, jeggings & palazzos" },
  { name: "Women's Activewear", slug: "womens-activewear", desc: "Gym tights, sports bras, yoga sets & tracksuits" },
  { name: "Women's Nightwear", slug: "womens-nightwear", desc: "Satin nighties, pyjama sets, lounge kaftans & robes" },
  { name: "Women's Winter Wear", slug: "womens-winter-wear", desc: "Cardigans, pashmina shawls, sweaters & trench coats" },
];

async function main() {
  console.log("👗 Seeding Womenswear & 13 Subcategories into Database...");

  // 1. Create Root Category: Womenswear
  const root = await prisma.category.upsert({
    where: { fullPath: "womenswear" },
    update: {
      name: "Womenswear",
      slug: "womenswear",
      fullPath: "womenswear",
      description: "Explore designer dresses, ethnic sarees, kurtis, tops, jeans & winter wear for women.",
      icon: "Sparkles",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80",
      bannerImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&auto=format&fit=crop&q=80",
      isFeatured: true,
      showInHeader: true,
      showOnHomepage: true,
      showInMobile: true,
      showInFooter: true,
      showInSearch: true,
      status: "ACTIVE",
      level: 0,
      sortOrder: 2,
      seoTitle: "Womenswear Online Shopping - Sarees, Dresses & Kurtis | FancyHub.in",
      seoDescription: "Shop authentic Indian womenswear, festive sarees, dresses, kurtis, tops & western apparel on FancyHub.in.",
    },
    create: {
      id: "cat-womenswear",
      name: "Womenswear",
      slug: "womenswear",
      fullPath: "womenswear",
      description: "Explore designer dresses, ethnic sarees, kurtis, tops, jeans & winter wear for women.",
      icon: "Sparkles",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80",
      bannerImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&auto=format&fit=crop&q=80",
      isFeatured: true,
      showInHeader: true,
      showOnHomepage: true,
      showInMobile: true,
      showInFooter: true,
      showInSearch: true,
      status: "ACTIVE",
      level: 0,
      sortOrder: 2,
      seoTitle: "Womenswear Online Shopping - Sarees, Dresses & Kurtis | FancyHub.in",
      seoDescription: "Shop authentic Indian womenswear, festive sarees, dresses, kurtis, tops & western apparel on FancyHub.in.",
    },
  });

  console.log(`✅ Root category created: ${root.name} (/${root.fullPath}) [ID: ${root.id}]`);

  // 2. Create 13 Subcategories under Womenswear
  let sort = 1;
  for (const item of womenswearList) {
    const fullPath = `womenswear/${item.slug}`;
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
        seoTitle: `${item.name} Online - Best Prices & Offers | FancyHub.in`,
        seoDescription: `Discover the best quality ${item.name} on FancyHub.in. Direct verified Indian weavers & brands.`,
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
        seoTitle: `${item.name} Online - Best Prices & Offers | FancyHub.in`,
        seoDescription: `Discover the best quality ${item.name} on FancyHub.in. Direct verified Indian weavers & brands.`,
      },
    });

    console.log(`  └─ [${sort}/13] ${sub.name} (/${sub.fullPath})`);
    sort++;
  }

  invalidateCategoryCache();
  console.log("\n🎉 Successfully added Womenswear and all 13 Subcategories to the database!");
}

main()
  .catch((e) => {
    console.error("Error inserting womenswear categories:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
