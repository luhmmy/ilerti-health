"use client";

import { Bell, Calendar, Plus, Settings } from "lucide-react";
import { Header } from "../../../components/layout/Header";
import { Footer } from "../../../components/layout/Footer";

export default function RemindersPage() {
  const reminders = [
    { id: 1, title: "Annual Comprehensive Health Check", date: "Due in 2 weeks", type: "General", priority: "high" },
    { id: 2, title: "Blood Pressure Monitoring", date: "Every Sunday at 9:00 AM", type: "Cardio", priority: "medium" },
    { id: 3, title: "Dental Checkup", date: "Nov 15, 2023", type: "Dental", priority: "low" },
    { id: 4, title: "Eye Examination", date: "Dec 05, 2023", type: "Vision", priority: "medium" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1E3A5F]">Screening Reminders</h1>
            <p className="text-gray-600 mt-2">Stay on top of your preventive health with automated reminders.</p>
          </div>
          <div className="flex gap-3">
            <button className="p-2.5 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 tooltip" title="Notification Settings">
              <Settings className="w-5 h-5" />
            </button>
            <button className="bg-[#0D9488] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#0f766e] transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> Custom Reminder
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {reminders.map(reminder => (
            <div key={reminder.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl flex-shrink-0 ${
                  reminder.priority === 'high' ? 'bg-red-100 text-red-600' : 
                  reminder.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 
                  'bg-blue-100 text-blue-600'
                }`}>
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{reminder.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {reminder.date}</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{reminder.type}</span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 border border-[#0D9488] text-[#0D9488] rounded-lg font-medium hover:bg-[#CCFBF1] transition-colors">
                Schedule Now
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-r from-[#1E3A5F] to-[#0D9488] rounded-2xl p-8 text-white">
          <h2 className="text-xl font-bold mb-2">Age-Appropriate Guidelines</h2>
          <p className="text-white/80 mb-6 max-w-2xl">Based on your profile, we've compiled a list of recommended health screenings by the World Health Organization and Nigerian Medical Association.</p>
          <button className="bg-white text-[#1E3A5F] px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            View Recommendations
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
