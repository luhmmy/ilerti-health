"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Activity, Heart, Droplets, Utensils, Zap, Bell, Stethoscope, Search, FileHeart, Clock, Camera, Plus, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import { useHydrationStore } from "@/stores/useHydrationStore";
import { HydrationScannerModal } from "@/components/wellness/HydrationScannerModal";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [scannerOpen, setScannerOpen] = useState(false);
  const { currentIntakeMl, dailyGoalMl } = useHydrationStore();
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const progressPercent = Math.min(100, Math.round((currentIntakeMl / dailyGoalMl) * 100));
  const currentLitres = (currentIntakeMl / 1000).toFixed(1);
  const goalLitres = (dailyGoalMl / 1000).toFixed(1);

  const rawName = user?.name || user?.email?.split('@')[0] || 'Friend';
  const firstName = rawName.split(' ')[0] || 'Friend';
  
  const hour = new Date().getHours();
  const greetingTime = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

  useEffect(() => {
    async function loadData() {
      if (isAuthenticated) {
        try {
          setLoading(true);
          const res = await api.consultations.getMyConsultations();
          if (Array.isArray(res)) {
            setConsultations(res);
          }
        } catch (e) {
          // If none found, empty array
          setConsultations([]);
        } finally {
          setLoading(false);
        }
      }
    }
    loadData();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Dynamic Welcome Banner */}
          <div className="bg-[#1E3A5F] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
              <Heart className="w-56 h-56" />
            </div>
            <div className="z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300 block mb-1">
                Personal Health Portal
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold font-heading mb-2">
                Good {greetingTime}, {firstName}!
              </h1>
              <p className="text-slate-200 text-sm sm:text-base max-w-xl">
                Welcome to your ILERTI health companion. Track vitals, consult verified doctors, and maintain your lifelong wellness records.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 z-10 flex items-center gap-5">
              <div>
                <p className="text-slate-300 text-xs mb-0.5">Account Status</p>
                <p className="font-bold text-teal-300 text-sm capitalize">{user?.role || 'Patient'} • Active</p>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div>
                <p className="text-slate-300 text-xs mb-0.5">Blood Type</p>
                <p className="font-bold text-white text-sm">O+ (Default)</p>
              </div>
            </div>
          </div>

          {/* Preventive Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="bg-amber-100 p-2.5 rounded-xl text-amber-700 shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-amber-900 text-sm sm:text-base">Preventive Health Check Reminder</h3>
                <p className="text-amber-800 text-xs sm:text-sm mt-0.5">
                  Early detection saves lives. Schedule your routine blood pressure and glucose screening this month.
                </p>
              </div>
            </div>
            <Link 
              href="/doctors" 
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shrink-0 shadow-sm"
            >
              Book Checkup
            </Link>
          </div>

          {/* Quick Actions Grid */}
          <div>
            <h2 className="text-xl font-bold text-[#1E3A5F] mb-4 font-heading">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <Link href="/ai" className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group text-center">
                <div className="bg-teal-50 p-4 rounded-2xl text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="font-bold text-slate-800 text-sm">AI Symptom Triage</span>
              </Link>
              
              <Link href="/doctors" className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group text-center">
                <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <span className="font-bold text-slate-800 text-sm">Consult Doctor</span>
              </Link>
              
              <Link href="/facilities" className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group text-center">
                <div className="bg-rose-50 p-4 rounded-2xl text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-sm">
                  <Search className="w-6 h-6" />
                </div>
                <span className="font-bold text-slate-800 text-sm">Find Hospital</span>
              </Link>
              
              <Link href="/health/records" className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group text-center">
                <div className="bg-purple-50 p-4 rounded-2xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
                  <FileHeart className="w-6 h-6" />
                </div>
                <span className="font-bold text-slate-800 text-sm">Health Vault</span>
              </Link>
              
              <Link href="/wellness/nutrition" className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group text-center col-span-2 sm:col-span-1">
                <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                  <Utensils className="w-6 h-6" />
                </div>
                <span className="font-bold text-slate-800 text-sm">Meal Planner</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col - 2 spans */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Upcoming Consultations */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#1E3A5F] font-heading">Your Consultations</h2>
                  <Link href="/doctors" className="text-teal-600 font-bold text-xs hover:underline flex items-center gap-1">
                    Book New <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                
                {consultations.length > 0 ? (
                  <div className="space-y-4">
                    {consultations.map((c) => (
                      <div key={c.id} className="border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-slate-50">
                        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center min-w-[80px]">
                          <p className="text-xs font-bold text-slate-500 uppercase">TELEHEALTH</p>
                          <p className="text-lg font-bold text-teal-600">LIVE</p>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 text-base">{c.doctor?.user?.firstName ? `Dr. ${c.doctor.user.firstName} ${c.doctor.user.lastName}` : 'Telehealth Session'}</h3>
                          <p className="text-slate-600 text-xs">{c.type} Consultation • {c.status}</p>
                        </div>
                        <Link href={`/consultations/${c.id}`} className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-colors text-center">
                          Join Room
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
                    <Calendar className="mx-auto w-10 h-10 text-slate-300 mb-2" />
                    <h3 className="font-bold text-slate-700 text-sm">No scheduled consultations yet</h3>
                    <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
                      Connect with top MDCN verified doctors for instant chat or encrypted video calls.
                    </p>
                    <Link
                      href="/doctors"
                      className="inline-block mt-4 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
                    >
                      Find a Doctor
                    </Link>
                  </div>
                )}
              </div>

              {/* Personal Health Records Vault */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#1E3A5F] font-heading">Medical Records Vault</h2>
                  <Link href="/health/records" className="text-teal-600 font-bold text-xs hover:underline">
                    View Full Vault
                  </Link>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className="bg-teal-50 p-3 rounded-xl text-teal-600">
                        <FileHeart className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">Initial Health Profile Created</h4>
                        <p className="text-xs text-slate-400">Encrypted Cloud Storage • Active</p>
                      </div>
                    </div>
                    <Link href="/health/records" className="text-slate-400 hover:text-teal-600 text-xs font-semibold">
                      Open
                    </Link>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Col - 1 span */}
            <div className="space-y-8">
              {/* Daily Wellness Companion */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-[#1E3A5F] mb-6 flex items-center gap-2 font-heading">
                  <Zap className="w-5 h-5 text-amber-500" /> Daily Companion
                </h2>
                
                <div className="space-y-6">
                  {/* Hydration */}
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <p className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                        <Droplets className="w-4 h-4 text-blue-500" /> Hydration Goal
                      </p>
                      <span className="text-xs font-bold text-blue-600">{currentLitres}L / {goalLitres}L</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 mb-3 overflow-hidden">
                      <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <button
                      onClick={() => setScannerOpen(true)}
                      className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-blue-200 shadow-sm"
                    >
                      <Camera className="w-4 h-4 text-blue-600" />
                      Camera Water Scanner
                    </button>
                  </div>

                  {/* Nutrition Tip */}
                  <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-100">
                    <h4 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5 mb-1.5">
                      <Utensils className="w-4 h-4 text-emerald-600" /> Nigerian Healthy Nutrition
                    </h4>
                    <p className="text-emerald-800 text-xs leading-relaxed">
                      Try unripe plantain porridge or vegetable stew (Efo Riro) with grilled fish today for steady blood sugar and optimal digestion.
                    </p>
                  </div>

                  {/* Daily Step Tracker */}
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <p className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-teal-500" /> Movement Tracker
                      </p>
                      <span className="text-xs font-bold text-teal-600">Active</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <HydrationScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
      />
    </div>
  );
}
