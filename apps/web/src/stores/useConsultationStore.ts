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
  wipeAllConsultations: () => void;
}

// Clean production start - zero dummy/test consultations or prescriptions
const initialConsultations: ConsultationRecord[] = [];
const initialPrescriptions: EPrescription[] = [];

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

      wipeAllConsultations: () => {
        set({ consultations: [], prescriptions: [] });
      },
    }),
    {
      name: 'ilerti-consultations-vault-v2', // Updated key for clean fresh production state
    }
  )
);
