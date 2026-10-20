import type { ContentRecord } from '@/types';
import { checkBackend, normalizeContent } from './api';

const STORAGE_KEY = 'moodmatch:bookmarks';
const SESSION_KEY = 'moodmatch:sessionId';
const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

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
 * Returns saved bookmarks from local storage cache.
 */
export function getBookmarks(): ContentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getBookmarkIds(): string[] {
  return getBookmarks().map((b) => b._id);
}

export function isBookmarked(id: string): boolean {
  return getBookmarkIds().includes(id);
}

/**
 * Synchronizes saved content with the backend GET /api/saved endpoint.
 */
export async function syncBookmarksFromBackend(): Promise<ContentRecord[]> {
  const isUp = await checkBackend();
  if (!isUp) return getBookmarks();

  try {
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
        .filter((entry: any) => entry.contentId)
        .map((entry: any) => normalizeContent(entry.contentId));

      // Update local storage with backend records
      localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteBookmarks));
      window.dispatchEvent(new Event('bookmark-changed'));
      return remoteBookmarks;
    }
  } catch (err) {
    console.warn('[Bookmarks] Failed to sync bookmarks from backend:', err);
  }

  return getBookmarks();
}

/**
 * Toggles bookmark status and syncs with backend POST/DELETE /api/saved endpoints.
 */
export function toggleBookmark(item: ContentRecord): boolean {
  const current = getBookmarks();
  const idx = current.findIndex((b) => b._id === item._id);
  let nowBookmarked: boolean;

  if (idx >= 0) {
    current.splice(idx, 1);
    nowBookmarked = false;
    deleteFromBackend(item._id);
  } else {
    current.unshift(item);
    nowBookmarked = true;
    saveToBackend(item._id);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  window.dispatchEvent(new Event('bookmark-changed'));
  return nowBookmarked;
}

export function removeBookmark(id: string): void {
  const current = getBookmarks().filter((b) => b._id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  deleteFromBackend(id);
  window.dispatchEvent(new Event('bookmark-changed'));
}

async function saveToBackend(contentId: string) {
  try {
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
