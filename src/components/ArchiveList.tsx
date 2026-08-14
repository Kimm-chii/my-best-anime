import React from 'react';
import { Anime } from '../types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Search, Plus } from 'lucide-react';

interface ArchiveListProps {
  collection: (Anime | null)[];
  onUpdate: (newCollection: (Anime | null)[]) => void;
  onOpenSearch: (slotIndex: number) => void;
  onRemove: (slotIndex: number) => void;
}

function SortableSlot({ 
  id, 
  index, 
  anime, 
  onOpenSearch, 
  onRemove 
}: { 
  id: string; 
  index: number; 
  anime: Anime | null;
  onOpenSearch: () => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.9 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`flex items-stretch gap-3 p-3 border-b border-editorial-dark/10 bg-editorial-light group ${isDragging ? 'shadow-xl ring-1 ring-editorial-dark/20' : ''}`}
    >
      <div className="flex items-center text-editorial-muted/30 hover:text-editorial-dark cursor-grab active:cursor-grabbing p-1" {...attributes} {...listeners}>
        <GripVertical className="w-4 h-4" />
      </div>
      
      <div className="flex-shrink-0 w-8 text-sm font-mono text-editorial-muted pt-2 text-right">
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="flex-1 flex gap-4 min-w-0">
        {anime ? (
          <>
            <div className="w-14 h-20 bg-black/5 flex-shrink-0 relative overflow-hidden group-hover:shadow-md transition-shadow">
              <img src={anime.imageUrl} alt="" crossOrigin="anonymous" className="w-full h-full object-cover transition-all duration-500" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
              <div>
                <h3 className="font-serif text-lg md:text-xl leading-tight line-clamp-2">{anime.title}</h3>
                <div className="text-[11px] font-mono text-editorial-muted uppercase mt-1">
                  <span>{anime.year || '----'}</span>
                  <span className="mx-2">/</span>
                  <span>{anime.type || 'UNKNOWN'}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity no-export">
                <button onClick={onOpenSearch} className="text-[10px] uppercase font-mono tracking-widest bg-editorial-dark/5 hover:bg-editorial-dark text-editorial-dark hover:text-editorial-light px-2 py-1 transition-colors">Replace</button>
                <button onClick={onRemove} className="text-[10px] uppercase font-mono tracking-widest border border-editorial-dark/10 hover:border-red-900/50 hover:bg-red-900/10 text-red-900/70 px-2 py-1 transition-colors">Remove</button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center">
            <button 
              onClick={onOpenSearch}
              className="w-full border border-dashed border-editorial-dark/20 hover:border-editorial-dark hover:bg-black/5 flex items-center justify-center text-editorial-muted hover:text-editorial-dark transition-colors h-20 no-export"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="font-mono text-[11px] uppercase tracking-widest">Select Title</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ArchiveList({ collection, onUpdate, onOpenSearch, onRemove }: ArchiveListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const items = collection.map((item, i) => ({ id: `slot-${i}`, anime: item, originalIndex: i }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      
      const newCollection = arrayMove(collection, oldIndex, newIndex);
      onUpdate(newCollection);
    }
  };

  return (
    <section className="bg-editorial-light text-editorial-dark py-4 px-4 md:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end mb-4 border-b border-editorial-dark/20 pb-2">
          <div>
            <h2 className="font-serif text-4xl uppercase tracking-tight">The Archive</h2>
            <p className="font-mono text-xs uppercase text-editorial-muted mt-1">
              Curated Selections
            </p>
          </div>
          <div className="font-mono text-xs uppercase text-editorial-muted mt-4 md:mt-0">
            {collection.filter(Boolean).length} / 10 Compiled
          </div>
        </div>

        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {/* Using a grid layout that flows columns to match the 1-5 Left, 6-10 Right requirement natively */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-flow-col md:grid-rows-5 gap-x-6 gap-y-0">
            <SortableContext 
              items={items.map(i => i.id)}
              strategy={rectSortingStrategy}
            >
              {items.map((item, index) => (
                <div key={item.id} className="break-inside-avoid">
                  <SortableSlot 
                    id={item.id} 
                    index={index} 
                    anime={item.anime} 
                    onOpenSearch={() => onOpenSearch(index)}
                    onRemove={() => onRemove(index)}
                  />
                </div>
              ))}
            </SortableContext>
          </div>
        </DndContext>
      </div>
    </section>
  );
}
