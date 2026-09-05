"use client";

import Link from "next/link";
import { Twitter, Facebook, Instagram, Linkedin } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { useAuthStore } from "../../stores/useAuthStore";

export function Footer() {
  const { isAuthenticated } = useAuthStore();

  const aiHref = isAuthenticated ? "/ai" : "/signup";
  const doctorsHref = isAuthenticated ? "/doctors" : "/signup";
  const facilitiesHref = isAuthenticated ? "/facilities" : "/signup";
  const wellnessHref = isAuthenticated ? "/wellness" : "/signup";

  return (
    <footer className="bg-white border-t border-navy-100 pt-8 pb-6 sm:pt-12 sm:pb-8">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-8 mb-8">
          
          {/* Brand & Mission Statement */}
          <div className="lg:max-w-sm">
            <BrandLogo size="md" className="mb-3" />
            <p className="text-navy-600 text-xs sm:text-sm mb-4 leading-relaxed">
              A digital health ecosystem for lifelong, accessible and preventive healthcare across Nigeria. Know. Connect. Care. Prevent. Thrive.
            </p>
            <div className="flex items-center gap-3 text-navy-400">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors" title="Twitter / X"><Twitter className="h-4 w-4" /></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors" title="Facebook"><Facebook className="h-4 w-4" /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors" title="Instagram"><Instagram className="h-4 w-4" /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors" title="LinkedIn"><Linkedin className="h-4 w-4" /></a>
            </div>
          </div>

          {/* 3 Columns Side-by-Side on Mobile (Platform, Company, Support) */}
          <div className="grid grid-cols-3 gap-3 sm:gap-8 flex-1 lg:max-w-2xl">
            
            {/* Column 1: Platform */}
            <div>
              <h4 className="font-heading font-bold text-xs sm:text-sm text-navy-900 mb-2 sm:mb-3">
                Platform
              </h4>
              <ul className="space-y-1.5 sm:space-y-2.5 text-[11px] sm:text-xs text-navy-600">
                <li><Link href={aiHref} className="hover:text-primary-600 transition-colors block">AI Navigation</Link></li>
                <li><Link href={doctorsHref} className="hover:text-primary-600 transition-colors block">MDCN Doctors</Link></li>
                <li><Link href={facilitiesHref} className="hover:text-primary-600 transition-colors block">Hospitals &amp; Labs</Link></li>
                <li><Link href={wellnessHref} className="hover:text-primary-600 transition-colors block">Wellness Plans</Link></li>
              </ul>
            </div>

            {/* Column 2: Company */}
            <div>
              <h4 className="font-heading font-bold text-xs sm:text-sm text-navy-900 mb-2 sm:mb-3">
                Company
              </h4>
              <ul className="space-y-1.5 sm:space-y-2.5 text-[11px] sm:text-xs text-navy-600">
                <li><Link href="/about" className="hover:text-primary-600 transition-colors block">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-primary-600 transition-colors block">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-primary-600 transition-colors block">Contact</Link></li>
                <li><Link href="/press" className="hover:text-primary-600 transition-colors block">Press</Link></li>
              </ul>
            </div>

            {/* Column 3: Support & Legal */}
            <div>
              <h4 className="font-heading font-bold text-xs sm:text-sm text-navy-900 mb-2 sm:mb-3">
                Support &amp; Legal
              </h4>
              <ul className="space-y-1.5 sm:space-y-2.5 text-[11px] sm:text-xs text-navy-600">
                <li><Link href="/help" className="hover:text-primary-600 transition-colors block">Help Centre</Link></li>
                <li><Link href="/privacy" className="hover:text-primary-600 transition-colors block">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary-600 transition-colors block">Terms of Care</Link></li>
                <li><Link href="/cookies" className="hover:text-primary-600 transition-colors block">Cookie Policy</Link></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-4 border-t border-navy-100 text-center text-[11px] sm:text-xs text-navy-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 ILERTI Health. All rights reserved.</p>
          <p>Made with care for Nigeria 🇳🇬</p>
        </div>
      </div>
    </footer>
  );
}
