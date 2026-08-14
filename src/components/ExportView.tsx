import React from 'react';
import { Anime } from '../types';

export type ExportFormat = 'story' | 'feed' | 'square' | 'landscape';

interface ExportViewProps {
  collection: (Anime | null)[];
  format?: ExportFormat;
  exportRef?: React.RefObject<HTMLDivElement>;
  isPreview?: boolean;
}

export function ExportView({
  collection,
  format = 'feed',
  exportRef,
  isPreview = false,
}: ExportViewProps) {
  const selectedCount = collection.filter(Boolean).length;
  const slots = Array.from({ length: 10 }, (_, i) => collection[i] || null);

  // Format dimensions
  const dimensions = {
    story: { width: 1080, height: 1920 },
    feed: { width: 1080, height: 1350 },
    square: { width: 1080, height: 1080 },
    landscape: { width: 1920, height: 1080 },
  }[format];

  const content = (() => {
    if (format === 'landscape') {
      return (
        <div className="w-full h-full flex flex-row font-mono bg-[#F4F4F2] text-[#0A0A0C]">
          {/* LEFT SIDE: Dark Hero Shelf */}
          <section className="w-[820px] h-full relative overflow-hidden flex flex-col bg-[#0A0A0C] text-[#F4F4F2] border-r border-[#0A0A0C]/30 flex-shrink-0">
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
                  <div className="relative w-full h-full flex flex-col items-center justify-between py-10 pointer-events-none">
                    <div className="text-xs font-mono text-[#F4F4F2] bg-black/80 px-1 py-1.5 text-center w-full border-y border-white/10">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1 flex justify-center items-center py-4 overflow-hidden">
                      <span 
                        className="font-serif text-[18px] tracking-widest text-[#F4F4F2] uppercase truncate px-1 drop-shadow-md whitespace-nowrap"
                        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                      >
                        {anime ? anime.title : 'EMPTY VOL.'}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-[#5A5A66] bg-black/80 px-1 py-1 w-full text-center border-t border-white/10 truncate">
                      {anime?.year || '----'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Typography Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[#0A0A0C]/90 via-transparent to-[#0A0A0C]/90" />
            <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-10 text-[#F4F4F2] drop-shadow-md">
              <div>
                <h1 className="font-serif text-[7.5rem] tracking-tighter uppercase leading-none opacity-90 -mt-2">
                  Archive
                </h1>
              </div>
              <div className="text-base font-mono uppercase tracking-widest text-[#F4F4F2]/70 space-y-1">
                <p className="text-[#F4F4F2] font-bold">Issue 01 — Personal Collection</p>
                <p className="text-sm">{selectedCount} / 10 Compiled • {new Date().getFullYear()}</p>
              </div>
            </div>
          </section>

          {/* RIGHT SIDE: Light Archive List */}
          <section className="flex-1 h-full bg-[#F4F4F2] text-[#0A0A0C] p-10 flex flex-col justify-between">
            <div className="flex justify-between items-end border-b border-[#0A0A0C]/20 pb-4 mb-4">
              <div>
                <h2 className="font-serif text-[3rem] uppercase tracking-tight leading-none">The Archive</h2>
                <p className="font-mono text-xs uppercase text-[#5A5A66] mt-2">Curated Selections</p>
              </div>
              <div className="font-mono text-sm uppercase text-[#5A5A66]">
                {selectedCount} / 10 Compiled
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 grid-flow-col grid-rows-5 gap-x-8 gap-y-3 my-2">
              {collection.map((anime, index) => (
                <div key={index} className="flex items-center gap-4 p-1.5 border-b border-[#0A0A0C]/10 min-w-0">
                  <div className="flex-shrink-0 w-6 text-sm font-mono text-[#5A5A66] text-right">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 flex items-center gap-4 min-w-0">
                    {anime ? (
                      <>
                        <div className="w-[60px] h-[90px] bg-black/5 flex-shrink-0 relative overflow-hidden rounded-sm">
                          <img src={anime.imageUrl} alt="" crossOrigin="anonymous" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h3 className="font-serif text-[22px] leading-tight line-clamp-2">{anime.title}</h3>
                          <div className="text-xs font-mono text-[#5A5A66] uppercase mt-1">
                            <span>{anime.year || '----'}</span>
                            <span className="mx-1.5">/</span>
                            <span>{anime.type || 'TV'}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center">
                        <div className="w-full border border-dashed border-[#0A0A0C]/20 flex items-center justify-center text-[#5A5A66] h-[90px] rounded-sm">
                          <span className="font-mono text-xs uppercase tracking-widest">Select Title</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center text-xs font-mono uppercase tracking-widest text-[#5A5A66] pt-2">
              Exported from My Best Anime Archive
            </div>
          </section>
        </div>
      );
    }

    // Vertical Layouts (story, feed, square)
    const isStory = format === 'story';
    const isSquare = format === 'square';

    // Scaled parameters based on height
    const heroHeight = isStory ? 'h-[850px]' : (isSquare ? 'h-[380px]' : 'h-[520px]');
    const heroTitleSize = isStory ? 'text-[12rem]' : (isSquare ? 'text-[7.5rem]' : 'text-[9.5rem]');
    const listHeaderTitleSize = isStory ? 'text-[3.5rem]' : (isSquare ? 'text-[2.2rem]' : 'text-[2.8rem]');
    const itemImgWidth = isStory ? 'w-[80px] h-[120px]' : (isSquare ? 'w-[50px] h-[75px]' : 'w-[65px] h-[98px]');
    const itemTitleSize = isStory ? 'text-[32px]' : (isSquare ? 'text-[18px]' : 'text-[24px]');
    const spineTextSize = isStory ? 'text-[22px]' : (isSquare ? 'text-[13px]' : 'text-[16px]');
    const pyPadding = isStory ? 'py-12' : (isSquare ? 'py-4' : 'py-6');
    const sectionPadding = isStory ? 'py-8 px-16' : (isSquare ? 'py-4 px-8' : 'py-6 px-10');

    return (
      <div className="w-full h-full bg-[#F4F4F2] text-[#0A0A0C] flex flex-col font-mono" style={{ boxSizing: 'border-box' }}>
        {/* HERO SECTION - Dark */}
        <section className={`${heroHeight} relative w-full overflow-hidden flex flex-col bg-[#0A0A0C] text-[#F4F4F2] flex-shrink-0`}>
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
                <div className={`relative w-full h-full flex flex-col items-center justify-between ${pyPadding} pointer-events-none`}>
                  <div className="text-xs font-mono text-[#F4F4F2] bg-black/80 px-1 py-1 text-center w-full border-y border-white/10">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 flex justify-center items-center py-2 overflow-hidden">
                    <span 
                      className={`font-serif ${spineTextSize} tracking-widest text-[#F4F4F2] uppercase truncate px-1 drop-shadow-md whitespace-nowrap`}
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      {anime ? anime.title : 'EMPTY VOL.'}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-[#5A5A66] bg-black/80 px-1 py-1 w-full text-center border-t border-white/10 truncate">
                    {anime?.year || '----'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Typography Layer */}
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[#0A0A0C]/90 via-transparent to-[#0A0A0C]/90" />
          <div className={`absolute inset-0 z-20 pointer-events-none flex flex-col justify-between ${isSquare ? 'p-6' : 'p-10'} text-[#F4F4F2] drop-shadow-md`}>
            <div className="flex justify-between items-start">
              <h1 className={`font-serif ${heroTitleSize} tracking-tighter uppercase leading-none opacity-90 -mt-4`}>
                Archive
              </h1>
            </div>
            <div className="flex justify-between items-end">
              <div className={`${isSquare ? 'text-xs' : 'text-base'} font-mono uppercase tracking-widest text-[#F4F4F2]/70`}>
                <p className="text-[#F4F4F2] font-bold">Issue 01</p>
                <p className="mt-0.5 text-[#F4F4F2]">My Best Anime</p>
                {!isSquare && <p className="mt-2">Personal Collection</p>}
              </div>
              <div className={`text-right ${isSquare ? 'text-xs' : 'text-base'} font-mono uppercase tracking-widest text-[#F4F4F2]/70`}>
                <p className="text-[#F4F4F2]">{selectedCount} / 10 Compiled</p>
                <p className="mt-0.5 text-[#F4F4F2]">{new Date().getFullYear()}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ARCHIVE LIST SECTION - Light */}
        <section className={`flex-1 bg-[#F4F4F2] text-[#0A0A0C] ${sectionPadding} flex flex-col justify-between overflow-hidden`}>
          <div className="flex justify-between items-end mb-3 border-b border-[#0A0A0C]/20 pb-2">
            <div>
              <h2 className={`font-serif ${listHeaderTitleSize} uppercase tracking-tight leading-none`}>The Archive</h2>
              <p className="font-mono text-xs uppercase text-[#5A5A66] mt-1">
                Curated Selections
              </p>
            </div>
            <div className="font-mono text-xs uppercase text-[#5A5A66]">
              {selectedCount} / 10 Compiled
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 grid-flow-col grid-rows-5 gap-x-8 gap-y-2 my-1">
            {collection.map((anime, index) => (
              <div key={index} className="flex items-center gap-4 p-1 border-b border-[#0A0A0C]/10 min-w-0">
                <div className="flex-shrink-0 w-6 text-xs font-mono text-[#5A5A66] text-right">
                  {String(index + 1).padStart(2, '0')}
                </div>
                
                <div className="flex-1 flex items-center gap-3 min-w-0">
                  {anime ? (
                    <>
                      <div className={`${itemImgWidth} bg-black/5 flex-shrink-0 relative overflow-hidden rounded-sm`}>
                        <img src={anime.imageUrl} alt="" crossOrigin="anonymous" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h3 className={`font-serif ${itemTitleSize} leading-tight line-clamp-2`}>{anime.title}</h3>
                        <div className="text-[10px] md:text-xs font-mono text-[#5A5A66] uppercase mt-0.5">
                          <span>{anime.year || '----'}</span>
                          <span className="mx-1">/</span>
                          <span>{anime.type || 'TV'}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center">
                      <div className={`w-full border border-dashed border-[#0A0A0C]/20 flex items-center justify-center text-[#5A5A66] ${itemImgWidth} rounded-sm`}>
                        <span className="font-mono text-[10px] uppercase tracking-widest">Select Title</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-[11px] font-mono uppercase tracking-widest text-[#5A5A66] pt-2">
            Exported from My Best Anime Archive
          </div>
        </section>
      </div>
    );
  })();

  if (isPreview) {
    return (
      <div 
        style={{ 
          width: `${dimensions.width}px`, 
          height: `${dimensions.height}px` 
        }}
      >
        {content}
      </div>
    );
  }

  return (
    <div 
      className="fixed top-0 left-[200vw] pointer-events-none"
      style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
    >
      <div 
        ref={exportRef}
        className="w-full h-full"
        style={{ boxSizing: 'border-box' }}
      >
        {content}
      </div>
    </div>
  );
}
