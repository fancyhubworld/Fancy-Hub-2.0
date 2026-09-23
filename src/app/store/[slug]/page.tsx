"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Store,
  CheckCircle2,
  Star,
  Users,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  ChevronRight,
  Heart,
  MessageSquare,
  Share2,
  Truck,
  RotateCcw,
  Sparkles,
  Search,
  Filter,
  BadgeCheck,
  Clock,
} from "lucide-react";
import { VENDORS_DATA, PRODUCTS_DATA } from "@/data/mock-catalog";
import { ProductCard } from "@/components/products/ProductCard";
import { formatINR } from "@/lib/design-tokens";

export default function VendorStorefrontPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const vendor = VENDORS_DATA.find((v) => v.slug === slug) || VENDORS_DATA[0];
  const allVendorProducts = PRODUCTS_DATA.filter((p) => p.vendorId === vendor.id);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(vendor.followerCount || 1420);
  const [activeTab, setActiveTab] = useState<"products" | "about" | "policies" | "reviews">("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [pincodeCheck, setPincodeCheck] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  // Extract unique categories for this vendor
  const categories = Array.from(
    new Set(allVendorProducts.map((p) => p.categoryName || "General"))
  );

  const handleFollowToggle = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowerCount((c) => c - 1);
    } else {
      setIsFollowing(true);
      setFollowerCount((c) => c + 1);
    }
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincodeCheck.length === 6) {
      setPincodeStatus(`Fast Delivery Available to ${pincodeCheck} (Within 2-3 Business Days via Express Partner)`);
    } else {
      setPincodeStatus("Please enter a valid 6-digit Indian PIN code.");
    }
  };

  const filteredProducts = allVendorProducts.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" || p.categoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const mockReviews = [
    { id: "rev-1", customer: "Ananya Desai", rating: 5, date: "2 days ago", comment: "Exceptional quality Banarasi silk! Fabric weight and zari finish are authentic. Fast Delhivery shipping." },
    { id: "rev-2", customer: "Rajesh Kulkarni", rating: 5, date: "1 week ago", comment: "Ordered 3 shirts. Stitching and fabric are superior compared to other marketplaces. Will buy again." },
    { id: "rev-3", customer: "Sneha Reddy", rating: 4, date: "2 weeks ago", comment: "Packaging was premium with a tamper-proof seal. Dispatch was immediate." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-fancy-blue">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-fancy-blue">Verified Sellers</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold dark:text-white">{vendor.storeName}</span>
      </div>

      {/* Store Header Banner */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-card">
        <div className="h-44 md:h-64 w-full bg-slate-900 relative">
          <img
            src={vendor.storeBanner || "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400"}
            alt={vendor.storeName}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
        </div>

        <div className="p-6 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-16 md:-mt-20">
            {/* Logo & Store Identity */}
            <div className="flex items-end space-x-4">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden flex-shrink-0">
                <img
                  src={vendor.storeLogo || "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=300"}
                  alt={vendor.storeName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1 pb-2">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <h1 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white">{vendor.storeName}</h1>
                  <span className="inline-flex items-center space-x-1 bg-blue-100 text-fancy-blue text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    <span>Verified Indian Seller</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{vendor.city || "Surat"}, {vendor.state || "Gujarat"}</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{vendor.businessType || "Manufacturer"}</span>
                  <span>•</span>
                  <span>GSTIN: <strong>{vendor.gstin || "24AABCS1234F1Z8"}</strong></span>
                </p>
              </div>
            </div>

            {/* Actions: Follow, Contact, Share */}
            <div className="flex items-center space-x-2 pb-2">
              <button
                onClick={handleFollowToggle}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  isFollowing
                    ? "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600"
                    : "bg-fancy-blue hover:bg-blue-700 text-white shadow-elevated"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFollowing ? "fill-current text-red-500" : ""}`} />
                <span>{isFollowing ? "Following" : "Follow Store"} ({followerCount})</span>
              </button>

              <Link
                href="/help"
                className="px-4 py-2.5 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-white text-xs font-bold rounded-2xl transition flex items-center space-x-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-fancy-blue" />
                <span>Contact Seller</span>
              </Link>
            </div>
          </div>

          {/* Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-750 rounded-2xl">
              <span className="text-slate-400 font-medium">Customer Rating</span>
              <div className="flex items-center space-x-1 font-black text-slate-900 dark:text-white text-sm mt-0.5">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span>{(vendor.rating || 4.9).toFixed(1)}</span>
                <span className="text-xs text-slate-400 font-normal">({vendor.reviewCount || 328})</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-750 rounded-2xl">
              <span className="text-slate-400 font-medium">Orders Fulfilled</span>
              <p className="font-black text-slate-900 dark:text-white text-sm mt-0.5">3,500+ Items</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-750 rounded-2xl">
              <span className="text-slate-400 font-medium">Dispatch SLA</span>
              <p className="font-black text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">Within 24 Hours</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-750 rounded-2xl">
              <span className="text-slate-400 font-medium">Return Policy</span>
              <p className="font-black text-slate-900 dark:text-white text-sm mt-0.5">7-Day Easy Returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Store Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 space-x-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-3 transition border-b-2 ${
            activeTab === "products"
              ? "border-fancy-blue text-fancy-blue"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          All Products ({allVendorProducts.length})
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`pb-3 transition border-b-2 ${
            activeTab === "about"
              ? "border-fancy-blue text-fancy-blue"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          About Store
        </button>
        <button
          onClick={() => setActiveTab("policies")}
          className={`pb-3 transition border-b-2 ${
            activeTab === "policies"
              ? "border-fancy-blue text-fancy-blue"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Shipping & Policies
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-3 transition border-b-2 ${
            activeTab === "reviews"
              ? "border-fancy-blue text-fancy-blue"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Customer Reviews (328)
        </button>
      </div>

      {/* Tab 1: Products */}
      {activeTab === "products" && (
        <div className="space-y-4">
          {/* Filter / Search Bar within Store */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedCategory("ALL")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === "ALL"
                    ? "bg-fancy-blue text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                All Items
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? "bg-fancy-blue text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-xs w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search this store..."
                className="w-full outline-none bg-transparent dark:text-white"
              />
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-12 text-center space-y-2">
              <p className="font-black text-slate-800 dark:text-white">No products found matching your filters</p>
              <p className="text-xs text-slate-400">Try resetting your search query or selecting &quot;All Items&quot;</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: About Store */}
      {activeTab === "about" && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <h3 className="font-black text-slate-900 dark:text-white text-base">About {vendor.storeName}</h3>
          <p>{vendor.storeDescription || "Surat Silk Mills is a premier textile and ethnic wear manufacturer specializing in authentic Banarasi, Kanchipuram, and modern georgette festive attire. Operating directly from our registered Surat weaving units, we deliver 100% genuine craftsmanship directly to your doorstep."}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="space-y-1">
              <p><strong>Registered Entity:</strong> {vendor.businessName || "Surat Silk Mills Pvt Ltd"}</p>
              <p><strong>Operating Category:</strong> {vendor.businessType || "Manufacturer / Direct Brand"}</p>
              <p><strong>Primary Fulfillment Hub:</strong> {vendor.address || "Ring Road Textile Market, Surat, Gujarat - 395002"}</p>
            </div>
            <div className="space-y-1">
              <p><strong>GSTIN Compliance:</strong> {vendor.gstin || "24AABCS1234F1Z8"}</p>
              <p><strong>Seller Verification Status:</strong> 100% KYC Verified with Government Registry</p>
              <p><strong>Customer Support SLA:</strong> Inquiries answered within 2 hours</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Policies & Shipping */}
      {activeTab === "policies" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center space-x-2">
              <Truck className="w-5 h-5 text-fancy-blue" />
              <span>Pincode Delivery Check</span>
            </h3>
            <form onSubmit={handlePincodeCheck} className="flex items-center max-w-md space-x-2 text-xs">
              <input
                type="text"
                maxLength={6}
                value={pincodeCheck}
                onChange={(e) => setPincodeCheck(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit Indian PIN (e.g. 110001)"
                className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 font-bold dark:text-white outline-none focus:border-fancy-blue"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-fancy-blue hover:bg-blue-700 text-white font-bold rounded-xl whitespace-nowrap"
              >
                Check SLA
              </button>
            </form>
            {pincodeStatus && (
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{pincodeStatus}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-2">
              <div className="flex items-center space-x-2 text-fancy-blue font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Authenticity Guarantee</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                All products dispatched by this store are guaranteed 100% genuine and sourced directly from certified manufacturing facilities.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-600 font-bold">
                <RotateCcw className="w-4 h-4" />
                <span>7-Day Return Policy</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Hassle-free 7-day doorstep return pickup and instant refund via FancyHub Wallet or original payment method.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-2">
              <div className="flex items-center space-x-2 text-amber-500 font-bold">
                <Clock className="w-4 h-4" />
                <span>Same-Day Dispatch</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Orders placed before 2:00 PM IST are processed and handed over to Delhivery / Blue Dart courier on the same business day.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Customer Reviews */}
      {activeTab === "reviews" && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-subtle space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base">Store Reviews & Verified Ratings</h3>
              <p className="text-xs text-slate-500">Based on 328 verified buyer reviews across India</p>
            </div>
            <div className="flex items-center space-x-2 bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800">
              <Star className="w-5 h-5 text-amber-500 fill-current" />
              <span className="font-black text-base text-slate-900 dark:text-white">4.9 / 5.0</span>
            </div>
          </div>

          <div className="space-y-4">
            {mockReviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-750 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-slate-900 dark:text-white">{rev.customer}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 rounded-full">
                      Verified Purchase
                    </span>
                  </div>
                  <span className="text-slate-400">{rev.date}</span>
                </div>
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
