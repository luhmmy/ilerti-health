import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HealthProfileState {
  bloodGroup: string; // 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', or 'Not Set'
  genotype: string; // 'AA', 'AS', 'SS', 'AC', 'Not Set'
  heightCm: number | null;
  weightKg: number | null;
  allergies: string[];
  chronicConditions: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  updateProfile: (data: Partial<HealthProfileState>) => void;
  resetProfile: () => void;
}

export const useProfileStore = create<HealthProfileState>()(
  persist(
    (set) => ({
      bloodGroup: 'Not Set',
      genotype: 'Not Set',
      heightCm: null,
      weightKg: null,
      allergies: [],
      chronicConditions: [],
      emergencyContactName: '',
      emergencyContactPhone: '',

      updateProfile: (data) => set((state) => ({ ...state, ...data })),
      resetProfile: () =>
        set({
          bloodGroup: 'Not Set',
          genotype: 'Not Set',
          heightCm: null,
          weightKg: null,
          allergies: [],
          chronicConditions: [],
          emergencyContactName: '',
          emergencyContactPhone: '',
        }),
    }),
    {
      name: 'ilerti-v6-profile',
    }
  )
);
