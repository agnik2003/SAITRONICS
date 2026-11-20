'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, OrderTimelineEvent } from '@/types';
import { seedOrders } from '@/data/seedData';
import { registerStoreForSync } from './syncEngine';

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, newStatus: Order['status'], note?: string) => void;
  markAsRead: (orderId: string) => void;
  addInternalNote: (orderId: string, note: string) => void;
  setTrackingNumber: (orderId: string, trackingNumber: string, courierName?: string) => void;
  clearOrders: () => void;
  resetToSeed: () => void;
  importOrders: (imported: Order[]) => void;
}

const STORAGE_KEY = 'saitronics-orders';

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: seedOrders,

      addOrder: (newOrder) => {
        const orderWithTimeline: Order = {
          ...newOrder,
          isNew: true,
          timeline: newOrder.timeline && newOrder.timeline.length > 0 ? newOrder.timeline : [
            {
              id: `t-${Date.now()}`,
              date: newOrder.date,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'placed',
              title: 'Order Received',
              description: `Payment authorized via ${newOrder.paymentMethod.toUpperCase()}`
            }
          ]
        };

        set((state) => ({
          orders: [orderWithTimeline, ...state.orders]
        }));
      },

      updateOrderStatus: (orderId, newStatus, note) => {
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id !== orderId) return o;

            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateString = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

            const statusTitles: Record<string, string> = {
              placed: 'Order Placed',
              processing: 'Quality Check & Processing',
              shipped: 'Dispatched via Courier',
              delivered: 'Delivered to Customer',
              cancelled: 'Order Cancelled'
            };

            const newEvent: OrderTimelineEvent = {
              id: `t-${Date.now()}`,
              date: dateString,
              time: timeString,
              status: newStatus,
              title: statusTitles[newStatus] || `Status updated to ${newStatus}`,
              description: note || `Order marked as ${newStatus.toUpperCase()} by Uttarpara Showroom Admin`
            };

            return {
              ...o,
              status: newStatus,
              isNew: false,
              timeline: [...(o.timeline || []), newEvent]
            };
          })
        }));
      },

      markAsRead: (orderId) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, isNew: false } : o))
        }));
      },

      addInternalNote: (orderId, note) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, internalNotes: note } : o))
        }));
      },

      setTrackingNumber: (orderId, trackingNumber, courierName) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, trackingNumber, ...(courierName ? { courierName } : {}) } : o))
        }));
      },

      clearOrders: () => set({ orders: [] }),

      resetToSeed: () => set({ orders: seedOrders }),

      importOrders: (imported) => {
        if (Array.isArray(imported)) {
          set({ orders: imported });
        }
      }
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      migrate: (persistedState: any) => {
        if (!persistedState || !Array.isArray(persistedState.orders)) {
          return { orders: seedOrders };
        }
        return persistedState;
      }
    }
  )
);

if (typeof window !== 'undefined') {
  registerStoreForSync(STORAGE_KEY, () => useOrderStore.persist.rehydrate());
}
