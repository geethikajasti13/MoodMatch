import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, BookOpen, Film, Tv } from 'lucide-react';
import type { ContentRecord } from '@/types';
import { useBookmarks } from '@/hooks/useBookmarks';

const typeIcon = {
  book: BookOpen,
  movie: Film,
  series: Tv,
};

const typeBadge = {
  book: 'bg-cream-100 text-lavender-800',
  movie: 'bg-blush-100 text-blush-400',
  series: 'bg-lavender-100 text-lavender-700',
};

export default function ContentCard({ item }: { item: ContentRecord }) {
  const { isSaved, toggle } = useBookmarks();
  const saved = isSaved(item._id);
  const [imgError, setImgError] = useState(false);

  const itemType = ((item.type || item.contentType || 'movie').toLowerCase()) as 'book' | 'movie' | 'series';
  const Icon = typeIcon[itemType] || Film;
  const badgeClass = typeBadge[itemType] || typeBadge.movie;

  const coverSrc = (!imgError && item.coverUrl) ? item.coverUrl : '';

  return (
    <article className="card group animate-fade-up overflow-hidden hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/content/${item._id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-lavender-100 to-cream-100">
          {coverSrc ? (
            <img
              src={coverSrc}
              alt={`Cover art for ${item.title}`}
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
              <Icon size={40} className="mb-2 text-lavender-400" />
              <span className="font-serif text-sm font-semibold text-lavender-800 line-clamp-2">
                {item.title}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

          {/* Type Badge */}
          <span
            className={`absolute left-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm ${badgeClass}`}
          >
            <Icon size={12} />
            <span className="capitalize">{itemType}</span>
          </span>

          {/* Netflix Original Indicator */}
          {item.isNetflixOriginal && (
            <span className="absolute right-3 top-3 rounded-full bg-red-600/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm">
              Netflix Original
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <Link to={`/content/${item._id}`} className="min-w-0">
            <h3 className="truncate font-serif text-base font-semibold text-lavender-900 transition-colors group-hover:text-lavender-700">
              {item.title}
            </h3>
          </Link>
          <button
            onClick={() => toggle(item)}
            aria-label={saved ? 'Remove bookmark' : 'Add bookmark'}
            className={`shrink-0 rounded-lg p-1.5 transition-all ${
              saved ? 'text-lavender-600 hover:bg-lavender-50' : 'text-lavender-300 hover:bg-lavender-50 hover:text-lavender-500'
            }`}
          >
            {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        </div>

        <p className="mb-2 text-xs text-lavender-800/60">
          {item.creator || item.platform || 'MoodMatch Pick'} {item.year ? `· ${item.year}` : ''}
        </p>

        {item.matchReason && (
          <p className="mb-2 text-xs font-medium text-lavender-700 bg-lavender-50/80 px-2 py-1 rounded-md">
            ✨ {item.matchReason}
          </p>
        )}

        <p className="line-clamp-2 text-sm text-lavender-800/70">{item.description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.moods.slice(0, 3).map((m) => (
            <span key={m} className="rounded-full bg-lavender-50 px-2.5 py-0.5 text-xs text-lavender-700">
              {m}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
