import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Film,
  Tv,
  Tag,
  Gauge,
  Calendar,
  Clock,
  User,
  ExternalLink,
  Tv2
} from 'lucide-react';
import type { ContentRecord } from '@/types';
import { fetchContentById, fetchRecommendations } from '@/services/api';
import { interpretMood } from '@/services/moodEngine';
import { useBookmarks } from '@/hooks/useBookmarks';
import ContentCard from '@/components/ContentCard';
import { CardGrid, LoadingState, ErrorState, EmptyState } from '@/components/States';

const typeIcon = { book: BookOpen, movie: Film, series: Tv };

export default function ContentDetail() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<ContentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [related, setRelated] = useState<ContentRecord[]>([]);
  const [imgError, setImgError] = useState(false);
  const { isSaved, toggle } = useBookmarks();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setImgError(false);

    fetchContentById(id)
      .then((data) => {
        setItem(data);
        setLoading(false);
        if (data && data.moods.length > 0) {
          // Find related content by shared moods
          const interp = interpretMood(`something ${data.moods.slice(0, 3).join(' ')}`);
          fetchRecommendations(interp).then((recs) =>
            setRelated(recs.filter((r) => r._id !== data._id).slice(0, 4))
          );
        }
      })
      .catch(() => {
        setError('Could not load this title. Please try again.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-5 pt-28">
        <LoadingState label="Loading details…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-5 pt-28">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-4xl px-5 pt-28">
        <EmptyState title="Title not found" message="This content may have been removed." icon={BookOpen} />
        <div className="text-center">
          <Link to="/discover" className="btn-secondary">Back to Discover</Link>
        </div>
      </div>
    );
  }

  const itemType = ((item.type || item.contentType || 'movie').toLowerCase()) as 'book' | 'movie' | 'series';
  const Icon = typeIcon[itemType] || Film;
  const saved = isSaved(item._id);
  const coverSrc = (!imgError && item.coverUrl) ? item.coverUrl : '';

  return (
    <div className="mx-auto max-w-5xl px-5 pt-24 pb-12 md:pt-28">
      <Link to="/discover" className="mb-6 inline-flex items-center gap-1.5 text-sm text-lavender-700 hover:text-lavender-900">
        <ArrowLeft size={16} /> Back to Discover
      </Link>

      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        {/* Cover */}
        <div className="mx-auto w-full max-w-[280px] md:mx-0">
          <div className="card overflow-hidden">
            <div className="relative aspect-[3/4] bg-gradient-to-br from-lavender-100 to-cream-100">
              {coverSrc ? (
                <img
                  src={coverSrc}
                  alt={`Cover art for ${item.title}`}
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                  <Icon size={48} className="mb-3 text-lavender-400" />
                  <span className="font-serif text-base font-semibold text-lavender-800">
                    {item.title}
                  </span>
                </div>
              )}
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-lavender-800/50">{item.source}</p>
        </div>

        {/* Details */}
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-lavender-100 px-3 py-1 text-xs font-medium capitalize text-lavender-700">
              <Icon size={12} /> {itemType}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-blush-100 px-3 py-1 text-xs font-medium capitalize text-blush-400">
              <Gauge size={12} /> {item.intensity} intensity
            </span>

            {/* Netflix Original Indicator */}
            {item.isNetflixOriginal && (
              <span className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                Netflix Original
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl font-semibold text-lavender-900 md:text-4xl">{item.title}</h1>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-lavender-800/70">
            <span className="flex items-center gap-1.5">
              <User size={14} /> {item.creator || item.platform || 'Curated'}
            </span>
            {item.platform && item.platform !== item.creator && (
              <span className="flex items-center gap-1.5">
                <Tv2 size={14} /> {item.platform}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> {item.year}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} /> {item.runtimeNote}
            </span>
          </div>

          {item.matchReason && (
            <div className="mt-4 rounded-xl bg-lavender-50 p-3 text-sm text-lavender-800 font-medium">
              ✨ Match Note: {item.matchReason}
            </div>
          )}

          <p className="mt-5 text-base leading-relaxed text-lavender-800/80">{item.description}</p>

          {/* Moods */}
          <div className="mt-6">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-lavender-800/50">
              <Tag size={13} /> Moods
            </p>
            <div className="flex flex-wrap gap-1.5">
              {item.moods.map((m) => (
                <span key={m} className="rounded-full bg-lavender-50 px-3 py-1 text-xs font-medium text-lavender-700">
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Genres */}
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-lavender-800/50">Genres</p>
            <div className="flex flex-wrap gap-1.5">
              {item.genres.map((g) => (
                <span key={g} className="rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-lavender-700">
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Themes / Experiences */}
          {item.themes && item.themes.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-lavender-800/50">Desired Experiences / Themes</p>
              <div className="flex flex-wrap gap-1.5">
                {item.themes.map((t) => (
                  <span key={t} className="rounded-full border border-lavender-100 px-3 py-1 text-xs text-lavender-600">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button
              onClick={() => toggle(item)}
              className={saved ? 'btn-primary' : 'btn-secondary'}
            >
              {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              {saved ? 'Saved to My List' : 'Add to My List'}
            </button>

            {item.externalUrl && (
              <a
                href={item.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-1.5"
              >
                <span>Explore on {item.platform || 'Platform'}</span>
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 font-serif text-2xl font-semibold text-lavender-900">You might also like</h2>
          <CardGrid>
            {related.map((r) => (
              <ContentCard key={r._id} item={r} />
            ))}
          </CardGrid>
        </section>
      )}
    </div>
  );
}
