"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  Droplet, 
  Heart, 
  Sun, 
  Moon, 
  Activity, 
  Flame, 
  Utensils, 
  Camera, 
  Scan, 
  CheckCircle2, 
  Sparkles, 
  History,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHydrationStore } from "@/stores/useHydrationStore";
import { HydrationScannerModal } from "@/components/wellness/HydrationScannerModal";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function WellnessPage() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const { currentIntakeMl, dailyGoalMl, glassesCount, logs, resetDailyIntake } = useHydrationStore();

  const progressPercent = Math.min(100, Math.round((currentIntakeMl / dailyGoalMl) * 100));
  const currentLitres = (currentIntakeMl / 1000).toFixed(1);
  const goalLitres = (dailyGoalMl / 1000).toFixed(1);

  return (
    <AuthGuard
      serviceName="Daily Wellness & Hydration Tracker"
      serviceDescription="To log daily water intake, track personalized Nigerian nutrition, and maintain streaks, please create an account or sign in."
    >
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy-900 flex items-center gap-2">
              ILERTI Wellness Companion
              <span className="text-xs bg-primary-100 text-primary-800 font-semibold px-2.5 py-1 rounded-full border border-primary-200">
                Daily Habits
              </span>
            </h1>
            <p className="text-navy-600 mt-1">
              Your personalized daily guide to healthy hydration, Nigerian nutrition, and lifestyle routines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/wellness/nutrition">
              <Button
                variant="outline"
                className="border-teal-300 text-teal-700 bg-teal-50 hover:bg-teal-100 flex items-center gap-2 rounded-xl py-5 px-4 font-bold text-xs"
              >
                <Utensils className="w-4 h-4 text-teal-600" />
                <span>Nigerian Meal Timetable &amp; Budget</span>
              </Button>
            </Link>

            <Button
              onClick={() => setScannerOpen(true)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 flex items-center gap-2 rounded-xl py-5 px-5 font-bold text-xs"
            >
              <Camera className="w-4 h-4 animate-pulse" />
              <span>Drink with Live Camera (Glass Cup)</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Left Section: Routine Timeline */}
          <div className="lg:col-span-2 space-y-8">
            {/* Daily Schedule */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-navy-900 mb-6 flex items-center gap-2">
                <Sun className="w-6 h-6 text-amber-500" /> Today's Routine & Habit Flow
              </h2>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                
                {/* 7:30 AM */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-primary-600 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-primary-200 bg-primary-50/70 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-navy-900">7:30 AM</h3>
                      <span className="text-xs font-medium text-primary-700 bg-white px-2 py-0.5 rounded-full shadow-sm">Done</span>
                    </div>
                    <p className="text-navy-700 text-sm">Breakfast & Hydration. Akara with Oats and Warm Lemon Water.</p>
                  </div>
                </div>

                {/* 10:00 AM - Interactive Scanner */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                    <Droplet className="w-4 h-4 animate-bounce" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-blue-200 bg-blue-50/60 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-blue-900">10:00 AM</h3>
                      <span className="text-xs font-semibold text-blue-600 bg-white px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <Camera className="w-3 h-3" /> Scanner Ready
                      </span>
                    </div>
                    <p className="text-blue-800 text-sm mb-3">Hydration Check. Confirm your intake with a live camera picture.</p>
                    <button
                      onClick={() => setScannerOpen(true)}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Scan className="w-3.5 h-3.5" />
                      Open Camera Scanner
                    </button>
                  </div>
                </div>

                {/* 4:00 PM */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-orange-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-navy-900">4:00 PM</h3>
                    </div>
                    <p className="text-navy-600 text-sm">Activity Break. 10-minute posture stretch & brisk walk.</p>
                  </div>
                </div>

                {/* 9:30 PM */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-navy-900">9:30 PM</h3>
                    </div>
                    <p className="text-navy-600 text-sm">Wind down. Digital screen off & 1 cup chamomile or warm water.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Verified Hydration Activity Feed */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-500" /> Verified Hydration Logs Today
                </h3>
                <span className="text-xs text-navy-500">{logs.length} scan records</span>
              </div>

              <div className="space-y-3">
                {logs.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">No water intake logged yet today. Use the scanner to record your first glass!</p>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-blue-50/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                          <Droplet className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-navy-900">{log.itemType}</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> {log.confidence}% verified
                            </span>
                          </div>
                          <p className="text-xs text-navy-500">{log.timestamp} • Camera Image Analysis</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-blue-600 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-sm">
                        +{log.volumeMl}ml
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Widgets */}
          <div className="space-y-6">
            
            {/* Wellness Score */}
            <div className="bg-gradient-to-br from-navy-900 to-primary-700 rounded-2xl p-6 text-white shadow-md">
              <h3 className="text-lg font-semibold mb-2">Wellness Score</h3>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-5xl font-bold">{Math.min(98, 75 + Math.round(progressPercent / 5))}</span>
                <span className="text-white/70 mb-1">/100</span>
              </div>
              <p className="text-sm text-white/90 flex items-center gap-1.5 bg-white/10 p-2 rounded-xl border border-white/10">
                <Flame className="w-4 h-4 text-orange-400" /> 7-Day Hydration Streak! Keep going.
              </p>
            </div>

            {/* Live Water Tracker Box */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-navy-900 flex items-center gap-1.5">
                  <Droplet className="w-5 h-5 text-blue-500" /> Daily Hydration
                </h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  {glassesCount} / 10 glasses
                </span>
              </div>

              <div className="flex justify-between items-end mb-2">
                <span className="text-3xl font-extrabold text-navy-900">
                  {currentLitres}L <span className="text-sm font-normal text-navy-400">/ {goalLitres}L Target</span>
                </span>
                <span className="text-sm font-bold text-primary-600">{progressPercent}%</span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <Button
                onClick={() => setScannerOpen(true)}
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Scan Glass / Water Intake
              </Button>
            </div>

            {/* Quick Navigation Links */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-navy-900 mb-4">Wellness Modules</h3>
              <div className="space-y-3">
                <Link href="/wellness/nutrition" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Utensils className="w-5 h-5" /></div>
                  <div>
                    <div className="font-bold text-navy-900 text-sm">Nigerian Nutrition Plans</div>
                    <p className="text-xs text-navy-500">Akara, Moi-Moi, Efo Riro & Macro charts</p>
                  </div>
                </Link>
                <Link href="/wellness/plans" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Heart className="w-5 h-5" /></div>
                  <div>
                    <div className="font-bold text-navy-900 text-sm">Clinician Health Plans</div>
                    <p className="text-xs text-navy-500">Diabetes, Heart Health & Maternal Care</p>
                  </div>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Camera Hydration Scanner Modal */}
      <HydrationScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
      />

      <Footer />
      </div>
    </AuthGuard>
  );
}

