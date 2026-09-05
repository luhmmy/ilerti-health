"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Phone, Globe, ShieldCheck, Search, Activity } from 'lucide-react';

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');

  useEffect(() => {
    async function loadFacilities() {
      try {
        setLoading(true);
        const data = await api.facilities.getAll();
        if (Array.isArray(data) && data.length > 0) {
          setFacilities(data);
        }
      } catch (err) {
        console.error('Failed to load facilities:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFacilities();
  }, []);

  const statesList = ['ALL', 'Lagos', 'FCT', 'Oyo', 'Rivers', 'Kano', 'Delta'];

  const filteredFacilities = facilities.filter((fac) => {
    const name = (fac.name || '').toLowerCase();
    const city = (fac.city || '').toLowerCase();
    const state = (fac.state || '').toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || city.includes(searchTerm.toLowerCase());
    const matchesState = selectedState === 'ALL' || state.includes(selectedState.toLowerCase());
    return matchesSearch && matchesState;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-2 font-heading">
              Accredited Healthcare Facilities
            </h1>
            <p className="text-slate-600 text-lg">
              Find verified teaching hospitals, multi-specialist centers, and accredited diagnostic labs across Nigeria.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search hospital or lab by name, city, or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
              />
            </div>

            {/* State Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {statesList.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedState(st)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedState === st
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'ALL' ? 'All States' : st === 'FCT' ? 'Abuja (FCT)' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Facilities List */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-teal-600 border-t-transparent"></div>
              <p className="mt-4 text-slate-500 font-medium">Loading verified medical centers...</p>
            </div>
          ) : filteredFacilities.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <Building2 className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <h3 className="text-lg font-bold text-slate-700">No facilities found</h3>
              <p className="text-slate-500 text-sm mt-1">Try selecting a different state or clearing your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFacilities.map((facility) => (
                <div
                  key={facility.id}
                  className="border border-slate-200 rounded-2xl p-6 shadow-sm bg-white hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="p-3 bg-teal-50 text-teal-700 rounded-xl">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Accredited
                      </Badge>
                    </div>

                    <h2 className="text-lg font-bold text-[#1E3A5F] mb-1 leading-snug">
                      {facility.name}
                    </h2>
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                      {facility.description || 'Comprehensive medical services and clinical diagnostics.'}
                    </p>

                    <div className="space-y-2 text-xs text-slate-600 mb-5">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span>{facility.address}, {facility.city}, {facility.state}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{facility.phone}</span>
                      </div>
                      {facility.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                          <a href={facility.website} target="_blank" rel="noreferrer" className="text-teal-600 hover:underline truncate">
                            {facility.website.replace('https://', '')}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Services Tags */}
                    {facility.services && facility.services.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1.5">
                          {facility.services.slice(0, 3).map((service: string, idx: number) => (
                            <span key={idx} className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded-md font-medium">
                              {service}
                            </span>
                          ))}
                          {facility.services.length > 3 && (
                            <span className="bg-teal-50 text-teal-700 text-[11px] px-2 py-0.5 rounded-md font-semibold">
                              +{facility.services.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5" /> Open & Active
                    </span>
                    <a
                      href={`tel:${facility.phone}`}
                      className="text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3.5 py-2 rounded-lg transition-colors"
                    >
                      Call Desk
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
