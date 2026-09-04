"use client";

import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-[#1E3A5F] mb-4">Affordable Health for Every Nigerian</h1>
        <p className="text-lg text-gray-600">Choose the plan that best fits your healthcare needs. Transparent pricing, no hidden fees.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">ILERTI Free</h3>
          <p className="text-gray-500 mb-6 min-h-[48px]">Essential digital health tools accessible to everyone.</p>
          <div className="mb-6">
            <span className="text-4xl font-extrabold text-gray-900">₦0</span>
            <span className="text-gray-500">/month</span>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#4ADE80] shrink-0" /> <span className="text-gray-600">Basic AI Symptom Checker</span></li>
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#4ADE80] shrink-0" /> <span className="text-gray-600">Access to Public Health Info</span></li>
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#4ADE80] shrink-0" /> <span className="text-gray-600">Community Event Registration</span></li>
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#4ADE80] shrink-0" /> <span className="text-gray-600">Standard Booking Fees apply</span></li>
          </ul>
          <button className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors">
            Get Started Free
          </button>
        </div>

        {/* Plus Plan */}
        <div className="bg-[#1E3A5F] rounded-3xl p-8 border border-[#1E3A5F] shadow-xl relative transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#4ADE80] text-[#1E3A5F] px-4 py-1 rounded-full text-sm font-bold shadow-sm">
            Most Popular
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">ILERTI Plus</h3>
          <p className="text-blue-200 mb-6 min-h-[48px]">Complete care ecosystem with premium support.</p>
          <div className="mb-6 text-white">
            <span className="text-4xl font-extrabold">₦3,500</span>
            <span className="text-blue-200">/month</span>
          </div>
          <ul className="space-y-4 mb-8 text-white">
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#4ADE80] shrink-0" /> <span>Unlimited AI Triage</span></li>
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#4ADE80] shrink-0" /> <span>1 Free Virtual Consultation/Quarter</span></li>
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#4ADE80] shrink-0" /> <span>Health Vault Cloud Backup</span></li>
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#4ADE80] shrink-0" /> <span>Personalized Nutrition Planner</span></li>
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#4ADE80] shrink-0" /> <span>Daily Wellness Companion</span></li>
          </ul>
          <button className="w-full py-3 rounded-xl bg-[#0D9488] text-white font-bold hover:bg-[#0f766e] transition-colors shadow-md">
            Subscribe Now
          </button>
        </div>

        {/* Enterprise */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm md:col-span-2 lg:col-span-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Corporate & Edu</h3>
          <p className="text-gray-500 mb-6 min-h-[48px]">Tailored wellness solutions for companies and universities.</p>
          <div className="mb-6">
            <span className="text-4xl font-extrabold text-gray-900">Custom</span>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#4ADE80] shrink-0" /> <span className="text-gray-600">Bulk Employee Subscriptions</span></li>
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#4ADE80] shrink-0" /> <span className="text-gray-600">Student Reproductive Health</span></li>
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#4ADE80] shrink-0" /> <span className="text-gray-600">Dedicated Account Manager</span></li>
            <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#4ADE80] shrink-0" /> <span className="text-gray-600">Custom Reporting Dashboard</span></li>
          </ul>
          <button className="w-full py-3 rounded-xl border-2 border-[#1E3A5F] text-[#1E3A5F] font-bold hover:bg-gray-50 transition-colors">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
}
