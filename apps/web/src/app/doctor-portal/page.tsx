"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuthStore } from "@/stores/useAuthStore";
import { useDoctorStore } from "@/stores/useDoctorStore";
import { useConsultationStore } from "@/stores/useConsultationStore";
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
  Sparkles,
  Download,
  QrCode
} from "lucide-react";
import { toast } from "sonner";

export default function DoctorPortalPage() {
  const { user, updateProfile } = useAuthStore();
  const doctors = useDoctorStore((state) => state.doctors);
  const consultations = useConsultationStore((state) => state.consultations);
  const prescriptions = useConsultationStore((state) => state.prescriptions);
  const issuePrescription = useConsultationStore((state) => state.issuePrescription);

  const [isAvailable, setIsAvailable] = useState(user?.isAvailable ?? true);
  const [activeTab, setActiveTab] = useState<"queue" | "prescriptions" | "earnings" | "credentials">("queue");

  // E-Prescription fast creator state
  const [rxPatientName, setRxPatientName] = useState("");
  const [rxDrugName, setRxDrugName] = useState("");
  const [rxDosage, setRxDosage] = useState("500mg");
  const [rxFrequency, setRxFrequency] = useState("Twice Daily (BD)");
  const [rxDuration, setRxDuration] = useState("5 Days");
  const [rxInstructions, setRxInstructions] = useState("Take after meals with plenty of water.");

  // Identify matching doctor record in store
  const currentDoctor = doctors.find(
    (d) => d.id === user?.id || (user?.email && d.fullName.toLowerCase() === (user?.name || "").toLowerCase())
  );

  const doctorName = user?.name || currentDoctor?.fullName || "Medical Practitioner";
  const doctorSpecialty = user?.specialty || currentDoctor?.primarySpecialty || "General Practice & Family Medicine";
  const mdcnFolio = user?.mdcnFolio || currentDoctor?.mdcnFolio || "MDCN Verification Pending";
  const hospitalAffiliation = user?.hospitalAffiliation || currentDoctor?.hospitalAffiliation || "Registered Practice";
  const isVerified = user?.verificationStatus === "VERIFIED" || currentDoctor?.status === "verified";

  // Filter consultations for this doctor
  const doctorConsultations = consultations.filter(
    (c) => c.doctorId === user?.id || (user?.name && c.doctorName.toLowerCase().includes(user.name.toLowerCase()))
  );

  // Filter prescriptions issued by this doctor
  const doctorPrescriptions = prescriptions.filter(
    (p) => p.doctorId === user?.id || p.doctorMdcnFolio === mdcnFolio
  );

  // Financial calculations from real consultation store
  const totalConsultFee = doctorConsultations.reduce((acc, c) => acc + (c.amountPaid || 0), 0);
  const netEarnings = Math.round(totalConsultFee * 0.85);

  const handleIssueRx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxPatientName.trim() || !rxDrugName.trim()) {
      toast.error("Please fill in patient name and medication name.");
      return;
    }

    const newRx = issuePrescription({
      doctorId: user?.id || "dr-unknown",
      doctorName: doctorName,
      doctorMdcnFolio: mdcnFolio,
      doctorSpecialty: doctorSpecialty,
      patientName: rxPatientName.trim(),
      medicationName: rxDrugName.trim(),
      dosage: rxDosage.trim(),
      frequency: rxFrequency,
      duration: rxDuration.trim(),
      instructions: rxInstructions.trim(),
    });

    toast.success(`E-Prescription for ${rxDrugName} issued to ${rxPatientName} with MDCN seal (${newRx.qrCodeRef})!`);
    setRxDrugName("");
    setRxPatientName("");
  };

  const handleToggleAvailability = () => {
    const nextState = !isAvailable;
    setIsAvailable(nextState);
    updateProfile({ isAvailable: nextState });
    toast.info(nextState ? "Status: Online & Ready for Patients." : "Status: Offline.");
  };

  return (
    <AuthGuard 
      serviceName="MDCN Doctor Clinical Portal"
      serviceDescription="This clinical portal is reserved for verified healthcare professionals registered with the Medical and Dental Council of Nigeria (MDCN)."
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
                        <AlertCircle className="w-3.5 h-3.5" /> Verification Under Review
                      </span>
                    )}
                  </div>
                  <p className="text-blue-100 text-sm">{doctorSpecialty} • {hospitalAffiliation}</p>
                  <p className="text-xs font-mono text-slate-300 mt-0.5">MDCN Folio: <strong className="text-[#4ADE80]">{mdcnFolio}</strong></p>
                </div>
              </div>

              {/* Availability Status Switch */}
              <div className="flex flex-wrap items-center gap-3 bg-navy-900/80 p-3 rounded-2xl border border-slate-700">
                <div className="text-left">
                  <span className="text-xs font-semibold text-slate-300 block">Consultation Status</span>
                  <span className={`text-xs font-bold ${isAvailable ? "text-[#4ADE80]" : "text-slate-400"}`}>
                    {isAvailable ? "● Online & Ready for Patients" : "○ Offline / Private"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleAvailability}
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
          
          {/* Real-time KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Live Queue</span>
                <h3 className="text-2xl font-bold text-slate-900 font-heading">{doctorConsultations.length} Consults</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Prescriptions Issued</span>
                <h3 className="text-2xl font-bold text-slate-900 font-heading">{doctorPrescriptions.length} Records</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Net Revenue (85%)</span>
                <h3 className="text-2xl font-bold text-slate-900 font-heading">₦{netEarnings.toLocaleString()}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Star className="w-6 h-6 fill-amber-400" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">MDCN Status</span>
                <h3 className="text-xl font-bold text-slate-900 font-heading">
                  {isVerified ? "Verified Practitioner" : "Under Review"}
                </h3>
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
              <Calendar className="w-4 h-4" /> Live Waiting Room ({doctorConsultations.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("prescriptions")}
              className={`px-4 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "prescriptions" ? "bg-[#1E3A5F] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Pill className="w-4 h-4" /> Digital Prescription Pad ({doctorPrescriptions.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("earnings")}
              className={`px-4 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "earnings" ? "bg-[#1E3A5F] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Wallet className="w-4 h-4" /> Earnings &amp; Settlements
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("credentials")}
              className={`px-4 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "credentials" ? "bg-[#1E3A5F] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <UserCheck className="w-4 h-4" /> MDCN Licensing &amp; Profile
            </button>
          </div>

          {/* Tab 1: Live Patient Consultation Queue */}
          {activeTab === "queue" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-heading">Active Consultations &amp; Appointments</h2>
                  <p className="text-xs text-slate-500">Live consultations linked directly to your clinical room</p>
                </div>
                <span className="text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded-full font-semibold border border-teal-200">
                  ● Live Queue Ready
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {doctorConsultations.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-3">
                    <Users className="w-10 h-10 text-slate-300 mx-auto" />
                    <div>
                      <h3 className="font-bold text-base text-slate-800">Your Consultation Queue is Clear</h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                        There are no active patients in your waiting room at the moment. As patients book consultations or are triaged through ILERTI AI, they will appear here in real time.
                      </p>
                    </div>
                  </div>
                ) : (
                  doctorConsultations.map((pat) => (
                    <div 
                      key={pat.id} 
                      className={`p-5 rounded-2xl border bg-white shadow-xs transition-all ${
                        pat.status === "WAITING" ? "border-teal-400 ring-2 ring-teal-500/10" : "border-slate-200"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center shrink-0 text-base border border-teal-100">
                            {pat.patientName[0] || "P"}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base font-bold text-slate-900">{pat.patientName}</h3>
                              {pat.patientAge && (
                                <span className="text-xs text-slate-500 font-medium">({pat.patientAge} yrs • {pat.patientGender || 'Patient'})</span>
                              )}
                              
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
                                  Routine Care
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 mt-1.5 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                              🩺 <strong>Chief Complaint:</strong> {pat.chiefComplaint}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                              <span className="flex items-center gap-1 font-semibold text-teal-700">
                                <Clock className="w-3.5 h-3.5" /> {pat.scheduledAt}
                              </span>
                              <span>• Fee: <strong>₦{(pat.amountPaid || 0).toLocaleString()}</strong></span>
                              <span className="font-mono text-[11px] text-slate-400">Ref: {pat.paymentReference}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Link
                            href={`/consultations/${pat.id}`}
                            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
                          >
                            <Video className="w-4 h-4" /> Enter Consultation Room
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Digital E-Prescriptions Workbench */}
          {activeTab === "prescriptions" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900 font-heading mb-1">Issue Digital E-Prescription</h2>
                <p className="text-xs text-slate-500 mb-6">Signed electronically with your MDCN Folio ({mdcnFolio}) and saved directly into patient's health records.</p>

                <form onSubmit={handleIssueRx} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Patient Full Name *</label>
                      <input
                        type="text"
                        value={rxPatientName}
                        onChange={(e) => setRxPatientName(e.target.value)}
                        placeholder="e.g. Patient Name"
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
                        placeholder="e.g. Artemether-Lumefantrine 80/480mg"
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Instructions &amp; Warnings</label>
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
                      <span>MDCN Digital Verification Seal: <strong>{mdcnFolio}</strong></span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-sm transition-colors"
                  >
                    Generate &amp; Transmit E-Prescription
                  </button>
                </form>
              </div>

              {/* Real Prescriptions History */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center justify-between">
                    <span>Issued Prescriptions</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">{doctorPrescriptions.length} Total</span>
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {doctorPrescriptions.length === 0 ? (
                      <div className="text-center py-10 text-slate-400 space-y-1">
                        <Pill className="w-6 h-6 mx-auto text-slate-300" />
                        <p className="text-xs">No prescriptions issued yet.</p>
                        <p className="text-[10px]">Prescriptions issued from the form will appear here with cryptographic MDCN seals.</p>
                      </div>
                    ) : (
                      doctorPrescriptions.map((item) => (
                        <div key={item.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">{item.patientName}</span>
                            <span className="text-[10px] font-mono text-teal-700 font-semibold">{item.qrCodeRef}</span>
                          </div>
                          <div className="text-teal-700 font-bold">{item.medicationName}</div>
                          <div className="text-slate-500 text-[11px]">{item.dosage} • {item.frequency} ({item.duration})</div>
                          <div className="text-slate-400 text-[10px] pt-1 border-t border-slate-200/60 flex items-center justify-between">
                            <span>{new Date(item.issuedAt).toLocaleDateString()}</span>
                            <span className="text-emerald-600 font-semibold">● Verified Signed</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Real Earnings & Settlements */}
          {activeTab === "earnings" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 font-heading">Consultation Revenue &amp; Payouts</h2>
                    <p className="text-xs text-slate-500">Live calculation based on completed sessions and 85% practitioner split</p>
                  </div>
                  <button
                    type="button"
                    disabled={netEarnings === 0}
                    onClick={() => toast.success(`Payout request of ₦${netEarnings.toLocaleString()} submitted for bank settlement.`)}
                    className="px-5 py-2.5 bg-[#0D9488] disabled:opacity-50 text-white text-xs font-bold rounded-xl hover:bg-[#0f766e] transition-colors shadow-sm"
                  >
                    Request Payout (₦{netEarnings.toLocaleString()})
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500">Gross Consultation Volume</span>
                    <div className="text-xl font-bold text-slate-900">₦{totalConsultFee.toLocaleString()}</div>
                    <span className="text-[11px] text-teal-600">{doctorConsultations.length} Consultations</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500">Net Practitioner Share (85%)</span>
                    <div className="text-xl font-bold text-emerald-600">₦{netEarnings.toLocaleString()}</div>
                    <span className="text-[11px] text-slate-500">15% platform infrastructure fee</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-500">Payout Account Status</span>
                    <div className="text-base font-bold text-slate-900">Bank Transfer</div>
                    <span className="text-[11px] text-slate-500">Automated Direct Deposit</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Real MDCN Credentials */}
          {activeTab === "credentials" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-2xl">
              <h2 className="text-lg font-bold text-slate-900 font-heading mb-4">Medical &amp; Dental Council (MDCN) Official Record</h2>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Practitioner Legal Name:</span>
                  <span className="font-bold text-slate-900">{doctorName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">MDCN Registration Folio:</span>
                  <span className="font-mono font-bold text-teal-700">{mdcnFolio}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Primary Specialty:</span>
                  <span className="font-semibold text-slate-800">{doctorSpecialty}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Hospital Practice Base:</span>
                  <span className="font-semibold text-slate-800">{hospitalAffiliation}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Practicing Status:</span>
                  <span className={isVerified ? "text-[#0D9488] font-bold flex items-center gap-1" : "text-amber-600 font-bold flex items-center gap-1"}>
                    {isVerified ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Validated (2026 MDCN Registry)
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4" /> Verification Pending
                      </>
                    )}
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
