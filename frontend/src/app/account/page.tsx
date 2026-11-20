'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Heart, ShieldCheck, MapPin, Phone, LogOut, Store } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState({ name: 'Darina V.', email: 'darina@saitronics.com', role: 'customer' });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('saitronics-user');
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('saitronics-user');
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <div className="bg-[#090909] text-white min-h-screen py-6 sm:py-8 px-4">
      <div className="container-custom max-w-4xl">
        
        {/* Compact Luxury Profile Card */}
        <div className="bg-gradient-to-r from-[#14080A]/90 via-[#101010] to-[#141414] border border-white/[0.08] rounded-lg py-4 px-5 sm:py-5 sm:px-7 mb-6 sm:mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-l-2 border-l-[#E50924] shadow-xl shadow-black/40">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#E50924] to-[#B90820] flex items-center justify-center text-lg font-heading font-black text-white shadow-lg shadow-[#E50924]/30 shrink-0">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="font-heading text-lg sm:text-xl font-bold text-white">
                  {user.name}
                </h1>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#E50924]/20 text-[#FF3048] border border-[#E50924]/30">
                  VIP Member
                </span>
              </div>
              <p className="text-[11px] text-[#8E8E93] mt-0.5 font-sans">{user.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#8E8E93] hover:text-white flex items-center gap-2 border border-white/[0.08] transition-colors uppercase tracking-wider cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        {/* Quick Action Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link
            href="/my-orders"
            className="p-6 rounded-[4px] bg-[#111111] border border-white/[0.08] hover:border-[#E50924]/40 transition-all flex flex-col justify-between group"
          >
            <Package className="w-6 h-6 text-[#FF3048] mb-3 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-heading font-bold text-sm text-white">My Orders</p>
              <p className="text-xs text-[#858585] mt-0.5 font-sans">Track shipment & showroom deliveries</p>
            </div>
          </Link>

          <Link
            href="/wishlist"
            className="p-6 rounded-[4px] bg-[#111111] border border-white/[0.08] hover:border-[#E50924]/40 transition-all flex flex-col justify-between group"
          >
            <Heart className="w-6 h-6 text-[#FF3048] mb-3 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-heading font-bold text-sm text-white">Saved Wishlist</p>
              <p className="text-xs text-[#858585] mt-0.5 font-sans">Review saved flagship items</p>
            </div>
          </Link>

          <Link
            href="/contact"
            className="p-6 rounded-[4px] bg-[#111111] border border-white/[0.08] hover:border-[#E50924]/40 transition-all flex flex-col justify-between group"
          >
            <Store className="w-6 h-6 text-[#FF3048] mb-3 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-heading font-bold text-sm text-white">Showroom & Map</p>
              <p className="text-xs text-[#858585] mt-0.5 font-sans">Visit Uttarpara retail experience center</p>
            </div>
          </Link>
        </div>

        {/* Showroom Contact Card */}
        <div className="bg-[#111111] border border-white/[0.08] rounded-[4px] p-6 sm:p-8">
          <h2 className="font-heading text-base font-bold text-white flex items-center gap-2 mb-4">
            <Store className="w-4 h-4 text-[#E50924]" />
            Your Designated Showroom
          </h2>
          <div className="space-y-2 text-xs text-[#B8B8B8] font-sans">
            <p className="text-white font-semibold">Saitronics Uttarpara Flagship Experience Center</p>
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#E50924]" />
              58/3, New GT Road, Near College Bus Stop, Uttarpara, West Bengal – 712258
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#E50924]" />
              Store Helpline: <a href="tel:09831250575" className="text-white font-bold hover:underline tabular-nums">09831250575</a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
