export interface WheelSlice {
  id: string;
  label: string;
  discountType: "FIXED" | "PERCENTAGE" | "FREE_SHIPPING" | "CASHBACK" | "NO_PRIZE";
  discountValue: number;
  couponCode: string;
  probabilityWeight: number; // e.g., 20 = 20%
  color: string;
  textColor: string;
}

export interface SpinResult {
  sliceIndex: number;
  winningSlice: WheelSlice;
  couponCode: string;
  discountText: string;
  spinAngle: number;
  expiresInMinutes: number;
}

export interface ScratchReward {
  id: string;
  title: string;
  discountText: string;
  couponCode: string;
  minimumOrderValue: number;
  validityHours: number;
}

export const DEFAULT_FESTIVE_SLICES: WheelSlice[] = [
  {
    id: "slice-diwali-500",
    label: "₹500 OFF",
    discountType: "FIXED",
    discountValue: 500,
    couponCode: "DIWALI500",
    probabilityWeight: 15,
    color: "#F59E0B", // Amber Gold
    textColor: "#000000",
  },
  {
    id: "slice-festive-15",
    label: "Flat 15% OFF",
    discountType: "PERCENTAGE",
    discountValue: 15,
    couponCode: "FESTIVE15",
    probabilityWeight: 25,
    color: "#8B5CF6", // Royal Purple
    textColor: "#FFFFFF",
  },
  {
    id: "slice-free-shipping",
    label: "Free Delivery",
    discountType: "FREE_SHIPPING",
    discountValue: 100,
    couponCode: "FREESHIP",
    probabilityWeight: 30,
    color: "#10B981", // Emerald
    textColor: "#FFFFFF",
  },
  {
    id: "slice-fancy-200",
    label: "₹200 OFF",
    discountType: "FIXED",
    discountValue: 200,
    couponCode: "FANCY200",
    probabilityWeight: 20,
    color: "#EC4899", // Festive Pink
    textColor: "#FFFFFF",
  },
  {
    id: "slice-cashback-10",
    label: "10% Cashback",
    discountType: "CASHBACK",
    discountValue: 10,
    couponCode: "CASHBACK10",
    probabilityWeight: 10,
    color: "#3B82F6", // Indian Blue
    textColor: "#FFFFFF",
  },
];

export function validateIndianPhoneNumber(phone: string): { isValid: boolean; sanitized: string; error?: string } {
  if (!phone) {
    return { isValid: false, sanitized: "", error: "Phone number is required" };
  }

  // Remove spaces, dashes, parentheses and +91 prefix
  let clean = phone.replace(/[\s\-\(\)]/g, "");
  if (clean.startsWith("+91")) clean = clean.slice(3);
  if (clean.startsWith("91") && clean.length === 12) clean = clean.slice(2);
  if (clean.startsWith("0") && clean.length === 11) clean = clean.slice(1);

  const indianPhoneRegex = /^[6-9]\d{9}$/;
  if (!indianPhoneRegex.test(clean)) {
    return {
      isValid: false,
      sanitized: clean,
      error: "Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9)",
    };
  }

  return { isValid: true, sanitized: clean };
}

export function calculateSpinResult(
  slices: WheelSlice[] = DEFAULT_FESTIVE_SLICES,
  phoneNumber?: string
): SpinResult {
  const totalWeight = slices.reduce((sum, s) => sum + s.probabilityWeight, 0);
  let randomVal = Math.random() * totalWeight;

  let winningIndex = 0;
  for (let i = 0; i < slices.length; i++) {
    if (randomVal < slices[i].probabilityWeight) {
      winningIndex = i;
      break;
    }
    randomVal -= slices[i].probabilityWeight;
  }

  const winningSlice = slices[winningIndex];
  const sliceCount = slices.length;
  const sliceAngle = 360 / sliceCount;
  
  // Calculate final angle to land on winning slice with multiple spins (5 full rotations = 1800 deg)
  const fullRotations = 5 * 360;
  // Offset to slice center
  const targetSliceAngle = (sliceCount - winningIndex - 0.5) * sliceAngle;
  const spinAngle = fullRotations + targetSliceAngle;

  let discountText = winningSlice.label;
  if (winningSlice.discountType === "FIXED") {
    discountText = `Flat ₹${winningSlice.discountValue} OFF on orders above ₹999`;
  } else if (winningSlice.discountType === "PERCENTAGE") {
    discountText = `Flat ${winningSlice.discountValue}% OFF on entire cart`;
  } else if (winningSlice.discountType === "FREE_SHIPPING") {
    discountText = "100% Free Express Delivery across India";
  }

  return {
    sliceIndex: winningIndex,
    winningSlice,
    couponCode: winningSlice.couponCode,
    discountText,
    spinAngle,
    expiresInMinutes: 30, // 30-minute urgency timer
  };
}

export function generateScratchCardReward(): ScratchReward {
  const rewards: ScratchReward[] = [
    {
      id: "scratch-festive-300",
      title: "Festive Grand Mystery Gift",
      discountText: "Flat ₹300 OFF on Banarasi & Handloom Silks",
      couponCode: "SILKMAGIC300",
      minimumOrderValue: 1499,
      validityHours: 24,
    },
    {
      id: "scratch-festive-vip",
      title: "Exclusive VIP Weaver Voucher",
      discountText: "Flat 20% OFF + Free Wooden Hanger Set",
      couponCode: "FANCYVIP20",
      minimumOrderValue: 1999,
      validityHours: 24,
    },
    {
      id: "scratch-audio-gadgets",
      title: "Tech Innovation Treat",
      discountText: "Extra ₹250 OFF on ANC Earbuds & Smartwatches",
      couponCode: "TECHMAGIC250",
      minimumOrderValue: 999,
      validityHours: 24,
    },
  ];

  const randomIndex = Math.floor(Math.random() * rewards.length);
  return rewards[randomIndex];
}
