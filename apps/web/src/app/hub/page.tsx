"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, ExternalLink, Activity, 
  Stethoscope, Users, ShieldAlert, Heart, Building, Video
} from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { BrandLogo } from '../../components/layout/BrandLogo';

const FEATURES = [
  // 1. Onboarding & Authentication
  { category: "1. Onboarding & Authentication", icon: Users, title: "Landing Page", description: "Main entry point to the ILERTI Health ecosystem.", path: "/", tags: ["Public"] },
  { category: "1. Onboarding & Authentication", icon: Users, title: "Sign Up", description: "Create a new patient or doctor account.", path: "/signup", tags: ["Auth"] },
  { category: "1. Onboarding & Authentication", icon: Users, title: "Login", description: "Access existing accounts.", path: "/login", tags: ["Auth"] },
  
  // 2. Clinical Triage
  { category: "2. Clinical Triage & Navigation", icon: Activity, title: "AI Symptom Checker", description: "Interactive AI-driven triage and symptom analysis.", path: "/ai", tags: ["Interactive AI"] },
  
  // 3. Verified Doctor Network
  { category: "3. Verified Doctor Network", icon: Stethoscope, title: "Doctor Directory", description: "Search and filter verified healthcare professionals.", path: "/doctors", tags: ["MDCN Verification"] },
  { category: "3. Verified Doctor Network", icon: Stethoscope, title: "Doctor Profile", description: "Detailed profile, credentials, and reviews for a doctor.", path: "/doctors/dr-1", tags: ["Profile"] },
  
  // 4. Telehealth & Billing
  { category: "4. Telehealth Consultations & Billing", icon: Video, title: "Consultation Checkout", description: "Book and pay for a telehealth consultation.", path: "/consultations/checkout/dr-1", tags: ["Paystack Live Simulation"] },
  { category: "4. Telehealth Consultations & Billing", icon: Video, title: "Live Consultation Room", description: "Video and text chat interface for active consultations.", path: "/consultations/c-101", tags: ["WebRTC", "Live Chat"] },
  { category: "4. Telehealth Consultations & Billing", icon: Video, title: "Consultation Summary", description: "Post-consultation notes, prescriptions, and follow-ups.", path: "/consultations/c-101/summary", tags: ["Records"] },

  // 5. Patient Hub & Health Journey
  { category: "5. Patient Hub & Health Journey Vault", icon: Heart, title: "Patient Dashboard", description: "Overview of upcoming appointments, reminders, and health status.", path: "/dashboard", tags: ["Dashboard"] },
  { category: "5. Patient Hub & Health Journey Vault", icon: Heart, title: "Health Records", description: "Centralized vault for lab results, vitals, and medical history.", path: "/health/records", tags: ["Vault"] },
  { category: "5. Patient Hub & Health Journey Vault", icon: Heart, title: "Medications", description: "Active prescriptions and refill tracking.", path: "/health/medications", tags: ["Vault"] },
  { category: "5. Patient Hub & Health Journey Vault", icon: Heart, title: "Timeline", description: "Chronological history of all health interactions.", path: "/health/timeline", tags: ["History"] },

  // 6. Wellness & Nigerian Nutrition
  { category: "6. Wellness & Nigerian Nutrition", icon: Activity, title: "Wellness Hub", description: "Personalized lifestyle, fitness, and nutrition plans.", path: "/wellness", tags: ["Lifestyle"] },
  { category: "6. Wellness & Nigerian Nutrition", icon: Activity, title: "Nutrition Guide", description: "Locally tailored diet plans focusing on Nigerian cuisine.", path: "/wellness/nutrition", tags: ["Local Data"] },

  // 7. Facilities & Community
  { category: "7. Facilities & Community Outreach", icon: Building, title: "Facility Locator", description: "Find nearby hospitals, pharmacies, and labs.", path: "/facilities", tags: ["Geolocation"] },
  { category: "7. Facilities & Community Outreach", icon: Building, title: "Community Forums", description: "Peer support groups and health discussions.", path: "/community", tags: ["Social"] },
  { category: "7. Facilities & Community Outreach", icon: Building, title: "Prevention Campaigns", description: "Public health alerts and immunization schedules.", path: "/prevention", tags: ["Public Health"] },
  { category: "7. Facilities & Community Outreach", icon: Building, title: "Pricing & Plans", description: "Subscription tiers and out-of-pocket costs.", path: "/pricing", tags: ["Billing"] },

  // 8. Super Admin & Disease Surveillance
  { category: "8. Super Admin & Disease Surveillance", icon: ShieldAlert, title: "Admin Dashboard", description: "Platform oversight, analytics, and user management.", path: "/admin", tags: ["Admin Only"] },
  { category: "8. Super Admin & Disease Surveillance", icon: ShieldAlert, title: "Verification Queue", description: "Review and approve new healthcare provider applications.", path: "/admin/verification", tags: ["Admin Only"] },
  { category: "8. Super Admin & Disease Surveillance", icon: ShieldAlert, title: "Disease Surveillance", description: "Real-time epidemiological data and outbreak alerts.", path: "/admin/insights", tags: ["Analytics", "Live Map"] }
];

export default function HubPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFeatures = FEATURES.filter(f => 
    f.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const groupedFeatures = filteredFeatures.reduce((acc, feature) => {
    if (!acc[feature.category]) acc[feature.category] = [];
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, typeof FEATURES>);

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-[#1E3A5F] tracking-tight mb-4 flex items-center justify-center gap-3">
            <BrandLogo size="lg" withLink={false} /> <span className="text-2xl mt-1">Ecosystem Command Center</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Welcome to the All-in-One Platform Hub. Easily navigate, preview, and test all features and routes across the 7 phases of the ILERTI Health ecosystem.
          </p>
          
          <div className="mt-8 max-w-xl mx-auto relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search features, routes, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent text-lg transition-shadow"
              />
            </div>
          </div>
        </div>

        <div className="space-y-12 pb-20">
          {Object.entries(groupedFeatures).length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl">No features found matching "{searchTerm}"</p>
              <button 
                onClick={() => setSearchTerm("")}
                className="mt-4 text-[#0D9488] hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            Object.entries(groupedFeatures).sort().map(([category, items]) => (
              <section key={category} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-[#1E3A5F] mb-6 flex items-center gap-3 border-b pb-4">
                  {category}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="group border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-all hover:border-[#CCFBF1] bg-[#FAFAF9] hover:bg-white flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-[#CCFBF1] text-[#0D9488] rounded-xl group-hover:scale-110 transition-transform">
                            <Icon size={24} />
                          </div>
                          <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-mono font-medium">
                            {item.path}
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-bold text-[#1E3A5F] mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 flex-grow">{item.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                          {item.tags.map(tag => (
                            <span key={tag} className="px-2.5 py-1 bg-[#1E3A5F]/5 text-[#1E3A5F] rounded-md text-xs font-semibold">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <Link 
                          href={item.path}
                          className="mt-auto w-full flex items-center justify-center gap-2 bg-[#0D9488] hover:bg-[#0f766e] text-white py-2.5 rounded-xl font-medium transition-colors"
                        >
                          Test Flow
                          <ExternalLink size={16} />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
