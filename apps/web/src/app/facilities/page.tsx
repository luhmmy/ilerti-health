"use client";

import { useEffect, useState, useMemo } from 'react';
import { api } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  ShieldCheck, 
  Search, 
  Activity, 
  Navigation, 
  Compass, 
  Crosshair,
  Clock,
  Car,
  AlertTriangle,
  Flame,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface Facility {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  latitude: number;
  longitude: number;
  emergency24_7: boolean;
  hmoAccredited: boolean;
  website?: string;
  description?: string;
  services: string[];
  distanceKm?: number;
  approxDriveMins?: number;
  isClose?: boolean;
}

const LOCATION_PRESETS = [
  { label: 'Lagos (Surulere)', lat: 6.5000, lng: 3.3500 },
  { label: 'Lagos (Ikeja)', lat: 6.6018, lng: 3.3515 },
  { label: 'Lagos (Lekki / VI)', lat: 6.4447, lng: 3.4839 },
  { label: 'Abuja (Central CBD)', lat: 9.0579, lng: 7.4951 },
  { label: 'Ibadan (Bodija)', lat: 7.4200, lng: 3.9000 },
  { label: 'Port Harcourt (Old GRA)', lat: 4.8156, lng: 7.0123 },
  { label: 'Kano (City)', lat: 12.0022, lng: 8.5920 },
  { label: 'Enugu (Independence Layout)', lat: 6.4410, lng: 7.4980 },
];

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [onlyEmergency, setOnlyEmergency] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'closer' | 'further'>('all');

  // User Geolocation State
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>('Location Not Set');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Load facilities with optional coordinates
  const fetchFacilities = async (coords?: { lat: number; lng: number }) => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (coords) {
        params.lat = String(coords.lat);
        params.lng = String(coords.lng);
      }
      if (selectedState !== 'ALL') {
        params.state = selectedState;
      }

      const data = await api.facilities.getAll(params);
      if (Array.isArray(data)) {
        setFacilities(data);
      }
    } catch (err) {
      console.error('Failed to load facilities:', err);
      toast.error('Could not load facilities list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities(userLocation || undefined);
  }, [selectedState]);

  // Use Real Browser GPS Location
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(coords);
        setLocationName(`GPS: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
        setIsLocating(false);
        toast.success('📍 Location detected! Re-sorting hospitals by real distance...');
        fetchFacilities(coords);
        setActiveTab('closer');
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Unable to retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied. Try selecting a city preset below!';
        }
        setLocationError(msg);
        toast.error(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Select a preset location for instant testing
  const handleSelectPreset = (preset: typeof LOCATION_PRESETS[0]) => {
    const coords = { lat: preset.lat, lng: preset.lng };
    setUserLocation(coords);
    setLocationName(preset.label);
    setLocationError(null);
    toast.success(`📍 Position simulated at ${preset.label}`);
    fetchFacilities(coords);
  };

  const statesList = ['ALL', 'Lagos', 'FCT', 'Oyo', 'Rivers', 'Kano', 'Enugu'];

  // Distance computation helper (Haversine formula in KM)
  const deg2rad = (deg: number) => deg * (Math.PI / 180);
  const computeDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(6371 * c * 10) / 10;
  };

  // Filter and Partition into Closer vs Further Away
  const processedFacilities = useMemo(() => {
    return facilities.map((fac) => {
      let distanceKm = fac.distanceKm;
      let isClose = fac.isClose;
      let approxDriveMins = fac.approxDriveMins;

      if (userLocation && (!distanceKm || isNaN(distanceKm))) {
        distanceKm = computeDistance(userLocation.lat, userLocation.lng, fac.latitude, fac.longitude);
        approxDriveMins = Math.round(distanceKm * 2.2);
        isClose = distanceKm <= 25; // 25km radius threshold
      }

      return {
        ...fac,
        distanceKm,
        approxDriveMins,
        isClose: isClose ?? (distanceKm !== undefined ? distanceKm <= 25 : false),
      };
    });
  }, [facilities, userLocation]);

  const filtered = useMemo(() => {
    return processedFacilities.filter((fac) => {
      const name = (fac.name || '').toLowerCase();
      const city = (fac.city || '').toLowerCase();
      const state = (fac.state || '').toLowerCase();
      const services = (fac.services || []).join(' ').toLowerCase();
      const query = searchTerm.toLowerCase();

      const matchesSearch = name.includes(query) || city.includes(query) || state.includes(query) || services.includes(query);
      const matchesState = selectedState === 'ALL' || state.includes(selectedState.toLowerCase());
      const matchesEmergency = !onlyEmergency || fac.emergency24_7;

      if (!matchesSearch || !matchesState || !matchesEmergency) return false;

      if (activeTab === 'closer') {
        return fac.isClose === true;
      }
      if (activeTab === 'further') {
        return fac.isClose === false;
      }
      return true;
    });
  }, [processedFacilities, searchTerm, selectedState, onlyEmergency, activeTab]);

  const closerCount = processedFacilities.filter((f) => f.isClose).length;
  const furtherCount = processedFacilities.filter((f) => !f.isClose).length;

  return (
    <AuthGuard 
      serviceName="Healthcare Facilities & Diagnostic Labs Directory"
      serviceDescription="To access verified Nigerian hospital directories, diagnostic imaging centres, and contact desk numbers, please sign in or register."
    >
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Header />
        
        <main className="flex-1 py-10">
          <div className="container mx-auto px-4 max-w-7xl">

            {/* Page Title & Geolocation Prompt */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-heading flex items-center gap-3">
                  Hospital & Trauma Center Proximity
                  <span className="text-xs bg-teal-100 text-teal-800 font-bold px-3 py-1 rounded-full border border-teal-200">
                    Real-Time GPS
                  </span>
                </h1>
                <p className="text-slate-600 text-sm md:text-base mt-1">
                  Discover accredited hospitals closer to you in minutes, and browse tertiary referral centers nationwide.
                </p>
              </div>

              {/* Geolocation Button */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleDetectGPS}
                  disabled={isLocating}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-sm"
                >
                  <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : 'text-teal-200'}`} />
                  <span>{isLocating ? 'Acquiring GPS...' : 'Use My Current Location'}</span>
                </Button>
              </div>
            </div>

            {/* Real-time Location Bar & Presets */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Active Reference Location:</span>
                  <strong className="text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded">
                    {locationName}
                  </strong>
                  {userLocation && (
                    <span className="text-[11px] text-teal-600 font-semibold">
                      ({closerCount} nearby facilities within 25km)
                    </span>
                  )}
                </div>

                {locationError && (
                  <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {locationError}
                  </span>
                )}
              </div>

              {/* Quick Preset Location Simulator */}
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1.5">
                  Test Location Presets (Simulate Your Position):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {LOCATION_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                        locationName === p.label
                          ? 'bg-teal-50 border-teal-300 text-teal-800 font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      📍 {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Proximity Category Switcher Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex bg-slate-200/80 p-1 rounded-2xl max-w-lg border border-slate-300/60">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 py-2 px-4 text-xs font-bold rounded-xl transition-all ${
                    activeTab === 'all'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Hospitals ({processedFacilities.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('closer')}
                  className={`flex-1 py-2 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'closer'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                  Closer to You ({closerCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('further')}
                  className={`flex-1 py-2 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'further'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Car className="w-3.5 h-3.5 text-slate-300" />
                  Further Away ({furtherCount})
                </button>
              </div>

              {/* 24/7 Emergency Filter Toggle */}
              <button
                type="button"
                onClick={() => setOnlyEmergency(!onlyEmergency)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  onlyEmergency
                    ? 'bg-red-50 text-red-700 border-red-300 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Flame className={`w-4 h-4 ${onlyEmergency ? 'text-red-600 animate-pulse' : 'text-slate-400'}`} />
                <span>24/7 Emergency Trauma Centers Only</span>
              </button>
            </div>

            {/* Search Input & State Filter */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search hospital by name, specialty, service, or city (e.g., LUTH, Cardiology, Lekki)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 text-sm"
                />
              </div>

              {/* State Filter Pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {statesList.map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedState(st)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
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

            {/* Facilities List Grid */}
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-teal-600 border-t-transparent"></div>
                <p className="mt-4 text-slate-500 font-medium">Calculating proximity and sorting facilities...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
                <Building2 className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <h3 className="text-lg font-bold text-slate-700">No matching facilities found</h3>
                <p className="text-slate-500 text-sm mt-1">
                  Try switching to the &ldquo;All Hospitals&rdquo; tab or clearing your filters.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => {
                    setActiveTab('all');
                    setSelectedState('ALL');
                    setSearchTerm('');
                    setOnlyEmergency(false);
                  }}
                >
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((facility) => {
                  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`;

                  return (
                    <div
                      key={facility.id}
                      className={`border rounded-2xl p-6 shadow-sm bg-white hover:shadow-md transition-all flex flex-col justify-between ${
                        facility.isClose
                          ? 'border-emerald-200 ring-1 ring-emerald-500/20'
                          : 'border-slate-200'
                      }`}
                    >
                      <div>
                        {/* Header Badges */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className={`p-3 rounded-xl ${facility.isClose ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                            <Building2 className="w-6 h-6" />
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            {/* Proximity Distance Badge */}
                            {facility.distanceKm !== undefined && (
                              <span
                                className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                                  facility.isClose
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-slate-100 text-slate-700 border border-slate-300'
                                }`}
                              >
                                <Navigation className="w-3 h-3" />
                                {facility.distanceKm} km away
                                {facility.approxDriveMins && ` (~${facility.approxDriveMins}m)`}
                              </span>
                            )}

                            {facility.emergency24_7 && (
                              <span className="text-[10px] bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded border border-red-200 flex items-center gap-1">
                                <Flame className="w-2.5 h-2.5" /> 24/7 ER
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Name & Type */}
                        <h2 className="text-lg font-bold text-slate-900 mb-1 leading-snug">
                          {facility.name}
                        </h2>
                        <span className="inline-block text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md mb-3">
                          {facility.type}
                        </span>

                        <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                          {facility.description || 'Comprehensive accredited clinical care center.'}
                        </p>

                        {/* Address & Contacts */}
                        <div className="space-y-2 text-xs text-slate-600 mb-5">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            <span>{facility.address}, {facility.city}, {facility.state}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                            <a href={`tel:${facility.phone}`} className="hover:text-teal-600">
                              {facility.phone}
                            </a>
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
                              {facility.services.slice(0, 3).map((service, idx) => (
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

                      {/* Bottom Action Footer */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                        <a
                          href={googleMapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 text-center text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-xl transition-colors flex items-center justify-center gap-1"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>Get Directions</span>
                          <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                        </a>
                        <a
                          href={`tel:${facility.phone}`}
                          className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors"
                        >
                          Call Desk
                        </a>
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
    </AuthGuard>
  );
}
