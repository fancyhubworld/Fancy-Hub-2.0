"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, Check } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export default function VerifyPhonePage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (val: string, index: number) => {
    if (/^[0-9]?$/.test(val)) {
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);
      if (val && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(ROUTES.account.dashboard);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-card text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-orange-50 dark:bg-orange-950 text-fancy-orange flex items-center justify-center mx-auto">
          <Smartphone className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Verify Phone Number</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the 6-digit OTP sent via SMS to <strong>+91 98300 12345</strong>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center space-x-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                className="w-11 h-12 text-center text-lg font-black border border-slate-300 dark:border-slate-600 bg-transparent rounded-xl outline-none focus:border-fancy-blue dark:text-white"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-fancy-blue hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition"
          >
            Verify & Continue to Account
          </button>
        </form>
      </div>
    </div>
  );
}
