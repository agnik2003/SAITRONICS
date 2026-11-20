'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';
import { registerStoreForSync } from './syncEngine';

interface WishlistStore {
  items: Product[];
  toggle: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
}

const STORAGE_KEY = 'saitronics-wishlist';

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const exists = get().items.some(i => i.id === product.id);
        if (exists) {
          set(state => ({ items: state.items.filter(i => i.id !== product.id) }));
        } else {
          set(state => ({ items: [...state.items, product] }));
        }
      },
      isWishlisted: (productId) => get().items.some(i => i.id === productId),
      clearWishlist: () => set({ items: [] }),
    }),
    { name: STORAGE_KEY }
  )
);

if (typeof window !== 'undefined') {
  registerStoreForSync(STORAGE_KEY, () => useWishlistStore.persist.rehydrate());
}
