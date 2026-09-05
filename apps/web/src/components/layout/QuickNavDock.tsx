"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../stores/useAuthStore';
import { 
  Home, 
  Bot, 
  Stethoscope, 
  Building2,
  LayoutDashboard, 
  FileHeart, 
  Apple, 
  CreditCard,
  User,
  ShieldAlert,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'AI Triage', href: '/ai', icon: Bot },
  { label: 'Doctors', href: '/doctors', icon: Stethoscope },
  { label: 'Facilities', href: '/facilities', icon: Building2 },
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Records', href: '/health', icon: FileHeart },
  { label: 'Wellness', href: '/wellness', icon: Apple },
  { label: 'Pricing', href: '/pricing', icon: CreditCard },
  { label: 'Profile', href: '/profile', icon: User },
];

export function QuickNavDock() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(true);

  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center select-none pointer-events-none">
      <div className="pointer-events-auto flex flex-col items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mb-1.5 bg-[#1E3A5F] text-white rounded-full p-1 shadow-lg hover:bg-[#14263e] transition-colors focus:outline-none ring-2 ring-white/50"
          aria-label="Toggle Quick Navigation"
          title={isOpen ? "Minimize dock" : "Open quick navigation"}
        >
          {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>

        {isOpen && (
          <div className="bg-white/95 backdrop-blur-md border border-gray-200/80 shadow-2xl rounded-full px-3 py-1.5 flex items-center gap-1 sm:gap-2 overflow-x-auto max-w-[95vw] ring-1 ring-black/5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex flex-col items-center justify-center px-2.5 py-1.5 rounded-2xl transition-all min-w-[3.6rem]
                    ${isActive 
                      ? 'text-[#0D9488] bg-[#CCFBF1] font-semibold shadow-xs' 
                      : 'text-gray-500 hover:text-[#1E3A5F] hover:bg-gray-100/80 font-medium'
                    }`}
                  title={item.label}
                >
                  <Icon size={18} className="mb-0.5" />
                  <span className="text-[10px] leading-none">{item.label}</span>
                </Link>
              );
            })}
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className={`flex flex-col items-center justify-center px-2.5 py-1.5 rounded-2xl transition-all min-w-[3.6rem]
                  ${pathname.startsWith('/admin')
                    ? 'text-[#0D9488] bg-[#CCFBF1] font-semibold' 
                    : 'text-amber-600 hover:text-amber-800 hover:bg-amber-50 font-medium'
                  }`}
                title="Admin Portal"
              >
                <ShieldAlert size={18} className="mb-0.5" />
                <span className="text-[10px] leading-none">Admin</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
