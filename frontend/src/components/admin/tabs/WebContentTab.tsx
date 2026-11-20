'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Globe, Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, 
  Save, RotateCcw, Sparkles, Layers, Sliders, ExternalLink, 
  X, Check 
} from 'lucide-react';
import { HeroSlide, SiteContent } from '@/types';
import { useSiteContentStore } from '@/store/siteContentStore';
import toast from 'react-hot-toast';

export default function WebContentTab() {
  const content = useSiteContentStore((state) => state.content);
  const updateAnnouncementBar = useSiteContentStore((state) => state.updateAnnouncementBar);
  const addHeroSlide = useSiteContentStore((state) => state.addHeroSlide);
  const updateHeroSlide = useSiteContentStore((state) => state.updateHeroSlide);
  const deleteHeroSlide = useSiteContentStore((state) => state.deleteHeroSlide);
  const reorderHeroSlides = useSiteContentStore((state) => state.reorderHeroSlides);
  const toggleSectionVisibility = useSiteContentStore((state) => state.toggleSectionVisibility);
  const resetSection = useSiteContentStore((state) => state.resetSection);

  // Announcement Bar State
  const [announcementText, setAnnouncementText] = useState(content.announcementBar?.text || '');
  const [announcementLink, setAnnouncementLink] = useState(content.announcementBar?.link || '');
  const [announcementVisible, setAnnouncementVisible] = useState(content.announcementBar?.isVisible ?? true);

  // Hero Slide Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  // Slide Form
  const [eyebrow, setEyebrow] = useState('');
  const [brand, setBrand] = useState('Apple');
  const [title, setTitle] = useState('');
  const [highlight, setHighlight] = useState('Titanium Architecture');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('₹1,34,900');
  const [originalPrice, setOriginalPrice] = useState('₹1,59,900');
  const [discount, setDiscount] = useState('16% OFF');
  const [slug, setSlug] = useState('iphone-15-pro-max');
  const [image, setImage] = useState('/products/apple/iphone-15-pro-max/front.webp');
  const [badgeDisplay, setBadgeDisplay] = useState('6.7" Super Retina XDR');
  const [badgeCamera, setBadgeCamera] = useState('48MP 5x Optical Telephoto');
  const [buttonText, setButtonText] = useState('Order Flagship');
  const [buttonLink, setButtonLink] = useState('/products/iphone-15-pro-max');
  const [glowColor, setGlowColor] = useState('#E50924');
  const [isActive, setIsActive] = useState(true);

  // Save Announcement
  const handleSaveAnnouncement = () => {
    updateAnnouncementBar({
      text: announcementText.trim(),
      link: announcementLink.trim() || undefined,
      isVisible: announcementVisible,
    });
    toast.success('Announcement bar updated on live storefront.');
  };

  // Open Slide Add
  const handleOpenAddSlide = () => {
    setEditingSlide(null);
    setEyebrow('FLAGSHIP SPOTLIGHT');
    setBrand('Apple');
    setTitle('iPhone 15 Pro Max');
    setHighlight('Forged in Titanium');
    setSubtitle('A17 Pro & 48MP Telephoto System');
    setDescription('Aerospace-grade titanium design. Powered by the groundbreaking A17 Pro.');
    setPrice('₹1,34,900');
    setOriginalPrice('₹1,59,900');
    setDiscount('16% OFF');
    setSlug('iphone-15-pro-max');
    setImage('/products/apple/iphone-15-pro-max/front.webp');
    setBadgeDisplay('6.7" Super Retina XDR');
    setBadgeCamera('48MP 5x Optical Telephoto');
    setButtonText('Order Flagship');
    setButtonLink('/products/iphone-15-pro-max');
    setGlowColor('#E50924');
    setIsActive(true);
    setModalOpen(true);
  };

  // Open Slide Edit
  const handleOpenEditSlide = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setEyebrow(slide.eyebrow);
    setBrand(slide.brand || 'Apple');
    setTitle(slide.title);
    setHighlight(slide.highlight || '');
    setSubtitle(slide.subtitle || '');
    setDescription(slide.description || '');
    setPrice(slide.price);
    setOriginalPrice(slide.originalPrice || '');
    setDiscount(slide.discount || '');
    setSlug(slide.slug);
    setImage(slide.image);
    setBadgeDisplay(slide.badgeDisplay || '');
    setBadgeCamera(slide.badgeCamera || '');
    setButtonText(slide.buttonText || 'Order Flagship');
    setButtonLink(slide.buttonLink || `/products/${slide.slug}`);
    setGlowColor(slide.glowColor || '#E50924');
    setIsActive(slide.isActive !== false);
    setModalOpen(true);
  };

  // Save Slide
  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image.trim()) {
      toast.error('Title and Product Image URL are required.');
      return;
    }

    const slideData: HeroSlide = {
      id: editingSlide ? editingSlide.id : `slide-${slug.toLowerCase()}-${Date.now()}`,
      eyebrow: eyebrow.trim(),
      brand: brand.trim(),
      title: title.trim(),
      highlight: highlight.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      price: price.trim(),
      originalPrice: originalPrice.trim() || undefined,
      discount: discount.trim() || undefined,
      slug: slug.trim(),
      image: image.trim(),
      badgeDisplay: badgeDisplay.trim(),
      badgeCamera: badgeCamera.trim(),
      specs: [badgeDisplay.trim(), badgeCamera.trim()].filter(Boolean),
      buttonText: buttonText.trim(),
      buttonLink: buttonLink.trim(),
      glowColor,
      isActive,
      order: editingSlide ? editingSlide.order : content.heroSlides.length + 1,
    };

    if (editingSlide) {
      updateHeroSlide(editingSlide.id, slideData);
      toast.success('Hero slide updated.');
    } else {
      addHeroSlide(slideData);
      toast.success('New hero slide added.');
    }
    setModalOpen(false);
  };

  // Reorder Slide
  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= content.heroSlides.length) return;
    const reordered = [...content.heroSlides];
    const temp = reordered[index];
    reordered[index] = reordered[target];
    reordered[target] = temp;
    reorderHeroSlides(reordered);
    toast.success('Hero slide order updated.');
  };

  // Reset defaults
  const handleResetDefaults = () => {
    if (confirm('Reset homepage layout, hero slides, and banners to showroom factory defaults?')) {
      resetSection('all');
      toast.success('Homepage content reset to defaults.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08]">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Storefront Homepage Curator
          </h2>
          <p className="text-xs text-[#717171]">
            Curate hero carousel slides, top announcement marquee, and section visibility
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white text-xs font-semibold border border-white/[0.08] transition-all self-start sm:self-auto"
        >
          <RotateCcw className="w-4 h-4 text-[#A1A1A1]" />
          <span>Reset to Defaults</span>
        </button>
      </div>

      {/* Announcement Bar Editor */}
      <div className="p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#E50924]/10 text-[#E50924]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Top Announcement Marquee
              </h3>
              <p className="text-[11px] text-[#717171]">Fixed notification bar above navigation</p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs text-[#888]">Enable</span>
            <input
              type="checkbox"
              checked={announcementVisible}
              onChange={(e) => setAnnouncementVisible(e.target.checked)}
              className="w-4 h-4 accent-[#E50924]"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-[10px] text-[#888] uppercase mb-1">Announcement Message</label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="e.g. AUTHORIZED BRAND STORE &bull; VISIT SHOWROOM"
              className="w-full bg-[#141414] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50924]"
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#888] uppercase mb-1">Target Link URL</label>
            <input
              type="text"
              value={announcementLink}
              onChange={(e) => setAnnouncementLink(e.target.value)}
              placeholder="e.g. /products or /showroom"
              className="w-full bg-[#141414] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50924]"
            />
          </div>
        </div>

        <button
          onClick={handleSaveAnnouncement}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E50924] hover:bg-[#C8081F] text-white text-xs font-semibold"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Marquee</span>
        </button>
      </div>

      {/* Hero Slides Carousel Manager */}
      <div className="p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Hero Showcase Carousel ({content.heroSlides.length} Slides)
              </h3>
              <p className="text-[11px] text-[#717171]">The primary rotating spotlight on the storefront</p>
            </div>
          </div>

          <button
            onClick={handleOpenAddSlide}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.08]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Slide</span>
          </button>
        </div>

        {/* Slides List */}
        <div className="space-y-3">
          {content.heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                slide.isActive !== false
                  ? 'bg-[#121212] border-white/[0.08]'
                  : 'bg-[#0A0A0A] border-white/[0.03] opacity-60'
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-16 h-16 rounded-xl bg-[#080808] border border-white/[0.06] overflow-hidden shrink-0 flex items-center justify-center">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>

                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-[#E50924] uppercase tracking-widest block">
                    {slide.eyebrow}
                  </span>
                  <h4 className="text-sm font-bold text-white truncate">{slide.title}</h4>
                  <p className="text-xs text-[#888] truncate max-w-md">{slide.subtitle}</p>
                </div>
              </div>

              {/* Slide Controls */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => handleMoveSlide(index, 'up')}
                  disabled={index === 0}
                  className="p-1.5 rounded-lg text-[#666] hover:text-white disabled:opacity-20"
                  title="Move slide earlier"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMoveSlide(index, 'down')}
                  disabled={index === content.heroSlides.length - 1}
                  className="p-1.5 rounded-lg text-[#666] hover:text-white disabled:opacity-20"
                  title="Move slide later"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                <button
                  onClick={() => updateHeroSlide(slide.id, { isActive: !slide.isActive })}
                  className="p-1.5 rounded-lg text-[#717171] hover:text-white"
                  title={slide.isActive !== false ? 'Hide slide' : 'Show slide'}
                >
                  {slide.isActive !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => handleOpenEditSlide(slide)}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Delete slide "${slide.title}"?`)) {
                      deleteHeroSlide(slide.id);
                      toast.success('Slide removed.');
                    }
                  }}
                  className="p-1.5 rounded-lg text-[#666] hover:text-[#FF4D4F]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Visibility Switches */}
      <div className="p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.08] space-y-4">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Homepage Section Visibility
          </h3>
          <p className="text-[11px] text-[#717171]">Toggle layout sections on the live storefront</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { key: 'announcementBar', label: 'Top Announcement Marquee' },
            { key: 'hero', label: 'Hero Showcase Carousel' },
            { key: 'trustServices', label: 'Authorized Showroom Badges' },
            { key: 'categories', label: 'Device Category Tiles' },
            { key: 'newLaunches', label: 'New Launches Spotlight' },
            { key: 'collections', label: 'Curated Collections' },
            { key: 'bestsellers', label: 'Bestseller Devices' },
            { key: 'audioBanner', label: 'Audio Spotlight Banner' },
            { key: 'showroom', label: 'Showroom Visit Experience' },
          ].map((sec) => (
            <label
              key={sec.key}
              className="p-3.5 rounded-xl bg-[#141414] border border-white/[0.04] flex items-center justify-between cursor-pointer"
            >
              <span className="text-xs font-semibold text-white">{sec.label}</span>
              <input
                type="checkbox"
                checked={content.sectionsVisibility?.[sec.key as keyof SiteContent['sectionsVisibility']] ?? true}
                onChange={() => {
                  toggleSectionVisibility(sec.key as keyof SiteContent['sectionsVisibility']);
                  toast.success(`Section ${sec.label} updated.`);
                }}
                className="w-4 h-4 accent-[#E50924]"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Slide Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-lg bg-[#121212] border border-white/[0.1] rounded-2xl p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                {editingSlide ? 'Edit Hero Slide' : 'Create Hero Slide'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#666] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                    Eyebrow Tag
                  </label>
                  <input
                    type="text"
                    value={eyebrow}
                    onChange={(e) => setEyebrow(e.target.value)}
                    placeholder="e.g. TITANIUM REVOLUTION"
                    className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50924]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Apple"
                    className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E50924]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                  Headline Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. iPhone 15 Pro Max"
                  required
                  className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-[#E50924]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                  Subheadline Description
                </label>
                <textarea
                  rows={2}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Supporting luxury description..."
                  className="w-full bg-[#181818] border border-white/[0.08] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#E50924]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                  Device Image URL (Transparent WebP) *
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/products/apple/iphone-15-pro-max/front.webp"
                  required
                  className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#E50924]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                    Display Badge Spec
                  </label>
                  <input
                    type="text"
                    value={badgeDisplay}
                    onChange={(e) => setBadgeDisplay(e.target.value)}
                    placeholder='e.g. 6.7" OLED 120Hz'
                    className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                    Camera Badge Spec
                  </label>
                  <input
                    type="text"
                    value={badgeCamera}
                    onChange={(e) => setBadgeCamera(e.target.value)}
                    placeholder="e.g. 48MP Triple Lens"
                    className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                    Product URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="iphone-15-pro-max"
                    className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A1A1A1] uppercase mb-1.5">
                    Price Tag
                  </label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="₹1,34,900"
                    className="w-full bg-[#181818] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#181818] border border-white/[0.06]">
                <span className="text-xs font-semibold text-white">Active in Carousel</span>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
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
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
