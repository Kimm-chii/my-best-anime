import localforage from 'localforage';
import { Anime } from '../types';

localforage.config({
  name: 'MyBestAnime',
  storeName: 'collection',
  description: 'Stores the user\'s top 10 anime collection'
});

const STORE_KEY = 'anime_collection_v1';

export async function saveCollection(collection: (Anime | null)[]): Promise<void> {
  try {
    await localforage.setItem(STORE_KEY, collection);
  } catch (err) {
    console.error('Failed to save collection to IndexedDB', err);
    // Fallback to localStorage
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(collection));
    } catch (e) {
      console.error('Fallback localStorage save failed', e);
    }
  }
}

export async function loadCollection(): Promise<(Anime | null)[]> {
  const defaultCollection = Array(10).fill(null);
  
  try {
    const data = await localforage.getItem<(Anime | null)[]>(STORE_KEY);
    if (data && Array.isArray(data) && data.length === 10) {
      return data;
    }
    
    // Check fallback
    const fallback = localStorage.getItem(STORE_KEY);
    if (fallback) {
      const parsed = JSON.parse(fallback);
      if (Array.isArray(parsed) && parsed.length === 10) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load collection', err);
  }
  
  return defaultCollection;
}
