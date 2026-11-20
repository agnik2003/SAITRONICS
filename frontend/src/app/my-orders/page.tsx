'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Package, ArrowLeft, Phone, CheckCircle, Truck, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useOrderStore } from '@/store/orderStore';
import { useStoreSettingsStore } from '@/store/storeSettingsStore';
import { CartItem } from '@/types';

export default function MyOrdersPage() {
  const orders = useOrderStore((state) => state.orders);
  const settings = useStoreSettingsStore((state) => state.settings);

  return (
    <div className="bg-[#090909] text-white min-h-screen py-10 px-4">
      <div className="container-custom max-w-4xl">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/[0.08]">
          <Link href="/account" className="p-2 bg-[#161616] border border-white/[0.08] rounded-[4px] hover:text-[#FF3048] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-white">
              My Orders & History
            </h1>
            <p className="text-xs text-[#858585] mt-0.5 font-sans">
              Real-time synchronization with {settings.storeName} showroom dispatch terminal
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-[#111111] border border-white/[0.08] rounded-[4px] p-12 text-center">
            <Package className="w-12 h-12 text-[#858585] mx-auto mb-4" />
            <h2 className="font-heading text-lg font-bold mb-2">No Past Orders Found</h2>
            <p className="text-xs text-[#858585] mb-6 font-sans">You haven&apos;t placed any orders yet.</p>
            <Link href="/products" className="btn-primary text-xs font-bold px-6 py-3 uppercase tracking-wider inline-block">
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const statusStep = 
                order.status === 'placed' ? 1 :
                order.status === 'processing' ? 2 :
                order.status === 'shipped' ? 3 :
                order.status === 'delivered' ? 4 : 0;

              return (
                <div key={order.id} className="bg-[#111111] border border-white/[0.08] rounded-[4px] p-6 sm:p-8 space-y-6">
                  
                  {/* Header row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-white bg-[#161616] px-2.5 py-1 rounded-[2px] border border-white/[0.06]">
                          {order.id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          order.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#858585] mt-1 font-sans">
                        Placed on {order.date} • Paid via {order.paymentMethod?.toUpperCase()}
                        {order.couponCode && <span className="text-emerald-400 ml-2 font-mono">({order.couponCode} applied)</span>}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-[#858585] uppercase tracking-wider block">Total Amount</span>
                      <span className="font-heading text-xl font-black text-white tabular-nums">
                        ₹{order.grandTotal?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Tracking Number Callout if assigned */}
                  {order.trackingNumber && (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-[2px] flex items-center justify-between text-xs text-blue-300">
                      <span className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-blue-400" />
                        Courier Consignment: <strong className="font-mono text-white">{order.trackingNumber}</strong>
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">Trackable</span>
                    </div>
                  )}

                  {/* Items */}
                  <div className="space-y-3">
                    {order.items?.map((item: CartItem, i: number) => (
                      <div key={i} className="flex items-center gap-4 bg-[#161616] p-3 rounded-[4px] border border-white/[0.05]">
                        <div className="relative w-16 h-16 rounded-[2px] overflow-hidden bg-black/40 flex-shrink-0 p-1">
                          <Image
                            src={item.product?.images?.[0]?.url || '/products/apple/iphone-15-pro-max/front.webp'}
                            alt={item.product?.name || 'Product'}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-heading font-bold text-sm text-white truncate">
                            {item.product?.name}
                          </h4>
                          <p className="text-xs text-[#858585] font-sans">
                            Qty: {item.quantity} 
                            {item.selectedStorage ? ` • ${item.selectedStorage}` : ''}
                            {item.selectedColor ? ` • ${item.selectedColor}` : ''}
                          </p>
                        </div>
                        <span className="font-heading font-bold text-sm text-white tabular-nums">
                          ₹{(item.product?.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Progress Status Bar */}
                  {order.status !== 'cancelled' ? (
                    <div className="pt-2">
                      <div className="grid grid-cols-4 text-center text-[10px] font-semibold uppercase tracking-wider mb-2">
                        <span className={statusStep >= 1 ? 'text-[#FF3048]' : 'text-[#666666]'}>1. Placed</span>
                        <span className={statusStep >= 2 ? 'text-[#FF3048]' : 'text-[#666666]'}>2. Processing</span>
                        <span className={statusStep >= 3 ? 'text-[#FF3048]' : 'text-[#666666]'}>3. Dispatched</span>
                        <span className={statusStep >= 4 ? 'text-emerald-400' : 'text-[#666666]'}>4. Delivered</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#191919] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#E50924] to-[#FF3048] transition-all duration-500" 
                          style={{ width: `${(statusStep / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-[2px] text-xs text-red-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      This order was cancelled and inventory was returned to stock.
                    </div>
                  )}

                  {/* Timeline Log */}
                  {order.timeline && order.timeline.length > 0 && (
                    <div className="pt-3 border-t border-white/[0.04]">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-[#858585] mb-2">
                        Fulfillment History:
                      </p>
                      <div className="space-y-2 border-l border-white/[0.08] ml-2 pl-3">
                        {order.timeline.map(event => (
                          <div key={event.id} className="text-xs">
                            <span className="text-white font-semibold">{event.title}</span>
                            <span className="text-[#858585] text-[10px] font-mono ml-2">({event.date} • {event.time})</span>
                            <p className="text-[#858585] text-[11px] mt-0.5">{event.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer Help */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-white/[0.08] text-xs text-[#858585]">
                    <span className="truncate max-w-md">Delivery to: {order.shippingAddress || 'Uttarpara Showroom'}</span>
                    <a href={`tel:${settings.phone}`} className="text-[#FF3048] font-bold hover:underline flex items-center gap-1 uppercase tracking-wider text-[11px] flex-shrink-0">
                      <Phone className="w-3 h-3" /> Call Store Support ({settings.phone})
                    </a>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
