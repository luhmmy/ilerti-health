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
}

const initialDoctors: Doctor[] = [
  {
    id: '1',
    fullName: 'Dr. Adebayo Ogunlesi',
    mdcnFolio: 'MDCN/2014/41209',
    primarySpecialty: 'Cardiology',
    hospitalAffiliation: 'LUTH Idi-Araba',
    stateOfPractice: 'Lagos',
    cityOfPractice: 'Lagos',
    consultationFee: 25000,
    languages: ['English', 'Yoruba'],
    bio: 'Experienced Cardiologist with over 10 years of practice.',
    status: 'verified',
    isSelfRegistered: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    fullName: 'Dr. Fatima Al-Hassan',
    mdcnFolio: 'MDCN/2016/52891',
    primarySpecialty: 'Paediatrics',
    hospitalAffiliation: 'AKTH Kano',
    stateOfPractice: 'Kano',
    cityOfPractice: 'Kano',
    consultationFee: 12000,
    languages: ['English', 'Hausa'],
    bio: 'Passionate about child health and development.',
    status: 'verified',
    isSelfRegistered: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    fullName: 'Dr. Chukwuemeka Okoli',
    mdcnFolio: 'MDCN/2012/33890',
    primarySpecialty: 'Obstetrics & Gynaecology',
    hospitalAffiliation: 'UNTH Enugu',
    stateOfPractice: 'Enugu',
    cityOfPractice: 'Enugu',
    consultationFee: 20000,
    languages: ['English', 'Igbo'],
    bio: 'Specialist in maternal and fetal medicine.',
    status: 'verified',
    isSelfRegistered: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    fullName: 'Dr. Folashade Adeleke',
    mdcnFolio: 'MDCN/2018/61440',
    primarySpecialty: 'General Practice & Family Medicine',
    hospitalAffiliation: 'UCH Ibadan',
    stateOfPractice: 'Oyo',
    cityOfPractice: 'Ibadan',
    consultationFee: 10000,
    languages: ['English', 'Yoruba'],
    bio: 'Comprehensive care for the whole family.',
    status: 'verified',
    isSelfRegistered: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    fullName: 'Dr. Usman Bello',
    mdcnFolio: 'MDCN/2015/48902',
    primarySpecialty: 'Internal Medicine',
    hospitalAffiliation: 'National Hospital Abuja',
    stateOfPractice: 'FCT',
    cityOfPractice: 'Abuja',
    consultationFee: 15000,
    languages: ['English', 'Hausa'],
    bio: 'Focus on adult diseases and complex cases.',
    status: 'verified',
    isSelfRegistered: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    fullName: 'Dr. Ngozi Nwosu',
    mdcnFolio: 'MDCN/2017/58231',
    primarySpecialty: 'Dermatology',
    hospitalAffiliation: 'LASUTH Ikeja',
    stateOfPractice: 'Lagos',
    cityOfPractice: 'Ikeja',
    consultationFee: 18000,
    languages: ['English', 'Igbo', 'Pidgin'],
    bio: 'Expert in skin, hair, and nail disorders.',
    status: 'verified',
    isSelfRegistered: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    fullName: 'Dr. Babatunde Fashola',
    mdcnFolio: 'MDCN/2011/29840',
    primarySpecialty: 'Orthopaedics',
    hospitalAffiliation: 'Cedarcrest Abuja',
    stateOfPractice: 'FCT',
    cityOfPractice: 'Abuja',
    consultationFee: 30000,
    languages: ['English', 'Yoruba'],
    bio: 'Specializing in musculoskeletal trauma and sports injuries.',
    status: 'verified',
    isSelfRegistered: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    fullName: 'Dr. Ejiro Peters',
    mdcnFolio: 'MDCN/2019/65301',
    primarySpecialty: 'Psychiatry',
    hospitalAffiliation: 'Lily Hospitals PH',
    stateOfPractice: 'Rivers',
    cityOfPractice: 'Port Harcourt',
    consultationFee: 18000,
    languages: ['English', 'Pidgin'],
    bio: 'Dedicated to mental health and well-being.',
    status: 'verified',
    isSelfRegistered: true,
    createdAt: new Date().toISOString(),
  },
];

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
    }),
    {
      name: 'ilerti-doctor-storage',
    }
  )
);
