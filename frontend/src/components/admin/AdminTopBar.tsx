'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Menu, Search, ExternalLink, Bell, LogOut, CheckCircle2, 
  AlertTriangle, ShoppingBag, Radio, RefreshCw 
} from 'lucide-react';
import { useAdminSessionStore } from '@/store/adminSessionStore';
import { useOrderStore } from '@/store/orderStore';
import { useProductStore } from '@/store/productStore';
import { AdminTab } from './AdminSidebar';
import toast from 'react-hot-toast';

interface AdminTopBarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onOpenMobile: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export default function AdminTopBar({
  activeTab,
  onSelectTab,
  onOpenMobile,
  searchTerm,
  onSearchChange,
}: AdminTopBarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { username, logout } = useAdminSessionStore();
  const orders = useOrderStore((state) => state.orders);
  const markAsRead = useOrderStore((state) => state.markAsRead);
  const products = useProductStore((state) => state.products);

  // Close notifications dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const lowStockProducts = products.filter(
    (p) => p.status === 'published' && p.stockCount <= (p.lowStockThreshold || 5)
  );
  const newOrders = orders.filter((o) => o.isNew || o.status === 'placed');
  const totalAlerts = lowStockProducts.length + newOrders.length;

  const tabTitles: Record<AdminTab, { title: string; subtitle: string }> = {
    dashboard: { title: 'Showroom Executive Overview', subtitle: 'Live telemetry, sales momentum, and store analytics' },
    products: { title: 'Product Catalogue Matrix', subtitle: 'Complete inventory lifecycle, variants, and merchandising' },
    categories: { title: 'Taxonomy & Categories', subtitle: 'Manage product hierarchy and storefront navigation' },
    brands: { title: 'Authorized Brand Directory', subtitle: 'Curate luxury electronics partner brands and heritage' },
    inventory: { title: 'Real-Time Stock & Logistics', subtitle: 'Adjust showroom counts, threshold alerts, and audit logs' },
    orders: { title: 'Showroom & Online Orders', subtitle: 'Customer purchases, tracking fulfillment, and printable invoices' },
    customers: { title: 'Customer Relationship Registry', subtitle: 'Purchase history, lifetime value, and delivery records' },
    coupons: { title: 'Promotional Engine & Coupons', subtitle: 'Create discount codes, limits, and checkout incentives' },
    reviews: { title: 'Customer Experience & Reviews', subtitle: 'Moderate user reviews and rating distributions' },
    content: { title: 'Storefront Homepage Curator', subtitle: 'Hero banners, announcement bar, and featured collections' },
    reports: { title: 'Analytics & Financial Reports', subtitle: 'Category yields, brand performance, and inventory valuation' },
    settings: { title: 'System & Storefront Settings', subtitle: 'Showroom coordinates, hours, policies, and data backup tools' },
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out of Saitronics admin portal.');
  };

  return (
    <header className="h-16 bg-[#0E0E0E] border-b border-white/[0.08] px-4 lg:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
      {/* Left: Mobile trigger & Page Titles */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="p-2 rounded-xl bg-white/[0.04] text-[#A1A1A1] hover:text-white lg:hidden border border-white/[0.06]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm lg:text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>{tabTitles[activeTab]?.title}</span>
          </h1>
          <p className="text-[11px] text-[#717171] hidden md:block">
            {tabTitles[activeTab]?.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Global Search Input */}
        <div className="relative hidden sm:block w-48 md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#555]">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search catalog or orders..."
            className="w-full bg-[#141414] border border-white/[0.08] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#E50924] transition-colors"
          />
        </div>

        {/* Live Sync Status Pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Sync</span>
        </div>

        {/* View Storefront Link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-[#C4C4C4] hover:text-white transition-all"
        >
          <span>Storefront</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#E50924]" />
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#A1A1A1] hover:text-white border border-white/[0.06] transition-colors"
          >
            <Bell className="w-4 h-4" />
            {totalAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E50924] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {totalAlerts > 9 ? '9+' : totalAlerts}
              </span>
            )}
          </button>

          {/* Dropdown Menu */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#121212] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-3.5 border-b border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white tracking-wide uppercase">
                    System Alerts & Activities
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#E50924]/20 text-[#E50924]">
                    {totalAlerts}
                  </span>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.04]">
                {totalAlerts === 0 ? (
                  <div className="p-6 text-center text-xs text-[#717171]">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2 opacity-80" />
                    All inventory levels and orders are up to date.
                  </div>
                ) : (
                  <>
                    {/* New Orders Section */}
                    {newOrders.map((o) => (
                      <div
                        key={o.id}
                        onClick={() => {
                          markAsRead(o.id);
                          onSelectTab('orders');
                          setNotificationsOpen(false);
                        }}
                        className="p-3 hover:bg-white/[0.03] cursor-pointer transition-colors flex items-start gap-3"
                      >
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-semibold text-white truncate">
                              Order #{o.id}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-bold uppercase">
                              ₹{o.grandTotal.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#888] truncate">
                            {o.customerName} &bull; {o.items.length} item(s)
                          </p>
                          <span className="text-[10px] text-[#555] block mt-0.5">{o.date}</span>
                        </div>
                      </div>
                    ))}

                    {/* Low Stock Alerts Section */}
                    {lowStockProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectTab('inventory');
                          setNotificationsOpen(false);
                        }}
                        className="p-3 hover:bg-white/[0.03] cursor-pointer transition-colors flex items-start gap-3"
                      >
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-semibold text-white truncate">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-amber-400 font-bold">
                              {p.stockCount} left
                            </span>
                          </div>
                          <p className="text-[11px] text-[#888]">
                            Stock count is at or below threshold ({p.lowStockThreshold || 5}).
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Badge & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
          <div className="hidden sm:block text-right">
            <span className="text-xs font-bold text-white block">
              {username || 'saitronics'}
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold block uppercase">
              Showroom Admin
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-[#E50924]/10 text-[#A1A1A1] hover:text-[#E50924] border border-white/[0.06] hover:border-[#E50924]/30 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
