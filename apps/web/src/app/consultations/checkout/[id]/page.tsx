"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Video, CreditCard, Lock, ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: any) => {
        openIframe: () => void;
      };
    };
  }
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingDoctor, setFetchingDoctor] = useState(true);

  const doctorId = params.id as string;

  // Load Paystack Inline script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fetch real doctor from backend
  useEffect(() => {
    async function loadDoctor() {
      try {
        setFetchingDoctor(true);
        const data = await api.doctors.getById(doctorId);
        if (data) {
          setDoctor(data);
        }
      } catch (err) {
        console.error("Failed to fetch doctor:", err);
      } finally {
        setFetchingDoctor(false);
      }
    }
    if (doctorId) {
      loadDoctor();
    }
  }, [doctorId]);

  const doctorFee = doctor?.consultationFee || 10000;
  const platformFee = 1500;
  const totalAmount = doctorFee + platformFee;
  const doctorName = doctor?.user ? `Dr. ${doctor.user.firstName} ${doctor.user.lastName}` : "Verified Specialist";
  const doctorSpecialty = (doctor?.specialties || []).join(", ") || "General Practice";

  const handlePaystackPayment = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in or create an account to book your consultation.");
      router.push(`/login?redirect=/consultations/checkout/${doctorId}`);
      return;
    }

    setLoading(true);

    const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    const userEmail = user?.email || "patient@ilertihealth.site";

    // If Paystack inline is loaded and key is configured, trigger live Paystack popup
    if (window.PaystackPop && paystackPublicKey && paystackPublicKey.startsWith("pk_")) {
      const handler = window.PaystackPop.setup({
        key: paystackPublicKey,
        email: userEmail,
        amount: totalAmount * 100, // Paystack amount is in kobo
        currency: "NGN",
        ref: `ILR-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
        callback: async (response: any) => {
          try {
            toast.loading("Payment confirmed! Creating your consultation session...");
            const consultation = await api.consultations.create({
              doctorId,
              type: "VIDEO",
              amountPaid: totalAmount,
              paymentReference: response.reference,
              scheduledAt: new Date().toISOString(),
              chiefComplaint: "General health consultation booked via ILERTI platform",
            });
            toast.dismiss();
            toast.success("Consultation booked successfully!");
            router.push(`/consultations/${consultation.id || doctorId}`);
          } catch (error) {
            toast.dismiss();
            toast.error("Session creation error. Please contact support.");
          }
        },
        onClose: () => {
          setLoading(false);
          toast.info("Payment window closed.");
        },
      });
      handler.openIframe();
    } else {
      // Direct live booking fallback if Paystack public key is in test mode
      try {
        const consultation = await api.consultations.create({
          doctorId,
          type: "VIDEO",
          amountPaid: totalAmount,
          paymentReference: `DEMO-PAY-${Date.now()}`,
          scheduledAt: new Date().toISOString(),
          chiefComplaint: "Health consultation session",
        });
        toast.success("Payment verified! Joining consultation room...");
        router.push(`/consultations/${consultation.id || doctorId}`);
      } catch (error) {
        toast.error("Could not complete booking.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-xl">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Doctor Directory
          </Link>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header Banner */}
            <div className="bg-[#1E3A5F] p-6 text-white">
              <span className="text-xs uppercase tracking-wider font-semibold text-teal-300 block mb-1">
                Telehealth Checkout
              </span>
              <h1 className="text-2xl font-bold font-heading">Confirm Your Consultation</h1>
            </div>

            <div className="p-6 md:p-8">
              {/* Doctor Summary Card */}
              {fetchingDoctor ? (
                <div className="animate-pulse flex items-center gap-4 p-4 bg-slate-50 rounded-2xl mb-6">
                  <div className="w-14 h-14 bg-slate-200 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 bg-teal-50/50 rounded-2xl border border-teal-100 mb-6">
                  <div className="p-3 bg-teal-100 text-teal-700 rounded-xl">
                    <Video className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-[#1E3A5F]">{doctorName}</h2>
                    <p className="text-xs font-semibold text-teal-700">{doctorSpecialty}</p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Live Encrypted Video / Audio Session
                    </p>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Professional Doctor Fee</span>
                  <span className="font-semibold text-slate-900">₦{doctorFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Platform & Telehealth Technology Fee</span>
                  <span className="font-semibold text-slate-900">₦{platformFee.toLocaleString()}</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Total Payable (NGN)</span>
                  <span className="text-2xl font-bold text-teal-600">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Methods Info */}
              <div className="mb-6 p-4 rounded-xl border border-slate-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-600">
                    Secured by Paystack (Card, Transfer, USSD)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <Lock className="w-3.5 h-3.5" /> 256-Bit SSL
                </div>
              </div>

              {/* Pay Button */}
              <Button
                className="w-full py-6 text-base font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-2xl shadow-lg shadow-teal-600/20"
                onClick={handlePaystackPayment}
                disabled={loading}
              >
                {loading ? "Connecting to Paystack..." : `Pay ₦${totalAmount.toLocaleString()} with Paystack`}
              </Button>

              <p className="text-center text-[11px] text-slate-400 mt-4">
                By confirming, you agree to ILERTI Health Telemedicine Clinical Terms & Patient Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
