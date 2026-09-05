"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { useDoctorStore } from "@/stores/useDoctorStore";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function VerificationPage() {
  const doctors = useDoctorStore((state) => state.doctors);
  const verifyDoctor = useDoctorStore((state) => state.verifyDoctor);
  const rejectDoctor = useDoctorStore((state) => state.rejectDoctor);

  const pendingDoctors = doctors.filter(d => d.status === 'pending');

  const handleVerify = (id: string, name: string) => {
    verifyDoctor(id);
    toast.success(`${name} has been verified successfully!`);
  };

  const handleReject = (id: string, name: string) => {
    rejectDoctor(id);
    toast.error(`${name} has been rejected.`);
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#1E3A5F]">Doctor Verification Queue</h1>
          <p className="text-gray-600 mt-2">Review and approve self-registered MDCN practitioners.</p>
        </div>
        <Badge className="bg-[#1E3A5F] text-white">
          {pendingDoctors.length} Pending Request{pendingDoctors.length !== 1 ? 's' : ''}
        </Badge>
      </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                  <th className="p-4 font-medium">Doctor Details</th>
                  <th className="p-4 font-medium">MDCN Folio</th>
                  <th className="p-4 font-medium">Hospital</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingDoctors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      No pending verification requests at this time.
                    </td>
                  </tr>
                ) : (
                  pendingDoctors.map(doc => (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{doc.fullName}</div>
                        <div className="text-sm text-gray-500">{doc.primarySpecialty}</div>
                        <div className="text-xs text-blue-600 mt-1">Self-Registered</div>
                      </td>
                      <td className="p-4 font-mono text-sm text-gray-600 font-medium">
                        {doc.mdcnFolio}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {doc.hospitalAffiliation}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          Pending
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleVerify(doc.id, doc.fullName)}
                            className="p-2 text-green-600 hover:bg-green-50 hover:text-green-700 border border-transparent hover:border-green-200 rounded-lg transition-all" 
                            title="Verify MDCN"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleReject(doc.id, doc.fullName)}
                            className="p-2 text-red-600 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-200 rounded-lg transition-all" 
                            title="Reject"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
    </div>
  );
}
