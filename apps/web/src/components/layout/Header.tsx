"use client";

import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { useAuthStore } from "../../stores/useAuthStore";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="flex h-16 items-center justify-between px-6 border-b bg-white">
      <div className="flex items-center gap-6">
        <BrandLogo size="md" />
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-navy-700">
          <Link href="/ai" className="hover:text-primary-600 transition-colors flex items-center gap-1 font-semibold text-primary-700">
            <span className="text-base">✨</span> AI Triage
          </Link>
          <Link href="/doctors" className="hover:text-primary-600 transition-colors">Doctors</Link>
          <Link href="/facilities" className="hover:text-primary-600 transition-colors">Facilities</Link>
          <Link href="/wellness" className="hover:text-primary-600 transition-colors">Wellness</Link>
          <Link href="/pricing" className="hover:text-primary-600 transition-colors">Pricing</Link>
          {isAuthenticated && (
            <>
              <Link href="/dashboard" className="hover:text-primary-600 transition-colors">Dashboard</Link>
              <Link href="/health" className="hover:text-primary-600 transition-colors">Records</Link>
              {user?.role === "admin" && (
                <Link href="/admin" className="hover:text-primary-600 transition-colors">Admin</Link>
              )}
            </>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold">
                {user?.name?.[0] || "U"}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{user?.name}</span>
                <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
