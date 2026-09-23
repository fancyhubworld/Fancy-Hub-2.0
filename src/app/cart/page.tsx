"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Store,
  Truck,
  Heart,
  CheckCircle2,
} from "lucide-react";
import { useMarketplace } from "@/lib/context";
import { formatINR } from "@/lib/design-tokens";
import { ROUTES } from "@/lib/routes";
import { EmptyState } from "@/components/ui/StateFeedback";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    vendorCartGroups,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartTotalShipping,
    cartDiscount,
    cartTax,
    cartPlatformFee,
    cartGrandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    toggleWishlist,
    theme,
  } = useMarketplace();

  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMessage({ text: res.message, error: !res.success });
    if (res.success) setCouponInput("");
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <EmptyState
          title="Your Shopping Bag is Empty"
          description="Discover thousands of authentic sarees, ANC earbuds, handcrafted home decor and custom prints directly from Indian creators!"
          actionText="Explore Marketplace"
          actionHref={ROUTES.shop}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
            Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Items grouped by verified sellers for transparent dispatch & delivery</p>
        </div>
        <Link href={ROUTES.shop} className="text-xs font-bold text-fancy-blue hover:underline hidden sm:block">
          ← Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Multi-Vendor Grouped Cart (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {vendorCartGroups.map((group) => (
            <div
              key={group.vendorId}
              className={`rounded-3xl overflow-hidden ${
                theme === "glassy"
                  ? "glass-card"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-subtle"
              }`}
            >
              {/* Vendor Sub-Order Header */}
              <div className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900 text-fancy-blue flex items-center justify-center">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-black text-slate-900 dark:text-white">Seller: {group.vendorName}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-fancy-blue" />
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Dispatches via Delhivery Express in 24-48h</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-slate-900 dark:text-white">{formatINR(group.subtotal)}</span>
                  <p className="text-[10px] text-green-700 font-semibold">Free Express Shipping</p>
                </div>
              </div>

              {/* Items in this Vendor Group */}
              <div className="p-5 divide-y divide-slate-100 dark:divide-slate-700">
                {group.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4 flex-1">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                      />
                      <div className="space-y-1">
                        <Link href={ROUTES.product(item.slug)} className="block">
                          <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white hover:text-fancy-blue line-clamp-2">
                            {item.title}
                          </h4>
                        </Link>
                        {(item.selectedColor || item.selectedSize) && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {item.selectedColor ? `Color: ${item.selectedColor}` : ""}
                            {item.selectedColor && item.selectedSize ? " • " : ""}
                            {item.selectedSize ? `Size: ${item.selectedSize}` : ""}
                          </p>
                        )}
                        <div className="flex items-baseline space-x-2">
                          <span className="text-sm font-black text-slate-900 dark:text-white">{formatINR(item.price)}</span>
                          {item.mrp > item.price && (
                            <span className="text-[11px] text-slate-400 line-through">{formatINR(item.mrp)}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-4">
                      <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-slate-800 dark:text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary & Coupon (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
              Order Pricing Breakdown
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Items Subtotal:</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatINR(cartSubtotal)}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Coupon Savings ({appliedCoupon}):</span>
                  <span>-{formatINR(cartDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Delivery & Shipping:</span>
                <span className="font-bold text-green-700">FREE</span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Platform Convenience Fee:</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatINR(cartPlatformFee)}</span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>GST Tax (Included):</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatINR(cartTax)}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
                <span className="text-sm font-black text-slate-900 dark:text-white">Total Amount:</span>
                <span className="text-xl font-black text-fancy-blue">{formatINR(cartGrandTotal)}</span>
              </div>
            </div>

            {/* Coupon Box */}
            <form onSubmit={handleApplyCoupon} className="pt-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter Coupon Code"
                  className="flex-1 border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-bold uppercase text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
                />
                <button
                  type="submit"
                  className="bg-fancy-blue hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                >
                  Apply
                </button>
              </div>
              {couponMessage && (
                <p className={`text-[11px] mt-1 font-bold ${couponMessage.error ? "text-red-500" : "text-green-600"}`}>
                  {couponMessage.text}
                </p>
              )}
            </form>

            <button
              onClick={() => router.push(ROUTES.checkout)}
              className="w-full py-3.5 bg-fancy-orange hover:bg-orange-600 text-white font-black text-sm rounded-2xl shadow-elevated transition flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
