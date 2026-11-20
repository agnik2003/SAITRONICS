'use client';

import React, { useState } from 'react';
import { 
  Users, Search, Download, ChevronRight, X, Mail, Phone, 
  MapPin, ShoppingBag, Calendar, DollarSign 
} from 'lucide-react';
import { Customer, Order } from '@/types';
import { useCustomerStore } from '@/store/customerStore';
import { useOrderStore } from '@/store/orderStore';
import toast from 'react-hot-toast';

export default function CustomersTab() {
  const customers = useCustomerStore((state) => state.customers);
  const orders = useOrderStore((state) => state.orders);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter((c) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  });

  // Customer Orders
  const customerOrders = selectedCustomer
    ? orders.filter(
        (o) =>
          o.customerEmail.toLowerCase() === selectedCustomer.email.toLowerCase() ||
          o.customerPhone === selectedCustomer.phone
      )
    : [];

  const handleExportCSV = () => {
    const headers = ['Customer ID', 'Full Name', 'Email Address', 'Phone Number', 'Total Orders', 'Lifetime Spend (INR)', 'Last Purchase Date'];
    const rows = customers.map((c) => [
      `"${c.id}"`,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.email}"`,
      `"${c.phone}"`,
      c.totalOrders,
      c.totalSpend,
      `"${c.lastOrderDate || 'N/A'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Saitronics_Customers_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Customer directory exported as CSV.');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08]">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Customer Relationship Registry
          </h2>
          <p className="text-xs text-[#717171]">
            Aggregated directory of registered users and verified showroom buyers
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white text-xs font-semibold border border-white/[0.08] transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#A1A1A1]" />
          <span>Export Customers CSV</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0E0E0E] border border-white/[0.08] flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#555]">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, email, phone..."
            className="w-full bg-[#141414] border border-white/[0.08] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#E50924]"
          />
        </div>

        <div className="text-xs text-[#717171]">
          Showing <strong className="text-white font-bold">{filteredCustomers.length}</strong> customers
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-2xl bg-[#0E0E0E] border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] bg-[#121212] text-[#717171] uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Client Name</th>
                <th className="py-3.5 px-4 font-semibold">Contact Email</th>
                <th className="py-3.5 px-4 font-semibold">Phone Number</th>
                <th className="py-3.5 px-4 font-semibold">Purchases</th>
                <th className="py-3.5 px-4 font-semibold">Lifetime Spend</th>
                <th className="py-3.5 px-4 font-semibold">Last Order</th>
                <th className="py-3.5 px-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#666]">
                    No customer records matched your query.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCustomer(c)}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-white">
                      {c.name}
                    </td>

                    <td className="py-3 px-4 text-[#A1A1A1]">
                      {c.email}
                    </td>

                    <td className="py-3 px-4 text-[#888] font-mono">
                      {c.phone}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/[0.05] text-white">
                        {c.totalOrders} order(s)
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      ₹{c.totalSpend.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 text-[#717171]">
                      {c.lastOrderDate || 'Recent'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="p-1.5 rounded-lg text-[#717171] hover:text-white transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedCustomer(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-xl bg-[#121212] border border-white/[0.1] rounded-2xl p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {selectedCustomer.name}
                </h3>
                <span className="text-xs text-[#888]">Customer ID: {selectedCustomer.id}</span>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-[#666] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Contact Snapshot */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#181818] border border-white/[0.04] text-xs">
                <div>
                  <span className="text-[10px] text-[#717171] uppercase block">Email</span>
                  <span className="text-white font-medium">{selectedCustomer.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#717171] uppercase block">Phone</span>
                  <span className="text-white font-mono">{selectedCustomer.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#717171] uppercase block">Lifetime Value</span>
                  <span className="text-emerald-400 font-bold font-mono">
                    ₹{selectedCustomer.totalSpend.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#717171] uppercase block">Orders Count</span>
                  <span className="text-white font-bold">{selectedCustomer.totalOrders}</span>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Order History ({customerOrders.length})
                </h4>
                <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
                  {customerOrders.length === 0 ? (
                    <p className="text-xs text-[#666] py-4 text-center">
                      No linked orders recorded for this profile.
                    </p>
                  ) : (
                    customerOrders.map((o) => (
                      <div
                        key={o.id}
                        className="p-3 rounded-xl bg-[#181818] border border-white/[0.04] flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white text-xs">#{o.id}</span>
                            <span className="text-[10px] text-[#717171]">{o.date}</span>
                          </div>
                          <span className="text-[11px] text-[#888] line-clamp-1">
                            {o.items.map((i) => i.product.name).join(', ')}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-white text-xs block">
                            ₹{o.grandTotal.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-400 uppercase">
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
