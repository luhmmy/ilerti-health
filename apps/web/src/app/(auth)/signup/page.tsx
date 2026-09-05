"use client";

import { useState } from "react";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { Check, X, Eye, EyeOff, ShieldCheck, User, Stethoscope } from "lucide-react";

export default function SignupPage() {
  const [isDoctor, setIsDoctor] = useState(false);
  
  // Names & Contact
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Passwords
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Doctor specific fields
  const [mdcnFolio, setMdcnFolio] = useState("");
  const [primarySpecialty, setPrimarySpecialty] = useState("General Practice");
  const [hospitalAffiliation, setHospitalAffiliation] = useState("");
  const [stateOfPractice, setStateOfPractice] = useState("Lagos");
  const [cityOfPractice, setCityOfPractice] = useState("");
  const [consultationFee, setConsultationFee] = useState("10000");
  const [languages, setLanguages] = useState<string[]>(["English"]);
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(false);

  const register = useAuthStore((state) => state.register);
  const router = useRouter();

  // Password Policy Rules
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[@$!%*?&_\-#]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial && passwordsMatch;

  const handleLanguageToggle = (lang: string) => {
    setLanguages((prev) => 
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      if (!passwordsMatch) {
        toast.error("Passwords do not match!");
      } else {
        toast.error("Please meet all password security requirements.");
      }
      return;
    }

    setLoading(true);
    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        role: isDoctor ? "DOCTOR" : "PATIENT",
        isDoctor,
        mdcnFolio: mdcnFolio.trim(),
        primarySpecialty,
        hospitalAffiliation: hospitalAffiliation.trim(),
        stateOfPractice,
        cityOfPractice: cityOfPractice.trim(),
        consultationFee: Number(consultationFee),
        languages,
        bio: bio.trim(),
      });

      toast.success(
        isDoctor 
          ? `Welcome Dr. ${firstName} ${lastName}! Practitioner account created.` 
          : "Account created successfully! Welcome to ILERTI Health."
      );
      router.push("/dashboard");
    } catch (error: any) {
      const msg = error?.message || "Failed to create account. Please check your details.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 my-8">
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1E3A5F] font-heading">
          Create Your ILERTI Account
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Join Nigeria&apos;s digital health ecosystem for preventive, lifelong care.
        </p>
      </div>
      
      {/* Role Selection Tabs */}
      <div className="flex gap-2 mb-6 bg-slate-100 p-1.5 rounded-2xl">
        <button
          type="button"
          onClick={() => setIsDoctor(false)}
          className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            !isDoctor ? "bg-white text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <User className="w-4 h-4" /> Patient
        </button>
        <button
          type="button"
          onClick={() => setIsDoctor(true)}
          className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
            isDoctor ? "bg-white text-teal-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Stethoscope className="w-4 h-4" /> MDCN Doctor
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              placeholder="e.g. Oluwaseun"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              placeholder="e.g. Adeyemi"
              required
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (Nigeria)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              placeholder="08012345678"
            />
          </div>
        </div>

        {/* Doctor Specific Fields */}
        {isDoctor && (
          <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100 space-y-3">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
              Medical & Dental Council (MDCN) Verification
            </span>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">MDCN Folio Number *</label>
              <input
                type="text"
                value={mdcnFolio}
                onChange={(e) => setMdcnFolio(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="MDCN/2021/89402"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Specialty *</label>
                <select
                  value={primarySpecialty}
                  onChange={(e) => setPrimarySpecialty(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value="General Practice">General Practice</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Paediatrics">Paediatrics</option>
                  <option value="Obstetrics & Gynaecology">Obstetrics & Gynaecology</option>
                  <option value="Family Medicine">Family Medicine</option>
                  <option value="Internal Medicine">Internal Medicine</option>
                  <option value="Endocrinology">Endocrinology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Orthopaedics">Orthopaedics</option>
                  <option value="Psychiatry">Psychiatry</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Consultation Fee (₦) *</label>
                <input
                  type="number"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="10000"
                  min="3000"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital / Clinic Practice Affiliation</label>
              <input
                type="text"
                value={hospitalAffiliation}
                onChange={(e) => setHospitalAffiliation(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="e.g. Lagos University Teaching Hospital"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Languages Spoken</label>
              <div className="flex flex-wrap gap-1.5">
                {['English', 'Yoruba', 'Igbo', 'Hausa', 'Pidgin'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleLanguageToggle(lang)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors border ${
                      languages.includes(lang)
                        ? "bg-teal-600 border-teal-600 text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-3.5 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Create a strong password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password *</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full pl-3.5 pr-10 py-2.5 text-sm border rounded-xl focus:ring-2 outline-none ${
                confirmPassword.length > 0 && !passwordsMatch
                  ? "border-rose-400 focus:ring-rose-400 bg-rose-50/20"
                  : "border-slate-200 focus:ring-teal-500"
              }`}
              placeholder="Re-enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Strict Password Policy Checklist */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs text-slate-600">
          <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider mb-1">
            Password Security Requirements:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
              {hasMinLength ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              <span>At least 8 characters</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasUppercase ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
              {hasUppercase ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              <span>1 uppercase letter (A-Z)</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasLowercase ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
              {hasLowercase ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              <span>1 lowercase letter (a-z)</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
              {hasNumber ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              <span>1 number (0-9)</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasSpecial ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
              {hasSpecial ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              <span>1 special char (@$!%*?&)</span>
            </div>
            <div className={`flex items-center gap-1.5 ${passwordsMatch ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
              {passwordsMatch ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              <span>Passwords match</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full py-5 text-base font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md transition-all mt-2"
          disabled={loading}
        >
          {loading ? "Creating secure account..." : isDoctor ? "Register as MDCN Doctor" : "Create Patient Account"}
        </Button>
      </form>
      
      <p className="mt-6 text-center text-xs text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="text-teal-600 font-bold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
