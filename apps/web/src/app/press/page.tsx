"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Newspaper, Download, ExternalLink, Sparkles, Building, Calendar } from "lucide-react";
import Link from "next/link";

const NEWS = [
  {
    date: "September 2024",
    title: "ILERTI Health Launches Nigeria-Wide Telehealth & AI Clinical Navigation Platform",
    source: "HealthTech Africa",
    desc: "ILERTI Health bridges healthcare accessibility across Nigeria with verified MDCN doctors, instant triage, and localized nutrition planning.",
  },
  {
    date: "August 2026",
    title: "Revolutionizing Primary Care: How Digital Triage is Reducing Hospital Congestion in Lagos & Abuja",
    source: "Nigerian Healthcare Journal",
    desc: "An in-depth analysis on how ILERTI's digital health vault and triage system are streamlining early patient diagnostics.",
  },
  {
    date: "July 2026",
    title: "ILERTI Partners with Top Diagnostic Laboratories to Enable Instant Digital Test Booking",
    source: "TechCabal",
    desc: "Patients across 36 Nigerian states can now search, book, and receive verified laboratory results directly in their secure health vault.",
  },
];

export default function PressPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <section className="pt-20 pb-16 md:pt-28 md:pb-24 bg-gradient-to-b from-teal-50/60 via-white to-slate-50 border-b border-slate-100 text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200 mb-6">
            <Newspaper className="w-3.5 h-3.5 text-teal-600" /> News & Media Kit
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-navy-900 tracking-tight leading-tight mb-4">
            ILERTI Health in the News
          </h1>
          <p className="text-base md:text-lg text-navy-600 max-w-2xl mx-auto leading-relaxed">
            Read our latest announcements, press releases, media assets, and updates on transforming digital healthcare across Nigeria.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 flex-1">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl space-y-12">
          {/* Media Kit Banner */}
          <div className="p-8 rounded-3xl bg-navy-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-teal-300">Official Brand & Media Kit</h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                Download high-resolution logos, brand guidelines, leadership headshots, and press release materials for media coverage.
              </p>
            </div>
            <Button className="bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold shrink-0">
              <Download className="w-4 h-4 mr-2" /> Download Media Assets (.ZIP)
            </Button>
          </div>

          {/* Press Releases */}
          <div>
            <h2 className="text-2xl font-bold text-navy-900 mb-6">Recent Press Releases</h2>
            <div className="space-y-4">
              {NEWS.map((item, idx) => (
                <Card key={idx} className="border-slate-200 hover:shadow-md transition-all">
                  <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-3 text-xs font-semibold text-teal-700">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {item.date}</span>
                        <span>•</span>
                        <span>{item.source}</span>
                      </div>
                      <h3 className="text-lg font-bold text-navy-900">{item.title}</h3>
                      <p className="text-xs md:text-sm text-navy-600">{item.desc}</p>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0 text-xs" asChild>
                      <a href="mailto:press@ilertihealth.site">Contact Press Team</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
