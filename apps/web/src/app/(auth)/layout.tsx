import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { BrandLogo } from '@/components/layout/BrandLogo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* Left Column - Green/Teal Gradient (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-gradient-to-br from-slate-900 via-teal-950 to-teal-900 p-12 text-white relative overflow-hidden">
        {/* Decorative background ambient lights */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="mb-14">
            <BrandLogo size="lg" className="bg-white/95 p-2.5 rounded-2xl inline-flex shadow-sm" />
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-8 font-heading text-white">
            Your complete health journey,<br />in one place
          </h1>

          <div className="space-y-6 text-slate-200">
            {[
              'Verified MDCN doctors and specialists',
              'AI-powered clinical triage & navigation',
              'Secure electronic health records vault',
              'Personalized Nigerian wellness & meal plans'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="bg-teal-500/20 rounded-full p-1.5 shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-teal-400" />
                </div>
                <span className="text-base font-medium text-slate-100">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2026 Write-ups on the Green Section */}
        <div className="relative z-10 pt-8 border-t border-teal-800/50 text-xs text-teal-100/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p>© 2026 ILERTI Health. All rights reserved.</p>
          <p className="flex items-center gap-1 font-medium">
            Made with care for Nigeria 🇳🇬
          </p>
        </div>
      </div>

      {/* Right Column - Clean Auth Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 relative overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center mb-6">
            <BrandLogo size="lg" />
          </div>
          
          {children}

          {/* Mobile footer note */}
          <div className="lg:hidden mt-8 text-center text-xs text-slate-400">
            <p>© 2026 ILERTI Health. All rights reserved. • Made with care for Nigeria 🇳🇬</p>
          </div>
        </div>
      </div>
    </div>
  );
}
