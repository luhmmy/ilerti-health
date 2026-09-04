// User roles
export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  FACILITY_ADMIN = 'FACILITY_ADMIN',
  ADMIN = 'ADMIN',
}

// Gender
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

// Verification status
export enum VerificationStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

// Consultation types
export enum ConsultationType {
  CHAT = 'CHAT',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
}

// Consultation status
export enum ConsultationStatus {
  PENDING = 'PENDING',
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

// Urgency levels from AI triage
export enum UrgencyLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  EMERGENCY = 'EMERGENCY',
}

// AI triage next steps
export enum TriageNextStep {
  SELF_CARE = 'SELF_CARE',
  BOOK_DOCTOR = 'BOOK_DOCTOR',
  URGENT_CARE = 'URGENT_CARE',
  EMERGENCY = 'EMERGENCY',
}

// Facility types
export enum FacilityType {
  HOSPITAL = 'HOSPITAL',
  CLINIC = 'CLINIC',
  DIAGNOSTIC_CENTRE = 'DIAGNOSTIC_CENTRE',
  PHARMACY = 'PHARMACY',
  SPECIALIST_CENTRE = 'SPECIALIST_CENTRE',
  PRIMARY_HEALTH_CENTRE = 'PRIMARY_HEALTH_CENTRE',
}

// Health record types
export enum HealthRecordType {
  LAB_RESULT = 'LAB_RESULT',
  PRESCRIPTION = 'PRESCRIPTION',
  DOCTOR_NOTE = 'DOCTOR_NOTE',
  IMAGING = 'IMAGING',
  REFERRAL = 'REFERRAL',
  VACCINATION = 'VACCINATION',
  DISCHARGE_SUMMARY = 'DISCHARGE_SUMMARY',
  OTHER = 'OTHER',
}

// Subscription plans
export enum SubscriptionPlan {
  FREE = 'FREE',
  PLUS = 'PLUS',
  CORPORATE = 'CORPORATE',
  UNIVERSITY = 'UNIVERSITY',
}

// Wellness plan types
export enum WellnessPlanType {
  GENERAL = 'GENERAL',
  DIABETES = 'DIABETES',
  HEART_HEALTH = 'HEART_HEALTH',
  HEALTHY_WEIGHT = 'HEALTHY_WEIGHT',
  PREGNANCY = 'PREGNANCY',
  CHILD_WELLNESS = 'CHILD_WELLNESS',
  HEALTHY_AGEING = 'HEALTHY_AGEING',
  DIGESTIVE_HEALTH = 'DIGESTIVE_HEALTH',
}

// Payment status
export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

// Nigerian states
export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
  'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
] as const;

export type NigerianState = typeof NIGERIAN_STATES[number];

// Medical specialties available in Nigeria
export const MEDICAL_SPECIALTIES = [
  'General Practice',
  'Internal Medicine',
  'Paediatrics',
  'Obstetrics & Gynaecology',
  'Surgery',
  'Orthopaedics',
  'Cardiology',
  'Dermatology',
  'ENT (Ear, Nose & Throat)',
  'Ophthalmology',
  'Psychiatry',
  'Radiology',
  'Anaesthesiology',
  'Urology',
  'Neurology',
  'Oncology',
  'Endocrinology',
  'Gastroenterology',
  'Nephrology',
  'Pulmonology',
  'Rheumatology',
  'Family Medicine',
  'Emergency Medicine',
  'Public Health',
  'Dentistry',
  'Physiotherapy',
  'Nutrition & Dietetics',
  'Clinical Psychology',
] as const;

export type MedicalSpecialty = typeof MEDICAL_SPECIALTIES[number];

// User interface
export interface IUser {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: Gender;
  state?: NigerianState;
  city?: string;
  address?: string;
  role: UserRole;
  avatarUrl?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Doctor interface
export interface IDoctor {
  id: string;
  userId: string;
  user?: IUser;
  mdcnNumber: string;
  licenseNumber?: string;
  verificationStatus: VerificationStatus;
  bio?: string;
  experienceYears: number;
  consultationFee: number;
  specialties: MedicalSpecialty[];
  languages: string[];
  consultationTypes: ConsultationType[];
  rating: number;
  totalConsultations: number;
  isAvailable: boolean;
  createdAt: string;
}

// Facility interface
export interface IFacility {
  id: string;
  name: string;
  description?: string;
  type: FacilityType;
  address: string;
  state: NigerianState;
  city: string;
  phone: string;
  email?: string;
  website?: string;
  openingHours?: Record<string, { open: string; close: string }>;
  verificationStatus: VerificationStatus;
  services: string[];
  createdAt: string;
}

// Consultation interface
export interface IConsultation {
  id: string;
  patientId: string;
  doctorId: string;
  type: ConsultationType;
  status: ConsultationStatus;
  aiTriageSummary?: string;
  urgencyLevel?: UrgencyLevel;
  chiefComplaint: string;
  doctorNotes?: string;
  scheduledAt: string;
  startedAt?: string;
  endedAt?: string;
  amountPaid: number;
  paymentReference?: string;
  createdAt: string;
}

// Health profile interface
export interface IHealthProfile {
  id: string;
  userId: string;
  bloodType?: string;
  heightCm?: number;
  weightKg?: number;
  chronicConditions: string[];
  allergies: string[];
  currentMedications: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  updatedAt: string;
}

// Wellness plan interface
export interface IWellnessPlan {
  id: string;
  userId: string;
  planType: WellnessPlanType;
  name: string;
  preferences?: Record<string, unknown>;
  mealSchedule?: Record<string, unknown>;
  activityPlan?: Record<string, unknown>;
  reminders?: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

// Auth types
export interface LoginRequest {
  emailOrPhone: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export interface OtpVerifyRequest {
  emailOrPhone: string;
  otp: string;
}
