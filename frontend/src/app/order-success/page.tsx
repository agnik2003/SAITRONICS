'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { Order } from '@/types';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id') || 'ST-829410';
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('latest-order');
      if (stored) setOrder(JSON.parse(stored));
    } catch {
      // storage unavailable
    }
  }, []);

  return (
    <div className="max-w-xl w-full bg-[#111111] border border-white/[0.08] rounded-[4px] p-8 sm:p-12 text-center relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-radial-red opacity-50 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="w-16 h-16 bg-[#E50924]/20 border border-[#E50924]/40 rounded-[4px] flex items-center justify-center mx-auto mb-6 text-[#FF3048]">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF3048]">
          Order Confirmed & Logged
        </span>

        <h1 className="font-heading text-2xl sm:text-4xl font-black text-white mt-2 mb-3">
          Thank You For Shopping at Saitronics
        </h1>

        <p className="text-xs sm:text-sm text-[#B8B8B8] leading-relaxed max-w-md mx-auto font-sans">
          Your flagship order <span className="font-mono text-white font-bold">{orderId}</span> has been received and routed to our Uttarpara showroom fulfillment team.
        </p>

        {/* Details Box */}
        <div className="mt-8 p-5 rounded-[4px] bg-[#161616] border border-white/[0.08] text-left space-y-2 text-xs">
          <div className="flex justify-between text-[#858585]">
            <span className="uppercase tracking-wider text-[10px]">Order Reference</span>
            <span className="font-mono font-bold text-white">{orderId}</span>
          </div>
          {order && (
            <>
              <div className="flex justify-between text-[#858585]">
                <span className="uppercase tracking-wider text-[10px]">Customer Name</span>
                <span className="font-semibold text-white">{order.customerName}</span>
              </div>
              <div className="flex justify-between text-[#858585]">
                <span className="uppercase tracking-wider text-[10px]">Total Amount</span>
                <span className="font-heading font-bold text-[#FF3048] tabular-nums">₹{order.grandTotal?.toLocaleString('en-IN')}</span>
              </div>
            </>
          )}
          <div className="flex justify-between text-[#858585] pt-2 border-t border-white/[0.05]">
            <span className="uppercase tracking-wider text-[10px]">Showroom Pickup / Inquiries</span>
            <a href="tel:09831250575" className="text-white hover:underline font-bold tabular-nums">09831250575</a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link
            href="/my-orders"
            className="flex-1 btn-primary py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" /> View My Orders
          </Link>
          <Link
            href="/products"
            className="flex-1 btn-secondary py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="bg-[#090909] text-white min-h-[80vh] flex items-center justify-center py-16 px-4">
      <Suspense fallback={<div className="text-white text-xs">Loading order confirmation...</div>}>
        <OrderSuccessContent />
      </Suspense>
    </div>
  );
}
