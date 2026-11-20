'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface HeroTiltState {
  tiltX: number; // degrees around X axis (-8 to +8)
  tiltY: number; // degrees around Y axis (-12 to +12)
  parallaxX: number; // pixels (-20 to +20)
  parallaxY: number; // pixels (-14 to +14)
  isHovered: boolean;
  isLowPower: boolean;
  reducedMotion: boolean;
}

interface UseHeroTiltOptions {
  maxTiltX?: number; // default 8
  maxTiltY?: number; // default 12
  baseTilt?: { x: number; y: number };
}

export function useHeroTilt(options: UseHeroTiltOptions = {}) {
  const { maxTiltX = 8, maxTiltY = 12, baseTilt = { x: -6, y: 16 } } = options;

  const [tilt, setTilt] = useState<HeroTiltState>({
    tiltX: baseTilt.x,
    tiltY: baseTilt.y,
    parallaxX: 0,
    parallaxY: 0,
    isHovered: false,
    isLowPower: false,
    reducedMotion: false,
  });

  const targetTiltRef = useRef({ x: baseTilt.x, y: baseTilt.y, px: 0, py: 0 });
  const currentTiltRef = useRef({ x: baseTilt.x, y: baseTilt.y, px: 0, py: 0 });
  const isHoveredRef = useRef(false);
  const isVisibleRef = useRef(true);
  const animFrameRef = useRef<number | null>(null);
  const idleTimeRef = useRef(0);

  // Update target when baseTilt changes (slide change)
  useEffect(() => {
    targetTiltRef.current.x = baseTilt.x;
    targetTiltRef.current.y = baseTilt.y;
  }, [baseTilt.x, baseTilt.y]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect prefers-reduced-motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reducedMotion = motionQuery.matches;

    // Detect low-power hardware
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    const isLowPower = hardwareConcurrency <= 4 || reducedMotion;

    setTilt((prev) => ({ ...prev, reducedMotion, isLowPower }));

    if (reducedMotion) return;

    // Smooth spring physics loop (stiffness ~120, damping ~18 equivalent in rAF)
    const springFactor = 0.085;
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      if (isVisibleRef.current) {
        if (!isHoveredRef.current) {
          // Idle floating oscillation (8px vertical float over 6s, 3-4deg Y rotation)
          idleTimeRef.current += dt;
          const floatOffset = Math.sin((idleTimeRef.current * 2 * Math.PI) / 6.0) * 8;
          const rotateOsc = Math.cos((idleTimeRef.current * 2 * Math.PI) / 6.0) * 3.2;

          targetTiltRef.current.x = baseTilt.x + (floatOffset * 0.15);
          targetTiltRef.current.y = baseTilt.y + rotateOsc;
          targetTiltRef.current.px = 0;
          targetTiltRef.current.py = floatOffset;
        }

        // Interpolate toward target
        const cur = currentTiltRef.current;
        const tgt = targetTiltRef.current;

        cur.x += (tgt.x - cur.x) * springFactor;
        cur.y += (tgt.y - cur.y) * springFactor;
        cur.px += (tgt.px - cur.px) * springFactor;
        cur.py += (tgt.py - cur.py) * springFactor;

        setTilt((prev) => ({
          ...prev,
          tiltX: cur.x,
          tiltY: cur.y,
          parallaxX: cur.px,
          parallaxY: cur.py,
          isHovered: isHoveredRef.current,
        }));
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    // Pause on visibility change
    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Subtle DeviceOrientation tilt for mobile where available
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (isHoveredRef.current || !e.gamma || !e.beta) return;
      // Clamped subtle gyroscope tilt
      const clampedGamma = Math.max(-15, Math.min(15, e.gamma));
      const clampedBeta = Math.max(-15, Math.min(15, e.beta - 45)); // assume holding phone at ~45deg
      targetTiltRef.current.y = baseTilt.y + (clampedGamma * 0.4);
      targetTiltRef.current.x = baseTilt.x + (clampedBeta * 0.25);
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [baseTilt.x, baseTilt.y, maxTiltX, maxTiltY]);

  // Pointer move handler on the stage
  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (tilt.reducedMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      // Normalized coordinates (-1 to +1)
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      isHoveredRef.current = true;
      // Cursor to the right rotates phone clockwise on Y, cursor down tilts down on X
      targetTiltRef.current.y = baseTilt.y + nx * maxTiltY;
      targetTiltRef.current.x = baseTilt.x - ny * maxTiltX;
      targetTiltRef.current.px = nx * 18;
      targetTiltRef.current.py = ny * 14;
    },
    [baseTilt.x, baseTilt.y, maxTiltX, maxTiltY, tilt.reducedMotion]
  );

  const onPointerEnter = useCallback(() => {
    isHoveredRef.current = true;
  }, []);

  const onPointerLeave = useCallback(() => {
    isHoveredRef.current = false;
    targetTiltRef.current.x = baseTilt.x;
    targetTiltRef.current.y = baseTilt.y;
    targetTiltRef.current.px = 0;
    targetTiltRef.current.py = 0;
  }, [baseTilt.x, baseTilt.y]);

  return {
    tilt,
    onPointerMove,
    onPointerEnter,
    onPointerLeave,
  };
}
