'use client';

import React, { useState } from 'react';
import { 
  Ticket, Plus, Edit3, Trash2, Copy, CheckCircle2, 
  AlertCircle, X, Check, Calendar, DollarSign, Percent 
} from 'lucide-react';
import { Coupon } from '@/types';
import { useCouponStore } from '@/store/couponStore';
import toast from 'react-hot-toast';

export default function CouponsTab() {
  const coupons = useCouponStore((state) => state.coupons);
  const addCoupon = useCouponStore((state) => state.addCoupon);
  const updateCoupon = useCouponStore((state) => state.updateCoupon);
  const deleteCoupon = useCouponStore((state) => state.deleteCoupon);
  const toggleCouponActive = useCouponStore((state) => state.toggleCouponActive);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(5000);
  const [maxDiscount, setMaxDiscount] = useState<number | undefined>(2000);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [isActive, setIsActive] = useState(true);

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setCode('');
    setDescription('');
    setDiscountType('percentage');
    setDiscountValue(10);
    setMinOrderAmount(5000);
    setMaxDiscount(2000);
    setExpiryDate('2026-12-31');
    setUsageLimit(100);
    setIsActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setCode(c.code);
    setDescription(c.description || '');
    setDiscountType(c.type);
    setDiscountValue(c.value);
    setMinOrderAmount(c.minOrder);
    setMaxDiscount(c.maxDiscount);
    setExpiryDate(c.endDate ? c.endDate.split('T')[0] : '2026-12-31');
    setUsageLimit(c.usageLimit);
    setIsActive(c.isActive);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      toast.error('Coupon code is mandatory.');
      return;
    }

    const couponData: Coupon = {
      id: editingCoupon ? editingCoupon.id : `cpn-${cleanCode.toLowerCase()}`,
      code: cleanCode,
      description: description.trim() || undefined,
      type: discountType,
      value: discountValue,
      minOrder: minOrderAmount,
      maxDiscount: discountType === 'percentage' ? maxDiscount : undefined,
      startDate: editingCoupon ? editingCoupon.startDate : new Date().toISOString().split('T')[0],
      endDate: expiryDate,
      usageLimit: usageLimit || 1000,
      usageCount: editingCoupon ? editingCoupon.usageCount : 0,
      isActive,
    };

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, couponData);
      toast.success(`Coupon ${cleanCode} updated.`);
    } else {
      addCoupon(couponData);
      toast.success(`Coupon ${cleanCode} active and live.`);
    }
    setModalOpen(false);
  };

  const handleCopyCode = (c: string) => {
    navigator.clipboard.writeText(c);
    toast.success(`Copied "${c}" to clipboard`);
  };

  const handleDelete = (id: string, codeStr: string) => {
    if (confirm(`Delete promotional code "${codeStr}"?`)) {
      deleteCoupon(id);
      toast.success(`Coupon ${codeStr} deleted.`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08]">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Promotional Engine & Coupons
          </h2>
          <p className="text-xs text-[#717171]">
            Create instant discount incentives validated live during checkout
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E50924] hover:bg-[#C8081F] text-white text-xs font-semibold tracking-wide transition-all shadow-lg shadow-[#E50924]/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div
            key={c.id}
            className={`p-5 rounded-2xl bg-[#0E0E0E] border flex flex-col justify-between transition-all ${
              c.isActive ? 'border-white/[0.08]' : 'border-white/[0.03] opacity-60'
            }`}
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-[#141414] border border-white/[0.06] text-[#E50924]">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black font-mono text-white tracking-wider">
                        {c.code}
                      </span>
                      <button
                        onClick={() => handleCopyCode(c.code)}
                        className="text-[#666] hover:text-white"
                        title="Copy code"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold block">
                      {c.type === 'percentage'
                        ? `${c.value}% OFF`
                        : `₹${c.value.toLocaleString('en-IN')} FLAT OFF`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleCouponActive(c.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                    c.isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {c.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              <p className="text-xs text-[#888] line-clamp-2 mb-4">
                {c.description || 'Promotional incentive for store purchases.'}
              </p>

              <div className="space-y-1.5 p-3 rounded-xl bg-[#141414] border border-white/[0.04] text-[11px] text-[#A1A1A1]">
                <div className="flex justify-between">
                  <span>Minimum Spend:</span>
                  <span className="font-mono text-white font-semibold">
                    ₹{c.minOrder.toLocaleString('en-IN')}
                  </span>
                </div>
                {c.maxDiscount && (
                  <div className="flex justify-between">
                    <span>Max Cap:</span>
                    <span className="font-mono text-white font-semibold">
                      ₹{c.maxDiscount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Usage Count:</span>
                  <span className="font-mono text-white font-semibold">
                    {c.usageCount} / {c.usageLimit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Expires:</span>
                  <span className="text-[#888] font-mono">{c.endDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-white/[0.06] flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(c)}
                className="p-1.5 rounded-lg text-[#717171] hover:text-white hover:bg-white/[0.05] transition-colors"
                title="Edit coupon"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(c.id, c.code)}
                className="p-1.5 rounded-lg text-[#717171] hover:text-[#FF4D4F] hover:bg-[#E50924]/10 transition-colors"
                title="Delete coupon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md bg-[#121212] border border-white/[0.1] rounded-2xl p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#666] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FESTIVE2026"
                  required
                  className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-[#E50924]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50924]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    required
                    className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#E50924]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                    Min Order Spend (₹)
                  </label>
                  <input
                    type="number"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                    className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#E50924]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    value={maxDiscount || ''}
                    onChange={(e) => setMaxDiscount(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="None"
                    disabled={discountType === 'flat'}
                    className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#E50924] disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50924]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                    Usage Cap Limit
                  </label>
                  <input
                    type="number"
                    value={usageLimit || ''}
                    onChange={(e) => setUsageLimit(Number(e.target.value) || 100)}
                    placeholder="100"
                    className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#E50924]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                  Coupon Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 10% instant checkout discount"
                  className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50924]"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#181818] border border-white/[0.06]">
                <span className="text-xs font-semibold text-white">Active at Checkout</span>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#E50924]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.04] text-xs font-semibold text-[#A1A1A1] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#E50924] hover:bg-[#C8081F] text-xs font-semibold text-white"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
