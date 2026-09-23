"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Smartphone,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Linkedin,
} from "lucide-react";
import { BRAND } from "@/lib/design-tokens";
import { ROUTES } from "@/lib/routes";
import { DEFAULT_FOOTER_CONFIG, FooterBuilderConfig } from "@/lib/footer-builder-types";

export function Footer() {
  const [config, setConfig] = useState<FooterBuilderConfig>(DEFAULT_FOOTER_CONFIG);
  const [emailInput, setEmailInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    fetch("/api/public/footer")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.footer) {
          setConfig(data.footer);
        }
      })
      .catch((e) => console.error("Failed to load public footer", e));
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setIsSubscribed(true);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 md:pb-12 border-t border-slate-800 text-xs">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-5 md:px-6 lg:px-7 xl:px-8 space-y-10">
        {/* 1. Value Proposition Guarantees (Trust Badges) */}
        {config.showTrustBadges && config.trustBadges.some((t) => t.isActive) && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-slate-800">
            {config.trustBadges
              .filter((t) => t.isActive)
              .map((badge) => (
                <div key={badge.id} className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-900/50 text-fancy-blue flex items-center justify-center flex-shrink-0">
                    {badge.icon === "Truck" && <Truck className="w-5 h-5" />}
                    {badge.icon === "ShieldCheck" && <ShieldCheck className="w-5 h-5 text-fancy-orange" />}
                    {badge.icon === "RotateCcw" && <RotateCcw className="w-5 h-5 text-emerald-400" />}
                    {badge.icon === "Headphones" && <Headphones className="w-5 h-5 text-purple-400" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs md:text-sm">{badge.title}</h4>
                    <p className="text-[11px] text-slate-400">{badge.description}</p>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* 2. Newsletter & Instant Coupon */}
        {config.showNewsletter && (
          <div className="bg-gradient-to-r from-blue-950/60 to-slate-850 p-6 md:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-fancy-orange font-black text-[10px] uppercase tracking-wider">
                {config.newsletter.badge}
              </span>
              <h3 className="text-lg md:text-xl font-extrabold text-white">{config.newsletter.title}</h3>
              <p className="text-slate-400 text-xs max-w-xl">{config.newsletter.subtitle}</p>
            </div>

            {isSubscribed ? (
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-6 py-3 rounded-2xl font-bold text-xs">
                🎉 Welcome to the Club! Code <strong>FANCYFIRST</strong> applied to your account.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex w-full md:w-auto max-w-md gap-2">
                <input
                  type="text"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder={config.newsletter.placeholder}
                  className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-xs outline-none focus:border-fancy-blue"
                />
                <button
                  type="submit"
                  className="bg-fancy-blue hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold transition flex-shrink-0 shadow-md"
                >
                  {config.newsletter.buttonText}
                </button>
              </form>
            )}
          </div>
        )}

        {/* 3. Main Dynamic Footer Links (Columns) */}
        <div className={`grid gap-8 ${config.columns.length === 5 ? "grid-cols-2 md:grid-cols-5" : "grid-cols-2 md:grid-cols-4"}`}>
          {config.columns
            .filter((c) => c.isActive)
            .map((column) => (
              <div key={column.id} className="space-y-3">
                <h4 className="font-bold text-white tracking-wider uppercase text-xs">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.id}>
                      {link.isNewTab ? (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-white transition flex items-center space-x-1.5"
                        >
                          <span>{link.label}</span>
                          {link.badge && (
                            <span className="bg-fancy-orange/20 text-fancy-orange text-[9px] font-bold px-1.5 py-0.5 rounded">
                              {link.badge}
                            </span>
                          )}
                        </a>
                      ) : (
                        <Link
                          href={link.url}
                          className="hover:text-white transition flex items-center space-x-1.5"
                        >
                          <span>{link.label}</span>
                          {link.badge && (
                            <span className="bg-fancy-orange/20 text-fancy-orange text-[9px] font-bold px-1.5 py-0.5 rounded">
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>

        {/* 4. Contact & App Download Details */}
        {(config.showContactInfo || config.showAppDownload) && (
          <div className="pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
            {config.showContactInfo && (
              <div className="space-y-2">
                <span className="font-bold text-white text-xs block">FancyHub Support & Headquarters</span>
                <p className="text-slate-400 text-xs flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-fancy-blue flex-shrink-0" />
                  <span>{config.contactInfo.phone}</span>
                </p>
                <p className="text-slate-400 text-xs flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-fancy-orange flex-shrink-0" />
                  <span>{config.contactInfo.email}</span>
                </p>
                <p className="text-slate-400 text-xs flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{config.contactInfo.address}</span>
                </p>
              </div>
            )}

            {config.showAppDownload && (
              <div className="space-y-2">
                <span className="font-bold text-white text-xs block">{config.appDownload.title}</span>
                <p className="text-slate-400 text-xs">{config.appDownload.subtitle}</p>
                <div className="flex items-center space-x-3 pt-1">
                  <a
                    href={config.appDownload.playStoreUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-700 transition"
                  >
                    Google Play
                  </a>
                  <a
                    href={config.appDownload.appStoreUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-700 transition"
                  >
                    Apple App Store
                  </a>
                  <span className="text-[11px] text-amber-400 font-bold">{config.appDownload.ratingText}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. Bottom Strip: Social, Payment Badges & Legal Notice */}
        <div className="pt-6 border-t border-slate-800 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Social handles */}
            {config.showSocialIcons && (
              <div className="flex items-center space-x-3">
                <span className="text-xs text-slate-500 font-medium">Follow FancyHub:</span>
                {config.socialIcons
                  .filter((s) => s.isActive)
                  .map((soc) => (
                    <a
                      key={soc.id}
                      href={soc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
                      aria-label={soc.label}
                    >
                      {soc.platform === "instagram" && <Instagram className="w-3.5 h-3.5 text-pink-400" />}
                      {soc.platform === "facebook" && <Facebook className="w-3.5 h-3.5 text-blue-400" />}
                      {soc.platform === "youtube" && <Youtube className="w-3.5 h-3.5 text-red-500" />}
                      {soc.platform === "twitter" && <Twitter className="w-3.5 h-3.5 text-sky-400" />}
                      {soc.platform === "linkedin" && <Linkedin className="w-3.5 h-3.5 text-blue-500" />}
                      {soc.platform === "whatsapp" && <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />}
                    </a>
                  ))}
              </div>
            )}

            {/* Payment methods */}
            {config.showPaymentIcons && (
              <div className="flex items-center space-x-1.5 flex-wrap">
                {config.paymentIcons
                  .filter((p) => p.isActive)
                  .map((pay) => (
                    <span
                      key={pay.id}
                      className="bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-300 px-2 py-0.5 rounded"
                    >
                      {pay.name.split(" ")[0]}
                    </span>
                  ))}
              </div>
            )}
          </div>

          <div className="text-center space-y-1 pt-2">
            <p className="text-slate-500 text-xs">{config.copyrightText}</p>
            <p className="text-slate-600 text-[10px]">{config.legalNotice}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
