import React, { useState, useEffect, useRef } from 'react';
import { toJpeg } from 'html-to-image';
import { Download, Share2 } from 'lucide-react';
import { loadCollection, saveCollection } from './lib/storage';
import { Anime } from './types';
import { SearchModal } from './components/SearchModal';
import { HeroCollage } from './components/HeroCollage';
import { ArchiveList } from './components/ArchiveList';
import { ExportView, ExportFormat } from './components/ExportView';
import { ExportModal } from './components/ExportModal';
import { ImageResultModal } from './components/ImageResultModal';

export default function App() {
  const [collection, setCollection] = useState<(Anime | null)[]>(Array(10).fill(null));
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchSlot, setSearchSlot] = useState<number | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('feed');
  const [isExporting, setIsExporting] = useState(false);
  const [exportCollection, setExportCollection] = useState<(Anime | null)[] | null>(null);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState<string>('');
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCollection().then((data) => {
      setCollection(data);
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveCollection(collection);
    }
  }, [collection, isLoaded]);

  // Pre-convert images to Base64 in background as soon as export modal opens
  useEffect(() => {
    if (isExportModalOpen) {
      let isMounted = true;
      const convert = async () => {
        const base64List = await Promise.all(
          collection.map(async (anime) => {
            if (!anime) return null;
            try {
              const res = await fetch(anime.imageUrl, { cache: 'no-cache' });
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              const blob = await res.blob();
              const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
              return { ...anime, imageUrl: base64 };
            } catch (e) {
              return anime;
            }
          })
        );
        if (isMounted) {
          setExportCollection(base64List);
        }
      };
      convert();
      return () => { isMounted = false; };
    }
  }, [isExportModalOpen, collection]);

  const handleSelectAnime = (anime: Anime) => {
    let targetIndex = searchSlot;
    
    // Find the first empty slot if no specific slot was requested
    if (targetIndex === null) {
      targetIndex = collection.findIndex((item) => item === null);
    }
    
    // Check for duplicates
    const isDuplicate = collection.some(a => a?.id === anime.id);
    if (isDuplicate) {
      alert('This title is already in your archive.');
      return;
    }

    if (targetIndex !== null && targetIndex !== -1) {
      setCollection(prev => {
        const next = [...prev];
        next[targetIndex as number] = anime;
        return next;
      });
    }
    setSearchSlot(null);
  };

  const handleRemove = (index: number) => {
    setCollection(prev => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  const handleExport = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);
    
    try {
      // 1. Ensure Base64 images are populated (fall back if pre-conversion hasn't finished)
      let currentCollection = exportCollection;
      if (!currentCollection) {
        currentCollection = await Promise.all(
          collection.map(async (anime) => {
            if (!anime) return null;
            try {
              const res = await fetch(anime.imageUrl, { cache: 'no-cache' });
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              const blob = await res.blob();
              const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
              return { ...anime, imageUrl: base64 };
            } catch (e) {
              return anime;
            }
          })
        );
        setExportCollection(currentCollection);
      }
      
      // Brief pause to allow React DOM update for the export target
      await new Promise(res => setTimeout(res, 150));

      const exportOptions = { 
        quality: 0.95,
        pixelRatio: 2, 
        backgroundColor: '#0A0A0C',
        useCORS: true,
      };

      // 2. Warm up render to ensure Base64 images decode inside SVG canvas
      await toJpeg(exportRef.current, exportOptions).catch(() => {});

      // 3. Render final image
      const dataUrl = await toJpeg(exportRef.current, exportOptions);
      const fileName = `my-best-anime-archive-${exportFormat}.jpg`;
      
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      let sharedSuccessfully = false;

      // Try native share sheet immediately on mobile devices
      if (isMobile && typeof navigator.canShare === 'function') {
        try {
          const response = await fetch(dataUrl);
          const blob = await response.blob();
          const file = new File([blob], fileName, { type: 'image/jpeg' });

          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: "My Best Anime — Archive"
            });
            sharedSuccessfully = true;
          }
        } catch (err: any) {
          console.warn('Native share was cancelled or unavailable', err);
        }
      }

      // If on desktop or if native mobile share didn't complete, open result viewer modal
      setIsExportModalOpen(false);
      setResultFileName(fileName);
      setResultImageUrl(dataUrl);

      // On desktop, also trigger immediate file download
      if (!isMobile && !sharedSuccessfully) {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        link.click();
      }

    } catch (err) {
      console.error('Export failed', err);
      alert('Failed to generate export poster. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isLoaded) {
    return <div className="min-h-screen bg-editorial-dark flex items-center justify-center text-editorial-muted font-mono uppercase text-sm tracking-widest">Loading Archive...</div>;
  }

  const selectedCount = collection.filter(Boolean).length;

  return (
    <div className={`min-h-screen selection:bg-editorial-accent selection:text-editorial-light ${isExporting ? 'exporting' : ''}`}>
      
      {/* Fixed Header Actions */}
      <header className="fixed bottom-8 left-0 right-0 flex justify-center z-40 pointer-events-none px-4 md:top-8 md:bottom-auto md:right-12 md:left-auto">
        <div className="pointer-events-auto flex items-center shadow-2xl">
          {selectedCount > 0 && (
            <button
              onClick={() => setIsExportModalOpen(true)}
              disabled={isExporting}
              className="bg-editorial-light text-editorial-dark hover:bg-white px-8 py-4 font-mono text-xs uppercase tracking-widest flex items-center transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Export Archive</span>
              <Download className="w-4 h-4 ml-3" />
            </button>
          )}
        </div>
      </header>

      <main>
        <HeroCollage 
          collection={collection} 
          onOpenSearch={() => setSearchSlot(collection.findIndex(a => !a))} 
        />
        <ArchiveList 
          collection={collection} 
          onUpdate={setCollection}
          onOpenSearch={setSearchSlot}
          onRemove={handleRemove}
        />
        
        <footer className="bg-editorial-light pt-12 pb-8 flex justify-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-editorial-muted/40 hover:text-editorial-muted transition-colors">
            © 2026 レム
          </p>
        </footer>
      </main>

      <SearchModal 
        isOpen={searchSlot !== null} 
        onClose={() => setSearchSlot(null)}
        onSelect={handleSelectAnime}
        targetSlot={searchSlot}
      />

      <ExportModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        collection={collection}
        format={exportFormat}
        onFormatChange={setExportFormat}
        onExport={handleExport}
        isExporting={isExporting}
        previewRef={exportRef}
      />

      <ImageResultModal
        isOpen={!!resultImageUrl}
        onClose={() => setResultImageUrl(null)}
        imageUrl={resultImageUrl}
        fileName={resultFileName}
      />

      <ExportView 
        collection={exportCollection || collection} 
        format={exportFormat}
        exportRef={exportRef} 
      />
    </div>
  );
}

