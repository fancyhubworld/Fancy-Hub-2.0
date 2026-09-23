"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, CheckCircle2, Store, ShieldCheck } from "lucide-react";
import { VENDORS_DATA } from "@/data/mock-catalog";
import { ROUTES } from "@/lib/routes";
import { formatINR } from "@/lib/design-tokens";

export default function AdminVendorDetailPage() {
  const params = useParams();
  const vendorId = (params?.id as string) || "v-1";
  const vendor = VENDORS_DATA.find((v) => v.id === vendorId || v.slug === vendorId) || VENDORS_DATA[0];
  const [isVerified, setIsVerified] = useState(vendor.isVerified);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href={ROUTES.admin.vendors} className="text-slate-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white">{vendor.storeName} — KYC Audit</h1>
            <p className="text-xs text-slate-400">GSTIN: {vendor.gstin || "24AABCS1234F1Z8"} • PAN: {vendor.panNumber || "AABCS1234F"}</p>
          </div>
        </div>

        <button
          onClick={() => setIsVerified(!isVerified)}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition ${
            isVerified ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {isVerified ? "Approved & Verified" : "Action: Approve KYC"}
        </button>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-3xl space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-slate-400 block mb-1">Business Name</span>
            <span className="font-bold text-white text-sm">{vendor.businessName}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Registered Address</span>
            <span className="text-white">{vendor.address}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-700">
          <div>
            <span className="text-slate-400 block mb-1">Total Sales</span>
            <span className="font-black text-white">{formatINR(vendor.totalSales)}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Commission Rate</span>
            <span className="font-black text-amber-300">{vendor.commissionRate}%</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Wallet Cleared</span>
            <span className="font-black text-green-400">{formatINR(vendor.walletBalance)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
