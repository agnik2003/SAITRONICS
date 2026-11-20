import { getProductsByCategory } from '@/data/products';
import ProductCard from '@/components/ui/ProductCard';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const categoryMeta: Record<string, { title: string; subtitle: string; description: string }> = {
  smartphones: {
    title: 'Smartphones & Flagships',
    subtitle: 'Cutting-Edge Mobile Engineering',
    description: 'Explore our complete showroom of flagship smartphones from Apple, Huawei, Samsung, OnePlus, Google, Xiaomi, Vivo, Oppo, Realme, and Motorola.'
  },
  iphones: {
    title: 'Apple iPhones',
    subtitle: 'Titanium. Pro Performance.',
    description: 'Official factory-sealed Apple iPhones with A17 Pro performance, ProMotion displays, and titanium craftsmanship.'
  },
  'android-phones': {
    title: 'Android Flagships',
    subtitle: 'AI, 200MP Cameras & Fast Charging',
    description: 'Flagship Android devices featuring Snapdragon 8 Gen 3, Hasselblad and Leica optics, and ultra-fast charging capabilities.'
  },
  laptops: {
    title: 'Laptops & Workstations',
    subtitle: 'Power for Creators & Professionals',
    description: 'Liquid Retina XDR MacBooks and OLED Windows creator workstations engineered for uncompromised productivity.'
  },
  tablets: {
    title: 'Tablets & Touch Displays',
    subtitle: 'Ultra-thin Tandem OLED',
    description: 'Next-generation M4 iPad Pros and premium creative tablets with stylus precision and all-day battery.'
  },
  smartwatches: {
    title: 'Smartwatches & Wearables',
    subtitle: 'Titanium, Sapphire & Wellness',
    description: 'High-altitude adventure watches and AI health monitors with dual-frequency GPS and sapphire crystal.'
  },
  audio: {
    title: 'Audiophile Sound & Acoustics',
    subtitle: 'Dual-Processor ANC & Spatial Sound',
    description: 'Industry-leading noise cancellation headphones, wireless earbuds, and room-filling Marshall stereo sound.'
  },
  accessories: {
    title: 'GaN Power & Essentials',
    subtitle: 'Ultra-Fast Desktop Hubs',
    description: 'Anker GaNPrime multi-port charging stations and premium cables designed for reliable high-wattage power.'
  },
};

type Props = { params: { category: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = categoryMeta[params.category.toLowerCase()];
  return {
    title: meta?.title ?? `${params.category} | Saitronics`,
    description: meta?.description ?? '',
  };
}

export function generateStaticParams() {
  return Object.keys(categoryMeta).map(c => ({ category: c }));
}

export default function CategoryPage({ params }: Props) {
  const catKey = params.category.toLowerCase();
  const meta = categoryMeta[catKey] || {
    title: params.category.toUpperCase(),
    subtitle: 'Saitronics Curated Electronics',
    description: `Explore all products in the ${params.category} collection at Saitronics.`
  };

  const categoryProducts = getProductsByCategory(catKey);

  return (
    <div className="bg-[#090909] text-white min-h-screen py-6 sm:py-8 px-4">
      <div className="container-custom">

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#71717A] mb-4">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white transition-colors">Categories</Link>
          <span>/</span>
          <span className="text-[#E50924] font-medium capitalize">{meta.title}</span>
        </div>

        {/* Compact Luxury Category Header */}
        <div className="rounded-lg py-4 px-5 sm:py-5 sm:px-7 mb-6 sm:mb-8 bg-gradient-to-r from-[#14080A]/90 via-[#101010] to-[#141414] border border-white/[0.08] relative overflow-hidden shadow-xl shadow-black/40 border-l-2 border-l-[#E50924]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-radial-red opacity-25 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
            <div className="min-w-0 max-w-2xl">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E50924] animate-pulse" />
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF3048]">
                  {meta.subtitle}
                </span>
              </div>
              <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
                {meta.title}
              </h1>
              <p className="text-[11px] sm:text-xs text-[#8E8E93] mt-1 leading-relaxed max-w-xl font-sans">
                {meta.description}
              </p>
            </div>

            {/* High-End Verified Inventory Pill */}
            <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
              <div className="px-3.5 py-1.5 rounded-full bg-[#141414] border border-white/[0.08] text-xs font-mono text-[#D4D4D8] flex items-center gap-2 shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  <strong className="text-white font-bold tabular-nums">{categoryProducts.length}</strong> Verified {categoryProducts.length === 1 ? 'Model' : 'Models'}
                </span>
                <span className="text-[10px] text-[#71717A] uppercase font-sans font-semibold tracking-wider">In Stock</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {categoryProducts.length === 0 ? (
          <div className="text-center py-24 rounded-[4px] border border-white/[0.08] bg-[#111111]">
            <p className="text-sm text-[#858585]">No products currently available in this specific category.</p>
            <Link href="/products" className="mt-4 btn-primary text-xs font-bold inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryProducts.map(product => (
              <ProductCard key={product.id} product={product} theme="dark" />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
