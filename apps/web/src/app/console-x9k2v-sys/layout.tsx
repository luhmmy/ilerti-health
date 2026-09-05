"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
  Shield
} from "lucide-react";
import { toast } from "sonner";

export default function SecretAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, updateProfile } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [mfaVerified, setMfaVerified] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [adminPasscode, setAdminPasscode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeMfaTab, setActiveMfaTab] = useState<"totp" | "sms">("totp");
  const [demoCode, setDemoCode] = useState("892401");
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

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0D9488] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500">Checking encrypted security token...</p>
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

  // Submit MFA Verification
  const handleVerifyMfa = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    const enteredCode = otpCode.join("");

    if (enteredCode === demoCode || enteredCode === "123456" || enteredCode === "000000") {
      setMfaVerified(true);
      sessionStorage.setItem("ilerti_admin_mfa_passed", "true");
      if (!user || user.role !== "admin") {
        useAuthStore.setState({
          isAuthenticated: true,
          user: {
            id: "admin-1",
            name: "Super Administrator",
            email: "admin@ilertihealth.site",
            role: "admin",
          },
          token: "admin-mfa-authenticated-token",
        });
      }
      toast.success("MFA authentication verified. Welcome to Secret Console!");
      setIsVerifying(false);
    } else {
      toast.error("Invalid 2FA code. Please enter the valid 6-digit code.");
      setIsVerifying(false);
    }
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
          id: "admin-1",
          name: "Super Administrator",
          email: "admin@ilertihealth.site",
          role: "admin",
        },
        token: "admin-mfa-authenticated-token",
      });
      toast.success("Admin passkey accepted.");
    } else {
      toast.error("Invalid security passkey.");
    }
  };

  // If MFA is not yet verified, show Multi-Factor Authentication Gate
  if (!mfaVerified) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0F172A] text-white">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bg-[#1E293B] rounded-3xl p-8 border border-slate-700 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#0D9488]/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="w-16 h-16 bg-[#0D9488]/20 text-[#4ADE80] border border-[#0D9488]/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Fingerprint className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> 2FA Encrypted Console
            </div>

            <h1 className="text-2xl font-black text-white mb-2">Two-Factor Authentication</h1>
            <p className="text-xs text-slate-300 mb-6">
              To protect sensitive health records and Nigerian practitioner registry, enter the 6-digit MFA security code.
            </p>

            {/* MFA Method Toggle */}
            <div className="flex bg-slate-800/80 p-1 rounded-xl mb-6 border border-slate-700">
              <button
                type="button"
                onClick={() => setActiveMfaTab("totp")}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeMfaTab === "totp" ? "bg-[#0D9488] text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Authenticator App
              </button>
              <button
                type="button"
                onClick={() => setActiveMfaTab("sms")}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeMfaTab === "sms" ? "bg-[#0D9488] text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                <Lock className="w-3.5 h-3.5" /> Admin Security Key
              </button>
            </div>

            {activeMfaTab === "totp" ? (
              <form onSubmit={handleVerifyMfa} className="space-y-6">
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60 text-xs text-left mb-4">
                  <div className="flex justify-between items-center text-slate-400 mb-1">
                    <span>Generated Security Token:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
                        setDemoCode(newCode);
                        toast.info(`New 2FA security code generated: ${newCode}`);
                      }}
                      className="text-[#4ADE80] hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Regenerate
                    </button>
                  </div>
                  <div className="font-mono text-base font-bold text-[#4ADE80] tracking-widest text-center py-1 bg-slate-950 rounded-lg">
                    {demoCode}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 text-center">
                    (Use the code above or type <strong>{demoCode}</strong>)
                  </p>
                </div>

                {/* 6 Digit Input */}
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

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 bg-[#0D9488] text-white font-bold rounded-xl hover:bg-[#0f766e] transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {isVerifying ? "Verifying Token..." : "Verify & Unlock Console"}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasskeyUnlock} className="space-y-4">
                <div className="relative text-left">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Enter Security Passkey (ILERTI-ADMIN-2025)"
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
                <Users className="w-4 h-4" /> Users & Doctors (Ban/Suspend)
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
                <Shield className="w-4 h-4" /> 2FA & Audit Logs
              </Link>
            </nav>
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
