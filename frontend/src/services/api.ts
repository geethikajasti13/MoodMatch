import type { ContentRecord, ContentType, MoodInterpretation } from '@/types';
import { CONTENT } from '@/data/content';
import { scoreContent, interpretMood as localInterpretMood } from './moodEngine';

/**
 * ApiClient — communicates with the Express + MongoDB backend.
 * Normalizes backend MongoDB Content documents to the frontend ContentRecord interface.
 * If the backend is not running, gracefully falls back to the bundled dataset.
 */

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';
const FALLBACK_ENABLED = (import.meta as any).env?.VITE_ALLOW_FALLBACK !== 'false';

let backendReachable: boolean | null = null;
let lastCheckTime = 0;
const CHECK_CACHE_MS = 5000; // recheck health every 5 seconds if down

export async function checkBackend(force = false): Promise<boolean> {
  const now = Date.now();
  if (!force && backendReachable !== null && now - lastCheckTime < CHECK_CACHE_MS) {
    return backendReachable;
  }
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch(`${API_BASE}/health`, { signal: ctrl.signal });
    clearTimeout(t);
    backendReachable = res.ok;
  } catch {
    backendReachable = false;
  }
  lastCheckTime = now;
  return backendReachable;
}

/**
 * Maps known titles or categories to high-quality fallback artwork
 * when a database record has no posterUrl.
 */
function getFallbackCover(type: ContentType, title: string): string {
  const lowerTitle = (title || '').toLowerCase();
  const match = CONTENT.find((c) => c.title.toLowerCase() === lowerTitle);
  if (match && match.coverUrl) {
    return match.coverUrl;
  }
  // Generic beautiful aesthetic fallbacks by type
  if (type === 'book') {
    return 'https://images.pexels.com/photos/1132577/pexels-photo-1132577.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
  }
  if (type === 'series') {
    return 'https://images.pexels.com/photos/10313368/pexels-photo-10313368.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
  }
  return 'https://images.pexels.com/photos/10252811/pexels-photo-10252811.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
}

/**
 * Normalizes a raw backend MongoDB document to the frontend ContentRecord format.
 */
export function normalizeContent(raw: any): ContentRecord {
  const type = ((raw.contentType || raw.type || 'movie') as string).toLowerCase() as ContentType;
  const title = raw.title || 'Untitled';
  const coverUrl =
    (raw.posterUrl && raw.posterUrl.trim() !== '') ? raw.posterUrl
    : (raw.coverUrl && raw.coverUrl.trim() !== '') ? raw.coverUrl
    : getFallbackCover(type, title);

  return {
    _id: String(raw._id || raw.id),
    title,
    type,
    contentType: type,
    creator: raw.creator || raw.platform || (type === 'book' ? 'Author' : 'Producer'),
    platform: raw.platform || '',
    year: raw.year || (raw.createdAt ? new Date(raw.createdAt).getFullYear() : 2024),
    genres: Array.isArray(raw.genres) ? raw.genres : [],
    moods: Array.isArray(raw.moods) ? raw.moods : [],
    experiences: Array.isArray(raw.experiences) ? raw.experiences : [],
    intensity: raw.intensity || 'medium',
    description: raw.description || '',
    themes: Array.isArray(raw.themes) ? raw.themes : (Array.isArray(raw.experiences) ? raw.experiences : []),
    coverUrl,
    posterUrl: raw.posterUrl || '',
    externalUrl: raw.externalUrl || '',
    isNetflixOriginal: Boolean(raw.isNetflixOriginal),
    runtimeNote: raw.runtimeNote || (type === 'book' ? 'Book' : type === 'series' ? 'Series' : 'Movie'),
    source: raw.source || raw.platform || 'MoodMatch Catalog',
    bookCount: raw.bookCount,
    matchScore: raw.matchScore,
    matchReason: raw.matchReason,
  };
}

export async function fetchAllContent(): Promise<ContentRecord[]> {
  if (await checkBackend()) {
    try {
      const res = await fetch(`${API_BASE}/content`);
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json) ? json : (json.data || []);
        if (Array.isArray(list) && list.length > 0) {
          return list.map(normalizeContent);
        }
      }
    } catch (err) {
      console.warn('[API] Failed to fetch content from backend, falling back:', err);
    }
  }
  return FALLBACK_ENABLED ? CONTENT : [];
}

export async function fetchContentById(id: string): Promise<ContentRecord | null> {
  if (await checkBackend()) {
    try {
      const res = await fetch(`${API_BASE}/content/${id}`);
      if (res.ok) {
        const json = await res.json();
        const item = json.data || json;
        if (item) return normalizeContent(item);
      }
    } catch (err) {
      console.warn('[API] Failed to fetch content by ID from backend:', err);
    }
  }
  return FALLBACK_ENABLED ? CONTENT.find((c) => c._id === id) || null : null;
}

export interface DiscoverFilters {
  search?: string;
  type?: string;
  genre?: string;
  mood?: string;
  intensity?: string;
}

// Maps frontend intensity labels to backend schema values if needed
function mapIntensityForBackend(intensity?: string): string | undefined {
  if (!intensity) return undefined;
  const lower = intensity.toLowerCase();
  if (lower === 'light') return 'low';
  if (lower === 'moderate') return 'medium';
  if (lower === 'intense') return 'high';
  return lower;
}

export async function fetchFiltered(filters: DiscoverFilters): Promise<ContentRecord[]> {
  if (await checkBackend()) {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.type && filters.type !== 'all') params.append('type', filters.type);
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.mood) params.append('mood', filters.mood);
      if (filters.intensity) {
        const mapped = mapIntensityForBackend(filters.intensity);
        if (mapped) params.append('intensity', mapped);
      }

      const res = await fetch(`${API_BASE}/content?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json) ? json : (json.data || []);
        return list.map(normalizeContent);
      }
    } catch (err) {
      console.warn('[API] Failed filtered content request from backend:', err);
    }
  }
  return localFilter(CONTENT, filters);
}

export interface RecommendationResult {
  recommendations: ContentRecord[];
  interpretation?: MoodInterpretation;
}

/**
 * Sends natural language query to POST /api/recommend endpoint.
 */
export async function fetchRecommendationsWithDetails(
  query: string,
  contentType: string = 'all'
): Promise<RecommendationResult> {
  const trimmed = query.trim();
  if (await checkBackend()) {
    try {
      const res = await fetch(`${API_BASE}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response: trimmed,
          contentType: contentType || 'all',
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const rawRecs = Array.isArray(json.recommendations) ? json.recommendations : [];
        const recommendations = rawRecs.map(normalizeContent);

        const interpretation: MoodInterpretation = {
          primaryMoods: Array.isArray(json.inferredMoods) ? json.inferredMoods : [],
          detectedThemes: Array.isArray(json.desiredExperiences) ? json.desiredExperiences : [],
          intensity: json.intensity || 'medium',
          toneSummary: Array.isArray(json.desiredExperiences) && json.desiredExperiences.length > 0
            ? `Seeking ${json.desiredExperiences.join(', ')}`
            : `Reflecting ${json.inferredMoods?.join(', ') || 'your input'}`,
          keywords: Array.isArray(json.inferredMoods) ? json.inferredMoods : [],
        };

        return { recommendations, interpretation };
      }
    } catch (err) {
      console.warn('[API] Backend recommendation failed, using local engine:', err);
    }
  }

  // Fallback to local rule engine
  const localInterp = localInterpretMood(trimmed);
  const localRecs = localRecommend(localInterp);
  return { recommendations: localRecs, interpretation: localInterp };
}

export async function fetchRecommendations(
  queryOrInterp: string | MoodInterpretation,
  contentType: string = 'all'
): Promise<ContentRecord[]> {
  if (typeof queryOrInterp === 'string') {
    const res = await fetchRecommendationsWithDetails(queryOrInterp, contentType);
    return res.recommendations;
  }
  const query = queryOrInterp.toneSummary || queryOrInterp.primaryMoods.join(' ') || 'entertaining story';
  const res = await fetchRecommendationsWithDetails(query, contentType);
  return res.recommendations;
}

function localRecommend(interp: MoodInterpretation): ContentRecord[] {
  return CONTENT.map((c) => ({ c, s: scoreContent(c.moods, interp) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.c);
}

function localFilter(items: ContentRecord[], f: DiscoverFilters): ContentRecord[] {
  return items.filter((c) => {
    if (f.type && c.type !== f.type) return false;
    if (f.genre && !c.genres.includes(f.genre)) return false;
    if (f.mood && !c.moods.includes(f.mood)) return false;
    if (f.intensity) {
      const mapped = mapIntensityForBackend(f.intensity);
      if (c.intensity !== f.intensity && c.intensity !== mapped) return false;
    }
    if (f.search) {
      const q = f.search.toLowerCase();
      const hay = `${c.title} ${c.creator} ${c.genres.join(' ')} ${c.themes.join(' ')}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function isUsingBackend(): Promise<boolean> {
  return checkBackend();
}
