"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSent(true);
    toast.success("Message sent! Our support team will get back to you within 24 hours.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <section className="pt-20 pb-16 md:pt-28 md:pb-24 bg-gradient-to-b from-teal-50/60 via-white to-slate-50 border-b border-slate-100 text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200 mb-6">
            <MessageSquare className="w-3.5 h-3.5 text-teal-600" /> Get in Touch
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-navy-900 tracking-tight leading-tight mb-4">
            We are Here to Help
          </h1>
          <p className="text-base md:text-lg text-navy-600 max-w-2xl mx-auto leading-relaxed">
            Have questions about doctor bookings, facility listings, corporate partnerships, or technical support? Reach out to our team.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 flex-1">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="space-y-4">
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-navy-900">Email Us</h3>
                <p className="text-xs text-navy-500">For general and clinical inquiries:</p>
                <a href="mailto:support@ilertihealth.site" className="text-sm font-semibold text-teal-700 hover:underline block">
                  support@ilertihealth.site
                </a>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-navy-900">Call Support</h3>
                <p className="text-xs text-navy-500">Mon - Fri: 8:00 AM - 6:00 PM (WAT)</p>
                <div className="text-sm font-semibold text-navy-800">
                  +234 1 800 ILERTI (453784)
                </div>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-navy-900">Headquarters</h3>
                <p className="text-xs text-navy-600 leading-relaxed">
                  Victoria Island, Lagos State, Nigeria <br />
                  Central Business District, Abuja FCT
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-navy-900 mb-2">Send us a Message</h2>
              <p className="text-xs text-navy-500 mb-6">Fill out the form below and we will respond promptly.</p>

              {sent ? (
                <div className="p-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-teal-600 mx-auto" />
                  <h3 className="text-lg font-bold text-navy-900">Message Delivered!</h3>
                  <p className="text-sm text-navy-600">
                    Thank you for reaching out. A representative from ILERTI Health has received your inquiry.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setSent(false)}>Send Another Message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy-700 mb-1">Your Name *</label>
                      <input 
                        type="text" 
                        required
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-teal-500" 
                        placeholder="Amina Bello"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy-700 mb-1">Email Address *</label>
                      <input 
                        type="email" 
                        required
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-teal-500" 
                        placeholder="amina@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy-700 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-teal-500" 
                        placeholder="+234 800 000 0000"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy-700 mb-1">Topic</label>
                      <select 
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-teal-500 bg-white"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Doctor Onboarding">Doctor Onboarding (MDCN)</option>
                        <option value="Facility Partnership">Hospital / Diagnostic Lab Partnership</option>
                        <option value="Billing & Paystack">Billing & Payment Support</option>
                        <option value="Technical Issue">Technical Support</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy-700 mb-1">Your Message *</label>
                    <textarea 
                      rows={5} 
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-teal-500" 
                      placeholder="How can we assist you today?"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold w-full sm:w-auto">
                    <Send className="w-4 h-4 mr-2" /> Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
