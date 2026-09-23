"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Star, ShoppingCart, Eye, Zap, Check, Truck } from "lucide-react";
import { ProductItem } from "@/lib/types";
import { formatINR, calculateSavings } from "@/lib/design-tokens";
import { useMarketplace } from "@/lib/context";
import { lookupPincode } from "@/lib/pincodes";
import { ROUTES } from "@/lib/routes";

interface ProductCardProps {
  product: ProductItem;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { toggleWishlist, isInWishlist, addToCart, setQuickViewProduct, activePincode, theme } = useMarketplace();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const selectedVariant = product.variants[selectedVariantIndex] || {
    id: "default",
    price: product.price,
    mrp: product.mrp,
    stock: product.stock,
    colorHex: undefined,
    color: undefined,
  };

  const effectivePrice = selectedVariant.price || product.price;
  const effectiveMrp = selectedVariant.mrp || product.mrp;
  const savings = calculateSavings(effectiveMrp, effectivePrice);
  const inWish = isInWishlist(product.id);
  const pincodeInfo = lookupPincode(activePincode);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      variantId: selectedVariant.id !== "default" ? selectedVariant.id : undefined,
      title: product.title,
      slug: product.slug,
      sku: product.sku,
      image: product.images[0]?.url || "https://placehold.co/400x400?text=FancyHub",
      price: effectivePrice,
      mrp: effectiveMrp,
      quantity: 1,
      selectedColor: selectedVariant.color,
      selectedSize: selectedVariant.size,
      vendorId: product.vendorId,
      vendorName: product.vendorName,
      vendorSlug: product.vendorSlug,
      maxStock: product.stock,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div
      className={`group relative rounded-2xl md:rounded-3xl p-3 md:p-3.5 transition-all duration-300 flex flex-col justify-between h-full ${
        theme === "glassy"
          ? "glass-card shadow-sm hover:shadow-elevated"
          : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 shadow-subtle hover:shadow-elevated"
      }`}
    >
      {/* Top Image Container */}
      <div>
        <div className="relative aspect-square w-full rounded-xl md:rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 mb-3">
          <Link href={ROUTES.product(product.slug)} className="block w-full h-full">
            <img
              src={product.images[0]?.url || "https://placehold.co/400x400?text=FancyHub"}
              alt={product.title}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
            />
          </Link>

          {/* Discount Badge */}
          {savings.percent > 0 && (
            <div className="absolute top-2 left-2 bg-fancy-orange text-white text-[10px] md:text-[11px] font-black px-2 py-0.5 rounded-lg shadow-sm">
              {savings.percent}% OFF
            </div>
          )}

          {/* Flash Deal Tag */}
          {product.isFlashDeal && (
            <div className="absolute top-2 right-10 bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center space-x-0.5 shadow-sm">
              <Zap className="w-2.5 h-2.5 fill-current" />
              <span>FLASH</span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm ${
              inWish
                ? "bg-red-50 text-red-500 border border-red-200"
                : "bg-white/90 dark:bg-slate-800/90 hover:bg-white text-slate-600 dark:text-slate-200 hover:text-red-500"
            }`}
            aria-label="Toggle Wishlist"
          >
            <Heart className={`w-4 h-4 ${inWish ? "fill-current" : ""}`} />
          </button>

          {/* Quick View Button on Hover */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center space-x-1.5 whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5 text-fancy-blue" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Brand & Seller */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-semibold text-slate-600 dark:text-slate-300 truncate">
            {product.brandName || "FancyHub Direct"}
          </span>
          <Link
            href={ROUTES.vendor(product.vendorSlug)}
            className="text-[10px] text-fancy-blue hover:underline font-medium truncate max-w-[110px]"
          >
            {product.vendorName}
          </Link>
        </div>

        {/* Title */}
        <Link href={ROUTES.product(product.slug)} className="block">
          <h3 className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-fancy-blue line-clamp-2 leading-snug mb-1.5 transition">
            {product.title}
          </h3>
        </Link>

        {/* Rating & Reviews */}
        <div className="flex items-center space-x-1.5 mb-2">
          <div className="inline-flex items-center space-x-1 bg-green-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            <span>{product.ratings.toFixed(1)}</span>
            <Star className="w-2.5 h-2.5 fill-current" />
          </div>
          <span className="text-[10px] text-slate-400 font-medium">({product.reviewCount})</span>
          {product.soldCount > 0 && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-auto font-medium">
              {product.soldCount}+ bought
            </span>
          )}
        </div>

        {/* Color / Variant Swatches */}
        {product.variants.length > 1 && (
          <div className="flex items-center space-x-1.5 mb-2.5">
            {product.variants.map((v, idx) => (
              <button
                key={v.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedVariantIndex(idx);
                }}
                title={v.title}
                className={`w-4 h-4 rounded-full border transition ${
                  selectedVariantIndex === idx ? "ring-2 ring-fancy-blue ring-offset-1 scale-110" : "border-slate-300 dark:border-slate-600"
                }`}
                style={{ backgroundColor: v.colorHex || "#3b82f6" }}
              />
            ))}
            <span className="text-[10px] text-slate-400 font-medium ml-1">
              +{product.variants.length} styles
            </span>
          </div>
        )}
      </div>

      {/* Bottom Pricing & Actions */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
        <div className="flex items-baseline space-x-2 mb-1">
          <span className="text-base md:text-lg font-black text-slate-900 dark:text-white">
            {formatINR(effectivePrice)}
          </span>
          {effectiveMrp > effectivePrice && (
            <span className="text-xs text-slate-400 line-through">
              {formatINR(effectiveMrp)}
            </span>
          )}
        </div>

        {/* Delivery ETA badge */}
        <div className="flex items-center space-x-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-3">
          <Truck className="w-3 h-3 text-green-600 flex-shrink-0" />
          <span>Delivery in <strong>{pincodeInfo.deliveryDays} Days</strong></span>
        </div>

        {/* Add to Cart / Buy Now Action Buttons */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={handleAddToCart}
            className={`w-full py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
              isAdded
                ? "bg-green-600 text-white"
                : "bg-blue-50 dark:bg-slate-700 hover:bg-blue-100 text-fancy-blue dark:text-blue-300"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <Link
            href={ROUTES.product(product.slug)}
            className="w-full py-2 px-2 bg-fancy-orange hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition text-center flex items-center justify-center"
          >
            <span>Buy Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
