"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, MapPin, Clock, ArrowRight, CheckCircle2, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

const OPENINGS = [
  {
    id: "med-officer",
    title: "Telehealth Medical Officer (MDCN Licensed)",
    dept: "Clinical Operations",
    location: "Lagos / Remote (Nigeria)",
    type: "Full-Time",
    desc: "Lead virtual patient consultations, review clinical triage protocols, and maintain telemedicine quality standards.",
  },
  {
    id: "fullstack-eng",
    title: "Senior Fullstack Engineer (Next.js & NestJS)",
    dept: "Engineering",
    location: "Remote (Nigeria)",
    type: "Full-Time",
    desc: "Scale our real-time telehealth infrastructure, WebRTC video consultation services, and secure health data vault.",
  },
  {
    id: "clinical-coord",
    title: "Clinical Care Coordinator",
    dept: "Patient Experience",
    location: "Abuja / Hybrid",
    type: "Full-Time",
    desc: "Facilitate specialist referrals, laboratory investigation coordination, and prescription fulfillment for patients.",
  },
  {
    id: "growth-lead",
    title: "Growth & Provider Partnership Lead",
    dept: "Commercial",
    location: "Lagos (Victoria Island)",
    type: "Full-Time",
    desc: "Expand our verified doctor network and onboard top HMOs, hospitals, and diagnostic centres across Nigeria.",
  },
];

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [applicant, setApplicant] = useState({ name: "", email: "", phone: "", linkedin: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicant.name || !applicant.email) {
      toast.error("Please fill in your name and email.");
      return;
    }
    setSubmitted(true);
    toast.success("Application received! Our talent team will review your profile.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Hero */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24 bg-gradient-to-b from-teal-50/60 via-white to-slate-50 border-b border-slate-100 text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Join Our Team
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-navy-900 tracking-tight leading-tight mb-6">
            Build the Future of <br className="hidden md:block" />
            <span className="text-teal-600">African HealthTech</span>
          </h1>
          <p className="text-base md:text-xl text-navy-600 max-w-2xl mx-auto leading-relaxed">
            We are on a mission to democratize quality healthcare for 200M+ Nigerians. Join clinicians, engineers, and designers who care deeply about making a difference.
          </p>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 md:py-20 bg-white flex-1">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-navy-900">Open Opportunities</h2>
              <p className="text-navy-500 text-sm mt-1">Explore current openings across clinical, engineering, and growth.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
              {OPENINGS.length} Positions
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {OPENINGS.map((job) => (
              <Card 
                key={job.id} 
                className={`border transition-all cursor-pointer ${selectedJob === job.id ? 'border-teal-500 ring-2 ring-teal-100 shadow-md' : 'border-slate-200 hover:border-teal-300'}`}
                onClick={() => setSelectedJob(job.id)}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                      {job.dept}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{job.type}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-navy-900">{job.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-navy-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-navy-600 leading-relaxed">
                    {job.desc}
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full text-xs bg-navy-900 hover:bg-navy-800 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedJob(job.id);
                    }}
                  >
                    Apply for this Role <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Application Form */}
          {selectedJob && (
            <div className="mt-12 p-6 md:p-8 rounded-3xl bg-slate-50 border border-slate-200">
              <h3 className="text-xl font-bold text-navy-900 mb-2">
                Apply for: {OPENINGS.find(j => j.id === selectedJob)?.title}
              </h3>
              <p className="text-xs text-navy-500 mb-6">Submit your details and our talent acquisition team will get in touch.</p>

              {submitted ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-teal-200 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto" />
                  <h4 className="text-lg font-bold text-navy-900">Application Submitted!</h4>
                  <p className="text-sm text-navy-600 max-w-md mx-auto">
                    Thank you for applying to ILERTI Health. We have received your submission and will reach out via email.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy-700 mb-1">Full Name *</label>
                      <input 
                        type="text" 
                        required
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-teal-500 bg-white" 
                        placeholder="Dr. Emeka Okafor"
                        value={applicant.name}
                        onChange={(e) => setApplicant({ ...applicant, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy-700 mb-1">Email Address *</label>
                      <input 
                        type="email" 
                        required
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-teal-500 bg-white" 
                        placeholder="emeka@example.com"
                        value={applicant.email}
                        onChange={(e) => setApplicant({ ...applicant, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy-700 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-teal-500 bg-white" 
                        placeholder="+234 801 234 5678"
                        value={applicant.phone}
                        onChange={(e) => setApplicant({ ...applicant, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy-700 mb-1">LinkedIn / Portfolio URL</label>
                      <input 
                        type="url" 
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-teal-500 bg-white" 
                        placeholder="https://linkedin.com/in/..."
                        value={applicant.linkedin}
                        onChange={(e) => setApplicant({ ...applicant, linkedin: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-1">Brief Note / Cover Summary</label>
                    <textarea 
                      rows={3} 
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-teal-500 bg-white" 
                      placeholder="Tell us about your background and why you want to join ILERTI..."
                      value={applicant.notes}
                      onChange={(e) => setApplicant({ ...applicant, notes: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold">
                    <Send className="w-4 h-4 mr-2" /> Submit Application
                  </Button>
                </form>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
