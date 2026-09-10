"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Stethoscope, User, Lock, Mail, Eye, EyeOff, ArrowRight, BriefcaseMedical } from "lucide-react";
import { api } from "@/lib/api";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { PRACTITIONER_DOMAINS } from "@/lib/constants/practitionerDomains";

export default function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isPractitionerTab, setIsPractitionerTab] = useState(false);
  const [practitionerDomain, setPractitionerDomain] = useState("medical_doctor");
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
        role: isPractitionerTab ? "doctor" : undefined,
      });

      if (authenticatedUser.role === "doctor") {
        toast.success(`Welcome back, ${authenticatedUser.name}! Opening Clinical Portal...`);
        router.push("/doctor-portal");
      } else if (authenticatedUser.role === "admin") {
        toast.success("Welcome Administrator! Opening Admin Console...");
        router.push("/console-x9k2v-sys");
      } else {
        toast.success(`Welcome back, ${authenticatedUser.name}! Opening your Health Dashboard...`);
        router.push("/dashboard");
      }
    } catch (error: any) {
      // If account exists but is unverified, redirect to OTP verification page
      if (error?.requiresVerification) {
        toast.info("Your account needs verification. Redirecting to enter your OTP code...");
        // Auto-resend a fresh OTP
        try {
          const res = await api.auth.resendOtp({ emailOrPhone: error.email || emailOrPhone.trim().toLowerCase() });
          if (res?.devOtp) {
            useAuthStore.getState().setTempOtp(res.devOtp);
          }
          toast.success("A new verification code has been dispatched!");
        } catch {
          // Silently continue — OTP may have been sent previously
        }
        router.push("/verify");
        return;
      }
      const msg = error?.message || "Failed to sign in. Please verify your credentials.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-teal-100">
          {isPractitionerTab ? <Stethoscope className="w-6 h-6" /> : <User className="w-6 h-6" />}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A5F] font-heading">
          {isPractitionerTab ? "Health Practitioner Sign In" : "Sign In to ILERTI"}
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          {isPractitionerTab
            ? "Access your clinical workbench, consultations, and professional dashboard."
            : "Manage your personalized health journey, records, and consultations."}
        </p>
      </div>

      {/* Portal Toggle */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-4">
        <button
          type="button"
          onClick={() => setIsPractitionerTab(false)}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            !isPractitionerTab ? "bg-white text-teal-700 shadow-xs" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <User className="w-3.5 h-3.5" /> Patient Login
        </button>
        <button
          type="button"
          onClick={() => setIsPractitionerTab(true)}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            isPractitionerTab ? "bg-white text-teal-700 shadow-xs" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" /> Health Practitioner
        </button>
      </div>

      {/* Practitioner Domain Selection (Prominent Card) */}
      {isPractitionerTab && (
        <div className="mb-5 p-4 bg-teal-50/60 border-2 border-teal-200/80 rounded-2xl space-y-2 transition-all">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
              <BriefcaseMedical className="w-4 h-4 text-teal-600" />
              Select Health Sector Field / Domain *
            </label>
            <span className="text-[11px] font-semibold text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-full">
              Accredited Practice
            </span>
          </div>
          <p className="text-[12px] text-slate-600 leading-snug">
            Choose your certified medical, pharmaceutical, nursing, therapeutic, or health science field:
          </p>
          <select
            value={practitionerDomain}
            onChange={(e) => setPractitionerDomain(e.target.value)}
            className="w-full px-3.5 py-3 text-sm font-medium border border-teal-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white text-slate-800 shadow-xs cursor-pointer"
          >
            {PRACTITIONER_DOMAINS.map((group) => (
              <optgroup key={group.group} label={group.group} className="font-bold text-teal-800">
                {group.domains.map((d) => (
                  <option key={d.value} value={d.value} className="font-normal text-slate-800 py-1">
                    {d.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      )}

      {/* Google Sign In Option */}
      <div className="mb-5">
        <GoogleSignInButton 
          isDoctor={isPractitionerTab} 
          role={isPractitionerTab ? "doctor" : "patient"}
          label={isPractitionerTab ? "Sign in as Health Practitioner with Google" : "Sign in with Google"} 
        />
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">
              Or sign in with email
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {isPractitionerTab ? "Professional Email Address *" : "Email Address or Phone *"}
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder={isPractitionerTab ? "practitioner@hospital.gov.ng" : "name@example.com or 08012345678"}
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
          className="w-full py-3 text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
        >
          {loading ? "Verifying credentials..." : isPractitionerTab ? "Enter Practitioner Portal" : "Sign In"}
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
  );
}
