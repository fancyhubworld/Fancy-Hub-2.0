export type SectionType =
  | "HERO_SLIDER"
  | "CATEGORY_STRIP"
  | "FLASH_DEALS"
  | "PRODUCT_GRID"
  | "PROMO_BANNERS"
  | "VENDOR_SPOTLIGHT"
  | "CUSTOM_PRINT"
  | "TESTIMONIALS"
  | "TRUST_ASSURANCE"
  | "NEWSLETTER"
  | "FAQ_ACCORDION"
  | "RICH_CONTENT"
  | "ANNOUNCEMENT_TICKER";

export interface SectionDescriptor {
  type: SectionType;
  name: string;
  category: "Hero & Banners" | "Products & Catalog" | "Engagement & Trust" | "Layout & CMS";
  description: string;
  iconName: string;
  defaultContent: any;
  defaultStyling: {
    paddingTop?: string;
    paddingBottom?: string;
    backgroundColor?: string;
    maxWidth?: string;
  };
}

export const SECTION_REGISTRY: Record<SectionType, SectionDescriptor> = {
  HERO_SLIDER: {
    type: "HERO_SLIDER",
    name: "Hero Promotional Carousel",
    category: "Hero & Banners",
    description: "Full-width or split hero carousel with responsive typography, CTA buttons and seasonal tags.",
    iconName: "Sliders",
    defaultContent: {
      autoplay: true,
      intervalSeconds: 5,
      slides: [
        {
          id: "slide-1",
          badge: "FESTIVE SALE 2026",
          title: "Surat Handloom Sarees & Silk Kurtas",
          subtitle: "Direct from master weavers with verified Silk Mark & zero middleman markup.",
          ctaText: "Shop Handlooms",
          ctaLink: "/category/womenswear",
          imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop&q=80",
          gradient: "from-blue-900/90 via-indigo-900/70 to-transparent",
        },
        {
          id: "slide-2",
          badge: "NEW LAUNCH",
          title: "5G Flagship Smartphones & ANC Gadgets",
          subtitle: "Official manufacturer warranty with same-day dispatch across 19,000+ Indian pincodes.",
          ctaText: "Explore Tech",
          ctaLink: "/category/mobile-phones",
          imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80",
          gradient: "from-slate-950/90 via-indigo-950/70 to-transparent",
        },
      ],
    },
    defaultStyling: { paddingTop: "0", paddingBottom: "1.5rem" },
  },
  CATEGORY_STRIP: {
    type: "CATEGORY_STRIP",
    name: "Category Navigation Strip",
    category: "Products & Catalog",
    description: "Horizontal scrollable circular icons or cards showcasing top product departments.",
    iconName: "Grid",
    defaultContent: {
      style: "circular", // 'circular' | 'cards' | 'grid'
      title: "Explore Departments",
      showAllLink: true,
      maxItems: 8,
    },
    defaultStyling: { paddingTop: "1rem", paddingBottom: "1.5rem" },
  },
  FLASH_DEALS: {
    type: "FLASH_DEALS",
    name: "Flash Deals with Countdown Timer",
    category: "Products & Catalog",
    description: "Urgency-driving flash sale block with real-time ticking countdown and discount badges.",
    iconName: "Zap",
    defaultContent: {
      title: "Deals of the Day",
      subtitle: "Offers refresh every 24 hours — grab before stock runs out!",
      badge: "LIVE FLASH SALE",
      hoursRemaining: 18,
      discountTag: "UP TO 65% OFF",
      productLimit: 4,
    },
    defaultStyling: { paddingTop: "1rem", paddingBottom: "2rem" },
  },
  PRODUCT_GRID: {
    type: "PRODUCT_GRID",
    name: "Product Grid & Showcase",
    category: "Products & Catalog",
    description: "Flexible product showcase filtered by Trending, Best-Sellers, New Arrivals, or specific category.",
    iconName: "ShoppingBag",
    defaultContent: {
      title: "Trending Right Now",
      subtitle: "Most loved products by 50,000+ Indian shoppers this week",
      filterType: "trending", // 'trending' | 'best_sellers' | 'new_arrivals' | 'category'
      categorySlug: "",
      layout: "grid", // 'grid' | 'carousel'
      columns: 4,
      limit: 4,
      showViewAll: true,
      viewAllLink: "/shop",
    },
    defaultStyling: { paddingTop: "1.5rem", paddingBottom: "2rem" },
  },
  PROMO_BANNERS: {
    type: "PROMO_BANNERS",
    name: "Marketing Promo Banners",
    category: "Hero & Banners",
    description: "Multi-column promotional cards with callout badges and high-contrast call-to-actions.",
    iconName: "Image",
    defaultContent: {
      layout: "banner-split", // '2-col' | '3-col' | 'banner-split'
      banners: [
        {
          badge: "SURAT DIRECT",
          title: "Pure Banarasi Sarees from ₹1,499",
          subtitle: "Zero middlemen commission. Get authentic artisanal sarees.",
          ctaText: "Explore Saree Collection →",
          ctaLink: "/category/womenswear/womens-sarees",
          bgGradient: "from-amber-500 via-orange-500 to-red-600",
        },
      ],
    },
    defaultStyling: { paddingTop: "1rem", paddingBottom: "2rem" },
  },
  VENDOR_SPOTLIGHT: {
    type: "VENDOR_SPOTLIGHT",
    name: "Featured Indian Artisans & Sellers",
    category: "Engagement & Trust",
    description: "Highlight verified master weavers, local brands, and multi-vendor storefronts.",
    iconName: "Store",
    defaultContent: {
      title: "Verified Indian Artisans & Sellers",
      subtitle: "Shop directly from certified textile hubs and innovators across India",
      limit: 4,
    },
    defaultStyling: { paddingTop: "1.5rem", paddingBottom: "2rem" },
  },
  CUSTOM_PRINT: {
    type: "CUSTOM_PRINT",
    name: "Custom Print Studio Banner",
    category: "Hero & Banners",
    description: "Interactive merchandising promo where customers can design custom apparel and gifts.",
    iconName: "Palette",
    defaultContent: {
      badge: "CREATOR STUDIO",
      title: "Print Your Own Brand & Identity",
      subtitle: "Upload high-res artwork, logos or quotes. Instant live 3D preview on cotton tees, hoodies & mugs.",
      ctaText: "Start Customizing →",
      ctaLink: "/custom-print",
      priceText: "From ₹499",
    },
    defaultStyling: { paddingTop: "1rem", paddingBottom: "2rem" },
  },
  TESTIMONIALS: {
    type: "TESTIMONIALS",
    name: "Customer Reviews & Testimonials",
    category: "Engagement & Trust",
    description: "Verified customer praise, star ratings, and real customer satisfaction quotes.",
    iconName: "Star",
    defaultContent: {
      title: "Loved by Shoppers Across India",
      subtitle: "Over 150,000+ successful verified deliveries across 19,000+ pincodes",
      items: [
        {
          name: "Ananya Deshmukh",
          city: "Pune, Maharashtra",
          rating: 5,
          comment: "Ordered 3 Banarasi sarees for my sister's wedding. The silk quality is pure and authentic, direct weaver pricing saved us ₹6,000!",
          verified: true,
        },
        {
          name: "Vikram Malhotra",
          city: "Bangalore, Karnataka",
          rating: 5,
          comment: "The custom printed team hoodies arrived in 3 days. Premium 300 GSM cotton with crisp embroidery. Incredible finish!",
          verified: true,
        },
        {
          name: "Dr. Rohit Sen",
          city: "Kolkata, West Bengal",
          rating: 5,
          comment: "Prompt delivery, verified seller invoice with GST input credit, and seamless COD payment. FancyHub is now my go-to marketplace.",
          verified: true,
        },
      ],
    },
    defaultStyling: { paddingTop: "2rem", paddingBottom: "2.5rem" },
  },
  TRUST_ASSURANCE: {
    type: "TRUST_ASSURANCE",
    name: "Assurance & Trust Service Badges",
    category: "Engagement & Trust",
    description: "Badges communicating Free Express Shipping, Cash on Delivery, 7-Day Returns, and 100% Genuine Guarantee.",
    iconName: "ShieldCheck",
    defaultContent: {
      items: [
        { icon: "Truck", title: "Free Express Shipping", desc: "On all orders above ₹999 across India" },
        { icon: "IndianRupee", title: "Cash on Delivery", desc: "Pay at your doorstep with QR / Cash" },
        { icon: "RotateCcw", title: "7-Day Easy Returns", desc: "Hassle-free doorstep pickup & instant refund" },
        { icon: "ShieldCheck", title: "100% Verified Sellers", desc: "Artisans & brands vetted with GST compliance" },
      ],
    },
    defaultStyling: { paddingTop: "0.5rem", paddingBottom: "1.5rem" },
  },
  NEWSLETTER: {
    type: "NEWSLETTER",
    name: "Newsletter & Instant Coupon",
    category: "Engagement & Trust",
    description: "Email capture box providing instant discount code and promotional rewards.",
    iconName: "Mail",
    defaultContent: {
      title: "Join India's Fastest Growing Marketplace Club",
      subtitle: "Subscribe to receive ₹500 instant wallet credits and exclusive festive coupon codes.",
      couponCode: "FANCYFIRST",
      btnText: "Get ₹500 Off",
    },
    defaultStyling: { paddingTop: "2rem", paddingBottom: "2.5rem" },
  },
  FAQ_ACCORDION: {
    type: "FAQ_ACCORDION",
    name: "FAQ Accordion",
    category: "Layout & CMS",
    description: "Expandable questions and answers for customer help and policies.",
    iconName: "HelpCircle",
    defaultContent: {
      title: "Frequently Asked Questions",
      subtitle: "Got questions? We've got answers.",
      items: [
        {
          q: "How does multi-vendor shipping work on FancyHub?",
          a: "When you order products from different verified sellers, each vendor securely packages and dispatches their items. You will receive real-time tracking IDs for each package with doorstep delivery.",
        },
        {
          q: "Can I pay via UPI or Cash on Delivery?",
          a: "Yes! We accept all Indian payment methods including Google Pay, PhonePe, Paytm, RuPay cards, NetBanking, and Cash on Delivery (COD) across 19,000+ Indian pincodes.",
        },
        {
          q: "How do I return a product?",
          a: "Go to Account > Orders, select the item and click 'Request Return' within 7 days of delivery. Our courier partner will pick it up from your address at zero extra cost.",
        },
      ],
    },
    defaultStyling: { paddingTop: "2rem", paddingBottom: "2.5rem" },
  },
  RICH_CONTENT: {
    type: "RICH_CONTENT",
    name: "Rich Editorial CMS Content",
    category: "Layout & CMS",
    description: "Formatted text, headlines, images and story sections for blogs, about us, or brand campaigns.",
    iconName: "FileText",
    defaultContent: {
      title: "Empowering India's Master Artisans & Weavers",
      contentHtml: `<p>FancyHub.in was founded with a singular mission: to connect traditional Indian artisans, handloom weavers, and homegrown innovators directly with over 100 million digital consumers.</p><p>By eliminating multiple layers of distributors, we ensure sellers retain fair value for their craft while shoppers enjoy unmatched wholesale pricing.</p>`,
      alignment: "left",
    },
    defaultStyling: { paddingTop: "2rem", paddingBottom: "2rem" },
  },
  ANNOUNCEMENT_TICKER: {
    type: "ANNOUNCEMENT_TICKER",
    name: "Announcement Marquee Ticker",
    category: "Hero & Banners",
    description: "Continuously scrolling announcement ribbon with custom speed and icons.",
    iconName: "Volume2",
    defaultContent: {
      badge: "LIVE UPDATES",
      text: "⚡ FESTIVE DHAMAKA: Extra 15% OFF with HDFC & ICICI Cards • FREE Shipping on Orders above ₹999 • 2-Day Express Delivery to Mumbai, Delhi, Bangalore, Kolkata & Hyderabad",
      link: "/deals",
      speed: "normal",
    },
    defaultStyling: { paddingTop: "0.5rem", paddingBottom: "0.5rem" },
  },
};

export function getDefaultHomepageSections(): Array<{
  type: string;
  title: string;
  subtitle: string;
  sortOrder: number;
  isActive: boolean;
  desktopVisible: boolean;
  mobileVisible: boolean;
  contentJson: string;
  stylingJson: string;
}> {
  const types = [
    { type: "HERO_BANNER", title: "Hero Banner", subtitle: "Diwali Handloom & Festive Tech Festival" },
    { type: "TRUST_BADGES", title: "USP Section", subtitle: "Why Choose FancyHub? Express dispatch & 100% Silk Mark" },
    { type: "FLASH_DEALS", title: "Flash Deals", subtitle: "Ticking Flash Deals — Flat 50% OFF" },
    { type: "CATEGORY_CAROUSEL", title: "Categories", subtitle: "Browse by Department & Weaves" },
    { type: "FEATURED_PRODUCTS", title: "Featured Products", subtitle: "Handpicked Indian Masterpieces" },
    { type: "TOP_VENDORS", title: "Top Vendors", subtitle: "Meet India's Master Weavers & Guilds" },
    { type: "DEALS", title: "Deals", subtitle: "Exclusive Value Bundles" },
    { type: "RECENTLY_VIEWED", title: "Recently Viewed", subtitle: "Pick up right where you left off" },
    { type: "BLOG_POSTS", title: "Blog", subtitle: "Stories from the Indian Loom" },
    { type: "NEWSLETTER", title: "Newsletter", subtitle: "Unlock Instant ₹500 Welcome Discount" },
  ];

  return types.map((item, idx) => ({
    type: item.type,
    title: item.title,
    subtitle: item.subtitle,
    sortOrder: idx,
    isActive: true,
    desktopVisible: true,
    mobileVisible: true,
    contentJson: JSON.stringify({ title: item.title, subtitle: item.subtitle }),
    stylingJson: JSON.stringify({ paddingY: "py-6" }),
  }));
}

