"use client";

import { useDoctorStore } from '@/stores/useDoctorStore';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { notFound } from 'next/navigation';
import { use } from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock } from 'lucide-react';

export default function DoctorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const getDoctorById = useDoctorStore((state) => state.getDoctorById);
  const doctor = getDoctorById(id);

  if (!doctor) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Doctor Not Found</h1>
            <p className="text-gray-500 mt-2">The doctor profile you are looking for does not exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#1E3A5F] p-8 md:p-12 text-white flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              
              <div className="w-32 h-32 rounded-full bg-white text-[#1E3A5F] flex items-center justify-center font-bold text-5xl border-4 border-white/20 shadow-xl shrink-0 z-10">
                {doctor.fullName.charAt(0)}
              </div>
              
              <div className="text-center md:text-left z-10">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{doctor.fullName}</h1>
                  {doctor.status === 'verified' && (
                    <Badge className="bg-[#4ADE80] hover:bg-[#4ADE80] text-[#1E3A5F] border-none font-bold w-fit mx-auto md:mx-0">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-xl text-[#4ADE80] font-medium mb-2">{doctor.primarySpecialty}</p>
                <p className="text-slate-300 flex items-center justify-center md:justify-start gap-2">
                  <span>{doctor.hospitalAffiliation}</span>
                  <span>•</span>
                  <span>{doctor.cityOfPractice}, {doctor.stateOfPractice}</span>
                </p>
              </div>
            </div>
            
            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-8">
                  <section>
                    <h2 className="text-xl font-bold mb-4 text-[#1E3A5F]">About</h2>
                    <p className="text-gray-600 leading-relaxed text-lg">{doctor.bio}</p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold mb-4 text-[#1E3A5F]">Professional Details</h2>
                    <div className="bg-slate-50 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-slate-500 text-sm mb-1 uppercase tracking-wider">MDCN Folio</h3>
                        <p className="text-gray-900 font-medium">{doctor.mdcnFolio}</p>
                      </div>
                      {doctor.secondarySpecialty && (
                        <div>
                          <h3 className="font-semibold text-slate-500 text-sm mb-1 uppercase tracking-wider">Secondary Specialty</h3>
                          <p className="text-gray-900 font-medium">{doctor.secondarySpecialty}</p>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-slate-500 text-sm mb-1 uppercase tracking-wider">Languages Spoken</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {doctor.languages.map(lang => (
                            <span key={lang} className="bg-white border border-slate-200 px-3 py-1 rounded-full text-sm font-medium text-slate-700">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
                
                <div className="md:col-span-1">
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm sticky top-6">
                    <h3 className="font-bold text-lg mb-6 text-center border-b pb-4">Consultation Info</h3>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Consultation Fee</span>
                        <span className="text-2xl font-bold text-[#0D9488]">₦{doctor.consultationFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Wait Time</span>
                        <span className="font-medium">~15 mins</span>
                      </div>
                    </div>
                    
                    <button className="w-full bg-[#0D9488] text-white font-bold py-4 rounded-xl hover:bg-[#0f766e] transition shadow-lg shadow-teal-500/20 active:scale-[0.98]">
                      Book Appointment
                    </button>
                    
                    {doctor.isSelfRegistered && (
                      <p className="text-center text-xs text-slate-400 mt-4 font-medium">
                        Self-Registered Practitioner
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
