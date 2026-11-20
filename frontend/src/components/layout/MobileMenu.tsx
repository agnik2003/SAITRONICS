'use client';

import Link from 'next/link';
import { X, ShoppingCart, Heart, ShieldCheck, User, Phone, MapPin, ChevronRight, Package, Store, Tag } from 'lucide-react';
import { useEffect } from 'react';

interface NavigationItem {
  name: string;
  href: string;
  children?: { name: string; href: string }[];
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: NavigationItem[];
}

export default function MobileMenu({ isOpen, onClose, navigation }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-[#0E0E0E] border-r border-white/[0.08] shadow-2xl flex flex-col z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.08] bg-[#090909]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-[#E50924] to-[#B90820] rounded-[4px] flex items-center justify-center">
              <span className="font-heading font-black text-white text-base">S</span>
            </div>
            <div>
              <span className="font-heading text-lg font-bold tracking-tight text-white block leading-none">
                SAI<span className="text-[#E50924]">TRONICS</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#858585]">Uttarpara Showroom</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-[4px] text-[#B8B8B8] hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#858585]">
            Store Categories
          </p>

          {navigation.map(item => (
            <div key={item.name}>
              <Link
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-[4px] text-xs font-semibold text-[#B8B8B8] hover:text-white hover:bg-white/[0.04] hover:border-l-2 hover:border-[#E50924] transition-all uppercase tracking-wider"
              >
                <span>{item.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#858585]" />
              </Link>
            </div>
          ))}

          {/* Quick eCommerce Links */}
          <div className="pt-4 border-t border-white/[0.08] my-2 space-y-1">
            <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#858585]">
              Customer Service
            </p>
            <Link
              href="/cart"
              onClick={onClose}
              className="flex items-center gap-3 px-3.5 py-2 rounded-[4px] text-xs font-medium text-[#B8B8B8] hover:text-white hover:bg-white/[0.04]"
            >
              <ShoppingCart className="w-4 h-4 text-[#E50924]" /> Shopping Bag
            </Link>
            <Link
              href="/wishlist"
              onClick={onClose}
              className="flex items-center gap-3 px-3.5 py-2 rounded-[4px] text-xs font-medium text-[#B8B8B8] hover:text-white hover:bg-white/[0.04]"
            >
              <Heart className="w-4 h-4 text-[#E50924]" /> Saved Wishlist
            </Link>
            <Link
              href="/my-orders"
              onClick={onClose}
              className="flex items-center gap-3 px-3.5 py-2 rounded-[4px] text-xs font-medium text-[#B8B8B8] hover:text-white hover:bg-white/[0.04]"
            >
              <Package className="w-4 h-4 text-[#E50924]" /> Track My Orders
            </Link>
            <Link
              href="/contact"
              onClick={onClose}
              className="flex items-center gap-3 px-3.5 py-2 rounded-[4px] text-xs font-medium text-[#B8B8B8] hover:text-white hover:bg-white/[0.04]"
            >
              <Store className="w-4 h-4 text-[#E50924]" /> Showroom & Google Map
            </Link>
            <Link
              href="/account"
              onClick={onClose}
              className="flex items-center gap-3 px-3.5 py-2 rounded-[4px] text-xs font-medium text-[#B8B8B8] hover:text-white hover:bg-white/[0.04]"
            >
              <User className="w-4 h-4 text-[#E50924]" /> VIP Member Account
            </Link>
          </div>
        </div>

        {/* Store Quick Contact */}
        <div className="p-4 bg-[#090909] border-t border-white/[0.08] text-xs text-[#858585] space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#E50924] flex-shrink-0 mt-0.5" />
            <span className="text-[11px] leading-tight text-white">58/3, New GT Road, Near College Bus Stop, Uttarpara – 712258</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#E50924] flex-shrink-0" />
            <a href="tel:09831250575" className="hover:text-white text-[11px] tabular-nums font-bold text-[#FF3048]">09831250575 (10 AM – 9 PM)</a>
          </div>
        </div>
      </div>
    </div>
  );
}
