"use client";

import { useState } from "react";
import { Pill, Clock, AlertCircle, CheckCircle2, Circle } from "lucide-react";
import { Header } from "../../../components/layout/Header";
import { Footer } from "../../../components/layout/Footer";

export default function MedicationsPage() {
  const [taken, setTaken] = useState<Record<string, boolean>>({ "1-morning": true });

  const toggleTaken = (id: string) => {
    setTaken(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const schedules = [
    {
      time: "Morning (8:00 AM)",
      icon: "🌅",
      meds: [
        { id: "1-morning", name: "Lisinopril", dose: "10mg", instruction: "Take with food", type: "Blood Pressure" },
        { id: "2-morning", name: "Vitamin D3", dose: "1000 IU", instruction: "Take after breakfast", type: "Supplement" }
      ]
    },
    {
      time: "Night (8:00 PM)",
      icon: "🌙",
      meds: [
        { id: "3-night", name: "Atorvastatin", dose: "20mg", instruction: "Take before bed", type: "Cholesterol" }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1E3A5F]">Active Medications</h1>
            <p className="text-gray-600 mt-2">Track your daily pill schedule and adherence.</p>
          </div>
          <button className="bg-[#0D9488] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#0f766e] transition-colors flex items-center gap-2">
            <Pill className="w-4 h-4" /> Add Medication
          </button>
        </div>

        <div className="grid gap-8">
          {schedules.map((schedule, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                <span className="text-2xl">{schedule.icon}</span>
                <h2 className="text-xl font-semibold text-[#1E3A5F]">{schedule.time}</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {schedule.meds.map(med => (
                  <div key={med.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-4 items-start">
                      <div className="p-3 bg-[#CCFBF1] text-[#0D9488] rounded-xl">
                        <Pill className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{med.name} <span className="text-sm font-normal text-gray-500 ml-2">{med.dose}</span></h3>
                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4 text-amber-500" /> {med.instruction}
                        </p>
                        <span className="inline-block mt-2 text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {med.type}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleTaken(med.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto justify-center ${taken[med.id] ? 'bg-[#4ADE80]/10 text-green-700 hover:bg-[#4ADE80]/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {taken[med.id] ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      {taken[med.id] ? 'Taken' : 'Mark as Taken'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-amber-50 rounded-2xl p-6 border border-amber-100 flex items-start gap-4">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-amber-900">Refill Alert</h3>
            <p className="text-amber-800 mt-1">Your <strong>Atorvastatin</strong> prescription will run out in 5 days. Would you like to request a refill from Dr. Adebayo?</p>
            <button className="mt-3 bg-white text-amber-700 px-4 py-2 rounded-lg text-sm font-medium border border-amber-200 hover:bg-amber-50">
              Request Refill
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
