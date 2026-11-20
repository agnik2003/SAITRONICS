'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  ShoppingBag, Search, Filter, Download, ExternalLink, 
  Printer, CheckCircle2, Clock, Truck, XCircle, ChevronRight, 
  X, AlertCircle, Save, Tag, User, MapPin, CreditCard, ShieldCheck
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { useOrderStore } from '@/store/orderStore';
import { useProductStore } from '@/store/productStore';
import OrderInvoiceModal from './OrderInvoiceModal';
import toast from 'react-hot-toast';

interface OrdersTabProps {
  searchTerm: string;
}

export default function OrdersTab({ searchTerm: globalSearch }: OrdersTabProps) {
  const orders = useOrderStore((state) => state.orders);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);
  const setTrackingNumberAction = useOrderStore((state) => state.setTrackingNumber);
  const addInternalNoteAction = useOrderStore((state) => state.addInternalNote);
  const markAsRead = useOrderStore((state) => state.markAsRead);
  const adjustStock = useProductStore((state) => state.adjustStock);

  const [localSearch, setLocalSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  // Selected Order Drawer
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Drawer Form State
  const [courierName, setCourierName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [internalNote, setInternalNote] = useState('');

  const query = (localSearch || globalSearch).toLowerCase().trim();

  const filteredOrders = orders.filter((o) => {
    if (query) {
      const matchId = o.id.toLowerCase().includes(query);
      const matchName = o.customerName.toLowerCase().includes(query);
      const matchPhone = o.customerPhone.toLowerCase().includes(query);
      if (!matchId && !matchName && !matchPhone) return false;
    }

    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (paymentFilter !== 'all' && o.paymentMethod.toLowerCase() !== paymentFilter.toLowerCase()) return false;

    return true;
  });

  const handleOpenOrder = (o: Order) => {
    markAsRead(o.id);
    setSelectedOrder(o);
    setCourierName(o.courierName || 'BlueDart Express');
    setTrackingNumber(o.trackingNumber || '');
    setInternalNote(o.internalNotes || '');
  };

  // Status transition validation
  const handleStatusChange = (newStatus: OrderStatus) => {
    if (!selectedOrder) return;
    const current = selectedOrder.status;

    // Prevent illegal jumps
    if (current === 'delivered' && newStatus !== 'delivered' && newStatus !== 'cancelled') {
      toast.error('Illegal transition: Delivered orders cannot be moved backward.');
      return;
    }
    if (current === 'cancelled') {
      toast.error('Cancelled orders cannot be reopened.');
      return;
    }

    // If cancelling, restore stock
    if (newStatus === 'cancelled') {
      if (confirm('Cancelling this order will restore reserved device stock. Proceed?')) {
        selectedOrder.items.forEach((item) => {
          adjustStock(item.product.id, item.quantity, 'Order Cancelled', `Restored from cancelled Order #${selectedOrder.id}`);
        });
      } else {
        return;
      }
    }

    updateOrderStatus(selectedOrder.id, newStatus);
    setSelectedOrder({ ...selectedOrder, status: newStatus });
    toast.success(`Order #${selectedOrder.id} status changed to ${newStatus.toUpperCase()}.`);
  };

  const handleSaveTracking = () => {
    if (!selectedOrder) return;
    setTrackingNumberAction(selectedOrder.id, trackingNumber.trim(), courierName.trim());
    setSelectedOrder({ ...selectedOrder, trackingNumber: trackingNumber.trim(), courierName: courierName.trim() });
    toast.success('Fulfillment tracking reference saved.');
  };

  const handleSaveNotes = () => {
    if (!selectedOrder) return;
    addInternalNoteAction(selectedOrder.id, internalNote.trim());
    setSelectedOrder({ ...selectedOrder, internalNotes: internalNote.trim() });
    toast.success('Internal order notes saved.');
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Email', 'Shipping Address', 'Status', 'Grand Total', 'Payment Method', 'Tracking Number'];
    const rows = orders.map((o) => [
      `"${o.id}"`,
      `"${o.date}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.customerPhone}"`,
      `"${o.customerEmail}"`,
      `"${o.shippingAddress.replace(/"/g, '""')}"`,
      o.status,
      o.grandTotal,
      o.paymentMethod,
      `"${o.trackingNumber || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Saitronics_Orders_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Orders exported as CSV.');
  };

  const statusStyles: Record<OrderStatus, { bg: string; text: string; border: string }> = {
    placed: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    processing: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    shipped: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
    delivered: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    cancelled: { bg: 'bg-zinc-800', text: 'text-zinc-400', border: 'border-zinc-700' },
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08]">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Orders & Delivery Dispatch
          </h2>
          <p className="text-xs text-[#717171]">
            Track retail shipments, manage customer timelines, and print GST tax invoices
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white text-xs font-semibold border border-white/[0.08] transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#A1A1A1]" />
          <span>Export Orders CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0E0E0E] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-xl">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#555]">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by Order ID, customer, phone..."
              className="w-full bg-[#141414] border border-white/[0.08] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#E50924]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#141414] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#E50924]"
          >
            <option value="all">All Statuses</option>
            <option value="placed">Placed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-[#141414] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#E50924]"
          >
            <option value="all">Payment: All</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="cod">COD</option>
          </select>
        </div>

        <div className="text-xs text-[#717171]">
          Found <strong className="text-white font-bold">{filteredOrders.length}</strong> orders
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-[#0E0E0E] border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] bg-[#121212] text-[#717171] uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Order ID</th>
                <th className="py-3.5 px-4 font-semibold">Date</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Items</th>
                <th className="py-3.5 px-4 font-semibold">Amount</th>
                <th className="py-3.5 px-4 font-semibold">Payment</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[#666]">
                    No orders match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const style = statusStyles[o.status] || statusStyles.placed;

                  return (
                    <tr
                      key={o.id}
                      onClick={() => handleOpenOrder(o)}
                      className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white">#{o.id}</span>
                          {o.isNew && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#E50924] text-white uppercase">
                              New
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-[#888] whitespace-nowrap">
                        {o.date}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-white block">{o.customerName}</span>
                        <span className="text-[10px] text-[#717171]">{o.customerPhone}</span>
                      </td>

                      <td className="py-3 px-4 text-[#A1A1A1] max-w-[200px] truncate">
                        {o.items.map((it) => `${it.product.name} (x${it.quantity})`).join(', ')}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-white">
                        ₹{o.grandTotal.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold uppercase text-[#888]">
                          {o.paymentMethod}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${style.bg} ${style.text} ${style.border}`}
                        >
                          {o.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setInvoiceOrder(o)}
                            title="Print Tax Invoice"
                            className="p-1.5 rounded-lg text-[#717171] hover:text-white hover:bg-white/[0.05] transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenOrder(o)}
                            title="Inspect Details"
                            className="p-1.5 rounded-lg text-[#717171] hover:text-white hover:bg-white/[0.05] transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden flex">
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative ml-auto w-full max-w-xl bg-[#0D0D0D] border-l border-white/[0.1] h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="h-16 px-6 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-[#121212]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-wide font-mono">
                    Order #{selectedOrder.id}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      statusStyles[selectedOrder.status].bg
                    } ${statusStyles[selectedOrder.status].text} ${
                      statusStyles[selectedOrder.status].border
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <span className="text-[10px] text-[#717171]">Submitted on {selectedOrder.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInvoiceOrder(selectedOrder)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.08]"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-lg text-[#717171] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Status Workflow Selector */}
              <div className="p-4 rounded-xl bg-[#141414] border border-white/[0.06] space-y-3">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                  Update Order Pipeline Status
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(['placed', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      className={`py-2 px-1 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                        selectedOrder.status === st
                          ? 'bg-[#E50924] text-white border-[#E50924]'
                          : 'bg-[#181818] text-[#888] hover:text-white border-white/[0.06]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-[#666]">
                  Status transitions automatically write timestamped events to the customer tracker.
                </p>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Purchased Hardware
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#141414] border border-white/[0.04] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg bg-[#080808] border border-white/[0.06] overflow-hidden shrink-0 flex items-center justify-center">
                          <Image
                            src={it.product.images[0]?.url || '/products/apple/iphone-15-pro-max/front.webp'}
                            alt={it.product.name}
                            fill
                            className="object-contain p-1"
                            unoptimized
                          />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">{it.product.name}</span>
                          <span className="text-[10px] text-[#717171]">
                            {it.selectedStorage || 'Standard'} &bull; {it.selectedColor || 'Chassis'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-xs font-bold text-white block">
                          ₹{(it.product.price * it.quantity).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-[#717171]">Qty: {it.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Coordinates */}
              <div className="p-4 rounded-xl bg-[#141414] border border-white/[0.06] space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Customer Information
                </h4>
                <div className="text-xs space-y-1 text-[#C4C4C4]">
                  <p><strong className="text-white">Name:</strong> {selectedOrder.customerName}</p>
                  <p><strong className="text-white">Phone:</strong> {selectedOrder.customerPhone}</p>
                  <p><strong className="text-white">Email:</strong> {selectedOrder.customerEmail}</p>
                  <p><strong className="text-white">Shipping Address:</strong> {selectedOrder.shippingAddress}</p>
                </div>
              </div>

              {/* Tracking & Courier Assignment */}
              <div className="p-4 rounded-xl bg-[#141414] border border-white/[0.06] space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Logistics & Tracking Info
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-[#888] uppercase mb-1">Courier Partner</label>
                    <input
                      type="text"
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      placeholder="e.g. BlueDart Express"
                      className="w-full bg-[#181818] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#888] uppercase mb-1">Tracking Number</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. BLU-984210"
                      className="w-full bg-[#181818] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSaveTracking}
                  className="py-1.5 px-3 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.08]"
                >
                  Update Customer Tracking
                </button>
              </div>

              {/* Order Timeline Log */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Fulfillment History
                </h4>
                <div className="relative pl-6 space-y-4 border-l border-white/[0.1]">
                  {(selectedOrder.timeline || []).map((ev) => (
                    <div key={ev.id} className="relative">
                      <span className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-[#E50924] border-2 border-[#0D0D0D]" />
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{ev.status.toUpperCase()}</span>
                        <span className="text-[10px] text-[#717171]">{ev.date} at {ev.time}</span>
                      </div>
                      <p className="text-[11px] text-[#888] mt-0.5">{ev.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Internal Showroom Notes
                </h4>
                <textarea
                  rows={3}
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Private showroom notes (not visible to customer)..."
                  className="w-full bg-[#141414] border border-white/[0.08] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E50924]"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="py-1.5 px-3 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.08]"
                >
                  Save Internal Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      <OrderInvoiceModal
        order={invoiceOrder}
        isOpen={!!invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
      />
    </div>
  );
}
