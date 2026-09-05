"use client";

import { useState } from "react";
import { FileText, Download, Share2, Upload, Lock, Shield, Search, Filter } from "lucide-react";
import { Header } from "../../../components/layout/Header";
import { Footer } from "../../../components/layout/Footer";

export default function RecordsPage() {
  const [activeTab, setActiveTab] = useState("All");
  
  const tabs = ["All", "Lab Results", "Prescriptions", "Doctor Notes", "Scans", "Vaccinations"];
  
  const records = [
    { id: 1, title: "Comprehensive Blood Panel", type: "Lab Results", date: "Oct 12, 2023", doctor: "Dr. Adebayo", confidential: true },
    { id: 2, title: "Amoxicillin Prescription", type: "Prescriptions", date: "Sep 28, 2023", doctor: "Dr. Okoro", confidential: false },
    { id: 3, title: "Chest X-Ray", type: "Scans", date: "Aug 15, 2023", doctor: "Mainland Hospital", confidential: false },
    { id: 4, title: "Consultation Notes - Hypertension", type: "Doctor Notes", date: "Aug 02, 2023", doctor: "Dr. Adebayo", confidential: true },
    { id: 5, title: "COVID-19 Booster", type: "Vaccinations", date: "Jan 10, 2023", doctor: "NCDC Clinic", confidential: false },
  ];

  const filteredRecords = activeTab === "All" ? records : records.filter(r => r.type === activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1E3A5F]">Personal Health Records</h1>
            <p className="text-gray-600 mt-2">Securely store, view, and share your medical history.</p>
          </div>
          <button className="bg-[#0D9488] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#0f766e] transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload Document
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
              {tabs.map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-[#1E3A5F] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search records..." 
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488]"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredRecords.map(record => (
              <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${record.confidential ? 'bg-amber-100 text-amber-600' : 'bg-[#CCFBF1] text-[#0D9488]'}`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{record.title}</h3>
                      {record.confidential && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          <Lock className="w-3 h-3" /> Confidential
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{record.type}</span>
                      <span>{record.date}</span>
                      <span>•</span>
                      <span>{record.doctor}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:ml-auto">
                  <button className="p-2 text-gray-400 hover:text-[#0D9488] hover:bg-[#CCFBF1] rounded-lg transition-colors tooltip" title="Download">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-[#0D9488] hover:bg-[#CCFBF1] rounded-lg transition-colors tooltip" title="Share">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {filteredRecords.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p>No records found for {activeTab}.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
