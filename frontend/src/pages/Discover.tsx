import { useEffect, useState, useCallback, useMemo } from 'react';
import { Search, SlidersHorizontal, X, Compass } from 'lucide-react';
import type { ContentRecord } from '@/types';
import { fetchFiltered, type DiscoverFilters } from '@/services/api';
import { ALL_GENRES, ALL_MOODS } from '@/data/content';
import ContentCard from '@/components/ContentCard';
import { CardGrid, ContentGridSkeleton, EmptyState, ErrorState } from '@/components/States';

const TYPES = [
  { value: '', label: 'All' },
  { value: 'book', label: 'Books' },
  { value: 'movie', label: 'Movies' },
  { value: 'series', label: 'Series' },
];

const INTENSITIES = [
  { value: '', label: 'Any' },
  { value: 'light', label: 'Light' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'intense', label: 'Intense' },
];

export default function Discover() {
  const [items, setItems] = useState<ContentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [genre, setGenre] = useState('');
  const [mood, setMood] = useState('');
  const [intensity, setIntensity] = useState('');

  const filters: DiscoverFilters = useMemo(
    () => ({ search: search.trim(), type, genre, mood, intensity }),
    [search, type, genre, mood, intensity]
  );

  const availableGenres = useMemo(() => {
    const set = new Set([...ALL_GENRES, ...items.flatMap((i) => i.genres || [])]);
    return Array.from(set).filter(Boolean).sort();
  }, [items]);

  const availableMoods = useMemo(() => {
    const set = new Set([...ALL_MOODS, ...items.flatMap((i) => i.moods || [])]);
    return Array.from(set).filter(Boolean).sort();
  }, [items]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFiltered(filters);
      setItems(data);
    } catch {
      setError('Could not load content. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(load, 250); // debounce search
    return () => clearTimeout(t);
  }, [load]);

  const activeFilterCount = [type, genre, mood, intensity].filter(Boolean).length;

  const clearAll = () => {
    setSearch('');
    setType('');
    setGenre('');
    setMood('');
    setIntensity('');
  };

  return (
    <div className="mx-auto max-w-6xl px-5 pt-24 pb-12 md:pt-28">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-semibold text-lavender-900">Discover</h1>
        <p className="mt-1 text-sm text-lavender-800/65">
          Search and filter through our curated collection of books, movies, and series.
        </p>
      </div>

      {/* Search + filter toggle */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lavender-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search titles, authors, directors, genres…"
            className="input-field pl-11"
            aria-label="Search content"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-lavender-400 hover:text-lavender-600"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`btn-secondary ${showFilters ? 'border-lavender-300 bg-lavender-50' : ''}`}
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 rounded-full bg-lavender-200 px-2 py-0.5 text-xs text-lavender-800">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="card mb-6 animate-fade-up p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-lavender-800">Refine</h2>
            {activeFilterCount > 0 && (
              <button onClick={clearAll} className="text-sm text-lavender-600 hover:text-lavender-800">
                Clear all
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-lavender-800/50">Type</label>
              <div className="flex flex-wrap gap-1.5">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setType(t.value)}
                    className={`chip ${type === t.value ? 'chip-on' : 'chip-off'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-lavender-800/50">Intensity</label>
              <div className="flex flex-wrap gap-1.5">
                {INTENSITIES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setIntensity(t.value)}
                    className={`chip ${intensity === t.value ? 'chip-on' : 'chip-off'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-lavender-800/50">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="input-field"
              >
                <option value="">All genres</option>
                {availableGenres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-lavender-800/50">Mood</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="input-field"
              >
                <option value="">All moods</option>
                {availableMoods.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="mb-4 text-sm text-lavender-800/60">
        {loading ? 'Searching…' : `${items.length} ${items.length === 1 ? 'result' : 'results'}`}
      </div>

      {loading ? (
        <ContentGridSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No results"
          message="No content matches your search and filters. Try adjusting them."
          icon={Compass}
        />
      ) : (
        <CardGrid>
          {items.map((item) => (
            <ContentCard key={item._id} item={item} />
          ))}
        </CardGrid>
      )}
    </div>
  );
}
