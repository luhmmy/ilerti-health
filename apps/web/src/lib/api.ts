export interface TriageResult {
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  specialistRecommended: string;
  advice: string;
  warningSigns: string[];
  isFallback?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ilerti-health.onrender.com/api/v1';

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('ilerti-auth');
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const token = parsed.state?.token;
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  } catch {}
  return {};
}

async function fetchJson(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(errorBody || `HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export const api = {
  auth: {
    login: async (credentials: { email?: string; phone?: string; password: string }) => {
      return await fetchJson('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    },
    register: async (userData: any) => {
      return await fetchJson('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },
    verifyOtp: async (data: { emailOrPhone: string; otp: string }) => {
      return await fetchJson('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    resendOtp: async (data: { emailOrPhone: string }) => {
      return await fetchJson('/auth/resend-otp', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    me: async () => {
      return await fetchJson('/auth/me');
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
    getAll: async (filters?: Record<string, string>) => {
      const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
      return await fetchJson(`/doctors${queryParams}`);
    },
    getById: async (id: string) => {
      return await fetchJson(`/doctors/${id}`);
    },
    onboard: async (doctorData: any) => {
      return await fetchJson('/doctors/onboard', {
        method: 'POST',
        body: JSON.stringify(doctorData),
      });
    },
  },
  consultations: {
    create: async (bookingData: any) => {
      return await fetchJson('/consultations', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
    },
    getMyConsultations: async () => {
      return await fetchJson('/consultations/my');
    },
    getById: async (id: string) => {
      return await fetchJson(`/consultations/${id}`);
    },
  },
  facilities: {
    getAll: async (filters?: Record<string, string>) => {
      const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
      return await fetchJson(`/facilities${queryParams}`);
    },
    getById: async (id: string) => {
      return await fetchJson(`/facilities/${id}`);
    },
  },
  wellness: {
    generatePlan: async (preferences: any) => {
      return await fetchJson('/wellness/generate-plan', {
        method: 'POST',
        body: JSON.stringify(preferences),
      });
    },
    getMyPlan: async () => {
      return await fetchJson('/wellness/my-plan');
    },
  },
};
