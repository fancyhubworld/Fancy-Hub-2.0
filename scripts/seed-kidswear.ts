import { PrismaClient } from "@prisma/client";
import { invalidateCategoryCache } from "../src/lib/categories";

const prisma = new PrismaClient();

const kidswearList = [
  { name: "Boys Clothing", slug: "boys-clothing", desc: "Everyday casuals, sets, t-shirts, shirts & shorts for boys" },
  { name: "Girls Clothing", slug: "girls-clothing", desc: "Frocks, dresses, tops, skirts & jumpsuits for girls" },
  { name: "Boys T-Shirts", slug: "boys-tshirts", desc: "Cartoon print, superhero & cotton graphic t-shirts for boys" },
  { name: "Boys Shirts", slug: "boys-shirts", desc: "Casual checkered, formal oxford & linen shirts for boys" },
  { name: "Boys Jeans", slug: "boys-jeans", desc: "Comfort stretch, jogger style & regular fit denim jeans for boys" },
  { name: "Girls Dresses", slug: "girls-dresses", desc: "Princess gowns, cotton frocks, party dresses & tutu frocks" },
  { name: "Girls Tops", slug: "girls-tops", desc: "Cute printed tops, peplums, tees & tunics for girls" },
  { name: "Girls Skirts", slug: "girls-skirts", desc: "Tulle skirts, denim skirts, pleated & flare skirts for girls" },
  { name: "Kids Winter Wear", slug: "kids-winter-wear", desc: "Warm hoodies, sweaters, thermal inners, mittens & jackets" },
  { name: "Kids Party Wear", slug: "kids-party-wear", desc: "Birthday party suits, blazers, gowns & sparkles for kids" },
  { name: "Kids Ethnic Wear", slug: "kids-ethnic-wear", desc: "Kurta pyjama sets, dhoti kurtas, lehenga cholis & sherwanis" },
];

async function main() {
  console.log("🧸 Seeding Kids wear & 11 Subcategories into Database...");

  // 1. Create Root Category: Kids wear
  const root = await prisma.category.upsert({
    where: { fullPath: "kidswear" },
    update: {
      name: "Kids wear",
      slug: "kidswear",
      fullPath: "kidswear",
      description: "Adorable clothing for boys & girls, party wear, festive ethnic outfits and winter layers.",
      icon: "Sparkles",
      image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800&auto=format&fit=crop&q=80",
      bannerImage: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=1600&auto=format&fit=crop&q=80",
      isFeatured: true,
      showInHeader: true,
      showOnHomepage: true,
      showInMobile: true,
      showInFooter: true,
      showInSearch: true,
      status: "ACTIVE",
      level: 0,
      sortOrder: 3,
      seoTitle: "Kids Wear Online - Boys & Girls Clothing | FancyHub.in",
      seoDescription: "Shop authentic Indian kids wear, boys clothing, girls dresses, party wear & ethnic wear on FancyHub.in.",
    },
    create: {
      id: "cat-kidswear",
      name: "Kids wear",
      slug: "kidswear",
      fullPath: "kidswear",
      description: "Adorable clothing for boys & girls, party wear, festive ethnic outfits and winter layers.",
      icon: "Sparkles",
      image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800&auto=format&fit=crop&q=80",
      bannerImage: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=1600&auto=format&fit=crop&q=80",
      isFeatured: true,
      showInHeader: true,
      showOnHomepage: true,
      showInMobile: true,
      showInFooter: true,
      showInSearch: true,
      status: "ACTIVE",
      level: 0,
      sortOrder: 3,
      seoTitle: "Kids Wear Online - Boys & Girls Clothing | FancyHub.in",
      seoDescription: "Shop authentic Indian kids wear, boys clothing, girls dresses, party wear & ethnic wear on FancyHub.in.",
    },
  });

  console.log(`✅ Root category created: ${root.name} (/${root.fullPath}) [ID: ${root.id}]`);

  // 2. Create 11 Subcategories under Kids wear
  let sort = 1;
  for (const item of kidswearList) {
    const fullPath = `kidswear/${item.slug}`;
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
        seoTitle: `${item.name} Online - Best Prices for Kids | FancyHub.in`,
        seoDescription: `Discover high quality ${item.name} on FancyHub.in. Direct verified Indian manufacturers.`,
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
        seoTitle: `${item.name} Online - Best Prices for Kids | FancyHub.in`,
        seoDescription: `Discover high quality ${item.name} on FancyHub.in. Direct verified Indian manufacturers.`,
      },
    });

    console.log(`  └─ [${sort}/11] ${sub.name} (/${sub.fullPath})`);
    sort++;
  }

  invalidateCategoryCache();
  console.log("\n🎉 Successfully added Kids wear and all 11 Subcategories to the database!");
}

main()
  .catch((e) => {
    console.error("Error inserting kidswear categories:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
