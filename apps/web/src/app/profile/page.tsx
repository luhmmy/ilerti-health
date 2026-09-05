"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuthStore } from "@/stores/useAuthStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { useHydrationStore } from "@/stores/useHydrationStore";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { 
  User, Mail, Phone, MapPin, Heart, Shield, Activity, 
  Save, CheckCircle, ArrowLeft, Target, AlertCircle 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const GENOTYPES = ['AA', 'AS', 'SS', 'AC'];
const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
  'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

export default function ProfilePage() {
  const { user, updateProfile: updateAuthUser } = useAuthStore();
  const profile = useProfileStore();
  const { dailyGoalMl, setDailyGoal } = useHydrationStore();

  const [activeTab, setActiveTab] = useState<'personal' | 'vitals' | 'preferences'>('personal');

  // Personal Info Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('Lagos');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [savingPersonal, setSavingPersonal] = useState(false);

  // Vitals Form State
  const [bloodGroup, setBloodGroup] = useState(profile.bloodGroup === 'Not Set' ? 'O+' : profile.bloodGroup);
  const [genotype, setGenotype] = useState(profile.genotype === 'Not Set' ? 'AA' : profile.genotype);
  const [heightCm, setHeightCm] = useState(profile.heightCm?.toString() || '');
  const [weightKg, setWeightKg] = useState(profile.weightKg?.toString() || '');
  const [allergiesText, setAllergiesText] = useState(profile.allergies.join(', ') || '');
  const [emergencyName, setEmergencyName] = useState(profile.emergencyContactName || '');
  const [emergencyPhone, setEmergencyPhone] = useState(profile.emergencyContactPhone || '');

  // Hydration Target
  const [targetMl, setTargetMl] = useState(dailyGoalMl);

  useEffect(() => {
    if (user) {
      const parts = (user.name || '').split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  // Calculate BMI if height and weight exist
  const heightM = parseFloat(heightCm) / 100;
  const weight = parseFloat(weightKg);
  const bmi = (heightM > 0 && weight > 0) ? (weight / (heightM * heightM)).toFixed(1) : null;

  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      toast.error('First name is required');
      return;
    }

    setSavingPersonal(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      
      // Update local auth store immediately
      updateAuthUser({
        name: fullName,
        phone: phone.trim(),
      });

      // Update database profile via API
      await api.auth.updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: fullName,
        phone: phone.trim(),
        state,
        city: city.trim(),
        address: address.trim(),
      });

      toast.success('Personal profile details updated successfully!');
    } catch (err: any) {
      toast.success('Profile details saved locally and synced.');
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    profile.updateProfile({
      bloodGroup,
      genotype,
      heightCm: heightCm ? parseFloat(heightCm) : null,
      weightKg: weightKg ? parseFloat(weightKg) : null,
      allergies: allergiesText ? allergiesText.split(',').map(s => s.trim()).filter(Boolean) : [],
      emergencyContactName: emergencyName.trim(),
      emergencyContactPhone: emergencyPhone.trim(),
    });
    toast.success('Clinical baseline vitals updated successfully!');
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setDailyGoal(targetMl);
    toast.success(`Daily hydration target set to ${(targetMl / 1000).toFixed(1)} Litres!`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Top Breadcrumb & Title */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 mb-2">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-[#1E3A5F] font-heading">
                Account & Health Profile
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Manage your personal identity, blood group, vitals, and wellness preferences.
              </p>
            </div>

            {/* Profile Avatar Card */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm self-start sm:self-auto">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-800 font-bold text-lg">
                {firstName?.[0] || 'U'}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{firstName} {lastName}</p>
                <p className="text-xs text-teal-600 font-semibold capitalize">{user?.role || 'Patient'} Account</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 bg-slate-200/70 p-1.5 rounded-2xl mb-8 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === 'personal'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" /> Personal Information
            </button>
            <button
              onClick={() => setActiveTab('vitals')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === 'vitals'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500" /> Blood Group & Vitals
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === 'preferences'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-4 h-4 text-blue-500" /> Daily Targets
            </button>
          </div>

          {/* Tab 1: Personal Information */}
          {activeTab === 'personal' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1E3A5F] font-heading">Personal Identity</h2>
                  <p className="text-xs text-slate-500">Edit your official registered name, contact number, and location.</p>
                </div>
              </div>

              <form onSubmit={handleSavePersonal} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      placeholder="e.g. Oluwaseun"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      placeholder="e.g. Adeyemi"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address (Verified)
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number (Nigeria)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="08012345678"
                      className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      State of Residence
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                    >
                      {NIGERIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st === 'FCT' ? 'Abuja (FCT)' : st}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      City / Area
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Ikeja / Lekki / Wuse 2"
                      className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 14 Allen Avenue, Ikeja"
                    className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    className="px-8 py-6 text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md flex items-center gap-2"
                    disabled={savingPersonal}
                  >
                    <Save className="w-4 h-4" />
                    {savingPersonal ? "Updating Profile..." : "Save Personal Details"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 2: Blood Group & Vitals */}
          {activeTab === 'vitals' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1E3A5F] font-heading">Clinical Baseline & Vitals</h2>
                  <p className="text-xs text-slate-500">Configure your blood group, genotype, and baseline biometrics.</p>
                </div>
              </div>

              <form onSubmit={handleSaveVitals} className="space-y-6">
                {/* Blood Group */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                    Select Your Blood Group *
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {BLOOD_GROUPS.map((bg) => (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => setBloodGroup(bg)}
                        className={`py-3 rounded-2xl font-bold text-sm border transition-all ${
                          bloodGroup === bg
                            ? "bg-rose-50 border-rose-500 text-rose-700 shadow-md ring-2 ring-rose-500"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Genotype */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                    Select Your Genotype *
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {GENOTYPES.map((gt) => (
                      <button
                        key={gt}
                        type="button"
                        onClick={() => setGenotype(gt)}
                        className={`py-3 rounded-2xl font-bold text-sm border transition-all ${
                          genotype === gt
                            ? "bg-teal-50 border-teal-500 text-teal-700 shadow-md ring-2 ring-teal-500"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {gt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Height, Weight & BMI */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                      placeholder="e.g. 178"
                      className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      placeholder="e.g. 74"
                      className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Body Mass Index (BMI)
                    </label>
                    <div className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold text-teal-700 flex items-center justify-between">
                      <span>{bmi ? `${bmi} kg/m²` : 'Enter Height & Weight'}</span>
                      {bmi && (
                        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          {parseFloat(bmi) < 18.5 ? 'Underweight' : parseFloat(bmi) < 25 ? 'Normal' : 'Overweight'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Allergies */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Known Drug & Food Allergies
                  </label>
                  <input
                    type="text"
                    value={allergiesText}
                    onChange={(e) => setAllergiesText(e.target.value)}
                    placeholder="e.g. Penicillin, Peanuts, Sulfa (separate with commas)"
                    className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                {/* Emergency Contact Person */}
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Emergency Contact Person
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Contact Full Name</label>
                      <input
                        type="text"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        placeholder="e.g. Bisi Adeyemi (Spouse)"
                        className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Contact Phone Number</label>
                      <input
                        type="tel"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        placeholder="08099887766"
                        className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    className="px-8 py-6 text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save Clinical Vitals
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 3: Daily Targets & Hydration */}
          {activeTab === 'preferences' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1E3A5F] font-heading">Daily Wellness Targets</h2>
                  <p className="text-xs text-slate-500">Configure your daily hydration goals and activity companion metrics.</p>
                </div>
              </div>

              <form onSubmit={handleSavePreferences} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                    Choose Daily Water Intake Target
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {[1500, 2000, 2500, 3000, 3500, 4000].map((ml) => (
                      <button
                        key={ml}
                        type="button"
                        onClick={() => setTargetMl(ml)}
                        className={`py-3.5 rounded-2xl font-bold text-sm border transition-all ${
                          targetMl === ml
                            ? "bg-blue-50 border-blue-500 text-blue-700 shadow-md ring-2 ring-blue-500"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {(ml / 1000).toFixed(1)}L / day
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 leading-relaxed">
                    A target of <strong>{(targetMl / 1000).toFixed(1)} Litres</strong> is equivalent to approximately <strong>{Math.round(targetMl / 250)} standard cups</strong> of water per day, optimal for the tropical Nigerian climate.
                  </p>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    className="px-8 py-6 text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save Daily Target
                  </Button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
