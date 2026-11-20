'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useStoreSettingsStore } from '@/store/storeSettingsStore';
import { useTaxonomyStore } from '@/store/taxonomyStore';

export default function Footer() {
  const pathname = usePathname();
  const settings = useStoreSettingsStore((state) => state.settings);
  const categories = useTaxonomyStore((state) => state.categories);

  // Suppress consumer storefront footer on admin portal
  if (pathname?.startsWith('/admin')) return null;

  const visibleCategories = categories.filter((c) => c.isVisible).slice(0, 6);

  return (
    <footer className="bg-[#050505] text-[#B8B8B8] border-t border-white/10 relative overflow-hidden">
      {/* Signature Red Accent Ambient Glow in Footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#E50924]/10 to-transparent blur-2xl pointer-events-none" />

      {/* Main Footer Content */}
      <div className="container-custom py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand & Showroom */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="w-8 h-8 bg-gradient-to-br from-[#E50924] to-[#B90820] rounded-[4px] flex items-center justify-center shadow-md shadow-[#E50924]/20">
                <span className="font-heading font-black text-white text-base">S</span>
              </div>
              <div>
                <span className="font-heading text-lg font-extrabold tracking-tight text-white">
                  SAI<span className="text-[#E50924]">TRONICS</span>
                </span>
                <span className="text-[8px] uppercase tracking-[0.25em] text-[#858585] font-semibold block">
                  {settings.tagline || 'Technology • Style • Experience'}
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#858585] leading-relaxed max-w-sm mb-6">
              Saitronics is an established premium electronics retailer delivering authentic flagship smartphones, high-performance computing, audio engineering, and luxury gadgets with personalized service.
            </p>

            {/* Store Information Highlight Card */}
            <div className="bg-[#111111] border border-white/[0.08] rounded-[4px] p-4 max-w-sm space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-white">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E50924]" /> Physical Showroom
                </span>
                <span className="text-[10px] text-[#858585]">{settings.city}, {settings.state}</span>
              </div>
              <p className="text-xs text-[#B8B8B8] flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E50924] flex-shrink-0 mt-0.5" />
                <span>{settings.address}, {settings.city}, {settings.state} – {settings.pincode}</span>
              </p>
              <p className="text-xs text-[#B8B8B8] flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E50924] flex-shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">{settings.phone}</a>
              </p>
            </div>
          </div>

          {/* Column 2: Flagship Categories */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#E50924] rounded-full" />
              Catalogue
            </h4>
            <ul className="space-y-2.5 text-xs">
              {visibleCategories.map(cat => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-white hover:translate-x-0.5 transition-all inline-block">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/products" className="text-[#FF3048] hover:text-white font-semibold flex items-center gap-1 mt-2">
                  All Products <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Services */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#E50924] rounded-full" />
              Showroom Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/contact" className="hover:text-white transition-colors">Uttarpara Experience Center</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">In-Store Live Demos</Link></li>
              <li><Link href="/my-orders" className="hover:text-white transition-colors">Track Active Shipment</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Official Manufacturer Warranties</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Direct Specialist Consultation</Link></li>
            </ul>
          </div>

          {/* Column 4: Showroom Hours & Contact */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#E50924] rounded-full" />
              Showroom Hours
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2 text-[#858585]">
                <Clock className="w-4 h-4 text-[#E50924] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Showroom Timings</p>
                  <p className="text-[11px] mt-0.5">{settings.hours}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-[#858585]">
                <Mail className="w-4 h-4 text-[#E50924] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Email Desk</p>
                  <a href={`mailto:${settings.email}`} className="text-[11px] hover:text-white transition-colors">{settings.email}</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Developer Credit */}
        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#858585]">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <p>© {new Date().getFullYear()} Saitronics Retail Pvt Ltd. All rights reserved.</p>
          </div>
          
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/admin" className="text-[#858585] hover:text-[#E50924] transition-colors">
              Staff Portal
            </Link>
            <span>•</span>
            <span className="text-[#858585]">Developed by SM Software Resource Capital (SMSRC)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
