"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  PackageCheck,
  Truck,
  FileText,
  ArrowRight,
  Store,
  Printer,
  Sparkles,
  MapPin,
} from "lucide-react";
import { formatINR } from "@/lib/design-tokens";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("orderId") || "FH89201";

  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("fancyhub_last_order");
      if (saved) {
        setOrder(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const effectiveOrder = order || {
    orderNumber: orderId,
    status: "CONFIRMED",
    paymentStatus: "SUCCESS",
    paymentMethod: "RAZORPAY",
    subtotal: 3398,
    discount: 150,
    shippingFee: 0,
    tax: 324,
    platformFee: 20,
    totalAmount: 3592,
    shippingAddress: {
      name: "Rahul Sharma",
      phone: "+91 98300 12345",
      house: "Flat 4B, Silver Oak Heights",
      street: "Hastings Road",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700023",
    },
    trackingNumber: "DEL98827110",
    vendorOrders: [
      {
        subOrderNumber: `${orderId}-V1`,
        vendorName: "Mumbai Tech Lab",
        status: "CONFIRMED",
        subtotal: 1499,
        trackingNumber: "DEL98827110",
        orderItems: [
          {
            title: "FancyHub Pro Wireless ANC Earbuds",
            price: 1499,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
          },
        ],
      },
      {
        subOrderNumber: `${orderId}-V2`,
        vendorName: "Surat Silk Mills",
        status: "CONFIRMED",
        subtotal: 1899,
        trackingNumber: "DEL98827111",
        orderItems: [
          {
            title: "Pure Banarasi Silk Embroidered Festive Saree",
            price: 1899,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800",
          },
        ],
      },
    ],
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Success Hero Card */}
      <div className="bg-gradient-to-r from-green-700 via-emerald-700 to-teal-800 text-white rounded-3xl p-8 shadow-elevated text-center space-y-3 no-print">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md text-white mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black">Thank You! Your Order Has Been Placed</h1>
        <p className="text-xs md:text-sm text-green-100 max-w-md mx-auto">
          We have sent confirmation SMS & email notifications. Marketplace sellers are preparing your items for express dispatch.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <span className="bg-white text-slate-900 font-extrabold text-xs px-4 py-2 rounded-xl">
            Parent Order #{effectiveOrder.orderNumber}
          </span>
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Header (Visible on print) */}
      <div className="hidden print-only text-slate-900 mb-6">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="text-2xl font-black text-[#1455D9]">FancyHub.in</h1>
            <p className="text-xs text-slate-500">Tax Invoice / GST Retail Receipt</p>
          </div>
          <div className="text-right text-xs">
            <p className="font-bold">Order #{effectiveOrder.orderNumber}</p>
            <p className="text-slate-500">Date: {new Date().toLocaleDateString("en-IN")}</p>
          </div>
        </div>
      </div>

      {/* Multi-Vendor Sub-Orders Breakdown */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-slate-900 text-base">Marketplace Fulfillment Breakdown</h3>
            <p className="text-xs text-slate-500">Individual sub-orders dispatched from respective verified seller hubs</p>
          </div>
          <span className="text-xs font-bold text-fancy-blue bg-blue-50 px-3 py-1 rounded-xl">
            {effectiveOrder.vendorOrders.length} Sub-Order(s)
          </span>
        </div>

        <div className="space-y-4">
          {effectiveOrder.vendorOrders.map((vo: any) => (
            <div key={vo.subOrderNumber} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                <div className="flex items-center space-x-2">
                  <Store className="w-4 h-4 text-fancy-blue" />
                  <span className="text-xs font-black text-slate-900">Seller: {vo.vendorName}</span>
                  <span className="text-[10px] text-slate-500">({vo.subOrderNumber})</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-500">Tracking:</span>
                  <span className="font-mono font-bold text-slate-800">{vo.trackingNumber}</span>
                  <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    Delhivery Express
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {vo.orderItems.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      {item.image && (
                        <img src={item.image} alt={item.title} className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                      )}
                      <div>
                        <p className="font-bold text-slate-900">{item.title}</p>
                        <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-black text-slate-900">{formatINR(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Shipping Address & Summary Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs">
          <div className="space-y-1">
            <h4 className="font-extrabold text-slate-900">Delivery Address:</h4>
            <p className="font-bold text-slate-800">{effectiveOrder.shippingAddress.name}</p>
            <p className="text-slate-600">{effectiveOrder.shippingAddress.house}, {effectiveOrder.shippingAddress.street}</p>
            <p className="text-slate-600">{effectiveOrder.shippingAddress.city}, {effectiveOrder.shippingAddress.state} - {effectiveOrder.shippingAddress.pincode}</p>
            <p className="text-slate-600">Phone: {effectiveOrder.shippingAddress.phone}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl space-y-1.5 border border-slate-200">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold text-slate-900">{formatINR(effectiveOrder.subtotal)}</span>
            </div>
            {effectiveOrder.discount > 0 && (
              <div className="flex justify-between text-green-700 font-bold">
                <span>Discount:</span>
                <span>- {formatINR(effectiveOrder.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span className="text-green-700 font-bold">FREE</span>
            </div>
            <div className="flex justify-between">
              <span>GST (Included):</span>
              <span>{formatINR(effectiveOrder.tax)}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-slate-900 text-sm">
              <span>Total Paid:</span>
              <span>{formatINR(effectiveOrder.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
          <Link
            href={`/track-order?orderId=${effectiveOrder.orderNumber}`}
            className="w-full sm:w-auto px-6 py-3 bg-fancy-blue hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow transition text-center"
          >
            Live Tracking Timeline →
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl transition text-center"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading order receipt...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
