'use client';

import React from 'react';
import { 
  TrendingUp, ShoppingBag, Package, AlertTriangle, ArrowUpRight, 
  Plus, CheckCircle2, Clock, Truck, XCircle, ArrowRight
} from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { useOrderStore } from '@/store/orderStore';
import { useCustomerStore } from '@/store/customerStore';
import { AdminTab } from '../AdminSidebar';

interface DashboardTabProps {
  onNavigateTab: (tab: AdminTab) => void;
  onOpenProductEditor: () => void;
}

export default function DashboardTab({ onNavigateTab, onOpenProductEditor }: DashboardTabProps) {
  const products = useProductStore((state) => state.products);
  const orders = useOrderStore((state) => state.orders);
  const customers = useCustomerStore((state) => state.customers);

  // Financial Computations
  const nonCancelledOrders = orders.filter((o) => o.status !== 'cancelled');
  const totalRevenue = nonCancelledOrders.reduce((acc, o) => acc + o.grandTotal, 0);

  const activeProducts = products.filter((p) => p.status === 'published');
  const outOfStockCount = activeProducts.filter((p) => p.stockCount === 0).length;
  const lowStockCount = activeProducts.filter(
    (p) => p.stockCount > 0 && p.stockCount <= (p.lowStockThreshold || 5)
  ).length;

  const ordersByStatus = {
    placed: orders.filter((o) => o.status === 'placed').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const lowStockItems = activeProducts
    .filter((p) => p.stockCount <= (p.lowStockThreshold || 5))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#141414] via-[#101010] to-[#0D0D0D] border border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#E50924]">
              Executive Telemetry
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-emerald-400 font-medium">Showroom Online</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Uttarpara Flagship Terminal
          </h2>
          <p className="text-xs text-[#808080] mt-0.5">
            Real-time synchronization across showroom POS and digital storefront
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenProductEditor}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E50924] hover:bg-[#C8081F] text-white text-xs font-semibold tracking-wide transition-all shadow-lg shadow-[#E50924]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Device</span>
          </button>

          <button
            onClick={() => onNavigateTab('orders')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white text-xs font-semibold border border-white/[0.08] transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-[#A1A1A1]" />
            <span>Review Orders</span>
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#808080] mb-2 font-medium">
            <span>Gross Showroom Revenue</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#717171]">
            <span className="text-emerald-400 font-semibold">{nonCancelledOrders.length} fulfilled orders</span>
            <span>recorded</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08]">
          <div className="flex items-center justify-between text-xs text-[#808080] mb-2 font-medium">
            <span>Total Orders Placed</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {orders.length}
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-[#717171]">
            <span className="text-amber-400 font-semibold">{ordersByStatus.placed + ordersByStatus.processing} in progress</span>
            <span>&bull;</span>
            <span className="text-emerald-400 font-semibold">{ordersByStatus.delivered} completed</span>
          </div>
        </div>

        {/* Active Products */}
        <div className="p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08]">
          <div className="flex items-center justify-between text-xs text-[#808080] mb-2 font-medium">
            <span>Catalogue Inventory</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {activeProducts.length} <span className="text-xs font-normal text-[#666]">Devices</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#717171]">
            <span className="text-white font-semibold">{products.reduce((acc, p) => acc + p.stockCount, 0)} total units</span>
            <span>on floor</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08]">
          <div className="flex items-center justify-between text-xs text-[#808080] mb-2 font-medium">
            <span>Inventory Alerts</span>
            <div className="p-1.5 rounded-lg bg-[#E50924]/10 text-[#E50924]">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {lowStockCount + outOfStockCount}
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-[#717171]">
            <span className="text-[#FF4D4F] font-semibold">{outOfStockCount} out of stock</span>
            <span>&bull;</span>
            <span className="text-amber-400 font-semibold">{lowStockCount} low</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Order Status Pipeline & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status Pipeline */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0E0E0E] border border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                Order Fulfillment Flow
              </h3>
              <p className="text-xs text-[#717171]">Live pipeline status across all orders</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-[#E50924] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 rounded-xl bg-[#141414] border border-white/[0.06] text-center">
              <Clock className="w-4 h-4 text-blue-400 mx-auto mb-1.5" />
              <div className="text-lg font-black text-white">{ordersByStatus.placed}</div>
              <div className="text-[10px] text-[#808080] uppercase tracking-wider font-semibold">Placed</div>
            </div>

            <div className="p-3 rounded-xl bg-[#141414] border border-white/[0.06] text-center">
              <Clock className="w-4 h-4 text-amber-400 mx-auto mb-1.5" />
              <div className="text-lg font-black text-white">{ordersByStatus.processing}</div>
              <div className="text-[10px] text-[#808080] uppercase tracking-wider font-semibold">Processing</div>
            </div>

            <div className="p-3 rounded-xl bg-[#141414] border border-white/[0.06] text-center">
              <Truck className="w-4 h-4 text-purple-400 mx-auto mb-1.5" />
              <div className="text-lg font-black text-white">{ordersByStatus.shipped}</div>
              <div className="text-[10px] text-[#808080] uppercase tracking-wider font-semibold">In Transit</div>
            </div>

            <div className="p-3 rounded-xl bg-[#141414] border border-white/[0.06] text-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1.5" />
              <div className="text-lg font-black text-white">{ordersByStatus.delivered}</div>
              <div className="text-[10px] text-[#808080] uppercase tracking-wider font-semibold">Delivered</div>
            </div>

            <div className="p-3 rounded-xl bg-[#141414] border border-white/[0.06] text-center">
              <XCircle className="w-4 h-4 text-[#888] mx-auto mb-1.5" />
              <div className="text-lg font-black text-white">{ordersByStatus.cancelled}</div>
              <div className="text-[10px] text-[#808080] uppercase tracking-wider font-semibold">Cancelled</div>
            </div>
          </div>

          {/* Graphical Pipeline Progress Bar */}
          <div className="mt-5 space-y-1.5">
            <div className="h-2 w-full bg-[#181818] rounded-full overflow-hidden flex">
              <div
                style={{ width: `${(ordersByStatus.placed / (orders.length || 1)) * 100}%` }}
                className="bg-blue-500 transition-all"
              />
              <div
                style={{ width: `${(ordersByStatus.processing / (orders.length || 1)) * 100}%` }}
                className="bg-amber-500 transition-all"
              />
              <div
                style={{ width: `${(ordersByStatus.shipped / (orders.length || 1)) * 100}%` }}
                className="bg-purple-500 transition-all"
              />
              <div
                style={{ width: `${(ordersByStatus.delivered / (orders.length || 1)) * 100}%` }}
                className="bg-emerald-500 transition-all"
              />
              <div
                style={{ width: `${(ordersByStatus.cancelled / (orders.length || 1)) * 100}%` }}
                className="bg-zinc-600 transition-all"
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#666]">
              <span>Pipeline Health: {Math.round((ordersByStatus.delivered / (nonCancelledOrders.length || 1)) * 100)}% Fulfilled</span>
              <span>Total Orders Recorded: {orders.length}</span>
            </div>
          </div>
        </div>

        {/* Customer Base Snapshot */}
        <div className="p-6 rounded-2xl bg-[#0E0E0E] border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                Customer Registry
              </h3>
              <button
                onClick={() => onNavigateTab('customers')}
                className="text-xs text-[#E50924] hover:underline font-semibold"
              >
                View All
              </button>
            </div>
            <p className="text-xs text-[#717171] mb-4">
              Registered customers and verified showroom buyers
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-white/[0.04]">
                <span className="text-xs text-[#A1A1A1]">Total Unique Customers</span>
                <span className="text-sm font-bold text-white">{customers.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-white/[0.04]">
                <span className="text-xs text-[#A1A1A1]">Average Lifetime Spend</span>
                <span className="text-sm font-bold text-emerald-400">
                  ₹
                  {customers.length > 0
                    ? Math.round(totalRevenue / customers.length).toLocaleString('en-IN')
                    : 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-white/[0.04]">
                <span className="text-xs text-[#A1A1A1]">Repeat VIP Customers</span>
                <span className="text-sm font-bold text-white">
                  {customers.filter((c) => c.totalOrders > 1).length}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('customers')}
            className="w-full mt-4 py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-[#A1A1A1] hover:text-white transition-all text-center border border-white/[0.06]"
          >
            Open Customer Database
          </button>
        </div>
      </div>

      {/* Bottom Row: Recent Orders & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0E0E0E] border border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                Recent Showroom Transactions
              </h3>
              <p className="text-xs text-[#717171]">Latest order submissions</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-[#E50924] hover:underline font-semibold"
            >
              See All Orders
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-[#717171] uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Items</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {recentOrders.map((order) => {
                  const statusColors: Record<string, string> = {
                    placed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                    processing: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                    shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                    delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                    cancelled: 'bg-zinc-800 text-zinc-400 border-zinc-700',
                  };

                  return (
                    <tr
                      key={order.id}
                      onClick={() => onNavigateTab('orders')}
                      className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                    >
                      <td className="py-3 font-mono font-medium text-white">
                        #{order.id}
                      </td>
                      <td className="py-3">
                        <span className="font-semibold text-white block">{order.customerName}</span>
                        <span className="text-[10px] text-[#717171]">{order.customerPhone}</span>
                      </td>
                      <td className="py-3 text-[#A1A1A1] max-w-[180px] truncate">
                        {order.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', ')}
                      </td>
                      <td className="py-3 font-semibold text-white">
                        ₹{order.grandTotal.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                            statusColors[order.status] || 'bg-white/10 text-white'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="p-6 rounded-2xl bg-[#0E0E0E] border border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                Critical Stock Watchlist
              </h3>
              <p className="text-xs text-[#717171]">Units requiring immediate restock</p>
            </div>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="text-xs text-[#E50924] hover:underline font-semibold"
            >
              Restock
            </button>
          </div>

          <div className="space-y-3">
            {lowStockItems.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#717171]">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-2 opacity-80" />
                All stock levels healthy.
              </div>
            ) : (
              lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-[#141414] border border-white/[0.04] flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1 mr-2">
                    <span className="text-xs font-semibold text-white block truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-[#717171] uppercase">
                      {item.brand} &bull; {item.category}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.stockCount === 0
                          ? 'bg-[#E50924]/20 text-[#FF4D4F] border border-[#E50924]/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {item.stockCount === 0 ? 'Out of Stock' : `${item.stockCount} left`}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => onNavigateTab('inventory')}
            className="w-full mt-5 py-2 px-3 rounded-xl bg-[#E50924]/10 hover:bg-[#E50924]/20 text-xs font-semibold text-[#E50924] transition-all text-center border border-[#E50924]/30"
          >
            Open Showroom Inventory Matrix
          </button>
        </div>
      </div>
    </div>
  );
}
