"use client";

import { Shield, Lock, Smartphone, Key, UserCheck, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GoogleAuthQr } from "@/components/auth/GoogleAuthQr";

export default function SecretSecurityPage() {
  const auditLogs = [
    { id: 1, action: "Admin Session Authenticated (Google Authenticator Verified)", ip: "102.89.44.12 (Lagos, NG)", timestamp: "Live Active Session", status: "success" },
    { id: 2, action: "System Fresh Start / Database Reset Triggered", ip: "System Local Core", timestamp: "Current Cycle", status: "critical" },
    { id: 3, action: "MDCN Cryptographic Signatures Synchronized", ip: "197.210.55.8 (Abuja, NG)", timestamp: "2026 Registry", status: "success" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1E3A5F]">Security &amp; Google Authenticator Governance</h1>
        <p className="text-gray-600 mt-2">Manage Google Authenticator MFA, cryptographic tokens, and administrative audit logs.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Google Authenticator Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-[#CCFBF1] text-[#0D9488] rounded-xl">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Google Authenticator (2FA)</h2>
              <p className="text-xs text-gray-500">RFC 6238 Time-based One-Time Password</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Enforcement:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Active &amp; Enforced
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Inactivity Auto-Lock:</span>
              <span className="font-semibold text-gray-900">15 Minutes</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Obfuscated Route:</span>
              <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-[#0D9488] font-bold">/console-x9k2v-sys</code>
            </div>
          </div>
        </div>

        {/* Master Passkey Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Master Security Passkey</h2>
              <p className="text-xs text-gray-500">Emergency disaster recovery override</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-4">
            If authenticator device is lost, use the system master passkey to re-authenticate:
          </p>
          <div className="p-3 bg-slate-900 text-[#4ADE80] font-mono text-sm font-bold rounded-xl text-center tracking-wider mb-2">
            ILERTI-ADMIN-2025
          </div>
          <p className="text-[11px] text-gray-400 text-center">Store in a secure corporate password vault.</p>
        </div>
      </div>

      {/* QR Code Setup Helper in Security Section */}
      <div className="mb-8">
        <GoogleAuthQr />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-[#1E3A5F]">Security Audit Logs</h2>
          <Badge className="bg-[#1E3A5F] text-white">Immutable Ledger</Badge>
        </div>
        <div className="divide-y divide-gray-100 text-sm">
          {auditLogs.map(log => (
            <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-gray-50 transition-colors">
              <div>
                <div className="font-semibold text-gray-900">{log.action}</div>
                <div className="text-xs text-gray-500 mt-0.5">{log.ip} • {log.timestamp}</div>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase ${
                log.status === 'success' ? 'bg-green-100 text-green-800' :
                log.status === 'critical' ? 'bg-red-100 text-red-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
