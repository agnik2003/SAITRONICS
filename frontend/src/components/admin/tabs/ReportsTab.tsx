'use client';

import React from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, Package, Download, 
  Layers, Bookmark, ArrowUpRight, CheckCircle2 
} from 'lucide-react';
import { useOrderStore } from '@/store/orderStore';
import { useProductStore } from '@/store/productStore';
import { useTaxonomyStore } from '@/store/taxonomyStore';
import toast from 'react-hot-toast';

export default function ReportsTab() {
  const orders = useOrderStore((state) => state.orders);
  const products = useProductStore((state) => state.products);
  const categories = useTaxonomyStore((state) => state.categories);
  const brands = useTaxonomyStore((state) => state.brands);

  const validOrders = orders.filter((o) => o.status !== 'cancelled');
  const grossRevenue = validOrders.reduce((sum, o) => sum + o.grandTotal, 0);

  // Total showroom inventory valuation (Stock Count * Selling Price)
  const totalInventoryUnits = products.reduce((acc, p) => acc + p.stockCount, 0);
  const totalInventoryValuation = products.reduce((acc, p) => acc + (p.stockCount * p.price), 0);

  // Category Sales Breakdown
  const categorySales: Record<string, { revenue: number; units: number }> = {};
  validOrders.forEach((o) => {
    o.items.forEach((it) => {
      const cat = it.product.category || 'other';
      if (!categorySales[cat]) categorySales[cat] = { revenue: 0, units: 0 };
      categorySales[cat].revenue += it.product.price * it.quantity;
      categorySales[cat].units += it.quantity;
    });
  });

  // Brand Sales Breakdown
  const brandSales: Record<string, { revenue: number; units: number }> = {};
  validOrders.forEach((o) => {
    o.items.forEach((it) => {
      const b = it.product.brand || 'Other';
      if (!brandSales[b]) brandSales[b] = { revenue: 0, units: 0 };
      brandSales[b].revenue += it.product.price * it.quantity;
      brandSales[b].units += it.quantity;
    });
  });

  // Top Products
  const productPerformance: Record<string, { name: string; brand: string; revenue: number; units: number }> = {};
  validOrders.forEach((o) => {
    o.items.forEach((it) => {
      const id = it.product.id;
      if (!productPerformance[id]) {
        productPerformance[id] = {
          name: it.product.name,
          brand: it.product.brand,
          revenue: 0,
          units: 0,
        };
      }
      productPerformance[id].revenue += it.product.price * it.quantity;
      productPerformance[id].units += it.quantity;
    });
  });

  const sortedTopProducts = Object.values(productPerformance)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const handleExportReportCSV = () => {
    const headers = ['Metric / Category', 'Revenue (INR)', 'Units Sold / In Stock'];
    const rows = [
      ['Gross Sales Revenue', grossRevenue, validOrders.length],
      ['Showroom Inventory Valuation', totalInventoryValuation, totalInventoryUnits],
      ...Object.entries(categorySales).map(([cat, val]) => [
        `Category: ${cat.toUpperCase()}`,
        val.revenue,
        val.units,
      ]),
      ...Object.entries(brandSales).map(([b, val]) => [
        `Brand: ${b}`,
        val.revenue,
        val.units,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Saitronics_Financial_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Financial report exported as CSV.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08]">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Executive Analytics & Financial Telemetry
          </h2>
          <p className="text-xs text-[#717171]">
            Comprehensive breakdown of gross revenue, category velocity, and asset valuation
          </p>
        </div>

        <button
          onClick={handleExportReportCSV}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white text-xs font-semibold border border-white/[0.08] transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#A1A1A1]" />
          <span>Export Analytics CSV</span>
        </button>
      </div>

      {/* Primary Financial Metric Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08]">
          <span className="text-xs text-[#808080] font-medium block mb-1">Total Showroom Turnover</span>
          <div className="text-2xl font-black text-white">
            ₹{grossRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            Across {validOrders.length} confirmed orders
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08]">
          <span className="text-xs text-[#808080] font-medium block mb-1">Retail Inventory Valuation</span>
          <div className="text-2xl font-black text-white">
            ₹{totalInventoryValuation.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-blue-400 mt-1 block">
            {totalInventoryUnits} physical hardware units on showroom floor
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08]">
          <span className="text-xs text-[#808080] font-medium block mb-1">Average Order Value (AOV)</span>
          <div className="text-2xl font-black text-white">
            ₹{validOrders.length > 0 ? Math.round(grossRevenue / validOrders.length).toLocaleString('en-IN') : 0}
          </div>
          <span className="text-[11px] text-[#888] mt-1 block">
            Premium luxury basket size
          </span>
        </div>
      </div>

      {/* Two Columns: Category Yield & Brand Yield */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Sales Breakdown */}
        <div className="p-6 rounded-2xl bg-[#0E0E0E] border border-white/[0.08] space-y-4">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Revenue Yield by Category
            </h3>
            <p className="text-[11px] text-[#717171]">Product category contribution to gross sales</p>
          </div>

          <div className="space-y-3">
            {Object.entries(categorySales).map(([cat, data]) => {
              const share = grossRevenue > 0 ? Math.round((data.revenue / grossRevenue) * 100) : 0;

              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white uppercase">{cat}</span>
                    <span className="font-mono text-[#AAA]">
                      ₹{data.revenue.toLocaleString('en-IN')} ({share}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#181818] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${share}%` }}
                      className="h-full bg-[#E50924] rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Brand Sales Breakdown */}
        <div className="p-6 rounded-2xl bg-[#0E0E0E] border border-white/[0.08] space-y-4">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Authorized Brand Performance
            </h3>
            <p className="text-[11px] text-[#717171]">Market share of electronics manufacturers</p>
          </div>

          <div className="space-y-3">
            {Object.entries(brandSales).map(([b, data]) => {
              const share = grossRevenue > 0 ? Math.round((data.revenue / grossRevenue) * 100) : 0;

              return (
                <div key={b} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white">{b}</span>
                    <span className="font-mono text-[#AAA]">
                      ₹{data.revenue.toLocaleString('en-IN')} ({share}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#181818] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${share}%` }}
                      className="h-full bg-blue-500 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Performing Devices */}
      <div className="p-6 rounded-2xl bg-[#0E0E0E] border border-white/[0.08] space-y-4">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Flagship Hardware Leaderboard
          </h3>
          <p className="text-[11px] text-[#717171]">Top revenue-generating electronics in showroom</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-[#717171] uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Rank</th>
                <th className="pb-3 font-semibold">Device</th>
                <th className="pb-3 font-semibold">Brand</th>
                <th className="pb-3 font-semibold text-center">Units Sold</th>
                <th className="pb-3 font-semibold text-right">Gross Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {sortedTopProducts.map((p, idx) => (
                <tr key={idx} className="py-2.5">
                  <td className="py-3 font-mono font-bold text-[#E50924]">
                    #{idx + 1}
                  </td>
                  <td className="py-3 font-bold text-white">
                    {p.name}
                  </td>
                  <td className="py-3 text-[#AAA]">
                    {p.brand}
                  </td>
                  <td className="py-3 text-center font-mono font-bold text-white">
                    {p.units}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-emerald-400">
                    ₹{p.revenue.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
