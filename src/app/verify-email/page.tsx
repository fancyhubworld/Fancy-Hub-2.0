"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle2 } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export default function VerifyEmailPage() {
  const [resubmitted, setResubmitted] = useState(false);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-card text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950 text-fancy-blue flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">Verify Your Email Address</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          We&apos;ve sent a verification link to your email. Click the link inside to activate exclusive festive vouchers.
        </p>

        {resubmitted ? (
          <p className="text-xs font-bold text-green-600">Verification email resent!</p>
        ) : (
          <button
            onClick={() => setResubmitted(true)}
            className="text-xs font-bold text-fancy-blue hover:underline block mx-auto"
          >
            Resend Verification Email
          </button>
        )}

        <Link
          href={ROUTES.home}
          className="block w-full py-2.5 bg-fancy-blue text-white font-bold text-xs rounded-xl shadow"
        >
          Continue to Marketplace
        </Link>
      </div>
    </div>
  );
}
