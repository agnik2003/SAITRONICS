'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAutoAdvanceOptions {
  totalSlides: number;
  intervalMs?: number; // default 6500ms
  transitionDurationMs?: number; // default 500ms
  isPaused?: boolean;
  onAdvance?: (nextIndex: number) => void;
}

export function useAutoAdvance({
  totalSlides,
  intervalMs = 6500,
  transitionDurationMs = 500,
  isPaused = false,
  onAdvance,
}: UseAutoAdvanceOptions) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activeSlideRef = useRef(0);
  activeSlideRef.current = activeSlide;

  const queuedSlideRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rAFRef = useRef<number | null>(null);
  const elapsedMsRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const isDocumentVisibleRef = useRef(true);

  // Core changeSlide with transition guard & queueing
  const changeSlide = useCallback(
    (targetIndex: number) => {
      if (totalSlides <= 1) return;
      const normalized = ((targetIndex % totalSlides) + totalSlides) % totalSlides;
      if (normalized === activeSlideRef.current && !isTransitioning) return;

      if (isTransitioning) {
        // Queue at most one request to prevent rapid-click breaking
        queuedSlideRef.current = normalized;
        return;
      }

      setIsTransitioning(true);
      setActiveSlide(normalized);
      activeSlideRef.current = normalized;
      elapsedMsRef.current = 0;
      setProgress(0);

      if (onAdvance) {
        onAdvance(normalized);
      }

      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        if (queuedSlideRef.current !== null) {
          const nextTarget = queuedSlideRef.current;
          queuedSlideRef.current = null;
          changeSlide(nextTarget);
        }
      }, transitionDurationMs);
    },
    [totalSlides, isTransitioning, onAdvance, transitionDurationMs]
  );

  const nextSlide = useCallback(() => {
    changeSlide(activeSlideRef.current + 1);
  }, [changeSlide]);

  const prevSlide = useCallback(() => {
    changeSlide(activeSlideRef.current - 1);
  }, [changeSlide]);

  // Handle visibility changes
  useEffect(() => {
    const handleVisibility = () => {
      isDocumentVisibleRef.current = !document.hidden;
      lastTimeRef.current = null;
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Main high-precision animation loop for progress bar & auto-advance
  useEffect(() => {
    if (totalSlides <= 1) {
      setProgress(1);
      return;
    }

    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const dt = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Only advance timer if not paused, tab visible, and not currently in transition
      if (!isPaused && isDocumentVisibleRef.current && !isTransitioning) {
        elapsedMsRef.current += dt;
        const currentProgress = Math.min(1, elapsedMsRef.current / intervalMs);
        setProgress(currentProgress);

        if (elapsedMsRef.current >= intervalMs) {
          elapsedMsRef.current = 0;
          setProgress(0);
          nextSlide();
        }
      }

      rAFRef.current = requestAnimationFrame(loop);
    };

    rAFRef.current = requestAnimationFrame(loop);

    return () => {
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
    };
  }, [totalSlides, isPaused, isTransitioning, intervalMs, nextSlide]);

  return {
    activeSlide,
    progress,
    isTransitioning,
    changeSlide,
    nextSlide,
    prevSlide,
  };
}
