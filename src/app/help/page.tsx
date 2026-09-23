"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HelpCircle, Phone, Mail, MessageSquare, ChevronRight, Search, CheckCircle2 } from "lucide-react";

export default function HelpCenterPage() {
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("Order & Delivery Tracking");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const faqs = [
    { q: "How long does delivery take?", a: "Standard delivery across major Indian cities takes 2–4 business days via our courier partners (Delhivery, Blue Dart). Remote zones take 4–5 days." },
    { q: "How does the 7-day return policy work?", a: "If you receive a defective, damaged, or incorrect size product, you can initiate a return from your Account > Orders page. Courier pickup is free and instant refund credits to your Fancy Wallet." },
    { q: "Is Cash on Delivery (COD) available?", a: "Yes! COD is supported across 98% of Indian pin codes. You can check availability by typing your PIN in the top delivery bar." },
    { q: "How do I become a vendor on FancyHub?", a: "Visit /vendor/register and complete our 8-step onboarding. You will need your GSTIN/PAN and business bank account details. We offer 0% commission for the first 30 days!" }
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setTicketSubject("");
      setTicketMessage("");
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-[#0B2A63] text-white rounded-3xl p-8 shadow-card text-center space-y-3">
        <h1 className="text-2xl md:text-3xl font-black">FancyHub Help & Support Center</h1>
        <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto">
          We&apos;re here to help you with order tracking, refunds, seller inquiries, and general support.
        </p>
        <div className="pt-2 flex justify-center gap-4 text-xs font-bold">
          <span className="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
            <Phone className="w-3.5 h-3.5 text-fancy-orange" />
            <span>1800-890-FANCY</span>
          </span>
          <span className="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
            <Mail className="w-3.5 h-3.5 text-fancy-orange" />
            <span>support@fancyhub.in</span>
          </span>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle space-y-4">
        <h2 className="font-black text-slate-900 text-base border-b border-slate-100 pb-3">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
              <h4 className="font-extrabold text-xs text-slate-900">{faq.q}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Support Ticket */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-subtle space-y-4">
        <h2 className="font-black text-slate-900 text-base border-b border-slate-100 pb-3">
          Submit a Customer Support Ticket
        </h2>

        {ticketSubmitted ? (
          <div className="p-5 bg-green-50 text-green-800 rounded-2xl text-xs text-center font-bold">
            Ticket #TCK-{Math.floor(1000 + Math.random() * 9000)} generated! Our Indian support desk will respond within 4 business hours.
          </div>
        ) : (
          <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Issue Category *</label>
              <select
                value={ticketCategory}
                onChange={(e) => setTicketCategory(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-fancy-blue"
              >
                <option value="Order & Delivery Tracking">Order & Delivery Tracking</option>
                <option value="Return & Refund Assistance">Return & Refund Assistance</option>
                <option value="Payment or Invoice Query">Payment or Invoice Query</option>
                <option value="Seller Grievance">Seller Grievance</option>
                <option value="Custom Print Order Inquiry">Custom Print Order Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject / Order ID *</label>
              <input
                type="text"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="e.g. Inquiring about delivery of Order #FH89201"
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-fancy-blue"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Detailed Description *</label>
              <textarea
                rows={4}
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Please describe your query in detail..."
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-fancy-blue"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-fancy-blue hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow transition"
            >
              Submit Support Ticket
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
