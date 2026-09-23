import React from "react";
import { Truck, ShieldCheck, Users, RotateCcw } from "lucide-react";

export function TrustServiceStrip() {
  const items = [
    {
      icon: Truck,
      title: "Fast Delivery",
      subtitle: "2–5 Days Across India",
      color: "text-fancy-blue",
      bg: "bg-blue-50",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      subtitle: "100% Safe & Encrypted",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: Users,
      title: "Trusted Vendors",
      subtitle: "5,000+ Verified Sellers",
      color: "text-fancy-orange",
      bg: "bg-orange-50",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      subtitle: "7 Days Return Policy",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-subtle grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center space-x-3 p-1">
              <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs md:text-sm font-extrabold text-slate-800">{item.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium">{item.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
