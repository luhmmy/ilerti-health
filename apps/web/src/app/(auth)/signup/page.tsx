"use client";

import { useState } from "react";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useDoctorStore } from "../../../stores/useDoctorStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

export default function SignupPage() {
  const [isDoctor, setIsDoctor] = useState(false);
  
  // Patient fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Doctor specific fields
  const [mdcnFolio, setMdcnFolio] = useState("");
  const [primarySpecialty, setPrimarySpecialty] = useState("");
  const [secondarySpecialty, setSecondarySpecialty] = useState("");
  const [hospitalAffiliation, setHospitalAffiliation] = useState("");
  const [stateOfPractice, setStateOfPractice] = useState("");
  const [cityOfPractice, setCityOfPractice] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [bio, setBio] = useState("");

  const register = useAuthStore((state) => state.register);
  const registerDoctor = useDoctorStore((state) => state.registerDoctor);
  const router = useRouter();

  const handleLanguageToggle = (lang: string) => {
    setLanguages((prev) => 
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isDoctor) {
        registerDoctor({
          fullName: name,
          mdcnFolio,
          primarySpecialty,
          secondarySpecialty,
          hospitalAffiliation,
          stateOfPractice,
          cityOfPractice,
          consultationFee: Number(consultationFee),
          languages,
          bio,
        });
        toast.success(`Dr. ${name} successfully registered on ILERTI Doctor Network!`);
        router.push("/doctors");
      } else {
        await register({ name, email, password });
        toast.success("Account created successfully!");
        router.push("/verify");
      }
    } catch (error) {
      toast.error("Failed to create account");
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
      <p className="text-slate-500 mb-8">Join the ILERTI health ecosystem today.</p>
      
      <div className="flex gap-4 mb-8 bg-slate-100 p-1.5 rounded-xl">
        <button
          onClick={() => setIsDoctor(false)}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
            !isDoctor ? "bg-white text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Patient
        </button>
        <button
          onClick={() => setIsDoctor(true)}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
            isDoctor ? "bg-white text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Healthcare Pro
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{isDoctor ? "Doctor Full Name" : "Full Name"}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none"
            placeholder={isDoctor ? "e.g. Dr. John Doe" : "John Doe"}
            required
          />
        </div>
        
        {!isDoctor && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none"
                placeholder="john@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </>
        )}

        {isDoctor && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">MDCN Folio Number</label>
              <input
                type="text"
                value={mdcnFolio}
                onChange={(e) => setMdcnFolio(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none"
                placeholder="MDCN/2020/71234"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Primary Specialty</label>
                <input
                  type="text"
                  value={primarySpecialty}
                  onChange={(e) => setPrimarySpecialty(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none"
                  placeholder="Cardiology"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Secondary Specialty</label>
                <input
                  type="text"
                  value={secondarySpecialty}
                  onChange={(e) => setSecondarySpecialty(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none"
                  placeholder="(Optional)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Hospital / Clinic Affiliation</label>
              <input
                type="text"
                value={hospitalAffiliation}
                onChange={(e) => setHospitalAffiliation(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none"
                placeholder="Lagos University Teaching Hospital"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">State of Practice</label>
                <input
                  type="text"
                  value={stateOfPractice}
                  onChange={(e) => setStateOfPractice(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none"
                  placeholder="Lagos"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City of Practice</label>
                <input
                  type="text"
                  value={cityOfPractice}
                  onChange={(e) => setCityOfPractice(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none"
                  placeholder="Ikeja"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Consultation Fee (₦)</label>
              <input
                type="number"
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none"
                placeholder="10000"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Spoken Languages</label>
              <div className="flex flex-wrap gap-2">
                {['English', 'Yoruba', 'Igbo', 'Hausa', 'Pidgin'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleLanguageToggle(lang)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                      languages.includes(lang)
                        ? "bg-teal-50 border-teal-500 text-teal-700"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Brief Clinical Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none h-24 resize-none"
                placeholder="Tell us about your experience and focus..."
                required
              />
            </div>
          </>
        )}

        <Button type="submit" className="w-full py-6 text-lg font-semibold bg-teal-600 hover:bg-teal-700 rounded-xl mt-4">
          {isDoctor ? "Register as Practitioner" : "Create Account"}
        </Button>
      </form>
      
      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="text-teal-600 font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
