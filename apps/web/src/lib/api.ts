export interface TriageResult {
  model?: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  specialistRecommended: string;
  advice: string;
  warningSigns: string[];
  followUp?: string;
  isFallback?: boolean;
  quotaNote?: string;
}

const API_URL = '/api';

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('ilerti-v5-auth') || localStorage.getItem('ilerti-auth');
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
    let errMsg = `HTTP error! status: ${res.status}`;
    try {
      const errorBody = await res.json();
      errMsg = errorBody.message || errorBody.error || errMsg;
    } catch {
      try {
        const textBody = await res.text();
        if (textBody) errMsg = textBody;
      } catch {}
    }
    throw new Error(errMsg);
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
    updateProfile: async (data: any) => {
      return await fetchJson('/auth/profile', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    wipeDatabase: async () => {
      return await fetchJson('/auth/wipe-database', {
        method: 'POST',
      });
    },
  },
  ai: {
    triage: async (input: string | { symptoms?: string; messages?: any[] }): Promise<TriageResult> => {
      try {
        const payload = typeof input === 'string' ? { symptoms: input } : input;
        const res = await fetch('/api/ai/triage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to fetch triage');
        return await res.json();
      } catch (error) {
        return {
          model: 'GPT-4o Protocol Engine',
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
  admin: {
    getUsers: async () => {
      return await fetchJson('/admin/users');
    },
    moderateUser: async (data: { action: 'ban' | 'suspend' | 'restore' | 'delete'; userId: string; reason?: string; suspendDays?: number }) => {
      return await fetchJson('/admin/users', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    getDoctors: async () => {
      return await fetchJson('/admin/doctors');
    },
    verifyDoctor: async (data: { doctorId: string; action: 'verify' | 'reject' }) => {
      return await fetchJson('/admin/doctors', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },
};
