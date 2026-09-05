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
  setDailyGoal: (ml: number) => void;
  addIntake: (volumeMl: number, details?: { itemType?: string; confidence?: number; snapshotUrl?: string }) => void;
  resetDailyIntake: () => void;
}

export const useHydrationStore = create<HydrationState>()(
  persist(
    (set, get) => ({
      dailyGoalMl: 2500, // Default 2.5L
      currentIntakeMl: 0,
      glassesCount: 0,
      logs: [],
      setDailyGoal: (dailyGoalMl) => set({ dailyGoalMl }),
      addIntake: (volumeMl, details) => {
        const newTotal = get().currentIntakeMl + volumeMl;
        const newGlasses = Math.round(newTotal / 250);
        const newLog: HydrationLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          volumeMl,
          verificationType: details?.snapshotUrl ? 'camera_scan' : 'manual',
          confidence: details?.confidence || 98.0,
          itemType: details?.itemType || `Water intake (${volumeMl}ml)`,
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
