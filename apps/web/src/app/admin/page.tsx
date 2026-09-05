"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldAlert, Lock, ArrowRight, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function DecoyAdminPage() {
  const [accessKey, setAccessKey] = useState("");
  const router = useRouter();

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessKey === "ILERTI-ADMIN-2025" || accessKey.toLowerCase() === "admin") {
      router.push("/console-x9k2v-sys");
    } else {
      router.push("/console-x9k2v-sys");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-xl text-center">
          <div className="w-16 h-16 bg-slate-100 text-[#1E3A5F] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#1E3A5F] mb-2">Restricted Access Endpoint</h1>
          <p className="text-sm text-gray-600 mb-6">
            Standard administrative routing has been obfuscated for security compliance. Please proceed to the encrypted console gateway.
          </p>

          <form onSubmit={handleAccess} className="space-y-4">
            <Link
              href="/console-x9k2v-sys"
              className="w-full py-3 bg-[#0D9488] text-white font-bold rounded-xl hover:bg-[#0f766e] transition-colors shadow-md flex items-center justify-center gap-2"
            >
              Open 2FA Secure Console <ArrowRight className="w-4 h-4" />
            </Link>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">
              Return to Public Platform
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
