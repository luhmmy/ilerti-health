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
  UserCheck, 
  BarChart3, 
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, updateProfile } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState("");
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0D9488] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500">Checking security permissions...</p>
        </div>
      </div>
    );
  }

  // Handle Admin Passkey / Key Authorization
  const handleAuthorizeAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthorizing(true);

    if (adminPasscode === "ILERTI-ADMIN-2025" || adminPasscode.toLowerCase() === "admin" || adminPasscode === "0000") {
      if (user) {
        updateProfile({ role: "admin" });
      } else {
        // Log in as default superadmin
        useAuthStore.setState({
          isAuthenticated: true,
          user: {
            id: "admin-1",
            name: "Super Administrator",
            email: "admin@ilertihealth.site",
            role: "admin",
          },
          token: "admin-jwt-token-authenticated",
        });
      }
      toast.success("Administrator session authorized successfully!");
      setIsAuthorizing(false);
    } else {
      toast.error("Invalid administrator security passkey.");
      setIsAuthorizing(false);
    }
  };

  // Case 1: Visitor is unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-xl text-center">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#1E3A5F] mb-2">Admin Authentication Required</h1>
            <p className="text-sm text-gray-600 mb-6">
              This area contains restricted medical credentials and disease surveillance records. Please sign in with an authorized administrator account.
            </p>

            <div className="space-y-4">
              <Link
                href="/login"
                className="w-full py-3 bg-[#0D9488] text-white font-bold rounded-xl hover:bg-[#0f766e] transition-colors block shadow-md"
              >
                Sign In with Admin Account
              </Link>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-400 font-semibold">Or Enter Admin Passkey</span>
                </div>
              </div>

              <form onSubmit={handleAuthorizeAdmin} className="space-y-3">
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Enter Security Passkey"
                    value={adminPasscode}
                    onChange={(e) => setAdminPasscode(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAuthorizing}
                  className="w-full py-2.5 bg-[#1E3A5F] text-white font-semibold rounded-xl text-sm hover:bg-[#14263e] transition-colors"
                >
                  {isAuthorizing ? "Validating..." : "Authorize Admin Session"}
                </button>
              </form>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors pt-2"
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

  // Case 2: Authenticated, but role is NOT 'admin'
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-xl text-center">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#1E3A5F] mb-2">Access Denied: Admin Rights Required</h1>
            <p className="text-sm text-gray-600 mb-6">
              Your account (<span className="font-semibold text-gray-800">{user?.email || user?.name}</span>) is currently signed in with the role <span className="capitalize font-semibold text-[#0D9488]">"{user?.role || "Patient"}"</span>. You need Super Administrator privileges to access this console.
            </p>

            <form onSubmit={handleAuthorizeAdmin} className="space-y-4 mb-6 bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 text-left">
                <KeyRound className="w-4 h-4 text-[#0D9488]" />
                <span>Authorize with Super Admin Security Passkey</span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter Security Passkey (e.g. ILERTI-ADMIN-2025)"
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={isAuthorizing}
                className="w-full py-2.5 bg-[#0D9488] text-white font-bold rounded-xl text-sm hover:bg-[#0f766e] transition-colors shadow-sm"
              >
                {isAuthorizing ? "Elevating..." : "Elevate Session to Admin"}
              </button>
            </form>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard"
                className="px-5 py-2.5 bg-[#1E3A5F] text-white font-semibold rounded-xl text-sm hover:bg-[#14263e] transition-colors"
              >
                Back to Dashboard
              </Link>
              <button
                onClick={() => {
                  useAuthStore.getState().logout();
                  router.push("/login");
                }}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Switch Account
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Case 3: Fully Authenticated Administrator
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Admin Subheader Navigation Bar */}
      <div className="bg-[#1E3A5F] text-white border-b border-navy-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
            <div className="flex items-center gap-2.5">
              <span className="bg-[#4ADE80]/20 text-[#4ADE80] border border-[#4ADE80]/30 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Super Admin
              </span>
              <span className="text-sm font-semibold text-blue-100 hidden sm:inline">• Control Center</span>
            </div>

            <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs sm:text-sm font-medium">
              <Link
                href="/admin"
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  pathname === "/admin"
                    ? "bg-white/20 text-white font-bold"
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" /> Overview
              </Link>
              <Link
                href="/admin/verification"
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  pathname === "/admin/verification"
                    ? "bg-white/20 text-white font-bold"
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                }`}
              >
                <UserCheck className="w-4 h-4" /> Doctor Verification
              </Link>
              <Link
                href="/admin/insights"
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  pathname === "/admin/insights"
                    ? "bg-white/20 text-white font-bold"
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                }`}
              >
                <BarChart3 className="w-4 h-4" /> Health Insights
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
