"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Package, Truck, RotateCcw, ChevronRight, Store, X } from "lucide-react";
import { MOCK_USER_ORDERS } from "@/data/mock-catalog";
import { formatINR } from "@/lib/design-tokens";

export default function AccountOrdersPage() {
  const [returnModalOrder, setReturnModalOrder] = useState<any | null>(null);
  const [returnReason, setReturnReason] = useState("Wrong size delivered");
  const [returnSubmitted, setReturnSubmitted] = useState(false);

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReturnSubmitted(true);
    setTimeout(() => {
      setReturnSubmitted(false);
      setReturnModalOrder(null);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/account" className="hover:text-fancy-blue">My Account</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold">My Orders</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900">Your Orders & Fulfillment</h1>
          <p className="text-xs text-slate-500">Track shipments, download tax invoices, and manage return requests</p>
        </div>
      </div>

      <div className="space-y-6">
        {MOCK_USER_ORDERS.map((ord) => (
          <div key={ord.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-subtle">
            {/* Top Order Metadata Bar */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <span className="text-slate-500">Order ID:</span>
                  <p className="font-black text-slate-900">#{ord.orderNumber}</p>
                </div>
                <div>
                  <span className="text-slate-500">Order Placed:</span>
                  <p className="font-bold text-slate-800">{new Date(ord.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
                <div>
                  <span className="text-slate-500">Total Amount:</span>
                  <p className="font-black text-slate-900">{formatINR(ord.totalAmount)}</p>
                </div>
                <div>
                  <span className="text-slate-500">Payment:</span>
                  <p className="font-bold text-green-700">{ord.paymentMethod} ({ord.paymentStatus})</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Link
                  href={`/track-order?orderId=${ord.orderNumber}`}
                  className="bg-fancy-blue hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
                >
                  Track Order
                </Link>
                <button
                  onClick={() => setReturnModalOrder(ord)}
                  className="bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs transition"
                >
                  Return / Refund
                </button>
              </div>
            </div>

            {/* Split Sub-Orders */}
            <div className="p-6 space-y-4">
              {ord.vendorOrders.map((vo) => (
                <div key={vo.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/40 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <Store className="w-4 h-4 text-fancy-blue" />
                      <span className="font-black text-slate-900">Sold by {vo.vendorName}</span>
                      <span className="text-[10px] text-slate-500">({vo.subOrderNumber})</span>
                    </div>
                    <span className="bg-green-100 text-green-800 text-[10px] font-black px-2 py-0.5 rounded">
                      {vo.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {vo.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          {item.image && (
                            <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                          )}
                          <div>
                            <p className="font-bold text-slate-900">{item.title}</p>
                            {item.variantInfo && <p className="text-[11px] text-slate-500">{item.variantInfo}</p>}
                            <p className="text-[11px] text-slate-500">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-black text-slate-900">{formatINR(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Return Request Modal */}
      {returnModalOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setReturnModalOrder(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-fancy-orange flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Request 7-Day Return</h3>
                <p className="text-xs text-slate-500">Order #{returnModalOrder.orderNumber}</p>
              </div>
            </div>

            {returnSubmitted ? (
              <div className="p-4 bg-green-50 text-green-800 rounded-2xl text-xs text-center font-bold">
                Return request submitted! Our courier partner Delhivery will arrange doorstep pickup within 48 hours. Refund will credit to your Fancy Wallet.
              </div>
            ) : (
              <form onSubmit={handleReturnSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reason for Return *</label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-fancy-blue"
                  >
                    <option value="Wrong size delivered">Size issue / does not fit</option>
                    <option value="Damaged in transit">Product damaged or defective</option>
                    <option value="Not as pictured">Color/pattern not as shown on website</option>
                    <option value="Missing accessory">Missing item or accessory in box</option>
                    <option value="Other">Other quality reasons</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Additional Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the issue briefly for vendor quality audit..."
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-fancy-blue"
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-xl text-[11px] text-slate-600">
                  ⚡ Refund of <strong>{formatINR(returnModalOrder.totalAmount)}</strong> will be credited to your FancyHub Wallet instantly upon pickup verification.
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-fancy-orange hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  Submit Return Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
