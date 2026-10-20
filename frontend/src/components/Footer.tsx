import { Link } from 'react-router-dom';
import { BookOpen, Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-lavender-100 bg-cream-50/60">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2 text-lavender-700">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-lavender-400 to-blush-300 text-white">
              <BookOpen size={16} />
            </span>
            <div>
              <p className="font-serif text-lg font-semibold">MoodMatch</p>
              <p className="text-xs text-lavender-800/60">Your Mood. Your Match. Your Next Story.</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-lavender-800/70">
            <Link to="/" className="hover:text-lavender-700">Home</Link>
            <Link to="/discover" className="hover:text-lavender-700">Discover</Link>
            <Link to="/my-list" className="hover:text-lavender-700">My List</Link>
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 border-t border-lavender-100 pt-6 text-center text-xs text-lavender-800/50">
          <p className="flex items-center gap-1.5">
            Built with <Heart size={12} className="text-blush-400" /> for a JavaScript college project.
          </p>
          <p>
            Cover images are representative stock photography (Pexels), not official artwork.
            No ratings are invented. Mood matching uses transparent keyword rules, not AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
