'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';
import toast from 'react-hot-toast';
import { registerStoreForSync } from './syncEngine';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, selectedColor?: string, selectedStorage?: string, maxStock?: number) => boolean;
  removeItem: (productId: string, selectedColor?: string, selectedStorage?: string) => void;
  updateQuantity: (productId: string, quantity: number, maxStock?: number, selectedColor?: string, selectedStorage?: string) => void;
  syncCartWithStock: (currentProducts: Product[]) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

const STORAGE_KEY = 'saitronics-cart';

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, selectedColor, selectedStorage, maxStock) => {
        const availableStock = typeof maxStock === 'number' ? maxStock : product.stockCount;
        if (availableStock <= 0) {
          toast.error(`${product.name} is currently out of stock`);
          return false;
        }

        const existing = get().items.find(
          (i) =>
            i.product.id === product.id &&
            i.selectedColor === selectedColor &&
            i.selectedStorage === selectedStorage
        );

        if (existing) {
          if (existing.quantity >= availableStock) {
            toast.error(`Only ${availableStock} units available in Uttarpara showroom`);
            return false;
          }
          set((state) => ({
            items: state.items.map((i) =>
              i.product.id === product.id &&
              i.selectedColor === selectedColor &&
              i.selectedStorage === selectedStorage
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          }));
        } else {
          set((state) => ({
            items: [...state.items, { product, quantity: 1, selectedColor, selectedStorage }]
          }));
        }
        return true;
      },

      removeItem: (productId, selectedColor, selectedStorage) =>
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i.product.id === productId &&
                (selectedColor === undefined || i.selectedColor === selectedColor) &&
                (selectedStorage === undefined || i.selectedStorage === selectedStorage)
              )
          )
        })),

      updateQuantity: (productId, quantity, maxStock, selectedColor, selectedStorage) => {
        if (quantity <= 0) {
          get().removeItem(productId, selectedColor, selectedStorage);
          return;
        }

        if (typeof maxStock === 'number' && quantity > maxStock) {
          toast.error(`Cannot add more than ${maxStock} units currently in stock`);
          quantity = maxStock;
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId &&
            (selectedColor === undefined || i.selectedColor === selectedColor) &&
            (selectedStorage === undefined || i.selectedStorage === selectedStorage)
              ? { ...i, quantity }
              : i
          )
        }));
      },

      syncCartWithStock: (currentProducts) => {
        const items = get().items;
        if (!items || items.length === 0) return;
        let adjusted = false;

        const updatedItems = items.map((item) => {
          const live = currentProducts.find((p) => p.id === item.product.id);
          if (!live) return item;

          if (live.stockCount <= 0) {
            adjusted = true;
            return { ...item, quantity: 0, product: live };
          } else if (item.quantity > live.stockCount) {
            adjusted = true;
            return { ...item, quantity: live.stockCount, product: live };
          }
          return { ...item, product: live };
        }).filter((item) => item.quantity > 0);

        if (adjusted) {
          set({ items: updatedItems });
          toast('Your cart quantities were adjusted to match live showroom inventory.');
        }
      },

      clearCart: () => set({ items: [] }),

      total: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0)
    }),
    {
      name: STORAGE_KEY,
      version: 1
    }
  )
);

if (typeof window !== 'undefined') {
  registerStoreForSync(STORAGE_KEY, () => useCartStore.persist.rehydrate());
}
