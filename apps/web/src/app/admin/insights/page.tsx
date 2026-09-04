"use client";

import { BarChart3, Download, Map, TrendingUp } from "lucide-react";

export default function InsightsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1E3A5F]">Public Health Insights</h1>
          <p className="text-gray-600 mt-2">Disease surveillance and population health patterns.</p>
        </div>
        <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#0D9488]" /> Symptom Trends (Last 30 Days)
            </h2>
            <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
              <option>All Regions</option>
              <option>South West</option>
              <option>North Central</option>
            </select>
          </div>
          <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center border border-dashed border-gray-200">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Chart Visualization Area (Malaria vs Typhoid Trends)</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Map className="w-5 h-5 text-[#0D9488]" /> Regional Alerts
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-amber-900">Cholera Spike</h3>
                <span className="text-xs font-bold text-amber-600 bg-amber-200/50 px-2 py-0.5 rounded">High</span>
              </div>
              <p className="text-sm text-amber-800">15% increase in reported symptoms in Kano State over the last 48 hours.</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-blue-900">Malaria Season</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-200/50 px-2 py-0.5 rounded">Expected</span>
              </div>
              <p className="text-sm text-blue-800">Steady baseline in Southern regions correlating with rainy season onset.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
