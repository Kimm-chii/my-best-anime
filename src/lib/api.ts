import { Anime } from '../types';

const CACHE = new Map<string, Anime[]>();
const SESSION_CACHE_PREFIX = 'anilist_search_cache_';
const CACHE_TTL_MS = 60 * 60 * 1000; // 60 minutes TTL

interface CacheEntry {
  timestamp: number;
  data: Anime[];
}

function getSessionCache(cacheKey: string): Anime[] | null {
  try {
    const raw = sessionStorage.getItem(SESSION_CACHE_PREFIX + cacheKey);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (!entry || typeof entry.timestamp !== 'number' || !Array.isArray(entry.data)) {
      sessionStorage.removeItem(SESSION_CACHE_PREFIX + cacheKey);
      return null;
    }
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      sessionStorage.removeItem(SESSION_CACHE_PREFIX + cacheKey);
      return null;
    }
    return entry.data;
  } catch (e) {
    // Graceful fallback if sessionStorage is disabled or malformed
    return null;
  }
}

function setSessionCache(cacheKey: string, data: Anime[]): void {
  try {
    const entry: CacheEntry = {
      timestamp: Date.now(),
      data,
    };
    sessionStorage.setItem(SESSION_CACHE_PREFIX + cacheKey, JSON.stringify(entry));
  } catch (e) {
    // Graceful fallback if quota exceeded or sessionStorage disabled
  }
}

export async function searchAnime(query: string): Promise<Anime[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const cacheKey = trimmed.toLowerCase();

  // 1. Check in-memory cache
  if (CACHE.has(cacheKey)) {
    console.log(`[Search Cache] In-memory hit for: "${trimmed}"`);
    return CACHE.get(cacheKey)!;
  }

  // 2. Check sessionStorage cache
  const sessionData = getSessionCache(cacheKey);
  if (sessionData) {
    console.log(`[Search Cache] sessionStorage hit for: "${trimmed}"`);
    CACHE.set(cacheKey, sessionData);
    return sessionData;
  }

  // 3. Request AniList API
  console.log(`[Search API] Requesting AniList API for: "${trimmed}"`);

  const graphqlQuery = `
  query ($search: String) {
    Page(page: 1, perPage: 20) {
      media(search: $search, type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
        id
        title {
          romaji
          english
        }
        coverImage {
          extraLarge
          large
        }
        seasonYear
        format
        episodes
        genres
        tags {
          name
        }
      }
    }
  }
  `;

  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables: { search: trimmed }
      })
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn(`[Search API] Rate limit failure (${response.status}) for: "${trimmed}"`);
      } else {
        console.warn(`[Search API] Possible rate-limit/API failure (${response.status}) for: "${trimmed}"`);
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const json = await response.json();
    
    if (json.errors && json.errors.length > 0) {
      console.warn(`[Search API] Possible rate-limit/API failure (GraphQL errors) for: "${trimmed}"`, json.errors);
      throw new Error('GraphQL Errors');
    }

    const rawMedia = json.data?.Page?.media || [];
    
    const filteredMedia = rawMedia.filter((item: any) => {
      const genres = item.genres || [];
      const tags = (item.tags || []).map((t: any) => t.name.toLowerCase());
      
      if (genres.includes('Hentai')) return false;
      
      const nsfwTags = ['hentai', 'softcore hentai', 'explicit'];
      if (tags.some((tag: string) => nsfwTags.includes(tag))) {
        return false;
      }
      
      return true;
    }).slice(0, 10);
    
    const results: Anime[] = filteredMedia.map((item: any) => ({
      id: item.id,
      title: item.title?.romaji || item.title?.english || 'Untitled',
      titleEnglish: item.title?.english || '',
      imageUrl: item.coverImage?.extraLarge || item.coverImage?.large || '',
      year: item.seasonYear,
      type: item.format,
      episodes: item.episodes,
    }));

    console.log(`[Search API] Successful response for: "${trimmed}"`);
    CACHE.set(cacheKey, results);
    setSessionCache(cacheKey, results);
    return results;
  } catch (err: any) {
    if (err instanceof TypeError || err?.name === 'TypeError' || err?.message?.includes('Failed to fetch')) {
      console.warn(`[Search API] Network/CORS failure for: "${trimmed}"`, err);
    } else if (!err?.message?.includes('HTTP') && !err?.message?.includes('GraphQL')) {
      console.warn(`[Search API] Possible rate-limit/API failure for: "${trimmed}"`, err);
    }
    throw new Error('AniList unavailable. Search is temporarily unavailable.');
  }
}
