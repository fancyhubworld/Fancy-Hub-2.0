export interface TaggedProduct {
  id: string;
  title: string;
  price: number;
  mrp: number;
  discountPercentage: number;
  slug: string;
  image: string;
  category: string;
  vendorName: string;
  inStock: boolean;
}

export interface ShoppableReel {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  isVerifiedWeaver: boolean;
  category: string;
  viewCount: number;
  likeCount: number;
  durationSeconds: number;
  taggedProduct: TaggedProduct;
  createdAt: string;
}

export const SHOPPABLE_REELS_CATALOG: ShoppableReel[] = [
  {
    id: "reel-banarasi-weaving-1",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-weaving-on-a-loom-42861-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
    title: "Master Weaver weaving Pure Zari on Jacquard Loom in Varanasi 🧵",
    creatorName: "Varanasi Silk Guild",
    creatorHandle: "@varanasiguild",
    creatorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80",
    isVerifiedWeaver: true,
    category: "sarees",
    viewCount: 48200,
    likeCount: 3420,
    durationSeconds: 15,
    taggedProduct: {
      id: "prod-banarasi-crimson",
      title: "Crimson Banarasi Pure Silk Saree",
      price: 4999,
      mrp: 8999,
      discountPercentage: 44,
      slug: "crimson-banarasi-pure-silk-saree",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80",
      category: "Sarees",
      vendorName: "Surat Silk Mills",
      inStock: true,
    },
    createdAt: "2026-08-25T12:00:00Z",
  },
  {
    id: "reel-kanchipuram-gold-2",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-draping-a-silk-saree-42862-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80",
    title: "Royal Gold Zari Kanchipuram Drape Tutorial & Luster Test ✨",
    creatorName: "Kanchi Heritage Weaves",
    creatorHandle: "@kanchiweaves",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
    isVerifiedWeaver: true,
    category: "sarees",
    viewCount: 62400,
    likeCount: 5120,
    durationSeconds: 18,
    taggedProduct: {
      id: "prod-kanchipuram-gold",
      title: "Royal Gold Zari Kanchipuram Silk Saree",
      price: 8499,
      mrp: 14999,
      discountPercentage: 43,
      slug: "royal-gold-zari-kanchipuram-saree",
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&q=80",
      category: "Sarees",
      vendorName: "Kanchipuram Silk Guild",
      inStock: true,
    },
    createdAt: "2026-08-25T14:30:00Z",
  },
  {
    id: "reel-earbuds-anc-3",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-man-wearing-wireless-earphones-41710-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",
    title: "ANC Studio Pro Earbuds: 48h Battery & Active Noise Cancellation Test 🎧",
    creatorName: "FancyHub Audio Labs",
    creatorHandle: "@fancyhubaudio",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    isVerifiedWeaver: false,
    category: "electronics",
    viewCount: 89300,
    likeCount: 7890,
    durationSeconds: 14,
    taggedProduct: {
      id: "prod-earbuds-anc",
      title: "FancyHub Studio ANC Wireless Earbuds",
      price: 2499,
      mrp: 4999,
      discountPercentage: 50,
      slug: "fancyhub-anc-pro-earbuds",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80",
      category: "Electronics",
      vendorName: "FancyHub Electronics",
      inStock: true,
    },
    createdAt: "2026-08-25T16:00:00Z",
  },
  {
    id: "reel-custom-print-4",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-screen-printing-process-on-fabric-42864-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80",
    title: "Direct-to-Garment DTG Custom Tee Print in Real Time! 👕",
    creatorName: "FancyHub Print Studio",
    creatorHandle: "@fancyhubprint",
    creatorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
    isVerifiedWeaver: false,
    category: "custom-print",
    viewCount: 34100,
    likeCount: 2840,
    durationSeconds: 12,
    taggedProduct: {
      id: "prod-custom-tee",
      title: "Custom Printed Premium 220 GSM Cotton Tee",
      price: 599,
      mrp: 999,
      discountPercentage: 40,
      slug: "custom-printed-heavy-cotton-tee",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80",
      category: "Custom Print",
      vendorName: "FancyHub Print Studio",
      inStock: true,
    },
    createdAt: "2026-08-25T18:00:00Z",
  },
];

export function getShoppableReels(filter?: { category?: string; limit?: number }): ShoppableReel[] {
  let reels = [...SHOPPABLE_REELS_CATALOG];
  if (filter?.category && filter.category !== "ALL") {
    reels = reels.filter((r) => r.category.toLowerCase() === filter.category!.toLowerCase());
  }
  if (filter?.limit) {
    reels = reels.slice(0, filter.limit);
  }
  return reels;
}
