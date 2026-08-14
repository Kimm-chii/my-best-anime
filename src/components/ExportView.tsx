import React from 'react';
import { Anime } from '../types';

interface ExportViewProps {
  collection: (Anime | null)[];
  exportRef: React.RefObject<HTMLDivElement>;
}

export function ExportView({ collection, exportRef }: ExportViewProps) {
  const selectedCount = collection.filter(Boolean).length;
  const slots = Array.from({ length: 10 }, (_, i) => collection[i] || null);

  return (
    <div 
      className="fixed top-0 left-[200vw] pointer-events-none"
      style={{ width: '1080px', height: '1920px' }}
    >
      <div 
        ref={exportRef}
        className="w-full h-full bg-[#F4F4F2] text-[#0A0A0C] flex flex-col font-mono"
        style={{ boxSizing: 'border-box' }}
      >
        {/* HERO SECTION - Dark */}
        <section className="h-[850px] relative w-full overflow-hidden flex flex-col bg-[#0A0A0C] text-[#F4F4F2]">
          {/* Background Shelf */}
          <div className="absolute inset-0 z-0 flex w-full h-full opacity-60">
            {slots.map((anime, idx) => (
              <div key={idx} className="relative flex-1 h-full border-r border-black/30 last:border-r-0 overflow-hidden">
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
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/10 to-black/70 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/60" />
                <div className="relative w-full h-full flex flex-col items-center justify-between py-12 pointer-events-none">
                  <div className="text-sm font-mono text-[#F4F4F2] bg-black/80 px-2 py-2 text-center w-full border-y border-white/10">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 flex justify-center items-center py-4 overflow-hidden">
                    <span 
                      className="font-serif text-[22px] tracking-widest text-[#F4F4F2] uppercase truncate px-1 drop-shadow-md whitespace-nowrap"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      {anime ? anime.title : 'EMPTY VOL.'}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[#5A5A66] bg-black/80 px-1 py-2 w-full text-center border-t border-white/10 truncate">
                    {anime?.year || '----'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Typography Layer */}
          {/* Global Dark Gradient over the shelf for typography contrast */}
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[#0A0A0C]/90 via-transparent to-[#0A0A0C]/90" />
          
          <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-12 text-[#F4F4F2] drop-shadow-md">
            <div className="flex justify-between items-start">
              <h1 className="font-serif text-[12rem] tracking-tighter uppercase leading-none opacity-90 -mt-6">
                Archive
              </h1>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-xl font-mono uppercase tracking-widest text-[#F4F4F2]/60">
                <p className="text-[#F4F4F2] font-bold">Issue 01</p>
                <p className="mt-2 text-[#F4F4F2]">My Best Anime</p>
                <p className="mt-6">Personal Collection</p>
              </div>
              <div className="text-right text-xl font-mono uppercase tracking-widest text-[#F4F4F2]/60">
                <p className="text-[#F4F4F2]">{selectedCount} / 10 Compiled</p>
                <p className="mt-2 text-[#F4F4F2]">{new Date().getFullYear()}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ARCHIVE LIST SECTION - Light */}
        <section className="flex-1 bg-[#F4F4F2] text-[#0A0A0C] py-8 px-16 flex flex-col">
          <div className="flex justify-between items-end mb-6 border-b border-[#0A0A0C]/20 pb-4">
            <div>
              <h2 className="font-serif text-[3.5rem] uppercase tracking-tight leading-none">The Archive</h2>
              <p className="font-mono text-base uppercase text-[#5A5A66] mt-3">
                Curated Selections
              </p>
            </div>
            <div className="font-mono text-base uppercase text-[#5A5A66]">
              {selectedCount} / 10 Compiled
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 grid-flow-col grid-rows-5 gap-x-16 gap-y-4">
            {collection.map((anime, index) => (
              <div key={index} className="flex items-stretch gap-6 p-2 border-b border-[#0A0A0C]/10">
                <div className="flex-shrink-0 w-8 text-xl font-mono text-[#5A5A66] pt-2 text-right">
                  {String(index + 1).padStart(2, '0')}
                </div>
                
                <div className="flex-1 flex gap-6 min-w-0">
                  {anime ? (
                    <>
                      <div className="w-[80px] h-[120px] bg-black/5 flex-shrink-0 relative overflow-hidden">
                        <img src={anime.imageUrl} alt="" crossOrigin="anonymous" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h3 className="font-serif text-[32px] leading-tight line-clamp-2">{anime.title}</h3>
                        <div className="text-base font-mono text-[#5A5A66] uppercase mt-2">
                          <span>{anime.year || '----'}</span>
                          <span className="mx-2">/</span>
                          <span>{anime.type || 'UNKNOWN'}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center">
                      <div className="w-full border border-dashed border-[#0A0A0C]/20 flex items-center justify-center text-[#5A5A66] h-[120px]">
                        <span className="font-mono text-base uppercase tracking-widest">Select Title</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-sm font-mono uppercase tracking-widest text-[#5A5A66] pb-4">
            Exported from My Best Anime Archive
          </div>
        </section>
      </div>
    </div>
  );
}
