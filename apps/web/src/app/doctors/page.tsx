"use client";

import Link from 'next/link';
import { useDoctorStore } from '@/stores/useDoctorStore';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock } from 'lucide-react';

export default function DoctorsPage() {
  const doctors = useDoctorStore((state) => state.doctors);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1E3A5F] mb-2">Verified Doctor Network</h1>
            <p className="text-gray-600">Connect with top healthcare professionals across Nigeria.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="border border-gray-200 rounded-2xl p-6 shadow-sm bg-white hover:shadow-md transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold text-xl">
                      {doctor.fullName.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-[#1E3A5F]">{doctor.fullName}</h2>
                      <p className="text-sm font-medium text-[#0D9488]">{doctor.primarySpecialty}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  {doctor.status === 'verified' ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1.5 w-fit">
                      <CheckCircle className="w-3.5 h-3.5" />
                      MDCN Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1.5 w-fit">
                      <Clock className="w-3.5 h-3.5" />
                      Pending Verification
                    </Badge>
                  )}
                  {doctor.isSelfRegistered && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mt-2">
                      Self-Registered Practitioner
                    </Badge>
                  )}
                </div>

                <div className="mb-6 space-y-2 text-sm text-gray-700">
                  <p className="flex justify-between">
                    <span className="text-gray-500">Hospital:</span>
                    <span className="font-medium">{doctor.hospitalAffiliation}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-medium">{doctor.cityOfPractice}, {doctor.stateOfPractice}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Fee:</span>
                    <span className="font-bold text-gray-900">₦{doctor.consultationFee.toLocaleString()}</span>
                  </p>
                </div>
                <Link href={`/doctors/${doctor.id}`} className="block w-full text-center bg-[#0D9488] text-white py-2.5 rounded-xl hover:bg-[#0f766e] font-medium transition">
                  View Profile & Book
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
