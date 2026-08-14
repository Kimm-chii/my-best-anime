import React, { useState, useEffect, useRef } from 'react';
import { toJpeg } from 'html-to-image';
import { Download } from 'lucide-react';
import { loadCollection, saveCollection } from './lib/storage';
import { Anime } from './types';
import { SearchModal } from './components/SearchModal';
import { HeroCollage } from './components/HeroCollage';
import { ArchiveList } from './components/ArchiveList';
import { ExportView } from './components/ExportView';

export default function App() {
  const [collection, setCollection] = useState<(Anime | null)[]>(Array(10).fill(null));
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchSlot, setSearchSlot] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [debugLog, setDebugLog] = useState<string | null>(null);
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
    
    // Allow React state to flush 'exporting' changes if needed for UI disabling
    await new Promise(res => setTimeout(res, 100));

    try {
      const dataUrl = await toJpeg(exportRef.current, { 
        quality: 0.95,
        pixelRatio: 2, 
        backgroundColor: '#0A0A0C',
        fetchRequestInit: {
          cache: 'no-cache',
        },
      });
      
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'my-best-anime-archive.jpg', { type: 'image/jpeg' });
      
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const canShareExists = typeof navigator.canShare === 'function';
      const shareExists = typeof navigator.share === 'function';
      const isSecure = window.isSecureContext;
      
      let canShareResult = false;
      try {
        if (canShareExists) {
          canShareResult = navigator.canShare({ files: [file] });
        }
      } catch (e) {
        console.error(e);
      }

      let isTopFrame = 'unknown';
      try {
        isTopFrame = String(window.top === window.self);
      } catch (e) {
        isTopFrame = 'error (cross-origin)';
      }

      const logLines = [
        `-- Environment Context --`,
        `location.href: ${window.location.href}`,
        `location.protocol: ${window.location.protocol}`,
        `isSecureContext: ${isSecure}`,
        `top === self: ${isTopFrame}`,
        `document.referrer: ${document.referrer || '(empty)'}`,
        `-- Share API --`,
        `navigator.share exists: ${shareExists}`,
        `navigator.canShare exists: ${canShareExists}`,
        `File type: ${file.type}`,
        `File size: ${file.size} bytes`,
        `canShare({ files: [file] }): ${canShareResult}`,
        `userAgent: ${navigator.userAgent}`,
        `-- Action Log --`
      ];

      setDebugLog(logLines.join('\n'));
      
      if (canShareResult) {
        setDebugLog(prev => prev + '\nCalling navigator.share()...');
        try {
          await navigator.share({
            files: [file],
            title: "My Best Anime — Archive"
          });
          setDebugLog(prev => prev + '\nShare completed or cancelled safely.');
        } catch (err: any) {
          if (err.name === 'AbortError') {
            setDebugLog(prev => prev + '\nShare cancelled by user (AbortError)');
          } else {
            setDebugLog(prev => prev + `\nShare failed: ${err.name} - ${err.message}`);
          }
        }
      } else {
        setDebugLog(prev => prev + '\nSkipping share. canShare() returned false or threw error.');
      }
      
      // Fallback explicitly disabled for diagnostics
      // if (!shared) { ... }
    } catch (err) {
      console.error('Export failed', err);
      setDebugLog(prev => (prev || '') + `\nExport generation failed: ${err}`);
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
              onClick={handleExport}
              disabled={isExporting}
              className="bg-editorial-light text-editorial-dark hover:bg-white px-8 py-4 font-mono text-xs uppercase tracking-widest flex items-center transition-all disabled:opacity-50"
            >
              {isExporting ? 'Compiling...' : 'Export Archive'}
              {!isExporting && <Download className="w-4 h-4 ml-3" />}
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

      <ExportView collection={collection} exportRef={exportRef} />

      {debugLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
          <div className="bg-black text-green-400 font-mono text-xs p-4 rounded border border-green-500/30 w-full max-w-md overflow-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-4 border-b border-green-500/30 pb-2">
              <h3 className="font-bold tracking-widest uppercase">Export Diagnostic</h3>
              <button 
                onClick={() => setDebugLog(null)} 
                className="text-white hover:text-green-400 px-2 py-1 uppercase tracking-widest"
              >
                Close
              </button>
            </div>
            <pre className="whitespace-pre-wrap break-words leading-relaxed">{debugLog}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

