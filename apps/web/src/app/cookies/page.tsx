"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Cookie } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <section className="pt-20 pb-12 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Cookie className="w-4 h-4" /> Cookies & Local Storage
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-navy-900">
            Cookie Policy
          </h1>
          <p className="text-xs text-navy-500 mt-2">Last Updated: September 2026</p>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-navy-800 text-sm leading-relaxed">
          <p>
            ILERTI Health uses essential cookies and local storage tokens to maintain your secure authenticated session, remember your vitals preferences, and ensure seamless navigation.
          </p>
          <div>
            <h2 className="text-base font-bold text-navy-900 mb-2">1. Essential Cookies</h2>
            <p className="text-xs text-navy-600">Necessary for authentication tokens, CSRF protection, and session security.</p>
          </div>
          <div>
            <h2 className="text-base font-bold text-navy-900 mb-2">2. Preference Storage</h2>
            <p className="text-xs text-navy-600">Remembers your blood group and hydration tracker settings in your local browser.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
