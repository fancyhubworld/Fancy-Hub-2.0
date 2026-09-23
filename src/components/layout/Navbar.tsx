"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  MapPin,
  ChevronDown,
  Menu,
  X,
  Mic,
  Camera,
  Truck,
  HelpCircle,
  Store,
  ArrowRight,
  Sparkles,
  Smartphone,
  Sun,
  Moon,
  Layers,
  LogOut,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { BRAND, formatINR } from "@/lib/design-tokens";
import { lookupPincode } from "@/lib/pincodes";
import { PRODUCTS_DATA } from "@/data/mock-catalog";
import { useMarketplace } from "@/lib/context";
import { useCategories } from "@/lib/use-categories";
import { ROUTES } from "@/lib/routes";
import { ThemeMode } from "@/lib/types";
import {
  DEFAULT_HEADER_ELEMENTS,
  HeaderElementConfig,
  HeaderBuilderConfig,
} from "@/lib/header-builder-types";

export function Navbar() {
  const router = useRouter();
  const {
    cart,
    wishlist,
    user,
    loginWithGoogle,
    logout,
    theme,
    setTheme,
    activePincode,
    setActivePincode,
    notificationsCount,
    isMounted,
  } = useMarketplace();

  const { headerCategories, categoryTree } = useCategories();

  // Dynamic Header Builder config loaded from DB
  const [headerConfig, setHeaderConfig] = useState<HeaderBuilderConfig>({
    id: "header-builder-config",
    isSticky: true,
    desktopLayoutType: "standard",
    mobileLayoutType: "standard",
    elements: DEFAULT_HEADER_ELEMENTS,
  });

  useEffect(() => {
    fetch("/api/public/header")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.header && Array.isArray(data.header.elements)) {
          setHeaderConfig(data.header);
        }
      })
      .catch((e) => console.error("Failed to load header config", e));
  }, []);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isListening, setIsListening] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [tempPincode, setTempPincode] = useState(activePincode);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const pincodeInfo = lookupPincode(activePincode);

  // Close search suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchSuggestions = searchQuery.trim()
    ? PRODUCTS_DATA.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
          p.brandName?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(ROUTES.search(searchQuery.trim(), selectedCategory));
    }
  };

  const handleVoiceSearch = () => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN";
      setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
        router.push(ROUTES.search(transcript));
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      setIsListening(true);
      setTimeout(() => {
        setSearchQuery("Wireless ANC Earbuds");
        setIsListening(false);
        router.push(ROUTES.search("Wireless ANC Earbuds"));
      }, 1200);
    }
  };

  const handlePincodeSave = (e: React.FormEvent) => {
    e.preventDefault();
    const info = lookupPincode(tempPincode);
    if (info.isServiceable) {
      setActivePincode(tempPincode);
      setShowLocationModal(false);
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Helper elements getter
  const getEl = (key: string) => headerConfig.elements.find((el) => el.key === key);
  const announcementEl = getEl("ANNOUNCEMENT_BAR");
  const navigationEl = getEl("NAVIGATION");
  const megaMenuEl = getEl("MEGA_MENU");

  // Sorted main row elements for Desktop
  const desktopMainRowKeys = [
    "LOGO",
    "LOCATION",
    "SEARCH",
    "ACCOUNT",
    "WISHLIST",
    "CART",
    "VENDOR_PORTAL",
    "ADMIN_ERP",
  ];

  const sortedDesktopElements = [...headerConfig.elements]
    .filter((el) => desktopMainRowKeys.includes(el.key))
    .filter((el) => el.desktopVisible)
    .sort((a, b) => a.desktopSortOrder - b.desktopSortOrder);

  // Sorted main row elements for Mobile (Independent responsive configuration)
  const mobileRowKeys = [
    "HAMBURGER_MENU",
    "LOGO",
    "WISHLIST",
    "CART",
    "ACCOUNT",
    "LOCATION",
  ];

  const sortedMobileElements = [...headerConfig.elements]
    .filter((el) => mobileRowKeys.includes(el.key))
    .filter((el) => el.mobileVisible)
    .sort((a, b) => a.mobileSortOrder - b.mobileSortOrder);

  // Modular Element Renderers
  const renderLogo = (el: HeaderElementConfig) => (
    <div className="flex items-center space-x-3 flex-shrink-0">
      <Link href={ROUTES.home} className="flex flex-col">
        <div className="flex items-center space-x-1">
          <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1455D9]">
            {el.settings?.text || "Fancy"}<span className="text-[#F7941D]">{el.settings?.subtext || "Hub.in"}</span>
          </span>
        </div>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider hidden sm:block">
          {el.settings?.tagline || BRAND.tagline}
        </span>
      </Link>
    </div>
  );

  const renderLocation = (el: HeaderElementConfig) => (
    <div
      onClick={() => setShowLocationModal(true)}
      className="hidden lg:flex items-center space-x-2.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50/60 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 cursor-pointer transition flex-shrink-0"
    >
      <div className="w-8 h-8 rounded-lg bg-blue-100/80 dark:bg-blue-900/40 flex items-center justify-center text-fancy-blue">
        <MapPin className="w-4 h-4" />
      </div>
      <div className="text-left leading-tight">
        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center space-x-1">
          <span>Delivering to</span>
          <span className="text-fancy-blue font-bold">{pincodeInfo.city} {pincodeInfo.pincode}</span>
        </div>
        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
          <span>Delivery in {pincodeInfo.deliveryDays}–{pincodeInfo.deliveryDays + 2} Days</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </div>
      </div>
    </div>
  );

  const renderSearch = (el: HeaderElementConfig) => (
    <div ref={searchRef} className="flex-1 min-w-[220px] max-w-2xl relative hidden md:block">
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center rounded-xl border-2 border-fancy-blue/40 focus-within:border-fancy-blue bg-white dark:bg-slate-800 overflow-hidden shadow-subtle"
      >
        {(el.settings?.showCategoryDropdown ?? true) && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 px-3 py-2.5 outline-none cursor-pointer hidden md:block max-w-[130px] truncate"
          >
            <option value="all">All Categories</option>
            {categoryTree.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        )}

        <div className="flex-1 flex items-center px-3">
          <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder={el.settings?.placeholder || "Search products, brands and Indian stores..."}
            className="w-full text-sm outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 bg-transparent py-2"
          />
        </div>

        <div className="flex items-center space-x-1 pr-2">
          <button
            type="button"
            onClick={handleVoiceSearch}
            title="Voice Search"
            className={`p-1.5 rounded-lg transition ${
              isListening ? "bg-red-100 text-red-600 animate-pulse" : "text-slate-400 hover:text-fancy-blue hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowCameraModal(true)}
            title="Visual Camera Search"
            className="p-1.5 text-slate-400 hover:text-fancy-blue hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <button
          type="submit"
          className="bg-fancy-blue hover:bg-blue-700 text-white px-5 py-2.5 font-semibold text-sm transition flex items-center space-x-1"
        >
          <span>Search</span>
        </button>
      </form>

      {/* Autocomplete Suggestions Dropdown */}
      {isSearchOpen && searchQuery.trim() && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-dropdown z-50 p-2 overflow-hidden">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
            Suggested Products & Brands
          </div>
          {searchSuggestions.length > 0 ? (
            searchSuggestions.map((item) => (
              <Link
                key={item.id}
                href={ROUTES.product(item.slug)}
                onClick={() => setIsSearchOpen(false)}
                className="flex items-center justify-between px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/60 rounded-lg transition"
              >
                <div className="flex items-center space-x-3">
                  <img src={item.images[0]?.url} alt={item.title} className="w-8 h-8 rounded object-cover border border-slate-200 dark:border-slate-700" />
                  <div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">{item.title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.categoryName} • by {item.vendorName}</div>
                  </div>
                </div>
                <div className="text-xs font-bold text-fancy-blue">{formatINR(item.price)}</div>
              </Link>
            ))
          ) : (
            <div className="px-3 py-3 text-xs text-slate-500 text-center">
              No exact matches found. Press Enter to search all catalog.
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderAccount = (el: HeaderElementConfig) => (
    <div className="relative flex-shrink-0">
      <button
        onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
        className="flex items-center space-x-2 text-slate-700 dark:text-slate-200 hover:text-fancy-blue transition py-1"
      >
        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
          <User className="w-5 h-5" />
        </div>
        <div className="hidden md:block text-left text-xs leading-tight">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {user?.name ? `Hello, ${user.name.split(" ")[0]}` : "Hello, Sign In"}
          </div>
          <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center">
            <span>Account & Lists</span>
            <ChevronDown className="w-3 h-3 ml-0.5 text-slate-400" />
          </div>
        </div>
      </button>

      {accountDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-dropdown z-50 p-2 space-y-1">
          {user ? (
            <>
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                <p className="text-xs font-bold text-slate-800 dark:text-white">{user.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{user.email}</p>
              </div>
              <div className="py-1 space-y-0.5">
                <Link
                  href={ROUTES.account.dashboard}
                  onClick={() => setAccountDropdownOpen(false)}
                  className="flex items-center px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-fancy-blue rounded-lg transition"
                >
                  Account Dashboard
                </Link>
                <Link
                  href={ROUTES.account.orders}
                  onClick={() => setAccountDropdownOpen(false)}
                  className="flex items-center px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-fancy-blue rounded-lg transition"
                >
                  My Orders & Invoices
                </Link>
                <Link
                  href={ROUTES.account.wallet}
                  onClick={() => setAccountDropdownOpen(false)}
                  className="flex items-center px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-fancy-blue rounded-lg transition"
                >
                  Fancy Wallet (₹750)
                </Link>
                <Link
                  href={ROUTES.account.wishlist}
                  onClick={() => setAccountDropdownOpen(false)}
                  className="flex items-center px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-fancy-blue rounded-lg transition"
                >
                  Wishlist ({wishlist.length})
                </Link>
                <Link
                  href={ROUTES.account.coupons}
                  onClick={() => setAccountDropdownOpen(false)}
                  className="flex items-center px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-fancy-blue rounded-lg transition"
                >
                  Saved Coupons
                </Link>
              </div>
              <div className="pt-1 border-t border-slate-100 dark:border-slate-700 space-y-1">
                <Link
                  href={ROUTES.vendorPortal.dashboard}
                  onClick={() => setAccountDropdownOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-fancy-blue bg-blue-50/70 dark:bg-blue-950/60 hover:bg-blue-100 rounded-lg transition"
                >
                  <span>Vendor Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setAccountDropdownOpen(false);
                  }}
                  className="w-full flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="p-3 space-y-2">
              <Link
                href={ROUTES.auth.login}
                onClick={() => setAccountDropdownOpen(false)}
                className="block w-full py-2 text-center bg-fancy-blue hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow"
              >
                Sign In / Register
              </Link>
              <button
                onClick={() => {
                  loginWithGoogle("CUSTOMER");
                  setAccountDropdownOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold rounded-xl transition"
              >
                <span>Continue with Google</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderWishlist = (el: HeaderElementConfig) => (
    <Link
      href={ROUTES.account.wishlist}
      className="relative p-2 text-slate-700 dark:text-slate-200 hover:text-fancy-blue transition flex-shrink-0"
      aria-label="View Saved Wishlist"
    >
      <Heart className="w-6 h-6" />
      {wishlist.length > 0 && (el.settings?.showBadgeCount ?? true) && (
        <span className="absolute -top-1 -right-1 bg-fancy-orange text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
          {wishlist.length}
        </span>
      )}
    </Link>
  );

  const renderCart = (el: HeaderElementConfig) => (
    <Link
      href={ROUTES.cart}
      className="flex items-center space-x-2 bg-fancy-blue hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl font-bold text-xs md:text-sm transition shadow-sm flex-shrink-0"
    >
      <div className="relative">
        <ShoppingCart className="w-5 h-5" />
        {totalCartCount > 0 && (el.settings?.showItemCount ?? true) && (
          <span className="absolute -top-2.5 -right-2.5 bg-fancy-orange text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
            {totalCartCount}
          </span>
        )}
      </div>
      <span className="hidden sm:inline">Cart</span>
    </Link>
  );

  const renderVendorPortal = (el: HeaderElementConfig) => (
    <Link
      href={el.settings?.link || ROUTES.vendorPortal.login}
      className="hidden md:flex items-center space-x-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex-shrink-0 px-2 py-1"
    >
      <Store className="w-4 h-4 text-emerald-500" />
      <span>{el.settings?.label || "Sell"}</span>
    </Link>
  );

  const renderAdminErp = (el: HeaderElementConfig) => (
    <Link
      href={el.settings?.link || ROUTES.admin.dashboard}
      className="hidden md:flex items-center space-x-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex-shrink-0 px-2 py-1"
    >
      <ShieldCheck className="w-4 h-4 text-purple-500" />
      <span>{el.settings?.label || "ERP"}</span>
    </Link>
  );

  return (
    <header className="w-full sticky top-0 z-50 transition-colors duration-200 glass-header border-b border-slate-200/80 dark:border-slate-800">
      {/* 1. TOP UTILITY / ANNOUNCEMENT BAR (Desktop) */}
      {announcementEl && announcementEl.desktopVisible ? (
        <div
          className="text-white text-xs py-1.5 px-4 hidden md:block transition"
          style={{
            backgroundColor: announcementEl.settings?.bgColor || "#0B2A63",
            color: announcementEl.settings?.textColor || "#FFFFFF",
          }}
        >
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-5 md:px-6 lg:px-7 xl:px-8 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href={ROUTES.help} className="flex items-center space-x-1 text-slate-200 hover:text-white transition">
                <Smartphone className="w-3.5 h-3.5 text-fancy-orange" />
                <span>Download App</span>
              </Link>
              <Link href={ROUTES.vendorPortal.register} className="flex items-center space-x-1 text-amber-300 font-medium hover:underline">
                <Store className="w-3.5 h-3.5" />
                <span>Sell on FancyHub (0% Commission for 30 Days)</span>
              </Link>
            </div>

            <div className="flex items-center space-x-2 text-fancy-amber font-medium animate-pulse">
              <span className="bg-fancy-orange text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                {announcementEl.settings?.badge || "FESTIVE"}
              </span>
              <span>{announcementEl.settings?.text || "Grand Festive Sale: Up to 70% Off"}</span>
            </div>

            <div className="flex items-center space-x-5 text-slate-200">
              <Link href={ROUTES.trackOrder} className="flex items-center space-x-1 hover:text-white transition">
                <Truck className="w-3.5 h-3.5" />
                <span>Track Order</span>
              </Link>
              <Link href={ROUTES.help} className="flex items-center space-x-1 hover:text-white transition">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Help Center</span>
              </Link>

              {/* Appearance Theme Selector */}
              <div className="relative">
                <button
                  onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                  className="flex items-center space-x-1 bg-blue-900/60 dark:bg-slate-800 px-2 py-0.5 rounded-md hover:text-white text-slate-200 transition"
                >
                  {theme === "light" && <Sun className="w-3 h-3 text-amber-400" />}
                  {theme === "dark" && <Moon className="w-3 h-3 text-blue-400" />}
                  {theme === "glassy" && <Layers className="w-3 h-3 text-fancy-orange" />}
                  <span className="capitalize text-[11px]">{theme} Mode</span>
                  <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
                </button>

                {themeDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl shadow-dropdown z-50 p-1 w-32 space-y-0.5 text-xs">
                    <button
                      onClick={() => {
                        setTheme("light");
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-left transition ${
                        theme === "light" ? "bg-blue-50 text-fancy-blue font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Light Mode</span>
                    </button>
                    <button
                      onClick={() => {
                        setTheme("dark");
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-left transition ${
                        theme === "dark" ? "bg-slate-700 text-white font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5 text-blue-400" />
                      <span>Dark Mode</span>
                    </button>
                    <button
                      onClick={() => {
                        setTheme("glassy");
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-left transition ${
                        theme === "glassy" ? "bg-orange-50 text-fancy-orange font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5 text-fancy-orange" />
                      <span>Glassy (iOS)</span>
                    </button>
                  </div>
                )}
              </div>

              <Link href={ROUTES.vendorPortal.dashboard} className="text-xs bg-fancy-blue/90 hover:bg-fancy-blue text-white px-2.5 py-0.5 rounded-full font-semibold transition">
                Vendor Portal
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {/* 2A. DESKTOP MAIN HEADER (hidden md:flex) — DYNAMICALLY RENDERED BY ADMIN DRAG & DROP ORDER */}
      <div className="hidden md:flex w-full max-w-[1440px] mx-auto px-4 sm:px-5 md:px-6 lg:px-7 xl:px-8 py-3 items-center justify-between gap-4 flex-wrap">
        {sortedDesktopElements.map((el) => {
          if (el.key === "LOGO") return <React.Fragment key="LOGO">{renderLogo(el)}</React.Fragment>;
          if (el.key === "LOCATION") return <React.Fragment key="LOCATION">{renderLocation(el)}</React.Fragment>;
          if (el.key === "SEARCH") return <React.Fragment key="SEARCH">{renderSearch(el)}</React.Fragment>;
          if (el.key === "ACCOUNT") return <React.Fragment key="ACCOUNT">{renderAccount(el)}</React.Fragment>;
          if (el.key === "WISHLIST") return <React.Fragment key="WISHLIST">{renderWishlist(el)}</React.Fragment>;
          if (el.key === "CART") return <React.Fragment key="CART">{renderCart(el)}</React.Fragment>;
          if (el.key === "VENDOR_PORTAL") return <React.Fragment key="VENDOR_PORTAL">{renderVendorPortal(el)}</React.Fragment>;
          if (el.key === "ADMIN_ERP") return <React.Fragment key="ADMIN_ERP">{renderAdminErp(el)}</React.Fragment>;
          return null;
        })}
      </div>

      {/* 2B. MOBILE MAIN HEADER (md:hidden) — INDEPENDENT RESPONSIVE CONFIGURATION */}
      <div className="md:hidden px-4 py-3 flex items-center justify-between gap-3">
        {sortedMobileElements.map((el) => {
          if (el.key === "HAMBURGER_MENU") {
            return (
              <button
                key="HAMBURGER_MENU"
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 text-slate-700 dark:text-slate-200 hover:text-fancy-blue"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            );
          }
          if (el.key === "LOGO") {
            return (
              <Link key="LOGO" href={ROUTES.home} className="flex items-center space-x-1 flex-1">
                <span className="text-xl font-extrabold tracking-tight text-[#1455D9]">
                  {el.settings?.text || "Fancy"}<span className="text-[#F7941D]">{el.settings?.subtext || "Hub.in"}</span>
                </span>
              </Link>
            );
          }
          if (el.key === "WISHLIST") {
            return (
              <Link
                key="WISHLIST"
                href={ROUTES.account.wishlist}
                className="relative p-1.5 text-slate-700 dark:text-slate-200 hover:text-fancy-blue transition"
                aria-label="View Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-fancy-orange text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            );
          }
          if (el.key === "CART") {
            return (
              <Link
                key="CART"
                href={ROUTES.cart}
                className="relative p-1.5 text-slate-700 dark:text-slate-200 hover:text-fancy-blue transition"
                aria-label="View Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-fancy-orange text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </Link>
            );
          }
          if (el.key === "ACCOUNT") {
            return (
              <Link
                key="ACCOUNT"
                href={user ? ROUTES.account.dashboard : ROUTES.auth.login}
                className="p-1.5 text-slate-700 dark:text-slate-200 hover:text-fancy-blue transition"
              >
                <User className="w-5 h-5" />
              </Link>
            );
          }
          if (el.key === "LOCATION") {
            return (
              <button
                key="LOCATION"
                onClick={() => setShowLocationModal(true)}
                className="p-1.5 text-slate-700 dark:text-slate-200 hover:text-fancy-blue"
              >
                <MapPin className="w-5 h-5" />
              </button>
            );
          }
          return null;
        })}
      </div>

      {/* 3. MOBILE SEARCH BAR (Configured for Mobile) */}
      {getEl("SEARCH")?.mobileVisible && (
        <div className="px-4 pb-2.5 md:hidden">
          <form onSubmit={handleSearchSubmit} className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 shadow-inner">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={getEl("SEARCH")?.settings?.placeholder || "Search for products, brands and more..."}
              className="w-full text-xs bg-transparent outline-none text-slate-800 dark:text-slate-100"
            />
            <button type="button" onClick={handleVoiceSearch} className="p-1 text-slate-400">
              <Mic className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* 4. CATEGORY NAVIGATION STRIP & MEGA MENU — 100% Database-Driven (Desktop) */}
      {navigationEl && navigationEl.desktopVisible ? (
        <nav className="border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 hidden md:block relative z-40">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-5 md:px-6 lg:px-7 xl:px-8 flex items-center overflow-x-auto no-scrollbar py-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            {megaMenuEl && megaMenuEl.desktopVisible ? (
              <>
                <Link
                  href={ROUTES.categories}
                  className="flex items-center space-x-1.5 text-fancy-blue hover:text-blue-700 font-bold px-2.5 py-1 flex-shrink-0"
                >
                  <Menu className="w-4 h-4" />
                  <span>All Categories</span>
                </Link>
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-2 flex-shrink-0" />
              </>
            ) : null}
            
            <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar flex-1">
              {headerCategories.map((cat) => {
                const hasChildren = cat.children && cat.children.length > 0;
                const isHovered = hoveredCategoryId === cat.id;

                return (
                  <div
                    key={cat.id}
                    className="relative flex-shrink-0"
                    onMouseEnter={() => setHoveredCategoryId(cat.id)}
                    onMouseLeave={() => setHoveredCategoryId(null)}
                  >
                    <Link
                      href={`/category/${cat.fullPath}`}
                      className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition whitespace-nowrap ${
                        isHovered
                          ? "text-fancy-blue bg-blue-50 dark:bg-slate-800 font-bold"
                          : "hover:text-fancy-blue hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span>{cat.name}</span>
                      {hasChildren && <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />}
                    </Link>

                    {/* Dynamic Mega Menu Dropdown */}
                    {hasChildren && isHovered && (
                      <div className="absolute left-0 top-full pt-1.5 w-[580px] z-50 animate-fadeIn">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-dropdown p-5 grid grid-cols-3 gap-4">
                          {cat.children.slice(0, 6).map((sub) => (
                            <div key={sub.id} className="space-y-1.5">
                              <Link
                                href={`/category/${sub.fullPath}`}
                                className="font-bold text-slate-900 dark:text-white hover:text-fancy-blue text-xs block pb-1 border-b border-slate-100 dark:border-slate-800"
                              >
                                {sub.name}
                              </Link>
                              {sub.children && sub.children.length > 0 && (
                                <div className="space-y-1 pt-0.5">
                                  {sub.children.slice(0, 4).map((child) => (
                                    <Link
                                      key={child.id}
                                      href={`/category/${child.fullPath}`}
                                      className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-fancy-blue block truncate transition"
                                    >
                                      {child.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}

                          <div className="col-span-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400">Verified Indian Manufacturers & Weavers</span>
                            <Link
                              href={`/category/${cat.fullPath}`}
                              className="text-xs font-bold text-fancy-blue hover:underline flex items-center space-x-1"
                            >
                              <span>Explore all {cat.name}</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-2 flex-shrink-0" />
            <Link
              href={ROUTES.deals}
              className="text-amber-600 dark:text-amber-400 font-bold hover:underline px-2.5 py-1 flex-shrink-0 whitespace-nowrap"
            >
              Festive Deals
            </Link>
            <Link
              href={ROUTES.customPrint}
              className="text-fancy-orange font-bold hover:underline px-2.5 py-1 flex-shrink-0 flex items-center space-x-1 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Custom Print Studio</span>
            </Link>
          </div>
        </nav>
      ) : null}

      {/* PINCODE CHANGE MODAL */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowLocationModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900 text-fancy-blue flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Select Delivery Location</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Enter your 6-digit Indian PIN code for live ETA & COD options</p>
              </div>
            </div>

            <form onSubmit={handlePincodeSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Enter Indian PIN Code</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={tempPincode}
                    onChange={(e) => setTempPincode(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 700023 or 110001"
                    className="flex-1 border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-sm font-bold text-slate-800 dark:text-white outline-none focus:border-fancy-blue"
                  />
                  <button
                    type="submit"
                    className="bg-fancy-blue hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase mb-2">Popular Serviceable Cities</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { city: "Kolkata", pin: "700023" },
                    { city: "New Delhi", pin: "110001" },
                    { city: "Mumbai", pin: "400050" },
                    { city: "Bengaluru", pin: "560001" },
                    { city: "Surat", pin: "395003" },
                    { city: "Jaipur", pin: "302001" },
                  ].map((item) => (
                    <button
                      key={item.pin}
                      type="button"
                      onClick={() => {
                        setActivePincode(item.pin);
                        setShowLocationModal(false);
                      }}
                      className={`text-left p-2 rounded-xl border text-xs transition ${
                        activePincode === item.pin
                          ? "border-fancy-blue bg-blue-50 dark:bg-blue-950 text-fancy-blue font-bold"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <div className="font-semibold">{item.city}</div>
                      <div className="text-[10px] text-slate-500">{item.pin}</div>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VISUAL CAMERA SEARCH MODAL */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative space-y-4">
            <button onClick={() => setShowCameraModal(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 dark:hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950 text-fancy-blue flex items-center justify-center">
              <Camera className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Visual Camera Search</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Snap a photo of any outfit, gadget or home decor to find matches on FancyHub.</p>
            <label className="block w-full py-2.5 px-4 bg-fancy-blue hover:bg-blue-700 text-white rounded-xl font-bold text-xs cursor-pointer transition">
              <span>Take Photo / Upload Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={() => {
                  setShowCameraModal(false);
                  router.push(ROUTES.search("ANC Wireless Earbuds"));
                }}
              />
            </label>
          </div>
        </div>
      )}

      {/* MOBILE HAMBURGER DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex">
          <div className="bg-white dark:bg-slate-900 w-4/5 max-w-xs h-full flex flex-col p-4 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xl font-extrabold text-[#1455D9]">
                Fancy<span className="text-[#F7941D]">Hub</span>.in
              </span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Theme switcher in mobile drawer */}
            <div className="py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Theme</span>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl space-x-1">
                {(["light", "dark", "glassy"] as ThemeMode[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-2 py-1 text-[11px] font-bold rounded-lg capitalize transition ${
                      theme === t ? "bg-white dark:bg-slate-700 text-fancy-blue shadow-sm" : "text-slate-500"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-3 border-b border-slate-100 dark:border-slate-800 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-fancy-blue flex items-center justify-center font-bold">
                {user?.name ? user.name.charAt(0) : "U"}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-white">{user?.name || "Guest Shopper"}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{user?.email || "Sign in for personalized discounts"}</p>
              </div>
            </div>

            <div className="py-2 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">Shop by Category</p>
              {categoryTree.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.fullPath}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-fancy-blue rounded-xl transition"
                >
                  <span>{cat.name}</span>
                  {cat.children && cat.children.length > 0 && (
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-500">
                      {cat.children.length}
                    </span>
                  )}
                </Link>
              ))}
              <Link
                href={ROUTES.customPrint}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 text-xs font-bold text-fancy-orange hover:bg-orange-50 rounded-xl transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Custom Print Studio</span>
              </Link>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <Link
                href={ROUTES.vendorPortal.register}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition"
              >
                Become a Vendor
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
