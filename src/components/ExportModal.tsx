import React from 'react';
import { X, Download, Share2, Smartphone, LayoutGrid, Square, Monitor, Check } from 'lucide-react';
import { Anime } from '../types';
import { ExportView, ExportFormat } from './ExportView';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: (Anime | null)[];
  format: ExportFormat;
  onFormatChange: (format: ExportFormat) => void;
  onExport: () => void;
  isExporting: boolean;
  previewRef: React.RefObject<HTMLDivElement>;
}

const FORMAT_OPTIONS: {
  id: ExportFormat;
  label: string;
  sublabel: string;
  badge: string;
  icon: React.ElementType;
  aspectRatio: string;
  dims: string;
}[] = [
  {
    id: 'feed',
    label: 'Feed Post (4:5)',
    sublabel: 'Instagram, Facebook, Threads',
    badge: 'Recommended',
    icon: LayoutGrid,
    aspectRatio: '4 / 5',
    dims: '1080 × 1350',
  },
  {
    id: 'story',
    label: 'Story & Mobile (9:16)',
    sublabel: 'IG Stories, TikTok, Wallpaper',
    badge: 'Full Screen',
    icon: Smartphone,
    aspectRatio: '9 / 16',
    dims: '1080 × 1920',
  },
  {
    id: 'square',
    label: 'Square (1:1)',
    sublabel: 'Classic Instagram & FB Feed',
    badge: 'Universal',
    icon: Square,
    aspectRatio: '1 / 1',
    dims: '1080 × 1080',
  },
  {
    id: 'landscape',
    label: 'Landscape (16:9)',
    sublabel: 'Reddit, Twitter/X, Desktop',
    badge: 'Wide Spread',
    icon: Monitor,
    aspectRatio: '16 / 9',
    dims: '1920 × 1080',
  },
];

export function ExportModal({
  isOpen,
  onClose,
  collection,
  format,
  onFormatChange,
  onExport,
  isExporting,
  previewRef,
}: ExportModalProps) {
  if (!isOpen) return null;

  const currentOption = FORMAT_OPTIONS.find((f) => f.id === format) || FORMAT_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in font-mono">
      <div className="bg-[#0A0A0C] border border-white/10 w-full max-w-4xl max-h-[92vh] flex flex-col rounded-xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div>
            <h2 className="font-serif text-2xl text-[#F4F4F2] tracking-tight uppercase">
              Export Archive Poster
            </h2>
            <p className="text-xs text-[#5A5A66] uppercase tracking-wider mt-0.5">
              Optimized layouts for social sharing
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="p-2 text-[#5A5A66] hover:text-[#F4F4F2] hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split view (Format selector + Mini Preview) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Format Options Column */}
          <div className="md:col-span-5 space-y-3">
            <span className="text-[11px] uppercase tracking-widest text-[#5A5A66] font-bold block mb-2">
              Select Aspect Ratio
            </span>

            {FORMAT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = format === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onFormatChange(opt.id)}
                  disabled={isExporting}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-start justify-between group ${
                    isSelected
                      ? 'bg-white/10 border-white/40 text-[#F4F4F2] shadow-lg'
                      : 'bg-black/30 border-white/5 text-[#5A5A66] hover:border-white/20 hover:text-[#F4F4F2]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-md ${
                        isSelected ? 'bg-white text-black' : 'bg-white/5 text-[#5A5A66] group-hover:text-[#F4F4F2]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-base text-[#F4F4F2] leading-none">
                          {opt.label}
                        </span>
                        {opt.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/80 font-mono">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#5A5A66] mt-1">{opt.sublabel}</p>
                      <p className="text-[10px] text-white/40 font-mono mt-0.5">{opt.dims}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.0 h-3.0 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Interactive Live Mini Preview */}
          <div className="md:col-span-7 flex flex-col items-center justify-center bg-black/60 border border-white/10 rounded-xl p-4 min-h-[380px] relative overflow-hidden">
            <div className="text-[10px] uppercase tracking-widest text-[#5A5A66] mb-3 flex items-center justify-between w-full px-2">
              <span>Preview ({currentOption.dims})</span>
              <span>{currentOption.label}</span>
            </div>

            {/* Scaled Preview Frame */}
            <div className="w-full flex-1 flex items-center justify-center p-2 min-h-[300px]">
              <div 
                className="relative overflow-hidden shadow-2xl border border-white/20 rounded-sm bg-[#F4F4F2] transition-all duration-300"
                style={{
                  aspectRatio: currentOption.aspectRatio,
                  maxHeight: '380px',
                  maxWidth: '100%',
                }}
              >
                {/* Embedded Mini Export View for direct visual feedback */}
                <div 
                  className="origin-top-left pointer-events-none select-none"
                  style={{
                    width: currentOption.id === 'landscape' ? '1920px' : '1080px',
                    height: currentOption.id === 'landscape' ? '1080px' : (currentOption.id === 'story' ? '1920px' : (currentOption.id === 'feed' ? '1350px' : '1080px')),
                    transform: `scale(${
                      currentOption.id === 'landscape' ? 0.22 : (currentOption.id === 'story' ? 0.19 : (currentOption.id === 'feed' ? 0.26 : 0.32))
                    })`,
                    transformOrigin: 'top left',
                  }}
                >
                  <ExportView collection={collection} format={format} isPreview />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-black/40">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-5 py-2.5 text-xs text-[#5A5A66] hover:text-[#F4F4F2] uppercase tracking-widest transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={onExport}
            disabled={isExporting}
            className="bg-[#F4F4F2] text-[#0A0A0C] hover:bg-white px-8 py-3.5 font-mono text-xs uppercase tracking-widest flex items-center transition-all disabled:opacity-50 shadow-lg font-bold"
          >
            {isExporting ? (
              <span>Compiling Image...</span>
            ) : (
              <>
                <span>Export ({currentOption.label.split(' ')[0]})</span>
                <Download className="w-4 h-4 ml-2.5" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
