'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { HeroSlide } from '@/types';

interface HeroTextEditorialProps {
  slide: HeroSlide;
  slideIndex: number;
  reducedMotion?: boolean;
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export default function HeroTextEditorial({
  slide,
  slideIndex,
  reducedMotion = false,
}: HeroTextEditorialProps) {
  // Parse numeric price for count-up animation
  const numericPrice = parseInt(slide.price?.replace(/[^0-9]/g, '') || '0', 10);
  const [displayPrice, setDisplayPrice] = useState(numericPrice);

  useEffect(() => {
    if (reducedMotion || !numericPrice) {
      setDisplayPrice(numericPrice);
      return;
    }

    const durationMs = 600;
    const startTimestamp = performance.now();
    let frameId: number;

    const animateCounter = (now: number) => {
      const elapsed = now - startTimestamp;
      const progress = Math.min(1, elapsed / durationMs);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(numericPrice * easedProgress);
      setDisplayPrice(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(animateCounter);
      }
    };

    frameId = requestAnimationFrame(animateCounter);
    return () => cancelAnimationFrame(frameId);
  }, [numericPrice, slideIndex, reducedMotion]);

  const formattedDisplayPrice = `₹${displayPrice.toLocaleString('en-IN')}`;

  // Ensure every slide features a prominent NEW LAUNCH beacon paired with its architectural tagline
  const eyebrowRaw = slide.eyebrow || 'FLAGSHIP ARCHITECTURE';
  const cleanedEyebrow = eyebrowRaw
    .replace(/NEW\s*LAUNCH/gi, '')
    .replace(/^[\s•]+|[\s•]+$/g, '')
    .trim();
  const subBadgeText = cleanedEyebrow || 'FLAGSHIP ARCHITECTURE';

  return (
    <div className="flex flex-col justify-center min-h-[400px] xs:min-h-[430px] sm:min-h-[460px] lg:min-h-[500px] text-left">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={`content-${slide.id || slideIndex}`}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={
            reducedMotion
              ? { opacity: 0 }
              : { opacity: 0, y: -14, transition: { duration: 0.28, ease: EASE_OUT } }
          }
          transition={{ duration: 0.55, ease: EASE_OUT }}
          className="space-y-3 sm:space-y-4 lg:space-y-5"
        >
          {/* 1. EYE-CATCHING NEW LAUNCH ILLUMINATED BEACON */}
          <div className="overflow-hidden">
            <motion.div
              initial={reducedMotion ? {} : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              className="inline-flex items-center"
            >
              <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-[#E50924]/25 via-[#1A0A0C] to-[#121212] border border-[#E50924]/60 shadow-[0_0_20px_rgba(229,9,36,0.35)]">
                {/* Radiant Glowing LED Beacon with Ping Ripple */}
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3048] opacity-80" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E50924] shadow-[0_0_10px_#FF3048]" />
                </span>

                {/* Primary High-Impact "NEW LAUNCH" Badge Text */}
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.22em] text-[#FF3048] drop-shadow-[0_0_8px_rgba(229,9,36,0.5)]">
                  NEW LAUNCH
                </span>

                {subBadgeText && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-white/40 shrink-0" />
                    <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.16em] text-white/90 font-bold">
                      {subBadgeText}
                    </span>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* 2. MASSIVE HEADLINE (EDITORIAL MASK REVEAL WITH DRAWN UNDERLINE) */}
          <div className="space-y-2">
            <div className="overflow-hidden">
              <motion.h1
                initial={reducedMotion ? {} : { y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.08 }}
                className="font-heading text-2xl xs:text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.06]"
              >
                <span>{slide.title} </span>
                <span className="relative inline-block text-[#E50924]">
                  {slide.highlight}
                  {/* Underline drawing in left-to-right */}
                  {!reducedMotion && (
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.45, delay: 0.35, ease: EASE_OUT }}
                      className="absolute left-0 -bottom-1 sm:-bottom-2 w-full h-[3px] sm:h-[4px] bg-[#E50924] origin-left rounded-full shadow-[0_0_10px_#E50924]"
                    />
                  )}
                </span>
              </motion.h1>
            </div>

            {/* PROMINENT LUXURY MODEL NAME SHOWCASE */}
            <div className="overflow-hidden pt-1.5 sm:pt-2.5">
              <motion.div
                initial={reducedMotion ? {} : { y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.16 }}
                className="inline-flex flex-wrap items-center gap-2 sm:gap-3 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-white/[0.08] to-white/[0.02] border border-white/[0.12] shadow-lg shadow-black/40 backdrop-blur-md"
              >
                {/* Brand Tag Emblem */}
                <span className="px-2.5 py-1 rounded bg-gradient-to-r from-[#E50924] to-[#B90820] text-white text-[10px] sm:text-xs font-mono font-black tracking-widest uppercase shadow-md shadow-[#E50924]/40 shrink-0">
                  {slide.brand || 'FLAGSHIP'}
                </span>

                {/* Large High-Contrast Model Name */}
                <h2 className="text-base xs:text-lg sm:text-2xl lg:text-3xl font-heading font-black text-white tracking-tight leading-snug drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  {slide.subtitle}
                </h2>
              </motion.div>
            </div>
          </div>

          {/* 3. DESCRIPTIVE STORY */}
          <div className="overflow-hidden max-w-xl">
            <motion.p
              initial={reducedMotion ? {} : { y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.22 }}
              className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed line-clamp-3 sm:line-clamp-none font-sans"
            >
              {slide.description}
            </motion.p>
          </div>

          {/* 4. TECHNICAL SPEC CHIPS */}
          {slide.specs && slide.specs.length > 0 && (
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.28 }}
              className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5"
            >
              {slide.specs.map((spec) => (
                <span
                  key={spec}
                  className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-[2px] bg-[#141414] border border-white/[0.08] text-[9px] sm:text-[11px] font-mono text-[#D4D4D8] shadow-sm hover:border-white/20 transition-colors"
                >
                  {spec}
                </span>
              ))}
            </motion.div>
          )}

          {/* 5. PRICING & CTA BUTTON */}
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.32 }}
            className="pt-1 sm:pt-2 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8"
          >
            {/* Showroom Price Section */}
            <div>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#71717A] block font-semibold">
                Showroom Price
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-heading text-xl sm:text-3xl font-black text-white tabular-nums tracking-tight">
                  {formattedDisplayPrice}
                </span>
                {slide.originalPrice && (
                  <span className="text-xs text-[#71717A] line-through font-mono hidden xs:inline">
                    {slide.originalPrice}
                  </span>
                )}
                {slide.discount && (
                  <motion.span
                    initial={reducedMotion ? {} : { scale: 0.82 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.38, duration: 0.3, ease: EASE_OUT }}
                    className="px-2 py-0.5 rounded-[2px] bg-[#E50924]/20 border border-[#E50924]/40 text-[#FF3048] text-[10px] font-extrabold uppercase tracking-wider"
                  >
                    {slide.discount}
                  </motion.span>
                )}
              </div>
            </div>

            {/* Glowing Action Button */}
            <div>
              <Link
                href={slide.buttonLink || `/products/${slide.slug}`}
                className="btn-primary text-xs sm:text-xs tracking-wider font-bold py-3 px-5 sm:py-3.5 sm:px-7 shadow-xl shadow-[#E50924]/30 hover:shadow-[#E50924]/50 group"
              >
                <span>{slide.buttonText || 'Discover Device'}</span>
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
