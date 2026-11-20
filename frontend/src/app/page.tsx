'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight, Store, Headphones as HeadphoneIcon,
  HelpCircle, ChevronRight, ChevronLeft, Phone, MapPin, Award
} from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import HeroCinematic from '@/components/home/HeroCinematic';
import { useSiteContentStore } from '@/store/siteContentStore';
import { useProductStore } from '@/store/productStore';
import { useTaxonomyStore } from '@/store/taxonomyStore';
import { useStoreSettingsStore } from '@/store/storeSettingsStore';

// Service Pillars (Grounded in real store promises)
const trustServices = [
  { icon: Award, title: 'Wide Product Selection', desc: 'Authentic global flagship brands in one showroom' },
  { icon: Store, title: 'Convenient Store Shopping', desc: 'Experience demo units live in Uttarpara' },
  { icon: HelpCircle, title: 'Customer Assistance', desc: 'Personalized guidance from certified electronics specialists' },
  { icon: Phone, title: 'Direct Product Enquiries', desc: 'Direct line to our showroom specialists at 09831250575' },
];

export default function HomePage() {
  const siteContent = useSiteContentStore((state) => state.content);
  const products = useProductStore((state) => state.products);
  const categories = useTaxonomyStore((state) => state.categories);
  const brandsList = useTaxonomyStore((state) => state.brands);
  const settings = useStoreSettingsStore((state) => state.settings);

  const [selectedBrandFilter, setSelectedBrandFilter] = useState('All');

  // Verified published products
  const publishedProducts = products.filter((p) => p.status !== 'draft' && p.status !== 'archived');

  // New launches from store
  const newLaunchProductIds = siteContent?.newLaunchesHeading?.productIds || [];
  const newLaunches = publishedProducts.filter(
    (p) => p.isNewLaunch || newLaunchProductIds.includes(p.id) || p.badge === 'new'
  );

  // Bestsellers from store
  const bestsellerProductIds = siteContent?.bestsellersHeading?.productIds || [];
  const bestsellers = publishedProducts.filter(
    (p) => p.isBestSeller || bestsellerProductIds.includes(p.id) || p.badge === 'bestseller'
  );

  // Filtered smartphones
  const allSmartphones = publishedProducts.filter((p) => p.category === 'smartphones');
  const audioProducts = publishedProducts.filter((p) => p.category === 'audio');

  const brandNames = ['All', ...brandsList.filter((b) => b.isActive).map((b) => b.name)];

  const filteredPhones = selectedBrandFilter === 'All'
    ? allSmartphones
    : allSmartphones.filter((p) => p.brand.toLowerCase() === selectedBrandFilter.toLowerCase());

  // Category showroom tiles
  const visibleCategories = categories.filter((c) => c.isVisible);

  const sec = siteContent?.sectionsVisibility || {
    hero: true,
    trustServices: true,
    categories: true,
    newLaunches: true,
    collections: true,
    bestsellers: true,
    audioBanner: true,
    showroom: true
  };

  return (
    <div className="bg-[#090909] text-white overflow-hidden">

      {/* ============================================================ */}
      {/* 1.1 CINEMATIC 3D PRODUCT HERO SHOWCASE                       */}
      {/* ============================================================ */}
      {sec.hero && <HeroCinematic />}

      {/* ============================================================ */}
      {/* 1.2 TRUST / SERVICE STRIP                                   */}
      {/* ============================================================ */}
      {sec.trustServices && (
        <section className="bg-[#111111] border-b border-white/[0.08] py-10 px-4">
          <div className="container-custom">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trustServices.map(item => (
                <div key={item.title} className="flex items-center gap-4 p-4 rounded-[4px] bg-[#141414] border border-white/[0.04] hover:border-white/[0.1] transition-colors">
                  <div className="w-10 h-10 rounded-[4px] bg-[#191919] border border-white/[0.08] flex items-center justify-center flex-shrink-0 text-[#FF3048]">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white">{item.title}</h4>
                    <p className="text-xs text-[#858585] mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 1.2 SHOP BY CATEGORY                                        */}
      {/* ============================================================ */}
      {sec.categories && visibleCategories.length > 0 && (
        <section className="py-24 sm:py-28 px-4">
          <div className="container-custom">
            <div className="flex flex-col sm:flex-row items-baseline justify-between mb-12 pb-4 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E50924]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF3048]">
                    01 / CURATED SHOWROOM
                  </span>
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
                  Shop By Category
                </h2>
              </div>
              <Link href="/products" className="text-xs font-semibold uppercase tracking-[0.14em] text-[#FF3048] hover:text-white flex items-center gap-1.5 mt-3 sm:mt-0 transition-colors">
                Browse All Products <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {visibleCategories.map((cat, idx) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group relative rounded-[4px] overflow-hidden bg-[#111111] border border-white/[0.08] hover:border-[#E50924]/60 hover:shadow-2xl hover:shadow-[#E50924]/10 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A0A0A]">
                    <Image
                      src={cat.image || '/images/cat-smartphones.jpg'}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-600 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/30 to-transparent" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-[2px] bg-black/70 backdrop-blur-sm text-[9px] font-mono text-[#858585] border border-white/[0.08]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="p-3.5 relative z-10 flex items-center justify-between">
                    <div>
                      <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-white group-hover:text-[#FF3048] transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] text-[#858585] mt-0.5 font-sans">
                        {cat.description || `${cat.productCount || 0} Models`}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#858585] group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                  <div className="h-0.5 w-full bg-[#E50924] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 1.2 NEW LAUNCHES – SIGNATURE EDITORIAL SECTION              */}
      {/* ============================================================ */}
      {sec.newLaunches && newLaunches.length > 0 && (
        <section className="py-24 sm:py-28 px-4 bg-gradient-to-b from-[#090909] via-[#0E0608] to-[#090909] border-y border-white/[0.08] relative">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-radial-red opacity-30 pointer-events-none blur-3xl" />

          <div className="container-custom relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block px-3 py-0.5 rounded-[2px] bg-[#E50924]/15 border border-[#E50924]/30 text-[#FF3048] text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
                {siteContent?.newLaunchesHeading?.label || '02 / EDITORIAL LAUNCHES'}
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white tracking-tight">
                {siteContent?.newLaunchesHeading?.title || 'New Flagship Launches'}
              </h2>
              <p className="text-xs sm:text-sm text-[#B8B8B8] mt-3">
                {siteContent?.newLaunchesHeading?.subtitle || 'Cutting-edge engineering and next-generation mobile silicon, now in stock.'}
              </p>
            </div>

            {/* Editorial Asymmetric Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {newLaunches[0] && (
                <div className="lg:col-span-7 bg-[#111111] border border-white/[0.08] rounded-[4px] p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden group hover:border-[#E50924]/50 transition-all duration-300">
                  <div className="absolute -top-12 -right-12 w-64 h-64 bg-radial-red opacity-60 pointer-events-none" />

                  <div className="relative z-10">
                    <span className="bg-[#E50924] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-[2px] uppercase tracking-[0.14em] inline-block mb-3">
                      Premier Showcase
                    </span>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#858585]">{newLaunches[0].brand}</p>
                    <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mt-1">
                      {newLaunches[0].name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#B8B8B8] max-w-md mt-2 leading-relaxed">
                      {newLaunches[0].description}
                    </p>
                  </div>

                  <div className="relative aspect-video w-full my-6 flex items-center justify-center">
                    <Image
                      src={newLaunches[0].images[0]?.url || '/products/huawei/mate-70-rs/front.webp'}
                      alt={newLaunches[0].name}
                      fill
                      className="object-contain p-4 group-hover:scale-104 transition-transform duration-600"
                      unoptimized
                    />
                  </div>

                  <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/[0.06]">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#858585] block">Starting from</span>
                      <span className="font-heading text-2xl font-bold text-white tabular-nums">
                        ₹{newLaunches[0].price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <Link href={`/products/${newLaunches[0].slug}`} className="btn-primary text-xs font-semibold px-6 py-3">
                      View Details →
                    </Link>
                  </div>
                </div>
              )}

              <div className="lg:col-span-5 flex flex-col gap-6">
                {newLaunches.slice(1, 3).map(product => (
                  <div
                    key={product.id}
                    className="flex-1 bg-[#111111] border border-white/[0.08] rounded-[4px] p-6 flex flex-col sm:flex-row items-center gap-6 group hover:border-[#E50924]/40 transition-all duration-300"
                  >
                    <div className="relative w-32 h-32 flex-shrink-0 bg-[#161616] rounded-[4px] overflow-hidden p-2 border border-white/[0.04]">
                      <Image
                        src={product.images[0]?.url || '/products/huawei/mate-70-rs/front.webp'}
                        alt={product.name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#858585]">{product.brand}</span>
                      <h4 className="font-heading text-lg font-bold text-white group-hover:text-[#FF3048] transition-colors mt-0.5">
                        {product.name}
                      </h4>
                      <p className="text-xs text-[#858585] line-clamp-2 mt-1">
                        {product.shortDescription}
                      </p>
                      <div className="flex items-center justify-center sm:justify-between mt-3 pt-3 border-t border-white/[0.04]">
                        <span className="font-heading text-base font-bold text-white tabular-nums">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <Link href={`/products/${product.slug}`} className="text-xs font-semibold text-[#FF3048] hover:text-white transition-colors">
                          Explore →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 1.2 PREMIUM SMARTPHONE COLLECTION                           */}
      {/* ============================================================ */}
      {sec.collections && (
        <section className="py-24 sm:py-28 px-4">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E50924]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF3048]">03 / FLAGSHIP SHOWROOM</span>
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
                  Premium Smartphone Collection
                </h2>
                <p className="text-xs sm:text-sm text-[#858585] mt-1">
                  Authentic factory-sealed flagship smartphones with full manufacturer warranty.
                </p>
              </div>

              {/* Brand Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-4 md:pt-0 max-w-2xl md:justify-end scrollbar-none no-scrollbar">
                {brandNames.map(b => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrandFilter(b)}
                    className={`px-3 py-1.5 rounded-[2px] text-[11px] font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${selectedBrandFilter === b
                      ? 'bg-[#E50924] text-white shadow-sm'
                      : 'bg-[#141414] text-[#858585] hover:text-white border border-white/[0.08]'
                      }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPhones.slice(0, 8).map(product => (
                <ProductCard key={product.id} product={product} theme="dark" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 1.2 PREMIUM AUDIO EXPERIENCE                                */}
      {/* ============================================================ */}
      {sec.audioBanner && (
        <section className="py-24 sm:py-28 px-4 bg-gradient-to-r from-[#0C0C0C] via-[#14080A] to-[#0C0C0C] border-y border-white/[0.08] relative overflow-hidden">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-radial-red opacity-50 blur-3xl pointer-events-none" />

          <div className="container-custom relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
              <div className="lg:col-span-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF3048] flex items-center gap-2 mb-3">
                  <HeadphoneIcon className="w-3.5 h-3.5" /> 04 / AUDIOPHILE ACOUSTICS
                </span>
                <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white leading-tight">
                  {siteContent?.audioBanner?.title || 'ACOUSTIC ENGINEERING'}{' '}
                  <span className="text-[#E50924]">{siteContent?.audioBanner?.highlight || 'PURE SOUND.'}</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#B8B8B8] mt-4 leading-relaxed max-w-lg">
                  {siteContent?.audioBanner?.subtitle || 'Immerse yourself in precision acoustic engineering. From industry-leading dual-processor active noise cancellation to spatial acoustics.'}
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <Link href={siteContent?.audioBanner?.link || '/category/audio'} className="btn-primary">
                    Explore Audio Collection →
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                <div className="bg-[#111111] border border-white/[0.08] rounded-[4px] p-6 text-center">
                  <p className="font-heading text-3xl font-bold text-white tabular-nums">Hi-Res</p>
                  <p className="text-xs text-[#858585] mt-1 uppercase tracking-wider font-semibold">LDAC & Lossless Certified</p>
                </div>
                <div className="bg-[#111111] border border-white/[0.08] rounded-[4px] p-6 text-center">
                  <p className="font-heading text-3xl font-bold text-[#FF3048] tabular-nums">30h+</p>
                  <p className="text-xs text-[#858585] mt-1 uppercase tracking-wider font-semibold">Continuous ANC Playtime</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {audioProducts.slice(0, 3).map(product => (
                <ProductCard key={product.id} product={product} theme="dark" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 1.2 BEST SELLERS                                            */}
      {/* ============================================================ */}
      {sec.bestsellers && bestsellers.length > 0 && (
        <section className="py-24 sm:py-28 px-4 bg-[#F5F5F5] text-gray-900">
          <div className="container-custom">
            <div className="flex flex-col sm:flex-row items-baseline justify-between mb-10 pb-4 border-b border-[#E6E6E6]">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E50924]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#E50924]">05 / VERIFIED FAVORITES</span>
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#090909]">
                  {siteContent?.bestsellersHeading?.title || 'Best Sellers at Saitronics'}
                </h2>
                <p className="text-xs text-[#666666] mt-0.5">
                  {siteContent?.bestsellersHeading?.subtitle || 'Verified by over 1,200+ satisfied clients across West Bengal and nationwide.'}
                </p>
              </div>
              <Link href="/products" className="text-xs font-semibold uppercase tracking-[0.14em] text-[#E50924] hover:underline flex items-center gap-1 mt-2 sm:mt-0">
                View All Bestsellers <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestsellers.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} theme="light" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* 1.2 PHYSICAL SHOWROOM – UTTARPARA RETAIL EXPERIENCE         */}
      {/* ============================================================ */}
      {sec.showroom && (
        <section id="store-experience" className="py-20 sm:py-28 px-4 bg-[#090909] relative overflow-hidden border-t border-white/[0.08]">
          <div className="container-custom">
            <div className="relative rounded-[4px] bg-gradient-to-r from-[#14080A] via-[#111111] to-[#0A0A0A] border border-[#E50924]/30 p-6 sm:p-12 lg:p-14 overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-radial-red opacity-80 pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-[#161616] border border-[#E50924]/40 mb-4">
                    <Store className="w-3.5 h-3.5 text-[#FF3048]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF3048]">
                      06 / OFFLINE SHOWROOM EXPERIENCE
                    </span>
                  </div>

                  <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                    TECHNOLOGY IS BETTER WHEN YOU <span className="text-[#E50924]">EXPERIENCE IT.</span>
                  </h2>

                  <p className="text-xs sm:text-sm text-[#B8B8B8] mt-4 leading-relaxed font-sans">
                    {siteContent?.promoBlock?.desc || 'Step into our flagship retail showroom in Uttarpara. Test hands-on demonstration models, compare Leica and Zeiss optics, and receive personalized setup guidance from our certified electronics engineers.'}
                  </p>

                  <div className="mt-8 pt-6 border-t border-white/[0.08] space-y-3.5 text-xs sm:text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#E50924] flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white font-medium block">
                          {settings.address}, {settings.city}, {settings.state} – {settings.pincode}
                        </span>
                        <span className="text-[11px] text-[#858585] mt-0.5 block">
                          Landmark: Near College Bus Stop / Uttarpara Ghat
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[#E50924] flex-shrink-0" />
                      <span className="text-white font-semibold">
                        Direct Line: <a href={`tel:${settings.phone}`} className="text-[#FF3048] hover:underline tabular-nums">{settings.phone}</a>
                        <span className="text-xs font-normal text-[#858585] ml-2">({settings.hours})</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-8">
                    <a href={`tel:${settings.phone}`} className="btn-primary">
                      <Phone className="w-3.5 h-3.5" /> CALL SHOWROOM
                    </a>
                    <a
                      href={settings.mapsDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                    >
                      <MapPin className="w-3.5 h-3.5" /> GET DIRECTIONS
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5 relative">
                  <div className="relative aspect-4/3 rounded-[4px] overflow-hidden border border-white/[0.1] shadow-2xl">
                    <Image
                      src="/images/cat-smartphones.jpg"
                      alt="Saitronics Flagship Showroom Interior"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 p-3 rounded-[2px] bg-black/80 backdrop-blur-md border border-white/[0.08]">
                      <p className="text-[10px] uppercase font-bold text-[#FF3048] tracking-widest">VISIT TODAY</p>
                      <p className="text-xs text-white font-medium mt-0.5">Experience all 24+ flagship devices live in Uttarpara</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
