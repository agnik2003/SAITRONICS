'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, Star, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { FALLBACK_PRODUCT_IMAGE } from '@/data/productImages';
import Badge from './Badge';

interface ProductCardProps {
  product: Product;
  theme?: 'dark' | 'light';
}

export default function ProductCard({ product, theme = 'dark' }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const wishlisted = useWishlistStore((state) => state.items.some((i) => i.id === product.id));

  const rawImgUrl = product.images?.[0]?.url;
  const displayImg = (!rawImgUrl || imgError) ? FALLBACK_PRODUCT_IMAGE : rawImgUrl;

  const isAvailable = product.inStock && product.stockCount > 0;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAvailable) {
      toast.error('Item is currently out of stock');
      return;
    }
    const success = addItem(product);
    if (success) {
      toast.success(`${product.name} added to bag`);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    toast(wishlisted ? 'Removed from Wishlist' : 'Saved to Wishlist', {
      style: {
        background: '#111111',
        color: '#FFFFFF',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '4px',
      }
    });
  };

  const isDark = theme === 'dark';

  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <div
        className={`relative h-full flex flex-col rounded-[4px] overflow-hidden transition-all duration-300 border ${
          isDark
            ? 'bg-[#111111] border-white/[0.08] hover:border-[#E50924]/60 hover:shadow-2xl hover:shadow-[#E50924]/10'
            : 'bg-white border-[#E6E6E6] hover:border-[#E50924]/60 hover:shadow-xl'
        }`}
      >
        {/* Top Badges & Actions */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.badge && <Badge type={product.badge} />}
            {discount && (
              <span className="bg-[#E50924] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-[2px] shadow-sm tracking-wider">
                -{discount}%
              </span>
            )}
          </div>

          <button
            onClick={handleWishlist}
            className={`w-7 h-7 rounded-[4px] flex items-center justify-center transition-all pointer-events-auto ${
              isDark
                ? 'bg-black/70 backdrop-blur-sm text-[#B8B8B8] hover:text-white border border-white/10'
                : 'bg-white/95 backdrop-blur-sm text-gray-500 hover:text-black border border-gray-200'
            } ${wishlisted ? 'text-[#FF3048] !text-[#FF3048]' : ''}`}
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-[#E50924] text-[#E50924]' : ''}`} />
          </button>
        </div>

        {/* Product Image Stage */}
        <div
          className={`relative aspect-square w-full overflow-hidden flex items-center justify-center p-6 ${
            isDark ? 'bg-gradient-to-b from-[#141414] to-[#0A0A0A]' : 'bg-[#FAFAFA]'
          }`}
        >
          {/* Subtle Ambient Red Glow behind device */}
          {isDark && (
            <div className="absolute inset-0 bg-radial-red opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          )}

          {/* Primary Image */}
          <Image
            src={displayImg}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-4 transition-all duration-600 group-hover:scale-105"
            onError={() => setImgError(true)}
            unoptimized
          />

          {/* Out of Stock Banner Tag */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10 pointer-events-none">
              <span className="px-3 py-1 bg-black/90 border border-red-500/50 text-[#FF3048] text-xs font-bold uppercase tracking-widest rounded-[2px] shadow-2xl">
                Out Of Stock
              </span>
            </div>
          )}

          {/* Quick Action Overlay on Hover */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex gap-2 z-20">
            <button
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className={`flex-1 py-2.5 px-3 text-[11px] font-bold uppercase tracking-[0.12em] rounded-[4px] flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95 ${
                isAvailable
                  ? 'bg-[#E50924] hover:bg-[#FF3048] text-white shadow-[#E50924]/40 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/[0.08]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {isAvailable ? 'Add To Bag' : 'Out Of Stock'}
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 sm:p-4 flex-1 flex flex-col justify-between border-t border-white/[0.04]">
          <div>
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.15em] font-semibold mb-1">
              <span className="text-[#E50924]">{product.brand}</span>
              <span className={`flex items-center gap-1 ${isDark ? 'text-[#858585]' : 'text-gray-400'}`}>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {product.rating.toFixed(1)}
              </span>
            </div>

            <h3
              className={`font-heading font-bold text-sm leading-snug line-clamp-2 transition-colors ${
                isDark ? 'text-white group-hover:text-[#FF3048]' : 'text-gray-900 group-hover:text-[#E50924]'
              }`}
            >
              {product.name}
            </h3>

            <p className={`text-xs mt-1 line-clamp-1 ${isDark ? 'text-[#858585]' : 'text-gray-500'}`}>
              {product.shortDescription}
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-black text-base sm:text-lg text-white tabular-nums tracking-tight">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-[#858585] line-through tabular-nums">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <span className="text-[10px] font-mono uppercase tracking-wider text-[#858585] group-hover:text-[#FF3048] transition-colors flex items-center gap-1">
              VIEW <ArrowRight className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
