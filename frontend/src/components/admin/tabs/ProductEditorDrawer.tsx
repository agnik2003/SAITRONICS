'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  X, Save, AlertCircle, Plus, Trash2, Check, ArrowUp, ArrowDown, 
  Upload, Link as LinkIcon, Image as ImageIcon, Eye, Star, 
  CheckCircle2, AlertTriangle, Layers, Palette, DollarSign, 
  Sliders, ShieldAlert, Sparkles, Tag, HelpCircle
} from 'lucide-react';
import { Product, ProductImage, ProductVariant, ColorVariant } from '@/types';
import { useProductStore } from '@/store/productStore';
import { useTaxonomyStore } from '@/store/taxonomyStore';
import toast from 'react-hot-toast';

interface ProductEditorDrawerProps {
  product: Product | null; // null if creating a new product
  isOpen: boolean;
  onClose: () => void;
  onSaved: (savedProduct: Product) => void;
}

export default function ProductEditorDrawer({
  product,
  isOpen,
  onClose,
  onSaved,
}: ProductEditorDrawerProps) {
  const products = useProductStore((state) => state.products);
  const categories = useTaxonomyStore((state) => state.categories);
  const brands = useTaxonomyStore((state) => state.brands);

  const [activeTab, setActiveTab] = useState<
    'basics' | 'pricing' | 'variants' | 'colors' | 'images' | 'specs' | 'highlights' | 'merchandising' | 'seo'
  >('basics');

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');

  // Pricing
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [taxNote, setTaxNote] = useState('Inclusive of 18% GST with Official Brand Warranty');
  const [stockCount, setStockCount] = useState<number>(10);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);

  // Variants & Colors
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([]);

  // Images
  const [images, setImages] = useState<ProductImage[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [urlAngle, setUrlAngle] = useState<ProductImage['angle']>('front');
  const [urlAlt, setUrlAlt] = useState('');
  const [urlPreviewSuccess, setUrlPreviewSuccess] = useState<boolean | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // Specs & Highlights
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState('');

  // Merchandising Flags
  const [isNewLaunch, setIsNewLaunch] = useState(false);
  const [newLaunchDate, setNewLaunchDate] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isPremiumAudio, setIsPremiumAudio] = useState(false);
  const [showInHero, setShowInHero] = useState(false);
  const [heroSlideOrder, setHeroSlideOrder] = useState<number | undefined>(undefined);
  const [collection, setCollection] = useState<string>('flagship');
  const [collectionOrder, setCollectionOrder] = useState<number | undefined>(undefined);

  // SEO
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Errors & Dirty Tracking
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Load product data when editing
  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setSlug(product.slug || '');
      setBrand(product.brand || '');
      setCategory(product.category || (categories[0]?.slug || 'smartphones'));
      setSubCategory(product.subCategory || '');
      setShortDescription(product.shortDescription || '');
      setDescription(product.description || '');
      setStatus(product.status || 'published');
      setPrice(product.price || 0);
      setOriginalPrice(product.originalPrice);
      setTaxNote(product.taxNote || 'Inclusive of 18% GST with Official Brand Warranty');
      setStockCount(product.stockCount ?? 10);
      setLowStockThreshold(product.lowStockThreshold ?? 5);
      setVariants(product.variants ? JSON.parse(JSON.stringify(product.variants)) : []);
      setColorVariants(product.colorVariants ? JSON.parse(JSON.stringify(product.colorVariants)) : []);
      setImages(product.images ? JSON.parse(JSON.stringify(product.images)) : []);
      
      const specRows = Object.entries(product.specifications || {}).map(([k, v]) => ({ key: k, value: v }));
      setSpecs(specRows);
      setHighlights(product.highlights || product.features || []);
      
      setIsNewLaunch(!!product.isNewLaunch);
      setNewLaunchDate(product.newLaunchDate || '');
      setIsFeatured(!!product.isFeatured);
      setIsBestSeller(!!product.isBestSeller);
      setIsPremiumAudio(!!product.isPremiumAudio);
      setShowInHero(!!product.showInHero);
      setHeroSlideOrder(product.heroSlideOrder);
      setCollection(product.collection || 'flagship');
      setCollectionOrder(product.collectionOrder);
      
      setMetaTitle(product.metaTitle || '');
      setMetaDescription(product.metaDescription || '');
    } else {
      // New Product Defaults
      setName('');
      setSlug('');
      setBrand(brands[0]?.name || 'Apple');
      setCategory(categories[0]?.slug || 'smartphones');
      setSubCategory('Flagship');
      setShortDescription('');
      setDescription('');
      setStatus('published');
      setPrice(99900);
      setOriginalPrice(119900);
      setTaxNote('Inclusive of 18% GST with Official Brand Warranty');
      setStockCount(12);
      setLowStockThreshold(5);
      setVariants([
        { id: 'v1', name: '256GB', price: 99900, originalPrice: 119900, sku: 'DEV-256', stockCount: 8 },
        { id: 'v2', name: '512GB', price: 114900, originalPrice: 134900, sku: 'DEV-512', stockCount: 4 }
      ]);
      setColorVariants([
        { name: 'Titanium Black', hex: '#1C1C1E', stockCount: 8 },
        { name: 'Silver Mirror', hex: '#E5E5EA', stockCount: 4 }
      ]);
      setImages([
        {
          id: `img-${Date.now()}-1`,
          url: '/products/apple/iphone-15-pro-max/front.webp',
          alt: 'Front View',
          angle: 'front',
          isPrimary: true
        }
      ]);
      setSpecs([
        { key: 'Display', value: '6.7-inch Super Retina OLED 120Hz' },
        { key: 'Processor', value: 'Next-Gen Bionic Architecture' },
        { key: 'Camera', value: '48MP Triple Telephoto System' },
        { key: 'Battery', value: 'All-Day Performance Fast Charging' }
      ]);
      setHighlights([
        'Grade 5 Aerospace Titanium Architecture',
        'Advanced Computational Photography Engine',
        'Official 1-Year Brand Warranty Included'
      ]);
      setIsNewLaunch(true);
      setNewLaunchDate(new Date().toISOString().split('T')[0]);
      setIsFeatured(true);
      setIsBestSeller(false);
      setIsPremiumAudio(false);
      setShowInHero(false);
      setCollection('flagship');
      setMetaTitle('');
      setMetaDescription('');
    }
    setErrors({});
    setIsDirty(false);
  }, [product, isOpen, categories, brands]);

  // Auto-generate slug when name changes (if slug wasn't manually customized or is empty)
  const handleNameChange = (val: string) => {
    setName(val);
    setIsDirty(true);
    if (!product || slug === '' || slug === product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
      const generated = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  };

  // URL Image Validator
  const handleValidateUrl = (url: string) => {
    setUrlInput(url);
    setUrlPreviewSuccess(null);
    if (!url.trim()) return;

    const img = new window.Image();
    img.src = url.trim();
    img.onload = () => setUrlPreviewSuccess(true);
    img.onerror = () => setUrlPreviewSuccess(false);
  };

  const handleAddUrlImage = () => {
    if (!urlInput.trim()) return;
    if (urlPreviewSuccess === false) {
      toast.error('The provided image URL could not be resolved.');
      return;
    }

    const newImg: ProductImage = {
      id: `img-${Date.now()}`,
      url: urlInput.trim(),
      alt: urlAlt.trim() || `${name} Image`,
      angle: urlAngle,
      isPrimary: images.length === 0,
    };

    setImages([...images, newImg]);
    setUrlInput('');
    setUrlAlt('');
    setUrlPreviewSuccess(null);
    setIsDirty(true);
    toast.success('Image added to gallery');
  };

  // File Upload with Browser Canvas Compression (<1400px, WebP, quality 0.8)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxEdge = 1400;

        if (width > maxEdge || height > maxEdge) {
          if (width > height) {
            height = Math.round((height * maxEdge) / width);
            width = maxEdge;
          } else {
            width = Math.round((width * maxEdge) / height);
            height = maxEdge;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          toast.error('Could not process canvas context');
          setIsCompressing(false);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/webp', 0.82);

        // Size check (base64 string length in bytes ~ length * 0.75)
        const approxBytes = Math.round(dataUrl.length * 0.75);
        if (approxBytes > 600 * 1024) {
          toast.error(`Compressed image (${Math.round(approxBytes / 1024)} KB) exceeds 600 KB limit. Please choose a smaller file.`);
          setIsCompressing(false);
          return;
        }

        const newImg: ProductImage = {
          id: `img-${Date.now()}`,
          url: dataUrl,
          alt: file.name.replace(/\.[^/.]+$/, ''),
          angle: 'front',
          isPrimary: images.length === 0,
        };

        setImages([...images, newImg]);
        setIsDirty(true);
        setIsCompressing(false);
        toast.success(`Image compressed (${Math.round(approxBytes / 1024)} KB) and added.`);
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Gallery actions
  const handleDeleteImage = (id: string) => {
    const filtered = images.filter((img) => img.id !== id);
    if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    setImages(filtered);
    setIsDirty(true);
  };

  const handleSetPrimary = (index: number) => {
    const reordered = [...images];
    const [selected] = reordered.splice(index, 1);
    reordered.unshift(selected);
    const updated = reordered.map((img, i) => ({ ...img, isPrimary: i === 0 }));
    setImages(updated);
    setIsDirty(true);
    toast.success('Primary gallery thumbnail updated');
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= images.length) return;
    const reordered = [...images];
    const temp = reordered[index];
    reordered[index] = reordered[target];
    reordered[target] = temp;
    // ensure first item is primary
    const updated = reordered.map((img, i) => ({ ...img, isPrimary: i === 0 }));
    setImages(updated);
    setIsDirty(true);
  };

  // Specs Rows
  const handleAddSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
    setIsDirty(true);
  };

  const handleUpdateSpec = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
    setIsDirty(true);
  };

  const handleDeleteSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  // Highlights
  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    setHighlights([...highlights, newHighlight.trim()]);
    setNewHighlight('');
    setIsDirty(true);
  };

  const handleDeleteHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  // Form Validation & Save
  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Device name is mandatory.';
    if (!slug.trim()) newErrors.slug = 'Slug identifier is mandatory.';
    
    // Slug uniqueness check
    const duplicate = products.find(
      (p) => p.slug === slug.trim() && p.id !== (product ? product.id : '')
    );
    if (duplicate) {
      newErrors.slug = `Slug "${slug}" is already assigned to ${duplicate.name}.`;
    }

    if (price <= 0) newErrors.price = 'Selling price must be greater than 0.';
    if (originalPrice && originalPrice < price) {
      newErrors.originalPrice = 'MRP cannot be less than selling price.';
    }

    if (status === 'published' && images.length === 0) {
      newErrors.images = 'At least 1 verified device image is required before publishing.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please resolve configuration validation errors.');
      // Auto switch to tab with error
      if (newErrors.name || newErrors.slug) setActiveTab('basics');
      else if (newErrors.price || newErrors.originalPrice) setActiveTab('pricing');
      else if (newErrors.images) setActiveTab('images');
      return;
    }

    // Build specifications dictionary
    const specsRecord: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specsRecord[s.key.trim()] = s.value.trim();
      }
    });

    const calculatedDiscount = originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined;

    const savedProduct: Product = {
      id: product ? product.id : `prod-${slug.toLowerCase()}`,
      name: name.trim(),
      slug: slug.trim(),
      brand: brand.trim() || 'Apple',
      category: category.trim() || 'smartphones',
      subCategory: subCategory.trim() || undefined,
      price,
      originalPrice,
      rating: product ? product.rating : 5.0,
      reviewCount: product ? product.reviewCount : 1,
      inStock: stockCount > 0,
      stockCount,
      lowStockThreshold,
      status,
      taxNote,
      shortDescription: shortDescription.trim() || `${name} flagship hardware.`,
      description: description.trim() || shortDescription.trim(),
      features: highlights,
      highlights,
      specifications: specsRecord,
      images,
      colorVariants,
      variants,
      storageVariants: variants.map((v) => v.name),
      badge: isNewLaunch ? 'new' : isBestSeller ? 'bestseller' : undefined,
      isNewLaunch,
      newLaunchDate: isNewLaunch ? newLaunchDate || new Date().toISOString().split('T')[0] : undefined,
      isFeatured,
      isBestSeller,
      isPremiumAudio,
      showInHero,
      heroSlideOrder,
      collection: collection as any,
      collectionOrder,
      metaTitle: metaTitle.trim() || `${name} | Saitronics Uttarpara`,
      metaDescription: metaDescription.trim() || shortDescription.trim(),
      tags: [brand, category, isNewLaunch ? 'New Launch' : '', 'Showroom Stock'].filter(Boolean),
      stockAdjustments: product?.stockAdjustments || [
        {
          id: `adj-init-${Date.now()}`,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          change: stockCount,
          reason: 'Restock',
          resultingQuantity: stockCount,
          note: 'Initial catalog creation',
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    onSaved(savedProduct);
    setIsDirty(false);
    toast.success(`${savedProduct.name} saved successfully.`);
    onClose();
  };

  const handleCloseAttempt = () => {
    if (isDirty) {
      if (confirm('You have unsaved changes. Are you sure you want to discard them?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  const discountPercent = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex">
      {/* Backdrop */}
      <div 
        onClick={handleCloseAttempt}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
      />

      {/* Editor Modal / Drawer */}
      <div className="relative ml-auto w-full max-w-5xl 2xl:max-w-6xl bg-[#0C0C0C] border-l border-white/[0.1] h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-200">
        {/* Header Bar */}
        <div className="h-16 px-6 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-[#121212]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#E50924]/20 to-[#E50924]/5 text-[#E50924] border border-[#E50924]/30 shadow-lg shadow-[#E50924]/10 shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight truncate">
                  {product ? `Edit: ${product.name}` : 'Create New Device'}
                </h2>
                {status === 'published' ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    Published
                  </span>
                ) : status === 'draft' ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                    Draft
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-500/10 text-neutral-400 border border-neutral-500/20 shrink-0">
                    Archived
                  </span>
                )}
                {isDirty && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E50924]/15 text-[#FF3048] border border-[#E50924]/30 shrink-0 animate-pulse">
                    Unsaved
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#8E8E93] truncate">
                Full product specifications, pricing, gallery and live storefront sync
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleCloseAttempt}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#8E8E93] hover:text-white border border-white/[0.06] transition-colors cursor-pointer"
              title="Close editor"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#E50924] hover:bg-[#C8081F] text-white text-xs font-semibold tracking-wide transition-all shadow-lg shadow-[#E50924]/20 cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Product</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation (Zero ugly OS scrollbars, sleek luxury indicator) */}
        <div className="flex items-center px-4 sm:px-6 border-b border-white/[0.08] bg-[#0E0E0E] overflow-x-auto scrollbar-none scrollbar-hide no-scrollbar shrink-0 gap-1">
          {[
            { id: 'basics', label: 'Basics', icon: Tag },
            { id: 'pricing', label: 'Pricing & Stock', icon: DollarSign },
            { id: 'variants', label: 'Variants', icon: Layers },
            { id: 'colors', label: 'Colours', icon: Palette },
            { id: 'images', label: `Images (${images.length})`, icon: ImageIcon },
            { id: 'specs', label: 'Specifications', icon: Sliders },
            { id: 'highlights', label: 'Highlights', icon: Sparkles },
            { id: 'merchandising', label: 'Merchandising', icon: Star },
            { id: 'seo', label: 'SEO & Preview', icon: Eye },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative flex items-center gap-2 py-3.5 px-3.5 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer select-none ${
                  isActive
                    ? 'text-white'
                    : 'text-[#8E8E93] hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E50924]' : 'text-[#71717A]'}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E50924] shadow-[0_0_10px_rgba(229,9,36,0.9)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 custom-scrollbar bg-[#090909]">
          {/* TAB 1: BASICS */}
          {activeTab === 'basics' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.08em] mb-1.5">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. iPhone 15 Pro Max"
                    className="w-full bg-[#121212] hover:bg-[#161616] border border-white/[0.1] hover:border-white/[0.2] focus:border-[#E50924] focus:ring-1 focus:ring-[#E50924]/30 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[#555] transition-all focus:outline-none"
                  />
                  {errors.name && <p className="text-[11px] text-[#FF4D4F] mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.08em] mb-1.5">
                    URL Slug Identifier *
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="e.g. iphone-15-pro-max"
                    className="w-full bg-[#121212] hover:bg-[#161616] border border-white/[0.1] hover:border-white/[0.2] focus:border-[#E50924] focus:ring-1 focus:ring-[#E50924]/30 rounded-lg px-4 py-2.5 text-sm text-white font-mono placeholder:text-[#555] transition-all focus:outline-none"
                  />
                  {errors.slug && <p className="text-[11px] text-[#FF4D4F] mt-1">{errors.slug}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.08em] mb-1.5">
                    Brand
                  </label>
                  <select
                    value={brand}
                    onChange={(e) => {
                      setBrand(e.target.value);
                      setIsDirty(true);
                    }}
                    className="w-full bg-[#121212] hover:bg-[#161616] border border-white/[0.1] hover:border-white/[0.2] focus:border-[#E50924] focus:ring-1 focus:ring-[#E50924]/30 rounded-lg px-4 py-2.5 text-sm text-white transition-all focus:outline-none"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.name} className="bg-[#181818] text-white">{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.08em] mb-1.5">
                    Primary Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setIsDirty(true);
                    }}
                    className="w-full bg-[#121212] hover:bg-[#161616] border border-white/[0.1] hover:border-white/[0.2] focus:border-[#E50924] focus:ring-1 focus:ring-[#E50924]/30 rounded-lg px-4 py-2.5 text-sm text-white transition-all focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug} className="bg-[#181818] text-white">{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.08em] mb-1.5">
                    Publication Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value as any);
                      setIsDirty(true);
                    }}
                    className="w-full bg-[#121212] hover:bg-[#161616] border border-white/[0.1] hover:border-white/[0.2] focus:border-[#E50924] focus:ring-1 focus:ring-[#E50924]/30 rounded-lg px-4 py-2.5 text-sm text-white transition-all focus:outline-none"
                  >
                    <option value="published" className="bg-[#181818] text-white">Published (Visible on storefront)</option>
                    <option value="draft" className="bg-[#181818] text-white">Draft (Admin eyes only)</option>
                    <option value="archived" className="bg-[#181818] text-white">Archived (Delisted from catalog)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.08em] mb-1.5">
                  Short Tagline / Punchline
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => {
                    setShortDescription(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="e.g. Titanium Architecture. A17 Pro Chip. 48MP Telephoto System."
                  className="w-full bg-[#121212] hover:bg-[#161616] border border-white/[0.1] hover:border-white/[0.2] focus:border-[#E50924] focus:ring-1 focus:ring-[#E50924]/30 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[#555] transition-all focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.08em] mb-1.5">
                  Full Luxury Overview Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Comprehensive description for detail page..."
                  className="w-full bg-[#121212] hover:bg-[#161616] border border-white/[0.1] hover:border-white/[0.2] focus:border-[#E50924] focus:ring-1 focus:ring-[#E50924]/30 rounded-lg p-4 text-sm text-white placeholder:text-[#555] transition-all focus:outline-none leading-relaxed resize-y"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & STOCK */}
          {activeTab === 'pricing' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.08em] mb-1.5">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={price || ''}
                    onChange={(e) => {
                      setPrice(Number(e.target.value));
                      setIsDirty(true);
                    }}
                    placeholder="134900"
                    className="w-full bg-[#121212] hover:bg-[#161616] border border-white/[0.1] hover:border-white/[0.2] focus:border-[#E50924] focus:ring-1 focus:ring-[#E50924]/30 rounded-lg px-4 py-2.5 text-sm text-white font-mono placeholder:text-[#555] transition-all focus:outline-none"
                  />
                  {errors.price && <p className="text-[11px] text-[#FF4D4F] mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.08em] mb-1.5">
                    Maximum Retail Price / MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={originalPrice || ''}
                    onChange={(e) => {
                      setOriginalPrice(e.target.value ? Number(e.target.value) : undefined);
                      setIsDirty(true);
                    }}
                    placeholder="159900"
                    className="w-full bg-[#121212] hover:bg-[#161616] border border-white/[0.1] hover:border-white/[0.2] focus:border-[#E50924] focus:ring-1 focus:ring-[#E50924]/30 rounded-lg px-4 py-2.5 text-sm text-white font-mono placeholder:text-[#555] transition-all focus:outline-none"
                  />
                  {errors.originalPrice && <p className="text-[11px] text-[#FF4D4F] mt-1">{errors.originalPrice}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.08em] mb-1.5">
                    Calculated Discount
                  </label>
                  <div className="w-full bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2.5 text-sm text-emerald-400 font-bold flex items-center justify-between">
                    <span>{discountPercent > 0 ? `${discountPercent}% OFF MRP` : 'No Discount'}</span>
                    {discountPercent > 0 && <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400/70">Automatic</span>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.08em] mb-1.5">
                    Showroom Stock Available
                  </label>
                  <input
                    type="number"
                    value={stockCount}
                    onChange={(e) => {
                      setStockCount(Math.max(0, Number(e.target.value)));
                      setIsDirty(true);
                    }}
                    className="w-full bg-[#121212] hover:bg-[#161616] border border-white/[0.1] hover:border-white/[0.2] focus:border-[#E50924] focus:ring-1 focus:ring-[#E50924]/30 rounded-lg px-4 py-2.5 text-sm text-white font-mono placeholder:text-[#555] transition-all focus:outline-none"
                  />
                  <p className="text-[10px] text-[#71717A] mt-1">If set to 0, storefront displays &quot;Out of Stock&quot;.</p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.08em] mb-1.5">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    value={lowStockThreshold}
                    onChange={(e) => {
                      setLowStockThreshold(Math.max(1, Number(e.target.value)));
                      setIsDirty(true);
                    }}
                    className="w-full bg-[#121212] hover:bg-[#161616] border border-white/[0.1] hover:border-white/[0.2] focus:border-[#E50924] focus:ring-1 focus:ring-[#E50924]/30 rounded-lg px-4 py-2.5 text-sm text-white font-mono placeholder:text-[#555] transition-all focus:outline-none"
                  />
                  <p className="text-[10px] text-[#71717A] mt-1">Alert triggers when count &le; this number (default 5).</p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.08em] mb-1.5">
                    Tax / Invoice Note
                  </label>
                  <input
                    type="text"
                    value={taxNote}
                    onChange={(e) => {
                      setTaxNote(e.target.value);
                      setIsDirty(true);
                    }}
                    className="w-full bg-[#121212] hover:bg-[#161616] border border-white/[0.1] hover:border-white/[0.2] focus:border-[#E50924] focus:ring-1 focus:ring-[#E50924]/30 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[#555] transition-all focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VARIANTS */}
          {activeTab === 'variants' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Storage & Hardware Configurations</h3>
                  <p className="text-xs text-[#717171]">Each option can specify individual pricing and SKU</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextId = `v${variants.length + 1}`;
                    setVariants([
                      ...variants,
                      {
                        id: nextId,
                        name: '1TB',
                        price: price + 20000,
                        originalPrice: originalPrice ? originalPrice + 20000 : undefined,
                        sku: `DEV-${nextId}`,
                        stockCount: 5,
                      },
                    ]);
                    setIsDirty(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.08]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Variant</span>
                </button>
              </div>

              <div className="space-y-3">
                {variants.map((v, i) => (
                  <div key={v.id || i} className="p-4 rounded-xl bg-[#121212] border border-white/[0.06] grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
                    <div>
                      <label className="block text-[10px] text-[#717171] uppercase mb-1">Variant Name</label>
                      <input
                        type="text"
                        value={v.name}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].name = e.target.value;
                          setVariants(updated);
                          setIsDirty(true);
                        }}
                        placeholder="256GB"
                        className="w-full bg-[#1A1A1A] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#717171] uppercase mb-1">Price (₹)</label>
                      <input
                        type="number"
                        value={v.price}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].price = Number(e.target.value);
                          setVariants(updated);
                          setIsDirty(true);
                        }}
                        className="w-full bg-[#1A1A1A] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#717171] uppercase mb-1">SKU Code</label>
                      <input
                        type="text"
                        value={v.sku}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].sku = e.target.value;
                          setVariants(updated);
                          setIsDirty(true);
                        }}
                        placeholder="SKU"
                        className="w-full bg-[#1A1A1A] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#717171] uppercase mb-1">Available Units</label>
                      <input
                        type="number"
                        value={v.stockCount}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[i].stockCount = Number(e.target.value);
                          setVariants(updated);
                          setIsDirty(true);
                        }}
                        className="w-full bg-[#1A1A1A] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                      />
                    </div>

                    <div className="flex items-center justify-end pt-4 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => {
                          setVariants(variants.filter((_, idx) => idx !== i));
                          setIsDirty(true);
                        }}
                        className="p-2 rounded-lg bg-white/[0.03] hover:bg-[#E50924]/10 text-[#666] hover:text-[#E50924] transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COLOURS */}
          {activeTab === 'colors' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Chassis & Finish Colors</h3>
                  <p className="text-xs text-[#717171]">Define hex swatches for client-side live color selector</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setColorVariants([
                      ...colorVariants,
                      { name: 'Natural Titanium', hex: '#BEBDB8', stockCount: 5 },
                    ]);
                    setIsDirty(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.08]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Finish</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {colorVariants.map((c, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-[#121212] border border-white/[0.06] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <input
                        type="color"
                        value={c.hex}
                        onChange={(e) => {
                          const updated = [...colorVariants];
                          updated[i].hex = e.target.value;
                          setColorVariants(updated);
                          setIsDirty(true);
                        }}
                        className="w-8 h-8 rounded-lg bg-transparent border border-white/20 cursor-pointer shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <input
                          type="text"
                          value={c.name}
                          onChange={(e) => {
                            const updated = [...colorVariants];
                            updated[i].name = e.target.value;
                            setColorVariants(updated);
                            setIsDirty(true);
                          }}
                          placeholder="Finish name"
                          className="w-full bg-[#1A1A1A] border border-white/[0.06] rounded-md px-2 py-1 text-xs text-white font-medium"
                        />
                        <div className="text-[10px] text-[#666] font-mono">{c.hex}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setColorVariants(colorVariants.filter((_, idx) => idx !== i));
                        setIsDirty(true);
                      }}
                      className="p-1.5 rounded-lg text-[#666] hover:text-[#E50924] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: IMAGES & GALLERY */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              {/* Image Input Options */}
              <div className="p-5 rounded-2xl bg-[#121212] border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Add Media to Gallery
                  </h3>
                  <div className="text-[11px] text-[#888]">
                    {images.length}/5 Recommended angles added
                  </div>
                </div>

                {/* URL Input */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => handleValidateUrl(e.target.value)}
                      placeholder="Paste image URL (WebP/PNG/JPG)..."
                      className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50924]"
                    />
                  </div>

                  <div>
                    <select
                      value={urlAngle}
                      onChange={(e) => setUrlAngle(e.target.value as any)}
                      className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50924]"
                    >
                      <option value="front">Front Angle</option>
                      <option value="back">Back Chassis</option>
                      <option value="side">Profile / Side</option>
                      <option value="camera">Camera Module</option>
                      <option value="detail">Macro Detail</option>
                      <option value="lifestyle">Lifestyle In-Hand</option>
                    </select>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={handleAddUrlImage}
                      disabled={!urlInput.trim()}
                      className="w-full py-2 px-3 rounded-xl bg-[#E50924] hover:bg-[#C8081F] text-white text-xs font-semibold disabled:opacity-40 transition-colors"
                    >
                      Add by URL
                    </button>
                  </div>
                </div>

                {urlPreviewSuccess === false && (
                  <p className="text-[11px] text-[#FF4D4F] flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Failed to load image preview from URL.
                  </p>
                )}

                {/* Local Canvas File Upload */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-white cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5 text-[#E50924]" />
                      <span>{isCompressing ? 'Compressing WebP...' : 'Upload Device Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="text-[11px] text-[#666]">
                    Auto-compressed to WebP &bull; Max 1400px &bull; Limit 600 KB
                  </div>
                </div>
              </div>

              {errors.images && (
                <div className="p-3 rounded-xl bg-[#E50924]/10 border border-[#E50924]/20 text-[#FF4D4F] text-xs">
                  {errors.images}
                </div>
              )}

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div
                    key={img.id || idx}
                    className={`relative rounded-xl border p-2 flex flex-col justify-between group transition-all ${
                      img.isPrimary
                        ? 'border-[#E50924] bg-[#E50924]/5 ring-1 ring-[#E50924]'
                        : 'border-white/[0.08] bg-[#121212]'
                    }`}
                  >
                    {/* Fixed aspect ratio box with object-fit: contain */}
                    <div className="relative w-full aspect-square rounded-lg bg-[#080808] overflow-hidden flex items-center justify-center mb-2">
                      <Image
                        src={img.url}
                        alt={img.alt || 'Product Image'}
                        fill
                        className="object-contain p-2"
                        unoptimized
                        onError={(e) => {
                          // Branded fallback
                          (e.target as any).src = '/products/apple/iphone-15-pro-max/front.webp';
                        }}
                      />
                      {img.isPrimary && (
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[9px] font-bold bg-[#E50924] text-white uppercase tracking-wider">
                          Primary
                        </span>
                      )}
                      <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-black/80 text-[#AAA] uppercase">
                        {img.angle}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-[#666] hover:text-white disabled:opacity-20"
                          title="Move left"
                        >
                          <ArrowUp className="w-3 h-3 -rotate-90" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, 'down')}
                          disabled={idx === images.length - 1}
                          className="p-1 text-[#666] hover:text-white disabled:opacity-20"
                          title="Move right"
                        >
                          <ArrowDown className="w-3 h-3 -rotate-90" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        {!img.isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(idx)}
                            className="text-[10px] text-[#A1A1A1] hover:text-[#E50924] font-medium"
                          >
                            Make Primary
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id)}
                          className="p-1 text-[#666] hover:text-[#FF4D4F]"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SPECIFICATIONS */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Technical Specifications Matrix</h3>
                  <p className="text-xs text-[#717171]">Key-value specifications rendered on the detail page</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.08]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Spec Row</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {specs.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={s.key}
                      onChange={(e) => handleUpdateSpec(i, 'key', e.target.value)}
                      placeholder="Specification (e.g. Display)"
                      className="w-1/3 bg-[#121212] hover:bg-[#161616] border border-white/[0.1] hover:border-white/[0.2] focus:border-[#E50924] focus:ring-1 focus:ring-[#E50924]/30 rounded-lg px-3.5 py-2 text-xs text-white transition-all focus:outline-none"
                    />
                    <input
                      type="text"
                      value={s.value}
                      onChange={(e) => handleUpdateSpec(i, 'value', e.target.value)}
                      placeholder="Value (e.g. 6.7-inch OLED 120Hz)"
                      className="flex-1 bg-[#121212] hover:bg-[#161616] border border-white/[0.1] hover:border-white/[0.2] focus:border-[#E50924] focus:ring-1 focus:ring-[#E50924]/30 rounded-lg px-3.5 py-2 text-xs text-white transition-all focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteSpec(i)}
                      className="p-2 text-[#71717A] hover:text-[#FF4D4F] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: HIGHLIGHTS */}
          {activeTab === 'highlights' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white">Editorial Highlights & Badges</h3>
                <p className="text-xs text-[#717171]">Curated bullet points presented prominently on the product page</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddHighlight();
                    }
                  }}
                  placeholder="e.g. 5x Optical Telephoto Lens with Sensor Shift..."
                  className="flex-1 bg-[#121212] hover:bg-[#161616] border border-white/[0.1] hover:border-white/[0.2] focus:border-[#E50924] focus:ring-1 focus:ring-[#E50924]/30 rounded-lg px-4 py-2.5 text-xs text-white placeholder:text-[#555] transition-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="btn-primary py-2.5 px-4 text-xs font-semibold rounded-lg"
                >
                  Add Bullet
                </button>
              </div>

              <div className="space-y-2">
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 rounded-lg bg-[#121212] border border-white/[0.08]">
                    <div className="flex items-center gap-2.5 text-xs text-[#D4D4D8]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E50924]" />
                      <span>{h}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteHighlight(i)}
                      className="p-1 text-[#71717A] hover:text-[#FF4D4F] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: MERCHANDISING FLAGS */}
          {activeTab === 'merchandising' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white">Homepage Merchandising & Curation</h3>
                <p className="text-xs text-[#717171]">Toggle device placement across storefront landing sections</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="p-4 rounded-xl bg-[#121212] border border-white/[0.08] hover:border-white/[0.15] flex items-center justify-between cursor-pointer transition-colors">
                  <div>
                    <span className="text-xs font-bold text-white block">New Launch Flag</span>
                    <span className="text-[11px] text-[#8E8E93]">Displays in the New Launches section</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isNewLaunch}
                    onChange={(e) => {
                      setIsNewLaunch(e.target.checked);
                      setIsDirty(true);
                    }}
                    className="w-4 h-4 accent-[#E50924] cursor-pointer"
                  />
                </label>

                <label className="p-4 rounded-xl bg-[#121212] border border-white/[0.08] hover:border-white/[0.15] flex items-center justify-between cursor-pointer transition-colors">
                  <div>
                    <span className="text-xs font-bold text-white block">Hero Banner Presentation</span>
                    <span className="text-[11px] text-[#8E8E93]">Available for hero slide spotlight</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showInHero}
                    onChange={(e) => {
                      setShowInHero(e.target.checked);
                      setIsDirty(true);
                    }}
                    className="w-4 h-4 accent-[#E50924] cursor-pointer"
                  />
                </label>

                <label className="p-4 rounded-xl bg-[#121212] border border-white/[0.08] hover:border-white/[0.15] flex items-center justify-between cursor-pointer transition-colors">
                  <div>
                    <span className="text-xs font-bold text-white block">Featured Device</span>
                    <span className="text-[11px] text-[#8E8E93]">Pinned on catalog recommendations</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => {
                      setIsFeatured(e.target.checked);
                      setIsDirty(true);
                    }}
                    className="w-4 h-4 accent-[#E50924] cursor-pointer"
                  />
                </label>

                <label className="p-4 rounded-xl bg-[#121212] border border-white/[0.08] hover:border-white/[0.15] flex items-center justify-between cursor-pointer transition-colors">
                  <div>
                    <span className="text-xs font-bold text-white block">Best Seller Badge</span>
                    <span className="text-[11px] text-[#8E8E93]">Shows luxury bestseller badge</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => {
                      setIsBestSeller(e.target.checked);
                      setIsDirty(true);
                    }}
                    className="w-4 h-4 accent-[#E50924] cursor-pointer"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.08em] mb-1.5">
                    Curated Collection
                  </label>
                  <select
                    value={collection}
                    onChange={(e) => {
                      setCollection(e.target.value);
                      setIsDirty(true);
                    }}
                    className="w-full bg-[#121212] hover:bg-[#161616] border border-white/[0.1] hover:border-white/[0.2] focus:border-[#E50924] focus:ring-1 focus:ring-[#E50924]/30 rounded-lg px-4 py-2.5 text-sm text-white transition-all focus:outline-none"
                  >
                    <option value="flagship" className="bg-[#181818] text-white">Flagship Smartphones</option>
                    <option value="everyday" className="bg-[#181818] text-white">Everyday Essentials</option>
                    <option value="audio" className="bg-[#181818] text-white">Premium Audio</option>
                    <option value="smart-living" className="bg-[#181818] text-white">Smart Living & Wearables</option>
                    <option value="accessories" className="bg-[#181818] text-white">Accessories & Peripherals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.08em] mb-1.5">
                    Sort Order Priority
                  </label>
                  <input
                    type="number"
                    value={collectionOrder || ''}
                    onChange={(e) => {
                      setCollectionOrder(e.target.value ? Number(e.target.value) : undefined);
                      setIsDirty(true);
                    }}
                    placeholder="1 (Highest priority)"
                    className="w-full bg-[#121212] hover:bg-[#161616] border border-white/[0.1] hover:border-white/[0.2] focus:border-[#E50924] focus:ring-1 focus:ring-[#E50924]/30 rounded-lg px-4 py-2.5 text-sm text-white font-mono placeholder:text-[#555] transition-all focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SEO & PREVIEW */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.08em] mb-1.5">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => {
                      setMetaTitle(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder={`${name || 'Product'} | Saitronics Showroom`}
                    className="w-full bg-[#121212] hover:bg-[#161616] border border-white/[0.1] hover:border-white/[0.2] focus:border-[#E50924] focus:ring-1 focus:ring-[#E50924]/30 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-[#555] transition-all focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.08em] mb-1.5">
                    Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={metaDescription}
                    onChange={(e) => {
                      setMetaDescription(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="Search engine summary..."
                    className="w-full bg-[#121212] hover:bg-[#161616] border border-white/[0.1] hover:border-white/[0.2] focus:border-[#E50924] focus:ring-1 focus:ring-[#E50924]/30 rounded-lg p-3.5 text-sm text-white placeholder:text-[#555] transition-all focus:outline-none resize-y"
                  />
                </div>
              </div>

              {/* Live Preview Card Mirroring Storefront ProductCard */}
              <div className="pt-4 border-t border-white/[0.08]">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                  Live Storefront Card Preview
                </h4>
                <div className="max-w-xs mx-auto p-4 rounded-2xl bg-[#0F0F0F] border border-white/[0.08] shadow-2xl">
                  <div className="relative aspect-square w-full rounded-xl bg-[#080808] overflow-hidden mb-3 flex items-center justify-center">
                    <Image
                      src={images[0]?.url || '/products/apple/iphone-15-pro-max/front.webp'}
                      alt={name || 'Preview'}
                      fill
                      className="object-contain p-4"
                      unoptimized
                    />
                    {isNewLaunch && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#E50924] text-white uppercase">
                        New Launch
                      </span>
                    )}
                  </div>

                  <div className="text-[10px] text-[#717171] uppercase font-bold tracking-wider">
                    {brand || 'Brand'} &bull; {category || 'Category'}
                  </div>
                  <h5 className="text-sm font-bold text-white truncate mt-0.5">
                    {name || 'Device Title'}
                  </h5>
                  <p className="text-[11px] text-[#888] line-clamp-1 mt-1">
                    {shortDescription || 'Short specification highlights'}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-black text-white">
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      {originalPrice && originalPrice > price && (
                        <span className="text-xs text-[#666] line-through ml-2">
                          ₹{originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      {stockCount > 0 ? `${stockCount} in stock` : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
