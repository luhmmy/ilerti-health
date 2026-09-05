import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ilerti-health-super-secure-production-jwt-key-2026';

export interface ServerUser {
  id: string;
  email: string;
  phone?: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  name: string;
  role: 'patient' | 'doctor' | 'admin' | 'facility_admin';
  avatarUrl?: string;
  specialty?: string;
  mdcnFolio?: string;
  hospitalAffiliation?: string;
  stateOfPractice?: string;
  cityOfPractice?: string;
  consultationFee?: number;
  verificationStatus?: string;
  languages?: string[];
  bio?: string;
  isAvailable?: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
}

export interface ServerDoctor {
  id: string;
  userId: string;
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
  isAvailable: boolean;
  createdAt: string;
}

export interface ServerOtp {
  code: string;
  email: string;
  phone?: string;
  expiresAt: number;
}

// Global serverless in-memory registry
declare global {
  var __ilerti_users: Map<string, ServerUser> | undefined;
  var __ilerti_doctors: Map<string, ServerDoctor> | undefined;
  var __ilerti_otps: Map<string, ServerOtp> | undefined;
  var __ilerti_consultations: any[] | undefined;
}

if (!global.__ilerti_users) {
  global.__ilerti_users = new Map<string, ServerUser>();
}
if (!global.__ilerti_doctors) {
  global.__ilerti_doctors = new Map<string, ServerDoctor>();
}
if (!global.__ilerti_otps) {
  global.__ilerti_otps = new Map<string, ServerOtp>();
}
if (!global.__ilerti_consultations) {
  global.__ilerti_consultations = [];
}

export const serverDb = {
  users: global.__ilerti_users,
  doctors: global.__ilerti_doctors,
  otps: global.__ilerti_otps,
  consultations: global.__ilerti_consultations,

  signToken(payload: any) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  },

  verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET) as any;
    } catch {
      return null;
    }
  },

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  },

  async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  },

  wipeAll() {
    global.__ilerti_users?.clear();
    global.__ilerti_doctors?.clear();
    global.__ilerti_otps?.clear();
    if (global.__ilerti_consultations) {
      global.__ilerti_consultations.length = 0;
    }
  },
};
