"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, MapPin, Clock, ArrowRight, CheckCircle2, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

const OPENINGS = [
  {
    id: "med-officer",
    title: "Telehealth Medical Officer (MDCN Licensed)",
    dept: "Clinical Operations",
    location: "Lagos / Remote (Nigeria)",
    type: "Full-Time",
    desc: "Lead virtual patient consultations, review clinical triage protocols, and maintain telemedicine quality standards.",
  },
  {
    id: "fullstack-eng",
    title: "Senior Fullstack Engineer (Next.js & NestJS)",
    dept: "Engineering",
    location: "Remote (Nigeria)",
    type: "Full-Time",
    desc: "Scale our real-time telehealth infrastructure, WebRTC video consultation services, and secure health data vault.",
  },
  {
    id: "clinical-coord",
    title: "Clinical Care Coordinator",
    dept: "Patient Experience",
    location: "Remote (Nigeria)",
    type: "Full-Time",
    desc: "Facilitate specialist referrals, laboratory investigation coordination, and prescription fulfillment for patients.",
  },
  {
    id: "growth-lead",
    title: "Growth & Provider Partnership Lead",
    dept: "Commercial",
    location: "Nigeria (Remote / Hybrid)",
    type: "Full-Time",
    desc: "Expand our verified doctor network and onboard top HMOs, hospitals, and diagnostic centres across Nigeria.",
  },
];

export default function CareersPage() {
  const [applicant, setApplicant] = useState({ name: "", email: "", role: "Clinical / Medical", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicant.name || !applicant.email) {
      toast.error("Please fill in your name and email.");
      return;
    }
    setSubmitted(true);
    toast.success("Profile submitted! We will reach out when a matching role opens.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Hero */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24 bg-gradient-to-b from-teal-50/60 via-white to-slate-50 border-b border-slate-100 text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 mb-6">
            <Clock className="w-3.5 h-3.5 text-teal-600" /> Talent & Careers
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-navy-900 tracking-tight leading-tight mb-6">
            Careers at <span className="text-teal-600">ILERTI Health</span>
          </h1>
          <p className="text-base md:text-xl text-navy-600 max-w-2xl mx-auto leading-relaxed">
            Building the next generation of accessible digital healthcare for Nigeria.
          </p>
        </div>
      </section>

      {/* Currently Unavailable Notice */}
      <section className="py-16 md:py-20 bg-white flex-1">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center space-y-8">
          <div className="p-8 md:p-12 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-sm">
              <Briefcase className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-navy-900">No Open Roles at the Moment</h2>
            <p className="text-sm md:text-base text-navy-600 max-w-lg mx-auto leading-relaxed">
              Our team is currently at full capacity and we do not have any active vacancies. However, we are always eager to connect with visionary physicians, software engineers, and health leaders.
            </p>
            <div className="pt-2">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                Check back regularly for future openings
              </span>
            </div>
          </div>

          {/* Join Talent Pool */}
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-left">
            <h3 className="text-lg font-bold text-navy-900 mb-1">Join Our Future Talent Community</h3>
            <p className="text-xs text-navy-500 mb-6">
              Leave your contact info and background so we can reach out when new opportunities open.
            </p>

            {submitted ? (
              <div className="p-8 text-center space-y-3 bg-teal-50 rounded-2xl border border-teal-200">
                <CheckCircle2 className="w-10 h-10 text-teal-600 mx-auto" />
                <h4 className="text-base font-bold text-navy-900">Profile Received!</h4>
                <p className="text-xs text-navy-600">
                  Thank you for your interest in ILERTI Health. We will reach out when relevant positions become available.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-1">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-teal-500" 
                      placeholder="Dr. Chioma Adeyemi"
                      value={applicant.name}
                      onChange={(e) => setApplicant({ ...applicant, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-1">Email Address *</label>
                    <input 
                      type="email" 
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-teal-500" 
                      placeholder="chioma@example.com"
                      value={applicant.email}
                      onChange={(e) => setApplicant({ ...applicant, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1">Area of Expertise</label>
                  <select 
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-teal-500 bg-white"
                    value={applicant.role}
                    onChange={(e) => setApplicant({ ...applicant, role: e.target.value })}
                  >
                    <option value="Clinical / Medical">Medical Officer / Specialist (MDCN)</option>
                    <option value="Software Engineering">Software Engineering / DevOps</option>
                    <option value="Product & Design">Product Management / UI/UX Design</option>
                    <option value="Operations & Support">Clinical Operations & Customer Care</option>
                    <option value="Growth & Marketing">Growth & Partnerships</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-700 mb-1">LinkedIn URL or Summary</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-teal-500" 
                    placeholder="https://linkedin.com/in/... or short summary"
                    value={applicant.notes}
                    onChange={(e) => setApplicant({ ...applicant, notes: e.target.value })}
                  />
                </div>

                <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold w-full sm:w-auto">
                  <Send className="w-4 h-4 mr-2" /> Join Talent Pool
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
