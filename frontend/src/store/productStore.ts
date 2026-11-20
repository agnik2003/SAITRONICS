'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, StockAdjustment } from '@/types';
import { seedProducts } from '@/data/seedData';
import { registerStoreForSync } from './syncEngine';

interface ProductStore {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string, isSoft?: boolean) => void;
  duplicateProduct: (id: string) => Product | null;
  adjustStock: (id: string, change: number, reason: StockAdjustment['reason'], note?: string) => void;
  setInlineStock: (id: string, newStock: number) => void;
  toggleProductFlag: (id: string, flag: 'isNewLaunch' | 'isFeatured' | 'isBestSeller' | 'isPremiumAudio' | 'showInHero') => void;
  bulkUpdateStatus: (ids: string[], status: 'published' | 'draft' | 'archived') => void;
  bulkDelete: (ids: string[]) => void;
  resetToSeed: () => void;
  importProducts: (imported: Product[]) => void;
}

const STORAGE_KEY = 'saitronics-admin-products';

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: seedProducts,

      addProduct: (newProduct) => {
        set((state) => ({
          products: [newProduct, ...state.products]
        }));
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          )
        }));
      },

      deleteProduct: (id, isSoft = false) => {
        set((state) => {
          if (isSoft) {
            return {
              products: state.products.map((p) =>
                p.id === id ? { ...p, status: 'archived' } : p
              )
            };
          }
          return {
            products: state.products.filter((p) => p.id !== id)
          };
        });
      },

      duplicateProduct: (id) => {
        const source = get().products.find((p) => p.id === id);
        if (!source) return null;

        const newId = `${source.id}-copy-${Date.now().toString().slice(-4)}`;
        const newSlug = `${source.slug}-copy-${Date.now().toString().slice(-4)}`;
        const clone: Product = {
          ...source,
          id: newId,
          slug: newSlug,
          name: `${source.name} (Copy)`,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set((state) => ({
          products: [clone, ...state.products]
        }));
        return clone;
      },

      adjustStock: (id, change, reason, note) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== id) return p;

            const newQuantity = Math.max(0, p.stockCount + change);
            const adjustment: StockAdjustment = {
              id: `adj-${Date.now()}`,
              date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
              change,
              reason,
              resultingQuantity: newQuantity,
              note
            };

            return {
              ...p,
              stockCount: newQuantity,
              inStock: newQuantity > 0,
              stockAdjustments: [adjustment, ...(p.stockAdjustments || [])]
            };
          })
        }));
      },

      setInlineStock: (id, newStock) => {
        const current = get().products.find((p) => p.id === id);
        const change = (current ? newStock - current.stockCount : 0);
        get().adjustStock(id, change, 'Correction', 'Inline stock edit in inventory dashboard');
      },

      toggleProductFlag: (id, flag) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, [flag]: !p[flag] } : p
          )
        }));
      },

      bulkUpdateStatus: (ids, status) => {
        set((state) => ({
          products: state.products.map((p) =>
            ids.includes(p.id) ? { ...p, status } : p
          )
        }));
      },

      bulkDelete: (ids) => {
        set((state) => ({
          products: state.products.filter((p) => !ids.includes(p.id))
        }));
      },

      resetToSeed: () => {
        set({ products: seedProducts });
      },

      importProducts: (imported) => {
        if (Array.isArray(imported) && imported.length > 0) {
          set({ products: imported });
        }
      }
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      migrate: (persistedState: any) => {
        if (!persistedState || !Array.isArray(persistedState.products)) {
          return { products: seedProducts };
        }
        return persistedState;
      }
    }
  )
);

if (typeof window !== 'undefined') {
  registerStoreForSync(STORAGE_KEY, () => useProductStore.persist.rehydrate());
}
