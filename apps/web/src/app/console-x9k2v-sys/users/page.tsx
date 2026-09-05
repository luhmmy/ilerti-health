"use client";

import React, { useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Ban, 
  PauseCircle, 
  CheckCircle2, 
  ShieldAlert, 
  AlertTriangle, 
  X, 
  UserCheck, 
  UserX,
  Stethoscope,
  MoreVertical,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Trash2,
  RefreshCw
} from "lucide-react";
import { useAdminManagementStore, ManagedUser } from "@/stores/useAdminManagementStore";
import { useDoctorStore } from "@/stores/useDoctorStore";
import { useConsultationStore } from "@/stores/useConsultationStore";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function UsersManagementPage() {
  const { users, banUser, suspendUser, restoreUser, deleteUser, wipeAllUsers, searchUsers } = useAdminManagementStore();
  const { wipeAllDoctors } = useDoctorStore();
  const { wipeAllConsultations } = useConsultationStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Modal State
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [actionType, setActionType] = useState<"ban" | "suspend" | "delete" | "wipe_all" | null>(null);
  const [reason, setReason] = useState("");
  const [suspendDays, setSuspendDays] = useState(14);

  const filteredUsers = searchUsers(searchQuery, selectedRole, selectedStatus);

  const handleOpenAction = (user: ManagedUser, type: "ban" | "suspend" | "delete") => {
    setSelectedUser(user);
    setActionType(type);
    setReason("");
  };

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (actionType === "wipe_all") {
      wipeAllUsers();
      wipeAllDoctors();
      wipeAllConsultations();
      toast.success("Database wiped successfully. Clean production state restored.");
      setActionType(null);
      return;
    }

    if (!selectedUser || !actionType) return;

    if (actionType === "ban") {
      banUser(selectedUser.id, reason);
      toast.error(`${selectedUser.fullName} has been permanently banned from the platform.`);
    } else if (actionType === "suspend") {
      suspendUser(selectedUser.id, reason, Number(suspendDays));
      toast.warning(`${selectedUser.fullName} has been suspended for ${suspendDays} days.`);
    } else if (actionType === "delete") {
      deleteUser(selectedUser.id);
      toast.info(`Account for ${selectedUser.fullName} removed.`);
    }

    setSelectedUser(null);
    setActionType(null);
  };

  const handleRestore = (user: ManagedUser) => {
    restoreUser(user.id);
    toast.success(`${user.fullName}'s account has been restored to active status.`);
  };

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1E3A5F]">User & Practitioner Directory</h1>
          <p className="text-gray-600 mt-1">Real-time live directory of registered patients, doctors, and facility administrators.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-[#1E3A5F] text-white px-3 py-1">
            {filteredUsers.length} Account{filteredUsers.length !== 1 ? 's' : ''} Active
          </Badge>
          <button
            type="button"
            onClick={() => setActionType("wipe_all")}
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            title="Purge all user cache and restart with clean empty database"
          >
            <Trash2 className="w-3.5 h-3.5" /> Wipe / Fresh Start
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, MDCN folio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-[#0D9488]"
            >
              <option value="all">All Roles</option>
              <option value="patient">Patients</option>
              <option value="doctor">Doctors</option>
              <option value="facility_admin">Facility Admins</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-[#0D9488]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">User Details</th>
                <th className="p-4">Role & Specialty</th>
                <th className="p-4">Location</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-gray-300" />
                      <p className="font-semibold text-gray-700">No registered accounts found in the database.</p>
                      <p className="text-xs text-gray-400 max-w-sm">
                        As patients and healthcare professionals create accounts on the registration page, their profiles will appear here dynamically in real time.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{user.fullName}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</span>
                        {user.phone && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {user.phone}</span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                          user.role === 'doctor' ? 'bg-teal-100 text-teal-800' :
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'facility_admin' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role.replace('_', ' ')}
                        </span>
                      </div>
                      {user.specialty && (
                        <div className="text-xs text-gray-600 mt-1 font-medium">
                          {user.specialty} {user.mdcnFolio ? `(${user.mdcnFolio})` : ''}
                        </div>
                      )}
                    </td>

                    <td className="p-4 text-gray-600 text-xs">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" /> {user.location}
                      </div>
                      <div className="text-gray-400 mt-0.5">Joined {user.registeredAt}</div>
                    </td>

                    <td className="p-4">
                      {user.status === 'active' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Active
                        </span>
                      )}
                      {user.status === 'suspended' && (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                            <PauseCircle className="w-3.5 h-3.5 text-amber-600" /> Suspended
                          </span>
                          <div className="text-[11px] text-amber-700 mt-1 max-w-xs truncate" title={user.suspensionReason}>
                            Until {user.suspendedUntil}: {user.suspensionReason}
                          </div>
                        </div>
                      )}
                      {user.status === 'banned' && (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                            <Ban className="w-3.5 h-3.5 text-red-600" /> Banned
                          </span>
                          <div className="text-[11px] text-red-600 mt-1 max-w-xs truncate" title={user.banReason}>
                            Reason: {user.banReason}
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.status !== 'active' ? (
                          <button
                            onClick={() => handleRestore(user)}
                            className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Restore Account
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleOpenAction(user, 'suspend')}
                              className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                              title="Suspend account temporarily"
                            >
                              <PauseCircle className="w-3.5 h-3.5" /> Suspend
                            </button>
                            <button
                              onClick={() => handleOpenAction(user, 'ban')}
                              className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                              title="Ban account permanently"
                            >
                              <Ban className="w-3.5 h-3.5" /> Ban
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Actions */}
      {actionType === "wipe_all" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">Wipe Database &amp; Clean Start</h2>
            <p className="text-xs text-gray-600 mb-6">
              This will erase all cached user accounts, test practitioners, consultations, and prescriptions to restore a 100% pristine production state.
            </p>

            <form onSubmit={handleConfirmAction} className="flex gap-3">
              <button
                type="button"
                onClick={() => setActionType(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors"
              >
                Confirm Wipe
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedUser && (actionType === "ban" || actionType === "suspend") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => { setSelectedUser(null); setActionType(null); }}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
              actionType === 'ban' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
            }`}>
              {actionType === 'ban' ? <Ban className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>

            <h2 className="text-xl font-bold text-[#1E3A5F]">
              {actionType === 'ban' ? `Ban User Account` : `Suspend User Account`}
            </h2>
            <p className="text-sm text-gray-600 mt-1 mb-4">
              Target: <strong className="text-gray-900">{selectedUser.fullName}</strong> ({selectedUser.email} • {selectedUser.role})
            </p>

            <form onSubmit={handleConfirmAction} className="space-y-4">
              {actionType === 'suspend' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Suspension Duration (Days)
                  </label>
                  <select
                    value={suspendDays}
                    onChange={(e) => setSuspendDays(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value={7}>7 Days (1 Week)</option>
                    <option value={14}>14 Days (2 Weeks)</option>
                    <option value={30}>30 Days (1 Month)</option>
                    <option value={90}>90 Days (3 Months)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Reason for {actionType === 'ban' ? 'Banning' : 'Suspension'} (Documented in Audit Log)
                </label>
                <textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={`Specify why this ${selectedUser.role} is being ${actionType === 'ban' ? 'banned' : 'suspended'}...`}
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setSelectedUser(null); setActionType(null); }}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2.5 text-white font-bold rounded-xl text-sm shadow-md transition-colors ${
                    actionType === 'ban'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  Confirm {actionType === 'ban' ? 'Permanent Ban' : 'Suspension'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
