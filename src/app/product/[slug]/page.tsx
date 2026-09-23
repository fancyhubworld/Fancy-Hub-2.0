"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Heart,
  ShoppingCart,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Store,
  CheckCircle2,
  Share2,
  ChevronRight,
  Sparkles,
  MapPin,
  Clock,
  Check,
  Award,
  Tag,
  Gift,
  HelpCircle,
  Scale,
  Eye,
} from "lucide-react";
import { PRODUCTS_DATA, VENDORS_DATA } from "@/data/mock-catalog";
import { formatINR, calculateSavings } from "@/lib/design-tokens";
import { lookupPincode } from "@/lib/pincodes";
import { useMarketplace } from "@/lib/context";
import { ProductCard } from "@/components/products/ProductCard";
import { Breadcrumbs } from "@/components/ui/StateFeedback";
import { ROUTES } from "@/lib/routes";
import { DEFAULT_PRODUCT_PAGE_BLOCKS, ProductPageBlock } from "@/lib/product-page-layout";
import { generateProductSchema, generateBreadcrumbSchema } from "@/lib/seo-structured-data";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { addToCart, toggleWishlist, isInWishlist, activePincode, setActivePincode, theme } = useMarketplace();

  const [blocks, setBlocks] = useState<ProductPageBlock[]>(DEFAULT_PRODUCT_PAGE_BLOCKS);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("Free Size");
  const [selectedColor, setSelectedColor] = useState("Royal Crimson Red");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");
  const [pincodeInput, setPincodeInput] = useState(activePincode || "395003");
  const [isCopied, setIsCopied] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const product = PRODUCTS_DATA.find((p) => p.slug === slug) || PRODUCTS_DATA[0];
  const vendor = VENDORS_DATA.find((v) => v.id === product.vendorId) || VENDORS_DATA[0];

  useEffect(() => {
    fetch("/api/public/product-layout")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.blocks) {
          setBlocks(data.blocks);
        }
      })
      .catch((err) => {
        console.error("Failed to load dynamic product page layout", err);
      });
  }, []);

  const selectedVariant = product.variants[selectedVariantIndex] || {
    id: "default",
    price: product.price,
    mrp: product.mrp,
    stock: product.stock,
  };

  const effectivePrice = selectedVariant.price || product.price;
  const effectiveMrp = selectedVariant.mrp || product.mrp;
  const savings = calculateSavings(effectiveMrp, effectivePrice);
  const inWish = isInWishlist(product.id);
  const pincodeInfo = lookupPincode(pincodeInput);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      variantId: selectedVariant.id !== "default" ? selectedVariant.id : undefined,
      title: product.title,
      slug: product.slug,
      sku: product.sku,
      image: product.images[0]?.url || "https://placehold.co/400x400?text=FancyHub",
      price: effectivePrice,
      mrp: effectiveMrp,
      quantity,
      selectedColor,
      selectedSize,
      vendorId: product.vendorId,
      vendorName: product.vendorName,
      vendorSlug: product.vendorSlug,
      maxStock: product.stock,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push(ROUTES.checkout);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const relatedProducts = PRODUCTS_DATA.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  ).slice(0, 4);

  // Modular Block Renderer
  const renderProductBlock = (block: ProductPageBlock) => {
    if (!block.isActive) return null;

    switch (block.type) {
      case "PRODUCT_GALLERY":
        return (
          <div key={block.id} className="space-y-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-card">
              <img
                src={product.images[selectedImgIndex]?.url || "https://placehold.co/600x600?text=FancyHub"}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />
              {savings.percent > 0 && (
                <div className="absolute top-4 left-4 bg-fancy-orange text-white text-xs font-black px-3 py-1 rounded-xl shadow">
                  {savings.percent}% OFF
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`w-16 h-16 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition ${
                      selectedImgIndex === idx
                        ? "border-fancy-blue scale-105 shadow-sm"
                        : "border-slate-200 dark:border-slate-700 opacity-70"
                    }`}
                  >
                    <img src={img.url} alt={img.alt || product.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      case "PRODUCT_TITLE":
        return (
          <div key={block.id} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-fancy-blue tracking-wider uppercase">
              <span>{product.brandName || "FancyHub Direct"}</span>
              <span className="text-slate-400 font-mono text-[10px]">SKU: {product.sku}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {product.title}
            </h1>
          </div>
        );

      case "PRODUCT_RATING":
        return (
          <div key={block.id} className="flex items-center space-x-3 text-xs">
            <div className="inline-flex items-center space-x-1 bg-green-700 text-white font-bold px-2 py-0.5 rounded">
              <span>{product.ratings.toFixed(1)}</span>
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span className="text-slate-500 dark:text-slate-400">{product.reviewCount} Ratings & Reviews</span>
            <span className="text-slate-300">•</span>
            <span className="text-green-700 font-bold">{product.soldCount}+ Orders Fulfilled</span>
          </div>
        );

      case "PRODUCT_PRICE":
        return (
          <div key={block.id} className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="flex items-baseline space-x-3">
              <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                {formatINR(effectivePrice)}
              </span>
              {effectiveMrp > effectivePrice && (
                <span className="text-sm text-slate-400 line-through">
                  {formatINR(effectiveMrp)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Inclusive of all Indian taxes (GST) • 100% Free Shipping</p>
          </div>
        );

      case "PRODUCT_DISCOUNT":
        return (
          <div key={block.id} className="flex items-center space-x-2">
            {savings.percent > 0 && (
              <span className="text-xs font-black text-fancy-orange bg-orange-100 dark:bg-orange-950 px-2.5 py-1 rounded-xl">
                Save {formatINR(savings.amount)} ({savings.percent}% OFF)
              </span>
            )}
          </div>
        );

      case "VARIANT_SELECTOR":
        return product.variants.length > 0 ? (
          <div key={block.id} className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Select Style / Variant
            </label>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 border ${
                    selectedVariantIndex === idx
                      ? "border-fancy-blue bg-blue-50 dark:bg-blue-950 text-fancy-blue shadow-sm"
                      : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {v.colorHex && (
                    <span className="w-3.5 h-3.5 rounded-full border" style={{ backgroundColor: v.colorHex }} />
                  )}
                  <span>{v.title}</span>
                  <span className="text-slate-400 font-mono">({formatINR(v.price)})</span>
                </button>
              ))}
            </div>
          </div>
        ) : null;

      case "SIZE_SELECTOR":
        return (
          <div key={block.id} className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Select Size</span>
              <button className="text-fancy-blue font-bold hover:underline text-[11px]">Size Guide</button>
            </div>
            <div className="flex gap-2">
              {["Free Size", "5.5M + Blouse", "6.3M Grand"].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    selectedSize === sz
                      ? "bg-fancy-blue text-white border-fancy-blue shadow"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        );

      case "COLOR_SELECTOR":
        return (
          <div key={block.id} className="space-y-2">
            <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Selected Color: {selectedColor}
            </span>
            <div className="flex gap-2.5">
              {[
                { name: "Royal Crimson Red", hex: "#DC2626" },
                { name: "Peacock Blue", hex: "#0284C7" },
                { name: "Emerald Forest", hex: "#059669" },
                { name: "Golden Zari", hex: "#D97706" },
              ].map((c) => (
                <div
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`w-7 h-7 rounded-full border-2 cursor-pointer shadow transition ${
                    selectedColor === c.name ? "border-fancy-blue ring-2 ring-fancy-blue/40 scale-110" : "border-slate-400"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        );

      case "QUANTITY_SELECTOR":
        return (
          <div key={block.id} className="flex items-center space-x-4">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Quantity:</span>
            <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold"
              >
                -
              </button>
              <span className="px-4 py-1.5 text-xs font-black text-slate-900 dark:text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold"
              >
                +
              </button>
            </div>
          </div>
        );

      case "ADD_TO_CART":
        return (
          <div key={block.id} className="pt-1">
            <button
              onClick={handleAddToCart}
              className={`w-full py-3.5 px-4 rounded-2xl text-xs md:text-sm font-black transition shadow flex items-center justify-center space-x-2 ${
                isAdded
                  ? "bg-green-600 text-white"
                  : "bg-blue-50 dark:bg-slate-800 text-fancy-blue dark:text-blue-300 border-2 border-fancy-blue/30 hover:border-fancy-blue"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{isAdded ? "Added to Cart ✓" : "Add to Cart"}</span>
            </button>
          </div>
        );

      case "BUY_NOW":
        return (
          <div key={block.id} className="pt-1">
            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 px-4 bg-fancy-orange hover:bg-orange-600 text-white rounded-2xl text-xs md:text-sm font-black transition shadow-elevated flex items-center justify-center space-x-2 active:scale-95"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Buy Now (1-Click Express Checkout)</span>
            </button>
          </div>
        );

      case "WISHLIST_BUTTON":
        return (
          <div key={block.id} className="flex items-center justify-between text-xs pt-1">
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`flex items-center space-x-1.5 font-bold transition ${
                inWish ? "text-red-500" : "text-slate-500 hover:text-red-500"
              }`}
            >
              <Heart className={`w-4 h-4 ${inWish ? "fill-current" : ""}`} />
              <span>{inWish ? "Saved in Wishlist" : "Add to Wishlist"}</span>
            </button>

            <button
              onClick={handleShare}
              className="text-slate-500 hover:text-fancy-blue font-bold flex items-center space-x-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isCopied ? "Link Copied!" : "Share"}</span>
            </button>
          </div>
        );

      case "DELIVERY_CHECKER":
        return (
          <div key={block.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-white">
              <MapPin className="w-4 h-4 text-fancy-blue" />
              <span>Delivery & Payment Options for:</span>
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                maxLength={6}
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit PIN code"
                className="flex-1 border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
              />
              <button
                onClick={() => setActivePincode(pincodeInput)}
                className="py-2 px-4 bg-fancy-blue text-white text-xs font-bold rounded-xl shadow"
              >
                Check
              </button>
            </div>
            {pincodeInfo.isServiceable ? (
              <div className="text-xs text-green-700 dark:text-green-400 space-y-1">
                <p>✓ Express delivery to <strong>{pincodeInfo.city}, {pincodeInfo.state}</strong> by {pincodeInfo.deliveryDays} Days</p>
                <p>✓ Cash on Delivery (COD) Available with ₹0 advance</p>
              </div>
            ) : (
              <p className="text-xs text-red-500">Unserviceable pincode. Please try another location.</p>
            )}
          </div>
        );

      case "SELLER_INFO":
        return (
          <div key={block.id} className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={vendor.storeLogo} alt={vendor.storeName} className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm" />
              <div>
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-slate-900 dark:text-white text-xs">{vendor.storeName}</span>
                  {vendor.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-fancy-blue" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{vendor.city}, {vendor.state} • Rating: {vendor.rating}★</p>
              </div>
            </div>
            <Link
              href={ROUTES.vendor(vendor.slug)}
              className="text-xs font-bold text-fancy-blue hover:underline"
            >
              Visit Store →
            </Link>
          </div>
        );

      case "OFFERS_LIST":
        return (
          <div key={block.id} className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-1.5 text-xs">
            <div className="flex items-center space-x-1.5 font-bold text-amber-500">
              <Tag className="w-3.5 h-3.5" />
              <span>Available Offers & Coupons</span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300">
              🏷️ <strong>FANCYFIRST</strong>: FLAT ₹500 OFF on your first purchase
            </p>
            <p className="text-[11px] text-slate-700 dark:text-slate-300">
              💳 Extra 10% instant discount on HDFC / ICICI UPI orders
            </p>
          </div>
        );

      case "DESCRIPTION":
        return (
          <div key={block.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle space-y-4">
            <h3 className="font-black text-base text-slate-900 dark:text-white">Product Description & Heritage Story</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>
        );

      case "SPECIFICATIONS":
        return (
          <div key={block.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle space-y-4">
            <h3 className="font-black text-base text-slate-900 dark:text-white">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Brand</span>
                <span className="font-bold">{product.brandName || "FancyHub Direct"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Category</span>
                <span className="font-bold">{product.categoryName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">SKU Code</span>
                <span className="font-bold">{product.sku}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Country of Origin</span>
                <span className="font-bold">India (100% Made in India)</span>
              </div>
            </div>
          </div>
        );

      case "REVIEWS_SECTION":
        return (
          <div key={block.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-base text-slate-900 dark:text-white">Customer Reviews ({product.reviewCount})</h3>
              <button className="text-xs bg-fancy-blue text-white px-3.5 py-1.5 rounded-xl font-bold">Write a Review</button>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-xs space-y-1">
                <div className="flex items-center space-x-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <p className="font-bold text-slate-900 dark:text-white">“Absolutely breathtaking silk weave!”</p>
                <p className="text-slate-600 dark:text-slate-300">The zari shine and saree fabric are so luxurious. Delivered safely in a gift box.</p>
                <span className="text-[10px] text-slate-400 block pt-1">Verified Buyer • Mumbai</span>
              </div>
            </div>
          </div>
        );

      case "FREQUENTLY_BOUGHT_TOGETHER":
        return (
          <div key={block.id} className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-3xl p-6 space-y-4">
            <h3 className="font-black text-base text-indigo-300">Frequently Bought Together</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img src={product.images[0]?.url} alt="" className="w-16 h-16 rounded-xl object-cover" />
                <span className="text-lg font-bold text-slate-400">+</span>
                <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=200&auto=format&fit=crop&q=80" alt="" className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <p className="text-xs font-bold text-white">Matching Handloom Blouse Piece</p>
                  <p className="text-xs text-emerald-400 font-bold">Bundle Price: ₹{(effectivePrice + 899).toLocaleString("en-IN")}</p>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow"
              >
                Add Both to Cart
              </button>
            </div>
          </div>
        );

      case "RELATED_PRODUCTS":
        return (
          <div key={block.id} className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Related Products</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        );

      case "RECENTLY_VIEWED":
        return (
          <div key={block.id} className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Recently Viewed</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PRODUCTS_DATA.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const leftBlocks = blocks.filter((b) => b.zone === "LEFT" && b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const rightBlocks = blocks.filter((b) => b.zone === "RIGHT" && b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const bottomBlocks = blocks.filter((b) => b.zone === "BOTTOM" && b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

  const productSchema = generateProductSchema(product, vendor);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: ROUTES.home },
    { name: product.categoryName, url: ROUTES.category(product.categorySlug) },
    { name: product.title, url: `/product/${product.slug}` },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: ROUTES.home },
          { label: product.categoryName, href: ROUTES.category(product.categorySlug) },
          { label: product.title },
        ]}
      />

      {/* Main Top 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Media Zone (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {leftBlocks.map((blk) => renderProductBlock(blk))}
        </div>

        {/* Right Details Zone (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {rightBlocks.map((blk) => renderProductBlock(blk))}
        </div>
      </div>

      {/* Bottom Full-Width Zone */}
      <div className="space-y-8">
        {bottomBlocks.map((blk) => renderProductBlock(blk))}
      </div>
    </div>
  );
}
