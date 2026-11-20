'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Customer, Order } from '@/types';
import { seedCustomers } from '@/data/seedData';
import { registerStoreForSync } from './syncEngine';

interface CustomerStore {
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  recordOrderForCustomer: (order: Order) => void;
  resetToSeed: () => void;
  importCustomers: (imported: Customer[]) => void;
}

const STORAGE_KEY = 'saitronics-customers';

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      customers: seedCustomers,

      addCustomer: (customer) => {
        set((state) => ({ customers: [customer, ...state.customers] }));
      },

      updateCustomer: (id, updates) => {
        set((state) => ({
          customers: state.customers.map((c) => (c.id === id ? { ...c, ...updates } : c))
        }));
      },

      deleteCustomer: (id) => {
        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id)
        }));
      },

      recordOrderForCustomer: (order) => {
        const existing = get().customers.find(
          (c) =>
            c.email.toLowerCase() === order.customerEmail.toLowerCase() ||
            c.phone.replace(/\D/g, '') === order.customerPhone.replace(/\D/g, '')
        );

        const now = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

        if (existing) {
          set((state) => ({
            customers: state.customers.map((c) =>
              c.id === existing.id
                ? {
                    ...c,
                    totalOrders: c.totalOrders + 1,
                    totalSpend: c.totalSpend + order.grandTotal,
                    lastOrderDate: now,
                    address: order.shippingAddress || c.address
                  }
                : c
            )
          }));
        } else {
          const newCust: Customer = {
            id: `cust-${Date.now()}`,
            name: order.customerName,
            email: order.customerEmail,
            phone: order.customerPhone,
            address: order.shippingAddress,
            totalOrders: 1,
            totalSpend: order.grandTotal,
            lastOrderDate: now,
            createdAt: now
          };
          set((state) => ({ customers: [newCust, ...state.customers] }));
        }
      },

      resetToSeed: () => set({ customers: seedCustomers }),

      importCustomers: (imported) => {
        if (Array.isArray(imported)) {
          set({ customers: imported });
        }
      }
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      migrate: (persistedState: any) => {
        if (!persistedState || !Array.isArray(persistedState.customers)) {
          return { customers: seedCustomers };
        }
        return persistedState;
      }
    }
  )
);

if (typeof window !== 'undefined') {
  registerStoreForSync(STORAGE_KEY, () => useCustomerStore.persist.rehydrate());
}
