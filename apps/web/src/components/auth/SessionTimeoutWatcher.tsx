"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

// Inactivity timeout configuration (in milliseconds)
// 15 minutes for security-compliant medical session auto-logout
const GENERAL_SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const LAST_ACTIVITY_KEY = "ilerti_last_active_timestamp";

export function SessionTimeoutWatcher() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  // 1. Authoritative Backend Check on Page Mount/Reload
  useEffect(() => {
    if (!isAuthenticated) return;

    // Check if session timed out while the browser was closed
    const storedLastActive = localStorage.getItem(LAST_ACTIVITY_KEY);
    const now = Date.now();
    if (storedLastActive) {
      const elapsed = now - parseInt(storedLastActive, 10);
      if (elapsed > GENERAL_SESSION_TIMEOUT) {
        // Session expired while browser was closed
        localStorage.removeItem(LAST_ACTIVITY_KEY);
        sessionStorage.removeItem("ilerti_admin_mfa_passed");
        logout();
        toast.warning("Session Expired", {
          description: "Your session expired while your browser was closed. Please sign in again.",
        });
        return;
      }
    }
    localStorage.setItem(LAST_ACTIVITY_KEY, String(now));

    // Revalidate against the live database. If database was wiped, this 401s and logs out immediately.
    let isCancelled = false;
    async function validateLiveSession() {
      try {
        const raw = localStorage.getItem('ilerti-v6-auth');
        const token = raw ? JSON.parse(raw)?.state?.token : null;
        if (!token) return;

        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok && res.status === 401) {
          if (!isCancelled) {
            localStorage.removeItem(LAST_ACTIVITY_KEY);
            sessionStorage.removeItem("ilerti_admin_mfa_passed");
            logout();
            toast.error("Session Invalidated", {
              description: "Your account credentials have expired or were removed from the database.",
            });
            if (pathname?.startsWith("/console-x9k2v-sys")) {
              router.push("/console-x9k2v-sys");
            } else {
              router.push("/login");
            }
          }
        }
      } catch {}
    }

    validateLiveSession();

    return () => {
      isCancelled = true;
    };
  }, [isAuthenticated, pathname, logout, router]);

  // 2. Active User Activity & Inactivity Timer
  useEffect(() => {
    if (!isAuthenticated) return;

    const recordActivity = () => {
      localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
    };

    // Activity event listeners
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];
    events.forEach((event) => {
      window.addEventListener(event, recordActivity, { passive: true });
    });

    // Inactivity interval checker
    const interval = setInterval(() => {
      const storedLastActive = localStorage.getItem(LAST_ACTIVITY_KEY);
      const now = Date.now();
      const lastActive = storedLastActive ? parseInt(storedLastActive, 10) : now;
      const elapsed = now - lastActive;

      if (elapsed >= GENERAL_SESSION_TIMEOUT) {
        clearInterval(interval);
        localStorage.removeItem(LAST_ACTIVITY_KEY);
        sessionStorage.removeItem("ilerti_admin_mfa_passed");
        logout();

        toast.warning("Session Expired", {
          description: "You have been logged out due to inactivity to protect sensitive health data.",
          duration: 6000,
        });

        if (pathname?.startsWith("/console-x9k2v-sys")) {
          router.push("/console-x9k2v-sys");
        } else {
          router.push("/login");
        }
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      events.forEach((event) => {
        window.removeEventListener(event, recordActivity);
      });
    };
  }, [isAuthenticated, pathname, logout, router]);

  return null;
}
