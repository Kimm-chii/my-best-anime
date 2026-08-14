import React, { useState } from 'react';
import { X, Download, Share2, Check, ExternalLink, Sparkles } from 'lucide-react';

interface ImageResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  fileName: string;
}

export function ImageResultModal({
  isOpen,
  onClose,
  imageUrl,
  fileName,
}: ImageResultModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !imageUrl) return null;

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleNativeShare = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: 'image/jpeg' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Best Anime — Archive',
        });
      } else {
        triggerDownload();
      }
    } catch (err) {
      console.error('Share failed', err);
      triggerDownload();
    }
  };

  const triggerDownload = () => {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = imageUrl;
    link.click();
  };

  const handleOpenNewTab = () => {
    const newTab = window.open();
    if (newTab) {
      newTab.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${fileName}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                margin: 0;
                background-color: #0a0a0c;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
              }
              img {
                max-width: 100%;
                max-height: 100vh;
                object-fit: contain;
              }
            </style>
          </head>
          <body>
            <img src="${imageUrl}" alt="Exported Archive" />
          </body>
        </html>
      `);
      newTab.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-mono">
      <div className="bg-[#0A0A0C] border border-white/10 w-full max-w-2xl max-h-[92vh] flex flex-col rounded-xl shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-editorial-accent" />
            <h2 className="font-serif text-2xl text-[#F4F4F2] tracking-tight uppercase">
              Archive Ready
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#5A5A66] hover:text-[#F4F4F2] hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
          
          {/* Mobile Instruction Callout */}
          {isMobile && (
            <div className="w-full bg-white/5 border border-white/10 rounded-lg p-3 mb-4 text-xs text-[#F4F4F2]/90 flex items-center justify-center gap-2">
              <span>👇 <strong>Mobile Tip:</strong> Touch & hold the image below to save directly to your Photos!</span>
            </div>
          )}

          {/* Rendered Image Display */}
          <div className="relative max-h-[50vh] w-full flex items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-black/50 p-2 shadow-2xl">
            <img
              src={imageUrl}
              alt="Exported Anime Archive"
              className="max-h-[48vh] max-w-full object-contain rounded shadow-lg select-all"
            />
          </div>

          <p className="text-xs text-[#5A5A66] uppercase tracking-wider mt-3">
            {fileName}
          </p>
        </div>

        {/* Actions Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <button
            onClick={handleOpenNewTab}
            className="w-full sm:w-auto px-4 py-2.5 text-xs text-[#5A5A66] hover:text-[#F4F4F2] hover:bg-white/5 rounded uppercase tracking-widest flex items-center justify-center transition-colors"
          >
            <span>Open Fullscreen</span>
            <ExternalLink className="w-3.5 h-3.5 ml-2" />
          </button>

          <div className="w-full sm:w-auto flex items-center gap-3">
            {isMobile && typeof navigator.share === 'function' && (
              <button
                onClick={handleNativeShare}
                className="flex-1 sm:flex-none bg-white/10 text-[#F4F4F2] hover:bg-white/20 px-5 py-3 rounded font-mono text-xs uppercase tracking-widest flex items-center justify-center transition-all font-bold"
              >
                <span>Share</span>
                <Share2 className="w-4 h-4 ml-2" />
              </button>
            )}

            <button
              onClick={triggerDownload}
              className="flex-1 sm:flex-none bg-[#F4F4F2] text-[#0A0A0C] hover:bg-white px-6 py-3 rounded font-mono text-xs uppercase tracking-widest flex items-center justify-center transition-all font-bold shadow-lg"
            >
              <span>Download</span>
              <Download className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
