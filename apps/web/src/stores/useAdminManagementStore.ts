import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ManagedUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  role: 'patient' | 'doctor' | 'admin' | 'facility_admin';
  status: 'active' | 'suspended' | 'banned';
  suspensionReason?: string;
  suspendedUntil?: string;
  banReason?: string;
  registeredAt: string;
  location: string;
  mdcnFolio?: string;
  specialty?: string;
  consultationsCount: number;
}

interface AdminManagementStore {
  users: ManagedUser[];
  addUser: (user: ManagedUser) => void;
  banUser: (id: string, reason: string) => void;
  suspendUser: (id: string, reason: string, days: number) => void;
  restoreUser: (id: string) => void;
  updateUserRole: (id: string, role: ManagedUser['role']) => void;
  deleteUser: (id: string) => void;
  wipeAllUsers: () => void;
  searchUsers: (query: string, roleFilter?: string, statusFilter?: string) => ManagedUser[];
}

// 100% Pristine production slate - zero existing accounts
const initialUsers: ManagedUser[] = [];

export const useAdminManagementStore = create<AdminManagementStore>()(
  persist(
    (set, get) => ({
      users: initialUsers,

      addUser: (newUser) => {
        set((state) => {
          const exists = state.users.some(
            (u) => u.id === newUser.id || (u.email && u.email.toLowerCase() === newUser.email.toLowerCase())
          );
          if (exists) {
            return {
              users: state.users.map((u) =>
                u.id === newUser.id || (u.email && u.email.toLowerCase() === newUser.email.toLowerCase())
                  ? { ...u, ...newUser }
                  : u
              ),
            };
          }
          return { users: [newUser, ...state.users] };
        });
      },

      banUser: (id, reason) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id
              ? { ...u, status: 'banned', banReason: reason || 'Violation of platform policies' }
              : u
          ),
        }));
      },

      suspendUser: (id, reason, days) => {
        const suspendDate = new Date();
        suspendDate.setDate(suspendDate.getDate() + (days || 14));
        const untilStr = suspendDate.toISOString().split('T')[0];

        set((state) => ({
          users: state.users.map((u) =>
            u.id === id
              ? {
                  ...u,
                  status: 'suspended',
                  suspensionReason: reason || 'Account under administrative review',
                  suspendedUntil: untilStr,
                }
              : u
          ),
        }));
      },

      restoreUser: (id) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id
              ? { ...u, status: 'active', banReason: undefined, suspensionReason: undefined, suspendedUntil: undefined }
              : u
          ),
        }));
      },

      updateUserRole: (id, role) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, role } : u)),
        }));
      },

      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        }));
      },

      wipeAllUsers: () => {
        set({ users: [] });
      },

      searchUsers: (query, roleFilter, statusFilter) => {
        const users = get().users;
        return users.filter((u) => {
          const matchesQuery =
            !query ||
            u.fullName.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase()) ||
            u.phone.includes(query) ||
            (u.mdcnFolio && u.mdcnFolio.toLowerCase().includes(query.toLowerCase())) ||
            (u.specialty && u.specialty.toLowerCase().includes(query.toLowerCase()));

          const matchesRole = !roleFilter || roleFilter === 'all' || u.role === roleFilter;
          const matchesStatus = !statusFilter || statusFilter === 'all' || u.status === statusFilter;

          return matchesQuery && matchesRole && matchesStatus;
        });
      },
    }),
    {
      name: 'ilerti-v6-users',
    }
  )
);
