'use client';

import { useEffect } from 'react';
import { initLiveSync } from '@/store/syncEngine';
import { useCartStore } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';

export default function SyncProvider({ children }: { children: React.ReactNode }) {
  const products = useProductStore((state) => state.products);
  const syncCartWithStock = useCartStore((state) => state.syncCartWithStock);

  useEffect(() => {
    initLiveSync();
  }, []);

  // Whenever product stock updates (locally or cross-tab), verify cart quantities
  useEffect(() => {
    syncCartWithStock(products);
  }, [products, syncCartWithStock]);

  return <>{children}</>;
}
