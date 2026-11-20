'use client';

import React, { useState } from 'react';
import { 
  Plus, Edit3, Trash2, Bookmark, CheckCircle2, AlertTriangle, 
  X, Check, Globe 
} from 'lucide-react';
import { useTaxonomyStore } from '@/store/taxonomyStore';
import { useProductStore } from '@/store/productStore';
import { Brand } from '@/types';
import toast from 'react-hot-toast';

export default function BrandsTab() {
  const brands = useTaxonomyStore((state) => state.brands);
  const addBrand = useTaxonomyStore((state) => state.addBrand);
  const updateBrand = useTaxonomyStore((state) => state.updateBrand);
  const deleteBrand = useTaxonomyStore((state) => state.deleteBrand);
  const products = useProductStore((state) => state.products);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('United States');
  const [founded, setFounded] = useState<number>(1976);
  const [active, setActive] = useState(true);

  const handleOpenAdd = () => {
    setEditingBrand(null);
    setName('');
    setSlug('');
    setDescription('');
    setCountry('United States');
    setFounded(2000);
    setActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (b: Brand) => {
    setEditingBrand(b);
    setName(b.name);
    setSlug(b.slug);
    setDescription(b.description || '');
    setCountry(b.country || 'Global');
    setFounded(b.founded || 2000);
    setActive(b.isActive !== false);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      toast.error('Brand Name and Slug are required.');
      return;
    }

    if (editingBrand) {
      updateBrand(editingBrand.id, {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        country: country.trim(),
        founded,
        isActive: active,
      });
      toast.success(`Brand "${name}" updated.`);
    } else {
      addBrand({
        id: `brand-${slug.trim()}`,
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        country: country.trim(),
        founded,
        isActive: active,
        order: brands.length + 1,
      });
      toast.success(`Brand "${name}" added.`);
    }
    setModalOpen(false);
  };

  const handleDelete = (b: Brand) => {
    // Safety check: block if active products are linked
    const linkedCount = products.filter(
      (p) => p.brand.toLowerCase() === b.name.toLowerCase() || p.brand.toLowerCase() === b.slug.toLowerCase()
    ).length;

    if (linkedCount > 0) {
      toast.error(
        `Action blocked: ${linkedCount} active showroom devices belong to "${b.name}". Reassign or delete products first.`
      );
      return;
    }

    if (confirm(`Are you sure you want to remove brand "${b.name}"?`)) {
      const res = deleteBrand(b.id);
      if (res.success) {
        toast.success(`Brand "${b.name}" removed.`);
      } else {
        toast.error(res.message || 'Could not delete brand');
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08]">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Authorized Brand Portfolio
          </h2>
          <p className="text-xs text-[#717171]">
            Curate partner brands, heritage origins, and catalog filtering tags
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E50924] hover:bg-[#C8081F] text-white text-xs font-semibold tracking-wide transition-all shadow-lg shadow-[#E50924]/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Brand</span>
        </button>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((b) => {
          const linkedCount = products.filter(
            (p) => p.brand.toLowerCase() === b.name.toLowerCase() || p.brand.toLowerCase() === b.slug.toLowerCase()
          ).length;

          return (
            <div
              key={b.id}
              className="p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08] flex flex-col justify-between group hover:border-white/20 transition-all"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#141414] border border-white/[0.06] text-[#E50924]">
                      <Bookmark className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-wide">{b.name}</h3>
                      <span className="text-[10px] text-[#666] font-mono">
                        {b.country} &bull; Est. {b.founded}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      b.isActive !== false
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {b.isActive !== false ? 'Active' : 'Archived'}
                  </span>
                </div>

                <p className="text-xs text-[#888] line-clamp-2 mb-4">
                  {b.description || 'Pinnacle precision engineering and authentic manufacture.'}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-[#717171] font-medium">
                  <strong className="text-white font-bold">{linkedCount}</strong> devices in showroom
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-1.5 rounded-lg text-[#717171] hover:text-white hover:bg-white/[0.05] transition-colors"
                    title="Edit brand"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(b)}
                    className="p-1.5 rounded-lg text-[#717171] hover:text-[#FF4D4F] hover:bg-[#E50924]/10 transition-colors"
                    title="Delete brand"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md bg-[#121212] border border-white/[0.1] rounded-2xl p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                {editingBrand ? 'Edit Brand' : 'Register Brand'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#666] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                  Brand Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingBrand) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                    }
                  }}
                  placeholder="e.g. Bang & Olufsen"
                  required
                  className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50924]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                  Brand Slug *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. bang-olufsen"
                  required
                  className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#E50924]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                    Country of Origin
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Denmark"
                    className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50924]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                    Founded Year
                  </label>
                  <input
                    type="number"
                    value={founded || ''}
                    onChange={(e) => setFounded(Number(e.target.value))}
                    placeholder="1925"
                    className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#E50924]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                  Brand Heritage Note
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brand positioning statement..."
                  className="w-full bg-[#181818] border border-white/[0.08] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E50924]"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#181818] border border-white/[0.06]">
                <div>
                  <span className="text-xs font-semibold text-white block">Active Partner</span>
                  <span className="text-[10px] text-[#717171]">Showcase in brand filters</span>
                </div>
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 accent-[#E50924]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.04] text-xs font-semibold text-[#A1A1A1] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#E50924] hover:bg-[#C8081F] text-xs font-semibold text-white"
                >
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
