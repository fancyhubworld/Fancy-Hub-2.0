"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Building,
  QrCode,
  Banknote,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react";
import { useMarketplace } from "@/lib/context";
import { formatINR } from "@/lib/design-tokens";
import { lookupPincode } from "@/lib/pincodes";
import { generateOrderNumber, generateTrackingNumber } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    vendorCartGroups,
    cartSubtotal,
    cartDiscount,
    cartTotalShipping,
    cartPlatformFee,
    cartTax,
    cartGrandTotal,
    clearCart,
    activePincode,
  } = useMarketplace();

  const [activeStep, setActiveStep] = useState<number>(2); // 1: Auth, 2: Address, 3: Delivery, 4: Payment
  const [selectedAddressId, setSelectedAddressId] = useState<string>("addr-1");
  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "PAYU" | "UPI" | "CARD" | "COD">("RAZORPAY");
  const [upiId, setUpiId] = useState("rahul@oksbi");
  const [isProcessing, setIsProcessing] = useState(false);

  // Address Form State
  const [addressForm, setAddressForm] = useState({
    name: "Rahul Sharma",
    phone: "+91 98300 12345",
    house: "Flat 4B, Silver Oak Heights",
    street: "Hastings Road",
    landmark: "Near Diamond Plaza",
    area: "Hastings",
    city: "Kolkata",
    state: "West Bengal",
    pincode: activePincode || "700023",
    type: "Home",
  });

  const handlePincodeChange = (pin: string) => {
    const clean = pin.replace(/\D/g, "");
    setAddressForm((prev) => ({ ...prev, pincode: clean }));
    if (clean.length === 6) {
      const info = lookupPincode(clean);
      if (info.isServiceable) {
        setAddressForm((prev) => ({
          ...prev,
          city: info.city,
          state: info.state,
          area: info.area,
        }));
      }
    }
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    const orderNumber = generateOrderNumber();
    const trackingNumber = generateTrackingNumber();

    // Construct multi-vendor sub-orders
    const vendorOrders = vendorCartGroups.map((vg, idx) => ({
      subOrderNumber: `${orderNumber}-V${idx + 1}`,
      vendorId: vg.vendorId,
      vendorName: vg.vendorName,
      status: "CONFIRMED",
      subtotal: vg.subtotal,
      shippingFee: 0,
      discount: Math.round(cartDiscount / vendorCartGroups.length),
      commissionRate: 10.0,
      commissionAmount: Math.round(vg.subtotal * 0.1),
      vendorEarnings: Math.round(vg.subtotal * 0.9),
      payoutStatus: "PENDING",
      trackingNumber: `DEL${Math.floor(10000000 + Math.random() * 90000000)}`,
      shippingCarrier: "Delhivery Express",
      createdAt: new Date().toISOString(),
      orderItems: vg.items.map((i) => ({
        id: `oi-${Date.now()}-${Math.random()}`,
        productId: i.productId,
        title: i.title,
        sku: i.sku,
        variantInfo: i.selectedColor || i.selectedSize ? `${i.selectedColor || ""} ${i.selectedSize || ""}`.trim() : undefined,
        price: i.price,
        mrp: i.mrp,
        quantity: i.quantity,
        total: i.price * i.quantity,
        image: i.image,
      })),
    }));

    const fullOrder = {
      orderNumber,
      status: "CONFIRMED",
      paymentStatus: paymentMethod === "COD" ? "PENDING" : "SUCCESS",
      paymentMethod,
      subtotal: cartSubtotal,
      discount: cartDiscount,
      shippingFee: cartTotalShipping,
      tax: cartTax,
      platformFee: cartPlatformFee,
      totalAmount: cartGrandTotal,
      shippingAddress: addressForm,
      trackingNumber,
      vendorOrders,
      createdAt: new Date().toISOString(),
    };

    // Save to local storage for the order-success and orders screen
    try {
      localStorage.setItem("fancyhub_last_order", JSON.stringify(fullOrder));
    } catch (e) {}

    setTimeout(() => {
      clearCart();
      setIsProcessing(false);
      router.push(`/order-success?orderId=${orderNumber}`);
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-xs text-slate-500 mb-3">Your cart is empty. Please add products before checking out.</p>
        <Link href="/shop" className="bg-fancy-blue text-white text-xs font-bold px-6 py-2.5 rounded-xl">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Checkout Progress Stepper */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 md:p-6 shadow-subtle">
        <div className="flex items-center justify-around max-w-3xl mx-auto text-xs font-bold">
          <div className="flex items-center space-x-2 text-green-700">
            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="hidden sm:inline">1. Account</span>
          </div>
          <div className="h-0.5 w-12 bg-green-500" />

          <div className={`flex items-center space-x-2 ${activeStep >= 2 ? "text-fancy-blue" : "text-slate-400"}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${activeStep >= 2 ? "bg-blue-100 text-fancy-blue" : "bg-slate-100"}`}>
              2
            </div>
            <span className="hidden sm:inline">2. Delivery Address</span>
          </div>
          <div className={`h-0.5 w-12 ${activeStep >= 3 ? "bg-fancy-blue" : "bg-slate-200"}`} />

          <div className={`flex items-center space-x-2 ${activeStep >= 4 ? "text-fancy-blue" : "text-slate-400"}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${activeStep >= 4 ? "bg-blue-100 text-fancy-blue" : "bg-slate-100"}`}>
              3
            </div>
            <span className="hidden sm:inline">3. Payment & Place Order</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Checkout Accordion Steps (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 2: Address */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-fancy-blue" />
                <h2 className="font-extrabold text-slate-900 text-sm md:text-base">
                  1. Indian Delivery Address
                </h2>
              </div>
              <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
                Serviceable PIN
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={addressForm.name}
                  onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-fancy-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">10-Digit Mobile Number *</label>
                <input
                  type="text"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-fancy-blue"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Flat / House No. / Building Name *</label>
                <input
                  type="text"
                  value={addressForm.house}
                  onChange={(e) => setAddressForm({ ...addressForm, house: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-fancy-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Street / Landmark *</label>
                <input
                  type="text"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-fancy-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">6-Digit Indian PIN Code *</label>
                <input
                  type="text"
                  maxLength={6}
                  value={addressForm.pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-fancy-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">City / District</label>
                <input
                  type="text"
                  readOnly
                  value={addressForm.city}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  readOnly
                  value={addressForm.state}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Payment Gateway Selector */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-fancy-blue" />
                <h2 className="font-extrabold text-slate-900 text-sm md:text-base">
                  2. Choose Payment Method
                </h2>
              </div>
              <div className="flex items-center space-x-1 text-xs text-slate-400">
                <Lock className="w-3.5 h-3.5" />
                <span>256-Bit SSL</span>
              </div>
            </div>

            <div className="space-y-3">
              {/* Razorpay Gateway */}
              <label
                className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentMethod === "RAZORPAY"
                    ? "border-fancy-blue bg-blue-50/50 shadow-sm"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "RAZORPAY"}
                    onChange={() => setPaymentMethod("RAZORPAY")}
                    className="mt-1 accent-fancy-blue"
                  />
                  <div>
                    <div className="text-xs font-extrabold text-slate-900 flex items-center space-x-2">
                      <span>Razorpay (Instant UPI, Cards & NetBanking)</span>
                      <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.2 rounded font-bold">Fastest</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pay via Google Pay, PhonePe, Paytm, RuPay Cards, or Top Indian Banks
                    </p>
                  </div>
                </div>
              </label>

              {/* Instant UPI QR */}
              <label
                className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentMethod === "UPI"
                    ? "border-fancy-blue bg-blue-50/50 shadow-sm"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "UPI"}
                    onChange={() => setPaymentMethod("UPI")}
                    className="mt-1 accent-fancy-blue"
                  />
                  <div>
                    <div className="text-xs font-extrabold text-slate-900 flex items-center space-x-2">
                      <span>Direct UPI Virtual ID</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Enter your UPI ID (e.g. mobile@upi) for instant request
                    </p>
                    {paymentMethod === "UPI" && (
                      <div className="mt-2 flex space-x-2">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@upi"
                          className="border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-fancy-blue"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </label>

              {/* PayU Gateway */}
              <label
                className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentMethod === "PAYU"
                    ? "border-fancy-blue bg-blue-50/50 shadow-sm"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "PAYU"}
                    onChange={() => setPaymentMethod("PAYU")}
                    className="mt-1 accent-fancy-blue"
                  />
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">PayU India Gateway</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Credit Cards, Debit Cards, NetBanking, and Wallets
                    </p>
                  </div>
                </div>
              </label>

              {/* Cash on Delivery */}
              <label
                className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentMethod === "COD"
                    ? "border-fancy-blue bg-blue-50/50 shadow-sm"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="mt-1 accent-fancy-blue"
                  />
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">Cash on Delivery (COD)</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pay cash to Delhivery agent upon delivery at your doorstep
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Placement (4 cols) */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-3">
              Order Confirmation
            </h3>

            {/* Split sub-orders breakdown */}
            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-700">Marketplace Sellers ({vendorCartGroups.length}):</p>
              {vendorCartGroups.map((vg) => (
                <div key={vg.vendorId} className="bg-slate-50 p-2.5 rounded-xl flex justify-between items-center text-[11px]">
                  <div>
                    <span className="font-bold text-slate-800">{vg.vendorName}</span>
                    <p className="text-slate-500">{vg.items.length} item(s)</p>
                  </div>
                  <span className="font-black text-slate-900">{formatINR(vg.subtotal)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-bold text-slate-900">{formatINR(cartSubtotal)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-green-700 font-bold">
                  <span>Voucher Discount:</span>
                  <span>- {formatINR(cartDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Shipping:</span>
                <span className="text-green-700 font-bold">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Facilitation:</span>
                <span>{formatINR(cartPlatformFee)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
                <span className="text-sm font-black text-slate-900">Total Payable:</span>
                <span className="text-2xl font-black text-slate-900">{formatINR(cartGrandTotal)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full py-4 bg-fancy-orange hover:bg-orange-600 text-white rounded-2xl font-black text-sm shadow-elevated transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Generating Order & Sub-Orders...</span>
              ) : (
                <>
                  <span>Place Order • {formatINR(cartGrandTotal)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-[10px] text-center text-slate-400 flex items-center justify-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
              <span>Includes 7 Days Easy Return & INR Buyer Protection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
