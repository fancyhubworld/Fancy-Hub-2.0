import { PrismaClient } from "@prisma/client";

export type ReusableBlockMode = "LINKED" | "INDEPENDENT";

export interface ReusableBlock {
  id: string;
  name: string;
  category: "HERO" | "PRODUCTS" | "PROMO" | "ENGAGEMENT" | "TRUST" | "CUSTOM";
  type: string;
  description?: string;
  contentJson: string;
  stylingJson?: string;
  mode: ReusableBlockMode;
  linkedPageCount?: number;
  linkedSectionIds?: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export const DEFAULT_REUSABLE_BLOCKS: ReusableBlock[] = [
  {
    id: "block-trust-badges",
    name: "FancyHub Trust & Assurance Strip",
    category: "TRUST",
    type: "TRUST_ASSURANCE",
    description: "Verified Silk Mark, Free Shipping, 7-Day Returns & Direct Weaver Assurance",
    mode: "LINKED",
    contentJson: JSON.stringify({
      items: [
        { icon: "ShieldCheck", title: "100% Verified Artisans", desc: "Silk Mark & Handloom Board Certified" },
        { icon: "Truck", title: "Free Express Shipping", desc: "Across 19,000+ Indian Pincodes" },
        { icon: "RotateCcw", title: "7-Day Easy Returns", desc: "Doorstep pickup & instant refunds" },
        { icon: "IndianRupee", title: "Cash on Delivery", desc: "COD & UPI QR payment available" },
      ],
    }),
    stylingJson: JSON.stringify({
      paddingTop: "1.5rem",
      paddingBottom: "1.5rem",
      background: "var(--surface)",
      radius: "1rem",
    }),
  },
  {
    id: "block-artisan-spotlight",
    name: "Featured Indian Master Weavers",
    category: "ENGAGEMENT",
    type: "VENDOR_SPOTLIGHT",
    description: "Artisan storyteller card with direct seller bio and verified badge",
    mode: "LINKED",
    contentJson: JSON.stringify({
      title: "Meet India's Master Weavers & Guilds",
      subtitle: "Every purchase directly supports over 10,000 handloom weaving families.",
    }),
    stylingJson: JSON.stringify({
      paddingTop: "2rem",
      paddingBottom: "2rem",
    }),
  },
];

/**
 * Propagate edits to all linked section instances across database pages
 */
export async function propagateReusableBlockUpdate(
  prisma: PrismaClient,
  blockId: string,
  updatedContentJson: string,
  updatedStylingJson?: string
) {
  // Update the master template
  const template = await prisma.savedSectionTemplate.update({
    where: { id: blockId },
    data: {
      contentJson: updatedContentJson,
      stylingJson: updatedStylingJson,
      updatedAt: new Date(),
    },
  });

  // Find all sections that reference this reusable block as LINKED
  const matchingSections = await prisma.pageSection.findMany({
    where: {
      settings: {
        contains: `"reusableBlockId":"${blockId}"`,
      },
    },
  });

  for (const section of matchingSections) {
    try {
      const settings = JSON.parse(section.settings || "{}");
      if (settings.reusableMode === "LINKED") {
        await prisma.pageSection.update({
          where: { id: section.id },
          data: {
            contentJson: updatedContentJson,
            stylingJson: updatedStylingJson || section.stylingJson,
          },
        });
      }
    } catch {}
  }

  return template;
}
