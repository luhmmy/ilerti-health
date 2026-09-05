import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ConsultationRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty?: string;
  type: 'VIDEO' | 'AUDIO' | 'CHAT';
  status: 'WAITING' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  chiefComplaint: string;
  scheduledAt: string;
  amountPaid: number;
  paymentReference: string;
  doctorNotes?: string;
  prescriptionIssued?: boolean;
  createdAt: string;
}

export interface EPrescription {
  id: string;
  consultationId?: string;
  doctorId: string;
  doctorName: string;
  doctorMdcnFolio: string;
  doctorSpecialty?: string;
  patientName: string;
  patientEmailOrPhone?: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  issuedAt: string;
  qrCodeRef: string;
}

interface ConsultationStoreState {
  consultations: ConsultationRecord[];
  prescriptions: EPrescription[];
  bookConsultation: (data: Omit<ConsultationRecord, 'id' | 'createdAt' | 'status'>) => ConsultationRecord;
  updateConsultationStatus: (id: string, status: ConsultationRecord['status'], notes?: string) => void;
  issuePrescription: (data: Omit<EPrescription, 'id' | 'issuedAt' | 'qrCodeRef'>) => EPrescription;
  getDoctorConsultations: (doctorId: string) => ConsultationRecord[];
  getPatientConsultations: (patientIdOrName: string) => ConsultationRecord[];
}

const initialConsultations: ConsultationRecord[] = [
  {
    id: 'c-101',
    patientId: 'u-1',
    patientName: 'Chinedu Okafor',
    patientAge: 34,
    patientGender: 'Male',
    doctorId: '1',
    doctorName: 'Dr. Adebayo Ogunlesi',
    doctorSpecialty: 'Cardiology',
    type: 'VIDEO',
    status: 'WAITING',
    urgency: 'HIGH',
    chiefComplaint: 'Severe fever, recurrent chills, chest discomfort and joint pain for 3 days.',
    scheduledAt: 'Now • Live in Waiting Room',
    amountPaid: 10000,
    paymentReference: 'ILR-PAY-892401',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'c-102',
    patientId: 'u-3',
    patientName: 'Amina Yusuf',
    patientAge: 28,
    patientGender: 'Female',
    doctorId: '1',
    doctorName: 'Dr. Adebayo Ogunlesi',
    doctorSpecialty: 'Cardiology',
    type: 'VIDEO',
    status: 'SCHEDULED',
    urgency: 'MEDIUM',
    chiefComplaint: 'Follow-up on gestational blood pressure and routine antenatal cardiovascular check.',
    scheduledAt: 'Today • 2:30 PM',
    amountPaid: 12000,
    paymentReference: 'ILR-PAY-918234',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'c-103',
    patientId: 'u-7',
    patientName: 'Ngozi Eze',
    patientAge: 22,
    patientGender: 'Female',
    doctorId: '2',
    doctorName: 'Dr. Fatima Al-Hassan',
    doctorSpecialty: 'Paediatrics',
    type: 'AUDIO',
    status: 'SCHEDULED',
    urgency: 'MEDIUM',
    chiefComplaint: 'Acute allergic rash and itching after new medication.',
    scheduledAt: 'Today • 4:15 PM',
    amountPaid: 8000,
    paymentReference: 'ILR-PAY-723910',
    createdAt: new Date().toISOString(),
  },
];

const initialPrescriptions: EPrescription[] = [
  {
    id: 'rx-101',
    consultationId: 'c-101',
    doctorId: '1',
    doctorName: 'Dr. Adebayo Ogunlesi',
    doctorMdcnFolio: 'MDCN/2014/41209',
    doctorSpecialty: 'Cardiology',
    patientName: 'Chinedu Okafor',
    medicationName: 'Artemether-Lumefantrine (Coartem) 80/480mg',
    dosage: '1 Tablet',
    frequency: 'Twice Daily (BD)',
    duration: '3 Days',
    instructions: 'Take after fatty food or full meal for optimal malaria eradication.',
    issuedAt: '2026-09-04T10:30:00Z',
    qrCodeRef: 'MDCN-RX-892401',
  },
  {
    id: 'rx-102',
    doctorId: '1',
    doctorName: 'Dr. Adebayo Ogunlesi',
    doctorMdcnFolio: 'MDCN/2014/41209',
    doctorSpecialty: 'Cardiology',
    patientName: 'Babajide Adeleke',
    medicationName: 'Amlodipine 5mg',
    dosage: '5mg',
    frequency: 'Once Daily (OD)',
    duration: '30 Days',
    instructions: 'Take every morning to maintain target blood pressure < 130/80 mmHg.',
    issuedAt: '2026-09-03T14:15:00Z',
    qrCodeRef: 'MDCN-RX-991204',
  },
];

export const useConsultationStore = create<ConsultationStoreState>()(
  persist(
    (set, get) => ({
      consultations: initialConsultations,
      prescriptions: initialPrescriptions,

      bookConsultation: (data) => {
        const newRecord: ConsultationRecord = {
          ...data,
          id: `c-${Date.now()}`,
          status: 'SCHEDULED',
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          consultations: [newRecord, ...state.consultations],
        }));

        return newRecord;
      },

      updateConsultationStatus: (id, status, notes) => {
        set((state) => ({
          consultations: state.consultations.map((c) =>
            c.id === id ? { ...c, status, doctorNotes: notes || c.doctorNotes } : c
          ),
        }));
      },

      issuePrescription: (data) => {
        const newRx: EPrescription = {
          ...data,
          id: `rx-${Date.now()}`,
          issuedAt: new Date().toISOString(),
          qrCodeRef: `MDCN-RX-${Math.floor(100000 + Math.random() * 900000)}`,
        };

        set((state) => ({
          prescriptions: [newRx, ...state.prescriptions],
        }));

        return newRx;
      },

      getDoctorConsultations: (doctorId) => {
        const list = get().consultations;
        return list.filter((c) => c.doctorId === doctorId || doctorId === 'all' || !c.doctorId);
      },

      getPatientConsultations: (patientIdOrName) => {
        const list = get().consultations;
        return list.filter(
          (c) =>
            c.patientId === patientIdOrName ||
            c.patientName.toLowerCase().includes(patientIdOrName.toLowerCase())
        );
      },
    }),
    {
      name: 'ilerti-consultations-vault',
    }
  )
);
