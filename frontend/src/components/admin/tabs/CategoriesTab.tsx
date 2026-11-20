'use client';

import React, { useState } from 'react';
import { 
  Plus, Edit3, Trash2, Layers, CheckCircle2, AlertTriangle, 
  X, Check, ExternalLink, ArrowUpDown 
} from 'lucide-react';
import { useTaxonomyStore } from '@/store/taxonomyStore';
import { useProductStore } from '@/store/productStore';
import { Category } from '@/types';
import toast from 'react-hot-toast';

export default function CategoriesTab() {
  const categories = useTaxonomyStore((state) => state.categories);
  const addCategory = useTaxonomyStore((state) => state.addCategory);
  const updateCategory = useTaxonomyStore((state) => state.updateCategory);
  const deleteCategory = useTaxonomyStore((state) => state.deleteCategory);
  const products = useProductStore((state) => state.products);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Smartphone');
  const [active, setActive] = useState(true);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setIcon('Smartphone');
    setActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description || '');
    setIcon(c.icon || 'Smartphone');
    setActive(c.isVisible !== false);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      toast.error('Category Name and Slug are required.');
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        icon: icon.trim(),
        isVisible: active,
      });
      toast.success(`Category "${name}" updated.`);
    } else {
      addCategory({
        id: `cat-${slug.trim()}`,
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        icon: icon.trim(),
        order: categories.length + 1,
        isVisible: active,
      });
      toast.success(`Category "${name}" created.`);
    }
    setModalOpen(false);
  };

  const handleDelete = (c: Category) => {
    // Safety check: count products assigned
    const assignedCount = products.filter(
      (p) => p.category.toLowerCase() === c.slug.toLowerCase() || p.category.toLowerCase() === c.name.toLowerCase()
    ).length;

    if (assignedCount > 0) {
      toast.error(
        `Action blocked: ${assignedCount} active products are assigned to "${c.name}". Reassign or delete products first.`
      );
      return;
    }

    if (confirm(`Are you sure you want to delete category "${c.name}"?`)) {
      const res = deleteCategory(c.id);
      if (res.success) {
        toast.success(`Category "${c.name}" removed.`);
      } else {
        toast.error(res.message || 'Could not delete category');
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08]">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Storefront Taxonomy & Categories
          </h2>
          <p className="text-xs text-[#717171]">
            Organize catalog hierarchy and navigation bars across user storefront
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E50924] hover:bg-[#C8081F] text-white text-xs font-semibold tracking-wide transition-all shadow-lg shadow-[#E50924]/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => {
          const assignedCount = products.filter(
            (p) => p.category.toLowerCase() === c.slug.toLowerCase() || p.category.toLowerCase() === c.name.toLowerCase()
          ).length;

          return (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08] flex flex-col justify-between group hover:border-white/20 transition-all"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#141414] border border-white/[0.06] text-[#E50924]">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-wide">{c.name}</h3>
                      <span className="text-[10px] text-[#666] font-mono">/{c.slug}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      c.isVisible !== false
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {c.isVisible !== false ? 'Active' : 'Hidden'}
                  </span>
                </div>

                <p className="text-xs text-[#888] line-clamp-2 mb-4">
                  {c.description || 'Curated luxury electronics selection.'}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-[#717171] font-medium">
                  <strong className="text-white font-bold">{assignedCount}</strong> products linked
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 rounded-lg text-[#717171] hover:text-white hover:bg-white/[0.05] transition-colors"
                    title="Edit category"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c)}
                    className="p-1.5 rounded-lg text-[#717171] hover:text-[#FF4D4F] hover:bg-[#E50924]/10 transition-colors"
                    title="Delete category"
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
                {editingCategory ? 'Edit Category' : 'Create Category'}
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
                  Category Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategory) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                    }
                  }}
                  placeholder="e.g. Smart Living"
                  required
                  className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50924]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                  URL Slug *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. smart-living"
                  required
                  className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#E50924]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description for category banner..."
                  className="w-full bg-[#181818] border border-white/[0.08] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E50924]"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#181818] border border-white/[0.06]">
                <div>
                  <span className="text-xs font-semibold text-white block">Active on Storefront</span>
                  <span className="text-[10px] text-[#717171]">Show in navigation headers & footer</span>
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
