import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Doctor {
  id: string;
  fullName: string;
  mdcnFolio: string;
  primarySpecialty: string;
  secondarySpecialty?: string;
  hospitalAffiliation: string;
  stateOfPractice: string;
  cityOfPractice: string;
  consultationFee: number;
  languages: string[];
  bio: string;
  status: 'pending' | 'verified' | 'rejected';
  isSelfRegistered: boolean;
  createdAt: string;
}

interface DoctorStore {
  doctors: Doctor[];
  registerDoctor: (data: Omit<Doctor, 'id' | 'status' | 'isSelfRegistered' | 'createdAt'>) => void;
  getDoctorById: (id: string) => Doctor | undefined;
  verifyDoctor: (id: string) => void;
  rejectDoctor: (id: string) => void;
  wipeAllDoctors: () => void;
}

// 100% Pristine production slate - zero existing doctors
const initialDoctors: Doctor[] = [];

export const useDoctorStore = create<DoctorStore>()(
  persist(
    (set, get) => ({
      doctors: initialDoctors,
      registerDoctor: (data) => {
        const newDoctor: Doctor = {
          ...data,
          id: Math.random().toString(36).substring(2, 9),
          status: 'pending',
          isSelfRegistered: true,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ doctors: [newDoctor, ...state.doctors] }));
      },
      getDoctorById: (id) => {
        return get().doctors.find((d) => d.id === id);
      },
      verifyDoctor: (id) => {
        set((state) => ({
          doctors: state.doctors.map((d) =>
            d.id === id ? { ...d, status: 'verified' } : d
          ),
        }));
      },
      rejectDoctor: (id) => {
        set((state) => ({
          doctors: state.doctors.map((d) =>
            d.id === id ? { ...d, status: 'rejected' } : d
          ),
        }));
      },
      wipeAllDoctors: () => {
        set({ doctors: [] });
      },
    }),
    {
      name: 'ilerti-v6-doctors',
    }
  )
);
