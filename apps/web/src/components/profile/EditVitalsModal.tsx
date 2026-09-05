"use client";

import { useState } from "react";
import { useProfileStore } from "@/stores/useProfileStore";
import { toast } from "sonner";
import { X, Heart, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditVitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const GENOTYPES = ['AA', 'AS', 'SS', 'AC'];

export function EditVitalsModal({ isOpen, onClose }: EditVitalsModalProps) {
  const profile = useProfileStore();
  
  const [bloodGroup, setBloodGroup] = useState(profile.bloodGroup === 'Not Set' ? 'O+' : profile.bloodGroup);
  const [genotype, setGenotype] = useState(profile.genotype === 'Not Set' ? 'AA' : profile.genotype);
  const [heightCm, setHeightCm] = useState(profile.heightCm?.toString() || '');
  const [weightKg, setWeightKg] = useState(profile.weightKg?.toString() || '');
  const [allergiesText, setAllergiesText] = useState(profile.allergies.join(', ') || '');
  const [emergencyName, setEmergencyName] = useState(profile.emergencyContactName || '');
  const [emergencyPhone, setEmergencyPhone] = useState(profile.emergencyContactPhone || '');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
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
    toast.success("Health vitals & profile updated successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-[#1E3A5F] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Heart className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading">Set Health Profile & Vitals</h2>
              <p className="text-xs text-slate-300">Customize your clinical baseline & emergency information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 text-slate-800">
          {/* Blood Group Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Blood Group *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_GROUPS.map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setBloodGroup(bg)}
                  className={`py-2.5 rounded-xl font-bold text-sm border transition-all ${
                    bloodGroup === bg
                      ? "bg-rose-50 border-rose-500 text-rose-700 shadow-sm ring-1 ring-rose-500"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Genotype Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Genotype *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {GENOTYPES.map((gt) => (
                <button
                  key={gt}
                  type="button"
                  onClick={() => setGenotype(gt)}
                  className={`py-2.5 rounded-xl font-bold text-sm border transition-all ${
                    genotype === gt
                      ? "bg-teal-50 border-teal-500 text-teal-700 shadow-sm ring-1 ring-teal-500"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {gt}
                </button>
              ))}
            </div>
          </div>

          {/* Height & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="e.g. 175"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="e.g. 70"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          {/* Known Allergies */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Known Allergies</label>
            <input
              type="text"
              value={allergiesText}
              onChange={(e) => setAllergiesText(e.target.value)}
              placeholder="e.g. Penicillin, Peanuts, Sulfa drugs (comma separated)"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          {/* Emergency Contact */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Emergency Contact Person
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Contact Full Name</label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="e.g. Spouse / Parent"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="08012345678"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 py-5 rounded-xl border-slate-200 text-slate-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 py-5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md"
            >
              Save Vitals
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
