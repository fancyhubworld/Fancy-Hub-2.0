"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, Sparkles, Gift, Check, ArrowRight } from "lucide-react";

interface PopupData {
  id: string;
  title: string;
  description: string;
  badgeText?: string;
  imageUrl?: string;
  buttonText: string;
  buttonLink: string;
  couponCode?: string;
  triggerType: string;
  delaySeconds: number;
  scrollPercent: number;
  isActive: boolean;
}

export function MarketingPopupModal() {
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem("fancyhub_popup_dismissed");
    if (dismissed) return;

    // Fetch active popups
    fetch("/api/admin/popups")
      .then((res) => res.json())
      .then((data) => {
        if (data.popups && data.popups.length > 0) {
          const active = data.popups.find((p: PopupData) => p.isActive);
          if (active) {
            setPopup(active);
            setupTrigger(active);
          }
        }
      })
      .catch(() => {});
  }, []);

  const setupTrigger = (p: PopupData) => {
    if (p.triggerType === "DELAY") {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, (p.delaySeconds || 4) * 1000);
      return () => clearTimeout(timer);
    } else if (p.triggerType === "SCROLL_DEPTH") {
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        if (scrollPercent >= (p.scrollPercent || 40)) {
          setIsOpen(true);
          window.removeEventListener("scroll", handleScroll);
        }
      };
      window.addEventListener("scroll", handleScroll);
    } else if (p.triggerType === "EXIT_INTENT") {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) {
          setIsOpen(true);
          document.removeEventListener("mouseleave", handleMouseLeave);
        }
      };
      document.addEventListener("mouseleave", handleMouseLeave);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem("fancyhub_popup_dismissed", "true");
    } catch (e) {}
  };

  const handleCopyCode = () => {
    if (popup?.couponCode) {
      navigator.clipboard.writeText(popup.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!isOpen || !popup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-up">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Optional Image Banner */}
        {popup.imageUrl && (
          <div className="relative h-44 w-full overflow-hidden bg-slate-900">
            <img
              src={popup.imageUrl}
              alt={popup.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            {popup.badgeText && (
              <div className="absolute bottom-3 left-4 bg-fancy-orange text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
                {popup.badgeText}
              </div>
            )}
          </div>
        )}

        <div className="p-6 space-y-4 text-center">
          {!popup.imageUrl && popup.badgeText && (
            <span className="inline-block bg-fancy-orange/20 text-fancy-orange border border-fancy-orange/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              {popup.badgeText}
            </span>
          )}

          <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight">
            {popup.title}
          </h3>

          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
            {popup.description}
          </p>

          {popup.couponCode && (
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between max-w-xs mx-auto">
              <div className="text-left pl-2">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Promo Code</span>
                <span className="font-mono font-black text-sm text-fancy-blue">{popup.couponCode}</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 bg-fancy-blue text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          )}

          <div className="pt-2">
            <Link
              href={popup.buttonLink || "/register"}
              onClick={handleClose}
              className="inline-flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-fancy-blue to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs md:text-sm py-3.5 px-6 rounded-2xl shadow-lg transition active:scale-95"
            >
              <span>{popup.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
