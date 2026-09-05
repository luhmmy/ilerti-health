"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <section className="pt-20 pb-12 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" /> NDPR & NDPA 2023 Compliance
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-navy-900">
            Privacy Policy & Health Data Protection
          </h1>
          <p className="text-xs text-navy-500 mt-2">Effective Date: January 1, 2026 • Last Updated: September 2026</p>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-8 text-navy-800 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-navy-900 mb-2">1. Overview & Commitment to Privacy</h2>
            <p>
              ILERTI Health (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to safeguarding the privacy, confidentiality, and security of your personal and medical information. This policy governs data collected through the ILERTI platform in compliance with the <strong>Nigeria Data Protection Act (NDPA 2023)</strong> and the <strong>Nigeria Data Protection Regulation (NDPR)</strong>.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-navy-900 mb-2">2. Health Data We Collect</h2>
            <ul className="list-disc list-inside space-y-1 text-navy-700">
              <li><strong>Personal Identifiers:</strong> Name, phone number, email address, residential address, and state.</li>
              <li><strong>Biological & Health Profile:</strong> Blood group, genotype, height, weight (BMI), allergies, and emergency contacts.</li>
              <li><strong>Clinical Interaction Data:</strong> AI triage inputs, consultation notes, e-prescriptions, and uploaded lab results.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-navy-900 mb-2">3. How We Use & Protect Your Information</h2>
            <p>
              Your medical data is used exclusively to facilitate healthcare services, match you with certified physicians, and store your personal health records. We never sell, monetize, or disclose your private health records to third-party advertisers.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-navy-900 mb-2">4. Data Encryption & Security</h2>
            <p>
              All communication between your device and ILERTI is encrypted using industry-standard TLS 1.3 encryption. Health records stored in your vault are protected by enterprise-grade PostgreSQL security protocols.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-navy-900 mb-2">5. Your Rights as a Data Subject</h2>
            <p>
              Under the NDPA 2023, you have the right to access, rectify, or request the deletion of your personal data at any time through your Profile settings or by emailing <strong>privacy@ilertihealth.site</strong>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
