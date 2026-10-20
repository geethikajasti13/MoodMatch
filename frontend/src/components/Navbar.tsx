import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BookOpen, Compass, Heart, Sparkles, Menu, X } from 'lucide-react';

const links = [
  { to: '/', label: 'Home', icon: Sparkles },
  { to: '/discover', label: 'Discover', icon: Compass },
  { to: '/my-list', label: 'My List', icon: Heart },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-lavender-100 bg-cream-50/90 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-lavender-700">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-lavender-400 to-blush-300 text-white shadow-sm">
            <BookOpen size={18} />
          </span>
          <span className="font-serif">MoodMatch</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-lavender-100 text-lavender-700'
                    : 'text-lavender-800/70 hover:bg-lavender-50 hover:text-lavender-700'
                }`
              }
            >
              <l.icon size={16} />
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-lg p-2 text-lavender-700 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-lavender-100 bg-cream-50/95 backdrop-blur-md md:hidden">
          <div className="mx-auto max-w-6xl px-5 py-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive ? 'bg-lavender-100 text-lavender-700' : 'text-lavender-800/80 hover:bg-lavender-50'
                  }`
                }
              >
                <l.icon size={18} />
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
