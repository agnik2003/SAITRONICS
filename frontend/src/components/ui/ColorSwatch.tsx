'use client';

import { Check } from 'lucide-react';
import { ColorVariant } from '@/types';

interface ColorSwatchProps {
  variants: ColorVariant[];
  selected: string;
  onChange: (name: string) => void;
}

export default function ColorSwatch({ variants, selected, onChange }: ColorSwatchProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {variants.map(v => {
        const isSelected = selected === v.name;
        return (
          <button
            key={v.name}
            onClick={() => onChange(v.name)}
            title={v.name}
            className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-[4px] border transition-all duration-200 focus:outline-none cursor-pointer ${
              isSelected
                ? 'border-[#E50924] bg-[#E50924]/10 shadow-sm ring-1 ring-[#E50924]'
                : 'border-white/[0.08] hover:border-white/20 bg-[#141414]'
            }`}
          >
            <span
              className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-inner flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: v.hex }}
            >
              {isSelected && (
                <Check
                  className="w-2 h-2"
                  style={{ color: parseInt(v.hex.replace('#', ''), 16) > 0x888888 ? '#000000' : '#FFFFFF' }}
                />
              )}
            </span>
            <span
              className={`text-xs font-semibold tracking-wide transition-colors ${
                isSelected ? 'text-white' : 'text-[#858585] group-hover:text-[#B8B8B8]'
              }`}
            >
              {v.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
