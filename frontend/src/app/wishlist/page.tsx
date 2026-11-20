'use client';

import Link from 'next/link';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import ProductCard from '@/components/ui/ProductCard';

export default function WishlistPage() {
  const items = useWishlistStore(state => state.items);

  return (
    <div className="bg-[#090909] text-white min-h-screen py-10 px-4">
      <div className="container-custom">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/[0.08]">
          <Link href="/products" className="p-2 bg-[#161616] border border-white/[0.08] rounded-[4px] hover:text-[#FF3048] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
              <Heart className="w-6 h-6 text-[#E50924] fill-[#E50924]" />
              Saved Wishlist
            </h1>
            <p className="text-xs text-[#858585] mt-0.5 font-sans"><span className="tabular-nums font-mono text-[#E50924] font-bold">{items.length}</span> saved electronics items</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-[#111111] border border-white/[0.08] rounded-[4px] p-16 text-center max-w-md mx-auto">
            <Heart className="w-12 h-12 text-[#858585] mx-auto mb-4" />
            <h2 className="font-heading text-xl font-bold mb-2">Your Wishlist is Empty</h2>
            <p className="text-xs text-[#858585] mb-6 font-sans">
              Save products while browsing to compare prices and review them anytime.
            </p>
            <Link href="/products" className="btn-primary text-xs font-bold px-6 py-3.5 uppercase tracking-wider inline-block">
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map(product => (
              <ProductCard key={product.id} product={product} theme="dark" />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
