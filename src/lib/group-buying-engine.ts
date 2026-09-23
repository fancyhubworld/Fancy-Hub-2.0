export interface TieredPrice {
  buyersRequired: number;
  pricePerUnit: number;
  discountPercentage: number;
  badgeLabel: string;
}

export interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  city: string;
  pincode: string;
  joinedAt: string;
}

export interface GroupDeal {
  id: string;
  title: string;
  slug: string;
  category: string;
  image: string;
  vendorName: string;
  vendorCity: string;
  mrp: number;
  retailPrice: number; // 1 buyer
  tieredPricing: TieredPrice[];
  activePoolsCount: number;
  currentPool: {
    poolId: string;
    creatorName: string;
    membersJoined: number;
    targetMembers: number;
    members: GroupMember[];
    expiresAt: string; // 2-hour window
  };
}

export const MOCK_GROUP_DEALS: GroupDeal[] = [
  {
    id: "deal-banarasi-group-1",
    title: "Pure Katan Silk Banarasi Saree with Rich Gold Zari Pallu",
    slug: "crimson-banarasi-pure-silk-saree",
    category: "sarees",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
    vendorName: "Varanasi Silk Guild",
    vendorCity: "Varanasi, UP",
    mrp: 8999,
    retailPrice: 4999,
    tieredPricing: [
      { buyersRequired: 1, pricePerUnit: 4999, discountPercentage: 44, badgeLabel: "Solo Buyer" },
      { buyersRequired: 2, pricePerUnit: 4199, discountPercentage: 53, badgeLabel: "Duo Deal" },
      { buyersRequired: 3, pricePerUnit: 3499, discountPercentage: 61, badgeLabel: "Trio Wholesale" },
    ],
    activePoolsCount: 42,
    currentPool: {
      poolId: "pool-banarasi-901",
      creatorName: "Pooja Sharma",
      membersJoined: 2,
      targetMembers: 3,
      members: [
        { id: "m-1", name: "Pooja Sharma", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80", city: "Mumbai", pincode: "400001", joinedAt: "1 hour ago" },
        { id: "m-2", name: "Ananya Iyer", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80", city: "Bengaluru", pincode: "560001", joinedAt: "25 mins ago" },
      ],
      expiresAt: new Date(Date.now() + 74 * 60 * 1000).toISOString(), // 1h 14m left
    },
  },
  {
    id: "deal-anc-earbuds-2",
    title: "FancyHub Studio Pro ANC Wireless Earbuds (48h Battery)",
    slug: "fancyhub-anc-pro-earbuds",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",
    vendorName: "FancyHub Electronics",
    vendorCity: "Bengaluru, KA",
    mrp: 4999,
    retailPrice: 2499,
    tieredPricing: [
      { buyersRequired: 1, pricePerUnit: 2499, discountPercentage: 50, badgeLabel: "Solo Buyer" },
      { buyersRequired: 2, pricePerUnit: 1999, discountPercentage: 60, badgeLabel: "Duo Deal" },
      { buyersRequired: 3, pricePerUnit: 1699, discountPercentage: 66, badgeLabel: "Trio Wholesale" },
    ],
    activePoolsCount: 68,
    currentPool: {
      poolId: "pool-earbuds-502",
      creatorName: "Rahul Verma",
      membersJoined: 1,
      targetMembers: 3,
      members: [
        { id: "m-3", name: "Rahul Verma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80", city: "New Delhi", pincode: "110001", joinedAt: "10 mins ago" },
      ],
      expiresAt: new Date(Date.now() + 105 * 60 * 1000).toISOString(), // 1h 45m left
    },
  },
  {
    id: "deal-cotton-kurta-3",
    title: "Hand-Block Printed Chanderi Cotton Kurta Set with Dupatta",
    slug: "chanderi-cotton-kurta-set",
    category: "ethnic",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80",
    vendorName: "Jaipur Loom Crafts",
    vendorCity: "Jaipur, RJ",
    mrp: 3499,
    retailPrice: 1899,
    tieredPricing: [
      { buyersRequired: 1, pricePerUnit: 1899, discountPercentage: 45, badgeLabel: "Solo Buyer" },
      { buyersRequired: 2, pricePerUnit: 1549, discountPercentage: 55, badgeLabel: "Duo Deal" },
      { buyersRequired: 3, pricePerUnit: 1299, discountPercentage: 63, badgeLabel: "Trio Wholesale" },
    ],
    activePoolsCount: 31,
    currentPool: {
      poolId: "pool-kurta-308",
      creatorName: "Kavita Rao",
      membersJoined: 2,
      targetMembers: 3,
      members: [
        { id: "m-4", name: "Kavita Rao", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80", city: "Hyderabad", pincode: "500001", joinedAt: "40 mins ago" },
        { id: "m-5", name: "Sneha Patel", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80", city: "Ahmedabad", pincode: "380001", joinedAt: "15 mins ago" },
      ],
      expiresAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45m left
    },
  },
];

export function getActiveGroupDeals(category?: string): GroupDeal[] {
  let deals = [...MOCK_GROUP_DEALS];
  if (category && category !== "ALL") {
    deals = deals.filter((d) => d.category.toLowerCase() === category.toLowerCase());
  }
  return deals;
}

export function generateWhatsAppInviteLink(deal: GroupDeal, poolId: string): string {
  const wholesalePrice = deal.tieredPricing[deal.tieredPricing.length - 1].pricePerUnit;
  const savings = deal.retailPrice - wholesalePrice;
  const shareText = `🔥 Hey! Let's buy this together on FancyHub.in and save ₹${savings} each!\n\n🛍️ *${deal.title}*\n💰 Regular Price: ₹${deal.retailPrice}\n⚡ Group Wholesale Price: ₹${wholesalePrice} (Direct from ${deal.vendorName})\n\n⏳ 1 slot left! Tap here to join my group buy pool:\nhttps://fancyhub.in/group-buy/${poolId}`;

  return `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
}

export function calculateGroupDiscount(memberCount: number, tieredPricing: TieredPrice[]): TieredPrice {
  if (memberCount >= 3) return tieredPricing[2] || tieredPricing[tieredPricing.length - 1];
  if (memberCount === 2) return tieredPricing[1];
  return tieredPricing[0];
}
