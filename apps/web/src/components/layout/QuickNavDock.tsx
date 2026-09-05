"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../stores/useAuthStore';
import { 
  Home, 
  Layers, 
  Bot, 
  Stethoscope, 
  Video, 
  LayoutDashboard, 
  FileHeart, 
  Apple, 
  ShieldAlert,
  User,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Hub', href: '/hub', icon: Layers },
  { label: 'AI Triage', href: '/ai', icon: Bot },
  { label: 'Doctors', href: '/doctors', icon: Stethoscope },
  { label: 'Telehealth', href: '/consultations/checkout/dr-1', icon: Video },
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Vault', href: '/health', icon: FileHeart },
  { label: 'Nutrition', href: '/wellness', icon: Apple },
  { label: 'Admin', href: '/admin', icon: ShieldAlert },
];

export function QuickNavDock() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(true);

  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-2 bg-navy-900 text-white rounded-full p-1 shadow-lg bg-[#1E3A5F] hover:bg-[#152a45] transition-colors"
        aria-label="Toggle Quick Navigation"
      >
        {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      {isOpen && (
        <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-2xl rounded-full px-4 py-2 flex items-center gap-2 md:gap-4 overflow-x-auto max-w-[95vw]">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all min-w-[4rem]
                  ${isActive 
                    ? 'text-[#0D9488] bg-[#CCFBF1]' 
                    : 'text-gray-500 hover:text-[#1E3A5F] hover:bg-gray-100'
                  }`}
                title={item.label}
              >
                <Icon size={20} className="mb-1" />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
