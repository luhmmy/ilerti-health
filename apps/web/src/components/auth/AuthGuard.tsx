"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Lock, ShieldCheck, Sparkles, ArrowRight, UserPlus, LogIn } from "lucide-react";
import Link from "next/link";

interface AuthGuardProps {
  children: React.ReactNode;
  serviceName?: string;
  serviceDescription?: string;
}

export function AuthGuard({
  children,
  serviceName = "ILERTI Health Services",
  serviceDescription = "To protect sensitive health records in accordance with NDPR & NDPA 2023 regulations and personalize your clinical care, please create an account or sign in.",
}: AuthGuardProps) {
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0D9488] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-medium text-slate-500">Checking authenticated session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        
        <main className="flex-1 flex items-center justify-center px-4 py-12 md:py-20">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl text-center relative overflow-hidden">
            <div className="w-16 h-16 bg-teal-50 text-teal-600 border border-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xs">
              <Lock className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 bg-teal-100/70 text-teal-800 border border-teal-200 px-3 py-1 rounded-full text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Account Authentication Required
            </div>

            <h1 className="text-2xl font-bold font-heading text-slate-900 mb-2">
              Sign In to Access {serviceName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
              {serviceDescription}
            </p>

            <div className="space-y-3">
              <Button asChild className="w-full py-5 bg-[#0D9488] hover:bg-[#0f766e] text-white font-bold text-sm rounded-xl shadow-md">
                <Link href="/signup">
                  <UserPlus className="w-4 h-4 mr-2" /> Create Free ILERTI Account
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full py-5 text-sm font-semibold border-slate-300 rounded-xl">
                <Link href="/login">
                  <LogIn className="w-4 h-4 mr-2" /> Sign In to Existing Account
                </Link>
              </Button>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <Link href="/" className="text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors">
                ← Return to Platform Home
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return <>{children}</>;
}
