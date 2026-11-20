'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Review } from '@/types';
import { seedReviews } from '@/data/seedData';
import { registerStoreForSync } from './syncEngine';

interface ReviewStore {
  reviews: Review[];
  addReview: (review: Review) => void;
  setReviewStatus: (id: string, status: Review['status']) => void;
  deleteReview: (id: string) => void;
  getProductReviews: (productSlugOrId: string) => Review[];
  getProductRatingSummary: (productSlugOrId: string, fallbackRating?: number, fallbackCount?: number) => { average: number; count: number };
  resetToSeed: () => void;
  importReviews: (imported: Review[]) => void;
}

const STORAGE_KEY = 'saitronics-reviews';

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      reviews: seedReviews,

      addReview: (review) => {
        set((state) => ({ reviews: [review, ...state.reviews] }));
      },

      setReviewStatus: (id, status) => {
        set((state) => ({
          reviews: state.reviews.map((r) => (r.id === id ? { ...r, status } : r))
        }));
      },

      deleteReview: (id) => {
        set((state) => ({
          reviews: state.reviews.filter((r) => r.id !== id)
        }));
      },

      getProductReviews: (identifier) => {
        return get().reviews.filter(
          (r) =>
            (r.productId === identifier || r.productSlug === identifier) &&
            r.status === 'approved'
        );
      },

      getProductRatingSummary: (identifier, fallbackRating = 4.8, fallbackCount = 24) => {
        const approved = get().getProductReviews(identifier);
        if (approved.length === 0) {
          return { average: fallbackRating, count: fallbackCount };
        }
        const total = approved.reduce((sum, r) => sum + r.rating, 0);
        const average = Number((total / approved.length).toFixed(1));
        return { average, count: approved.length };
      },

      resetToSeed: () => set({ reviews: seedReviews }),

      importReviews: (imported) => {
        if (Array.isArray(imported)) {
          set({ reviews: imported });
        }
      }
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      migrate: (persistedState: any) => {
        if (!persistedState || !Array.isArray(persistedState.reviews)) {
          return { reviews: seedReviews };
        }
        return persistedState;
      }
    }
  )
);

if (typeof window !== 'undefined') {
  registerStoreForSync(STORAGE_KEY, () => useReviewStore.persist.rehydrate());
}
