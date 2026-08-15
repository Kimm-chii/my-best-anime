import React, { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { searchAnime } from '../lib/api';
import { Anime } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (anime: Anime) => void;
  targetSlot: number | null;
}

export function SearchModal({ isOpen, onClose, onSelect, targetSlot }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 500);
  const [results, setResults] = useState<Anime[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    let active = true;
    
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setError(null);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setError(null);
      
      try {
        const data = await searchAnime(debouncedQuery);
        if (active) {
          setResults(data);
          setIsSearching(false);
        }
      } catch (err: any) {
        if (active) {
          setError(err?.message || 'AniList is temporarily unavailable. Search will return once the service is restored.');
          setResults([]);
          setIsSearching(false);
        }
      }
    };

    fetchResults();
    return () => { active = false; };
  }, [debouncedQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 bg-editorial-dark/90 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-editorial-light text-editorial-dark border border-editorial-dark/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header / Input */}
        <div className="flex items-center p-4 border-b border-editorial-dark/10">
          <Search className="w-5 h-5 text-editorial-muted mr-3" />
          <input
            type="text"
            autoFocus
            placeholder={`SEARCH ARCHIVE FOR SLOT ${targetSlot !== null ? String(targetSlot + 1).padStart(2, '0') : ''}...`}
            className="flex-1 bg-transparent text-lg font-mono placeholder:text-editorial-muted/50 focus:outline-none uppercase"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="p-2 hover:bg-black/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isSearching && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-editorial-muted" />
            </div>
          )}
          
          {!isSearching && error && (
            <div className="text-center py-12 font-mono text-sm text-red-900/70 uppercase">
              {error}
            </div>
          )}
          
          {!isSearching && !error && query.trim() && results.length === 0 && (
            <div className="text-center py-12 font-mono text-sm text-editorial-muted uppercase">
              NO RECORDS FOUND.
            </div>
          )}

          {!isSearching && !error && results.map((anime) => (
            <button
              key={anime.id}
              onClick={() => onSelect(anime)}
              className="w-full text-left flex gap-4 p-3 hover:bg-black/5 transition-colors group border border-transparent hover:border-black/10"
            >
              <div className="w-12 h-16 bg-black/10 flex-shrink-0 overflow-hidden">
                {anime.imageUrl ? (
                  <img src={anime.imageUrl} alt="" crossOrigin="anonymous" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                ) : null}
              </div>
              <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
                <h3 className="font-serif text-xl leading-tight truncate">{anime.title}</h3>
                <div className="flex gap-3 text-xs font-mono text-editorial-muted uppercase">
                  <span>{anime.year || '----'}</span>
                  <span>{anime.type || 'UNKNOWN'}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
