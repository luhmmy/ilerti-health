"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

// Inactivity timeout configuration (in milliseconds)
// 30 minutes for general user sessions, 15 minutes for admin routes
const GENERAL_IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const ADMIN_IDLE_TIMEOUT = 15 * 60 * 1000;   // 15 minutes

export function SessionTimeoutWatcher() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const lastActivityRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const isAdminRoute = pathname?.startsWith("/console-x9k2v-sys") || pathname?.startsWith("/admin");
    const timeoutDuration = isAdminRoute ? ADMIN_IDLE_TIMEOUT : GENERAL_IDLE_TIMEOUT;

    const resetTimer = () => {
      lastActivityRef.current = Date.now();
    };

    // Activity event listeners
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];
    events.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    // Interval checker every 10 seconds
    const checkInterval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastActivityRef.current;

      if (elapsed >= timeoutDuration) {
        // Session expired
        clearInterval(checkInterval);
        sessionStorage.removeItem("ilerti_admin_mfa_passed");
        logout();

        toast.warning("Session Expired", {
          description: "You have been logged out due to inactivity to protect sensitive health data.",
          duration: 6000,
        });

        if (isAdminRoute) {
          router.push("/console-x9k2v-sys");
        } else {
          router.push("/login");
        }
      }
    }, 10000);

    return () => {
      clearInterval(checkInterval);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated, pathname, logout, router]);

  return null;
}
