'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, ShieldCheck, Truck, Lock, CreditCard, 
  Smartphone, Building, Tag, Check, CheckCircle2, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { useProductStore } from '@/store/productStore';
import { useCouponStore } from '@/store/couponStore';
import { useCustomerStore } from '@/store/customerStore';
import { Order } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const addOrder = useOrderStore((state) => state.addOrder);
  const adjustStock = useProductStore((state) => state.adjustStock);
  const validateCoupon = useCouponStore((state) => state.validateCoupon);
  const incrementCouponUsage = useCouponStore((state) => state.incrementCouponUsage);
  const recordOrderForCustomer = useCustomerStore((state) => state.recordOrderForCustomer);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700001',
    paymentMethod: 'upi' as 'cod' | 'upi' | 'card'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; note: string } | null>(null);

  const subtotal = total();
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const shipping = subtotal > 15000 ? 0 : 499;
  const grandTotal = Math.max(0, subtotal - discount + shipping);

  if (items.length === 0) {
    return (
      <div className="bg-[#090909] text-white min-h-[70vh] flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <h2 className="font-heading text-2xl font-bold text-white">Your Shopping Bag is Empty</h2>
          <p className="text-xs text-[#858585]">
            Browse our verified luxury collection to select flagship electronics.
          </p>
          <Link href="/products" className="btn-primary inline-block text-xs uppercase tracking-wider py-3 px-6">
            Explore Collection →
          </Link>
        </div>
      </div>
    );
  }

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    const result = validateCoupon(couponInput, subtotal);
    if (result.valid) {
      setAppliedCoupon({
        code: result.coupon!.code,
        discount: result.discountAmount,
        note: result.message
      });
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    toast('Coupon removed');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.phone || !formData.address) {
      toast.error('Please complete all required shipping fields');
      return;
    }

    setIsSubmitting(true);

    const orderId = `ST-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      customerName: `${formData.firstName} ${formData.lastName}`.trim(),
      customerEmail: formData.email,
      customerPhone: formData.phone,
      shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
      items: [...items],
      total: subtotal,
      discount: discount,
      couponCode: appliedCoupon?.code,
      shipping: shipping,
      grandTotal: grandTotal,
      status: 'placed',
      paymentMethod: formData.paymentMethod,
      isNew: true,
      timeline: [
        {
          id: `t-${Date.now()}`,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'placed',
          title: 'Order Received',
          description: `Authorized via ${formData.paymentMethod.toUpperCase()} (Online Store Checkout)`
        }
      ]
    };

    // 1. Stock Decrement for each purchased item
    items.forEach((item) => {
      adjustStock(item.product.id, -item.quantity, 'Order Placed', `Decremented for Order #${orderId}`);
    });

    // 2. Increment coupon usage
    if (appliedCoupon) {
      incrementCouponUsage(appliedCoupon.code);
    }

    // 3. Save order to order store
    addOrder(newOrder);

    // 4. Update customer database
    recordOrderForCustomer(newOrder);

    // Store in session for order-success page
    try {
      sessionStorage.setItem('latest-order', JSON.stringify(newOrder));
    } catch {}

    setTimeout(() => {
      clearCart();
      setIsSubmitting(false);
      router.push(`/order-success?id=${orderId}`);
    }, 800);
  };

  return (
    <div className="bg-[#090909] text-white min-h-screen py-10 px-4">
      <div className="container-custom">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/[0.08]">
          <Link href="/cart" className="p-2 bg-[#161616] border border-white/[0.08] rounded-[4px] hover:text-[#FF3048] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-white">
            Secure Checkout
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* LEFT: Shipping & Payment Form */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Customer & Destination Information */}
            <div className="bg-[#111111] border border-white/[0.08] rounded-[4px] p-6 sm:p-8 space-y-4">
              <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-white/[0.08]">
                <Truck className="w-4 h-4 text-[#E50924]" /> 1. Showroom Delivery Destination
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[#858585] block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#161616] border border-white/[0.08] rounded-[2px] text-white focus:border-[#E50924] outline-none"
                    placeholder="e.g. Marcus"
                  />
                </div>
                <div>
                  <label className="text-[#858585] block mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#161616] border border-white/[0.08] rounded-[2px] text-white focus:border-[#E50924] outline-none"
                    placeholder="e.g. Arilius"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[#858585] block mb-1">Phone Number (Required for dispatch) *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#161616] border border-white/[0.08] rounded-[2px] text-white focus:border-[#E50924] outline-none font-mono"
                    placeholder="e.g. 09831250575"
                  />
                </div>
                <div>
                  <label className="text-[#858585] block mb-1">Email (Order Receipt)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#161616] border border-white/[0.08] rounded-[2px] text-white focus:border-[#E50924] outline-none"
                    placeholder="marcus@example.com"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="text-[#858585] block mb-1">Delivery Street Address / Showroom Pickup Note *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#161616] border border-white/[0.08] rounded-[2px] text-white focus:border-[#E50924] outline-none"
                  placeholder="Apartment, building, street, or write 'Store Pickup in Uttarpara'"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-[#858585] block mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-[#161616] border border-white/[0.08] rounded-[2px] text-white"
                  />
                </div>
                <div>
                  <label className="text-[#858585] block mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 bg-[#161616] border border-white/[0.08] rounded-[2px] text-white"
                  />
                </div>
                <div>
                  <label className="text-[#858585] block mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-[#161616] border border-white/[0.08] rounded-[2px] text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-[#111111] border border-white/[0.08] rounded-[4px] p-6 sm:p-8 space-y-4">
              <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-white/[0.08]">
                <CreditCard className="w-4 h-4 text-[#E50924]" /> 2. Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'upi', name: 'Instant UPI / QR', desc: 'Google Pay, PhonePe, Paytm', icon: Smartphone },
                  { id: 'card', name: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: CreditCard },
                  { id: 'cod', name: 'Cash On Delivery', desc: 'Verify before payment', icon: Building },
                ].map(m => (
                  <label
                    key={m.id}
                    className={`p-4 rounded-[4px] border cursor-pointer transition-all flex flex-col justify-between ${
                      formData.paymentMethod === m.id
                        ? 'bg-[#E50924]/10 border-[#E50924] text-white shadow-md shadow-[#E50924]/20'
                        : 'bg-[#141414] border-white/[0.08] text-[#858585] hover:border-white/[0.2]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <m.icon className="w-5 h-5 text-[#FF3048]" />
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={m.id}
                        checked={formData.paymentMethod === m.id}
                        onChange={() => setFormData({ ...formData, paymentMethod: m.id as any })}
                        className="accent-[#E50924]"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-white">{m.name}</p>
                      <p className="text-[10px] text-[#858585] mt-0.5">{m.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: Order Summary & Coupon Module */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#111111] border border-white/[0.08] rounded-[4px] p-6 sm:p-8 sticky top-24 space-y-6">
              <h2 className="font-heading text-lg font-bold text-white pb-3 border-b border-white/[0.08]">
                Order Review ({items.length} items)
              </h2>

              {/* Items List Mini */}
              <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-hide pr-1">
                {items.map(item => (
                  <div key={`${item.product.id}-${item.selectedColor}-${item.selectedStorage}`} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-[4px] bg-[#161616] border border-white/[0.08] overflow-hidden flex-shrink-0 p-1">
                        <Image src={item.product.images[0]?.url || '/products/huawei/mate-70-rs/front.webp'} alt={item.product.name} fill className="object-contain" unoptimized />
                      </div>
                      <div>
                        <p className="font-bold text-white line-clamp-1">{item.product.name}</p>
                        <p className="text-[10px] text-[#858585]">
                          Qty: {item.quantity} {item.selectedStorage ? `• ${item.selectedStorage}` : ''} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-white tabular-nums">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Redemption Section */}
              <div className="pt-4 border-t border-white/[0.08]">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#858585] block mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#E50924]" /> Have a Promotional Code?
                </label>

                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="e.g. WELCOME10, FLAGSHIP5000"
                      className="flex-1 px-3 py-2 bg-[#161616] border border-white/[0.08] rounded-[2px] text-xs font-mono uppercase text-white focus:border-[#E50924] outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-[#161616] hover:bg-[#E50924] text-xs font-bold uppercase tracking-wider text-white border border-white/[0.1] hover:border-[#E50924] rounded-[2px] transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-[4px] bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> {appliedCoupon.code}
                      </p>
                      <p className="text-[10px] text-emerald-300 mt-0.5">Discount: ₹{appliedCoupon.discount.toLocaleString('en-IN')}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[10px] text-red-400 hover:underline uppercase font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Cost Summary */}
              <div className="pt-4 border-t border-white/[0.08] space-y-2 text-xs">
                <div className="flex justify-between text-[#B8B8B8]">
                  <span>Subtotal</span>
                  <span className="font-bold text-white tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon Savings ({appliedCoupon.code})</span>
                    <span className="font-bold tabular-nums">-₹{appliedCoupon.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#B8B8B8]">
                  <span>Insured Express Delivery</span>
                  <span className="text-emerald-400 font-bold tabular-nums">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="pt-3 border-t border-white/[0.08] flex justify-between items-baseline">
                  <span className="font-heading text-sm font-bold text-white">Grand Total</span>
                  <span className="font-heading text-2xl font-black text-white tabular-nums">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-4 text-xs font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer shadow-xl shadow-[#E50924]/20"
              >
                {isSubmitting ? 'Securing Your Order...' : 'Place Order Now'}
              </button>

              <div className="text-[11px] text-[#858585] text-center space-y-1">
                <p className="flex items-center justify-center gap-1.5 text-white/80">
                  <Lock className="w-3.5 h-3.5 text-[#E50924]" /> 256-Bit SSL Encrypted Transaction
                </p>
                <p>Authentic factory-sealed shipment from Uttarpara showroom.</p>
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
