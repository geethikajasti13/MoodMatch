import { useEffect, useState, useCallback } from 'react';
import type { ContentRecord } from '@/types';
import {
  getBookmarkIds,
  toggleBookmark as toggle,
  getBookmarks,
  syncBookmarksFromBackend,
} from '@/services/bookmarks';

export function useBookmarks() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const update = () => setIds(getBookmarkIds());
    update();

    // Sync saved items with backend if running
    syncBookmarksFromBackend().then(() => update());

    window.addEventListener('storage', update);
    window.addEventListener('bookmark-changed', update);
    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener('bookmark-changed', update);
    };
  }, []);

  const toggleItem = useCallback((item: ContentRecord) => {
    toggle(item);
    setIds(getBookmarkIds());
    window.dispatchEvent(new Event('bookmark-changed'));
  }, []);

  return {
    ids,
    isSaved: (id: string) => ids.includes(id),
    toggle: toggleItem,
    all: getBookmarks(),
  };
}
