"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Store, Truck, CheckCircle2, Printer } from "lucide-react";
import { formatINR } from "@/lib/design-tokens";

export default function VendorOrdersPage() {
  const [subOrders, setSubOrders] = useState([
    { id: "sub-1", subOrderNo: "FH89201-V1", customer: "Rahul Sharma", amount: 1499, item: "FancyHub Pro Wireless ANC Earbuds (Matte Black)", status: "Delivered", carrier: "Delhivery", awb: "DEL98827110" },
    { id: "sub-2", subOrderNo: "FH91844-V1", customer: "Priya Patel", amount: 1899, item: "Pure Banarasi Silk Embroidered Saree", status: "Processing", carrier: "Delhivery", awb: "DEL55912401" },
    { id: "sub-3", subOrderNo: "FH88102-V1", customer: "Vikram Das", amount: 399, item: "Custom Printed Cotton T-Shirt (M)", status: "Packed", carrier: "Blue Dart", awb: "BLU4419200" },
  ]);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setSubOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 space-y-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Link href="/vendor/dashboard" className="text-slate-400 hover:text-slate-800">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl md:text-2xl font-black text-slate-900">Seller Sub-Order Fulfillment</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">Pack shipments, update Delhivery AWB numbers and print packing slips</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700 border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                <th className="py-3 px-3">Sub-Order #</th>
                <th className="py-3 px-3">Product / Qty</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Earnings</th>
                <th className="py-3 px-3">Carrier / AWB</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subOrders.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-fancy-blue">{sub.subOrderNo}</td>
                  <td className="py-3 px-3 font-medium text-slate-900 max-w-[200px] truncate">{sub.item}</td>
                  <td className="py-3 px-3">{sub.customer}</td>
                  <td className="py-3 px-3 font-black text-slate-900">{formatINR(sub.amount * 0.9)}</td>
                  <td className="py-3 px-3 font-mono font-bold text-[11px] text-slate-600">
                    {sub.carrier} ({sub.awb})
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      sub.status === "Delivered" ? "bg-green-100 text-green-800" : "bg-blue-100 text-fancy-blue"
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {sub.status === "Processing" ? (
                      <button
                        onClick={() => handleUpdateStatus(sub.id, "Packed")}
                        className="bg-fancy-blue text-white px-3 py-1 rounded-lg font-bold text-[11px]"
                      >
                        Mark Packed
                      </button>
                    ) : sub.status === "Packed" ? (
                      <button
                        onClick={() => handleUpdateStatus(sub.id, "Shipped")}
                        className="bg-fancy-orange text-white px-3 py-1 rounded-lg font-bold text-[11px]"
                      >
                        Mark Shipped
                      </button>
                    ) : (
                      <span className="text-slate-400 font-medium">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
