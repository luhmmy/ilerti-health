"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Stethoscope, 
  Building2, 
  FileHeart, 
  Clock, 
  Pill, 
  Bell, 
  Utensils, 
  Heart, 
  ShieldCheck, 
  LogOut, 
  Edit3, 
  ChevronRight, 
  PhoneCall, 
  Sparkles,
  Droplets,
  User as UserIcon,
  Activity,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { useHydrationStore } from "@/stores/useHydrationStore";
import { getInitials } from "@/lib/utils";

interface UserDashboardSidebarProps {
  onOpenVitalsModal?: () => void;
  onOpenScannerModal?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function UserDashboardSidebar({ 
  onOpenVitalsModal,
  onOpenScannerModal,
  isCollapsed = false,
  onToggleCollapse,
}: UserDashboardSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const profile = useProfileStore();
  const { currentIntakeMl, dailyGoalMl } = useHydrationStore();
  const [internalCollapsed, setInternalCollapsed] = React.useState(false);

  const collapsed = onToggleCollapse ? isCollapsed : internalCollapsed;
  const toggle = onToggleCollapse || (() => setInternalCollapsed(!internalCollapsed));

  const userName = user?.name || user?.email?.split("@")[0] || "Health User";
  const userEmail = user?.email || "patient@ilertihealth.site";
  const userRole = user?.role || "patient";
  const initials = getInitials(userName, "");

  const hydrationProgress = Math.min(100, Math.round((currentIntakeMl / dailyGoalMl) * 100));

  const navSections = [
    {
      title: "Core Health Services",
      items: [
        {
          label: "Dashboard Overview",
          href: "/dashboard",
          icon: LayoutDashboard,
          badge: null,
          badgeColor: "",
        },
        {
          label: "AI Symptom Triage",
          href: "/ai",
          icon: Sparkles,
          badge: "AI 24/7",
          badgeColor: "bg-teal-500/15 text-teal-700 border-teal-300/40",
        },
        {
          label: "Consult MDCN Doctor",
          href: "/doctors",
          icon: Stethoscope,
          badge: null,
          badgeColor: "",
        },
        {
          label: "Hospitals & Labs",
          href: "/facilities",
          icon: Building2,
          badge: null,
          badgeColor: "",
        },
      ],
    },
    {
      title: "My Health Vault",
      items: [
        {
          label: "Medical Records",
          href: "/health/records",
          icon: FileHeart,
          badge: null,
          badgeColor: "",
        },
        {
          label: "Health Timeline",
          href: "/health/timeline",
          icon: Clock,
          badge: null,
          badgeColor: "",
        },
        {
          label: "Medications & Rx",
          href: "/health/medications",
          icon: Pill,
          badge: null,
          badgeColor: "",
        },
        {
          label: "Screenings & Alerts",
          href: "/health/reminders",
          icon: Bell,
          badge: null,
          badgeColor: "",
        },
      ],
    },
    {
      title: "Lifestyle & Prevention",
      items: [
        {
          label: "Nigerian Meal Planner",
          href: "/wellness/nutrition",
          icon: Utensils,
          badge: "Naija Diet",
          badgeColor: "bg-emerald-500/15 text-emerald-700 border-emerald-300/40",
        },
        {
          label: "Daily Wellness",
          href: "/wellness",
          icon: Heart,
          badge: null,
          badgeColor: "",
        },
        {
          label: "Preventive Care Hub",
          href: "/prevention",
          icon: ShieldCheck,
          badge: null,
          badgeColor: "",
        },
      ],
    },
  ];

  if (collapsed) {
    return (
      <aside className="w-16 shrink-0 bg-white rounded-3xl border border-slate-200 shadow-sm p-3 flex flex-col justify-between items-center space-y-6 lg:sticky lg:top-24 h-fit transition-all duration-300">
        <div className="flex flex-col items-center space-y-4 w-full">
          <button
            type="button"
            onClick={toggle}
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-700 flex items-center justify-center transition-colors cursor-pointer"
            title="Expand Sidebar"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </button>

          <div 
            onClick={onOpenVitalsModal}
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1E3A5F] to-[#0D9488] text-white font-bold text-xs flex items-center justify-center cursor-pointer shadow-xs"
            title={`${userName} (${userRole}) - Click to edit vitals`}
          >
            {initials || <UserIcon className="w-4 h-4" />}
          </div>

          <div className="w-8 h-px bg-slate-200 my-1" />

          {/* Collapsed Nav Icons */}
          <nav className="flex flex-col items-center space-y-2 w-full">
            {navSections.flatMap((s) => s.items).map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isActive
                      ? "bg-[#0D9488] text-white shadow-xs"
                      : "text-slate-500 hover:text-[#1E3A5F] hover:bg-slate-100"
                  }`}
                  title={item.label}
                >
                  <Icon className="w-4 h-4" />
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          type="button"
          onClick={() => logout()}
          className="w-10 h-10 rounded-xl text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-full lg:w-72 shrink-0 bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col justify-between space-y-6 lg:sticky lg:top-24 h-fit transition-all duration-300">
      
      {/* Top: User Profile Card & Collapse Toggle */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Health Navigator
          </span>
          <button
            type="button"
            onClick={toggle}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 bg-gradient-to-br from-[#1E3A5F] to-[#0D9488] rounded-2xl text-white shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md text-white font-bold text-base flex items-center justify-center border border-white/30 shadow-inner shrink-0">
              {initials || <UserIcon className="w-5 h-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-sm text-white truncate font-heading">
                {userName}
              </h3>
              <p className="text-xs text-teal-100 truncate">{userEmail}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2.5 border-t border-white/15 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></span>
              <span className="text-teal-100 uppercase tracking-wider font-semibold text-[11px] capitalize">
                {userRole} Account
              </span>
            </div>
            {onOpenVitalsModal && (
              <button
                type="button"
                onClick={onOpenVitalsModal}
                className="text-[11px] font-bold text-teal-200 hover:text-white flex items-center gap-1 transition-colors"
                title="Edit Health Vitals"
              >
                <Edit3 className="w-3 h-3" /> Edit Vitals
              </button>
            )}
          </div>
        </div>

        {/* Doctor Portal Quick Switch (If Doctor) */}
        {userRole === "doctor" && (
          <Link
            href="/doctor-portal"
            className="flex items-center justify-between p-3 rounded-2xl bg-teal-50 hover:bg-teal-100/80 border border-teal-200 transition-all text-teal-900 group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold leading-none">Doctor Clinical Portal</p>
                <p className="text-[11px] text-teal-700 mt-0.5">MDCN Workspace & Rx</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-teal-600 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}

        {/* Navigation Menus */}
        <div className="space-y-5 pt-1">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </p>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                        isActive
                          ? "bg-[#0D9488] text-white shadow-sm font-bold"
                          : "text-slate-600 hover:text-[#1E3A5F] hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? "text-white"
                              : "text-slate-400 group-hover:text-teal-600"
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${
                            isActive
                              ? "bg-white/20 text-white border-white/30"
                              : item.badgeColor || "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Compact Vitals Summary Card */}
        <div 
          onClick={onOpenVitalsModal}
          className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 cursor-pointer transition-all space-y-2 group"
          title="Click to update blood group or genotype"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" /> My Vitals
            </span>
            <span className="text-[11px] text-teal-600 font-bold group-hover:underline flex items-center gap-0.5">
              Update <ChevronRight className="w-3 h-3" />
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-white p-2 rounded-xl border border-slate-200/80 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Blood Group</p>
              <p className="text-sm font-black text-rose-600 mt-0.5">
                {profile.bloodGroup === "Not Set" ? "--" : profile.bloodGroup}
              </p>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-200/80 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Genotype</p>
              <p className="text-sm font-black text-teal-700 mt-0.5">
                {profile.genotype === "Not Set" ? "--" : profile.genotype}
              </p>
            </div>
          </div>

          {/* Hydration progress mini-bar */}
          <div className="pt-1">
            <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
              <span className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-blue-500" /> Hydration
              </span>
              <span className="text-blue-600">{hydrationProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${hydrationProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Nigeria Emergency Hotline Support */}
        <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-200/80 text-xs">
          <div className="flex items-center gap-2 text-rose-800 font-bold mb-1">
            <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
            <span>Emergency Hotlines</span>
          </div>
          <p className="text-[11px] text-rose-700 leading-snug">
            Toll-free <strong>112</strong> or <strong>767</strong> (LASAMBUS Emergency).
          </p>
        </div>
      </div>

      {/* Bottom: Logout */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => {
            logout();
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
