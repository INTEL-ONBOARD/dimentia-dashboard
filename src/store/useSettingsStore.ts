import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
  dateRange: 'last7days' | 'last30days' | 'last90days' | 'custom';
  customDateRange?: { start: Date; end: Date };
  refreshInterval: number; // in seconds
  chartAnimations: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    slack: boolean;
  };
  dataRetention: number; // in days
}

interface SettingsState {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: {
        dateRange: 'last30days',
        refreshInterval: 300, // 5 minutes
        chartAnimations: true,
        notifications: {
          email: true,
          push: true,
          slack: false,
        },
        dataRetention: 730, // 2 years
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
    }),
    { name: 'settings-storage' }
  )
);
