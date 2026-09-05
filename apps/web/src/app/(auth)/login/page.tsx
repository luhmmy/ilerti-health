"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Stethoscope, User, Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isDoctorTab, setIsDoctorTab] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim() || !password) {
      toast.error("Please enter your email/phone and password.");
      return;
    }

    setLoading(true);
    try {
      const authenticatedUser = await login({
        emailOrPhone: emailOrPhone.trim().toLowerCase(),
        email: emailOrPhone.trim().toLowerCase(),
        password,
        role: isDoctorTab ? "doctor" : undefined,
      });

      if (authenticatedUser.role === "doctor") {
        toast.success(`Welcome back, ${authenticatedUser.name}! Opening Doctor Clinical Portal...`);
        router.push("/doctor-portal");
      } else if (authenticatedUser.role === "admin") {
        toast.success("Welcome Administrator! Opening Admin Console...");
        router.push("/console-x9k2v-sys");
      } else {
        toast.success(`Welcome back, ${authenticatedUser.name}! Opening your Health Dashboard...`);
        router.push("/dashboard");
      }
    } catch (error: any) {
      const msg = error?.message || "Failed to sign in. Please verify your credentials.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-3xl shadow-sm border border-slate-200">
          
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-teal-100">
              {isDoctorTab ? <Stethoscope className="w-6 h-6" /> : <User className="w-6 h-6" />}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A5F] font-heading">
              {isDoctorTab ? "Doctor Portal Sign In" : "Sign In to ILERTI"}
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              {isDoctorTab
                ? "Access your MDCN clinical workbench, consultations, and e-prescriptions."
                : "Manage your personalized health journey, records, and consultations."}
            </p>
          </div>

          {/* Portal Toggle */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setIsDoctorTab(false)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                !isDoctorTab ? "bg-white text-teal-700 shadow-xs" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <User className="w-3.5 h-3.5" /> Patient Login
            </button>
            <button
              type="button"
              onClick={() => setIsDoctorTab(true)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                isDoctorTab ? "bg-white text-teal-700 shadow-xs" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" /> Doctor Portal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isDoctorTab ? "Doctor Email Address *" : "Email Address or Phone *"}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder={isDoctorTab ? "doctor@hospital.gov.ng" : "name@example.com or 08012345678"}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password *</label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-teal-600 hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? "Verifying credentials..." : isDoctorTab ? "Enter Doctor Portal" : "Sign In"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500 space-y-2">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-teal-600 font-bold hover:underline">
                Register here
              </Link>
            </p>
            <p className="text-[11px] text-slate-400">
              Medical &amp; Dental Council of Nigeria (MDCN) compliant system
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
