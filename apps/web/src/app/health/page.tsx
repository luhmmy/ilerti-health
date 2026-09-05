"use client";

import Link from "next/link";
import { Shield, Clock, Pill, Bell, FileText, Activity } from "lucide-react";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";

export default function HealthPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1E3A5F]">Health Journey Vault</h1>
            <p className="text-gray-600 mt-2">Manage your lifelong health records and active treatments.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/health/records" className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-[#0D9488]">
            <div className="w-12 h-12 bg-[#CCFBF1] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-[#0D9488]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1E3A5F] mb-2">Health Records</h3>
            <p className="text-gray-600">Access your lab results, prescriptions, and medical imaging securely.</p>
          </Link>

          <Link href="/health/timeline" className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-[#0D9488]">
            <div className="w-12 h-12 bg-[#CCFBF1] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-[#0D9488]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1E3A5F] mb-2">Lifelong Timeline</h3>
            <p className="text-gray-600">View your entire health journey from triage to preventive care.</p>
          </Link>

          <Link href="/health/medications" className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-[#0D9488]">
            <div className="w-12 h-12 bg-[#CCFBF1] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Pill className="w-6 h-6 text-[#0D9488]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1E3A5F] mb-2">Active Medications</h3>
            <p className="text-gray-600">Track your daily pill schedule and set up refill alerts.</p>
          </Link>

          <Link href="/health/reminders" className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-[#0D9488]">
            <div className="w-12 h-12 bg-[#CCFBF1] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bell className="w-6 h-6 text-[#0D9488]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1E3A5F] mb-2">Screening Reminders</h3>
            <p className="text-gray-600">Get notified for age-appropriate health screenings and immunizations.</p>
          </Link>

          <div className="group p-6 bg-gradient-to-br from-[#1E3A5F] to-[#0D9488] rounded-2xl shadow-sm md:col-span-2 lg:col-span-2 flex flex-col justify-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Shield className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-3">Confidential & Secure</h3>
              <p className="text-white/80 max-w-md mb-6">Your health data is encrypted and securely stored. You have full control over what you share with doctors.</p>
              <Link href="/privacy" className="bg-white text-[#0D9488] px-6 py-2.5 rounded-lg font-medium hover:bg-[#CCFBF1] transition-colors inline-flex items-center gap-2 w-fit">
                <Shield className="w-4 h-4" /> Review Privacy Settings
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
