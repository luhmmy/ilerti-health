import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ManagedUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
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
  banUser: (id: string, reason: string) => void;
  suspendUser: (id: string, reason: string, days: number) => void;
  restoreUser: (id: string) => void;
  updateUserRole: (id: string, role: ManagedUser['role']) => void;
  deleteUser: (id: string) => void;
  searchUsers: (query: string, roleFilter?: string, statusFilter?: string) => ManagedUser[];
}

const initialUsers: ManagedUser[] = [
  {
    id: 'u-1',
    fullName: 'Chinedu Okafor',
    email: 'chinedu.okafor@gmail.com',
    phone: '+234 803 123 4567',
    role: 'patient',
    status: 'active',
    registeredAt: '2024-01-15',
    location: 'Lagos, Nigeria',
    consultationsCount: 6,
  },
  {
    id: 'u-2',
    fullName: 'Dr. Funmilayo Adeleke',
    email: 'dr.adeleke@luth.gov.ng',
    phone: '+234 802 987 6543',
    role: 'doctor',
    status: 'active',
    registeredAt: '2024-01-10',
    location: 'Ikeja, Lagos',
    mdcnFolio: 'MDCN/2014/41209',
    specialty: 'Cardiology',
    consultationsCount: 142,
  },
  {
    id: 'u-3',
    fullName: 'Amina Yusuf',
    email: 'amina.yusuf@yahoo.com',
    phone: '+234 809 333 4455',
    role: 'patient',
    status: 'active',
    registeredAt: '2024-02-01',
    location: 'Abuja (FCT)',
    consultationsCount: 3,
  },
  {
    id: 'u-4',
    fullName: 'Dr. Emeka Nwosu',
    email: 'e.nwosu@unth.edu.ng',
    phone: '+234 805 777 8899',
    role: 'doctor',
    status: 'suspended',
    suspensionReason: 'Pending license renewal verification with MDCN',
    suspendedUntil: '2025-03-31',
    registeredAt: '2023-11-20',
    location: 'Enugu, Nigeria',
    mdcnFolio: 'MDCN/2012/33901',
    specialty: 'Orthopaedics',
    consultationsCount: 89,
  },
  {
    id: 'u-5',
    fullName: 'Tunde Bakare',
    email: 'tunde.b@hotmail.com',
    phone: '+234 807 444 1122',
    role: 'patient',
    status: 'banned',
    banReason: 'Violation of platform terms (fraudulent payment chargeback attempts)',
    registeredAt: '2023-12-05',
    location: 'Ibadan, Oyo',
    consultationsCount: 1,
  },
  {
    id: 'u-6',
    fullName: 'Dr. Fatima Al-Hassan',
    email: 'f.alhassan@akth.gov.ng',
    phone: '+234 803 999 0011',
    role: 'doctor',
    status: 'active',
    registeredAt: '2024-01-18',
    location: 'Kano, Nigeria',
    mdcnFolio: 'MDCN/2016/52891',
    specialty: 'Paediatrics',
    consultationsCount: 95,
  },
  {
    id: 'u-7',
    fullName: 'Ngozi Eze',
    email: 'ngozi.eze@gmail.com',
    phone: '+234 814 555 6677',
    role: 'patient',
    status: 'active',
    registeredAt: '2024-02-12',
    location: 'Port Harcourt, Rivers',
    consultationsCount: 4,
  },
  {
    id: 'u-8',
    fullName: 'Lagoon Hospital Admin',
    email: 'ops@lagoonhospitals.com',
    phone: '+234 802 000 9988',
    role: 'facility_admin',
    status: 'active',
    registeredAt: '2023-10-15',
    location: 'Victoria Island, Lagos',
    consultationsCount: 0,
  }
];

export const useAdminManagementStore = create<AdminManagementStore>()(
  persist(
    (set, get) => ({
      users: initialUsers,

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
      name: 'ilerti-admin-management',
    }
  )
);
