"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Clock,
  Share2,
  Sparkles,
  ShoppingBag,
  CheckCircle,
  MapPin,
  X,
  ArrowRight,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { useMarketplace } from "@/lib/context";
import { formatINR } from "@/lib/design-tokens";
import {
  GroupDeal,
  getActiveGroupDeals,
  generateWhatsAppInviteLink,
} from "@/lib/group-buying-engine";

export interface GroupBuyingWidgetProps {
  settings?: {
    title?: string;
    subtitle?: string;
    limit?: number;
    categoryFilter?: string;
    showTimer?: boolean;
  };
  style?: {
    paddingY?: string;
  };
}

export function GroupBuyingWidget({ settings, style }: GroupBuyingWidgetProps) {
  const { addToCart } = useMarketplace();
  const deals = getActiveGroupDeals(settings?.categoryFilter).slice(0, settings?.limit || 3);

  const [selectedDealForJoin, setSelectedDealForJoin] = useState<GroupDeal | null>(null);
  const [userName, setUserName] = useState("");
  const [userPincode, setUserPincode] = useState("");
  const [joinedToast, setJoinedToast] = useState<string | null>(null);

  const handleOpenJoinModal = (deal: GroupDeal) => {
    setSelectedDealForJoin(deal);
  };

  const handleJoinPool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDealForJoin) return;

    const wholesalePrice = selectedDealForJoin.tieredPricing[selectedDealForJoin.tieredPricing.length - 1].pricePerUnit;

    addToCart({
      productId: selectedDealForJoin.id,
      title: `[Group Deal] ${selectedDealForJoin.title}`,
      slug: selectedDealForJoin.slug,
      sku: `GRP-${selectedDealForJoin.id}`,
      image: selectedDealForJoin.image,
      price: wholesalePrice,
      mrp: selectedDealForJoin.mrp,
      quantity: 1,
      vendorId: "v-1",
      vendorName: selectedDealForJoin.vendorName,
      vendorSlug: "vendor-guild",
      maxStock: 20,
    });

    setJoinedToast(`Joined group pool! Unlocked wholesale price of ${formatINR(wholesalePrice)} for ${selectedDealForJoin.title}`);
    setSelectedDealForJoin(null);
    setUserName("");
    setUserPincode("");
    setTimeout(() => setJoinedToast(null), 3500);
  };

  return (
    <section
      className={`w-full ${
        style?.paddingY || "py-10"
      } bg-slate-900 text-white font-sans overflow-hidden`}
    >
      {/* Toast Alert */}
      {joinedToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-fadeIn">
          <CheckCircle className="w-4 h-4" />
          <span>{joinedToast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black tracking-wider uppercase mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>SOCIAL GROUP BUYING & BULK SAVINGS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {settings?.title || "Buy Together & Save Up to 35%"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {settings?.subtitle ||
                "Invite friends on WhatsApp to unlock direct-from-weaver wholesale prices with delivery to separate addresses."}
            </p>
          </div>

          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>100% Guaranteed Separate Delivery</span>
          </div>
        </div>

        {/* Group Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deals.map((deal) => {
            const wholesaleTier = deal.tieredPricing[deal.tieredPricing.length - 1];
            const slotsRemaining = deal.currentPool.targetMembers - deal.currentPool.membersJoined;
            const whatsappLink = generateWhatsAppInviteLink(deal, deal.currentPool.poolId);

            return (
              <div
                key={deal.id}
                className="bg-slate-950/80 rounded-3xl border border-slate-800 hover:border-purple-500/40 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl group"
              >
                {/* Product Image & Urgency Pill */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-black text-white border border-white/10 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      <span>{deal.vendorCity}</span>
                    </span>

                    <span className="px-2.5 py-1 rounded-full bg-rose-600/90 text-white text-[10px] font-black uppercase flex items-center space-x-1 shadow-lg">
                      <Clock className="w-3 h-3 animate-pulse" />
                      <span>{slotsRemaining} Slot Left • 1h 14m</span>
                    </span>
                  </div>

                  {/* Wholesale Unlock Banner */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-300 block">TRIO WHOLESALE PRICE</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-black text-emerald-400">{formatINR(wholesaleTier.pricePerUnit)}</span>
                        <span className="text-xs text-slate-400 line-through">{formatINR(deal.retailPrice)}</span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                      Save {formatINR(deal.retailPrice - wholesaleTier.pricePerUnit)}
                    </span>
                  </div>
                </div>

                {/* Deal Details & Live Pool Progress */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-sm text-white line-clamp-2 leading-snug">
                      {deal.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">Direct from {deal.vendorName}</p>

                    {/* Member Pool Progress Bar */}
                    <div className="mt-4 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-300 flex items-center space-x-1.5">
                          <Users className="w-3.5 h-3.5 text-blue-400" />
                          <span>Group Pool: {deal.currentPool.membersJoined}/{deal.currentPool.targetMembers} Joined</span>
                        </span>
                        <span className="text-[10px] font-bold text-amber-400">Need 1 more</span>
                      </div>

                      {/* Avatars */}
                      <div className="flex items-center space-x-2">
                        {deal.currentPool.members.map((m) => (
                          <div key={m.id} className="relative group/avatar" title={`${m.name} (${m.city})`}>
                            <img
                              src={m.avatar}
                              alt={m.name}
                              className="w-7 h-7 rounded-full border border-purple-400 object-cover"
                            />
                          </div>
                        ))}
                        {slotsRemaining > 0 && (
                          <div className="w-7 h-7 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                            +1
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dual CTA: WhatsApp Share + Join Button */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      onClick={() => handleOpenJoinModal(deal)}
                      className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition flex items-center justify-center space-x-1.5 shadow-md shadow-purple-600/20"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Join Pool</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Join Group Modal */}
      {selectedDealForJoin && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 relative">
            <button
              onClick={() => setSelectedDealForJoin(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <img
                src={selectedDealForJoin.image}
                alt={selectedDealForJoin.title}
                className="w-14 h-14 rounded-2xl object-cover border border-purple-500/40 shrink-0"
              />
              <div>
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider block">
                  JOINING GROUP POOL
                </span>
                <h4 className="text-sm font-black text-white line-clamp-1">
                  {selectedDealForJoin.title}
                </h4>
                <p className="text-xs font-bold text-emerald-400">
                  Wholesale Price: {formatINR(selectedDealForJoin.tieredPricing[selectedDealForJoin.tieredPricing.length - 1].pricePerUnit)}
                </p>
              </div>
            </div>

            <form onSubmit={handleJoinPool} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Malhotra"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Delivery Pincode
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 400001"
                  value={userPincode}
                  onChange={(e) => setUserPincode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  ✓ Separate doorstep delivery to your address even if your friend lives in another city.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-purple-500/20 transition flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Confirm & Add to Cart</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default GroupBuyingWidget;
