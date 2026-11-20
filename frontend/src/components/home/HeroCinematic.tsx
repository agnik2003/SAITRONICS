'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteContentStore } from '@/store/siteContentStore';
import { useHeroTilt } from '@/hooks/useHeroTilt';
import { useAutoAdvance } from '@/hooks/useAutoAdvance';
import HeroStage3D from './HeroStage3D';
import HeroTextEditorial from './HeroTextEditorial';

export default function HeroCinematic() {
  const siteContent = useSiteContentStore((state) => state.content);
  const rawSlides = siteContent?.heroSlides;
  const heroSlides = React.useMemo(() => {
    return rawSlides?.filter((s) => s.isActive) || [];
  }, [rawSlides]);

  const [pulseKey, setPulseKey] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const heroContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-advance hook (6.5s interval with rapid-click prevention & progress tracking)
  const {
    activeSlide,
    progress,
    isTransitioning,
    changeSlide,
    nextSlide,
    prevSlide,
  } = useAutoAdvance({
    totalSlides: heroSlides.length,
    intervalMs: 6500,
    transitionDurationMs: 500,
    isPaused: false, // Never freeze on mouse hover
    onAdvance: () => setPulseKey((k) => k + 1),
  });

  const currentHero = heroSlides[activeSlide] || heroSlides[0];

  // 3D Tilt and Parallax Physics hook
  const { tilt, onPointerMove, onPointerEnter, onPointerLeave } = useHeroTilt({
    maxTiltX: 8,
    maxTiltY: 12,
    baseTilt: currentHero?.stageTilt || { x: -6, y: 16 },
  });

  // Preload next slide's image
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const nextIdx = (activeSlide + 1) % heroSlides.length;
    const nextImg = heroSlides[nextIdx]?.image;
    if (nextImg && typeof window !== 'undefined') {
      const img = new window.Image();
      img.src = nextImg;
    }
  }, [activeSlide, heroSlides]);

  // Keyboard arrow controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Mobile Touch Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current !== null) {
      const diff = touchStartXRef.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
    }
    touchStartXRef.current = null;
  };

  if (!currentHero) return null;

  const glowColor = currentHero.glowColor || '#E50924';

  return (
    <section
      ref={heroContainerRef}
      className="relative min-h-[500px] xs:min-h-[560px] sm:min-h-[640px] lg:min-h-[720px] 2xl:min-h-[780px] flex items-center justify-center overflow-hidden border-b border-white/[0.08] bg-[#090909] select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Flagship Cinematic 3D Showcase"
    >
      {/* ============================================================ */}
      {/* 1. BACKGROUND AMBIENCE: SLOW DRIFTING RADIAL GLOW & GRAIN   */}
      {/* ============================================================ */}
      {/* Slow 12s Floating Ambient Radial Light */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[680px] lg:w-[920px] h-[380px] sm:h-[680px] lg:h-[920px] pointer-events-none blur-[90px] opacity-40 transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, rgba(229, 9, 36, 0.15) 45%, transparent 70%)`,
          animation: tilt.reducedMotion ? 'none' : 'ambientDrift 12s ease-in-out infinite alternate',
        }}
      />

      {/* Cinematic Soft Light Pulse on Slide Change */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`pulse-${pulseKey}`}
          initial={{ opacity: 0.14 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 70% 50%, ${glowColor} 0%, transparent 60%)`,
          }}
        />
      </AnimatePresence>

      {/* 3% Film Grain Atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* ============================================================ */}
      {/* 2. MAIN SHOWCASE CONTENT (SIDE-BY-SIDE RESPONSIVE GRID)      */}
      {/* ============================================================ */}
      <div className="container-custom py-8 sm:py-12 lg:py-16 relative z-10 w-full">
        <div className="grid grid-cols-12 gap-4 xs:gap-6 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Editorial Mask-Reveal Typography */}
          <div className="col-span-12 md:col-span-7 lg:col-span-7 order-2 md:order-1">
            <HeroTextEditorial
              slide={currentHero}
              slideIndex={activeSlide}
              reducedMotion={tilt.reducedMotion}
            />
          </div>

          {/* RIGHT COLUMN: 3D Layered Device Stage */}
          <div className="col-span-12 md:col-span-5 lg:col-span-5 order-1 md:order-2 flex items-center justify-center">
            <HeroStage3D
              slide={currentHero}
              slideIndex={activeSlide}
              tilt={tilt}
              onPointerMove={onPointerMove}
              onPointerEnter={onPointerEnter}
              onPointerLeave={onPointerLeave}
            />
          </div>

          {/* ============================================================ */}
          {/* 3. BOTTOM CINEMATIC CONTROLS (COUNTER, PROGRESS, BUTTONS)    */}
          {/* ============================================================ */}
          {heroSlides.length > 1 && (
            <div className="col-span-12 order-3 pt-6 sm:pt-8 border-t border-white/[0.08] flex items-center justify-between gap-4 sm:gap-8">
              
              {/* VERTICAL ROLLING NUMBER COUNTER */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-mono shrink-0">
                <div className="h-5 sm:h-6 overflow-hidden relative w-6 text-center">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={activeSlide}
                      initial={{ y: 16, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -16, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="block font-bold text-white tabular-nums"
                    >
                      {String(activeSlide + 1).padStart(2, '0')}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span className="text-white/20">/</span>
                <span className="text-[#858585] tabular-nums">
                  {String(heroSlides.length).padStart(2, '0')}
                </span>
              </div>

              {/* SEGMENTED LINEAR PROGRESS BARS */}
              <div className="flex items-center gap-2 flex-1 max-w-[240px] sm:max-w-[420px]">
                {heroSlides.map((slide, idx) => {
                  const isCurrent = idx === activeSlide;
                  const isPast = idx < activeSlide;

                  return (
                    <button
                      key={slide.id || idx}
                      onClick={() => changeSlide(idx)}
                      disabled={isTransitioning && isCurrent}
                      aria-label={`Switch to slide ${idx + 1}`}
                      className="relative flex-1 h-1 sm:h-1.5 rounded-full overflow-hidden bg-white/10 hover:bg-white/25 transition-colors cursor-pointer group"
                    >
                      {isPast && (
                        <div className="h-full w-full bg-[#E50924]" />
                      )}
                      {isCurrent && (
                        <div
                          className="h-full bg-[#E50924] rounded-full will-change-[width]"
                          style={{
                            width: `${progress * 100}%`,
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* PREV / NEXT CIRCULAR BUTTONS */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={prevSlide}
                  disabled={isTransitioning}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/[0.15] bg-[#141414] hover:bg-[#E50924] hover:border-[#E50924] active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                </button>
                <button
                  onClick={nextSlide}
                  disabled={isTransitioning}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/[0.15] bg-[#141414] hover:bg-[#E50924] hover:border-[#E50924] active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Embedded Ambient Drifting Keyframe Styles */}
      <style jsx>{`
        @keyframes ambientDrift {
          0% {
            transform: translate(-50%, -50%) translate3d(-15px, -10px, 0);
          }
          100% {
            transform: translate(-50%, -50%) translate3d(15px, 15px, 0);
          }
        }
      `}</style>
    </section>
  );
}
