'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminSession } from '@/types';
import { registerStoreForSync } from './syncEngine';
import { DEFAULT_ADMIN_ID, DEFAULT_ADMIN_PASSWORD } from '@/data/seedData';

interface AdminSessionStore extends AdminSession {
  login: (idInput: string, passwordInput: string, currentExpectedId?: string, currentExpectedPassword?: string) => boolean;
  logout: () => void;
}

const STORAGE_KEY = 'saitronics-admin-session';

export const useAdminSessionStore = create<AdminSessionStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      username: null,
      loginTimestamp: null,

      login: (idInput, passwordInput, expectedId, expectedPassword) => {
        const targetId = (expectedId || DEFAULT_ADMIN_ID).trim().toLowerCase();
        const targetPassword = (expectedPassword || DEFAULT_ADMIN_PASSWORD).trim();

        if (idInput.trim().toLowerCase() === targetId && passwordInput.trim() === targetPassword) {
          set({
            isAuthenticated: true,
            username: idInput.trim(),
            loginTimestamp: new Date().toISOString()
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({
          isAuthenticated: false,
          username: null,
          loginTimestamp: null
        });
      }
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      migrate: (persistedState: any) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return { isAuthenticated: false, username: null, loginTimestamp: null };
        }
        return persistedState;
      }
    }
  )
);

if (typeof window !== 'undefined') {
  registerStoreForSync(STORAGE_KEY, () => useAdminSessionStore.persist.rehydrate());
}
