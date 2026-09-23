export type PopupType =
  | "welcome"
  | "coupon"
  | "exit_intent"
  | "newsletter"
  | "festival_offer"
  | "login_offer"
  | "cart_abandonment";

export type PopupTrigger =
  | "on_load"
  | "exit_intent"
  | "scroll_depth"
  | "time_delay"
  | "inactivity";

export type PopupDevice = "all" | "desktop" | "mobile";
export type PopupFrequency = "once_per_session" | "once_per_day" | "always" | "once_per_user";
export type PopupUserType = "all" | "new_customer" | "returning_customer";
export type PopupLoggedStatus = "all" | "logged_in" | "guest";
export type PopupTargetPage = "all" | "home" | "product" | "category" | "cart" | "checkout";

export interface PopupConfig {
  id: string;
  name: string;
  type: PopupType;
  isActive: boolean;
  title: string;
  description: string;
  badgeText?: string;
  imageUrl?: string;
  buttonText: string;
  buttonLink: string;
  couponCode?: string;
  discountPercent?: number;

  // Controls
  trigger: PopupTrigger;
  delaySeconds: number;
  scrollPercent?: number;
  targetPage: PopupTargetPage;
  device: PopupDevice;
  frequency: PopupFrequency;
  userType: PopupUserType;
  loggedStatus: PopupLoggedStatus;

  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export const POPUP_PRESETS: Record<PopupType, Partial<PopupConfig>> = {
  welcome: {
    name: "Welcome to FancyHub",
    type: "welcome",
    title: "Welcome to India's Premier Handloom Hub!",
    description: "Sign up today and get ₹500 instant wallet cash + free express delivery on your first order.",
    badgeText: "NEW MEMBER OFFER",
    buttonText: "Claim ₹500 Gift",
    buttonLink: "/register",
    couponCode: "FANCY500",
    trigger: "time_delay",
    delaySeconds: 3,
    targetPage: "all",
    device: "all",
    frequency: "once_per_session",
    userType: "new_customer",
    loggedStatus: "guest",
  },
  coupon: {
    name: "Instant Discount Coupon",
    type: "coupon",
    title: "⚡ Flash Coupon: Extra 15% OFF",
    description: "Use code FESTIVE15 at checkout to unlock flat 15% discount on pure handloom weaves.",
    badgeText: "LIMITED COUPON",
    buttonText: "Copy Coupon & Shop",
    buttonLink: "/shop",
    couponCode: "FESTIVE15",
    discountPercent: 15,
    trigger: "on_load",
    delaySeconds: 1,
    targetPage: "all",
    device: "all",
    frequency: "once_per_day",
    userType: "all",
    loggedStatus: "all",
  },
  exit_intent: {
    name: "Don't Leave Yet!",
    type: "exit_intent",
    title: "Wait! Complete your order with 10% Extra OFF",
    description: "Items in your bag are selling out fast. Take an extra 10% off before you go.",
    badgeText: "SPECIAL EXIT OFFER",
    buttonText: "Stay & Apply 10% OFF",
    buttonLink: "/cart",
    couponCode: "STAY10",
    trigger: "exit_intent",
    delaySeconds: 0,
    targetPage: "all",
    device: "desktop",
    frequency: "once_per_session",
    userType: "all",
    loggedStatus: "all",
  },
  newsletter: {
    name: "Artisan Newsletter Club",
    type: "newsletter",
    title: "Join India's Weaving Guild Club",
    description: "Subscribe for exclusive artisan stories, early bird festive drops, and weekly promo codes.",
    badgeText: "NEWSLETTER",
    buttonText: "Subscribe Now",
    buttonLink: "/newsletter",
    trigger: "scroll_depth",
    scrollPercent: 50,
    delaySeconds: 5,
    targetPage: "all",
    device: "all",
    frequency: "once_per_user",
    userType: "all",
    loggedStatus: "all",
  },
  festival_offer: {
    name: "Diwali Festive Dhamaka",
    type: "festival_offer",
    title: "Diwali Special: Buy 1 Get 1 Handloom Dupatta",
    description: "Celebrate with authentic Banarasi and Kanjivaram silk. Direct weaver pricing guaranteed.",
    badgeText: "DIWALI SPECIAL",
    buttonText: "Explore Festive Collection",
    buttonLink: "/category/sarees",
    couponCode: "DIWALIBOGO",
    trigger: "time_delay",
    delaySeconds: 2,
    targetPage: "home",
    device: "all",
    frequency: "once_per_day",
    userType: "all",
    loggedStatus: "all",
  },
  login_offer: {
    name: "Exclusive VIP Login Rewards",
    type: "login_offer",
    title: "Sign In to Access VIP Wholesale Rates",
    description: "Unlock secret member-only pricing and earn 5% cashback coins on every purchase.",
    badgeText: "MEMBER EXCLUSIVE",
    buttonText: "Sign In Instantly",
    buttonLink: "/login",
    trigger: "time_delay",
    delaySeconds: 4,
    targetPage: "product",
    device: "all",
    frequency: "once_per_session",
    userType: "returning_customer",
    loggedStatus: "guest",
  },
  cart_abandonment: {
    name: "Recover Your Cart",
    type: "cart_abandonment",
    title: "Your Bag is Waiting with Free Express Shipping!",
    description: "Complete your checkout now to secure high-demand festive pieces before stock runs out.",
    badgeText: "EXPIRING SOON",
    buttonText: "Checkout Now",
    buttonLink: "/checkout",
    trigger: "inactivity",
    delaySeconds: 15,
    targetPage: "cart",
    device: "all",
    frequency: "once_per_session",
    userType: "all",
    loggedStatus: "all",
  },
};
