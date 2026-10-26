import { useEffect, useState, useCallback, useMemo } from 'react';
import type { ContentRecord } from '@/types';
import {
  toggleBookmark as toggle,
  getBookmarks,
  syncBookmarksFromBackend,
} from '@/services/bookmarks';

export function useBookmarks() {
  const [all, setAll] = useState<ContentRecord[]>(() => getBookmarks());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const update = () => {
      if (mounted) {
        setAll(getBookmarks());
      }
    };

    update();

    // Sync saved items with backend if running
    syncBookmarksFromBackend()
      .then(() => {
        if (mounted) update();
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    window.addEventListener('storage', update);
    window.addEventListener('bookmark-changed', update);
    return () => {
      mounted = false;
      window.removeEventListener('storage', update);
      window.removeEventListener('bookmark-changed', update);
    };
  }, []);

  const ids = useMemo(() => all.map((b) => String(b._id)), [all]);

  const toggleItem = useCallback((item: ContentRecord) => {
    toggle(item);
    setAll(getBookmarks());
  }, []);

  return {
    ids,
    isSaved: (id: string) => ids.includes(String(id)),
    toggle: toggleItem,
    all,
    loading,
  };
}
