"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { useAuthStore } from "../../stores/useAuthStore";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "../ui/button";
import {
  Menu,
  X,
  Sparkles,
  Stethoscope,
  Building2,
  Apple,
  FileText,
  CreditCard,
  User,
  LogOut,
  Shield,
  LayoutDashboard,
  HelpCircle,
  Phone,
  Info,
  ChevronRight,
  ShieldCheck,
  Pill
} from "lucide-react";

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu whenever pathname changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between px-4 sm:px-6 border-b bg-white/95 backdrop-blur-md transition-all shadow-xs">
        <div className="flex items-center gap-6">
          <BrandLogo size="md" />

          {/* Desktop Navigation */}
          {isAuthenticated ? (
            <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-navy-700">
              <Link 
                href="/dashboard" 
                className={`transition-colors hover:text-primary-600 ${pathname === '/dashboard' ? 'text-primary-600 font-bold' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                href="/ai" 
                className={`flex items-center gap-1.5 transition-colors font-semibold ${pathname === '/ai' ? 'text-teal-700' : 'text-primary-600 hover:text-primary-700'}`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" /> AI Triage
              </Link>
              <Link 
                href="/doctors" 
                className={`transition-colors hover:text-primary-600 ${pathname?.startsWith('/doctors') ? 'text-primary-600 font-bold' : ''}`}
              >
                Doctors
              </Link>
              <Link 
                href="/facilities" 
                className={`transition-colors hover:text-primary-600 ${pathname === '/facilities' ? 'text-primary-600 font-bold' : ''}`}
              >
                Facilities
              </Link>
              <Link 
                href="/wellness" 
                className={`transition-colors hover:text-primary-600 ${pathname?.startsWith('/wellness') ? 'text-primary-600 font-bold' : ''}`}
              >
                Wellness
              </Link>
              <Link 
                href="/health" 
                className={`transition-colors hover:text-primary-600 ${pathname?.startsWith('/health') ? 'text-primary-600 font-bold' : ''}`}
              >
                Records
              </Link>
              <Link 
                href="/pricing" 
                className={`transition-colors hover:text-primary-600 ${pathname === '/pricing' ? 'text-primary-600 font-bold' : ''}`}
              >
                Pricing
              </Link>
              {user?.role === "admin" && (
                <Link 
                  href="/console-x9k2v-sys" 
                  className={`flex items-center gap-1 transition-colors px-2 py-0.5 rounded-full text-xs font-semibold bg-navy-900 text-teal-300 hover:bg-navy-800 ${pathname?.startsWith('/console-x9k2v-sys') ? 'ring-2 ring-teal-400' : ''}`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin
                </Link>
              )}
            </nav>
          ) : (
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-navy-700">
              <Link href="/about" className={`transition-colors hover:text-primary-600 ${pathname === '/about' ? 'text-primary-600 font-bold' : ''}`}>
                About
              </Link>
              <Link href="/ai" className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold">
                <Sparkles className="w-4 h-4 text-amber-500" /> AI Navigation
              </Link>
              <Link href="/doctors" className="hover:text-primary-600 transition-colors">
                Doctors
              </Link>
              <Link href="/facilities" className="hover:text-primary-600 transition-colors">
                Facilities
              </Link>
              <Link href="/pricing" className="hover:text-primary-600 transition-colors">
                Pricing
              </Link>
              <Link href="/contact" className="hover:text-primary-600 transition-colors">
                Contact
              </Link>
            </nav>
          )}
        </div>

        {/* Right Section: Profile & Actions + Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link 
                href="/profile" 
                className="flex items-center gap-2 p-1 px-2.5 rounded-full hover:bg-teal-50 border border-transparent hover:border-teal-200 transition-all cursor-pointer group"
                title="View and edit profile"
              >
                <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold group-hover:bg-teal-600 group-hover:text-white transition-colors text-xs">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold group-hover:text-teal-700 transition-colors max-w-[120px] truncate">{user?.name}</span>
                  <span className="text-[10px] text-gray-500 capitalize">{user?.role || "Patient"}</span>
                </div>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs h-8 px-3">
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" className="bg-[#0D9488] hover:bg-[#0f766e] text-white" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          )}

          {/* Hamburger Menu Button (Visible on mobile/tablet: lg:hidden) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-navy-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 lg:hidden transition-colors"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-navy-900" />
            ) : (
              <Menu className="w-6 h-6 text-navy-900" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Drawer / Hamburger Dropdown Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 lg:hidden bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-50 overflow-y-auto animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b bg-slate-50">
              <BrandLogo size="sm" />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Bar (If Logged In) */}
            {isAuthenticated && (
              <div className="p-4 bg-teal-50/60 border-b border-teal-100 flex items-center justify-between">
                <Link 
                  href="/profile" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 group"
                >
                  <div className="h-10 w-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-navy-900 group-hover:text-teal-700 transition-colors line-clamp-1">{user?.name}</h4>
                    <p className="text-xs text-slate-500 capitalize">{user?.role || "Patient"} • Edit Profile</p>
                  </div>
                </Link>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            )}

            {/* Navigation List */}
            <div className="flex-1 px-4 py-4 space-y-1">
              {isAuthenticated ? (
                <>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1">
                    Health Services
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      pathname === "/dashboard" ? "bg-teal-50 text-teal-800 font-bold" : "text-navy-800 hover:bg-slate-100"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-teal-600" />
                    Dashboard
                  </Link>

                  <Link
                    href="/ai"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      pathname === "/ai" ? "bg-teal-50 text-teal-800 font-bold" : "text-teal-700 hover:bg-teal-50/60"
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    AI Symptom Triage
                  </Link>

                  <Link
                    href="/doctors"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      pathname?.startsWith("/doctors") ? "bg-teal-50 text-teal-800 font-bold" : "text-navy-800 hover:bg-slate-100"
                    }`}
                  >
                    <Stethoscope className="w-4 h-4 text-blue-600" />
                    Doctors & Specialists
                  </Link>

                  <Link
                    href="/facilities"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      pathname === "/facilities" ? "bg-teal-50 text-teal-800 font-bold" : "text-navy-800 hover:bg-slate-100"
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-purple-600" />
                    Hospitals & Labs
                  </Link>

                  <Link
                    href="/health"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      pathname?.startsWith("/health") ? "bg-teal-50 text-teal-800 font-bold" : "text-navy-800 hover:bg-slate-100"
                    }`}
                  >
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Health Records Vault
                  </Link>

                  <Link
                    href="/health/medications"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      pathname === "/health/medications" ? "bg-teal-50 text-teal-800 font-bold" : "text-navy-800 hover:bg-slate-100"
                    }`}
                  >
                    <Pill className="w-4 h-4 text-orange-600" />
                    Medications Tracker
                  </Link>

                  <Link
                    href="/wellness"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      pathname?.startsWith("/wellness") ? "bg-teal-50 text-teal-800 font-bold" : "text-navy-800 hover:bg-slate-100"
                    }`}
                  >
                    <Apple className="w-4 h-4 text-red-500" />
                    Wellness & Nutrition
                  </Link>

                  <Link
                    href="/pricing"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      pathname === "/pricing" ? "bg-teal-50 text-teal-800 font-bold" : "text-navy-800 hover:bg-slate-100"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    Subscription Plans
                  </Link>

                  {user?.role === "admin" && (
                    <div className="pt-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1">
                        Administration
                      </div>
                      <Link
                        href="/console-x9k2v-sys"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold bg-[#1E3A5F] text-[#4ADE80] shadow-sm hover:bg-[#152a45] transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Secret Admin Console
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1">
                    Explore ILERTI
                  </div>
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-navy-800 hover:bg-slate-100 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-teal-600" />
                    Home
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-navy-800 hover:bg-slate-100 transition-colors"
                  >
                    <Info className="w-4 h-4 text-blue-600" />
                    About ILERTI
                  </Link>
                  <Link
                    href="/ai"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-teal-700 hover:bg-teal-50/60 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    AI Symptom Checker
                  </Link>
                  <Link
                    href="/doctors"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-navy-800 hover:bg-slate-100 transition-colors"
                  >
                    <Stethoscope className="w-4 h-4 text-blue-600" />
                    Find Verified Doctors
                  </Link>
                  <Link
                    href="/facilities"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-navy-800 hover:bg-slate-100 transition-colors"
                  >
                    <Building2 className="w-4 h-4 text-purple-600" />
                    Hospitals & Labs
                  </Link>
                  <Link
                    href="/pricing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-navy-800 hover:bg-slate-100 transition-colors"
                  >
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    Pricing & Membership
                  </Link>
                </>
              )}

              <div className="pt-3 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-1">
                  Support & Info
                </div>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Contact Us
                </Link>
                <Link
                  href="/help"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  Help Centre
                </Link>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t bg-slate-50 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-navy-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <User className="w-3.5 h-3.5" /> My Account Settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button className="w-full bg-[#0D9488] hover:bg-[#0f766e] text-white" asChild onClick={() => setMobileMenuOpen(false)}>
                    <Link href="/signup">Get Started Free</Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild onClick={() => setMobileMenuOpen(false)}>
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
