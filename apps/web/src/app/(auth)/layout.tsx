import React from 'react';
import { CheckCircle2, Leaf } from 'lucide-react';
import { BrandLogo } from '@/components/layout/BrandLogo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-stone-50">
      {/* Left Column - Hidden on mobile */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-gradient-to-br from-slate-900 to-teal-900 p-12 text-white relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10">
          <div className="mb-16">
            <BrandLogo size="lg" className="bg-white/90 p-2 rounded-xl inline-flex" />
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-8">
            Your complete health journey,<br />in one place
          </h1>

          <div className="space-y-6 text-slate-200">
            {[
              'Verified doctors and specialists',
              'AI-powered health navigation',
              'Secure electronic health records',
              'Personalized wellness plans'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="bg-teal-500/20 rounded-full p-1">
                  <CheckCircle2 className="w-5 h-5 text-teal-400" />
                </div>
                <span className="text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-teal-100/60 font-medium tracking-widest uppercase text-sm mt-12">
          Know. Connect. Care. Prevent. Thrive.
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12 relative">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center mb-8">
            <BrandLogo size="lg" />
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}
