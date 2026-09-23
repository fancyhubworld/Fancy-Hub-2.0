"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, MessageSquare, X, Send, Bot, Tag, MapPin, ArrowRight } from "lucide-react";
import { useMarketplace } from "@/lib/context";
import { formatINR } from "@/lib/design-tokens";

export function StorefrontAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { activePincode, cart } = useMarketplace();

  const [messages, setMessages] = useState<
    Array<{
      id: string;
      sender: "user" | "assistant";
      text: string;
      products?: Array<{ title: string; price: number; slug: string; badge?: string }>;
      coupon?: string;
    }>
  >([
    {
      id: "msg-welcome",
      sender: "assistant",
      text: "Namaste! 🙏 I'm your FancyHub AI Shopping Assistant. How can I help you discover handloom silks, verify pincode delivery, or find active discounts?",
    },
  ]);

  const quickPrompts = [
    "Recommend Banarasi Silks",
    "Check Delhivery for pincode 700023",
    "What is the best coupon code?",
    "Show ANC Wireless Earbuds",
  ];

  const handleSendMessage = async (msgText: string) => {
    const textToSend = msgText || inputMessage;
    if (!textToSend.trim()) return;

    const userMsgId = `user-${Date.now()}`;
    setMessages((prev) => [...prev, { id: userMsgId, sender: "user", text: textToSend }]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          activePincode,
          cartCount: cart.length,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: "assistant",
            text: data.reply,
            products: data.productRecommendations,
            coupon: data.suggestedCoupon,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "assistant",
          text: "I'm experiencing a brief network lag. Please try asking again!",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-20 md:bottom-8 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open AI Shopping Assistant"
          className="group relative flex items-center space-x-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-black text-xs shadow-2xl shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span className="hidden sm:inline">Ask FancyHub AI</span>
          <span className="inline-flex sm:hidden">AI</span>
        </button>
      </div>

      {/* Assistant Modal Window */}
      {isOpen && (
        <div className="fixed bottom-24 md:bottom-24 right-4 md:right-8 z-50 w-[92vw] sm:w-[380px] max-h-[520px] bg-slate-900/95 backdrop-blur-xl border border-purple-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 border-b border-purple-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white flex items-center space-x-1.5">
                  <span>FancyHub AI Concierge</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </h4>
                <p className="text-[10px] text-purple-300">Powered by Gemini AI • Live</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                    m.sender === "user"
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Coupon Pill */}
                  {m.coupon && (
                    <div className="mt-2.5 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                      <Tag className="w-3 h-3" />
                      <span>Code: {m.coupon}</span>
                    </div>
                  )}

                  {/* Product Cards */}
                  {m.products && m.products.length > 0 && (
                    <div className="mt-2.5 space-y-1.5">
                      {m.products.map((p) => (
                        <Link
                          key={p.slug}
                          href={`/product/${p.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-purple-500/20 hover:border-purple-500/60 transition group"
                        >
                          <div>
                            <p className="font-bold text-white text-[11px] group-hover:text-purple-300 transition line-clamp-1">
                              {p.title}
                            </p>
                            <p className="text-[10px] font-bold text-emerald-400">{formatINR(p.price)}</p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 transition" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-2xl px-3.5 py-2 text-slate-400 text-[11px] flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center space-x-1.5 overflow-x-auto pb-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-purple-900/40 text-slate-300 hover:text-purple-200 border border-slate-700/50 text-[10px] font-semibold whitespace-nowrap transition shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-950 border-t border-purple-500/20 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask anything about products, delivery, offers..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputMessage)}
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
            />
            <button
              onClick={() => handleSendMessage(inputMessage)}
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition shadow-md shadow-purple-500/20"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default StorefrontAiAssistant;
