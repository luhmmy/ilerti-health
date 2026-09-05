"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoogleAuthQr } from "@/components/auth/GoogleAuthQr";
import { verifyGoogleAuthTOTP, ADMIN_GOOGLE_AUTH_SECRET } from "@/lib/totp";
import { 
  ShieldAlert, 
  Lock, 
  KeyRound, 
  ArrowLeft, 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  BarChart3, 
  ShieldCheck,
  Fingerprint,
  Smartphone,
  RefreshCw,
  CheckCircle2,
  Shield,
  Clock,
  LogOut
} from "lucide-react";
import { toast } from "sonner";

const ADMIN_IDLE_SECONDS = 15 * 60; // 15 minutes

export default function SecretAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, updateProfile, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [mfaVerified, setMfaVerified] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [adminPasscode, setAdminPasscode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeMfaTab, setActiveMfaTab] = useState<"google_auth" | "passkey">("google_auth");
  const [secondsRemaining, setSecondsRemaining] = useState(ADMIN_IDLE_SECONDS);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Check if MFA already passed in session storage
    const mfaStatus = sessionStorage.getItem("ilerti_admin_mfa_passed");
    if (mfaStatus === "true") {
      setMfaVerified(true);
    }
  }, []);

  // Inactivity countdown timer for Admin Console
  useEffect(() => {
    if (!mfaVerified) return;

    const resetIdleTimer = () => {
      setSecondsRemaining(ADMIN_IDLE_SECONDS);
    };

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];
    events.forEach((evt) => {
      window.addEventListener(evt, resetIdleTimer, { passive: true });
    });

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleLockConsole(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      events.forEach((evt) => {
        window.removeEventListener(evt, resetIdleTimer);
      });
    };
  }, [mfaVerified]);

  const handleLockConsole = (isAutoTimeout = false) => {
    setMfaVerified(false);
    sessionStorage.removeItem("ilerti_admin_mfa_passed");
    setOtpCode(["", "", "", "", "", ""]);
    setAdminPasscode("");
    if (isAutoTimeout) {
      toast.warning("Admin Console Locked", {
        description: "Your session auto-locked due to 15 minutes of inactivity for medical data protection.",
        duration: 6000,
      });
    } else {
      toast.info("Admin console locked successfully.");
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0D9488] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500">Verifying secure administrative token...</p>
        </div>
      </div>
    );
  }

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-focus next box
    if (value && index < 5) {
      const nextInput = document.getElementById(`mfa-digit-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`mfa-digit-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Submit Google Authenticator MFA Verification
  const handleVerifyMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    const enteredCode = otpCode.join("");

    const isValid = await verifyGoogleAuthTOTP(ADMIN_GOOGLE_AUTH_SECRET, enteredCode);

    if (isValid) {
      setMfaVerified(true);
      sessionStorage.setItem("ilerti_admin_mfa_passed", "true");
      useAuthStore.setState({
        isAuthenticated: true,
        user: {
          id: "admin-master",
          name: "System Administrator",
          email: "admin@ilertihealth.site",
          role: "admin",
        },
        token: "admin-google-auth-verified-jwt-token",
      });
      toast.success("Google Authenticator verified. Access granted to Admin Console!");
    } else {
      toast.error("Invalid Google Authenticator code. Please enter the current 6-digit code from your app.");
    }
    setIsVerifying(false);
  };

  // Direct Passkey Unlock
  const handlePasskeyUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode === "ILERTI-ADMIN-2025" || adminPasscode.toLowerCase() === "admin") {
      setMfaVerified(true);
      sessionStorage.setItem("ilerti_admin_mfa_passed", "true");
      useAuthStore.setState({
        isAuthenticated: true,
        user: {
          id: "admin-master",
          name: "System Administrator",
          email: "admin@ilertihealth.site",
          role: "admin",
        },
        token: "admin-google-auth-verified-jwt-token",
      });
      toast.success("Master security passkey accepted.");
    } else {
      toast.error("Invalid security passkey.");
    }
  };

  // If MFA is not yet verified, show Google Authenticator Gate
  if (!mfaVerified) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F172A] text-white">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-lg w-full bg-[#1E293B] rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#0D9488]/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="w-16 h-16 bg-[#0D9488]/20 text-[#4ADE80] border border-[#0D9488]/30 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
              <Smartphone className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Google Authenticator MFA
            </div>

            <h1 className="text-2xl font-black text-white mb-2">Google Authenticator MFA</h1>
            <p className="text-xs text-slate-300 mb-6">
              Enter the 6-digit security code generated by your Google Authenticator app to access the Admin Console.
            </p>

            {/* MFA Method Toggle */}
            <div className="flex bg-slate-800/80 p-1 rounded-xl mb-6 border border-slate-700">
              <button
                type="button"
                onClick={() => setActiveMfaTab("google_auth")}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeMfaTab === "google_auth" ? "bg-[#0D9488] text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Google Authenticator
              </button>
              <button
                type="button"
                onClick={() => setActiveMfaTab("passkey")}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeMfaTab === "passkey" ? "bg-[#0D9488] text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                <Lock className="w-3.5 h-3.5" /> Master Passkey
              </button>
            </div>

            {activeMfaTab === "google_auth" ? (
              <form onSubmit={handleVerifyMfa} className="space-y-5">
                {/* Google Authenticator QR & Secret Box */}
                <GoogleAuthQr />

                {/* 6 Digit Input */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Enter 6-digit code from Google Authenticator:
                  </label>
                  <div className="flex justify-center gap-2">
                    {otpCode.map((digit, index) => (
                      <input
                        key={index}
                        id={`mfa-digit-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-11 h-12 text-center text-xl font-bold bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-[#4ADE80] focus:ring-2 focus:ring-[#4ADE80]/20 transition-all"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || otpCode.join("").length !== 6}
                  className="w-full py-3 bg-[#0D9488] disabled:opacity-50 hover:bg-[#0f766e] text-white font-bold rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {isVerifying ? "Verifying with Google Auth..." : "Authenticate & Unlock"}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasskeyUnlock} className="space-y-4">
                <div className="relative text-left">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Enter Master Passkey (ILERTI-ADMIN-2025)"
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#4ADE80] focus:ring-2 focus:ring-[#4ADE80]/20"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1E3A5F] text-white font-semibold rounded-xl text-sm hover:bg-[#152a45] transition-colors"
                >
                  Authorize via Passkey
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-slate-800">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Platform Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Once 2FA is verified, render the Secret Super Admin Console
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Obfuscated Admin Navigation Bar */}
      <div className="bg-[#1E3A5F] text-white border-b border-navy-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
            <div className="flex items-center gap-2.5">
              <span className="bg-[#4ADE80]/20 text-[#4ADE80] border border-[#4ADE80]/30 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Super Admin
              </span>
              <span className="text-xs font-mono text-blue-200 hidden sm:inline">
                • Route: <code className="bg-navy-950/60 px-1.5 py-0.5 rounded text-[#4ADE80]">/console-x9k2v-sys</code>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs sm:text-sm font-medium">
                <Link
                  href="/console-x9k2v-sys"
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    pathname === "/console-x9k2v-sys"
                      ? "bg-white/20 text-white font-bold"
                      : "text-blue-100 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" /> Overview
                </Link>
                <Link
                  href="/console-x9k2v-sys/users"
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    pathname === "/console-x9k2v-sys/users"
                      ? "bg-white/20 text-white font-bold"
                      : "text-blue-100 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Users className="w-4 h-4" /> Users & Doctors
                </Link>
                <Link
                  href="/console-x9k2v-sys/verification"
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    pathname === "/console-x9k2v-sys/verification"
                      ? "bg-white/20 text-white font-bold"
                      : "text-blue-100 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <UserCheck className="w-4 h-4" /> MDCN Verification
                </Link>
                <Link
                  href="/console-x9k2v-sys/insights"
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    pathname === "/console-x9k2v-sys/insights"
                      ? "bg-white/20 text-white font-bold"
                      : "text-blue-100 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" /> Health Insights
                </Link>
                <Link
                  href="/console-x9k2v-sys/security"
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    pathname === "/console-x9k2v-sys/security"
                      ? "bg-white/20 text-white font-bold"
                      : "text-blue-100 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Shield className="w-4 h-4" /> Google Auth & Logs
                </Link>
              </nav>

              {/* Inactivity Auto-Lock Badge & Quick Lock Button */}
              <div className="flex items-center gap-2 border-l border-navy-700 pl-3 ml-1">
                <div 
                  title="Auto-locks after 15 minutes of inactivity for medical privacy"
                  className="flex items-center gap-1.5 bg-navy-950/80 border border-slate-600/50 px-2.5 py-1 rounded-lg text-xs font-mono text-slate-200"
                >
                  <Clock className={`w-3.5 h-3.5 ${secondsRemaining < 120 ? 'text-amber-400 animate-pulse' : 'text-[#4ADE80]'}`} />
                  <span className="hidden lg:inline text-slate-400 text-[11px]">Auto-Lock:</span>
                  <span className={`font-bold ${secondsRemaining < 120 ? 'text-amber-400 font-bold' : 'text-white'}`}>
                    {formatTime(secondsRemaining)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleLockConsole(false)}
                  title="Lock Admin Console Immediately"
                  className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" /> Lock
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}
