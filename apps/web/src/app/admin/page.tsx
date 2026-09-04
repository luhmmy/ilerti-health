"use client";

import Link from "next/link";
import { Users, UserCheck, Stethoscope, Banknote, BarChart3, ArrowRight, ShieldCheck, Activity } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { name: "Total Patients", value: "12,450", change: "+12%", icon: Users, color: "text-blue-500", bg: "bg-blue-100" },
    { name: "Verified Doctors", value: "342", change: "+4%", icon: UserCheck, color: "text-green-500", bg: "bg-green-100" },
    { name: "Completed Consultations", value: "8,921", change: "+18%", icon: Stethoscope, color: "text-purple-500", bg: "bg-purple-100" },
    { name: "Platform Revenue", value: "₦4.2M", change: "+8%", icon: Banknote, color: "text-amber-500", bg: "bg-amber-100" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1E3A5F]">Super Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Platform overview and management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.change}</span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.name}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#1E3A5F] mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link href="/admin/verification" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#0D9488] hover:bg-gray-50 transition-all group">
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-[#0D9488]">Doctor Verification Queue</h3>
                <p className="text-sm text-gray-500">12 applications pending review</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                12
              </div>
            </Link>
            
            <Link href="/admin/insights" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#0D9488] hover:bg-gray-50 transition-all group">
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-[#0D9488]">Public Health Insights</h3>
                <p className="text-sm text-gray-500">View epidemiological data & trends</p>
              </div>
              <BarChart3 className="w-6 h-6 text-gray-400 group-hover:text-[#0D9488]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
