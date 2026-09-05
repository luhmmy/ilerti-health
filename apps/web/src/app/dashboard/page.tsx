"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  Activity, Heart, Droplets, Utensils, Zap, Bell, Stethoscope, Search, 
  FileHeart, Clock, Camera, Plus, Calendar, ArrowRight, Edit3, RotateCcw, Target, ShieldCheck 
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import { useHydrationStore } from "@/stores/useHydrationStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { HydrationScannerModal } from "@/components/wellness/HydrationScannerModal";
import { EditVitalsModal } from "@/components/profile/EditVitalsModal";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const profile = useProfileStore();
  const { currentIntakeMl, dailyGoalMl, addIntake, resetDailyIntake, setDailyGoal } = useHydrationStore();
  
  const [scannerOpen, setScannerOpen] = useState(false);
  const [vitalsModalOpen, setVitalsModalOpen] = useState(false);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [editingGoal, setEditingGoal] = useState(false);

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
          const res = await api.consultations.getMyConsultations();
          if (Array.isArray(res)) {
            setConsultations(res);
          }
        } catch {
          setConsultations([]);
        }
      }
    }
    loadData();
  }, [isAuthenticated]);

  const handleQuickWater = (ml: number) => {
    addIntake(ml);
    toast.success(`Logged +${ml}ml water intake!`);
  };

  return (
    <AuthGuard 
      serviceName="Personal Health Dashboard"
      serviceDescription="To protect your personal vitals, emergency contacts, hydration records, and consultations, please sign in or create an account."
    >
      <div className="min-h-screen bg-stone-50 flex flex-col">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Doctor Portal Quick Switch Banner (If Doctor) */}
          {user?.role === "doctor" && (
            <div className="bg-teal-900 text-white p-4 sm:p-5 rounded-2xl border border-teal-500/40 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-[#4ADE80] border border-teal-400/30 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">MDCN Practitioner Account Active</h3>
                  <p className="text-xs text-teal-200">Switch to the specialized Doctor Portal to manage your waiting room, consult queue, and e-prescriptions.</p>
                </div>
              </div>
              <Button asChild className="bg-[#0D9488] hover:bg-[#0f766e] text-white text-xs font-bold px-5 py-2.5 rounded-xl shrink-0">
                <Link href="/doctor-portal">
                  Open Doctor Portal <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>
          )}

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

            {/* Profile & Vitals Pill */}
            <div 
              onClick={() => setVitalsModalOpen(true)}
              className="bg-white/10 hover:bg-white/15 cursor-pointer transition-all backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 z-10 flex items-center gap-5 group"
              title="Click to edit your Blood Group and Vitals"
            >
              <div>
                <p className="text-slate-300 text-xs mb-0.5">Account Role</p>
                <p className="font-bold text-teal-300 text-sm capitalize">{user?.role || 'Patient'} • Active</p>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-slate-300 text-xs">Blood Group</p>
                  <Edit3 className="w-3 h-3 text-teal-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="font-bold text-white text-sm">
                  {profile.bloodGroup === 'Not Set' ? 'Set Blood Type' : profile.bloodGroup}
                </p>
              </div>
            </div>
          </div>

          {/* Vitals Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div 
              onClick={() => setVitalsModalOpen(true)}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-teal-500 transition-all flex items-center justify-between"
            >
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Blood Group</span>
                <p className="text-xl font-bold text-rose-600 mt-0.5">
                  {profile.bloodGroup === 'Not Set' ? 'Tap to Set' : profile.bloodGroup}
                </p>
              </div>
              <Edit3 className="w-4 h-4 text-slate-300" />
            </div>

            <div 
              onClick={() => setVitalsModalOpen(true)}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-teal-500 transition-all flex items-center justify-between"
            >
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Genotype</span>
                <p className="text-xl font-bold text-teal-700 mt-0.5">
                  {profile.genotype === 'Not Set' ? 'Tap to Set' : profile.genotype}
                </p>
              </div>
              <Edit3 className="w-4 h-4 text-slate-300" />
            </div>

            <div 
              onClick={() => setVitalsModalOpen(true)}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-teal-500 transition-all flex items-center justify-between"
            >
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Weight / Height</span>
                <p className="text-sm font-bold text-slate-800 mt-1">
                  {profile.weightKg ? `${profile.weightKg} kg` : '--'} • {profile.heightCm ? `${profile.heightCm} cm` : '--'}
                </p>
              </div>
              <Edit3 className="w-4 h-4 text-slate-300" />
            </div>

            <div 
              onClick={() => setVitalsModalOpen(true)}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-teal-500 transition-all flex items-center justify-between"
            >
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Known Allergies</span>
                <p className="text-xs font-bold text-amber-700 mt-1 truncate max-w-[120px]">
                  {profile.allergies.length > 0 ? profile.allergies.join(', ') : 'None Recorded'}
                </p>
              </div>
              <Edit3 className="w-4 h-4 text-slate-300" />
            </div>
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
              
              {/* Consultations */}
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
                          <h3 className="font-bold text-slate-900 text-base">
                            {c.doctor?.user?.firstName ? `Dr. ${c.doctor.user.firstName} ${c.doctor.user.lastName}` : 'Telehealth Session'}
                          </h3>
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
                      Connect with top MDCN verified doctors across Nigeria for instant chat or encrypted video calls.
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
                
                <div className="p-5 bg-teal-50/50 rounded-2xl border border-teal-100 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="bg-teal-100 p-3 rounded-xl text-teal-700">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Personal Encrypted Vault Active</h4>
                      <p className="text-xs text-slate-500">Store lab results, imaging scans, and prescriptions securely.</p>
                    </div>
                  </div>
                  <Link
                    href="/health/records"
                    className="text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-2 rounded-xl transition-colors shrink-0"
                  >
                    Upload Record
                  </Link>
                </div>
              </div>

            </div>

            {/* Right Col - 1 span: Customizable Hydration & Wellness */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-[#1E3A5F] flex items-center gap-2 font-heading">
                    <Zap className="w-5 h-5 text-amber-500" /> Daily Hydration
                  </h2>
                  <button
                    onClick={() => setEditingGoal(!editingGoal)}
                    className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1"
                  >
                    <Target className="w-3.5 h-3.5" />
                    {editingGoal ? "Done" : "Set Goal"}
                  </button>
                </div>
                
                {/* Goal Selector */}
                {editingGoal && (
                  <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200 animate-in fade-in space-y-2">
                    <span className="text-[11px] font-bold text-blue-900 block">Choose Your Daily Target:</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[1500, 2000, 2500, 3000, 3500, 4000].map((ml) => (
                        <button
                          key={ml}
                          onClick={() => {
                            setDailyGoal(ml);
                            toast.success(`Target updated to ${(ml / 1000).toFixed(1)} Litres/day`);
                            setEditingGoal(false);
                          }}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                            dailyGoalMl === ml
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-white text-blue-800 hover:bg-blue-100 border border-blue-200"
                          }`}
                        >
                          {(ml / 1000).toFixed(1)}L
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hydration Progress */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <p className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                      <Droplets className="w-4 h-4 text-blue-500" /> Today's Intake
                    </p>
                    <span className="text-xs font-bold text-blue-600">{currentLitres}L / {goalLitres}L ({progressPercent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 mb-3 overflow-hidden">
                    <div className="bg-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                  </div>

                  {/* Quick Intake Buttons */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <button
                      onClick={() => handleQuickWater(250)}
                      className="py-2 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-700 rounded-xl text-xs font-bold transition-colors"
                    >
                      +250ml
                    </button>
                    <button
                      onClick={() => handleQuickWater(500)}
                      className="py-2 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-700 rounded-xl text-xs font-bold transition-colors"
                    >
                      +500ml
                    </button>
                    <button
                      onClick={() => handleQuickWater(750)}
                      className="py-2 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-700 rounded-xl text-xs font-bold transition-colors"
                    >
                      +750ml
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setScannerOpen(true)}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Camera className="w-4 h-4" />
                      Camera Water Scanner
                    </button>
                    <button
                      onClick={() => {
                        resetDailyIntake();
                        toast.info("Daily water intake reset to 0L.");
                      }}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-xl transition-colors"
                      title="Reset Today's Water Count"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
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

        <EditVitalsModal
          isOpen={vitalsModalOpen}
          onClose={() => setVitalsModalOpen(false)}
        />
      </div>
    </AuthGuard>
  );
}
