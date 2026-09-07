"use client";

import React, { useState, useEffect } from "react";
import { ADMIN_GOOGLE_AUTH_SECRET, ADMIN_GOOGLE_AUTH_URI } from "@/lib/totp";
import { Copy, Check, QrCode, Smartphone, Key, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface GoogleAuthQrProps {
  forceShow?: boolean;
  defaultCollapsed?: boolean;
}

export function GoogleAuthQr({ forceShow = false, defaultCollapsed }: GoogleAuthQrProps) {
  const [copied, setCopied] = useState(false);
  const [isLinked, setIsLinked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const linked = localStorage.getItem("ilerti_google_auth_linked") === "true";
    setIsLinked(linked);
    if (forceShow) {
      setIsExpanded(true);
    } else if (defaultCollapsed !== undefined) {
      setIsExpanded(!defaultCollapsed);
    } else {
      // If already linked, collapse by default
      setIsExpanded(!linked);
    }
  }, [forceShow, defaultCollapsed]);

  const handleCopy = () => {
    navigator.clipboard.writeText(ADMIN_GOOGLE_AUTH_SECRET);
    setCopied(true);
    toast.success("Google Authenticator secret key copied!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleMarkAsLinked = () => {
    localStorage.setItem("ilerti_google_auth_linked", "true");
    setIsLinked(true);
    setIsExpanded(false);
    toast.success("Authenticator linked! QR code hidden.");
  };

  if (!mounted) {
    return null;
  }

  // Google Chart API / QR Server fallback image URL for standard TOTP QR code
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(ADMIN_GOOGLE_AUTH_URI)}&margin=1`;

  // If already linked and collapsed, show sleek toggle
  if (isLinked && !isExpanded && !forceShow) {
    return (
      <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-700/60 flex items-center justify-between text-left">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#4ADE80]/20 text-[#4ADE80] flex items-center justify-center text-xs">
            <Check className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-200">Google Authenticator Linked</p>
            <p className="text-[10px] text-slate-400">Open your app and enter the current 6-digit code</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="px-2.5 py-1.5 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1"
        >
          <QrCode className="w-3 h-3 text-[#4ADE80]" /> Re-scan QR
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80 text-left space-y-3 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-[#4ADE80]" /> Google Authenticator Setup
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-[#0D9488]/20 text-[#4ADE80] border border-[#0D9488]/40 px-2 py-0.5 rounded-full font-mono font-semibold">
            RFC 6238 TOTP
          </span>
          {!forceShow && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-slate-400 hover:text-white rounded transition-colors"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
        {/* QR Code Container */}
        <div className="bg-white p-2 rounded-xl shadow-md shrink-0 flex items-center justify-center">
          <img
            src={qrImageUrl}
            alt="Google Authenticator QR Code"
            width={120}
            height={120}
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

          <div className="flex items-center justify-between pt-1">
            <p className="text-[10px] text-slate-400">
              Account: <span className="text-slate-200">admin@ilertihealth.site</span>
            </p>
            {!forceShow && (
              <button
                type="button"
                onClick={handleMarkAsLinked}
                className="text-[10px] text-[#4ADE80] hover:text-[#86efac] font-medium underline underline-offset-2 transition-colors"
              >
                I have already linked this
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

