"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/StateFeedback";
import { ROUTES } from "@/lib/routes";
import {
  Star,
  CheckCircle2,
  Plus,
  X,
  MessageSquare,
  ShieldCheck,
  Package,
} from "lucide-react";
import { PRODUCTS_DATA } from "@/data/mock-catalog";

interface ReviewItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  isVerified: boolean;
  status: "APPROVED" | "PENDING_MODERATION";
}

export default function AccountReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: "rev-1",
      productId: "prod-2",
      productName: "FancyHub Pro Wireless ANC Earbuds (Active Noise Cancellation)",
      productImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
      rating: 5,
      title: "Outstanding spatial audio & battery life!",
      comment: "The noise cancellation is on par with premium brands. Mic clarity during office calls in metro traffic was surprisingly good!",
      date: "12 Aug 2026",
      isVerified: true,
      status: "APPROVED",
    },
    {
      id: "rev-2",
      productId: "prod-1",
      productName: "Handcrafted Pure Banarasi Silk Zari Saree",
      productImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
      rating: 5,
      title: "100% Genuine Silk Mark certified weaver quality",
      comment: "Arrived in 48 hours to Kolkata. Rich zari border with flawless gold weave. Best festive purchase of the year!",
      date: "04 Sep 2026",
      isVerified: true,
      status: "APPROVED",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS_DATA[0].id);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [submittedToast, setSubmittedToast] = useState(false);

  const handleOpenModal = () => {
    setNewRating(5);
    setNewTitle("");
    setNewComment("");
    setShowModal(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const product = PRODUCTS_DATA.find((p) => p.id === selectedProductId) || PRODUCTS_DATA[0];

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      productName: product.title,
      productImage: (typeof product.images?.[0] === "string" ? product.images[0] : product.images?.[0]?.url) || (product as any).image || "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
      rating: newRating,
      title: newTitle || "Verified Customer Review",
      comment: newComment,
      date: "Just now",
      isVerified: true,
      status: "APPROVED",
    };

    setReviews((prev) => [newRev, ...prev]);
    setShowModal(false);
    setSubmittedToast(true);
    setTimeout(() => setSubmittedToast(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumbs items={[{ label: "Account", href: ROUTES.account.dashboard }, { label: "My Ratings & Reviews" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">Your Product Reviews & Ratings</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Share feedback on your delivered orders. Only verified purchasers can post public reviews.
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="px-4 py-2.5 rounded-xl bg-fancy-blue hover:bg-blue-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {submittedToast && (
        <div className="p-3 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Your review has been verified and published!</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle space-y-4">
        <div className="divide-y divide-slate-100 dark:divide-slate-700 text-xs">
          {reviews.map((rev) => (
            <div key={rev.id} className="py-4 space-y-2.5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={rev.productImage}
                    alt={rev.productName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs md:text-sm line-clamp-1">
                      {rev.productName}
                    </h3>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">{rev.title}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 whitespace-nowrap">{rev.date}</span>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-xs pl-15 leading-relaxed">
                {rev.comment}
              </p>

              <div className="flex items-center space-x-2 pt-1">
                {rev.isVerified && (
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center space-x-1 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>Verified Purchase</span>
                  </span>
                )}
                <span className="text-[10px] text-slate-400 font-medium">
                  Protected by Super Admin Anti-Tampering Shield
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white">Write a Verified Product Review</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Purchased Product *</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none"
                >
                  {PRODUCTS_DATA.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Overall Rating *</label>
                <div className="flex items-center space-x-1.5 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= newRating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"}`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-amber-500 ml-2">{newRating} Stars</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Headline / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Excellent weaver finish & express delivery"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Detailed Review Comment *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell other shoppers what you liked or disliked about this product..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl p-3 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-fancy-blue hover:bg-blue-600 text-white font-bold shadow"
                >
                  Submit Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
