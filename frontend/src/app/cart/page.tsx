'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck, Tag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, total, clearCart } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const subtotal = total();
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shipping = subtotal >= 999 ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'SAITRONICS10') {
      setDiscountPercent(10);
      toast.success('Coupon SAITRONICS10 applied! (10% Off)', {
        style: { background: '#111111', color: '#FFFFFF', border: '1px solid #E50924' },
      });
    } else {
      toast.error('Invalid coupon code. Try SAITRONICS10', {
        style: { background: '#111111', color: '#FFFFFF' },
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#090909] text-white min-h-[75vh] flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center bg-[#111111] border border-white/[0.08] rounded-[4px] p-10">
          <div className="w-16 h-16 bg-[#161616] border border-white/[0.08] rounded-[4px] flex items-center justify-center mx-auto mb-6 text-[#858585]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Your Bag Is Empty
          </h1>
          <p className="text-xs sm:text-sm text-[#858585] mb-8 leading-relaxed font-sans">
            Explore our curated flagship smartphones, spatial acoustics, and high-performance computing hardware.
          </p>
          <Link href="/products" className="btn-primary text-xs font-bold uppercase tracking-wider py-3.5 px-8 w-full inline-block">
            Discover Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#090909] text-white min-h-screen py-10 px-4">
      <div className="container-custom">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/[0.08]">
          <Link href="/products" className="p-2 bg-[#161616] border border-white/[0.08] rounded-[4px] hover:text-[#FF3048] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-white">
            Shopping Bag
          </h1>
          <span className="text-xs font-mono text-[#E50924] font-bold tabular-nums">
            ({items.reduce((sum, i) => sum + i.quantity, 0)} Items)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Item List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map(item => (
              <div 
                key={`${item.product.id}-${item.selectedColor || 'default'}`}
                className="bg-[#111111] border border-white/[0.08] rounded-[4px] p-4 sm:p-6 flex flex-col sm:flex-row gap-5 items-center justify-between"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-[#161616] border border-white/[0.05] rounded-[4px] overflow-hidden flex-shrink-0 p-2">
                    <Image
                      src={item.product.images[0]?.url}
                      alt={item.product.name}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#E50924] font-bold uppercase tracking-widest">{item.product.brand}</span>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-white mt-0.5">
                      {item.product.name}
                    </h3>
                    {item.selectedColor && (
                      <p className="text-xs text-[#858585] mt-1 font-sans">Finish: <span className="text-white">{item.selectedColor}</span></p>
                    )}
                    <p className="font-heading font-bold text-sm text-[#FF3048] mt-1 sm:hidden tabular-nums">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls & Total */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-3 sm:pt-0 border-t border-white/5 sm:border-0">
                  <div className="flex items-center bg-[#161616] border border-white/[0.08] rounded-[4px] overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#B8B8B8] hover:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center text-xs font-bold text-white border-x border-white/[0.08] tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#B8B8B8] hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="hidden sm:block text-right">
                    <p className="font-heading font-bold text-base text-white tabular-nums">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] text-[#858585] tabular-nums">₹{item.product.price.toLocaleString('en-IN')} each</span>
                  </div>

                  <button
                    onClick={() => { removeItem(item.product.id); toast.success('Item removed'); }}
                    className="p-2 text-[#858585] hover:text-[#FF3048] transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <Link href="/products" className="text-xs font-bold text-[#B8B8B8] hover:text-white flex items-center gap-1.5 uppercase tracking-wider">
                <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
              </Link>
              <button
                onClick={() => { clearCart(); toast.success('Bag cleared'); }}
                className="text-xs font-bold text-[#FF3048] hover:underline uppercase tracking-wider"
              >
                Clear Entire Bag
              </button>
            </div>
          </div>

          {/* RIGHT: Order Summary & Checkout */}
          <div className="lg:col-span-4">
            <div className="bg-[#111111] border border-white/[0.08] rounded-[4px] p-6 sm:p-8 sticky top-24 space-y-6">
              <h2 className="font-heading text-lg font-bold text-white pb-3 border-b border-white/[0.08]">
                Order Summary
              </h2>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="text-xs font-semibold text-[#858585] block uppercase tracking-wider text-[10px]">Have a promo code?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. SAITRONICS10"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#161616] border border-white/[0.08] rounded-[4px] text-xs text-white uppercase placeholder-[#666] focus:outline-none focus:border-[#E50924]"
                  />
                  <button type="submit" className="px-4 py-2 bg-white/10 hover:bg-[#E50924] text-white text-xs font-bold rounded-[4px] transition-colors uppercase tracking-wider">
                    Apply
                  </button>
                </div>
                {discountPercent > 0 && (
                  <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                    <Tag className="w-3.5 h-3.5" /> 10% Launch Discount Active
                  </p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-3 text-xs pt-2">
                <div className="flex justify-between text-[#B8B8B8]">
                  <span>Subtotal</span>
                  <span className="font-bold text-white tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount (10%)</span>
                    <span className="tabular-nums">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#B8B8B8]">
                  <span>Standard Insured Delivery</span>
                  <span className="text-emerald-400 font-bold tabular-nums">
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex justify-between items-baseline">
                  <span className="font-heading text-sm font-bold text-white">Estimated Total</span>
                  <span className="font-heading text-2xl font-black text-white tabular-nums">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => router.push('/checkout')}
                className="w-full btn-primary py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                Proceed To Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-[11px] text-[#858585] justify-center pt-2">
                <ShieldCheck className="w-4 h-4 text-[#E50924]" />
                <span>Encrypted & Verified Saitronics Checkout</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
