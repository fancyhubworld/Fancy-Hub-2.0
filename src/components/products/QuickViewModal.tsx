"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Star, Heart, ShoppingCart, Truck, ShieldCheck, Check } from "lucide-react";
import { useMarketplace } from "@/lib/context";
import { formatINR, calculateSavings } from "@/lib/design-tokens";
import { lookupPincode } from "@/lib/pincodes";

export function QuickViewModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart, activePincode } = useMarketplace();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const variant = product.variants[selectedVariantIndex] || {
    id: "default",
    price: product.price,
    mrp: product.mrp,
    stock: product.stock,
  };

  const effectivePrice = variant.price || product.price;
  const effectiveMrp = variant.mrp || product.mrp;
  const savings = calculateSavings(effectiveMrp, effectivePrice);
  const pincodeInfo = lookupPincode(activePincode);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      variantId: variant.id !== "default" ? variant.id : undefined,
      title: product.title,
      slug: product.slug,
      sku: product.sku,
      image: product.images[0]?.url || "https://placehold.co/400x400?text=FancyHub",
      price: effectivePrice,
      mrp: effectiveMrp,
      quantity,
      selectedColor: variant.color,
      selectedSize: variant.size,
      vendorId: product.vendorId,
      vendorName: product.vendorName,
      vendorSlug: product.vendorSlug,
      maxStock: product.stock,
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setQuickViewProduct(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="aspect-square rounded-2xl bg-slate-50 overflow-hidden border border-slate-200">
              <img
                src={product.images[selectedImageIndex]?.url || product.images[0]?.url}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl border-2 overflow-hidden ${
                      selectedImageIndex === idx ? "border-fancy-blue" : "border-slate-200"
                    }`}
                  >
                    <img src={img.url} alt={img.alt || ""} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-fancy-blue mb-1">
                {product.categoryName} • Sold by {product.vendorName}
              </div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
                {product.title}
              </h2>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="inline-flex items-center space-x-1 bg-green-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                <span>{product.ratings.toFixed(1)}</span>
                <Star className="w-3 h-3 fill-current" />
              </div>
              <span className="text-xs text-slate-500">({product.reviewCount} Verified Buyer Reviews)</span>
            </div>

            {/* Price */}
            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-2xl">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-slate-900">{formatINR(effectivePrice)}</span>
                {effectiveMrp > effectivePrice && (
                  <>
                    <span className="text-sm text-slate-400 line-through">{formatINR(effectiveMrp)}</span>
                    <span className="text-xs font-black text-fancy-orange bg-orange-100 px-2 py-0.5 rounded">
                      {savings.percent}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Inclusive of all Indian GST taxes</p>
            </div>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div>
                <p className="text-xs font-bold text-slate-700 mb-1.5">Select Variant:</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, idx) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        selectedVariantIndex === idx
                          ? "border-fancy-blue bg-blue-50 text-fancy-blue"
                          : "border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1 text-xs font-bold text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="flex items-center space-x-2 text-xs text-slate-600">
              <Truck className="w-4 h-4 text-green-600" />
              <span>Delivering to <strong>{pincodeInfo.city} ({pincodeInfo.pincode})</strong> in {pincodeInfo.deliveryDays} Days</span>
            </div>

            {/* Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleAddToCart}
                className={`w-full py-3 rounded-xl font-bold text-sm transition flex items-center justify-center space-x-2 ${
                  isAdded ? "bg-green-600 text-white" : "bg-fancy-blue hover:bg-blue-700 text-white shadow-elevated"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add {quantity} Item(s) to Cart</span>
                  </>
                )}
              </button>

              <Link
                href={`/product/${product.slug}`}
                onClick={() => setQuickViewProduct(null)}
                className="block text-center text-xs font-bold text-fancy-blue hover:underline py-1"
              >
                View Full Specifications & Buyer Reviews →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
