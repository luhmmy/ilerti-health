import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '../lib/api';
import { useAdminManagementStore } from './useAdminManagementStore';
import { useDoctorStore } from './useDoctorStore';
import { useProfileStore } from './useProfileStore';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'patient' | 'doctor' | 'admin' | 'facility_admin';
  avatar?: string;
  mdcnFolio?: string;
  specialty?: string;
  hospitalAffiliation?: string;
  stateOfPractice?: string;
  cityOfPractice?: string;
  consultationFee?: number;
  verificationStatus?: string;
  languages?: string[];
  bio?: string;
  isAvailable?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  tempOtp: string | null;
  pendingEmailOrPhone: string | null;
  login: (credentials: { email?: string; emailOrPhone?: string; password?: string; role?: string }) => Promise<User>;
  register: (userData: any) => Promise<any>;
  setVerified: () => void;
  setTempOtp: (otp: string | null) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  wipeAllAuthData: () => void;
}

// Purge all legacy storage keys across all previous versions
if (typeof window !== 'undefined') {
  const allKeys = Object.keys(localStorage);
  allKeys.forEach((key) => {
    if (key.startsWith('ilerti-') && !key.includes('-v6-')) {
      try {
        localStorage.removeItem(key);
      } catch {}
    }
  });
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      tempOtp: null,
      pendingEmailOrPhone: null,

      login: async (credentials) => {
        const inputKey = (credentials.email || credentials.emailOrPhone || '').toLowerCase().trim();
        const inputPass = credentials.password || '';

        if (!inputKey || !inputPass) {
          throw new Error('Please enter both your email/phone and password.');
        }

        // 1. Check if Super Administrator login
        const isAdmin = (inputKey === 'admin@ilertihealth.site' || inputKey === 'admin') && (inputPass === 'ILERTI-ADMIN-2025' || inputPass === 'admin');
        if (isAdmin) {
          const adminUser: User = {
            id: 'admin-master',
            name: 'System Administrator',
            email: 'admin@ilertihealth.site',
            role: 'admin',
            isAvailable: true,
          };
          set({ user: adminUser, token: `admin-token-${Date.now()}`, isAuthenticated: true, pendingEmailOrPhone: null });
          return adminUser;
        }

        // 2. Authoritative Server Database API Login
        try {
          const data = await api.auth.login({ email: inputKey, password: inputPass });
          if (data && data.user) {
            const isDoctor = (data.user.role || '').toUpperCase() === 'DOCTOR' || Boolean(data.user.doctor);
            const userRole: User['role'] = isDoctor ? 'doctor' : (data.user.role?.toLowerCase() as any) || 'patient';
            
            const userObj: User = {
              id: data.user.id || `u-${Date.now()}`,
              name: data.user.name || `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim() || data.user.email || (isDoctor ? 'Doctor' : 'User'),
              email: data.user.email,
              phone: data.user.phone,
              role: userRole,
              avatar: data.user.avatarUrl,
              specialty: data.user.specialty || data.user.doctor?.specialties?.[0] || (isDoctor ? 'General Practice' : undefined),
              mdcnFolio: data.user.mdcnFolio || data.user.doctor?.mdcnNumber,
              hospitalAffiliation: data.user.hospitalAffiliation || data.user.doctor?.bio,
              verificationStatus: data.user.verificationStatus || data.user.doctor?.verificationStatus || (isDoctor ? 'VERIFIED' : undefined),
              isAvailable: true,
            };

            set({ user: userObj, token: data.access_token || 'auth-token', isAuthenticated: true, pendingEmailOrPhone: null });
            return userObj;
          }
          throw new Error('This account does not exist in the database. Please create an account to sign in.');
        } catch (apiErr: any) {
          const errMsg = apiErr?.message || 'Login failed. Please verify your credentials or register an account.';
          throw new Error(errMsg);
        }
      },

      register: async (userData) => {
        const isDoc = userData.isDoctor || userData.role === 'DOCTOR' || userData.role === 'doctor';
        const email = userData.email?.toLowerCase().trim();
        const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || (isDoc ? 'Medical Doctor' : 'Patient');

        let serverResponse: any = null;

        // 1. Persist strictly to Server Database API
        try {
          serverResponse = await api.auth.register({
            ...userData,
            email,
            role: isDoc ? 'DOCTOR' : 'PATIENT',
          });
        } catch (apiErr: any) {
          const errMsg = apiErr?.message || '';
          if (errMsg.includes('already exists')) {
            throw new Error('An account with this email already exists. Please sign in instead.');
          }
          throw new Error(errMsg || 'Failed to create account on database.');
        }

        if (!serverResponse?.user?.id) {
          throw new Error('Registration failed on server database. Please try again.');
        }

        // Reset local profile so old vitals/blood group do not bleed into the new account
        useProfileStore.getState().resetProfile();

        const userId = serverResponse.user.id;
        const verificationOtp = serverResponse.verificationCode || Math.floor(100000 + Math.random() * 900000).toString();

        const newUser: User = {
          id: userId,
          name: serverResponse.user.name || fullName,
          email: email,
          phone: userData.phone,
          role: isDoc ? 'doctor' : 'patient',
          mdcnFolio: userData.mdcnFolio,
          specialty: userData.primarySpecialty || (isDoc ? 'General Practice' : undefined),
          hospitalAffiliation: userData.hospitalAffiliation,
          stateOfPractice: userData.stateOfPractice,
          cityOfPractice: userData.cityOfPractice,
          consultationFee: userData.consultationFee || 10000,
          languages: userData.languages || ['English'],
          bio: userData.bio,
          verificationStatus: isDoc ? 'PENDING' : 'VERIFIED',
          isAvailable: true,
        };

        set({
          user: newUser,
          token: serverResponse.access_token || `token-${Date.now()}`,
          isAuthenticated: false, // Must verify OTP
          tempOtp: verificationOtp,
          pendingEmailOrPhone: email || userData.phone,
        });

        return {
          success: true,
          message: 'Account registered successfully',
          verificationCode: verificationOtp,
          user: newUser,
        };
      },

      setVerified: () => {
        set({ isAuthenticated: true, tempOtp: null });
      },

      setTempOtp: (otp) => {
        set({ tempOtp: otp });
      },

      logout: () => {
        useProfileStore.getState().resetProfile();
        set({ user: null, token: null, isAuthenticated: false, tempOtp: null, pendingEmailOrPhone: null });
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },

      wipeAllAuthData: () => {
        useProfileStore.getState().resetProfile();
        set({ user: null, token: null, isAuthenticated: false, tempOtp: null, pendingEmailOrPhone: null });
      },
    }),
    {
      name: 'ilerti-v6-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
