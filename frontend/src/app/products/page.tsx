'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import { useProductStore } from '@/store/productStore';
import { useTaxonomyStore } from '@/store/taxonomyStore';

function ProductsContent() {
  const searchParams = useSearchParams();
  const querySearch = searchParams.get('search') || searchParams.get('q') || '';
  const queryCategory = searchParams.get('category') || 'all';
  const queryBrand = searchParams.get('brand') || 'all';

  const allProducts = useProductStore((state) => state.products);
  const productList = useMemo(() => {
    return allProducts.filter((p) => p.status !== 'draft' && p.status !== 'archived');
  }, [allProducts]);
  const categoriesList = useTaxonomyStore((state) => state.categories);
  const brandsList = useTaxonomyStore((state) => state.brands);

  const [searchTerm, setSearchTerm] = useState(querySearch);
  const [selectedCategory, setSelectedCategory] = useState(queryCategory);
  const [selectedBrand, setSelectedBrand] = useState(queryBrand);
  const [sortBy, setSortBy] = useState<'featured' | 'low-high' | 'high-low' | 'rating'>('featured');
  const [viewTheme, setViewTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (querySearch) setSearchTerm(querySearch);
    if (queryCategory) setSelectedCategory(queryCategory);
    if (queryBrand) setSelectedBrand(queryBrand);
  }, [querySearch, queryCategory, queryBrand]);

  const categories = ['all', ...categoriesList.filter((c) => c.isVisible).map((c) => c.slug)];
  const brands = ['all', ...brandsList.filter((b) => b.isActive).map((b) => b.name)];

  const filteredProducts = useMemo(() => {
    return productList.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchBrand = selectedBrand === 'all' || p.brand.toLowerCase() === selectedBrand.toLowerCase();
      return matchSearch && matchCategory && matchBrand;
    }).sort((a, b) => {
      if (sortBy === 'low-high') return a.price - b.price;
      if (sortBy === 'high-low') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [productList, searchTerm, selectedCategory, selectedBrand, sortBy]);

  return (
    <div className={`min-h-screen py-6 sm:py-8 px-4 transition-colors duration-300 ${viewTheme === 'dark' ? 'bg-[#090909] text-white' : 'bg-[#F5F5F5] text-gray-900'}`}>
      <div className="container-custom">
        
        {/* Compact Luxury Header Banner */}
        <div className={`rounded-lg py-4 px-5 sm:py-5 sm:px-7 mb-6 border relative overflow-hidden border-l-2 border-l-[#E50924] ${
          viewTheme === 'dark' 
            ? 'bg-gradient-to-r from-[#14080A]/90 via-[#101010] to-[#141414] border-white/[0.08] shadow-xl shadow-black/40' 
            : 'bg-white border-[#E6E6E6] shadow-sm'
        }`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-radial-red opacity-25 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
            <div className="min-w-0 max-w-2xl">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E50924] animate-pulse" />
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF3048]">
                  Saitronics Showroom Catalogue
                </span>
              </div>
              <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug">
                All Electronics & Flagships
              </h1>
              <p className={`text-[11px] sm:text-xs mt-1 leading-relaxed max-w-xl font-sans ${viewTheme === 'dark' ? 'text-[#8E8E93]' : 'text-gray-600'}`}>
                Browse our verified inventory of factory-sealed smartphones, creator laptops, audiophile acoustics, and fast chargers.
              </p>
            </div>

            {/* Inventory Count Badge */}
            <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
              <div className="px-3.5 py-1.5 rounded-full bg-[#141414] border border-white/[0.08] text-xs font-mono text-[#D4D4D8] flex items-center gap-2 shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  <strong className="text-white font-bold tabular-nums">{filteredProducts.length}</strong> Available
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className={`rounded-[4px] p-4 mb-8 border flex flex-col md:flex-row items-center gap-4 ${
          viewTheme === 'dark' ? 'bg-[#111111] border-white/[0.08]' : 'bg-white border-[#E6E6E6]'
        }`}>
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858585]" />
            <input
              type="text"
              placeholder="Search by model, brand, or specifications..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-[4px] text-xs focus:outline-none transition-all ${
                viewTheme === 'dark'
                  ? 'bg-[#141414] text-white border border-white/[0.08] focus:border-[#E50924]'
                  : 'bg-gray-100 text-gray-900 border border-gray-200 focus:border-[#E50924]'
              }`}
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className={`px-3 py-2.5 rounded-[4px] text-xs font-semibold uppercase tracking-wider focus:outline-none cursor-pointer ${
              viewTheme === 'dark' ? 'bg-[#141414] text-white border border-white/[0.08]' : 'bg-gray-100 text-gray-900 border border-gray-200'
            }`}
          >
            {categories.map(c => (
              <option key={c} value={c} className="capitalize">
                {c === 'all' ? 'All Categories' : c}
              </option>
            ))}
          </select>

          {/* Brand Dropdown */}
          <select
            value={selectedBrand}
            onChange={e => setSelectedBrand(e.target.value)}
            className={`px-3 py-2.5 rounded-[4px] text-xs font-semibold uppercase tracking-wider focus:outline-none cursor-pointer ${
              viewTheme === 'dark' ? 'bg-[#141414] text-white border border-white/[0.08]' : 'bg-gray-100 text-gray-900 border border-gray-200'
            }`}
          >
            {brands.map(b => (
              <option key={b} value={b} className="capitalize">
                {b === 'all' ? 'All Brands' : b}
              </option>
            ))}
          </select>

          {/* Sort By Dropdown */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'featured' | 'low-high' | 'high-low' | 'rating')}
            className={`px-3 py-2.5 rounded-[4px] text-xs font-semibold uppercase tracking-wider focus:outline-none cursor-pointer ${
              viewTheme === 'dark' ? 'bg-[#141414] text-white border border-white/[0.08]' : 'bg-gray-100 text-gray-900 border border-gray-200'
            }`}
          >
            <option value="featured">Featured Order</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="rating">Top Customer Rating</option>
          </select>

          {/* Theme Toggle (Dark / Light View) */}
          <div className="flex items-center gap-1 bg-[#141414] p-1 rounded-[4px] border border-white/[0.08]">
            <button
              onClick={() => setViewTheme('dark')}
              className={`px-3 py-1.5 rounded-[2px] text-[10px] font-bold uppercase transition-all cursor-pointer ${
                viewTheme === 'dark' ? 'bg-[#E50924] text-white' : 'text-[#858585] hover:text-white'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setViewTheme('light')}
              className={`px-3 py-1.5 rounded-[2px] text-[10px] font-bold uppercase transition-all cursor-pointer ${
                viewTheme === 'light' ? 'bg-white text-black' : 'text-[#858585] hover:text-white'
              }`}
            >
              Light
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#858585]">
          <p>
            Showing <span className="font-bold text-white tabular-nums">{filteredProducts.length}</span> verified electronics models
          </p>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 rounded-[4px] border border-white/[0.08] bg-[#111111]">
            <p className="text-sm text-[#858585]">No electronics matched your search or filters.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setSelectedBrand('all'); }}
              className="mt-4 btn-primary text-xs font-bold"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} theme={viewTheme} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#090909] text-white p-12 text-center text-xs">Loading catalogue...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
