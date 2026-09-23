"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Store, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { VENDORS_DATA } from "@/data/mock-catalog";
import { formatINR } from "@/lib/design-tokens";

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState(VENDORS_DATA);

  const toggleVerify = (id: string) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isVerified: !v.isVerified } : v))
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/admin/dashboard" className="text-slate-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white">Vendor KYC & Merchant Approvals</h1>
            <p className="text-xs text-slate-400">Review GSTIN, PAN and commission rates per vendor</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 uppercase font-bold">
                <th className="py-3 px-3">Store Name</th>
                <th className="py-3 px-3">Business Type</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">GSTIN / PAN</th>
                <th className="py-3 px-3">Commission</th>
                <th className="py-3 px-3">Sales Volume</th>
                <th className="py-3 px-3 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {vendors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-750">
                  <td className="py-3 px-3 font-bold text-white flex items-center space-x-2">
                    <span>{v.storeName}</span>
                    {v.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-fancy-blue" />}
                  </td>
                  <td className="py-3 px-3 text-slate-400">{v.businessType}</td>
                  <td className="py-3 px-3">{v.city}, {v.state}</td>
                  <td className="py-3 px-3 font-mono font-bold text-[11px] text-amber-300">{v.gstin || "24AABCS1234F1Z8"}</td>
                  <td className="py-3 px-3 font-bold text-green-400">{v.commissionRate}%</td>
                  <td className="py-3 px-3 font-black text-white">{formatINR(v.totalSales)}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => toggleVerify(v.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                        v.isVerified ? "bg-green-900/60 text-green-300 border border-green-700" : "bg-red-900/60 text-red-300 border border-red-700"
                      }`}
                    >
                      {v.isVerified ? "Verified Active" : "Unverified"}
                    </button>
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
