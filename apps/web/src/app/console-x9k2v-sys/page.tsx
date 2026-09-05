"use client";

import Link from "next/link";
import { Users, UserCheck, Stethoscope, Banknote, BarChart3, ShieldAlert, ArrowRight, ShieldCheck, Activity, Lock, AlertTriangle } from "lucide-react";
import { useAdminManagementStore } from "@/stores/useAdminManagementStore";

export default function SecretAdminDashboard() {
  const users = useAdminManagementStore((state) => state.users);
  
  const totalPatients = users.filter(u => u.role === 'patient').length;
  const totalDoctors = users.filter(u => u.role === 'doctor').length;
  const suspendedCount = users.filter(u => u.status === 'suspended').length;
  const bannedCount = users.filter(u => u.status === 'banned').length;

  const stats = [
    { name: "Total Users", value: `${users.length} Records`, change: "+14%", icon: Users, color: "text-blue-500", bg: "bg-blue-100" },
    { name: "Verified Doctors", value: `${totalDoctors} Doctors`, change: "+6%", icon: UserCheck, color: "text-green-500", bg: "bg-green-100" },
    { name: "Suspended Accounts", value: `${suspendedCount} Suspended`, change: "Review required", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-100" },
    { name: "Banned Users", value: `${bannedCount} Banned`, change: "Enforced", icon: ShieldAlert, color: "text-red-500", bg: "bg-red-100" }
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono bg-navy-100 text-[#1E3A5F] px-2.5 py-1 rounded-md mb-2">
            <Lock className="w-3 h-3 text-[#0D9488]" /> High Security Tier • 2FA Active
          </div>
          <h1 className="text-3xl font-extrabold text-[#1E3A5F]">Super Admin Control Console</h1>
          <p className="text-gray-600 mt-1">Platform-wide user moderation, doctor verification, and disease surveillance.</p>
        </div>
        <Link
          href="/console-x9k2v-sys/users"
          className="px-5 py-2.5 bg-[#0D9488] text-white font-bold rounded-xl hover:bg-[#0f766e] transition-colors shadow-md flex items-center gap-2 text-sm"
        >
          <Users className="w-4 h-4" /> Manage User Directory
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">{stat.change}</span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.name}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Management Hub */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-[#1E3A5F] mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0D9488]" /> User & Doctor Moderation
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Search all registered accounts across Nigeria. Instantly ban abusive accounts or apply timed suspensions with documented reasons.
          </p>
          <div className="space-y-3">
            <Link
              href="/console-x9k2v-sys/users"
              className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#0D9488] hover:bg-gray-50 transition-all group"
            >
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-[#0D9488]">All Users Directory (Patients & Doctors)</h3>
                <p className="text-xs text-gray-500">View, ban, suspend, or change permissions</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#0D9488] group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/console-x9k2v-sys/verification"
              className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#0D9488] hover:bg-gray-50 transition-all group"
            >
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-[#0D9488]">MDCN Doctor Verification Queue</h3>
                <p className="text-xs text-gray-500">Review practicing licenses and hospital credentials</p>
              </div>
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                3
              </div>
            </Link>
          </div>
        </div>

        {/* Public Health Surveillance */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-[#1E3A5F] mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#0D9488]" /> Public Health Intelligence
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Real-time disease trend surveillance from nationwide AI triage logs.
          </p>
          <div className="space-y-3">
            <Link
              href="/console-x9k2v-sys/insights"
              className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#0D9488] hover:bg-gray-50 transition-all group"
            >
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-[#0D9488]">Symptom Trends & Outbreak Alerts</h3>
                <p className="text-xs text-gray-500">Regional malaria, cholera, and respiratory infection alerts</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#0D9488] group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/console-x9k2v-sys/security"
              className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#0D9488] hover:bg-gray-50 transition-all group"
            >
              <div>
                <h3 className="font-bold text-gray-900 group-hover:text-[#0D9488]">Security & 2FA Audit Logs</h3>
                <p className="text-xs text-gray-500">Review administrator login history and session keys</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#0D9488] group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
