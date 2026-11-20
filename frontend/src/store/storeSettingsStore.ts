'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StoreSettings } from '@/types';
import { seedStoreSettings } from '@/data/seedData';
import { registerStoreForSync } from './syncEngine';

interface StoreSettingsStore {
  settings: StoreSettings;
  updateSettings: (updates: Partial<StoreSettings>) => void;
  resetToSeed: () => void;
  importSettings: (imported: StoreSettings) => void;
}

const STORAGE_KEY = 'saitronics-store-settings';

export const useStoreSettingsStore = create<StoreSettingsStore>()(
  persist(
    (set) => ({
      settings: seedStoreSettings,

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates }
        }));
      },

      resetToSeed: () => set({ settings: seedStoreSettings }),

      importSettings: (imported) => {
        if (imported && typeof imported === 'object') {
          set({ settings: imported });
        }
      }
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      migrate: (persistedState: any) => {
        if (!persistedState || !persistedState.settings) {
          return { settings: seedStoreSettings };
        }
        return persistedState;
      }
    }
  )
);

if (typeof window !== 'undefined') {
  registerStoreForSync(STORAGE_KEY, () => useStoreSettingsStore.persist.rehydrate());
}
