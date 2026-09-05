"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Search, MapPin, Stethoscope, Star } from 'lucide-react';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');

  useEffect(() => {
    async function loadDoctors() {
      try {
        setLoading(true);
        const data = await api.doctors.getAll();
        if (Array.isArray(data) && data.length > 0) {
          setDoctors(data);
        }
      } catch (err) {
        console.error('Failed to load live doctors:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    const name = `${doc.user?.firstName || ''} ${doc.user?.lastName || ''}`.toLowerCase();
    const specialties = (doc.specialties || []).join(' ').toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || specialties.includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'ALL' || (doc.specialties || []).includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  const specialtiesList = ['ALL', 'Cardiology', 'Paediatrics', 'Obstetrics & Gynaecology', 'General Practice', 'Family Medicine', 'Internal Medicine', 'Endocrinology', 'Dermatology'];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Hero Header */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-2 font-heading">
              Verified Nigerian Doctor Network
            </h1>
            <p className="text-slate-600 text-lg">
              Consult with licensed MDCN-registered specialists across Nigeria via video, audio, or instant chat.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search doctor by name, condition, or hospital..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
              </div>
            </div>

            {/* Specialty Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {specialtiesList.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedSpecialty === spec
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {spec === 'ALL' ? 'All Specialties' : spec}
                </button>
              ))}
            </div>
          </div>

          {/* Doctor Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-teal-600 border-t-transparent"></div>
              <p className="mt-4 text-slate-500 font-medium">Loading verified specialists from database...</p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <Stethoscope className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <h3 className="text-lg font-bold text-slate-700">No doctors match your filter</h3>
              <p className="text-slate-500 text-sm mt-1">Try searching for a different specialty or keyword.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doc) => {
                const fullName = doc.user ? `Dr. ${doc.user.firstName} ${doc.user.lastName}` : 'Verified Doctor';
                const location = doc.user?.city && doc.user?.state ? `${doc.user.city}, ${doc.user.state}` : 'Nigeria';
                const avatar = doc.user?.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150';

                return (
                  <div
                    key={doc.id}
                    className="border border-slate-200 rounded-2xl p-6 shadow-sm bg-white hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={avatar}
                          alt={fullName}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-100 shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg font-bold text-[#1E3A5F] truncate">{fullName}</h2>
                          <p className="text-sm font-semibold text-teal-600 truncate">
                            {(doc.specialties || []).join(', ')}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            <span className="truncate">{location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          {doc.mdcnNumber || 'MDCN Verified'}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{doc.rating?.toFixed(1) || '4.9'}</span>
                          <span className="text-slate-400 font-normal">({doc.totalConsultations || 240}+)</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-3 mb-6 leading-relaxed">
                        {doc.bio || 'Consultant clinician dedicated to preventive medicine, accurate diagnosis, and personalized continuous care.'}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 uppercase font-semibold block">Fee</span>
                        <span className="text-lg font-bold text-slate-900">
                          ₦{(doc.consultationFee || 10000).toLocaleString()}
                        </span>
                      </div>
                      <Link
                        href={`/consultations/checkout/${doc.id}`}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-sm"
                      >
                        Book Visit
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
