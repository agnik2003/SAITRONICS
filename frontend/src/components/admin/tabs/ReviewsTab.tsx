'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, Star, Plus, Check, X, Trash2, 
  Search, Filter, CheckCircle2, AlertCircle, ShieldCheck 
} from 'lucide-react';
import { Review } from '@/types';
import { useReviewStore } from '@/store/reviewStore';
import { useProductStore } from '@/store/productStore';
import toast from 'react-hot-toast';

export default function ReviewsTab() {
  const reviews = useReviewStore((state) => state.reviews);
  const setReviewStatus = useReviewStore((state) => state.setReviewStatus);
  const deleteReview = useReviewStore((state) => state.deleteReview);
  const addReview = useReviewStore((state) => state.addReview);
  const products = useProductStore((state) => state.products);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'hidden'>('all');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

  const [modalOpen, setModalOpen] = useState(false);

  // Form State for manual review
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [verifiedPurchase, setVerifiedPurchase] = useState(true);

  const filteredReviews = reviews.filter((r) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchAuthor = r.customerName.toLowerCase().includes(q);
      const matchComment = r.comment.toLowerCase().includes(q);
      const matchTitle = (r.title || '').toLowerCase().includes(q);
      if (!matchAuthor && !matchComment && !matchTitle) return false;
    }

    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (ratingFilter !== 'all' && r.rating !== ratingFilter) return false;

    return true;
  });

  const handleApprove = (id: string) => {
    setReviewStatus(id, 'approved');
    toast.success('Review approved and live on product detail page.');
  };

  const handleReject = (id: string) => {
    setReviewStatus(id, 'hidden');
    toast.success('Review hidden from product detail page.');
  };

  const handleDelete = (id: string) => {
    if (confirm('Permanently delete this customer review?')) {
      deleteReview(id);
      toast.success('Review removed.');
    }
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) {
      toast.error('Reviewer name and feedback are required.');
      return;
    }

    const prod = products.find((p) => p.id === productId);

    addReview({
      id: `rev-${Date.now()}`,
      productId,
      productName: prod?.name || 'Showroom Device',
      productSlug: prod?.slug || productId,
      customerName: userName.trim(),
      rating,
      title: title.trim() || 'Showroom Verification',
      comment: comment.trim(),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      verifiedPurchase,
      status: 'approved',
    });

    toast.success('Showroom review published successfully.');
    setModalOpen(false);
    setUserName('');
    setTitle('');
    setComment('');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08]">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Customer Experience & Reviews
          </h2>
          <p className="text-xs text-[#717171]">
            Moderate feedback submissions and calibrate showroom trust metrics
          </p>
        </div>

        <button
          onClick={() => {
            setProductId(products[0]?.id || '');
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E50924] hover:bg-[#C8081F] text-white text-xs font-semibold tracking-wide transition-all shadow-lg shadow-[#E50924]/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Showroom Review</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0E0E0E] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#555]">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reviewer or comment..."
              className="w-full bg-[#141414] border border-white/[0.08] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#E50924]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#141414] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#E50924]"
          >
            <option value="all">All Moderation</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>

        <div className="text-xs text-[#717171]">
          Showing <strong className="text-white font-bold">{filteredReviews.length}</strong> reviews
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#666] rounded-2xl bg-[#0E0E0E] border border-white/[0.08]">
            No reviews match the current criteria.
          </div>
        ) : (
          filteredReviews.map((r) => {
            const product = products.find((p) => p.id === r.productId);

            return (
              <div
                key={r.id}
                className="p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/20 transition-all"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white">{r.customerName}</span>
                    {r.verifiedPurchase && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                        Verified Purchase
                      </span>
                    )}
                    <span className="text-[10px] text-[#717171]">{r.date}</span>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ml-auto md:ml-0 ${
                        r.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : r.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'
                        }`}
                      />
                    ))}
                    {r.title && (
                      <span className="text-xs font-semibold text-white ml-2">
                        {r.title}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#C4C4C4] leading-relaxed">
                    &ldquo;{r.comment}&rdquo;
                  </p>

                  <div className="text-[10px] text-[#717171] flex items-center gap-1 pt-1">
                    <span>Product:</span>
                    <strong className="text-white">{product?.name || r.productId}</strong>
                  </div>
                </div>

                {/* Moderation Controls */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-white/[0.06]">
                  {r.status !== 'approved' && (
                    <button
                      onClick={() => handleApprove(r.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {r.status !== 'hidden' && (
                    <button
                      onClick={() => handleReject(r.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[#AAA] text-xs font-semibold border border-zinc-700 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-2 rounded-xl text-[#666] hover:text-[#FF4D4F] hover:bg-[#E50924]/10 transition-colors"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md bg-[#121212] border border-white/[0.1] rounded-2xl p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                Add Showroom Review
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#666] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                  Target Product
                </label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50924]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                  Customer / Reviewer Name *
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  required
                  className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50924]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                  Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 text-white hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          s <= rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-white ml-2">{rating}.0 / 5.0</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                  Headline Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Flawless titanium finish"
                  className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50924]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                  Customer Testimonial *
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Review feedback text..."
                  required
                  className="w-full bg-[#181818] border border-white/[0.08] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E50924]"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#181818] border border-white/[0.06]">
                <span className="text-xs font-semibold text-white">Mark as Verified Buyer</span>
                <input
                  type="checkbox"
                  checked={verifiedPurchase}
                  onChange={(e) => setVerifiedPurchase(e.target.checked)}
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
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
