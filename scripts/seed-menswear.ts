import { PrismaClient } from "@prisma/client";
import { invalidateCategoryCache } from "../src/lib/categories";

const prisma = new PrismaClient();

const menswearList = [
  { name: "Men's Shirts", slug: "mens-shirts", desc: "Formal, casual, linen & cotton shirts for men" },
  { name: "Men's T-Shirts", slug: "mens-tshirts", desc: "Crew neck, v-neck, graphic and oversized t-shirts" },
  { name: "Men's Polo Shirts", slug: "mens-polo-shirts", desc: "Classic collared and pique cotton polo t-shirts" },
  { name: "Men's Jeans", slug: "mens-jeans", desc: "Slim fit, straight leg, denim & distressed jeans" },
  { name: "Men's Trousers", slug: "mens-trousers", desc: "Chinos, formal trousers, pleated and casual pants" },
  { name: "Men's Shorts", slug: "mens-shorts", desc: "Denim, cotton cargo, sweatshorts and beachwear" },
  { name: "Men's Jackets", slug: "mens-jackets", desc: "Bomber, leather, denim, puffer and windbreakers" },
  { name: "Men's Blazers", slug: "mens-blazers", desc: "Tailored single and double-breasted formal blazers" },
  { name: "Men's Hoodies", slug: "mens-hoodies", desc: "Fleece, pullover, zip-up and oversized hoodies" },
  { name: "Men's Sweatshirts", slug: "mens-sweatshirts", desc: "Crewneck sweatshirts and sporty pullovers" },
  { name: "Men's Suits", slug: "mens-suits", desc: "2-piece and 3-piece bespoke formal tuxedos and suits" },
  { name: "Men's Ethnic Wear", slug: "mens-ethnic-wear", desc: "Traditional Indian ethnic outfits, dhotis & nehru jackets" },
  { name: "Men's Kurta", slug: "mens-kurta", desc: "Short & long festive, chikankari & silk kurtas" },
  { name: "Men's Sherwani", slug: "mens-sherwani", desc: "Embroidered wedding sherwanis and indowestern sets" },
  { name: "Men's Activewear", slug: "mens-activewear", desc: "Dry-fit gym t-shirts, track pants & running gear" },
  { name: "Men's Innerwear", slug: "mens-innerwear", desc: "Vests, briefs, trunks, boxers and thermal wear" },
  { name: "Men's Sleepwear", slug: "mens-sleepwear", desc: "Cotton night suits, lounge pyjamas & robes" },
  { name: "Men's Winter Wear", slug: "mens-winter-wear", desc: "Sweaters, cardigans, mufflers, thermals & coats" },
  { name: "Men's Summer Wear", slug: "mens-summer-wear", desc: "Breathable pure linen shirts, resort shirts & shorts" },
];

async function main() {
  console.log("👔 Seeding Menswear & 19 Subcategories into Database...");

  // 1. Create Root Category: Menswear
  const root = await prisma.category.upsert({
    where: { fullPath: "menswear" },
    update: {
      name: "Menswear",
      slug: "menswear",
      fullPath: "menswear",
      description: "Complete collection of men's clothing, ethnic wear, western apparel & essentials.",
      icon: "Shirt",
      image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&auto=format&fit=crop&q=80",
      bannerImage: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1600&auto=format&fit=crop&q=80",
      isFeatured: true,
      showInHeader: true,
      showOnHomepage: true,
      showInMobile: true,
      showInFooter: true,
      showInSearch: true,
      status: "ACTIVE",
      level: 0,
      sortOrder: 1,
      seoTitle: "Menswear Online Shopping | FancyHub.in",
      seoDescription: "Shop authentic Indian menswear, shirts, t-shirts, kurtas, suits & activewear on FancyHub.in.",
    },
    create: {
      id: "cat-menswear",
      name: "Menswear",
      slug: "menswear",
      fullPath: "menswear",
      description: "Complete collection of men's clothing, ethnic wear, western apparel & essentials.",
      icon: "Shirt",
      image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&auto=format&fit=crop&q=80",
      bannerImage: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1600&auto=format&fit=crop&q=80",
      isFeatured: true,
      showInHeader: true,
      showOnHomepage: true,
      showInMobile: true,
      showInFooter: true,
      showInSearch: true,
      status: "ACTIVE",
      level: 0,
      sortOrder: 1,
      seoTitle: "Menswear Online Shopping | FancyHub.in",
      seoDescription: "Shop authentic Indian menswear, shirts, t-shirts, kurtas, suits & activewear on FancyHub.in.",
    },
  });

  console.log(`✅ Root category created: ${root.name} (/${root.fullPath}) [ID: ${root.id}]`);

  // 2. Create 19 Subcategories under Menswear
  let sort = 1;
  for (const item of menswearList) {
    const fullPath = `menswear/${item.slug}`;
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
        seoDescription: `Discover the best quality ${item.name} on FancyHub.in. Direct verified Indian manufacturers.`,
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
        seoDescription: `Discover the best quality ${item.name} on FancyHub.in. Direct verified Indian manufacturers.`,
      },
    });

    console.log(`  └─ [${sort}/19] ${sub.name} (/${sub.fullPath})`);
    sort++;
  }

  invalidateCategoryCache();
  console.log("\n🎉 Successfully added Menswear and all 19 Subcategories to the database!");
}

main()
  .catch((e) => {
    console.error("Error inserting menswear categories:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
