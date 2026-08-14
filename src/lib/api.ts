import { Anime } from '../types';

const CACHE = new Map<string, Anime[]>();

export async function searchAnime(query: string): Promise<Anime[]> {
  if (!query.trim()) return [];
  const cacheKey = query.toLowerCase();
  if (CACHE.has(cacheKey)) {
    return CACHE.get(cacheKey)!;
  }

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
        variables: { search: query }
      })
    });

    if (!response.ok) {
      throw new Error(`AniList API Error: ${response.status}`);
    }

    const json = await response.json();
    
    const rawMedia = json.data.Page.media || [];
    
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
      title: item.title.romaji || item.title.english,
      titleEnglish: item.title.english || '',
      imageUrl: item.coverImage?.extraLarge || item.coverImage?.large || '',
      year: item.seasonYear,
      type: item.format,
      episodes: item.episodes,
    }));

    CACHE.set(cacheKey, results);
    return results;
  } catch (err) {
    console.warn('Anime search failed', err);
    throw err;
  }
}
