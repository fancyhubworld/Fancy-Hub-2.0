"use client";

import React from "react";
import { Truck, IndianRupee, RotateCcw, ShieldCheck } from "lucide-react";

interface AssuranceItem {
  icon?: string;
  title: string;
  desc: string;
}

interface TrustAssuranceProps {
  content?: {
    items?: AssuranceItem[];
  };
}

export function TrustAssuranceWidget({ content }: TrustAssuranceProps) {
  const items = content?.items || [
    { icon: "Truck", title: "Free Express Shipping", desc: "On all orders above ₹999 across India" },
    { icon: "IndianRupee", title: "Cash on Delivery", desc: "Pay at your doorstep with QR / Cash" },
    { icon: "RotateCcw", title: "7-Day Easy Returns", desc: "Hassle-free doorstep pickup & instant refund" },
    { icon: "ShieldCheck", title: "100% Verified Sellers", desc: "Artisans & brands vetted with GST compliance" },
  ];

  const getIcon = (name?: string) => {
    switch (name) {
      case "Truck":
        return <Truck className="w-5 h-5 text-fancy-blue" />;
      case "IndianRupee":
        return <IndianRupee className="w-5 h-5 text-fancy-orange" />;
      case "RotateCcw":
        return <RotateCcw className="w-5 h-5 text-emerald-500" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-3">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-5 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
              {getIcon(item.icon)}
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                {item.title}
              </h3>
              <p className="text-[10px] md:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
