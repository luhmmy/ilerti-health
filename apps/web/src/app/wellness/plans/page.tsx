"use client";

import { ShieldCheck, Heart, Baby, Activity, UserPlus, Apple } from "lucide-react";

export default function PlansPage() {
  const plans = [
    {
      id: "diabetes",
      title: "ILERTI Diabetes Support",
      icon: <Activity className="w-8 h-8 text-blue-500" />,
      desc: "Comprehensive management for Type 2 Diabetes including specialized Nigerian diets and glucose tracking.",
      color: "bg-blue-50 border-blue-100",
      enrolled: true
    },
    {
      id: "heart",
      title: "Heart Health & BP",
      icon: <Heart className="w-8 h-8 text-red-500" />,
      desc: "Hypertension management, low-sodium local recipes, and stress-reduction routines.",
      color: "bg-red-50 border-red-100",
      enrolled: false
    },
    {
      id: "maternal",
      title: "Pregnancy Wellness",
      icon: <Baby className="w-8 h-8 text-purple-500" />,
      desc: "Trimester-by-trimester guidance, safe exercises, and maternal nutrition.",
      color: "bg-purple-50 border-purple-100",
      enrolled: false
    },
    {
      id: "weight",
      title: "Healthy Weight Management",
      icon: <Apple className="w-8 h-8 text-green-500" />,
      desc: "Sustainable weight loss using accessible Nigerian foods and manageable daily activities.",
      color: "bg-green-50 border-green-100",
      enrolled: false
    },
    {
      id: "aging",
      title: "Healthy Ageing (Senior Care)",
      icon: <UserPlus className="w-8 h-8 text-amber-500" />,
      desc: "Joint health, memory care, and gentle mobility routines for seniors.",
      color: "bg-amber-50 border-amber-100",
      enrolled: false
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1E3A5F]">Special Health Plans</h1>
        <p className="text-gray-600 mt-4">Clinician-reviewed wellness plans designed specifically for the Nigerian lifestyle. Enroll to get customized daily companions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className={`rounded-2xl border p-6 flex flex-col h-full transition-transform hover:-translate-y-1 ${plan.color}`}>
            <div className="mb-4 bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow-sm">
              {plan.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.title}</h3>
            <p className="text-gray-600 mb-6 flex-1">{plan.desc}</p>
            
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-white/50 px-2 py-1 rounded">
                <ShieldCheck className="w-3 h-3 text-[#0D9488]" /> MDCN Reviewed
              </div>
              {plan.enrolled ? (
                <button className="bg-[#1E3A5F] text-white px-4 py-2 rounded-lg text-sm font-medium">
                  View Plan
                </button>
              ) : (
                <button className="bg-white text-[#0D9488] border border-[#0D9488] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#CCFBF1] transition-colors">
                  Enroll Free
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
