import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Compass, BookmarkX } from 'lucide-react';
import type { ContentRecord } from '@/types';
import { useBookmarks } from '@/hooks/useBookmarks';
import ContentCard from '@/components/ContentCard';
import { CardGrid, EmptyState, ContentGridSkeleton } from '@/components/States';

export default function MyList() {
  const { all, loading } = useBookmarks();
  const [filter, setFilter] = useState('');

  // Deduplicate and filter items safely by type
  const items: ContentRecord[] = useMemo(() => {
    const list = filter
      ? all.filter((b) => (b.type || b.contentType || '').toLowerCase() === filter.toLowerCase())
      : all;

    // Guarantee unique and stable items by _id
    const seen = new Set<string>();
    const unique: ContentRecord[] = [];
    for (const item of list) {
      if (!item || !item._id) continue;
      const id = String(item._id);
      if (!seen.has(id)) {
        seen.add(id);
        unique.push(item);
      }
    }
    return unique;
  }, [all, filter]);

  return (
    <div className="mx-auto max-w-6xl px-5 pt-24 pb-12 md:pt-28">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-lavender-900">My List</h1>
          <p className="mt-1 text-sm text-lavender-800/65">
            {all.length === 0
              ? 'Your saved books, movies, and series will appear here.'
              : `${all.length} ${all.length === 1 ? 'item' : 'items'} saved.`}
          </p>
        </div>
        {all.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {[
              { v: '', l: 'All' },
              { v: 'book', l: 'Books' },
              { v: 'movie', l: 'Movies' },
              { v: 'series', l: 'Series' },
            ].map((t) => (
              <button
                key={t.v}
                onClick={() => setFilter(t.v)}
                className={`chip ${filter === t.v ? 'chip-on' : 'chip-off'}`}
              >
                {t.l}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && all.length === 0 ? (
        <ContentGridSkeleton count={4} />
      ) : all.length === 0 ? (
        <EmptyState
          title="Your list is empty"
          message="Bookmark titles you love and they'll show up here for easy access."
          icon={Heart}
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="Nothing in this category"
          message={`No ${filter}s in your list yet. Try another filter or discover more.`}
          icon={BookmarkX}
        />
      ) : (
        <CardGrid>
          {items.map((item) => (
            <ContentCard key={item._id} item={item} />
          ))}
        </CardGrid>
      )}

      {all.length > 0 && (
        <div className="mt-10 text-center">
          <Link to="/discover" className="btn-secondary">
            <Compass size={16} /> Discover more
          </Link>
        </div>
      )}
    </div>
  );
}
