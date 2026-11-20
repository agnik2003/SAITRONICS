'use client';

import { useState, useEffect, useCallback, useRef, TouchEvent } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn, X, Maximize2 } from 'lucide-react';
import { ProductImage, ColorVariant } from '@/types';
import { FALLBACK_PRODUCT_IMAGE } from '@/data/productImages';
import ImageZoom from './ImageZoom';

interface ProductGalleryProps {
  images: ProductImage[];
  colorVariants?: ColorVariant[];
  selectedColor?: string;
  productName: string;
}

export default function ProductGallery({
  images: defaultImages,
  colorVariants,
  selectedColor,
  productName,
}: ProductGalleryProps) {
  // Determine active images based on selected color variant
  const activeImages: ProductImage[] = (() => {
    if (selectedColor && colorVariants) {
      const variant = colorVariants.find(v => v.name === selectedColor);
      if (variant && variant.images && variant.images.length > 0) return variant.images;
    }
    return defaultImages && defaultImages.length > 0
      ? defaultImages
      : [{ id: 'fallback', url: FALLBACK_PRODUCT_IMAGE, alt: productName, angle: 'front' }];
  })();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomMode, setIsZoomMode] = useState(false);
  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});

  // Touch swipe state
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Reset index when color switches
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedColor]);

  // Lock body scroll when fullscreen lightbox is open
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  const prev = useCallback(() => {
    setActiveIndex(i => (i === 0 ? activeImages.length - 1 : i - 1));
  }, [activeImages.length]);

  const next = useCallback(() => {
    setActiveIndex(i => (i === activeImages.length - 1 ? 0 : i + 1));
  }, [activeImages.length]);

  // Keyboard navigation in fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') {
        setIsFullscreen(false);
        setIsZoomMode(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isFullscreen, activeIndex, activeImages.length, prev, next]);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else prev();
    }
  };

  const currentImage = activeImages[activeIndex] || activeImages[0];
  const currentUrl = imgErrorMap[currentImage.id] ? FALLBACK_PRODUCT_IMAGE : currentImage.url;

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4">
      {/* Vertical Thumbnails List on Desktop (Horizontal on Mobile) */}
      {activeImages.length > 1 && (
        <div className="flex flex-row sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:max-h-[560px] pb-2 sm:pb-0 scrollbar-hide">
          {activeImages.map((img, i) => {
            const isSelected = i === activeIndex;
            const thumbUrl = imgErrorMap[img.id] ? FALLBACK_PRODUCT_IMAGE : img.url;
            return (
              <button
                key={img.id}
                onClick={() => setActiveIndex(i)}
                className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-[4px] overflow-hidden bg-[#141414] transition-all duration-200 focus:outline-none cursor-pointer ${
                  isSelected
                    ? 'border-2 border-[#E50924] shadow-md shadow-[#E50924]/20'
                    : 'border border-white/[0.08] opacity-60 hover:opacity-100 hover:border-white/30'
                }`}
                aria-label={`View ${img.angle} angle`}
              >
                <Image
                  src={thumbUrl}
                  alt={img.alt}
                  fill
                  className="object-contain p-1.5"
                  sizes="80px"
                  onError={() => setImgErrorMap(prev => ({ ...prev, [img.id]: true }))}
                  unoptimized
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Showcase Stage */}
      <div
        className="relative flex-1 aspect-square bg-gradient-to-b from-[#141414] to-[#0A0A0A] border border-white/[0.08] rounded-[4px] overflow-hidden group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Subtle Ambient Red Glow behind hero product */}
        <div className="absolute inset-0 bg-radial-red opacity-80 pointer-events-none" />

        {/* Counter Badge */}
        <div className="absolute top-3.5 left-3.5 z-10 px-2.5 py-1 rounded-[2px] bg-black/70 backdrop-blur-md border border-white/[0.08] text-white font-mono text-[10px] font-bold">
          {activeIndex + 1} / {activeImages.length}
        </div>

        {/* Fullscreen Expand Action */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-[4px] bg-black/70 backdrop-blur-md border border-white/[0.08] text-[#B8B8B8] hover:text-white flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
          aria-label="Full screen viewer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        {/* Angle Tag */}
        <div className="absolute bottom-3.5 left-3.5 z-10 px-2.5 py-0.5 rounded-[2px] bg-black/70 backdrop-blur-md border border-white/[0.08] text-[#FF3048] text-[10px] font-bold uppercase tracking-[0.14em]">
          {currentImage.angle || 'Front View'}
        </div>

        {/* Zoom Hint */}
        <div className="absolute bottom-3.5 right-3.5 z-10 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-black/70 backdrop-blur-md border border-white/[0.08] text-[#858585] text-[10px] uppercase tracking-wider font-semibold">
          <ZoomIn className="w-3 h-3 text-[#E50924]" />
          <span>Hover to zoom (2x)</span>
        </div>

        {/* Main Image with Zoom on Desktop */}
        <div className="w-full h-full p-8 flex items-center justify-center">
          <ImageZoom
            src={currentUrl}
            alt={currentImage.alt}
            zoomScale={2.2}
          />
        </div>

        {/* Previous / Next Controls */}
        {activeImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/80 backdrop-blur-md border border-white/[0.1] text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:border-[#E50924] cursor-pointer"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/80 backdrop-blur-md border border-white/[0.1] text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:border-[#E50924] cursor-pointer"
              aria-label="Next Image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* ===================== FULLSCREEN LIGHTBOX MODAL ===================== */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col p-4 sm:p-6 animate-in fade-in duration-200"
          role="dialog"
          aria-label={`${productName} Lightbox Gallery`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div>
              <p className="text-white font-heading font-bold text-base sm:text-lg">{productName}</p>
              <p className="text-xs text-[#858585] font-mono mt-0.5">
                0{activeIndex + 1} / 0{activeImages.length} • Angle: <span className="text-[#E50924] uppercase font-semibold">{currentImage.angle}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsZoomMode(z => !z)}
                className={`px-3 py-1.5 rounded-[4px] text-[11px] font-bold uppercase tracking-[0.14em] border transition-all cursor-pointer ${
                  isZoomMode
                    ? 'bg-[#E50924] text-white border-[#E50924]'
                    : 'bg-white/5 border-white/[0.1] text-white hover:bg-white/10'
                }`}
              >
                {isZoomMode ? 'Zoom 3x (Active)' : 'Enable 3x Zoom'}
              </button>
              <button
                onClick={() => { setIsFullscreen(false); setIsZoomMode(false); }}
                className="w-9 h-9 rounded-[4px] bg-white/[0.08] hover:bg-[#E50924] text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Stage */}
          <div
            className="flex-1 relative flex items-center justify-center my-4 overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {isZoomMode ? (
              <ImageZoom src={currentUrl} alt={currentImage.alt} zoomScale={3.2} />
            ) : (
              <div className="relative w-full h-full max-h-[75vh]">
                <Image
                  src={currentUrl}
                  alt={currentImage.alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  unoptimized
                  priority
                />
              </div>
            )}

            {/* Navigation Chevrons */}
            {activeImages.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-[#E50924] hover:border-[#E50924] transition-all cursor-pointer"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-[#E50924] hover:border-[#E50924] transition-all cursor-pointer"
                  aria-label="Next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          <div className="flex items-center justify-center gap-2.5 overflow-x-auto py-2 scrollbar-hide border-t border-white/[0.06]">
            {activeImages.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveIndex(i)}
                className={`relative w-12 h-12 rounded-[4px] overflow-hidden border transition-all cursor-pointer ${
                  i === activeIndex
                    ? 'border-2 border-[#E50924] scale-105 shadow-md shadow-[#E50924]/40'
                    : 'border-white/[0.08] opacity-50 hover:opacity-100'
                }`}
              >
                <Image src={img.url} alt={img.alt} fill className="object-contain p-1" sizes="48px" unoptimized />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
