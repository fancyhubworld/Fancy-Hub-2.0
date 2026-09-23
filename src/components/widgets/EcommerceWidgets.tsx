"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  Zap,
  Award,
  Sparkles,
  TrendingUp,
  Clock,
  Heart,
  Percent,
  ShoppingCart,
  ChevronRight,
  ShieldCheck,
  Eye,
  Flame,
  Loader2,
  Scale,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { WidgetInstance, ProductWidgetCustomSettings } from "@/lib/widget-types";
import { ROUTES } from "@/lib/routes";

interface WidgetProps {
  widget: WidgetInstance;
  isEditing?: boolean;
}

export function useDynamicProducts(widget: WidgetInstance) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const ds = widget.dataSource || {};
  const settings = widget.settings || {};
  const filterType = settings.productSource || ds.sourceType || ds.filter || "latest";
  const categorySlug = settings.categorySlug || settings.category || ds.categorySlug;
  const vendorSlug = settings.vendorSlug || settings.vendor || ds.vendorSlug;
  const limit = settings.limit || ds.limit || 8;
  const query = settings.query || ds.query;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const params = new URLSearchParams();
    params.set("type", "products");
    params.set("limit", String(limit));
    if (filterType) params.set("sourceType", filterType);
    if (categorySlug) params.set("categorySlug", categorySlug);
    if (vendorSlug) params.set("vendorSlug", vendorSlug);
    if (query) params.set("query", query);

    fetch(`/api/public/dynamic-data?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.data) {
          setProducts(data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching dynamic widget products:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filterType, categorySlug, vendorSlug, limit, query]);

  return { products, loading };
}

export function ProductCardItem({
  p,
  settings = {},
}: {
  p: any;
  settings?: ProductWidgetCustomSettings;
}) {
  const {
    cardStyle = "modern",
    imageRatio = "1:1",
    showPrice = true,
    showDiscount = true,
    showRating = true,
    showWishlist = true,
    showCompare = true,
    showQuickView = true,
    showAddToCart = true,
    showStock = true,
    showBadges = true,
    showVendor = true,
    showDeliveryInfo = true,
    showCountdown = false,
  } = settings;

  // Aspect ratio class
  const ratioClass =
    imageRatio === "3:4"
      ? "aspect-[3/4]"
      : imageRatio === "4:5"
      ? "aspect-[4/5]"
      : imageRatio === "16:9"
      ? "aspect-video"
      : "aspect-square";

  // Card style class
  const cardStyleClass =
    cardStyle === "glass"
      ? "bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/20 dark:border-slate-800/80 shadow-lg"
      : cardStyle === "elevated"
      ? "bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700/80 hover:-translate-y-1"
      : cardStyle === "bordered"
      ? "bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-600 rounded-2xl"
      : cardStyle === "minimal"
      ? "bg-transparent border-0 shadow-none hover:bg-slate-50 dark:hover:bg-slate-800/40 p-2 rounded-2xl"
      : cardStyle === "classic"
      ? "bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
      : "bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 hover:shadow-xl hover:border-fancy-blue/50"; // default modern

  return (
    <div
      className={`p-3 flex flex-col justify-between group transition-all duration-300 ${cardStyleClass}`}
    >
      <div className="space-y-2">
        {/* Media Container */}
        <div className={`relative ${ratioClass} rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900`}>
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />

          {/* Badges */}
          {showBadges && p.badge && (
            <span className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 shadow z-10">
              {p.badge}
            </span>
          )}

          {/* Floating Action Buttons */}
          <div className="absolute top-2 right-2 flex flex-col space-y-1.5 z-10">
            {showWishlist && (
              <button
                className="p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-400 hover:text-red-500 shadow transition"
                title="Add to Wishlist"
              >
                <Heart className="w-3.5 h-3.5" />
              </button>
            )}

            {showCompare && (
              <button
                className="p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-400 hover:text-fancy-blue shadow opacity-0 group-hover:opacity-100 transition"
                title="Compare Product"
              >
                <Scale className="w-3.5 h-3.5" />
              </button>
            )}

            {showQuickView && (
              <button
                className="p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-400 hover:text-indigo-400 shadow opacity-0 group-hover:opacity-100 transition"
                title="Quick View"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Countdown Clock Overlay */}
          {showCountdown && (
            <div className="absolute bottom-2 inset-x-2 bg-slate-950/80 backdrop-blur-md rounded-xl p-1 text-center text-[10px] font-mono text-amber-300 font-bold border border-amber-500/30 flex items-center justify-center space-x-1">
              <Clock className="w-3 h-3 animate-spin text-amber-400" />
              <span>Ends in 08h : 24m : 15s</span>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
            {showVendor && (
              <span className="truncate max-w-[110px] font-bold hover:text-fancy-blue transition">
                {p.vendorName || "FancyHub Artisan"}
              </span>
            )}

            {showRating && (
              <div className="flex items-center space-x-1 text-amber-500 font-bold ml-auto">
                <Star className="w-3 h-3 fill-current" />
                <span>{p.rating || 4.8}</span>
              </div>
            )}
          </div>

          <Link href={`/product/${p.slug}`}>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-fancy-blue transition">
              {p.name}
            </h4>
          </Link>

          {/* Delivery Information */}
          {showDeliveryInfo && (
            <div className="flex items-center space-x-1 text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold pt-0.5">
              <Truck className="w-2.5 h-2.5" />
              <span>Express Dispatch in 24-48h</span>
            </div>
          )}

          {/* Stock Availability */}
          {showStock && (
            <div className="text-[9px] font-bold text-slate-400 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>In Stock • Ready to ship</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Pricing & Add to Cart */}
      <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
        {showPrice ? (
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-black text-sm text-slate-900 dark:text-white">
                ₹{p.price.toLocaleString("en-IN")}
              </span>
              {p.originalPrice > p.price && (
                <span className="text-[10px] text-slate-400 line-through">
                  ₹{p.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            {showDiscount && p.discount > 0 && (
              <span className="text-[9px] font-black uppercase text-green-600 dark:text-green-400">
                {p.discount}% OFF
              </span>
            )}
          </div>
        ) : (
          <div />
        )}

        {showAddToCart && (
          <Link
            href={`/product/${p.slug}`}
            className="p-2 rounded-xl bg-fancy-blue hover:bg-blue-600 text-white shadow active:scale-95 transition flex items-center space-x-1 text-xs font-bold"
            title="Add to Cart"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}

// Helper to determine dynamic column classes
function getGridColClasses(settings: ProductWidgetCustomSettings = {}) {
  const desk = settings.desktopColumns || settings.columns || 4;
  const tab = settings.tabletColumns || 3;
  const mob = settings.mobileColumns || 2;

  const mobClass = mob === 1 ? "grid-cols-1" : "grid-cols-2";
  const tabClass = tab === 1 ? "md:grid-cols-1" : tab === 2 ? "md:grid-cols-2" : tab === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
  const deskClass = desk === 1 ? "lg:grid-cols-1" : desk === 2 ? "lg:grid-cols-2" : desk === 3 ? "lg:grid-cols-3" : desk === 5 ? "lg:grid-cols-5" : desk === 6 ? "lg:grid-cols-6" : "lg:grid-cols-4";

  return `${mobClass} ${tabClass} ${deskClass}`;
}

export function ProductGridWidget({ widget }: WidgetProps) {
  const settings: ProductWidgetCustomSettings = widget.settings || {};
  const { title, subtitle, showViewAll = true, viewAllUrl = "/shop" } = settings;
  const { products, loading } = useDynamicProducts(widget);

  const displayTitle = title || widget.title || "Handpicked Indian Products";
  const displaySub = subtitle || widget.subtitle;
  const gridCols = getGridColClasses(settings);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
            {displayTitle}
          </h3>
          {displaySub && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {displaySub}
            </p>
          )}
        </div>
        {showViewAll && (
          <Link
            href={viewAllUrl}
            className="text-xs text-fancy-blue hover:underline font-bold flex items-center space-x-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {loading && products.length === 0 ? (
        <div className="p-12 text-center text-slate-400 flex items-center justify-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin text-fancy-blue" />
          <span className="text-xs font-bold">Loading live catalog from database...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="p-8 text-center text-slate-400 border border-dashed border-slate-700 rounded-3xl text-xs">
          No products matched this dynamic filter.
        </div>
      ) : (
        <div className={`grid gap-3 md:gap-4 ${gridCols}`}>
          {products.map((p) => (
            <ProductCardItem key={p.id} p={p} settings={settings} />
          ))}
        </div>
      )}
    </div>
  );
}

export function FlashDealsWidget({ widget }: WidgetProps) {
  const settings: ProductWidgetCustomSettings = widget.settings || {};
  const {
    title = "Live Flash Deals",
    subtitle = "Special discounts expiring soon",
    badge = "FLAT 50% OFF",
    hoursRemaining = 14,
  } = settings;

  const { products, loading } = useDynamicProducts({
    ...widget,
    dataSource: { ...widget.dataSource, sourceType: "discounted" },
  });

  const gridCols = getGridColClasses(settings);

  return (
    <div className="p-5 md:p-6 bg-gradient-to-r from-amber-500/15 via-red-500/10 to-indigo-500/15 rounded-3xl border border-amber-500/30 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md animate-pulse">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
                {title || widget.title}
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-500 text-white animate-bounce">
                {badge}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {subtitle || widget.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 text-amber-300 font-mono text-xs font-bold px-3.5 py-2 rounded-2xl border border-amber-500/40">
          <Clock className="w-4 h-4 text-amber-400 animate-spin" />
          <span>Ends in: {hoursRemaining}h 42m 18s</span>
        </div>
      </div>

      {loading && products.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs">Loading flash sale...</div>
      ) : (
        <div className={`grid gap-3 md:gap-4 ${gridCols}`}>
          {products.map((p) => (
            <ProductCardItem
              key={p.id}
              p={p}
              settings={{ ...settings, showCountdown: true }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function BestSellersWidget({ widget }: WidgetProps) {
  const settings = widget.settings || {};
  const { products } = useDynamicProducts({
    ...widget,
    dataSource: { ...widget.dataSource, sourceType: "best_selling" },
  });
  const gridCols = getGridColClasses(settings);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Award className="w-6 h-6 text-amber-500" />
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {widget.title || "Top Best Sellers"}
          </h3>
          <p className="text-xs text-slate-400">Most purchased items across all departments</p>
        </div>
      </div>
      <div className={`grid gap-3 md:gap-4 ${gridCols}`}>
        {products.map((p) => (
          <ProductCardItem key={p.id} p={p} settings={settings} />
        ))}
      </div>
    </div>
  );
}

export function NewArrivalsWidget({ widget }: WidgetProps) {
  const settings = widget.settings || {};
  const { products } = useDynamicProducts({
    ...widget,
    dataSource: { ...widget.dataSource, sourceType: "latest" },
  });
  const gridCols = getGridColClasses(settings);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Sparkles className="w-6 h-6 text-fancy-blue" />
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {widget.title || "Fresh New Arrivals"}
          </h3>
          <p className="text-xs text-slate-400">Newly launched artisan batches & tech</p>
        </div>
      </div>
      <div className={`grid gap-3 md:gap-4 ${gridCols}`}>
        {products.map((p) => (
          <ProductCardItem key={p.id} p={p} settings={settings} />
        ))}
      </div>
    </div>
  );
}

export function FeaturedProductsWidget({ widget }: WidgetProps) {
  const settings = widget.settings || {};
  const { products } = useDynamicProducts({
    ...widget,
    dataSource: { ...widget.dataSource, sourceType: "featured" },
  });
  const gridCols = getGridColClasses(settings);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <TrendingUp className="w-6 h-6 text-indigo-500" />
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {widget.title || "Featured Collections"}
          </h3>
          <p className="text-xs text-slate-400">Curated picks by FancyHub editors</p>
        </div>
      </div>
      <div className={`grid gap-3 md:gap-4 ${gridCols}`}>
        {products.map((p) => (
          <ProductCardItem key={p.id} p={p} settings={settings} />
        ))}
      </div>
    </div>
  );
}

export function TrendingProductsWidget({ widget }: WidgetProps) {
  const settings = widget.settings || {};
  const { products } = useDynamicProducts({
    ...widget,
    dataSource: { ...widget.dataSource, sourceType: "trending" },
  });
  const gridCols = getGridColClasses(settings);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Flame className="w-6 h-6 text-red-500" />
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {widget.title || "Trending Now"}
          </h3>
          <p className="text-xs text-slate-400">High demand items with live orders</p>
        </div>
      </div>
      <div className={`grid gap-3 md:gap-4 ${gridCols}`}>
        {products.map((p) => (
          <ProductCardItem key={p.id} p={p} settings={settings} />
        ))}
      </div>
    </div>
  );
}

export function ProductCarouselWidget({ widget }: WidgetProps) {
  const settings = widget.settings || {};
  const { products } = useDynamicProducts(widget);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-black text-slate-900 dark:text-white">
        {widget.title || "Product Reel"}
      </h3>
      <div className="flex items-center space-x-4 overflow-x-auto pb-4 scrollbar-thin">
        {products.map((p) => (
          <div key={p.id} className="w-64 flex-shrink-0">
            <ProductCardItem p={p} settings={settings} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductSliderWidget({ widget }: WidgetProps) {
  const settings = widget.settings || {};
  const { products } = useDynamicProducts(widget);
  const heroProduct = products[0] || {
    name: "Pure Mulberry Banarasi Silk Saree",
    price: 3499,
    originalPrice: 6999,
    discount: 50,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
    vendorName: "Surat Silk Mills",
    rating: 4.9,
    slug: "pure-mulberry-banarasi-silk-saree",
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 border border-slate-800 shadow-2xl">
      <div className="w-full md:w-1/2 aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-slate-800">
        <img
          src={heroProduct.image}
          alt={heroProduct.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full md:w-1/2 space-y-4">
        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-fancy-blue text-white inline-block">
          SPOTLIGHT SELECTION
        </span>
        <h2 className="text-2xl md:text-3xl font-black">{heroProduct.name}</h2>
        <div className="flex items-baseline space-x-3">
          <span className="text-2xl font-black text-amber-400">
            ₹{heroProduct.price?.toLocaleString("en-IN")}
          </span>
          {heroProduct.originalPrice > heroProduct.price && (
            <span className="text-sm text-slate-400 line-through">
              ₹{heroProduct.originalPrice?.toLocaleString("en-IN")}
            </span>
          )}
          {heroProduct.discount > 0 && (
            <span className="text-xs font-black text-green-400">
              {heroProduct.discount}% OFF
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400">
          Handcrafted by {heroProduct.vendorName} with 100% silk certification.
        </p>
        <Link
          href={`/product/${heroProduct.slug}`}
          className="px-6 py-3 bg-fancy-blue hover:bg-blue-600 text-white font-black text-xs rounded-2xl inline-flex items-center space-x-2 shadow-lg"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Shop Spotlight Product</span>
        </Link>
      </div>
    </div>
  );
}

export function ProductCardWidget({ widget }: WidgetProps) {
  const settings = widget.settings || {};
  const { products } = useDynamicProducts(widget);
  const p = products[0] || {
    id: "sample_p",
    name: "Sample Spotlight Artisan Product",
    price: 1999,
    originalPrice: 3999,
    discount: 50,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
    vendorName: "Varanasi Silk Guild",
    rating: 4.8,
    slug: "sample-artisan-product",
    badge: "EXCLUSIVE",
  };

  return (
    <div className="max-w-md mx-auto">
      <ProductCardItem p={p} settings={settings} />
    </div>
  );
}

export function RecentlyViewedWidget({ widget }: WidgetProps) {
  return <ProductGridWidget widget={widget} />;
}

export function RecommendedProductsWidget({ widget }: WidgetProps) {
  return <ProductGridWidget widget={widget} />;
}

export function DealsWidget({ widget }: WidgetProps) {
  return <FlashDealsWidget widget={widget} />;
}

export function WishlistProductsWidget({ widget }: WidgetProps) {
  return <ProductGridWidget widget={widget} />;
}
