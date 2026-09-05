"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, Search, ChevronDown, ChevronUp, Stethoscope, CreditCard, Shield, UserCheck, MessageCircle } from "lucide-react";
import Link from "next/link";

const FAQS = [
  {
    category: "Consultations & Doctors",
    q: "How are doctors on ILERTI Health verified?",
    a: "Every doctor on ILERTI must provide a valid Medical and Dental Council of Nigeria (MDCN) registration number, active practicing license, and folio credentials before being admitted to our provider network.",
  },
  {
    category: "Consultations & Doctors",
    q: "How does a video or chat consultation work?",
    a: "Once you select a doctor and complete checkout, you will receive a secure consultation link in your dashboard. You can consult live via WebRTC video, crystal-clear audio, or real-time text chat from your phone or laptop.",
  },
  {
    category: "AI Triage",
    q: "Does the AI diagnose illnesses or prescribe drugs?",
    a: "No. The ILERTI AI Health Navigator is a clinical triage guide. It assesses symptom urgency (Low, Moderate, High, Emergency) and directs you to the appropriate specialist or emergency facility without writing formal prescriptions.",
  },
  {
    category: "Payments & Billing",
    q: "What payment methods are supported in Nigeria?",
    a: "We process payments securely in Nigerian Naira (₦) through Paystack. You can pay using Nigerian Debit/Credit cards (Mastercard, Visa, Verve), Direct Bank Transfer (Virtual NUBAN), and USSD codes.",
  },
  {
    category: "Health Vault & Privacy",
    q: "Are my medical records safe and private?",
    a: "Yes. ILERTI complies with the Nigeria Data Protection Act (NDPA 2023) and NDPR regulations. All health records, triage logs, and prescriptions are encrypted in transit and at rest.",
  },
];

export default function HelpPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = FAQS.filter(
    f => f.q.toLowerCase().includes(searchTerm.toLowerCase()) || f.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <section className="pt-20 pb-16 md:pt-28 md:pb-24 bg-gradient-to-b from-teal-50/60 via-white to-slate-50 border-b border-slate-100 text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200 mb-6">
            <HelpCircle className="w-3.5 h-3.5 text-teal-600" /> Knowledge Base & FAQ
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-navy-900 tracking-tight leading-tight mb-6">
            How can we help you?
          </h1>
          <div className="max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 shadow-sm focus:outline-teal-500 bg-white text-sm"
              placeholder="Search help articles, billing, MDCN verification..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 flex-1">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl space-y-8">
          <div className="space-y-4">
            {filtered.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-bold text-navy-900 text-sm md:text-base">{item.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-teal-600 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs md:text-sm text-navy-600 leading-relaxed border-t border-slate-100 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Need more help */}
          <div className="p-8 rounded-3xl bg-teal-50 border border-teal-200 text-center space-y-4">
            <h3 className="text-lg font-bold text-navy-900">Still have questions?</h3>
            <p className="text-xs md:text-sm text-navy-600 max-w-md mx-auto">
              Our patient care team is available 24/7 to help you with bookings, triage, or account queries.
            </p>
            <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white font-bold">
              <Link href="/contact">Contact Care Support</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
