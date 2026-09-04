"use client";

import { Activity, Stethoscope, Pill, CheckCircle2, ShieldAlert } from "lucide-react";

export default function TimelinePage() {
  const timelineEvents = [
    {
      id: 1,
      date: "Today, 10:30 AM",
      type: "wellness",
      title: "Daily Wellness Check-in",
      description: "Completed hydration and sleep log. Feeling energized.",
      icon: <CheckCircle2 className="w-5 h-5 text-[#4ADE80]" />,
      color: "bg-[#4ADE80]/10 border-[#4ADE80]"
    },
    {
      id: 2,
      date: "Oct 12, 2023",
      type: "consultation",
      title: "Follow-up Virtual Consultation",
      description: "Dr. Adebayo reviewed recent lab results and adjusted medication dosage.",
      icon: <Stethoscope className="w-5 h-5 text-[#0D9488]" />,
      color: "bg-[#0D9488]/10 border-[#0D9488]"
    },
    {
      id: 3,
      date: "Oct 10, 2023",
      type: "lab",
      title: "Comprehensive Blood Panel",
      description: "Results received. Cholesterol levels improved since last check.",
      icon: <Activity className="w-5 h-5 text-blue-500" />,
      color: "bg-blue-500/10 border-blue-500"
    },
    {
      id: 4,
      date: "Sep 28, 2023",
      type: "prescription",
      title: "New Prescription",
      description: "Amoxicillin 500mg prescribed for 7 days.",
      icon: <Pill className="w-5 h-5 text-purple-500" />,
      color: "bg-purple-500/10 border-purple-500"
    },
    {
      id: 5,
      date: "Sep 27, 2023",
      type: "triage",
      title: "AI Triage Assessment",
      description: "Reported symptoms of fever and sore throat. Recommended to consult a GP.",
      icon: <ShieldAlert className="w-5 h-5 text-amber-500" />,
      color: "bg-amber-500/10 border-amber-500"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1E3A5F]">Lifelong Health Timeline</h1>
        <p className="text-gray-600 mt-2">Your complete health journey, seamlessly connected.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
        <div className="relative border-l-2 border-gray-200 ml-4 md:ml-6 space-y-10">
          {timelineEvents.map((event) => (
            <div key={event.id} className="relative pl-8 md:pl-10">
              <div className={`absolute -left-[21px] top-1 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center ${event.color}`}>
                {event.icon}
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 mb-1 block">{event.date}</span>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h3 className="text-lg font-bold text-[#1E3A5F] mb-2">{event.title}</h3>
                  <p className="text-gray-600">{event.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
