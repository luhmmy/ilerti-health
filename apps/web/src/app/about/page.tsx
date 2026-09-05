"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  HeartHandshake, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  Activity, 
  Stethoscope, 
  Apple, 
  CheckCircle2, 
  Lock, 
  ArrowRight,
  Globe2,
  Award,
  BookOpen
} from "lucide-react";
import Link from "next/link";

const PILLARS = [
  {
    step: "01",
    tagline: "KNOW",
    title: "AI Health Navigation",
    description: "24/7 symptom triage and clinical guidance helping Nigerians understand their health before symptoms escalate.",
    icon: Sparkles,
    color: "text-teal-600 bg-teal-50 border-teal-200",
  },
  {
    step: "02",
    tagline: "CONNECT",
    title: "Verified Doctor Network",
    description: "Direct access to licensed, MDCN-verified physicians and specialists across Nigeria for chat, audio, and video care.",
    icon: Stethoscope,
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
  {
    step: "03",
    tagline: "CARE",
    title: "Seamless Telehealth and Vault",
    description: "End-to-end digital health records vault, e-prescriptions, lab referrals, and follow-up management in one secure app.",
    icon: Activity,
    color: "text-purple-600 bg-purple-50 border-purple-200",
  },
  {
    step: "04",
    tagline: "PREVENT",
    title: "Preventive Care and Screenings",
    description: "Proactive screening guidelines, routine vitals monitoring, and immunization tracking to prevent chronic health conditions.",
    icon: ShieldCheck,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  {
    step: "05",
    tagline: "THRIVE",
    title: "Nigerian Wellness and Nutrition",
    description: "Personalized healthy meal plans with local Nigerian staples, daily hydration companions, and lifestyle coaching.",
    icon: Apple,
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
];

const VALUES = [
  {
    title: "Clinical Excellence",
    desc: "Every healthcare professional on ILERTI is thoroughly vetted with MDCN registration credentials.",
    icon: Award,
  },
  {
    title: "Data Privacy and Trust",
    desc: "Strict adherence to NDPR and NDPA 2023 guidelines. Your health records belong solely to you.",
    icon: Lock,
  },
  {
    title: "Affordability and Inclusion",
    desc: "Democratizing quality healthcare with transparent pricing and accessible digital consultation options.",
    icon: Users,
  },
  {
    title: "Lifelong Health Focus",
    desc: "We do not just treat sickness — we empower lifelong prevention, wellness, and healthy daily habits.",
    icon: HeartHandshake,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 bg-gradient-to-b from-teal-50/60 via-white to-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" /> About ILERTI Health
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-navy-900 tracking-tight leading-tight mb-6">
            Transforming Healthcare Access <br className="hidden md:block" />
            <span className="text-teal-600">Across Nigeria</span>
          </h1>
          <p className="text-base md:text-xl text-navy-600 max-w-3xl mx-auto leading-relaxed mb-8">
            ILERTI Health is a digital health ecosystem built to provide accessible, preventive, and patient-centered healthcare for every Nigerian — from symptom triage to verified specialist care and daily wellness.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild className="bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-md">
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-white">
              <Link href="/login">Sign In to Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Mission and Vision */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-navy-50 text-navy-800 text-xs font-bold">
                <BookOpen className="w-4 h-4 text-teal-600" /> Our Purpose
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-navy-900 leading-snug">
                Empowering 200 Million+ Nigerians with Quality Healthcare in Their Pocket.
              </h2>
              <p className="text-navy-600 text-sm md:text-base leading-relaxed">
                In Nigeria, accessing timely medical consultations often entails hours in hospital queues, geographical barriers, and fragmented patient records.
              </p>
              <p className="text-navy-600 text-sm md:text-base leading-relaxed">
                ILERTI was created to bridge this divide — providing an intuitive, secure digital bridge connecting patients to verified doctors, diagnostic laboratories, and personalized wellness tools.
              </p>
              <div className="pt-2 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-2xl font-black text-teal-700">36 States</div>
                  <div className="text-xs text-navy-500 font-medium mt-1">Nationwide Coverage and FCT</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-2xl font-black text-teal-700">100% Verified</div>
                  <div className="text-xs text-navy-500 font-medium mt-1">MDCN Licensed Physicians</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-navy-900 to-teal-900 rounded-3xl p-8 text-white shadow-xl space-y-6">
              <h3 className="text-xl font-bold text-teal-300">The ILERTI Promise</h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                "We believe healthcare should not start when illness becomes critical. True health is a lifelong continuum of awareness, early intervention, verified care, and preventive nutrition."
              </p>
              <ul className="space-y-3 text-sm text-slate-200">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                  <span>Zero hospital waiting room congestion</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                  <span>Transparent, fixed consultation fees in Naira</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                  <span>Confidential, encrypted personal health vault</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                  <span>Culturally tailored Nigerian nutrition and meal plans</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The 5 Pillars */}
      <section className="py-16 md:py-20 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">The ILERTI Architecture</span>
            <h2 className="text-2xl md:text-4xl font-bold text-navy-900 mt-2">
              Know. Connect. Care. Prevent. Thrive.
            </h2>
            <p className="text-sm md:text-base text-navy-600 mt-3">
              Our 5-pillar framework addresses the entire spectrum of modern healthcare needs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <Card key={pillar.step} className="border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${pillar.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-black text-slate-300 tracking-widest">{pillar.step}</span>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">{pillar.tagline}</span>
                      <h3 className="text-lg font-bold text-navy-900 mt-0.5">{pillar.title}</h3>
                    </div>
                    <p className="text-xs md:text-sm text-navy-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}

            {/* Final CTA Card in Grid */}
            <Card className="border-teal-200 bg-gradient-to-br from-teal-600 to-teal-800 text-white shadow-md flex flex-col justify-between">
              <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                <div>
                  <Globe2 className="w-10 h-10 text-teal-200 mb-3" />
                  <h3 className="text-lg font-bold text-white">Join the Movement</h3>
                  <p className="text-xs text-teal-100 mt-2 leading-relaxed">
                    Take charge of your vitals, connect with top doctors, and build healthy daily habits today.
                  </p>
                </div>
                <Button size="sm" asChild className="w-full bg-white text-teal-800 hover:bg-teal-50 font-bold text-xs mt-4">
                  <Link href="/signup">Create Free Account</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-20 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Our Standards</span>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-900 mt-2">
              Built on Trust, Privacy and Integrity
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((val) => {
              const Icon = val.icon;
              return (
                <div key={val.title} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-start space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-navy-900">{val.title}</h3>
                  <p className="text-xs text-navy-600 leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 bg-navy-900 text-white text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Ready to Start Your Health Journey?
          </h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Create your free ILERTI account today to access AI symptom triage, consult verified physicians, and track your personalized wellness.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-base px-8 shadow-lg">
              <Link href="/signup">Create Your Free Account</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-white border-slate-600 hover:bg-navy-800">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
