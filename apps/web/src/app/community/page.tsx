"use client";

import { Calendar, MapPin, Users, HeartHandshake } from "lucide-react";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import Link from "next/link";

export default function CommunityPage() {
  const events = [
    {
      id: 1,
      title: "Lagos Free BP & Sugar Screening",
      date: "Oct 25, 2023 • 9:00 AM - 2:00 PM",
      location: "Teslim Balogun Stadium, Surulere, Lagos",
      type: "Public Screening",
      attendees: 124
    },
    {
      id: 2,
      title: "University Wellness Drive",
      date: "Nov 02, 2023 • 10:00 AM - 4:00 PM",
      location: "University of Abuja Main Campus",
      type: "Youth Program",
      attendees: 350
    },
    {
      id: 3,
      title: "Maternal Health Awareness Seminar",
      date: "Nov 15, 2023 • 11:00 AM",
      location: "Virtual Event (Zoom)",
      type: "Education",
      attendees: 89
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-[#CCFBF1] text-[#0D9488] px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4">
            Grassroots Impact
          </div>
          <h1 className="text-4xl font-extrabold text-[#1E3A5F] mb-4">ILERTI Community Outreach</h1>
          <p className="text-lg text-gray-600">Taking healthcare beyond the screen. Join our community health days and public health initiatives across Nigeria.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#CCFBF1] p-8 rounded-2xl text-center">
            <Users className="w-10 h-10 text-[#0D9488] mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-[#1E3A5F]">50k+</h3>
            <p className="text-[#0D9488] font-medium">Lives Impacted</p>
          </div>
          <div className="bg-blue-50 p-8 rounded-2xl text-center">
            <MapPin className="w-10 h-10 text-blue-500 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-[#1E3A5F]">12</h3>
            <p className="text-blue-600 font-medium">States Covered</p>
          </div>
          <div className="bg-amber-50 p-8 rounded-2xl text-center">
            <HeartHandshake className="w-10 h-10 text-amber-500 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-[#1E3A5F]">500+</h3>
            <p className="text-amber-600 font-medium">Volunteers</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[#1E3A5F] mb-6">Upcoming Events</h2>
        <div className="grid lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full mb-4">
                  {event.type}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-600 text-sm gap-2">
                    <Calendar className="w-4 h-4 text-[#0D9488]" /> {event.date}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm gap-2">
                    <MapPin className="w-4 h-4 text-[#0D9488]" /> {event.location}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm gap-2">
                    <Users className="w-4 h-4 text-[#0D9488]" /> {event.attendees} Registered
                  </div>
                </div>
              </div>
              <button className="w-full py-2.5 bg-[#0D9488] text-white rounded-xl font-semibold hover:bg-[#0f766e] transition-colors">
                Register to Attend
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-[#1E3A5F] rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Want to partner with us?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">We collaborate with NGOs, corporate organizations, and healthcare professionals to deliver free medical care to underserved communities.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" className="px-6 py-3 bg-white text-[#1E3A5F] font-bold rounded-xl hover:bg-gray-100 transition-colors inline-block">
              Become a Partner
            </Link>
            <Link href="/contact" className="px-6 py-3 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors inline-block">
              Volunteer with ILERTI
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
