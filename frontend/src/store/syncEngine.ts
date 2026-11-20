'use client';

import toast from 'react-hot-toast';

// Registry of rehydrate functions for cross-tab live synchronization
type RehydrateFn = () => void | Promise<void>;
const rehydrateRegistry: Record<string, RehydrateFn> = {};

export function registerStoreForSync(storageKey: string, rehydrate: RehydrateFn) {
  rehydrateRegistry[storageKey] = rehydrate;
}

let isInitialized = false;

/**
 * Initializes the cross-tab sync listener.
 * Whenever localStorage is modified in one browser tab, other tabs
 * immediately rehydrate the affected Zustand store without requiring a page refresh.
 */
export function initLiveSync() {
  if (typeof window === 'undefined' || isInitialized) return;
  isInitialized = true;

  window.addEventListener('storage', (event: StorageEvent) => {
    if (!event.key) return;

    const rehydrate = rehydrateRegistry[event.key];
    if (rehydrate) {
      try {
        rehydrate();
      } catch (err) {
        console.warn(`[SAITRONICS Sync Engine] Failed to rehydrate store for key: ${event.key}`, err);
      }
    }
  });
}

/**
 * Defensive wrapper around localStorage writes with quota error detection
 */
export function safeStorageSet(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error: any) {
    if (
      error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      error.code === 22
    ) {
      toast.error('Local storage capacity exceeded! Please remove some custom uploaded images in Admin Settings.');
    } else {
      toast.error(`Storage write failed for ${key}.`);
    }
    console.error(`[SAITRONICS Storage Error] Failed writing ${key}`, error);
    return false;
  }
}

/**
 * Safe JSON parser with fallback seed data
 */
export function safeStorageParse<T>(data: string | null, fallback: T): T {
  if (!data) return fallback;
  try {
    return JSON.parse(data);
  } catch (err) {
    console.warn('[SAITRONICS Storage Warning] Corrupted data detected, reverting to clean demo state.');
    return fallback;
  }
}
