"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuthStore } from "@/stores/useAuthStore";
import { 
  Stethoscope, 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Pill, 
  Wallet, 
  Star, 
  Activity, 
  UserCheck, 
  Plus, 
  ArrowUpRight, 
  ShieldCheck, 
  Building2, 
  ToggleLeft, 
  ToggleRight,
  ExternalLink,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

interface QueuePatient {
  id: string;
  consultationId: string;
  name: string;
  age: number;
  gender: string;
  chiefComplaint: string;
  urgency: "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";
  type: "VIDEO" | "AUDIO" | "CHAT";
  timeSlot: string;
  status: "WAITING" | "SCHEDULED" | "COMPLETED";
  fee: number;
}

export default function DoctorPortalPage() {
  const { user } = useAuthStore();
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeTab, setActiveTab] = useState<"queue" | "prescriptions" | "earnings" | "credentials">("queue");

  // Mock patient queue for the doctor
  const [patients, setPatients] = useState<QueuePatient[]>([
    {
      id: "pat-101",
      consultationId: "c-101",
      name: "Chinedu Okafor",
      age: 34,
      gender: "Male",
      chiefComplaint: "Severe fever, recurrent chills, and joint pain for 3 days.",
      urgency: "HIGH",
      type: "VIDEO",
      timeSlot: "Now (Waiting in room)",
      status: "WAITING",
      fee: 10000,
    },
    {
      id: "pat-102",
      consultationId: "c-102",
      name: "Amina Bello",
      age: 28,
      gender: "Female",
      chiefComplaint: "Follow-up on gestational blood pressure and routine antenatal check.",
      urgency: "MEDIUM",
      type: "VIDEO",
      timeSlot: "Today • 2:30 PM",
      status: "SCHEDULED",
      fee: 12000,
    },
    {
      id: "pat-103",
      consultationId: "c-103",
      name: "Babajide Adeleke",
      age: 45,
      gender: "Male",
      chiefComplaint: "Type-2 Diabetes routine medication titration and fasting blood sugar review.",
      urgency: "LOW",
      type: "CHAT",
      timeSlot: "Today • 4:15 PM",
      status: "SCHEDULED",
      fee: 7500,
    },
    {
      id: "pat-104",
      consultationId: "c-104",
      name: "Ngozi Eze",
      age: 22,
      gender: "Female",
      chiefComplaint: "Acute allergic rash and itching after new medication.",
      urgency: "MEDIUM",
      type: "AUDIO",
      timeSlot: "Today • 5:00 PM",
      status: "SCHEDULED",
      fee: 8000,
    }
  ]);

  // E-Prescription fast creator state
  const [rxPatientName, setRxPatientName] = useState("");
  const [rxDrugName, setRxDrugName] = useState("");
  const [rxDosage, setRxDosage] = useState("500mg");
  const [rxFrequency, setRxFrequency] = useState("Twice Daily (BD)");
  const [rxDuration, setRxDuration] = useState("5 Days");
  const [rxInstructions, setRxInstructions] = useState("Take after meals with plenty of water.");

  const handleIssueRx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxPatientName || !rxDrugName) {
      toast.error("Please fill in patient name and medication name.");
      return;
    }
    toast.success(`E-Prescription for ${rxDrugName} issued to ${rxPatientName} with MDCN digital stamp!`);
    setRxDrugName("");
    setRxPatientName("");
  };

  const doctorName = user?.name || "Dr. Funmilayo Adeleke";
  const doctorSpecialty = user?.specialty || "General Practice & Family Medicine";
  const mdcnFolio = user?.mdcnFolio || "MDCN/2021/89402";
  const hospitalAffiliation = user?.hospitalAffiliation || "Lagos University Teaching Hospital";
  const isVerified = user?.verificationStatus === "VERIFIED" || true;

  return (
    <AuthGuard 
      serviceName="MDCN Doctor Clinical Portal"
      serviceDescription="This area is reserved for verified medical doctors and healthcare professionals. Please sign in or register with your MDCN folio."
    >
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />

      {/* Top Doctor Banner */}
      <div className="bg-[#1E3A5F] text-white border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-600 border-2 border-teal-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">
                <Stethoscope className="w-8 h-8" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold font-heading">{doctorName}</h1>
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 bg-[#4ADE80]/20 text-[#4ADE80] border border-[#4ADE80]/40 px-2.5 py-0.5 rounded-full text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" /> MDCN Verified Practitioner
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full text-xs font-bold">
                      <AlertCircle className="w-3.5 h-3.5" /> Verification Pending
                    </span>
                  )}
                </div>
                <p className="text-blue-100 text-sm">{doctorSpecialty} • {hospitalAffiliation}</p>
                <p className="text-xs font-mono text-slate-300 mt-0.5">Folio: <strong className="text-[#4ADE80]">{mdcnFolio}</strong></p>
              </div>
            </div>

            {/* Availability Switch */}
            <div className="flex flex-wrap items-center gap-3 bg-navy-900/80 p-3 rounded-2xl border border-slate-700">
              <div className="text-left">
                <span className="text-xs font-semibold text-slate-300 block">Consultation Status</span>
                <span className={`text-xs font-bold ${isAvailable ? "text-[#4ADE80]" : "text-slate-400"}`}>
                  {isAvailable ? "● Online & Receiving Patients" : "○ Offline / Not Taking Calls"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAvailable(!isAvailable);
                  toast.info(isAvailable ? "Consultation status set to Offline." : "Consultation status set to Online.");
                }}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  isAvailable ? "bg-[#0D9488] text-white" : "bg-slate-700 text-slate-300"
                }`}
              >
                {isAvailable ? <ToggleRight className="w-5 h-5 text-[#4ADE80]" /> : <ToggleLeft className="w-5 h-5" />}
                {isAvailable ? "Available" : "Go Online"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Doctor Dashboard Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500">Today's Queue</span>
              <h3 className="text-2xl font-bold text-slate-900 font-heading">4 Patients</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500">Total Consultations</span>
              <h3 className="text-2xl font-bold text-slate-900 font-heading">142 Done</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500">Available Earnings</span>
              <h3 className="text-2xl font-bold text-slate-900 font-heading">₦385,000</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500">Practitioner Rating</span>
              <h3 className="text-2xl font-bold text-slate-900 font-heading">4.9 ★ <span className="text-xs font-normal text-slate-400">(48 reviews)</span></h3>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab("queue")}
            className={`px-4 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "queue" ? "bg-[#1E3A5F] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Calendar className="w-4 h-4" /> Consultation Queue & Waiting Room
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("prescriptions")}
            className={`px-4 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "prescriptions" ? "bg-[#1E3A5F] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Pill className="w-4 h-4" /> Digital Prescription Pad
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("earnings")}
            className={`px-4 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "earnings" ? "bg-[#1E3A5F] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Wallet className="w-4 h-4" /> Earnings & Paystack Payouts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("credentials")}
            className={`px-4 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "credentials" ? "bg-[#1E3A5F] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <UserCheck className="w-4 h-4" /> MDCN Licensing & Profile
          </button>
        </div>

        {/* Tab 1: Patient Consultation Queue */}
        {activeTab === "queue" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-heading">Active Consultations & Scheduled Visits</h2>
                <p className="text-xs text-slate-500">Patients connected via ILERTI Telehealth network</p>
              </div>
              <span className="text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded-full font-semibold border border-teal-200">
                Live Synchronization Active
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {patients.map((pat) => (
                <div 
                  key={pat.id} 
                  className={`p-5 rounded-2xl border bg-white shadow-xs transition-all ${
                    pat.status === "WAITING" ? "border-teal-400 ring-2 ring-teal-500/10" : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0 text-base">
                        {pat.name[0]}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">{pat.name}</h3>
                          <span className="text-xs text-slate-500 font-medium">({pat.age} yrs • {pat.gender})</span>
                          
                          {pat.urgency === "HIGH" && (
                            <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                              High Urgency
                            </span>
                          )}
                          {pat.urgency === "MEDIUM" && (
                            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                              Moderate
                            </span>
                          )}
                          {pat.urgency === "LOW" && (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                              Routine / Mild
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1 font-medium bg-slate-50 p-2 rounded-lg border border-slate-100">
                          🩺 <strong>Chief Complaint:</strong> {pat.chiefComplaint}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                          <span className="flex items-center gap-1 font-semibold text-teal-700">
                            <Clock className="w-3.5 h-3.5" /> {pat.timeSlot}
                          </span>
                          <span>• Fee: <strong>₦{pat.fee.toLocaleString()}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/consultations/${pat.consultationId}`}
                        className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
                      >
                        <Video className="w-4 h-4" /> Enter Consultation Room
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: E-Prescriptions */}
        {activeTab === "prescriptions" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 font-heading mb-1">Issue Digital E-Prescription</h2>
              <p className="text-xs text-slate-500 mb-6">Signed electronically with your verified MDCN Practitioner Folio</p>

              <form onSubmit={handleIssueRx} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Full Name *</label>
                    <input
                      type="text"
                      value={rxPatientName}
                      onChange={(e) => setRxPatientName(e.target.value)}
                      placeholder="e.g. Chinedu Okafor"
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Medication Name (Generic/Brand) *</label>
                    <input
                      type="text"
                      value={rxDrugName}
                      onChange={(e) => setRxDrugName(e.target.value)}
                      placeholder="e.g. Artemether-Lumefantrine / Coartem"
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Dosage</label>
                    <input
                      type="text"
                      value={rxDosage}
                      onChange={(e) => setRxDosage(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Frequency</label>
                    <select
                      value={rxFrequency}
                      onChange={(e) => setRxFrequency(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl outline-none"
                    >
                      <option value="Once Daily (OD)">Once Daily (OD)</option>
                      <option value="Twice Daily (BD)">Twice Daily (BD)</option>
                      <option value="Three Times Daily (TDS)">Three Times Daily (TDS)</option>
                      <option value="Four Times Daily (QDS)">Four Times Daily (QDS)</option>
                      <option value="When Needed (PRN)">When Needed (PRN)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={rxDuration}
                      onChange={(e) => setRxDuration(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Instructions</label>
                  <textarea
                    rows={2}
                    value={rxInstructions}
                    onChange={(e) => setRxInstructions(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl outline-none resize-none"
                  />
                </div>

                <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 flex items-center justify-between text-xs text-teal-900">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>Digital Seal: <strong>{mdcnFolio}</strong> (Verified by MDCN Nigeria)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-sm transition-colors"
                >
                  Generate & Transmit E-Prescription
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Recent Issued Prescriptions</h3>
              <div className="space-y-3">
                {[
                  { patient: "Babajide Adeleke", drug: "Metformin 500mg", date: "Today • 11:30 AM" },
                  { patient: "Amina Bello", drug: "Methyldopa 250mg", date: "Yesterday" },
                  { patient: "Emeka Nwosu", drug: "Amoxicillin-Clavulanate 625mg", date: "3 days ago" },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="font-bold text-slate-800">{item.patient}</div>
                    <div className="text-teal-700 font-semibold">{item.drug}</div>
                    <div className="text-slate-400 text-[10px] mt-1">{item.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Earnings & Payouts */}
        {activeTab === "earnings" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-heading">Consultation Revenue & Payouts</h2>
                  <p className="text-xs text-slate-500">Automated split-settlements powered by Paystack Nigeria</p>
                </div>
                <button
                  type="button"
                  onClick={() => toast.success("Payout request of ₦385,000 sent to your GTBank account.")}
                  className="px-5 py-2.5 bg-[#0D9488] text-white text-xs font-bold rounded-xl hover:bg-[#0f766e] transition-colors"
                >
                  Request Instant Payout (₦385,000)
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500">Gross Consultation Fee</span>
                  <div className="text-xl font-bold text-slate-900">₦10,000 / consult</div>
                  <span className="text-[11px] text-teal-600">85% Doctor Split (₦8,500 net)</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500">Settled Account</span>
                  <div className="text-base font-bold text-slate-900">Guaranty Trust Bank</div>
                  <span className="text-[11px] font-mono text-slate-500">0123456789 • {doctorName}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500">Last Payout</span>
                  <div className="text-base font-bold text-slate-900">₦210,000</div>
                  <span className="text-[11px] text-slate-500">Settled on 1st Sept 2026</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Credentials */}
        {activeTab === "credentials" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-2xl">
            <h2 className="text-lg font-bold text-slate-900 font-heading mb-4">Medical & Dental Council (MDCN) Credentials</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Practitioner Name:</span>
                <span className="font-bold text-slate-900">{doctorName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">MDCN Folio Number:</span>
                <span className="font-mono font-bold text-teal-700">{mdcnFolio}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Primary Specialty:</span>
                <span className="font-semibold text-slate-800">{doctorSpecialty}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Hospital Affiliation:</span>
                <span className="font-semibold text-slate-800">{hospitalAffiliation}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Annual Practicing License:</span>
                <span className="text-[#0D9488] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Active (2026 Validated)
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
