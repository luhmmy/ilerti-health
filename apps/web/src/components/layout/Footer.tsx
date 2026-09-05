"use client";

import Link from "next/link";
import { Twitter, Facebook, Instagram, Linkedin, Heart } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { useAuthStore } from "../../stores/useAuthStore";

export function Footer() {
  const { isAuthenticated } = useAuthStore();

  const aiHref = isAuthenticated ? "/ai" : "/signup";
  const doctorsHref = isAuthenticated ? "/doctors" : "/signup";
  const facilitiesHref = isAuthenticated ? "/facilities" : "/signup";
  const wellnessHref = isAuthenticated ? "/wellness" : "/signup";

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto pt-10 pb-8 text-slate-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-10">
          
          {/* Brand & Mission Statement (Full width on mobile, 5 cols on md+) */}
          <div className="md:col-span-5 space-y-4">
            <BrandLogo size="md" />
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
              A digital health ecosystem for lifelong, accessible and preventive healthcare across Nigeria. Know. Connect. Care. Prevent. Thrive.
            </p>
            <div className="flex items-center gap-4 text-slate-400 pt-1">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition-colors p-1" title="Twitter / X">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition-colors p-1" title="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition-colors p-1" title="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition-colors p-1" title="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links Grid (7 cols on md+, 3 neat columns on mobile) */}
          <div className="md:col-span-7 grid grid-cols-3 gap-4 sm:gap-6">
            
            {/* Column 1: Platform */}
            <div>
              <h4 className="font-heading font-bold text-xs sm:text-sm text-[#1E3A5F] mb-3 uppercase tracking-wider">
                Platform
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                <li><Link href={aiHref} className="hover:text-teal-600 transition-colors">AI Health</Link></li>
                <li><Link href={doctorsHref} className="hover:text-teal-600 transition-colors">Doctors</Link></li>
                <li><Link href={facilitiesHref} className="hover:text-teal-600 transition-colors">Facilities</Link></li>
                <li><Link href={wellnessHref} className="hover:text-teal-600 transition-colors">Wellness</Link></li>
              </ul>
            </div>

            {/* Column 2: Company */}
            <div>
              <h4 className="font-heading font-bold text-xs sm:text-sm text-[#1E3A5F] mb-3 uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                <li><Link href="/about" className="hover:text-teal-600 transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-teal-600 transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-teal-600 transition-colors">Contact</Link></li>
                <li><Link href="/press" className="hover:text-teal-600 transition-colors">Press</Link></li>
              </ul>
            </div>

            {/* Column 3: Legal & Help */}
            <div>
              <h4 className="font-heading font-bold text-xs sm:text-sm text-[#1E3A5F] mb-3 uppercase tracking-wider">
                Legal &amp; Help
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                <li><Link href="/help" className="hover:text-teal-600 transition-colors">Help Center</Link></li>
                <li><Link href="/privacy" className="hover:text-teal-600 transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-teal-600 transition-colors">Terms</Link></li>
                <li><Link href="/cookies" className="hover:text-teal-600 transition-colors">Cookies</Link></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 ILERTI Health. All rights reserved.</p>
          <p className="flex items-center justify-center gap-1">
            Made with care for Nigeria 🇳🇬
          </p>
        </div>
      </div>
    </footer>
  );
}
