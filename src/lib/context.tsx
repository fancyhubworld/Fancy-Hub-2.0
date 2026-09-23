"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, UserSession, VendorCartGroup, ProductItem, ThemeMode, UserRole } from "@/lib/types";

interface MarketplaceContextType {
  user: UserSession | null;
  setUser: (user: UserSession | null) => void;
  loginWithGoogle: (role?: UserRole) => UserSession;
  logout: () => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  vendorCartGroups: VendorCartGroup[];
  cartSubtotal: number;
  cartTotalShipping: number;
  cartDiscount: number;
  cartTax: number;
  cartPlatformFee: number;
  cartGrandTotal: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  activePincode: string;
  setActivePincode: (pincode: string) => void;
  quickViewProduct: ProductItem | null;
  setQuickViewProduct: (product: ProductItem | null) => void;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string; discount: number };
  removeCoupon: () => void;
  notificationsCount: number;
  isMounted: boolean;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [theme, setThemeState] = useState<ThemeMode>("light");

  // Current user state (default demo customer)
  const [user, setUser] = useState<UserSession | null>({
    id: "usr-demo-1",
    name: "Rahul Sharma",
    email: "customer@fancyhub.in",
    phone: "+91 98300 12345",
    role: "CUSTOMER",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    themePreference: "light",
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(["p-1", "p-2"]);
  const [activePincode, setActivePincode] = useState<string>("700023");
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>("FANCYFIRST");
  const [notificationsCount, setNotificationsCount] = useState<number>(3);

  // Set and persist theme
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("fancyhub_theme", newTheme);
        const root = document.documentElement;
        root.classList.remove("light", "dark", "glassy");
        root.classList.add(newTheme);
      } catch (e) {}
    }
  };

  // Google OAuth Login
  const loginWithGoogle = (role: UserRole = "CUSTOMER"): UserSession => {
    const googleUser: UserSession = {
      id: `usr-google-${Date.now()}`,
      name: role === "VENDOR" ? "Rahul Sharma (Vendor)" : role === "ADMIN" ? "Platform Administrator" : "Rahul Sharma",
      email: role === "VENDOR" ? "seller@suratsilk.in" : role === "ADMIN" ? "admin@fancyhub.in" : "rahul.sharma@gmail.com",
      role,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
      vendorId: role === "VENDOR" ? "v-1" : undefined,
      storeName: role === "VENDOR" ? "Surat Silk Mills" : undefined,
      themePreference: theme,
    };
    setUser(googleUser);
    try {
      localStorage.setItem("fancyhub_user", JSON.stringify(googleUser));
    } catch (e) {}
    return googleUser;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("fancyhub_user");
    } catch (e) {}
  };

  // Hydration sync
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedTheme = (localStorage.getItem("fancyhub_theme") as ThemeMode) || "light";
      setThemeState(savedTheme);
      document.documentElement.classList.remove("light", "dark", "glassy");
      document.documentElement.classList.add(savedTheme);

      const savedUser = localStorage.getItem("fancyhub_user");
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedCart = localStorage.getItem("fancyhub_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        // Preload default demo item
        setCart([
          {
            id: "ci-1",
            productId: "p-1",
            variantId: "v-1-1",
            title: "FancyHub Pro Wireless ANC Earbuds with Spatial 3D Audio",
            slug: "fancyhub-pro-wireless-anc-earbuds",
            sku: "AUD-ANC-001-BLK",
            image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
            price: 1499,
            mrp: 3999,
            quantity: 1,
            selectedColor: "Matte Black",
            vendorId: "v-2",
            vendorName: "Mumbai Tech Lab",
            vendorSlug: "mumbai-tech-lab",
            maxStock: 50,
          },
          {
            id: "ci-2",
            productId: "p-2",
            variantId: "v-2-1",
            title: "Pure Banarasi Silk Embroidered Festive Saree",
            slug: "pure-banarasi-silk-festive-saree",
            sku: "ETH-SAR-002-RED",
            image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
            price: 1899,
            mrp: 5999,
            quantity: 1,
            selectedColor: "Royal Crimson Red",
            vendorId: "v-1",
            vendorName: "Surat Silk Mills",
            vendorSlug: "surat-silk-mills",
            maxStock: 25,
          },
        ]);
      }

      const savedWishlist = localStorage.getItem("fancyhub_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedPin = localStorage.getItem("fancyhub_pincode");
      if (savedPin) setActivePincode(savedPin);
    } catch (e) {
      console.warn("Could not load from localStorage", e);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem("fancyhub_cart", JSON.stringify(cart));
      localStorage.setItem("fancyhub_wishlist", JSON.stringify(wishlist));
      localStorage.setItem("fancyhub_pincode", activePincode);
    } catch (e) {}
  }, [cart, wishlist, activePincode, isMounted]);

  const addToCart = (item: Omit<CartItem, "id">) => {
    setCart((prev) => {
      const existing = prev.find(
        (ci) => ci.productId === item.productId && ci.variantId === item.variantId
      );
      if (existing) {
        return prev.map((ci) =>
          ci.id === existing.id
            ? { ...ci, quantity: Math.min(ci.quantity + item.quantity, ci.maxStock || 99) }
            : ci
        );
      }
      return [...prev, { ...item, id: `ci-${Date.now()}` }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Group cart items by Vendor
  const vendorCartGroups: VendorCartGroup[] = React.useMemo(() => {
    const groups: Record<string, VendorCartGroup> = {};
    for (const item of cart) {
      if (!groups[item.vendorId]) {
        groups[item.vendorId] = {
          vendorId: item.vendorId,
          vendorName: item.vendorName,
          vendorSlug: item.vendorSlug,
          items: [],
          subtotal: 0,
          shippingFee: 0,
        };
      }
      groups[item.vendorId].items.push(item);
      groups[item.vendorId].subtotal += item.price * item.quantity;
    }
    return Object.values(groups);
  }, [cart]);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartTotalShipping = cartSubtotal > 499 || cartSubtotal === 0 ? 0 : 49;
  const cartPlatformFee = cartSubtotal > 0 ? 20 : 0;
  
  let cartDiscount = 0;
  if (appliedCoupon === "FANCYFIRST" && cartSubtotal >= 599) {
    cartDiscount = 150;
  } else if (appliedCoupon === "MEGA70" && cartSubtotal >= 999) {
    cartDiscount = Math.min(Math.round(cartSubtotal * 0.15), 500);
  } else if (appliedCoupon === "FREESHIP") {
    cartDiscount = cartTotalShipping;
  }

  const cartTax = Math.round(cartSubtotal * 0.05);
  const cartGrandTotal = Math.max(0, cartSubtotal - cartDiscount + cartTotalShipping + cartPlatformFee);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "FANCYFIRST") {
      if (cartSubtotal < 599) return { success: false, message: "Minimum cart value ₹599 required for FANCYFIRST", discount: 0 };
      setAppliedCoupon("FANCYFIRST");
      return { success: true, message: "Coupon applied! Flat ₹150 saved.", discount: 150 };
    }
    if (clean === "MEGA70") {
      if (cartSubtotal < 999) return { success: false, message: "Minimum cart value ₹999 required for MEGA70", discount: 0 };
      setAppliedCoupon("MEGA70");
      return { success: true, message: "Coupon applied! 15% discount applied.", discount: Math.min(Math.round(cartSubtotal * 0.15), 500) };
    }
    if (clean === "FREESHIP") {
      setAppliedCoupon("FREESHIP");
      return { success: true, message: "Free Express Shipping applied!", discount: cartTotalShipping };
    }
    return { success: false, message: "Invalid coupon code. Try FANCYFIRST or MEGA70", discount: 0 };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  return (
    <MarketplaceContext.Provider
      value={{
        user,
        setUser,
        loginWithGoogle,
        logout,
        theme,
        setTheme,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        vendorCartGroups,
        cartSubtotal,
        cartTotalShipping,
        cartDiscount,
        cartTax,
        cartPlatformFee,
        cartGrandTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        activePincode,
        setActivePincode,
        quickViewProduct,
        setQuickViewProduct,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        notificationsCount,
        isMounted,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error("useMarketplace must be used within a MarketplaceProvider");
  }
  return context;
}
