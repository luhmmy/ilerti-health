"use client";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { ScrollReveal } from "@/components/marketing/ScrollReveal";
import { 
  Stethoscope, 
  Sparkles, 
  Building2, 
  Pill, 
  Apple, 
  HeartPulse, 
  ArrowRight,
  ShieldCheck, 
  Video, 
  FileText,
  LayoutDashboard,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();

  const quickServices = [
    { 
      icon: Sparkles, 
      title: "AI Symptom Triage", 
      desc: "Instant guidance & urgency rating", 
      badge: "Fast & Free",
      color: "text-amber-500", 
      bg: "bg-amber-50", 
      border: "border-amber-100",
      href: isAuthenticated ? "/ai" : "/signup" 
    },
    { 
      icon: Stethoscope, 
      title: "Verified Doctors", 
      desc: "Consult MDCN specialists", 
      badge: "Video / Chat",
      color: "text-teal-600", 
      bg: "bg-teal-50", 
      border: "border-teal-100",
      href: isAuthenticated ? "/doctors" : "/signup" 
    },
    { 
      icon: Building2, 
      title: "Hospitals & Labs", 
      desc: "Accredited centres near you", 
      badge: "36 States",
      color: "text-blue-600", 
      bg: "bg-blue-50", 
      border: "border-blue-100",
      href: isAuthenticated ? "/facilities" : "/signup" 
    },
    { 
      icon: FileText, 
      title: "Health Records", 
      desc: "Secure lifetime health vault", 
      badge: "NDPR Encrypted",
      color: "text-purple-600", 
      bg: "bg-purple-50", 
      border: "border-purple-100",
      href: isAuthenticated ? "/health" : "/signup" 
    },
    { 
      icon: Pill, 
      title: "Medications", 
      desc: "Dosage & refill alerts", 
      badge: "Smart Reminders",
      color: "text-emerald-600", 
      bg: "bg-emerald-50", 
      border: "border-emerald-100",
      href: isAuthenticated ? "/health/medications" : "/signup" 
    },
    { 
      icon: Apple, 
      title: "Nigerian Nutrition", 
      desc: "Local dietary meal plans", 
      badge: "Custom Meals",
      color: "text-orange-500", 
      bg: "bg-orange-50", 
      border: "border-orange-100",
      href: isAuthenticated ? "/wellness/nutrition" : "/signup" 
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      {/* Streamlined Hero Section */}
      <section className="relative pt-8 pb-10 md:pt-16 md:pb-16 overflow-hidden bg-gradient-to-b from-teal-50/50 via-white to-slate-50/40 border-b border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl text-center">
          
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-100/70 text-teal-800 border border-teal-200/80 mb-4 animate-in fade-in">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Nigeria&apos;s Digital Health &amp; Prevention Ecosystem</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#1E3A5F] tracking-tight leading-tight mb-3">
            Your Health Journey <br className="hidden sm:inline" />
            <span className="text-[#0D9488]">Starts Here</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto mb-6 leading-relaxed">
            Instant AI triage, verified MDCN doctors, nearby accredited clinics, and personalized Nigerian wellness — in one unified app.
          </p>

          {/* Direct Hero CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            {isAuthenticated ? (
              <>
                <Button asChild size="lg" className="w-full sm:w-auto bg-[#0D9488] hover:bg-[#0f766e] text-white shadow-md text-sm font-bold">
                  <Link href={user?.role === "doctor" ? "/doctor-portal" : "/dashboard"}>
                    <LayoutDashboard className="w-4 h-4 mr-2" /> 
                    {user?.role === "doctor" ? "Open Doctor Portal" : "Go to Dashboard"}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto text-sm border-slate-300">
                  <Link href="/ai">
                    <Sparkles className="w-4 h-4 mr-1.5 text-amber-500" /> AI Symptom Checker
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="w-full sm:w-auto bg-[#0D9488] hover:bg-[#0f766e] text-white shadow-md text-sm font-bold">
                  <Link href="/signup">
                    <Sparkles className="w-4 h-4 mr-1.5 text-amber-300" /> Get Started Free
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto text-sm border-slate-300 bg-white">
                  <Link href="/doctors">
                    <Stethoscope className="w-4 h-4 mr-1.5 text-teal-600" /> Find Verified Doctors
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Quick Stat Ribbon */}
          <div className="mt-8 pt-6 border-t border-slate-200/60 grid grid-cols-3 gap-2 max-w-xl mx-auto text-center text-xs">
            <div>
              <div className="font-bold text-slate-900 text-sm sm:text-base font-heading">2,000+</div>
              <div className="text-slate-500 text-[11px]">MDCN Doctors</div>
            </div>
            <div className="border-x border-slate-200">
              <div className="font-bold text-slate-900 text-sm sm:text-base font-heading">500+</div>
              <div className="text-slate-500 text-[11px]">Hospitals &amp; Labs</div>
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm sm:text-base font-heading">36 States</div>
              <div className="text-slate-500 text-[11px]">Nationwide Coverage</div>
            </div>
          </div>

        </div>
      </section>

      {/* Compact Services Grid (Optimized for Mobile) */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#1E3A5F]">
                Healthcare Services
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">Fast, accessible medical support designed for you</p>
            </div>
            <Link href="/pricing" className="text-xs font-semibold text-teal-600 hover:underline flex items-center gap-1">
              View Membership Plans <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 2-Column Mobile Grid for minimal scrolling */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {quickServices.map((srv, idx) => (
              <Link 
                key={idx} 
                href={srv.href}
                className="group p-3.5 sm:p-5 rounded-2xl border border-slate-200 hover:border-teal-400 bg-white hover:bg-teal-50/20 transition-all shadow-xs hover:shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${srv.bg} ${srv.color} flex items-center justify-center`}>
                      <srv.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-teal-700 transition-colors hidden sm:inline">
                      {srv.badge}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900 group-hover:text-teal-700 transition-colors leading-tight mb-1">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center text-[11px] font-semibold text-teal-600">
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3-Step Simple Flow */}
      <section className="py-8 sm:py-12 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#1E3A5F]">
              How ILERTI Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">From symptoms to care in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-teal-50 text-teal-700 font-bold flex items-center justify-center mb-3 text-sm">
                1
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Describe Symptoms</h3>
              <p className="text-xs text-slate-500">Our AI triage evaluates urgency and recommends next steps.</p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-teal-50 text-teal-700 font-bold flex items-center justify-center mb-3 text-sm">
                2
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Consult a Doctor</h3>
              <p className="text-xs text-slate-500">Connect with verified MDCN doctors via secure video or chat.</p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-teal-50 text-teal-700 font-bold flex items-center justify-center mb-3 text-sm">
                3
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Receive Digital Care</h3>
              <p className="text-xs text-slate-500">Get E-Prescriptions, lab referrals, and personalized Nigerian wellness.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Doctor & Provider CTA Ribbon */}
      <section className="py-8 bg-[#1E3A5F] text-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4ADE80] uppercase tracking-wider mb-1">
              <Stethoscope className="w-3.5 h-3.5" /> For Medical Doctors &amp; Clinics
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-heading">Are you an MDCN licensed practitioner?</h3>
            <p className="text-xs text-blue-100">Join our telemedicine network to consult patients, issue digital prescriptions, and grow your practice.</p>
          </div>
          <Button asChild className="bg-[#0D9488] hover:bg-[#0f766e] text-white shrink-0 text-xs font-bold px-5 py-2 rounded-xl">
            <Link href="/signup">Register as Doctor</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
