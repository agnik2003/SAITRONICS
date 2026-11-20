'use client';

import React from 'react';
import { X, Printer, ShieldCheck } from 'lucide-react';
import { Order } from '@/types';
import { useStoreSettingsStore } from '@/store/storeSettingsStore';

interface OrderInvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderInvoiceModal({ order, isOpen, onClose }: OrderInvoiceModalProps) {
  const settings = useStoreSettingsStore((state) => state.settings);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Dark backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-sm print:hidden" 
      />

      {/* Invoice Container */}
      <div className="relative w-full max-w-2xl bg-white text-black rounded-2xl shadow-2xl p-8 z-10 print:p-0 print:m-0 print:shadow-none print:w-full print:max-w-none">
        {/* Action bar (hidden when printing) */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-200 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Tax Invoice & Packing Slip
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-semibold tracking-wide transition-all shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document */}
        <div className="space-y-6 text-xs text-gray-800">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-black tracking-widest uppercase text-black">
                  SAITRONICS
                </span>
                <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded font-bold">
                  LUXURY
                </span>
              </div>
              <p className="text-[11px] text-gray-600 font-medium">
                {settings.storeName}
              </p>
              <p className="text-[10px] text-gray-500 max-w-xs mt-0.5">
                {settings.address} &bull; Phone: {settings.phone}
              </p>
              <p className="text-[10px] text-gray-500">
                GSTIN: 19AAHCS2810C1Z4 &bull; Official Brand Authorized
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-widest text-red-600 block">
                Original Receipt
              </span>
              <span className="text-base font-black font-mono text-black block mt-0.5">
                #{order.id}
              </span>
              <span className="text-[10px] text-gray-500 block mt-1">
                Date: {order.date}
              </span>
              <span className="text-[10px] text-gray-500 block">
                Payment: {order.paymentMethod?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Customer & Delivery Coordinates */}
          <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Billed & Shipped To:
              </span>
              <p className="font-bold text-gray-900 text-sm">{order.customerName}</p>
              <p className="text-[11px] text-gray-600 mt-0.5">{order.customerPhone}</p>
              <p className="text-[11px] text-gray-600">{order.customerEmail}</p>
              <p className="text-[11px] text-gray-700 mt-1">{order.shippingAddress}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Fulfillment Status:
              </span>
              <div className="space-y-1 text-[11px]">
                <p className="text-gray-700">
                  Status: <strong className="uppercase font-bold text-black">{order.status}</strong>
                </p>
                {order.trackingNumber && (
                  <p className="text-gray-700 font-mono">
                    Tracking: {order.trackingNumber} ({order.courierName || 'BlueDart Express'})
                  </p>
                )}
                {order.couponCode && (
                  <p className="text-emerald-700 font-semibold">
                    Promo Applied: {order.couponCode} (-₹{order.couponDiscount?.toLocaleString('en-IN')})
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-300 text-gray-500 uppercase tracking-wider text-[10px]">
                <th className="py-2 font-semibold">Item & Description</th>
                <th className="py-2 font-semibold">Variant / Finish</th>
                <th className="py-2 font-semibold text-center">Qty</th>
                <th className="py-2 font-semibold text-right">Unit Price</th>
                <th className="py-2 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.items.map((item, i) => (
                <tr key={i} className="py-2">
                  <td className="py-3 font-semibold text-gray-900">
                    {item.product.name}
                  </td>
                  <td className="py-3 text-gray-600">
                    {item.selectedStorage || 'Standard'} &bull; {item.selectedColor || 'Default'}
                  </td>
                  <td className="py-3 text-center font-mono text-gray-800">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-right font-mono text-gray-800">
                    ₹{item.product.price.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-gray-900">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Breakdown */}
          <div className="border-t border-gray-300 pt-4 flex justify-end">
            <div className="w-64 space-y-1.5 text-right">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-mono">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
              {order.couponDiscount && order.couponDiscount > 0 ? (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount:</span>
                  <span className="font-mono">-₹{order.couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-gray-600">
                <span>Estimated GST (18% Included):</span>
                <span className="font-mono">₹{Math.round((order.grandTotal * 0.18) / 1.18).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Express Shipping:</span>
                <span className="font-mono">Free Showroom Delivery</span>
              </div>
              <div className="flex justify-between text-sm font-black text-black pt-2 border-t border-gray-300">
                <span>Total Amount:</span>
                <span className="font-mono">₹{order.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer Terms */}
          <div className="border-t border-gray-200 pt-4 text-[10px] text-gray-500 text-center space-y-1">
            <p>Thank you for choosing Saitronics Luxury Electronics.</p>
            <p>All devices covered by Official Brand Manufacturer Warranty. Proof of purchase required for service.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
