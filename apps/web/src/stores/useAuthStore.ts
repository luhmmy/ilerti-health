import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '../lib/api';

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  tempOtp: string | null;
  pendingEmailOrPhone: string | null;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<any>;
  setVerified: () => void;
  setTempOtp: (otp: string | null) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
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
        const data = await api.auth.login(credentials);
        const userObj: User = {
          id: data.user?.id || 'u-1',
          name: `${data.user?.firstName || ''} ${data.user?.lastName || ''}`.trim() || data.user?.email || 'User',
          email: data.user?.email,
          phone: data.user?.phone,
          role: (data.user?.role || 'patient').toLowerCase(),
          avatar: data.user?.avatarUrl,
        };
        set({ user: userObj, token: data.access_token, isAuthenticated: true, pendingEmailOrPhone: null });
      },

      register: async (userData) => {
        const data = await api.auth.register(userData);
        if (data.access_token && data.user) {
          const userObj: User = {
            id: data.user.id,
            name: `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim() || data.user.email || 'User',
            email: data.user.email,
            phone: userData.phone,
            role: (data.user.role || 'patient').toLowerCase(),
            avatar: data.user.avatarUrl,
          };
          set({ 
            user: userObj, 
            token: data.access_token, 
            isAuthenticated: false, // Must verify OTP first
            tempOtp: data.verificationCode || null,
            pendingEmailOrPhone: userData.email,
          });
        }
        return data;
      },

      setVerified: () => {
        set({ isAuthenticated: true, tempOtp: null });
      },

      setTempOtp: (otp) => {
        set({ tempOtp: otp });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, tempOtp: null, pendingEmailOrPhone: null });
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },
    }),
    {
      name: 'ilerti-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
