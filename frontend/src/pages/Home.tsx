import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, BookOpen, Film, Tv, Compass, Heart } from 'lucide-react';

const EXAMPLES = [
  'I want something cozy and warm to read on a rainy afternoon with tea.',
  'A gripping thriller that keeps me on the edge of my seat.',
  'Something funny and light to lift my spirits after a long day.',
  'A sad, emotional story that will make me cry.',
  'An epic adventure to get lost in this weekend.',
  'A thoughtful, reflective film about meaning and memory.',
];

export default function Home() {
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const handleMatch = () => {
    const q = text.trim();
    navigate('/results', { state: { query: q } });
  };

  return (
    <div className="relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-lavender-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-blush-200/30 blur-3xl" />

      {/* Hero */}
      <section className="relative mx-auto max-w-4xl px-5 pt-28 pb-12 text-center md:pt-36">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lavender-200 bg-white/60 px-4 py-1.5 text-sm text-lavender-700 backdrop-blur-sm">
          <Sparkles size={14} />
          Your Mood. Your Match. Your Next Story.
        </div>
        <h1 className="font-serif text-4xl font-semibold leading-tight text-lavender-900 md:text-6xl">
          Tell us your mood.
          <br />
          <span className="bg-gradient-to-r from-lavender-600 to-blush-400 bg-clip-text text-transparent">
            We'll find your next story.
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-lavender-800/70 md:text-lg">
          Describe how you're feeling or what kind of experience you want.
          MoodMatch suggests books, movies, and series that fit your vibe —
          using transparent keyword matching, not AI guesswork.
        </p>

        {/* Mood textarea */}
        <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-lavender-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm md:p-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe the kind of story you're in the mood for… e.g. 'I want something cozy and hopeful to unwind with tonight.'"
            rows={4}
            className="w-full resize-none rounded-2xl border border-lavender-100 bg-cream-50/50 px-4 py-3 text-sm text-lavender-900 outline-none transition-all placeholder:text-lavender-400 focus:border-lavender-300 focus:ring-2 focus:ring-lavender-200/50 md:text-base"
            aria-label="Describe your mood"
          />
          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-xs text-lavender-800/50">
              {text.trim().length === 0
                ? 'Tip: try one of the examples below'
                : `${text.trim().split(/\s+/).length} words`}
            </p>
            <button
              onClick={handleMatch}
              disabled={text.trim().length === 0}
              className="btn-primary w-full sm:w-auto"
            >
              Find My Match
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Example chips */}
        <div className="mx-auto mt-6 max-w-2xl">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-lavender-800/40">
            Need inspiration?
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => setText(ex)}
                className="chip chip-off text-xs"
              >
                {ex.length > 42 ? ex.slice(0, 42) + '…' : ex}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-5 py-12">
        <h2 className="mb-8 text-center font-serif text-2xl font-semibold text-lavender-800">
          How MoodMatch works
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: '1. Describe your mood',
              body: 'Write a sentence or two about the experience you want — cozy, thrilling, hopeful, anything.',
            },
            {
              icon: Compass,
              title: '2. We interpret keywords',
              body: 'A transparent, rule-based engine maps your words to moods, themes, and intensity. No black boxes.',
            },
            {
              icon: Heart,
              title: '3. Get your matches',
              body: 'Browse books, movies, and series that fit — then bookmark your favorites to your list.',
            },
          ].map((s, i) => (
            <div key={i} className="card animate-fade-up p-6 text-left" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-lavender-100 text-lavender-600">
                <s.icon size={20} />
              </div>
              <h3 className="mb-1.5 font-serif text-lg font-semibold text-lavender-800">{s.title}</h3>
              <p className="text-sm text-lavender-800/65">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Content types */}
      <section className="mx-auto max-w-5xl px-5 py-12">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { icon: BookOpen, label: 'Books', color: 'from-cream-100 to-lavender-50' },
            { icon: Film, label: 'Movies', color: 'from-blush-100 to-lavender-50' },
            { icon: Tv, label: 'Series', color: 'from-lavender-100 to-blush-50' },
          ].map((t) => (
            <div
              key={t.label}
              className={`flex items-center gap-3 rounded-2xl bg-gradient-to-br ${t.color} p-5`}
            >
              <t.icon size={24} className="text-lavender-700" />
              <span className="font-serif text-lg font-semibold text-lavender-800">{t.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
