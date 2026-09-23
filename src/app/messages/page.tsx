"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Store, User } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/StateFeedback";

export default function MessagesPage() {
  const [messages, setMessages] = useState([
    { id: "m-1", sender: "Surat Silk Mills", text: "Hello! Your pure silk saree order has been packed with silk mark tag and will dispatch today.", time: "11:30 AM", isVendor: true },
    { id: "m-2", sender: "You", text: "Thank you! Can you confirm if the blouse piece is unstitched?", time: "11:35 AM", isVendor: false },
    { id: "m-3", sender: "Surat Silk Mills", text: "Yes, it is 0.8 meter matching brocade unstitched blouse piece inside the box.", time: "11:36 AM", isVendor: true },
  ]);
  const [newMsg, setNewMsg] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setMessages([...messages, { id: `m-${Date.now()}`, sender: "You", text: newMsg.trim(), time: "Just now", isVendor: false }]);
    setNewMsg("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs items={[{ label: "Messages & Support" }]} />

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-card overflow-hidden flex flex-col h-[520px]">
        {/* Chat Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-fancy-blue text-white flex items-center justify-center font-bold">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Surat Silk Mills (Verified Seller)</h3>
            <p className="text-[11px] text-green-600 font-bold">Online • Responds in under 15 mins</p>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.isVendor ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-xs md:max-w-md p-3.5 rounded-2xl ${
                m.isVendor
                  ? "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-tl-none"
                  : "bg-fancy-blue text-white rounded-tr-none shadow"
              }`}>
                <p>{m.text}</p>
                <span className={`text-[9px] mt-1 block ${m.isVendor ? "text-slate-400" : "text-blue-200"} text-right`}>
                  {m.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex items-center space-x-2">
          <input
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Type your message to the seller..."
            className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-fancy-blue"
          />
          <button
            type="submit"
            className="p-2.5 bg-fancy-blue hover:bg-blue-700 text-white rounded-xl shadow transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
