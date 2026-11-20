'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, Heart, Share2, ShieldCheck, 
  ChevronDown, ChevronUp, Check, Star, Store, Award, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Product, Review } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useProductStore } from '@/store/productStore';
import { useReviewStore } from '@/store/reviewStore';
import ProductGallery from '@/components/ui/ProductGallery';
import ColorSwatch from '@/components/ui/ColorSwatch';
import Badge from '@/components/ui/Badge';
import ProductCard from '@/components/ui/ProductCard';

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({ product: initialProduct, related }: Props) {
  const router = useRouter();

  // Subscribe to live product from store for zero-refresh cross-tab sync
  const storeProduct = useProductStore((state) =>
    state.products.find((p) => p.id === initialProduct.id || p.slug === initialProduct.slug)
  );
  const product = storeProduct || initialProduct;

  const [selectedColor, setSelectedColor] = useState(product.colorVariants?.[0]?.name ?? '');
  const [selectedStorage, setSelectedStorage] = useState(product.storageVariants?.[0] ?? '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'features' | 'specs' | 'warranty' | 'reviews'>('features');
  const [specsExpanded, setSpecsExpanded] = useState(false);

  // Review Form State
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  // Reviews integration
  const reviews = useReviewStore((state) => state.getProductReviews(product.id));
  const ratingSummary = useReviewStore((state) =>
    state.getProductRatingSummary(product.id, product.rating, product.reviewCount)
  );
  const addReview = useReviewStore((state) => state.addReview);

  // Variant (storage) selection updates price, MRP, discount and stock
  const storageIndex = product.storageVariants?.indexOf(selectedStorage) ?? 0;
  const tierPriceOffset = storageIndex > 0 ? storageIndex * 10000 : 0;
  const activePrice = product.price + tierPriceOffset;
  const activeOriginalPrice = product.originalPrice 
    ? product.originalPrice + (storageIndex * 12000) 
    : undefined;

  // Real-time stock status
  const currentTotalStock = product.stockCount;
  const isOutOfStock = !product.inStock || currentTotalStock <= 0;
  const threshold = product.lowStockThreshold || 5;
  const isLowStock = !isOutOfStock && currentTotalStock <= threshold;

  const discount = activeOriginalPrice
    ? Math.round(((activeOriginalPrice - activePrice) / activeOriginalPrice) * 100)
    : null;

  // Auto-clamp quantity if stock reduced below quantity
  useEffect(() => {
    if (isOutOfStock) {
      if (quantity !== 1) setQuantity(1);
    } else if (currentTotalStock > 0 && quantity > currentTotalStock) {
      setQuantity(currentTotalStock);
    }
  }, [currentTotalStock, isOutOfStock, quantity]);

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error('This device is currently out of stock');
      return;
    }

    const success = addItem(
      { ...product, price: activePrice, originalPrice: activeOriginalPrice },
      selectedColor || undefined,
      selectedStorage || undefined,
      currentTotalStock
    );

    if (success) {
      toast.success(`${quantity}× ${product.name} (${selectedStorage || 'Standard'}) added to bag`);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      toast.error('This device is currently out of stock');
      return;
    }

    addItem(
      { ...product, price: activePrice, originalPrice: activeOriginalPrice },
      selectedColor || undefined,
      selectedStorage || undefined,
      currentTotalStock
    );
    router.push('/checkout');
  };

  const handleWishlist = () => {
    toggle(product);
    toast(wishlisted ? 'Removed from Wishlist' : 'Saved to Wishlist');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      toast.error('Please enter your name and comments');
      return;
    }

    setIsSubmittingReview(true);
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      customerName: reviewName.trim(),
      rating: reviewRating,
      title: reviewTitle.trim() || 'Verified Customer Review',
      comment: reviewComment.trim(),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'pending',
      verifiedPurchase: true
    };

    addReview(newRev);
    setIsSubmittingReview(false);
    setReviewName('');
    setReviewTitle('');
    setReviewComment('');
    toast.success('Thank you! Your review has been submitted for showroom moderation.');
  };

  const specEntries = Object.entries(product.specifications || {});

  return (
    <div className="bg-[#090909] text-white min-h-screen py-10 px-4">
      <div className="container-custom">

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#858585] mb-8 pb-3 border-b border-white/[0.08]">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white transition-colors">Products</Link>
          <span>/</span>
          <Link href={`/category/${product.category}`} className="hover:text-white transition-colors capitalize">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#E50924] font-semibold">{product.name}</span>
        </nav>

        {/* Product Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

          {/* LEFT: Multi-Angle High-Resolution Studio Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              colorVariants={product.colorVariants}
              selectedColor={selectedColor}
              productName={product.name}
            />
          </div>

          {/* RIGHT: Spec Architecture & Purchase Controls */}
          <div className="lg:col-span-5 space-y-6">

            {/* Header: Brand, Badge & Title */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E50924]">
                  {product.brand}
                </span>
                {product.badge && <Badge type={product.badge} />}
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Star Rating & Verified Count */}
              <div className="flex items-center gap-3 mt-2 text-xs text-[#858585]">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-bold text-white tabular-nums">{ratingSummary.average.toFixed(1)}</span>
                </div>
                <span>•</span>
                <span className="hover:underline cursor-pointer" onClick={() => setActiveTab('reviews')}>
                  ({ratingSummary.count} Verified Customer Reviews)
                </span>
              </div>
            </div>

            {/* Price Box with Tabular Numerals & Discount */}
            <div className="p-4 rounded-[4px] bg-[#111111] border border-white/[0.08]">
              <div className="flex items-baseline gap-3">
                <span className="font-heading text-3xl font-black text-white tabular-nums tracking-tight">
                  ₹{activePrice.toLocaleString('en-IN')}
                </span>
                {activeOriginalPrice && (
                  <span className="text-sm text-[#858585] line-through tabular-nums">
                    ₹{activeOriginalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {discount && (
                  <span className="px-2 py-0.5 rounded-[2px] bg-[#E50924]/20 border border-[#E50924]/40 text-[#FF3048] text-xs font-bold">
                    {discount}% OFF
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#858585] mt-1">
                {product.taxNote || 'Inclusive of all taxes. Eligible for store pickup in Uttarpara.'}
              </p>
            </div>

            {/* Short Narrative Description */}
            <p className="text-xs sm:text-sm text-[#B8B8B8] leading-relaxed font-sans">
              {product.description}
            </p>

            {/* Color Swatch Selector */}
            {product.colorVariants && product.colorVariants.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#858585] block mb-2">
                  Select Finish: <span className="text-white">{selectedColor}</span>
                </span>
                <ColorSwatch
                  variants={product.colorVariants}
                  selected={selectedColor}
                  onChange={setSelectedColor}
                />
              </div>
            )}

            {/* Storage Variants Selector */}
            {product.storageVariants && product.storageVariants.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#858585] block mb-2">
                  Storage / Architecture:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.storageVariants.map(v => (
                    <button
                      key={v}
                      onClick={() => setSelectedStorage(v)}
                      className={`px-3.5 py-2 rounded-[4px] text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                        selectedStorage === v
                          ? 'bg-[#E50924] text-white shadow-md shadow-[#E50924]/20'
                          : isOutOfStock
                          ? 'bg-[#141414] text-[#666666] line-through border border-white/[0.04]'
                          : 'bg-[#141414] text-[#B8B8B8] hover:text-white border border-white/[0.08]'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Inventory Status Banner */}
            <div className="p-3.5 rounded-[4px] bg-[#141414] border border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${isOutOfStock ? 'text-red-400' : isLowStock ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {isOutOfStock ? 'Out of Stock' : isLowStock ? `Only ${currentTotalStock} Units Left` : `In Stock (${currentTotalStock} Units Available)`}
                </span>
              </div>
              <span className="text-[10px] text-[#858585] font-mono">Uttarpara Showroom</span>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-white/[0.1] rounded-[4px] bg-[#141414]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock || quantity <= 1}
                    className="px-3 py-2 text-white hover:text-[#E50924] transition-colors disabled:opacity-30 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-mono font-bold tabular-nums min-w-[2.5rem] text-center">
                    {isOutOfStock ? 0 : quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(currentTotalStock, quantity + 1))}
                    disabled={isOutOfStock || quantity >= currentTotalStock}
                    className="px-3 py-2 text-white hover:text-[#E50924] transition-colors disabled:opacity-30 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3 px-5 text-xs font-bold uppercase tracking-wider rounded-[4px] flex items-center justify-center gap-2 shadow-lg transition-all ${
                    isOutOfStock
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/[0.08]'
                      : 'bg-[#E50924] hover:bg-[#FF3048] text-white shadow-[#E50924]/30 cursor-pointer'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {isOutOfStock ? 'Out Of Stock' : 'Add To Bag'}
                </button>

                <button
                  onClick={handleWishlist}
                  className={`p-3 rounded-[4px] border border-white/[0.1] bg-[#141414] hover:text-white transition-colors ${
                    wishlisted ? 'text-[#FF3048]' : 'text-[#858585]'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#E50924] text-[#E50924]' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-3 rounded-[4px] border border-white/[0.1] bg-[#141414] text-[#858585] hover:text-white transition-colors"
                  aria-label="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`w-full py-3 px-5 text-xs font-bold uppercase tracking-wider rounded-[4px] transition-all ${
                  isOutOfStock
                    ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                    : 'bg-white hover:bg-[#F0F0F0] text-black cursor-pointer'
                }`}
              >
                Buy Now (Direct Checkout)
              </button>
            </div>

            {/* Offline Showroom Credentials */}
            <div className="pt-4 border-t border-white/[0.08] space-y-2.5 text-xs text-[#858585]">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#E50924]" />
                <span>Experience live demo in Uttarpara showroom before buying</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E50924]" />
                <span>100% Brand Sealed with Official Manufacturer Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#E50924]" />
                <span>Direct Showroom Helpline: 09831250575</span>
              </div>
            </div>

          </div>
        </div>

        {/* ===================== TABBED SPECIFICATIONS & REVIEWS ===================== */}
        <div className="mt-16 pt-8 border-t border-white/[0.08]">
          <div className="flex items-center gap-2 border-b border-white/[0.08] overflow-x-auto scrollbar-none pb-px">
            {[
              { id: 'features', label: 'Key Features' },
              { id: 'specs', label: `Technical Specifications (${specEntries.length})` },
              { id: 'warranty', label: 'Warranty & Authenticity' },
              { id: 'reviews', label: `Customer Reviews (${ratingSummary.count})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-5 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#E50924] text-white bg-white/[0.03]'
                    : 'border-transparent text-[#858585] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'features' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                {product.features?.map((f, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-[4px] bg-[#141414] border border-white/[0.04]">
                    <Check className="w-4 h-4 text-[#E50924] flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-[#B8B8B8] leading-relaxed">{f}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-3xl space-y-4">
                <div className="divide-y divide-white/[0.04] border border-white/[0.08] rounded-[4px] bg-[#111111]">
                  {(specsExpanded ? specEntries : specEntries.slice(0, 8)).map(([k, v]) => (
                    <div key={k} className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs">
                      <span className="font-semibold text-white/90">{k}</span>
                      <span className="sm:col-span-2 text-[#858585] mt-1 sm:mt-0 font-sans">{v}</span>
                    </div>
                  ))}
                </div>

                {specEntries.length > 8 && (
                  <button
                    onClick={() => setSpecsExpanded(!specsExpanded)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#FF3048] hover:text-white transition-colors cursor-pointer"
                  >
                    {specsExpanded ? (
                      <><ChevronUp className="w-4 h-4" /> Collapse Specifications</>
                    ) : (
                      <><ChevronDown className="w-4 h-4" /> View All {specEntries.length} Technical Specifications</>
                    )}
                  </button>
                )}
              </div>
            )}

            {activeTab === 'warranty' && (
              <div className="space-y-4 max-w-2xl text-xs sm:text-sm text-[#B8B8B8] leading-relaxed">
                <p>
                  All devices sold through Saitronics come in manufacturer factory-sealed packaging with genuine serial numbers eligible for direct brand authorization and official India warranty.
                </p>
                <div className="p-4 rounded-[4px] bg-[#141414] border border-white/[0.08] space-y-2">
                  <p className="font-bold text-white">Warranty Coverage:</p>
                  <p>• 1-Year Official Manufacturer Limited Warranty on Handsets / Laptops</p>
                  <p>• 6-Month Manufacturer Limited Warranty on in-box charger & accessories</p>
                  <p>• Serviceable at authorized brand centers across India or via Saitronics store support</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8 max-w-3xl">
                {/* Aggregate Rating Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-[4px] bg-[#141414] border border-white/[0.08]">
                  <div className="flex items-center gap-6">
                    <div className="text-center pr-6 border-r border-white/10">
                      <p className="font-heading text-4xl font-black text-white tabular-nums">{ratingSummary.average.toFixed(1)}</p>
                      <p className="text-[10px] text-[#858585] mt-1">out of 5.0</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.round(ratingSummary.average) ? 'fill-current' : 'text-zinc-600'}`} />
                        ))}
                      </div>
                      <p className="text-xs text-[#B8B8B8] mt-1.5">Based on {ratingSummary.count} verified customer ratings</p>
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
                    Verified Customer Feedback ({reviews.length})
                  </h3>
                  {reviews.length === 0 ? (
                    <p className="text-xs text-[#858585] p-4 rounded bg-[#141414] border border-white/[0.04]">
                      No reviews submitted yet for this model. Be the first to review!
                    </p>
                  ) : (
                    reviews.map(r => (
                      <div key={r.id} className="p-4 rounded-[4px] bg-[#111111] border border-white/[0.06] space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white">{r.customerName}</span>
                          <span className="text-[10px] text-[#858585] font-mono">{r.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-current' : 'text-zinc-700'}`} />
                          ))}
                        </div>
                        <p className="text-xs font-bold text-white/90">{r.title}</p>
                        <p className="text-xs text-[#B8B8B8] leading-relaxed font-sans">{r.comment}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Submit Review Form */}
                <div className="p-6 rounded-[4px] bg-[#111111] border border-white/[0.08] space-y-4">
                  <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
                    Submit Customer Review
                  </h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[#858585] block mb-1">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={reviewName}
                          onChange={e => setReviewName(e.target.value)}
                          placeholder="e.g. Marcus Arilius"
                          className="w-full px-3 py-2 bg-[#161616] border border-white/[0.08] rounded-[2px] text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[#858585] block mb-1">Star Rating</label>
                        <select
                          value={reviewRating}
                          onChange={e => setReviewRating(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-[#161616] border border-white/[0.08] rounded-[2px] text-white"
                        >
                          <option value={5}>5 Stars - Outstanding</option>
                          <option value={4}>4 Stars - Great Quality</option>
                          <option value={3}>3 Stars - Average</option>
                          <option value={2}>2 Stars - Needs Improvement</option>
                          <option value={1}>1 Star - Unsatisfied</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[#858585] block mb-1">Review Headline</label>
                      <input
                        type="text"
                        value={reviewTitle}
                        onChange={e => setReviewTitle(e.target.value)}
                        placeholder="Summary of your experience..."
                        className="w-full px-3 py-2 bg-[#161616] border border-white/[0.08] rounded-[2px] text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[#858585] block mb-1">Detailed Review *</label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        placeholder="Detail the device build quality, display clarity, camera performance, etc..."
                        className="w-full px-3 py-2 bg-[#161616] border border-white/[0.08] rounded-[2px] text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="btn-primary py-2.5 px-6 text-xs font-semibold uppercase tracking-wider"
                    >
                      {isSubmittingReview ? 'Submitting...' : 'Post Review'}
                    </button>
                  </form>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* ===================== RELATED PRODUCTS ===================== */}
        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-white/[0.08]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E50924] block mb-1">
                  You Might Also Like
                </span>
                <h2 className="font-heading text-2xl font-bold text-white">
                  Related Flagships
                </h2>
              </div>
              <Link href="/products" className="text-xs font-semibold text-[#FF3048] hover:text-white transition-colors">
                Browse All Collection →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(rel => (
                <ProductCard key={rel.id} product={rel} theme="dark" />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
