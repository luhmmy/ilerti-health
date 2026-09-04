import { DOCTORS } from '../data/doctors';
import { FACILITIES } from '../data/facilities';

export interface TriageResult {
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  specialistRecommended: string;
  advice: string;
  warningSigns: string[];
  isFallback?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function fetchJson(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export const api = {
  auth: {
    login: async (credentials: any) => {
      try {
        return await fetchJson('/auth/login', {
          method: 'POST',
          body: JSON.stringify(credentials),
        });
      } catch (error) {
        console.warn('API login fallback used');
        return { user: { id: 'demo1', name: 'Adebayo', role: 'PATIENT' }, token: 'mock-jwt-token' };
      }
    },
    register: async (userData: any) => {
      try {
        return await fetchJson('/auth/register', {
          method: 'POST',
          body: JSON.stringify(userData),
        });
      } catch (error) {
        return { success: true };
      }
    },
    verifyOtp: async (data: any) => {
      try {
        return await fetchJson('/auth/verify-otp', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      } catch (error) {
        return { success: true };
      }
    },
  },
  ai: {
    triage: async (symptoms: string): Promise<TriageResult> => {
      try {
        const res = await fetch('/api/ai/triage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symptoms }),
        });
        if (!res.ok) throw new Error('Failed to fetch triage');
        return await res.json();
      } catch (error) {
        return {
          urgency: 'MEDIUM',
          specialistRecommended: 'General Practice',
          advice: 'Please consult with a licensed general practitioner for a clinical evaluation.',
          warningSigns: ['High fever persisting over 3 days', 'Difficulty breathing', 'Severe dehydration'],
          isFallback: true,
        };
      }
    },
  },
  doctors: {
    getAll: async (filters?: any) => {
      try {
        const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
        return await fetchJson(`/doctors${queryParams}`);
      } catch (error) {
        return DOCTORS;
      }
    },
    getById: async (id: string) => {
      try {
        return await fetchJson(`/doctors/${id}`);
      } catch (error) {
        return DOCTORS.find((d) => d.id === id) || DOCTORS[0];
      }
    },
  },
  consultations: {
    create: async (bookingData: any) => {
      try {
        return await fetchJson('/consultations', {
          method: 'POST',
          body: JSON.stringify(bookingData),
        });
      } catch (error) {
        return { id: 'c-101', status: 'SCHEDULED' };
      }
    },
    getById: async (id: string) => {
      try {
        return await fetchJson(`/consultations/${id}`);
      } catch (error) {
        return {
          id,
          status: 'IN_PROGRESS',
          doctorId: 'dr-1',
          patientId: 'demo1',
          doctorName: 'Dr. Funmilayo Adeleke',
          doctorSpecialty: 'General Practice & Family Medicine',
          patientName: 'Adebayo Johnson',
          patientAge: 32,
          patientGender: 'Male',
          bloodGroup: 'O+',
          allergies: ['Penicillin', 'Sulfa drugs'],
          chiefComplaint: 'Persistent throbbing headache for 2 days, mild fever (38.1°C), and general body weakness.',
        };
      }
    },
  },
  facilities: {
    getAll: async (filters?: any) => {
      try {
        const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
        return await fetchJson(`/facilities${queryParams}`);
      } catch (error) {
        return FACILITIES;
      }
    },
  },
  wellness: {
    generatePlan: async (preferences: any) => {
      try {
        return await fetchJson('/wellness/generate-plan', {
          method: 'POST',
          body: JSON.stringify(preferences),
        });
      } catch (error) {
        return { plan: 'Balanced Nigerian meal plan with hydration and daily activity.' };
      }
    },
  },
};
