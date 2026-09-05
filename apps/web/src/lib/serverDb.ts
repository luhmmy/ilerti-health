import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

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

// Global serverless in-memory cache
declare global {
  var __ilerti_users: Map<string, ServerUser> | undefined;
  var __ilerti_doctors: Map<string, ServerDoctor> | undefined;
  var __ilerti_otps: Map<string, ServerOtp> | undefined;
  var __ilerti_consultations: any[] | undefined;
  var __ilerti_pg_pool: Pool | undefined;
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

// PostgreSQL Connection Pool Setup
const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.VERCEL_POSTGRES_URL ||
  process.env.SUPABASE_DATABASE_URL ||
  process.env.NEON_DATABASE_URL;

let pool: Pool | null = null;

if (databaseUrl) {
  if (!global.__ilerti_pg_pool) {
    global.__ilerti_pg_pool = new Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }
  pool = global.__ilerti_pg_pool;
}

let tablesInitialized = false;

async function ensureTables() {
  if (!pool || tablesInitialized) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ilerti_users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(255),
        password_hash TEXT NOT NULL,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'patient',
        avatar_url TEXT,
        specialty VARCHAR(255),
        mdcn_folio VARCHAR(255),
        hospital_affiliation TEXT,
        state_of_practice VARCHAR(255),
        city_of_practice VARCHAR(255),
        consultation_fee NUMERIC DEFAULT 10000,
        verification_status VARCHAR(50) DEFAULT 'PENDING',
        languages JSONB DEFAULT '["English"]'::jsonb,
        bio TEXT,
        is_available BOOLEAN DEFAULT true,
        email_verified BOOLEAN DEFAULT false,
        phone_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS ilerti_doctors (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255),
        full_name VARCHAR(255) NOT NULL,
        mdcn_folio VARCHAR(255),
        primary_specialty VARCHAR(255) NOT NULL,
        secondary_specialty VARCHAR(255),
        hospital_affiliation TEXT,
        state_of_practice VARCHAR(255),
        city_of_practice VARCHAR(255),
        consultation_fee NUMERIC DEFAULT 10000,
        languages JSONB DEFAULT '["English"]'::jsonb,
        bio TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS ilerti_otps (
        key VARCHAR(255) PRIMARY KEY,
        code VARCHAR(10) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(255),
        expires_at BIGINT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS ilerti_consultations (
        id VARCHAR(255) PRIMARY KEY,
        patient_id VARCHAR(255) NOT NULL,
        doctor_id VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
        urgency VARCHAR(50),
        chief_complaint TEXT,
        doctor_notes TEXT,
        scheduled_at VARCHAR(255),
        amount_paid NUMERIC DEFAULT 0,
        payment_reference VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    tablesInitialized = true;
  } catch (err) {
    console.warn('Table initialization warning:', err);
  }
}

// REST KV Helper (Upstash / Vercel KV)
const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function kvGet<T>(key: string): Promise<T | null> {
  if (!kvUrl || !kvToken) return null;
  try {
    const res = await fetch(`${kvUrl}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${kvToken}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.result) return null;
    return typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
  } catch {
    return null;
  }
}

async function kvSet(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
  if (!kvUrl || !kvToken) return false;
  try {
    const serialized = JSON.stringify(value);
    const url = ttlSeconds
      ? `${kvUrl}/set/${encodeURIComponent(key)}?ex=${ttlSeconds}`
      : `${kvUrl}/set/${encodeURIComponent(key)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${kvToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(serialized),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function kvDel(key: string): Promise<boolean> {
  if (!kvUrl || !kvToken) return false;
  try {
    const res = await fetch(`${kvUrl}/del/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${kvToken}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export const serverDb = {
  users: global.__ilerti_users!,
  doctors: global.__ilerti_doctors!,
  otps: global.__ilerti_otps!,
  consultations: global.__ilerti_consultations!,

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

  // ---------------- USER OPERATIONS ----------------

  async getUser(key: string): Promise<ServerUser | null> {
    const normalized = key.toLowerCase().trim();

    // 1. Fast in-memory check
    const cached = global.__ilerti_users?.get(normalized);
    if (cached) return cached;

    // 2. PostgreSQL check
    if (pool) {
      await ensureTables();
      try {
        const res = await pool.query(
          `SELECT * FROM ilerti_users WHERE LOWER(email) = $1 OR phone = $1 OR id = $1 LIMIT 1`,
          [normalized]
        );
        if (res.rows.length > 0) {
          const row = res.rows[0];
          const user: ServerUser = {
            id: row.id,
            email: row.email,
            phone: row.phone,
            passwordHash: row.password_hash,
            firstName: row.first_name,
            lastName: row.last_name,
            name: row.name,
            role: row.role,
            avatarUrl: row.avatar_url,
            specialty: row.specialty,
            mdcnFolio: row.mdcn_folio,
            hospitalAffiliation: row.hospital_affiliation,
            stateOfPractice: row.state_of_practice,
            cityOfPractice: row.city_of_practice,
            consultationFee: row.consultation_fee ? Number(row.consultation_fee) : 10000,
            verificationStatus: row.verification_status,
            languages: Array.isArray(row.languages) ? row.languages : ['English'],
            bio: row.bio,
            isAvailable: row.is_available,
            emailVerified: row.email_verified,
            phoneVerified: row.phone_verified,
            createdAt: row.created_at?.toISOString() || new Date().toISOString(),
          };
          global.__ilerti_users?.set(user.email.toLowerCase(), user);
          if (user.phone) global.__ilerti_users?.set(user.phone.trim(), user);
          return user;
        }
      } catch (dbErr) {
        console.warn('Postgres getUser error:', dbErr);
      }
    }

    // 3. Upstash / KV check
    const kvUser = await kvGet<ServerUser>(`user:${normalized}`);
    if (kvUser) {
      global.__ilerti_users?.set(kvUser.email.toLowerCase(), kvUser);
      if (kvUser.phone) global.__ilerti_users?.set(kvUser.phone.trim(), kvUser);
      return kvUser;
    }

    return null;
  },

  async saveUser(user: ServerUser): Promise<void> {
    const emailNorm = user.email.toLowerCase().trim();

    // 1. In-memory cache
    global.__ilerti_users?.set(emailNorm, user);
    if (user.phone) {
      global.__ilerti_users?.set(user.phone.trim(), user);
    }
    global.__ilerti_users?.set(user.id, user);

    // 2. PostgreSQL persistence
    if (pool) {
      await ensureTables();
      try {
        await pool.query(
          `INSERT INTO ilerti_users (
            id, email, phone, password_hash, first_name, last_name, name, role,
            avatar_url, specialty, mdcn_folio, hospital_affiliation, state_of_practice,
            city_of_practice, consultation_fee, verification_status, languages, bio,
            is_available, email_verified, phone_verified, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, NOW(), NOW())
          ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            phone = EXCLUDED.phone,
            password_hash = EXCLUDED.password_hash,
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            name = EXCLUDED.name,
            role = EXCLUDED.role,
            specialty = EXCLUDED.specialty,
            mdcn_folio = EXCLUDED.mdcn_folio,
            hospital_affiliation = EXCLUDED.hospital_affiliation,
            state_of_practice = EXCLUDED.state_of_practice,
            city_of_practice = EXCLUDED.city_of_practice,
            consultation_fee = EXCLUDED.consultation_fee,
            verification_status = EXCLUDED.verification_status,
            languages = EXCLUDED.languages,
            bio = EXCLUDED.bio,
            is_available = EXCLUDED.is_available,
            email_verified = EXCLUDED.email_verified,
            phone_verified = EXCLUDED.phone_verified,
            updated_at = NOW()`,
          [
            user.id,
            emailNorm,
            user.phone || null,
            user.passwordHash,
            user.firstName || null,
            user.lastName || null,
            user.name,
            user.role,
            user.avatarUrl || null,
            user.specialty || null,
            user.mdcnFolio || null,
            user.hospitalAffiliation || null,
            user.stateOfPractice || null,
            user.cityOfPractice || null,
            user.consultationFee || 10000,
            user.verificationStatus || 'PENDING',
            JSON.stringify(user.languages || ['English']),
            user.bio || null,
            user.isAvailable !== false,
            user.emailVerified || false,
            user.phoneVerified || false,
          ]
        );
      } catch (dbErr) {
        console.warn('Postgres saveUser error:', dbErr);
      }
    }

    // 3. Upstash / KV persistence
    await kvSet(`user:${emailNorm}`, user);
    if (user.phone) {
      await kvSet(`user:${user.phone.trim()}`, user);
    }
    await kvSet(`user:${user.id}`, user);
  },

  // ---------------- DOCTOR OPERATIONS ----------------

  async getDoctor(id: string): Promise<ServerDoctor | null> {
    const cached = global.__ilerti_doctors?.get(id);
    if (cached) return cached;

    if (pool) {
      await ensureTables();
      try {
        const res = await pool.query(
          `SELECT * FROM ilerti_doctors WHERE id = $1 OR user_id = $1 OR mdcn_folio = $1 LIMIT 1`,
          [id]
        );
        if (res.rows.length > 0) {
          const row = res.rows[0];
          const doctor: ServerDoctor = {
            id: row.id,
            userId: row.user_id,
            fullName: row.full_name,
            mdcnFolio: row.mdcn_folio,
            primarySpecialty: row.primary_specialty,
            secondarySpecialty: row.secondary_specialty,
            hospitalAffiliation: row.hospital_affiliation,
            stateOfPractice: row.state_of_practice,
            cityOfPractice: row.city_of_practice,
            consultationFee: row.consultation_fee ? Number(row.consultation_fee) : 10000,
            languages: Array.isArray(row.languages) ? row.languages : ['English'],
            bio: row.bio,
            status: row.status,
            isAvailable: row.is_available,
            createdAt: row.created_at?.toISOString() || new Date().toISOString(),
          };
          global.__ilerti_doctors?.set(doctor.id, doctor);
          return doctor;
        }
      } catch (err) {
        console.warn('Postgres getDoctor error:', err);
      }
    }

    const kvDoc = await kvGet<ServerDoctor>(`doctor:${id}`);
    if (kvDoc) {
      global.__ilerti_doctors?.set(kvDoc.id, kvDoc);
      return kvDoc;
    }

    return null;
  },

  async saveDoctor(doctor: ServerDoctor): Promise<void> {
    global.__ilerti_doctors?.set(doctor.id, doctor);

    if (pool) {
      await ensureTables();
      try {
        await pool.query(
          `INSERT INTO ilerti_doctors (
            id, user_id, full_name, mdcn_folio, primary_specialty, secondary_specialty,
            hospital_affiliation, state_of_practice, city_of_practice, consultation_fee,
            languages, bio, status, is_available, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
          ON CONFLICT (id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            mdcn_folio = EXCLUDED.mdcn_folio,
            primary_specialty = EXCLUDED.primary_specialty,
            secondary_specialty = EXCLUDED.secondary_specialty,
            hospital_affiliation = EXCLUDED.hospital_affiliation,
            state_of_practice = EXCLUDED.state_of_practice,
            city_of_practice = EXCLUDED.city_of_practice,
            consultation_fee = EXCLUDED.consultation_fee,
            languages = EXCLUDED.languages,
            bio = EXCLUDED.bio,
            status = EXCLUDED.status,
            is_available = EXCLUDED.is_available`,
          [
            doctor.id,
            doctor.userId,
            doctor.fullName,
            doctor.mdcnFolio,
            doctor.primarySpecialty,
            doctor.secondarySpecialty || null,
            doctor.hospitalAffiliation,
            doctor.stateOfPractice,
            doctor.cityOfPractice,
            doctor.consultationFee,
            JSON.stringify(doctor.languages),
            doctor.bio,
            doctor.status,
            doctor.isAvailable,
          ]
        );
      } catch (err) {
        console.warn('Postgres saveDoctor error:', err);
      }
    }

    await kvSet(`doctor:${doctor.id}`, doctor);
  },

  // ---------------- OTP OPERATIONS ----------------

  async saveOtp(key: string, otp: ServerOtp): Promise<void> {
    const norm = key.toLowerCase().trim();
    global.__ilerti_otps?.set(norm, otp);

    if (pool) {
      await ensureTables();
      try {
        await pool.query(
          `INSERT INTO ilerti_otps (key, code, email, phone, expires_at)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (key) DO UPDATE SET
             code = EXCLUDED.code,
             expires_at = EXCLUDED.expires_at`,
          [norm, otp.code, otp.email, otp.phone || null, otp.expiresAt]
        );
      } catch (err) {
        console.warn('Postgres saveOtp error:', err);
      }
    }

    await kvSet(`otp:${norm}`, otp, 600); // 10 minutes TTL
  },

  async getOtp(key: string): Promise<ServerOtp | null> {
    const norm = key.toLowerCase().trim();
    const cached = global.__ilerti_otps?.get(norm);
    if (cached) return cached;

    if (pool) {
      await ensureTables();
      try {
        const res = await pool.query(
          `SELECT * FROM ilerti_otps WHERE key = $1 AND expires_at > $2 LIMIT 1`,
          [norm, Date.now()]
        );
        if (res.rows.length > 0) {
          const row = res.rows[0];
          const otp: ServerOtp = {
            code: row.code,
            email: row.email,
            phone: row.phone,
            expiresAt: Number(row.expires_at),
          };
          global.__ilerti_otps?.set(norm, otp);
          return otp;
        }
      } catch (err) {
        console.warn('Postgres getOtp error:', err);
      }
    }

    const kvOtp = await kvGet<ServerOtp>(`otp:${norm}`);
    if (kvOtp) {
      global.__ilerti_otps?.set(norm, kvOtp);
      return kvOtp;
    }

    return null;
  },

  async deleteOtp(key: string): Promise<void> {
    const norm = key.toLowerCase().trim();
    global.__ilerti_otps?.delete(norm);

    if (pool) {
      try {
        await pool.query(`DELETE FROM ilerti_otps WHERE key = $1`, [norm]);
      } catch {}
    }

    await kvDel(`otp:${norm}`);
  },

  async getAllUsers(): Promise<ServerUser[]> {
    const userMap = new Map<string, ServerUser>();

    // 1. In-memory users first
    if (global.__ilerti_users) {
      global.__ilerti_users.forEach((u) => {
        userMap.set(u.id, u);
      });
    }

    // 2. PostgreSQL users
    if (pool) {
      await ensureTables();
      try {
        const res = await pool.query(`SELECT * FROM ilerti_users ORDER BY created_at DESC`);
        for (const row of res.rows) {
          const user: ServerUser = {
            id: row.id,
            email: row.email,
            phone: row.phone,
            passwordHash: row.password_hash,
            firstName: row.first_name,
            lastName: row.last_name,
            name: row.name,
            role: row.role,
            avatarUrl: row.avatar_url,
            specialty: row.specialty,
            mdcnFolio: row.mdcn_folio,
            hospitalAffiliation: row.hospital_affiliation,
            stateOfPractice: row.state_of_practice,
            cityOfPractice: row.city_of_practice,
            consultationFee: row.consultation_fee ? Number(row.consultation_fee) : 10000,
            verificationStatus: row.verification_status,
            languages: Array.isArray(row.languages) ? row.languages : ['English'],
            bio: row.bio,
            isAvailable: row.is_available,
            emailVerified: row.email_verified,
            phoneVerified: row.phone_verified,
            createdAt: row.created_at?.toISOString() || new Date().toISOString(),
          };
          userMap.set(user.id, user);
          global.__ilerti_users?.set(user.email.toLowerCase(), user);
        }
      } catch (err) {
        console.warn('Postgres getAllUsers error:', err);
      }
    }

    const result: ServerUser[] = [];
    userMap.forEach((u) => result.push(u));
    return result;
  },

  async updateUserStatus(id: string, status: string, reason?: string, suspendedUntil?: string): Promise<void> {
    if (pool) {
      await ensureTables();
      try {
        await pool.query(
          `UPDATE ilerti_users SET verification_status = $2, updated_at = NOW() WHERE id = $1`,
          [id, status]
        );
      } catch (err) {
        console.warn('Postgres updateUserStatus error:', err);
      }
    }

    if (global.__ilerti_users) {
      global.__ilerti_users.forEach((u) => {
        if (u.id === id) {
          u.verificationStatus = status;
        }
      });
    }
  },

  async deleteUser(id: string): Promise<void> {
    if (pool) {
      await ensureTables();
      try {
        await pool.query(`DELETE FROM ilerti_users WHERE id = $1`, [id]);
        await pool.query(`DELETE FROM ilerti_doctors WHERE id = $1 OR user_id = $1`, [id]);
      } catch (err) {
        console.warn('Postgres deleteUser error:', err);
      }
    }

    if (global.__ilerti_users) {
      global.__ilerti_users.delete(id);
      const keysToDelete: string[] = [];
      global.__ilerti_users.forEach((u, k) => {
        if (u.id === id) {
          keysToDelete.push(k);
        }
      });
      keysToDelete.forEach((k) => global.__ilerti_users?.delete(k));
    }
    global.__ilerti_doctors?.delete(id);
  },

  // ---------------- DOCTOR OPERATIONS ----------------

  async getAllDoctors(): Promise<ServerDoctor[]> {
    const docMap = new Map<string, ServerDoctor>();

    // 1. In-memory registered doctors
    if (global.__ilerti_doctors) {
      global.__ilerti_doctors.forEach((d) => {
        docMap.set(d.id, d);
      });
    }

    // 2. PostgreSQL doctors
    if (pool) {
      await ensureTables();
      try {
        const res = await pool.query(`SELECT * FROM ilerti_doctors ORDER BY created_at DESC`);
        for (const row of res.rows) {
          const doctor: ServerDoctor = {
            id: row.id,
            userId: row.user_id,
            fullName: row.full_name,
            mdcnFolio: row.mdcn_folio,
            primarySpecialty: row.primary_specialty,
            secondarySpecialty: row.secondary_specialty,
            hospitalAffiliation: row.hospital_affiliation,
            stateOfPractice: row.state_of_practice,
            cityOfPractice: row.city_of_practice,
            consultationFee: row.consultation_fee ? Number(row.consultation_fee) : 10000,
            languages: Array.isArray(row.languages) ? row.languages : ['English'],
            bio: row.bio,
            status: row.status,
            isAvailable: row.is_available,
            createdAt: row.created_at?.toISOString() || new Date().toISOString(),
          };
          docMap.set(doctor.id, doctor);
          global.__ilerti_doctors?.set(doctor.id, doctor);
        }
      } catch (err) {
        console.warn('Postgres getAllDoctors error:', err);
      }
    }

    const docResult: ServerDoctor[] = [];
    docMap.forEach((d) => docResult.push(d));
    return docResult;
  },

  async updateDoctorStatus(id: string, status: 'pending' | 'verified' | 'rejected'): Promise<void> {
    if (pool) {
      await ensureTables();
      try {
        await pool.query(
          `UPDATE ilerti_doctors SET status = $2 WHERE id = $1 OR user_id = $1`,
          [id, status]
        );
        await pool.query(
          `UPDATE ilerti_users SET verification_status = $2 WHERE id = $1`,
          [id, status.toUpperCase()]
        );
      } catch (err) {
        console.warn('Postgres updateDoctorStatus error:', err);
      }
    }

    const doc = global.__ilerti_doctors?.get(id);
    if (doc) {
      doc.status = status;
      global.__ilerti_doctors?.set(id, doc);
    }
  },

  // ---------------- HARD DATABASE WIPE ----------------

  async wipeAll(): Promise<void> {
    // 1. Wipe memory caches
    global.__ilerti_users?.clear();
    global.__ilerti_doctors?.clear();
    global.__ilerti_otps?.clear();
    if (global.__ilerti_consultations) {
      global.__ilerti_consultations.length = 0;
    }

    // 2. Wipe PostgreSQL database tables
    if (pool) {
      await ensureTables();
      try {
        await pool.query(`
          TRUNCATE TABLE ilerti_otps;
          TRUNCATE TABLE ilerti_consultations;
          TRUNCATE TABLE ilerti_doctors;
          TRUNCATE TABLE ilerti_users CASCADE;
        `);
      } catch (err) {
        console.warn('Postgres wipe warning:', err);
      }
    }
  },
};

