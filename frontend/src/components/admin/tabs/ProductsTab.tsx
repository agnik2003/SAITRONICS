'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Plus, Search, Filter, ArrowUpDown, Edit3, Copy, Trash2, 
  ExternalLink, Eye, AlertTriangle, CheckSquare, Square, 
  ChevronLeft, ChevronRight, CheckCircle2, Archive, Star, 
  Flame, Sparkles, Tag
} from 'lucide-react';
import { Product } from '@/types';
import { useProductStore } from '@/store/productStore';
import { useTaxonomyStore } from '@/store/taxonomyStore';
import { useOrderStore } from '@/store/orderStore';
import toast from 'react-hot-toast';

interface ProductsTabProps {
  onOpenEditor: (product?: Product) => void;
  searchTerm: string;
}

export default function ProductsTab({ onOpenEditor, searchTerm: globalSearch }: ProductsTabProps) {
  const products = useProductStore((state) => state.products);
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const duplicateProduct = useProductStore((state) => state.duplicateProduct);
  const bulkUpdateStatus = useProductStore((state) => state.bulkUpdateStatus);
  const bulkDelete = useProductStore((state) => state.bulkDelete);

  const categories = useTaxonomyStore((state) => state.categories);
  const brands = useTaxonomyStore((state) => state.brands);
  const orders = useOrderStore((state) => state.orders);

  // Filter States
  const [localSearch, setLocalSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [launchFilter, setLaunchFilter] = useState<'all' | 'new_launch' | 'hero' | 'featured'>('all');
  const [sortBy, setSortBy] = useState<'name_asc' | 'price_asc' | 'price_desc' | 'stock_asc' | 'stock_desc'>('name_asc');

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const query = (localSearch || globalSearch).toLowerCase().trim();

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (query && !p.name.toLowerCase().includes(query) && !p.brand.toLowerCase().includes(query) && !p.slug.toLowerCase().includes(query)) {
        return false;
      }
      // Category
      if (categoryFilter !== 'all' && p.category !== categoryFilter) {
        return false;
      }
      // Brand
      if (brandFilter !== 'all' && p.brand.toLowerCase() !== brandFilter.toLowerCase()) {
        return false;
      }
      // Stock
      if (stockFilter === 'out_of_stock' && p.stockCount > 0) return false;
      if (stockFilter === 'low_stock' && (p.stockCount === 0 || p.stockCount > (p.lowStockThreshold || 5))) return false;
      if (stockFilter === 'in_stock' && p.stockCount === 0) return false;
      // Status
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      // Launch / Merch
      if (launchFilter === 'new_launch' && !p.isNewLaunch) return false;
      if (launchFilter === 'hero' && !p.showInHero) return false;
      if (launchFilter === 'featured' && !p.isFeatured) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'stock_asc') return a.stockCount - b.stockCount;
      if (sortBy === 'stock_desc') return b.stockCount - a.stockCount;
      return 0;
    });
  }, [products, query, categoryFilter, brandFilter, stockFilter, statusFilter, launchFilter, sortBy]);

  // Paginated Slices
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedIds.length === paginatedProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedProducts.map((p) => p.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Bulk Actions
  const handleBulkPublish = () => {
    bulkUpdateStatus(selectedIds, 'published');
    toast.success(`Published ${selectedIds.length} devices.`);
    setSelectedIds([]);
  };

  const handleBulkUnpublish = () => {
    bulkUpdateStatus(selectedIds, 'draft');
    toast.success(`Unpublished ${selectedIds.length} devices.`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected devices?`)) {
      bulkDelete(selectedIds);
      toast.success(`Deleted ${selectedIds.length} devices.`);
      setSelectedIds([]);
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateProduct(id);
    toast.success('Device cloned as draft with updated slug.');
  };

  const handleDeleteSingle = (product: Product) => {
    // Check if product is in any existing orders
    const isInOrders = orders.some((o) =>
      o.items.some((it) => it.product.id === product.id || it.product.slug === product.slug)
    );

    if (isInOrders) {
      if (
        confirm(
          `Notice: "${product.name}" appears in past customer orders. To preserve historical receipt data, it will be safely Archived instead of permanently removed. Proceed?`
        )
      ) {
        updateProduct(product.id, { status: 'archived' });
        toast.success(`Product ${product.name} archived.`);
      }
    } else {
      if (confirm(`Permanently remove ${product.name} from showroom inventory?`)) {
        deleteProduct(product.id);
        toast.success(`${product.name} removed.`);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08]">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Product Catalogue Matrix
          </h2>
          <p className="text-xs text-[#717171]">
            {filteredProducts.length} of {products.length} products listed
          </p>
        </div>

        <button
          onClick={() => onOpenEditor()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E50924] hover:bg-[#C8081F] text-white text-xs font-semibold tracking-wide transition-all shadow-lg shadow-[#E50924]/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0E0E0E] border border-white/[0.08] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* Local Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#555]">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Filter by name..."
              className="w-full bg-[#141414] border border-white/[0.08] rounded-xl pl-8 pr-2.5 py-2 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#E50924]"
            />
          </div>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-[#141414] border border-white/[0.08] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#E50924]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>

          {/* Brand */}
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="w-full bg-[#141414] border border-white/[0.08] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#E50924]"
          >
            <option value="all">All Brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.name}>{b.name}</option>
            ))}
          </select>

          {/* Stock Status */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="w-full bg-[#141414] border border-white/[0.08] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#E50924]"
          >
            <option value="all">Stock: All</option>
            <option value="in_stock">In Stock (&gt;0)</option>
            <option value="low_stock">Low Stock (&le;5)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full bg-[#141414] border border-white/[0.08] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#E50924]"
          >
            <option value="all">Status: All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full bg-[#141414] border border-white/[0.08] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#E50924]"
          >
            <option value="name_asc">Sort: Name (A-Z)</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="stock_asc">Stock: Low to High</option>
            <option value="stock_desc">Stock: High to Low</option>
          </select>
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#E50924]/10 border border-[#E50924]/20 animate-in fade-in duration-150">
            <span className="text-xs text-white font-semibold">
              {selectedIds.length} device(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkPublish}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/30"
              >
                Publish Selected
              </button>
              <button
                onClick={handleBulkUnpublish}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-semibold hover:bg-amber-500/30"
              >
                Unpublish
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-2.5 py-1 rounded-lg bg-[#E50924]/20 text-[#FF4D4F] text-xs font-semibold hover:bg-[#E50924]/30"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Table */}
      <div className="rounded-2xl bg-[#0E0E0E] border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] bg-[#121212] text-[#717171] uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 w-10">
                  <button onClick={handleSelectAll} className="text-[#666] hover:text-white">
                    {selectedIds.length === paginatedProducts.length && paginatedProducts.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-[#E50924]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-4 font-semibold">Device</th>
                <th className="py-3.5 px-4 font-semibold">Brand / Category</th>
                <th className="py-3.5 px-4 font-semibold">Price</th>
                <th className="py-3.5 px-4 font-semibold">Stock</th>
                <th className="py-3.5 px-4 font-semibold">Merchandising</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[#666]">
                    No devices match the active filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  const isLow = p.stockCount > 0 && p.stockCount <= (p.lowStockThreshold || 5);
                  const isOut = p.stockCount === 0;

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        isSelected ? 'bg-white/[0.02]' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleSelect(p.id)}
                          className="text-[#666] hover:text-white"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#E50924]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-lg bg-[#080808] border border-white/[0.06] overflow-hidden shrink-0 flex items-center justify-center">
                            <Image
                              src={p.images[0]?.url || '/products/apple/iphone-15-pro-max/front.webp'}
                              alt={p.name}
                              fill
                              className="object-contain p-1"
                              unoptimized
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-white block truncate max-w-[200px]">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-[#666] font-mono block">
                              /{p.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-white font-medium block">{p.brand}</span>
                        <span className="text-[10px] text-[#717171] uppercase tracking-wider block">
                          {p.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <span className="font-semibold text-white block">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-[10px] text-[#666] line-through block">
                            ₹{p.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            isOut
                              ? 'bg-[#E50924]/20 text-[#FF4D4F] border border-[#E50924]/30'
                              : isLow
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {isOut ? 'Out of Stock' : `${p.stockCount} units`}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 flex-wrap">
                          {p.isNewLaunch && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#E50924]/20 text-[#E50924] border border-[#E50924]/30 uppercase">
                              New
                            </span>
                          )}
                          {p.showInHero && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase">
                              Hero
                            </span>
                          )}
                          {p.isFeatured && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
                              Featured
                            </span>
                          )}
                          {p.isBestSeller && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                              Best
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            p.status === 'published'
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : p.status === 'draft'
                              ? 'text-amber-400 bg-amber-500/10'
                              : 'text-zinc-400 bg-zinc-800'
                          }`}
                        >
                          {p.status || 'published'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            title="Preview on storefront"
                            className="p-1.5 rounded-lg text-[#717171] hover:text-white hover:bg-white/[0.05] transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDuplicate(p.id)}
                            title="Clone Device"
                            className="p-1.5 rounded-lg text-[#717171] hover:text-white hover:bg-white/[0.05] transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onOpenEditor(p)}
                            title="Edit"
                            className="p-1.5 rounded-lg text-[#717171] hover:text-white hover:bg-white/[0.05] transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteSingle(p)}
                            title="Delete / Archive"
                            className="p-1.5 rounded-lg text-[#717171] hover:text-[#FF4D4F] hover:bg-[#E50924]/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-white/[0.06] bg-[#101010] flex items-center justify-between text-xs text-[#717171]">
          <span>
            Showing {filteredProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} devices
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-white disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-white font-medium">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-white disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
