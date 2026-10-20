import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Tag, Gauge, Lightbulb } from 'lucide-react';
import type { ContentRecord, MoodInterpretation } from '@/types';
import { interpretMood } from '@/services/moodEngine';
import { fetchRecommendationsWithDetails } from '@/services/api';
import ContentCard from '@/components/ContentCard';
import { CardGrid, LoadingState, ErrorState, EmptyState } from '@/components/States';

export default function Results() {
  const location = useLocation();
  const query = (location.state as { query?: string } | null)?.query || '';

  const [interpretation, setInterpretation] = useState<MoodInterpretation | null>(null);
  const [results, setResults] = useState<ContentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setLoading(false);
      return;
    }
    // Set initial local interpretation for instant feedback
    const localInterp = interpretMood(query);
    setInterpretation(localInterp);
    setLoading(true);
    setError(null);

    fetchRecommendationsWithDetails(query)
      .then(({ recommendations, interpretation: backendInterp }) => {
        setResults(recommendations);
        if (backendInterp && backendInterp.primaryMoods.length > 0) {
          setInterpretation(backendInterp);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Something went wrong while fetching recommendations. Please try again.');
        setLoading(false);
      });
  }, [query]);

  if (!query.trim()) {
    return (
      <div className="mx-auto max-w-2xl px-5 pt-28">
        <EmptyState
          title="No mood described yet"
          message="Head back home and tell us what kind of story you're in the mood for."
          icon={Sparkles}
        />
        <div className="text-center">
          <Link to="/" className="btn-secondary">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pt-24 pb-12 md:pt-28">
      <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-lavender-700 hover:text-lavender-900">
        <ArrowLeft size={16} /> Describe a new mood
      </Link>

      {/* Interpretation panel */}
      {interpretation && (
        <section className="card mb-8 animate-fade-up p-6">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-lavender-600" />
            <h2 className="font-serif text-xl font-semibold text-lavender-800">Your mood, interpreted</h2>
          </div>
          <p className="mb-4 rounded-xl bg-cream-50/60 px-4 py-3 text-sm italic text-lavender-800/70">
            "{query}"
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-lavender-800/50">
                <Tag size={13} /> Moods detected
              </p>
              <div className="flex flex-wrap gap-1.5">
                {interpretation.primaryMoods.length === 0 ? (
                  <span className="text-sm text-lavender-800/50">None detected</span>
                ) : (
                  interpretation.primaryMoods.map((m, i) => (
                    <span
                      key={m}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        i === 0
                          ? 'bg-lavender-200 text-lavender-800'
                          : 'bg-lavender-50 text-lavender-700'
                      }`}
                    >
                      {m}
                    </span>
                  ))
                )}
              </div>
            </div>
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-lavender-800/50">
                <Gauge size={13} /> Intensity
              </p>
              <span className="inline-block rounded-full bg-blush-100 px-3 py-1 text-xs font-medium capitalize text-blush-400">
                {interpretation.intensity}
              </span>
              <p className="mt-3 text-sm text-lavender-800/70">{interpretation.toneSummary}</p>
            </div>
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-lavender-800/50">
                <Lightbulb size={13} /> Matched keywords
              </p>
              <div className="flex flex-wrap gap-1.5">
                {interpretation.keywords.length === 0 ? (
                  <span className="text-sm text-lavender-800/50">
                    No specific keywords — showing a thoughtful default.
                  </span>
                ) : (
                  interpretation.keywords.map((k) => (
                    <span key={k} className="rounded bg-cream-100 px-2 py-0.5 text-xs text-lavender-700">
                      {k}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      <h3 className="mb-5 font-serif text-2xl font-semibold text-lavender-900">
        {loading ? 'Finding your matches…' : `${results.length} ${results.length === 1 ? 'match' : 'matches'} for you`}
      </h3>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      ) : results.length === 0 ? (
        <EmptyState
          title="No matches found"
          message="We couldn't find a strong match for that mood. Try describing it differently, or explore the Discover page."
          icon={Sparkles}
        />
      ) : (
        <CardGrid>
          {results.map((item) => (
            <ContentCard key={item._id} item={item} />
          ))}
        </CardGrid>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="mt-10 text-center">
          <Link to="/discover" className="btn-secondary">
            Explore more in Discover
          </Link>
        </div>
      )}
    </div>
  );
}
