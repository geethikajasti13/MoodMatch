import type { ContentRecord } from '@/types';
import { checkBackend, normalizeContent } from './api';

const STORAGE_KEY = 'moodmatch:bookmarks';
const SESSION_KEY = 'moodmatch:sessionId';
const API_BASE = (import.meta as any).env?.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

/**
 * Retrieves or generates an anonymous session identifier.
 * Persists in localStorage so the user retains their saved items across page refreshes.
 */
export function getSessionId(): string {
  try {
    let sid = localStorage.getItem(SESSION_KEY);
    if (!sid || sid.trim() === '') {
      sid =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : 'guest_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return 'guest_user';
  }
}

/**
 * Helper to deduplicate an array of content items by their unique _id.
 */
export function deduplicateBookmarks(items: ContentRecord[]): ContentRecord[] {
  const seen = new Set<string>();
  const result: ContentRecord[] = [];
  for (const item of items) {
    if (!item || !item._id) continue;
    const id = String(item._id).trim();
    if (id && !seen.has(id)) {
      seen.add(id);
      result.push(item);
    }
  }
  return result;
}

/**
 * Returns saved bookmarks from local storage cache, ensuring uniqueness.
 */
export function getBookmarks(): ContentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return deduplicateBookmarks(parsed);
  } catch {
    return [];
  }
}

export function getBookmarkIds(): string[] {
  return getBookmarks().map((b) => b._id);
}

export function isBookmarked(id: string): boolean {
  if (!id) return false;
  return getBookmarkIds().includes(String(id));
}

let syncPromise: Promise<ContentRecord[]> | null = null;
let lastSyncTime = 0;
const SYNC_COOLDOWN_MS = 2500;

/**
 * Synchronizes saved content with the backend GET /api/saved endpoint.
 * Coalesces concurrent calls into a single in-flight promise.
 * Avoids infinite event loops by only dispatching 'bookmark-changed' when data actually changes.
 */
export async function syncBookmarksFromBackend(force = false): Promise<ContentRecord[]> {
  const now = Date.now();
  if (syncPromise) {
    return syncPromise;
  }
  if (!force && now - lastSyncTime < SYNC_COOLDOWN_MS) {
    return getBookmarks();
  }

  syncPromise = (async () => {
    try {
      const isUp = await checkBackend();
      if (!isUp) return getBookmarks();

      const sid = getSessionId();
      const res = await fetch(`${API_BASE}/saved`, {
        headers: {
          'x-session-id': sid,
        },
      });

      if (res.ok) {
        const json = await res.json();
        const rawItems = Array.isArray(json.data) ? json.data : [];
        const remoteBookmarks: ContentRecord[] = rawItems
          .filter((entry: any) => entry && entry.contentId && typeof entry.contentId === 'object')
          .map((entry: any) => normalizeContent(entry.contentId));

        const deduplicated = deduplicateBookmarks(remoteBookmarks);
        const currentLocal = getBookmarks();

        // Compare IDs to see if an update is truly needed
        const currentIds = currentLocal.map((b) => b._id).sort().join(',');
        const newIds = deduplicated.map((b) => b._id).sort().join(',');

        lastSyncTime = Date.now();

        if (currentIds !== newIds || currentLocal.length !== deduplicated.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(deduplicated));
          window.dispatchEvent(new Event('bookmark-changed'));
          return deduplicated;
        }
      }
    } catch (err) {
      console.warn('[Bookmarks] Failed to sync bookmarks from backend:', err);
    } finally {
      syncPromise = null;
    }

    return getBookmarks();
  })();

  return syncPromise;
}

/**
 * Toggles bookmark status and syncs with backend POST/DELETE /api/saved endpoints.
 */
export function toggleBookmark(item: ContentRecord): boolean {
  if (!item || !item._id) return false;
  const current = getBookmarks();
  const itemId = String(item._id);
  const idx = current.findIndex((b) => String(b._id) === itemId);
  let nowBookmarked: boolean;

  if (idx >= 0) {
    current.splice(idx, 1);
    nowBookmarked = false;
    deleteFromBackend(itemId);
  } else {
    current.unshift(item);
    nowBookmarked = true;
    saveToBackend(itemId);
  }

  const clean = deduplicateBookmarks(current);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
  lastSyncTime = Date.now(); // Cooldown to allow backend to persist before sync
  window.dispatchEvent(new Event('bookmark-changed'));
  return nowBookmarked;
}

export function removeBookmark(id: string): void {
  if (!id) return;
  const targetId = String(id);
  const current = getBookmarks().filter((b) => String(b._id) !== targetId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  lastSyncTime = Date.now();
  deleteFromBackend(targetId);
  window.dispatchEvent(new Event('bookmark-changed'));
}

async function saveToBackend(contentId: string) {
  try {
    // Only attempt MongoDB save if contentId is a valid 24-character hex ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(contentId)) return;
    const isUp = await checkBackend();
    if (!isUp) return;
    const sid = getSessionId();
    await fetch(`${API_BASE}/saved`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sid,
      },
      body: JSON.stringify({ contentId, sessionId: sid }),
    });
  } catch (err) {
    console.warn('[Bookmarks] Failed to save bookmark to backend:', err);
  }
}

async function deleteFromBackend(contentId: string) {
  try {
    if (!/^[0-9a-fA-F]{24}$/.test(contentId)) return;
    const isUp = await checkBackend();
    if (!isUp) return;
    const sid = getSessionId();
    await fetch(`${API_BASE}/saved/${contentId}`, {
      method: 'DELETE',
      headers: {
        'x-session-id': sid,
      },
    });
  } catch (err) {
    console.warn('[Bookmarks] Failed to delete bookmark from backend:', err);
  }
}
