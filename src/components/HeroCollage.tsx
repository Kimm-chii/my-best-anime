import React from 'react';
import { Anime } from '../types';

interface HeroCollageProps {
  collection: (Anime | null)[];
  onOpenSearch: () => void;
}

export function HeroCollage({ collection, onOpenSearch }: HeroCollageProps) {
  // Ensure we always have 10 slots for the shelf
  const slots = Array.from({ length: 10 }, (_, i) => collection[i] || null);
  
  const hasSelections = slots.some(Boolean);

  return (
    <section className="min-h-[70vh] h-[70vh] relative w-full overflow-hidden flex flex-col bg-editorial-dark border-b border-editorial-light/10">
      
      {/* Background Shelf - Full Width/Height, No Interaction */}
      <div className="absolute inset-0 z-0 flex w-full h-full opacity-60">
        {slots.map((anime, idx) => (
          <div 
            key={idx}
            className="relative flex-1 h-full border-r border-black/30 last:border-r-0 overflow-hidden"
          >
            {anime ? (
              <img 
                src={anime.imageUrl} 
                alt={anime.title}
                crossOrigin="anonymous"
                className="absolute inset-0 w-full h-full object-cover object-center filter saturate-50 contrast-125"
              />
            ) : (
              <div className="absolute inset-0 w-full h-full bg-[#0a0a0c]" />
            )}

            {/* Spine Texture */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/10 to-black/70 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/60" />

            {/* Spine Content */}
            <div className="relative w-full h-full flex flex-col items-center justify-between py-6 md:py-12 pointer-events-none">
              <div className="text-[10px] md:text-xs font-mono text-editorial-light bg-black/80 px-1 py-1 text-center w-full border-y border-white/10">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 flex justify-center items-center py-4 overflow-hidden">
                <span 
                  className="font-serif text-sm md:text-base tracking-widest text-editorial-light uppercase truncate px-1 drop-shadow-md whitespace-nowrap"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  {anime ? anime.title : 'EMPTY VOL.'}
                </span>
              </div>
              <div className="text-[8px] md:text-[10px] font-mono text-editorial-muted bg-black/80 px-1 py-1 w-full text-center border-t border-white/10 truncate">
                {anime?.year || '----'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Foreground Typography Layer */}
      {/* Global Dark Gradient over the shelf for typography contrast */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-editorial-dark/90 via-transparent to-editorial-dark/90" />
      
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 md:p-12 text-editorial-light drop-shadow-md">
        {/* Top: Big Archive Text */}
        <div className="flex justify-between items-start">
          <h1 className="font-serif text-7xl md:text-9xl lg:text-[12rem] tracking-tighter uppercase leading-none opacity-90 -mt-4">
            Archive
          </h1>
        </div>

        {/* Bottom: My Best Anime Info & Metadata */}
        <div className="flex justify-between items-end">
          <div className="text-xs font-mono uppercase tracking-widest text-editorial-light/60">
            <p className="text-editorial-light font-bold">Issue 01</p>
            <p className="mt-1 text-editorial-light">My Best Anime</p>
            <p className="mt-4">Personal Collection</p>
          </div>
          
          <div className="text-right text-xs font-mono uppercase tracking-widest text-editorial-light/60">
            <p className="text-editorial-light">{slots.filter(Boolean).length} / 10 Compiled</p>
            <p className="mt-1 text-editorial-light">{new Date().getFullYear()}</p>
            <div className="mt-4 flex flex-col items-end gap-2">
               <span>Scroll to Explore ↓</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

