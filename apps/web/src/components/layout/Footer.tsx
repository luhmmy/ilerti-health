import Link from "next/link";
import { Twitter, Facebook, Instagram, Linkedin } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
  return (
    <footer className="bg-white border-t border-navy-100 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <BrandLogo size="md" className="mb-4" />
            <p className="text-navy-600 mb-6 max-w-sm">
              A digital health ecosystem for lifelong, accessible and preventive healthcare. Know. Connect. Care. Prevent. Thrive.
            </p>
            <div className="flex items-center gap-4 text-navy-400">
              <a href="#" className="hover:text-primary-600 transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary-600 transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary-600 transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary-600 transition-colors"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-navy-900 mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-navy-600">
              <li><Link href="/signup" className="hover:text-primary-600 transition-colors">AI Health Navigation</Link></li>
              <li><Link href="/signup" className="hover:text-primary-600 transition-colors">Verified Doctors</Link></li>
              <li><Link href="/signup" className="hover:text-primary-600 transition-colors">Healthcare Facilities</Link></li>
              <li><Link href="/signup" className="hover:text-primary-600 transition-colors">Personalized Wellness</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-navy-900 mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-navy-600">
              <li><Link href="#" className="hover:text-primary-600 transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary-600 transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary-600 transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-primary-600 transition-colors">Press</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-navy-900 mb-4">Support & Legal</h4>
            <ul className="space-y-3 text-sm text-navy-600">
              <li><Link href="#" className="hover:text-primary-600 transition-colors">Help Centre</Link></li>
              <li><Link href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary-600 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-navy-100 text-center text-sm text-navy-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2024 ILERTI Health. All rights reserved.</p>
          <p>Made with care for Nigeria 🇳🇬</p>
        </div>
      </div>
    </footer>
  );
}
