'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Coupon } from '@/types';
import { seedCoupons } from '@/data/seedData';
import { registerStoreForSync } from './syncEngine';

interface CouponValidationResult {
  valid: boolean;
  discountAmount: number;
  coupon?: Coupon;
  message: string;
}

interface CouponStore {
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponActive: (id: string) => void;
  incrementCouponUsage: (code: string) => void;
  validateCoupon: (code: string, cartTotal: number) => CouponValidationResult;
  resetToSeed: () => void;
  importCoupons: (imported: Coupon[]) => void;
}

const STORAGE_KEY = 'saitronics-coupons';

export const useCouponStore = create<CouponStore>()(
  persist(
    (set, get) => ({
      coupons: seedCoupons,

      addCoupon: (coupon) => {
        set((state) => ({ coupons: [coupon, ...state.coupons] }));
      },

      updateCoupon: (id, updates) => {
        set((state) => ({
          coupons: state.coupons.map((c) => (c.id === id ? { ...c, ...updates } : c))
        }));
      },

      deleteCoupon: (id) => {
        set((state) => ({
          coupons: state.coupons.filter((c) => c.id !== id)
        }));
      },

      toggleCouponActive: (id) => {
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.id === id ? { ...c, isActive: !c.isActive } : c
          )
        }));
      },

      incrementCouponUsage: (code) => {
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.code.toUpperCase() === code.toUpperCase()
              ? { ...c, usageCount: c.usageCount + 1 }
              : c
          )
        }));
      },

      validateCoupon: (code, cartTotal) => {
        if (!code || !code.trim()) {
          return { valid: false, discountAmount: 0, message: 'Please enter a coupon code' };
        }

        const normalized = code.trim().toUpperCase();
        const coupon = get().coupons.find((c) => c.code.toUpperCase() === normalized);

        if (!coupon) {
          return { valid: false, discountAmount: 0, message: `Coupon "${normalized}" does not exist` };
        }

        if (!coupon.isActive) {
          return { valid: false, discountAmount: 0, message: `Coupon "${normalized}" is currently disabled` };
        }

        const today = new Date().toISOString().split('T')[0];
        if (coupon.startDate && today < coupon.startDate) {
          return { valid: false, discountAmount: 0, message: `Promotion starts on ${coupon.startDate}` };
        }

        if (coupon.endDate && today > coupon.endDate) {
          return { valid: false, discountAmount: 0, message: `Coupon "${normalized}" expired on ${coupon.endDate}` };
        }

        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
          return { valid: false, discountAmount: 0, message: `Coupon "${normalized}" has reached its maximum usage limit` };
        }

        if (cartTotal < coupon.minOrder) {
          return {
            valid: false,
            discountAmount: 0,
            message: `Minimum order amount for this coupon is ₹${coupon.minOrder.toLocaleString('en-IN')}`
          };
        }

        let discountAmount = 0;
        if (coupon.type === 'percentage') {
          discountAmount = Math.round((cartTotal * coupon.value) / 100);
          if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
          }
        } else {
          discountAmount = Math.min(coupon.value, cartTotal);
        }

        return {
          valid: true,
          discountAmount,
          coupon,
          message: `Coupon "${normalized}" applied successfully! (Saved ₹${discountAmount.toLocaleString('en-IN')})`
        };
      },

      resetToSeed: () => set({ coupons: seedCoupons }),

      importCoupons: (imported) => {
        if (Array.isArray(imported)) {
          set({ coupons: imported });
        }
      }
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      migrate: (persistedState: any) => {
        if (!persistedState || !Array.isArray(persistedState.coupons)) {
          return { coupons: seedCoupons };
        }
        return persistedState;
      }
    }
  )
);

if (typeof window !== 'undefined') {
  registerStoreForSync(STORAGE_KEY, () => useCouponStore.persist.rehydrate());
}
