export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  fileSize: number; // in bytes
  mimeType: string;
  dimensions: { width: number; height: number };
  folder: string; // "Banners", "Products", "Artisans", "Logos"
  altText: string;
  title: string;
  caption?: string;
  responsiveUrls?: {
    thumbnail: string;
    medium: string;
    large: string;
    webp: string;
    avif?: string;
  };
  createdAt: string;
}

export const INITIAL_MEDIA_LIBRARY: MediaAsset[] = [
  {
    id: "media-banarasi-hero",
    filename: "banarasi-pure-silk-saree-hero.jpg",
    url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=80",
    fileSize: 185400, // 185 KB
    mimeType: "image/jpeg",
    dimensions: { width: 1200, height: 800 },
    folder: "Banners",
    altText: "Handwoven Crimson Banarasi Silk Saree with pure golden zari work",
    title: "Crimson Banarasi Saree Hero Banner",
    caption: "Authentic Silk Mark certified master weaver collection from Varanasi",
    responsiveUrls: {
      thumbnail: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&q=80",
      medium: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      large: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=80",
      webp: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&fm=webp&q=80",
    },
    createdAt: "2026-08-25T10:00:00.000Z",
  },
  {
    id: "media-artisan-weaver",
    filename: "surat-master-weaver-portrait.jpg",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
    fileSize: 142000,
    mimeType: "image/jpeg",
    dimensions: { width: 800, height: 600 },
    folder: "Artisans",
    altText: "Master artisan Rameshwar Lal demonstrating Jacquard loom weaving in Surat",
    title: "Surat Master Weaver Portrait",
    caption: "Third generation Jacquard artisan guild",
    responsiveUrls: {
      thumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80",
      medium: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
      large: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&q=80",
      webp: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&fm=webp&q=80",
    },
    createdAt: "2026-08-25T10:05:00.000Z",
  },
  {
    id: "media-earbuds-pro",
    filename: "fancyhub-anc-pro-earbuds.jpg",
    url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
    fileSize: 98000,
    mimeType: "image/jpeg",
    dimensions: { width: 800, height: 800 },
    folder: "Products",
    altText: "FancyHub Studio ANC Wireless Earbuds in Matte Obsidian Black",
    title: "FancyHub ANC Wireless Earbuds Product Shot",
    caption: "48-hour battery with spatial audio",
    responsiveUrls: {
      thumbnail: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&q=80",
      medium: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
      large: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1200&q=80",
      webp: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&fm=webp&q=80",
    },
    createdAt: "2026-08-25T10:10:00.000Z",
  },
];

export function validateImageAltText(asset: Partial<MediaAsset>): { isValid: boolean; warning?: string } {
  if (!asset.altText || asset.altText.trim().length === 0) {
    return {
      isValid: false,
      warning: "Missing Alt Text! Alt text is essential for SEO rankings and screen reader accessibility.",
    };
  }
  if (asset.altText.length < 5) {
    return {
      isValid: false,
      warning: "Alt text is too brief. Provide descriptive context for search engine indexes.",
    };
  }
  return { isValid: true };
}
