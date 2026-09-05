"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileText, AlertCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <section className="pt-20 pb-12 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
            <FileText className="w-4 h-4" /> Legal Agreement
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-navy-900">
            Terms of Service & Clinical Care Guidelines
          </h1>
          <p className="text-xs text-navy-500 mt-2">Last Updated: September 2026</p>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-8 text-navy-800 text-sm leading-relaxed">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900">
              <strong>Medical Emergency Notice:</strong> ILERTI Telehealth services are not intended for life-threatening emergencies. If you are experiencing acute chest pain, severe bleeding, or loss of consciousness, please call emergency services (112) or visit the nearest hospital emergency room immediately.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-navy-900 mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or creating an account on ILERTI Health, you agree to comply with and be bound by these Terms of Service. If you do not agree, you may not use our services.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-navy-900 mb-2">2. Provider-Patient Relationship</h2>
            <p>
              ILERTI provides a technology platform connecting patients with independent licensed medical practitioners. Telehealth consultations are provided by licensed physicians registered with the Medical and Dental Council of Nigeria (MDCN).
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-navy-900 mb-2">3. Payments, Cancellations & Refunds</h2>
            <p>
              Consultation fees are paid via Paystack in Naira. If a doctor fails to attend a scheduled appointment, the patient is eligible for a full refund or free rescheduling within 24 hours.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
