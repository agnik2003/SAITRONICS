'use client';

import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, Package, Layers, Bookmark, Warehouse, 
  ShoppingBag, Users, Ticket, MessageSquare, Globe, 
  BarChart3, Settings, ShieldCheck, X, ExternalLink
} from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { useOrderStore } from '@/store/orderStore';
import { useReviewStore } from '@/store/reviewStore';

export type AdminTab = 
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'brands'
  | 'inventory'
  | 'orders'
  | 'customers'
  | 'coupons'
  | 'reviews'
  | 'content'
  | 'reports'
  | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function AdminSidebar({
  activeTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const products = useProductStore((state) => state.products);
  const orders = useOrderStore((state) => state.orders);
  const reviews = useReviewStore((state) => state.reviews);

  // Computed badge counters
  const lowStockCount = products.filter(
    (p) => p.status === 'published' && p.stockCount <= (p.lowStockThreshold || 5)
  ).length;

  const newOrdersCount = orders.filter((o) => o.isNew || o.status === 'placed').length;
  const pendingReviewsCount = reviews.filter((r) => r.status === 'pending').length;

  const navItems: { id: AdminTab; label: string; icon: React.ElementType; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package, badge: lowStockCount > 0 ? lowStockCount : undefined, badgeColor: 'bg-amber-500/15 text-amber-400 border border-amber-500/30' },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'brands', label: 'Brands', icon: Bookmark },
    { id: 'inventory', label: 'Inventory', icon: Warehouse, badge: lowStockCount > 0 ? lowStockCount : undefined, badgeColor: 'bg-[#E50924]/15 text-[#E50924] border border-[#E50924]/30' },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: newOrdersCount > 0 ? newOrdersCount : undefined, badgeColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'coupons', label: 'Coupons', icon: Ticket },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare, badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined, badgeColor: 'bg-blue-500/15 text-blue-400 border border-blue-500/30' },
    { id: 'content', label: 'Website Content', icon: Globe },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#0A0A0A] border-r border-white/[0.08] flex flex-col z-50 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E50924]/10 border border-[#E50924]/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#E50924]" />
            </div>
            <div>
              <span className="text-sm font-black tracking-[0.2em] text-white uppercase block">
                SAITRONICS
              </span>
              <span className="text-[10px] text-[#717171] uppercase tracking-wider font-semibold block">
                Control Center
              </span>
            </div>
          </Link>

          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-[#717171] hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-widest text-[#525252] uppercase">
            Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-[#181818] text-white shadow-sm border border-white/[0.08]'
                    : 'text-[#8A8A8A] hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#E50924] text-white'
                        : 'text-[#717171] group-hover:text-white group-hover:bg-white/[0.05]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="tracking-wide">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      item.badgeColor || 'bg-white/10 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Quick Links */}
        <div className="p-3 border-t border-white/[0.08] shrink-0 bg-[#0E0E0E]">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#A1A1A1] hover:text-white hover:bg-white/[0.05] transition-colors border border-transparent hover:border-white/[0.08]"
          >
            <span className="font-medium">Open Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#E50924]" />
          </Link>
        </div>
      </aside>
    </>
  );
}
