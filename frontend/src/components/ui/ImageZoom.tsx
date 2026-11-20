'use client';

import { useRef, useState, MouseEvent } from 'react';
import Image from 'next/image';

interface ImageZoomProps {
  src: string;
  alt: string;
  zoomScale?: number;
}

export default function ImageZoom({ src, alt, zoomScale = 2.5 }: ImageZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-zoom-in"
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain transition-transform duration-100 ease-out"
        style={{
          transform: isZoomed ? `scale(${zoomScale})` : 'scale(1)',
          transformOrigin: `${origin.x}% ${origin.y}%`,
        }}
        unoptimized
        priority
      />
    </div>
  );
}
