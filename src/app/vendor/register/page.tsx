"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Store,
  CheckCircle2,
  Building2,
  FileCheck,
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  BadgeCheck,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";

export default function VendorRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    ownerName: "Amit Agarwal",
    email: "seller@suratsilk.in",
    phone: "+91 98250 11223",
    storeName: "Surat Silk Mills",
    businessType: "Private Limited",
    panNumber: "AABCS1234F",
    gstin: "24AABCS1234F1Z8",
    city: "Surat",
    state: "Gujarat",
    pincode: "395003",
    address: "Ring Road Textile Market, Surat",
    bankName: "HDFC Bank",
    accountNumber: "50200012345678",
    ifscCode: "HDFC0001234",
    upiId: "suratsilk@hdfcbank",
    agreeTerms: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep((s) => s + 1);
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        router.push(ROUTES.vendorPortal.dashboard);
      }, 1500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0B2A63] to-blue-900 text-white rounded-3xl p-8 shadow-card text-center space-y-3">
        <div className="inline-flex items-center space-x-1.5 bg-fancy-orange text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>0% Commission for First 30 Days</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black">Sell on FancyHub.in — Reach Millions of Indian Shoppers</h1>
        <p className="text-xs md:text-sm text-blue-200 max-w-md mx-auto">
          Direct T+2 daily bank payouts, integrated Delhivery logistics, zero listing fees, and instant seller approval.
        </p>
      </div>

      {/* Progress Steps (4 Steps) */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-4 md:p-6 shadow-subtle">
        <div className="flex items-center justify-between text-xs font-bold">
          <div className={`flex items-center space-x-2 ${currentStep >= 1 ? "text-fancy-blue" : "text-slate-400"}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-blue-100 text-fancy-blue font-black" : "bg-slate-100 text-slate-400"}`}>1</span>
            <span className="hidden sm:inline">Store Profile</span>
          </div>
          <div className="h-0.5 w-8 bg-slate-200 dark:bg-slate-700" />
          <div className={`flex items-center space-x-2 ${currentStep >= 2 ? "text-fancy-blue" : "text-slate-400"}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-blue-100 text-fancy-blue font-black" : "bg-slate-100 text-slate-400"}`}>2</span>
            <span className="hidden sm:inline">KYC & Tax</span>
          </div>
          <div className="h-0.5 w-8 bg-slate-200 dark:bg-slate-700" />
          <div className={`flex items-center space-x-2 ${currentStep >= 3 ? "text-fancy-blue" : "text-slate-400"}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-blue-100 text-fancy-blue font-black" : "bg-slate-100 text-slate-400"}`}>3</span>
            <span className="hidden sm:inline">Bank & Settlement</span>
          </div>
          <div className="h-0.5 w-8 bg-slate-200 dark:bg-slate-700" />
          <div className={`flex items-center space-x-2 ${currentStep >= 4 ? "text-fancy-blue" : "text-slate-400"}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center ${currentStep >= 4 ? "bg-blue-100 text-fancy-blue font-black" : "bg-slate-100 text-slate-400"}`}>4</span>
            <span className="hidden sm:inline">Verification</span>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-subtle">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs font-sans">
          {/* Step 1: Store & Owner Identity */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="font-black text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-700 pb-2">
                Step 1: Store Branding & Owner Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Owner Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-semibold dark:text-white outline-none focus:border-fancy-blue"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Store / Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-semibold dark:text-white outline-none focus:border-fancy-blue"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Business Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-semibold dark:text-white outline-none focus:border-fancy-blue"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Phone (OTP Verification) *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-semibold dark:text-white outline-none focus:border-fancy-blue"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: KYC & Indian Tax Registration */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="font-black text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-700 pb-2">
                Step 2: Business KYC & GSTIN Compliance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Business Registration Type</label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-semibold dark:text-white outline-none focus:border-fancy-blue"
                  >
                    <option value="Private Limited" className="dark:bg-slate-800">Private Limited</option>
                    <option value="Proprietorship" className="dark:bg-slate-800">Proprietorship / Individual</option>
                    <option value="LLP / Partnership" className="dark:bg-slate-800">LLP / Partnership</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company PAN Number *</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={formData.panNumber}
                    onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-bold dark:text-white outline-none focus:border-fancy-blue font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">GSTIN Number *</label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-bold dark:text-white outline-none focus:border-fancy-blue font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Fulfillment Warehouse PIN *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-bold dark:text-white outline-none focus:border-fancy-blue font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Bank Account for Direct Settlements */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  Step 3: Bank Details for Automated T+2 Payouts
                </h3>
                <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                  <Lock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>256-Bit Encrypted Storage</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Beneficiary Bank Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-semibold dark:text-white outline-none focus:border-fancy-blue"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">IFSC Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    value={formData.ifscCode}
                    onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-bold dark:text-white outline-none focus:border-fancy-blue font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Bank Account Number *</label>
                  <input
                    type="password"
                    required
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-bold dark:text-white outline-none focus:border-fancy-blue font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Direct Settlement UPI ID (Optional)</label>
                  <input
                    type="text"
                    value={formData.upiId}
                    onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                    className="w-full border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl px-3 py-2 text-xs font-bold dark:text-white outline-none focus:border-fancy-blue"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Verification & Approval Summary */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="font-black text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-700 pb-2">
                Step 4: Final Verification & Store Approval
              </h3>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-750 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <p><strong>Store Name:</strong> {formData.storeName}</p>
                  <p><strong>Owner:</strong> {formData.ownerName}</p>
                  <p><strong>GSTIN:</strong> {formData.gstin}</p>
                  <p><strong>PAN:</strong> {formData.panNumber}</p>
                  <p><strong>Bank:</strong> {formData.bankName} (••••{formData.accountNumber.slice(-4)})</p>
                  <p><strong>Settlement Hub:</strong> {formData.city}, {formData.state} - {formData.pincode}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="rounded text-fancy-blue"
                />
                <label htmlFor="agreeTerms" className="text-slate-600 dark:text-slate-400">
                  I agree to the FancyHub Seller Code of Conduct, 7-Day Return Fulfillment SLA, and Indian GST Tax Compliance Rules.
                </label>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => s - 1)}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200"
              >
                ← Back
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto px-6 py-3 bg-fancy-orange hover:bg-orange-600 text-white font-black text-xs rounded-xl shadow transition flex items-center space-x-1.5"
            >
              <span>{currentStep < 4 ? "Save & Continue →" : isSubmitting ? "Approving Account..." : "Launch Vendor Dashboard"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
