"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Activity, Calendar as CalendarIcon, FileText, Heart, ShieldAlert, Droplets, Utensils, Zap, Bell, Stethoscope, Search, FileHeart, Clock, Camera, Scan } from "lucide-react";
import Link from "next/link";
import { useHydrationStore } from "@/stores/useHydrationStore";
import { HydrationScannerModal } from "@/components/wellness/HydrationScannerModal";

export default function DashboardPage() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const { currentIntakeMl, dailyGoalMl } = useHydrationStore();
  const progressPercent = Math.min(100, Math.round((currentIntakeMl / dailyGoalMl) * 100));
  const currentLitres = (currentIntakeMl / 1000).toFixed(1);
  const goalLitres = (dailyGoalMl / 1000).toFixed(1);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Header />
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-navy-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Heart className="w-48 h-48" />
          </div>
          <div className="z-10">
            <h1 className="text-3xl font-bold mb-2">Good afternoon, Adebayo!</h1>
            <p className="text-slate-300">Your health score is looking good. Keep up the great work.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 z-10 flex items-center gap-4">
            <div>
              <p className="text-slate-300 text-sm mb-1">Last check-up</p>
              <p className="font-semibold">Aug 12, 2026</p>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div>
              <p className="text-slate-300 text-sm mb-1">Blood Type</p>
              <p className="font-semibold">O+</p>
            </div>
          </div>
        </div>

        {/* Preventive Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-4">
          <div className="bg-amber-100 p-2 rounded-full text-amber-600 shrink-0 mt-0.5">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-amber-800">Preventive Health Alert</h3>
            <p className="text-amber-700 text-sm mt-1">You are due for your routine blood pressure check this month. Early detection saves lives.</p>
          </div>
          <button className="ml-auto bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shrink-0">
            Book Now
          </button>
        </div>

        {/* Quick Actions Grid */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <Link href="/ai" className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group text-center">
              <div className="bg-teal-50 p-4 rounded-full text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Activity className="w-6 h-6" />
              </div>
              <span className="font-medium text-slate-700 text-sm">Start AI Triage</span>
            </Link>
            
            <Link href="/doctors" className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group text-center">
              <div className="bg-blue-50 p-4 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="font-medium text-slate-700 text-sm">Consult Doctor</span>
            </Link>
            
            <Link href="/facilities" className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group text-center">
              <div className="bg-rose-50 p-4 rounded-full text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <Search className="w-6 h-6" />
              </div>
              <span className="font-medium text-slate-700 text-sm">Find Hospital</span>
            </Link>
            
            <Link href="/dashboard" className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group text-center">
              <div className="bg-purple-50 p-4 rounded-full text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <FileHeart className="w-6 h-6" />
              </div>
              <span className="font-medium text-slate-700 text-sm">Log Vitals</span>
            </Link>
            
            <Link href="/dashboard" className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group text-center">
              <div className="bg-emerald-50 p-4 rounded-full text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <span className="font-medium text-slate-700 text-sm">My Vault</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Col - 2 spans */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Upcoming Consultations</h2>
                <button className="text-teal-600 font-medium text-sm hover:underline">View All</button>
              </div>
              
              <div className="border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-slate-50">
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-center min-w-[80px]">
                  <p className="text-xs font-bold text-slate-500 uppercase">SEP</p>
                  <p className="text-2xl font-bold text-teal-600">08</p>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg">Dr. Chinedu Okafor</h3>
                  <p className="text-slate-600 text-sm">Cardiology • Video Consultation</p>
                  <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> 10:00 AM - 10:30 AM
                  </p>
                </div>
                <button className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
                  Join Call
                </button>
              </div>
            </div>

            {/* Recent Health Records */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Recent Records</h2>
                <button className="text-teal-600 font-medium text-sm hover:underline">Go to Vault</button>
              </div>
              
              <div className="space-y-4">
                {[
                  { title: "Prescription: Antimalarial", date: "Aug 12, 2026", doctor: "Dr. F. Adeleke" },
                  { title: "Lab Result: Complete Blood Count", date: "Jul 24, 2026", doctor: "MeCure Labs" },
                ].map((record, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{record.title}</h4>
                        <p className="text-xs text-slate-500">{record.date} • {record.doctor}</p>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-teal-600">
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Col - 1 span */}
          <div className="space-y-8">
            {/* Wellness Companion Widget */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" /> Daily Wellness
              </h2>
              
              <div className="space-y-6">
                {/* Hydration */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <p className="font-semibold text-slate-700 flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-500" /> Hydration
                    </p>
                    <span className="text-sm font-bold text-blue-600">{currentLitres}L / {goalLitres}L</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 mb-3 overflow-hidden">
                    <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                  <button
                    onClick={() => setScannerOpen(true)}
                    className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-blue-200 shadow-sm"
                  >
                    <Camera className="w-3.5 h-3.5 text-blue-600" />
                    Scan Glass / Confirm Intake
                  </button>
                </div>

                {/* Nutrition */}
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <h4 className="font-semibold text-orange-800 flex items-center gap-2 mb-2">
                    <Utensils className="w-4 h-4" /> Healthy Nigerian Diet
                  </h4>
                  <p className="text-orange-700 text-sm">Swap regular swallow for wheat or plantain fufu today. Add plenty of efo riro (spinach) to boost iron!</p>
                </div>

                {/* Activity */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <p className="font-semibold text-slate-700 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-500" /> Daily Steps
                    </p>
                    <span className="text-sm font-bold text-emerald-600">4,320 / 10,000</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '43%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <HydrationScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
      />
    </div>
  );
}
