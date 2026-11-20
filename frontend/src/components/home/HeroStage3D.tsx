'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroSlide } from '@/types';
import { HeroTiltState } from '@/hooks/useHeroTilt';
import { FALLBACK_PRODUCT_IMAGE } from '@/data/productImages';

interface HeroStage3DProps {
  slide: HeroSlide;
  slideIndex: number;
  tilt: HeroTiltState;
  onPointerMove: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

// Cubic bezier easings from design spec
const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const; // Arrival
const EASE_IN_EXPO = [0.55, 0, 0.1, 1] as const;  // Exit

export default function HeroStage3D({
  slide,
  slideIndex,
  tilt,
  onPointerMove,
  onPointerEnter,
  onPointerLeave,
}: HeroStage3DProps) {
  const [imageError, setImageError] = useState(false);
  const [sweepKey, setSweepKey] = useState(0);

  // Trigger specular sweep on slide change and periodic 7-second timer
  useEffect(() => {
    setSweepKey((prev) => prev + 1);
    const interval = setInterval(() => {
      setSweepKey((prev) => prev + 1);
    }, 7000);
    return () => clearInterval(interval);
  }, [slideIndex]);

  const restingTilt = slide.stageTilt || { x: -6, y: 16 };
  const glowColor = slide.glowColor || '#E50924';
  const callout = slide.callout || {
    label: 'CAMERA SYSTEM',
    text: slide.badgeCamera || 'Flagship Pro Optics',
    anchor: 'camera' as const,
  };

  const currentImageUrl = (!imageError && slide.image) ? slide.image : FALLBACK_PRODUCT_IMAGE;

  // Parallax offsets based on tilt
  const glowParallaxX = -tilt.parallaxX * 0.4;
  const glowParallaxY = -tilt.parallaxY * 0.4;
  const calloutParallaxX = tilt.parallaxX * 1.4;
  const calloutParallaxY = tilt.parallaxY * 1.4;

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* ============================================================ */}
      {/* MOBILE SPEC CALLOUT PILL: 2D NATIVE DOM, RAZOR-SHARP, NO GPU HAZE */}
      {/* ============================================================ */}
      <div className="sm:hidden w-full flex justify-center px-4 mb-2 z-30 pointer-events-none">
        <AnimatePresence initial={false}>
          <motion.div
            key={`callout-m-${slide.id || slideIndex}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.18 } }}
            transition={{ delay: 0.1, duration: 0.35, ease: EASE_OUT_EXPO }}
          >
            <div className="px-4 py-1.5 rounded-full bg-[#121212] border border-[#E50924]/70 shadow-[0_4px_20px_rgba(0,0,0,0.95)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E50924] shadow-[0_0_8px_#FF2B45] animate-pulse shrink-0" />
              <span className="text-[10px] xs:text-[11px] font-black uppercase tracking-[0.16em] text-[#FF3048] shrink-0">
                {callout.label}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/40 shrink-0" />
              <span className="text-[11px] xs:text-xs font-bold text-white tracking-tight whitespace-nowrap">
                {callout.text}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ============================================================ */}
      {/* 3D PERSPECTIVE STAGE CONTAINER                               */}
      {/* ============================================================ */}
      <div
        className="relative w-full aspect-square max-w-[280px] xs:max-w-[340px] sm:max-w-[440px] lg:max-w-[520px] 2xl:max-w-[560px] mx-auto flex items-center justify-center select-none"
        style={{ perspective: '1200px' }}
        onPointerMove={onPointerMove}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
      {/* 3D PRESERVE CONTAINER */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* ============================================================ */}
        {/* LAYER 1: BACKDROP DISC WITH ROTATING SHEEN & RIM LIGHT       */}
        {/* ============================================================ */}
        <div
          className="absolute w-[86%] h-[86%] rounded-full overflow-hidden shadow-2xl pointer-events-none transition-transform duration-500 ease-out"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #1F1F1F 0%, #121212 55%, #0A0A0A 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: 'inset 1px 1px 2px rgba(255, 255, 255, 0.2), 0 20px 50px rgba(0, 0, 0, 0.9)',
            transform: 'translateZ(-120px)',
          }}
        >
          {/* Subtle Rotating Conic Sheen (60s loop) */}
          {!tilt.reducedMotion && (
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255,255,255,0.15) 60deg, transparent 120deg, rgba(255,48,72,0.2) 240deg, transparent 360deg)',
                animation: 'spin 60s linear infinite',
              }}
            />
          )}

          {/* Thin Inner Concentric Track */}
          <div className="absolute inset-[10%] rounded-full border border-white/[0.04]" />
          <div className="absolute inset-[24%] rounded-full border border-white/[0.03]" />
        </div>

        {/* ============================================================ */}
        {/* LAYER 2: AMBIENT RED GLOW (PARALLAX 0.4x OPPOSITE)           */}
        {/* ============================================================ */}
        <div
          className="absolute w-[95%] h-[95%] rounded-full pointer-events-none blur-2xl opacity-60 transition-all duration-700 ease-out"
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, rgba(229, 9, 36, 0.2) 40%, transparent 70%)`,
            transform: `translate3d(${glowParallaxX}px, ${glowParallaxY}px, -90px)`,
            willChange: 'transform',
          }}
        />

        {/* ============================================================ */}
        {/* LAYER 3: 3D ORBIT RING WITH TRAVELING NODE (24s LOOP)        */}
        {/* ============================================================ */}
        {!tilt.isLowPower && !tilt.reducedMotion && (
          <div
            className="absolute w-[105%] h-[105%] pointer-events-none"
            style={{
              transform: 'rotateX(72deg) rotateZ(25deg) translateZ(-40px)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* The elliptical hairline orbit line */}
            <div className="absolute inset-0 rounded-full border border-[#E50924]/30" />

            {/* Orbiting Red Particle Node */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                animation: 'spin 24s linear infinite',
              }}
            >
              <span
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FF3048] shadow-[0_0_12px_#FF3048]"
              />
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* LAYER 4: ELLIPTICAL CONTACT SHADOW & FLOOR REFLECTION        */}
        {/* ============================================================ */}
        {/* Floor Contact Shadow */}
        <div
          className="absolute bottom-2 sm:bottom-4 w-[65%] h-5 sm:h-8 rounded-full pointer-events-none blur-md transition-all duration-300"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, transparent 75%)',
            transform: `translateZ(-20px) scale(${1 + Math.abs(tilt.tiltX) * 0.02})`,
          }}
        />

        {/* Flipped Floor Reflection (Blurred 12% Opacity copy) */}
        {!tilt.isLowPower && (
          <div
            className="absolute bottom-[-18%] w-[68%] h-[50%] pointer-events-none overflow-hidden opacity-12 blur-[3px]"
            style={{
              transform: 'scaleY(-1) translateZ(-30px)',
              maskImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 75%)',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 75%)',
            }}
          >
            <Image
              src={currentImageUrl}
              alt=""
              fill
              className="object-contain"
              sizes="(max-width: 640px) 200px, 400px"
              unoptimized
            />
          </div>
        )}

        {/* ============================================================ */}
        {/* LAYER 5: THE PHONE (3D ANIMATED HERO CUT-OUT)               */}
        {/* ============================================================ */}
        <div
          className="relative w-[78%] h-[82%] sm:w-[75%] sm:h-[84%] flex items-center justify-center z-10"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${tilt.tiltX}deg) rotateY(${tilt.tiltY}deg) translate3d(${tilt.parallaxX}px, ${tilt.parallaxY}px, 20px)`,
            willChange: 'transform',
          }}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={`phone-${slide.id || slideIndex}`}
              className="absolute inset-0 flex items-center justify-center"
              initial={
                tilt.reducedMotion
                  ? { opacity: 0 }
                  : {
                      rotateY: 35,
                      x: 60,
                      scale: 0.94,
                      opacity: 0,
                    }
              }
              animate={
                tilt.reducedMotion
                  ? { opacity: 1 }
                  : {
                      rotateY: restingTilt.y,
                      x: 0,
                      scale: 1,
                      opacity: 1,
                    }
              }
              exit={
                tilt.reducedMotion
                  ? { opacity: 0 }
                  : {
                      rotateY: -22,
                      x: -45,
                      scale: 0.94,
                      opacity: 0,
                      transition: { duration: 0.4, ease: EASE_IN_EXPO },
                    }
              }
              transition={{
                duration: tilt.reducedMotion ? 0.25 : 0.6,
                ease: EASE_OUT_EXPO,
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* PRIMARY PHONE IMAGE */}
              <div className="relative w-full h-full drop-shadow-[0_25px_45px_rgba(0,0,0,0.85)]">
                <Image
                  src={currentImageUrl}
                  alt={slide.subtitle || slide.title}
                  fill
                  sizes="(max-width: 640px) 260px, (max-width: 1024px) 440px, 560px"
                  className="object-contain p-2 sm:p-4 select-none pointer-events-none"
                  priority
                  unoptimized
                  onError={() => setImageError(true)}
                />

                {/* ============================================================ */}
                {/* LAYER 6: SPECULAR LIGHT SWEEP (GLOSSY TITANIUM SHEEN)        */}
                {/* ============================================================ */}
                {!tilt.reducedMotion && (
                  <motion.div
                    key={`sweep-${sweepKey}`}
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                    initial={{ x: '-120%', opacity: 0 }}
                    animate={{ x: '160%', opacity: [0, 0.18, 0.24, 0.15, 0] }}
                    transition={{
                      delay: 0.35,
                      duration: 1.15,
                      ease: [0.25, 1, 0.5, 1],
                    }}
                    style={{
                      background: 'linear-gradient(108deg, transparent 35%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.7) 53%, transparent 68%)',
                      mixBlendMode: 'overlay',
                    }}
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ============================================================ */}
        {/* LAYER 7: DESKTOP FLOATING 3D CALLOUT CARD (PARALLAX Z:60px)  */}
        {/* ============================================================ */}
        <div className="hidden sm:block">
          <AnimatePresence initial={false}>
            <motion.div
              key={`callout-d-${slide.id || slideIndex}`}
              initial={{ opacity: 0, y: -10, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.92, transition: { duration: 0.25 } }}
              transition={{ delay: 0.25, duration: 0.45, ease: EASE_OUT_EXPO }}
              className="absolute sm:top-4 sm:-right-4 md:top-6 md:-right-6 lg:top-8 lg:-right-8 xl:-right-12 z-30 pointer-events-auto"
              style={{
                transform: `translate3d(${calloutParallaxX}px, ${calloutParallaxY}px, 60px)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="px-3.5 py-2.5 rounded-lg bg-[#0E0E0E] border border-white/[0.12] shadow-2xl shadow-black/90 text-left min-w-[145px] sm:min-w-[170px] group hover:border-[#E50924]/60 transition-colors">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E50924] shadow-[0_0_6px_#FF2B45] animate-pulse" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#FF3048]">
                    {callout.label}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] font-bold text-white tracking-tight leading-snug">
                  {callout.text}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ============================================================ */}
        {/* LAYER 8: ATMOSPHERIC DUST SPECKS (14 PARTICLES)              */}
        {/* ============================================================ */}
        {!tilt.isLowPower && !tilt.reducedMotion && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {[...Array(14)].map((_, i) => {
              const xPos = 15 + ((i * 37) % 75);
              const yPos = 12 + ((i * 53) % 76);
              const size = i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1.5;
              const isRed = i % 3 === 0;
              const delay = (i * 0.45) % 4;
              const duration = 5 + ((i * 0.8) % 4);

              return (
                <span
                  key={i}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    left: `${xPos}%`,
                    top: `${yPos}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    background: isRed ? '#FF3048' : '#FFFFFF',
                    opacity: 0.28,
                    boxShadow: isRed ? '0 0 6px #FF3048' : '0 0 4px #FFFFFF',
                    animation: `floatParticle ${duration}s ease-in-out ${delay}s infinite alternate`,
                    transform: `translate3d(${tilt.parallaxX * 0.6}px, ${tilt.parallaxY * 0.6}px, 40px)`,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Embedded Particle Keyframe Styles */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes floatParticle {
          from {
            transform: translateY(0px) translateX(0px);
          }
          to {
            transform: translateY(-16px) translateX(8px);
          }
        }
      `}</style>
      </div>
    </div>
  );
}
