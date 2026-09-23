"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ShoppingBag,
  Heart,
  Eye,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useMarketplace } from "@/lib/context";
import { formatINR } from "@/lib/design-tokens";
import { ShoppableReel, getShoppableReels } from "@/lib/shoppable-reels-engine";

export interface ShoppableReelsWidgetProps {
  settings?: {
    title?: string;
    subtitle?: string;
    autoPlay?: boolean;
    showProductPill?: boolean;
    limit?: number;
    categoryFilter?: string;
  };
  style?: {
    paddingY?: string;
    backgroundColor?: string;
  };
}

export function ShoppableReelsWidget({ settings, style }: ShoppableReelsWidgetProps) {
  const { addToCart } = useMarketplace();
  const reels = getShoppableReels({
    category: settings?.categoryFilter,
    limit: settings?.limit || 6,
  });

  const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleOpenReel = (index: number) => {
    setActiveReelIndex(index);
    setIsPlaying(true);
  };

  const handleCloseReel = () => {
    setActiveReelIndex(null);
  };

  const handleNextReel = () => {
    if (activeReelIndex !== null && activeReelIndex < reels.length - 1) {
      setActiveReelIndex(activeReelIndex + 1);
    } else {
      setActiveReelIndex(0);
    }
  };

  const handlePrevReel = () => {
    if (activeReelIndex !== null && activeReelIndex > 0) {
      setActiveReelIndex(activeReelIndex - 1);
    } else {
      setActiveReelIndex(reels.length - 1);
    }
  };

  const toggleLike = (reelId: string) => {
    setLikedReels((prev) => ({ ...prev, [reelId]: !prev[reelId] }));
  };

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    addToCart({
      productId: product.id,
      title: product.title,
      slug: product.slug || "product",
      sku: `SKU-${product.id}`,
      image: product.image,
      price: product.price,
      mrp: product.mrp,
      quantity: 1,
      vendorId: "v-1",
      vendorName: product.vendorName || "Surat Silk Mills",
      vendorSlug: "surat-silk-mills",
      maxStock: 50,
    });
    setAddedToast(`Added ${product.title} to cart!`);
    setTimeout(() => setAddedToast(null), 2500);
  };

  const activeReel = activeReelIndex !== null ? reels[activeReelIndex] : null;

  return (
    <section className={`w-full ${style?.paddingY || "py-10"} bg-slate-950 text-white font-sans overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast Alert */}
        {addedToast && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-fadeIn">
            <ShoppingBag className="w-4 h-4" />
            <span>{addedToast}</span>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-black tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LIVE VIDEO COMMERCE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {settings?.title || "Watch & Shop Live Video Reels"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {settings?.subtitle || "See authentic master weavers in action and unbox trending innovations."}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-bold">Swipe / Click to Explore</span>
          </div>
        </div>

        {/* Reels Horizontal Grid / Carousel */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {reels.map((reel, idx) => {
            const isLiked = likedReels[reel.id];
            return (
              <div
                key={reel.id}
                onClick={() => handleOpenReel(idx)}
                className="group relative aspect-[9/16] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 flex flex-col justify-between p-3.5"
              >
                {/* Background Image / Thumbnail */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${reel.thumbnailUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />

                {/* Top Bar (Creator & Views) */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={reel.creatorAvatar}
                      alt={reel.creatorName}
                      className="w-7 h-7 rounded-full border border-white/40 object-cover"
                    />
                    <div className="overflow-hidden">
                      <p className="text-[11px] font-black text-white flex items-center space-x-1 drop-shadow">
                        <span className="truncate max-w-[90px]">{reel.creatorName}</span>
                        {reel.isVerifiedWeaver && <CheckCircle className="w-3 h-3 text-blue-400 shrink-0" />}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-bold text-white border border-white/10">
                    <Eye className="w-3 h-3 text-slate-300" />
                    <span>{(reel.viewCount / 1000).toFixed(1)}k</span>
                  </div>
                </div>

                {/* Center Play Icon Overlay */}
                <div className="relative z-10 self-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition shadow-lg">
                  <Play className="w-5 h-5 ml-0.5 fill-white" />
                </div>

                {/* Bottom Tagged Product Card */}
                <div className="relative z-10 space-y-2">
                  <p className="text-xs font-bold text-white line-clamp-2 drop-shadow leading-tight">
                    {reel.title}
                  </p>

                  {settings?.showProductPill !== false && (
                    <div className="p-2 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/20 flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        <img
                          src={reel.taggedProduct.image}
                          alt={reel.taggedProduct.title}
                          className="w-9 h-9 rounded-xl object-cover border border-white/20 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-[11px] font-black text-white truncate">
                            {reel.taggedProduct.title}
                          </p>
                          <div className="flex items-center space-x-1.5 text-[10px]">
                            <span className="font-extrabold text-emerald-400">{formatINR(reel.taggedProduct.price)}</span>
                            <span className="text-slate-400 line-through text-[9px]">{formatINR(reel.taggedProduct.mrp)}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(e, reel.taggedProduct)}
                        title="Add to Cart"
                        className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shrink-0 shadow-md transition"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Video Reel Modal */}
      {activeReel !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center animate-fadeIn p-0 sm:p-4">
          {/* Close Button */}
          <button
            onClick={handleCloseReel}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev / Next Navigation Buttons (Desktop) */}
          <button
            onClick={handlePrevReel}
            className="hidden md:flex absolute left-8 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNextReel}
            className="hidden md:flex absolute right-8 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* 9:16 Video Player Container */}
          <div className="relative w-full sm:w-[380px] md:w-[400px] h-full sm:h-[88vh] max-h-[820px] rounded-none sm:rounded-3xl overflow-hidden bg-black border-0 sm:border border-purple-500/30 shadow-2xl flex flex-col justify-between">
            {/* Video Player */}
            <video
              ref={videoRef}
              src={activeReel.videoUrl}
              poster={activeReel.thumbnailUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              onClick={() => setIsPlaying(!isPlaying)}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90 pointer-events-none" />

            {/* Top Modal Controls */}
            <div className="relative z-20 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <img
                  src={activeReel.creatorAvatar}
                  alt={activeReel.creatorName}
                  className="w-9 h-9 rounded-full border border-white/60 object-cover"
                />
                <div>
                  <p className="text-xs font-black text-white flex items-center space-x-1.5">
                    <span>{activeReel.creatorName}</span>
                    {activeReel.isVerifiedWeaver && <CheckCircle className="w-3.5 h-3.5 text-blue-400" />}
                  </p>
                  <p className="text-[10px] text-slate-300">{activeReel.creatorHandle}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/80 transition"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Floating Action Column (Right Side) */}
            <div className="relative z-20 self-end mr-4 mb-28 flex flex-col items-center space-y-4">
              <button
                onClick={() => toggleLike(activeReel.id)}
                className="flex flex-col items-center space-y-1"
              >
                <div
                  className={`p-3 rounded-full backdrop-blur-md border ${
                    likedReels[activeReel.id]
                      ? "bg-rose-600 text-white border-rose-500"
                      : "bg-black/50 text-white border-white/20"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${likedReels[activeReel.id] ? "fill-white" : ""}`} />
                </div>
                <span className="text-[10px] font-bold text-white">
                  {likedReels[activeReel.id] ? activeReel.likeCount + 1 : activeReel.likeCount}
                </span>
              </button>

              <div className="flex flex-col items-center space-y-1">
                <div className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white">
                  <Eye className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-white">
                  {(activeReel.viewCount / 1000).toFixed(1)}k
                </span>
              </div>
            </div>

            {/* Bottom Overlay (Title & Instant Buy Drawer) */}
            <div className="relative z-20 p-4 space-y-3">
              <p className="text-xs font-bold text-white drop-shadow leading-relaxed">
                {activeReel.title}
              </p>

              {/* Tagged Product Box */}
              <div className="p-3 rounded-2xl bg-black/80 backdrop-blur-xl border border-purple-500/40 flex items-center justify-between gap-3 shadow-2xl">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <img
                    src={activeReel.taggedProduct.image}
                    alt={activeReel.taggedProduct.title}
                    className="w-11 h-11 rounded-xl object-cover border border-white/20 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate">
                      {activeReel.taggedProduct.title}
                    </p>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="font-black text-emerald-400">
                        {formatINR(activeReel.taggedProduct.price)}
                      </span>
                      <span className="text-slate-400 line-through text-[10px]">
                        {formatINR(activeReel.taggedProduct.mrp)}
                      </span>
                      <span className="text-[10px] font-bold text-amber-400">
                        {activeReel.taggedProduct.discountPercentage}% OFF
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  <button
                    onClick={(e) => handleAddToCart(e, activeReel.taggedProduct)}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-lg shadow-purple-500/30 transition flex items-center space-x-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Buy Now</span>
                  </button>
                  <Link
                    href={`/product/${activeReel.taggedProduct.slug}`}
                    onClick={handleCloseReel}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
                    title="View Product Details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ShoppableReelsWidget;
