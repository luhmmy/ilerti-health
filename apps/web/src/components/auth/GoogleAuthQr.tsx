"use client";

import React, { useState } from "react";
import { ADMIN_GOOGLE_AUTH_SECRET, ADMIN_GOOGLE_AUTH_URI } from "@/lib/totp";
import { Copy, Check, QrCode, Smartphone, Key } from "lucide-react";
import { toast } from "sonner";

export function GoogleAuthQr() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ADMIN_GOOGLE_AUTH_SECRET);
    setCopied(true);
    toast.success("Google Authenticator secret key copied!");
    setTimeout(() => setCopied(false), 2500);
  };

  // Google Chart API / QR Server fallback image URL for standard TOTP QR code
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(ADMIN_GOOGLE_AUTH_URI)}&margin=1`;

  return (
    <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80 text-left space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-[#4ADE80]" /> Google Authenticator Setup
        </span>
        <span className="text-[10px] bg-[#0D9488]/20 text-[#4ADE80] border border-[#0D9488]/40 px-2 py-0.5 rounded-full font-mono font-semibold">
          RFC 6238 TOTP
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
        {/* QR Code Container */}
        <div className="bg-white p-2 rounded-xl shadow-md shrink-0 flex items-center justify-center">
          <img
            src={qrImageUrl}
            alt="Google Authenticator QR Code"
            width={130}
            height={130}
            className="rounded-lg"
          />
        </div>

        {/* Instructions & Secret Key */}
        <div className="flex-1 text-xs text-slate-300 space-y-2">
          <p className="text-[11px] leading-relaxed text-slate-300">
            Scan with <strong>Google Authenticator</strong> or enter the setup key manually:
          </p>

          <div className="bg-slate-900 p-2 rounded-lg border border-slate-700/80 flex items-center justify-between">
            <div className="font-mono text-xs font-bold text-[#4ADE80] tracking-wider truncate">
              {ADMIN_GOOGLE_AUTH_SECRET}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="ml-2 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded text-[10px] font-semibold flex items-center gap-1 transition-colors shrink-0"
            >
              {copied ? <Check className="w-3 h-3 text-[#4ADE80]" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <p className="text-[10px] text-slate-400">
            Account: <span className="text-slate-200">admin@ilertihealth.site</span>
          </p>
        </div>
      </div>
    </div>
  );
}
