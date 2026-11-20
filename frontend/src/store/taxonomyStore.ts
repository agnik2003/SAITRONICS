'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category, Brand } from '@/types';
import { seedCategories, seedBrands } from '@/data/seedData';
import { registerStoreForSync } from './syncEngine';

interface TaxonomyStore {
  categories: Category[];
  brands: Brand[];
  addCategory: (cat: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => { success: boolean; message?: string };
  reorderCategories: (cats: Category[]) => void;
  toggleCategoryVisibility: (id: string) => void;
  addBrand: (brand: Brand) => void;
  updateBrand: (id: string, updates: Partial<Brand>) => void;
  deleteBrand: (id: string) => { success: boolean; message?: string };
  reorderBrands: (brands: Brand[]) => void;
  toggleBrandActive: (id: string) => void;
  resetToSeed: () => void;
  importTaxonomy: (imported: { categories: Category[]; brands: Brand[] }) => void;
}

const STORAGE_KEY = 'saitronics-taxonomy';

export const useTaxonomyStore = create<TaxonomyStore>()(
  persist(
    (set, get) => ({
      categories: seedCategories,
      brands: seedBrands,

      addCategory: (cat) => {
        set((state) => ({ categories: [...state.categories, cat] }));
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c))
        }));
      },

      deleteCategory: (id) => {
        const cat = get().categories.find((c) => c.id === id);
        if (!cat) return { success: false, message: 'Category not found' };

        // Check product count
        if ((cat.productCount || 0) > 0) {
          return {
            success: false,
            message: `Cannot delete "${cat.name}": There are currently ${cat.productCount} active devices categorized here. Reassign them first.`
          };
        }

        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id)
        }));
        return { success: true };
      },

      reorderCategories: (cats) => {
        set({ categories: cats });
      },

      toggleCategoryVisibility: (id) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, isVisible: !c.isVisible } : c
          )
        }));
      },

      addBrand: (brand) => {
        set((state) => ({ brands: [...state.brands, brand] }));
      },

      updateBrand: (id, updates) => {
        set((state) => ({
          brands: state.brands.map((b) => (b.id === id ? { ...b, ...updates } : b))
        }));
      },

      deleteBrand: (id) => {
        const brand = get().brands.find((b) => b.id === id);
        if (!brand) return { success: false, message: 'Brand not found' };

        if ((brand.productCount || 0) > 0) {
          return {
            success: false,
            message: `Cannot delete "${brand.name}": There are ${brand.productCount} active models associated with this brand. Reassign them first.`
          };
        }

        set((state) => ({
          brands: state.brands.filter((b) => b.id !== id)
        }));
        return { success: true };
      },

      reorderBrands: (brands) => {
        set({ brands });
      },

      toggleBrandActive: (id) => {
        set((state) => ({
          brands: state.brands.map((b) =>
            b.id === id ? { ...b, isActive: !b.isActive } : b
          )
        }));
      },

      resetToSeed: () => {
        set({ categories: seedCategories, brands: seedBrands });
      },

      importTaxonomy: (imported) => {
        if (imported && Array.isArray(imported.categories) && Array.isArray(imported.brands)) {
          set({ categories: imported.categories, brands: imported.brands });
        }
      }
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      migrate: (persistedState: any) => {
        if (!persistedState || !Array.isArray(persistedState.categories)) {
          return { categories: seedCategories, brands: seedBrands };
        }
        return persistedState;
      }
    }
  )
);

if (typeof window !== 'undefined') {
  registerStoreForSync(STORAGE_KEY, () => useTaxonomyStore.persist.rehydrate());
}
