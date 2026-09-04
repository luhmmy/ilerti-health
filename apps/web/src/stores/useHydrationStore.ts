import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HydrationLog {
  id: string;
  timestamp: string;
  volumeMl: number;
  verificationType: 'camera_scan' | 'manual';
  confidence?: number;
  itemType: string;
  snapshotUrl?: string;
}

interface HydrationState {
  dailyGoalMl: number;
  currentIntakeMl: number;
  glassesCount: number;
  logs: HydrationLog[];
  addIntake: (volumeMl: number, details?: { itemType?: string; confidence?: number; snapshotUrl?: string }) => void;
  resetDailyIntake: () => void;
}

export const useHydrationStore = create<HydrationState>()(
  persist(
    (set, get) => ({
      dailyGoalMl: 2500, // 2.5 Litres
      currentIntakeMl: 1000, // starting demo intake (1.0L / ~4 glasses)
      glassesCount: 4,
      logs: [
        {
          id: 'log-1',
          timestamp: '07:35 AM',
          volumeMl: 250,
          verificationType: 'camera_scan',
          confidence: 98.2,
          itemType: 'Glass of Clean Water (250ml)',
        },
        {
          id: 'log-2',
          timestamp: '10:15 AM',
          volumeMl: 250,
          verificationType: 'camera_scan',
          confidence: 96.5,
          itemType: 'Glass of Water (250ml)',
        },
        {
          id: 'log-3',
          timestamp: '01:30 PM',
          volumeMl: 500,
          verificationType: 'camera_scan',
          confidence: 97.4,
          itemType: 'Bottled Spring Water (500ml)',
        },
      ],
      addIntake: (volumeMl, details) => {
        const newTotal = get().currentIntakeMl + volumeMl;
        const newGlasses = Math.round(newTotal / 250);
        const newLog: HydrationLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          volumeMl,
          verificationType: 'camera_scan',
          confidence: details?.confidence || 96.8,
          itemType: details?.itemType || 'Glass Cup of Water',
          snapshotUrl: details?.snapshotUrl,
        };

        set({
          currentIntakeMl: newTotal,
          glassesCount: newGlasses,
          logs: [newLog, ...get().logs],
        });
      },
      resetDailyIntake: () => {
        set({ currentIntakeMl: 0, glassesCount: 0, logs: [] });
      },
    }),
    {
      name: 'ilerti_hydration_storage',
    }
  )
);
