import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import NotificationDropdown from '../ui/NotificationDropdown';

export default function Header() {
  const { user, profile } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const hasHero = location.pathname === '/' || location.pathname === '/dashboard';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const headerBg = hasHero
    ? scrolled
      ? 'bg-sand-50/95 backdrop-blur-lg'
      : 'bg-transparent'
    : 'bg-sand-50/95 backdrop-blur-lg';

  const textColor = hasHero
    ? scrolled
      ? 'text-charcoal-900'
      : 'text-white'
    : 'text-charcoal-900';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}>
      <nav className="flex items-center justify-between px-5 md:px-8 lg:px-12 h-16">
        <Link to={user ? '/dashboard' : '/'} className="transition-opacity duration-300 hover:opacity-80">
          <img
            src="/687d2a415508bb1c6f510e12_serra-soul_(1).svg"
            alt="Serra & Soul"
            className={`h-5 transition-all duration-300 ${hasHero && !scrolled ? 'brightness-0 invert' : 'brightness-0'}`}
          />
        </Link>

        <div className={`hidden md:flex items-center gap-3 text-[12px] font-mono uppercase tracking-wide ${textColor}`}>
          {user ? (
            <>
              <Link to="/dashboard" className="transition-opacity duration-300 hover:opacity-60">Home</Link>
              <span className="w-1 h-1 rounded-full bg-current opacity-40"></span>
              <Link to="/library" className="transition-opacity duration-300 hover:opacity-60">Bibliotheek</Link>
              <span className="w-1 h-1 rounded-full bg-current opacity-40"></span>
              <Link to="/library?category=yoga" className="transition-opacity duration-300 hover:opacity-60">Yoga</Link>
              <span className="w-1 h-1 rounded-full bg-current opacity-40"></span>
              <Link to="/community" className="transition-opacity duration-300 hover:opacity-60">Gemeenschap</Link>
              {(profile?.role === 'admin' || profile?.role === 'facilitator') && (
                <>
                  <span className="w-1 h-1 rounded-full bg-current opacity-40"></span>
                  <Link to="/admin" className="transition-opacity duration-300 hover:opacity-60">Admin</Link>
                </>
              )}
            </>
          ) : (
            <>
              <a href="#practices" className="transition-opacity duration-300 hover:opacity-60">Praktijken</a>
              <span className="w-1 h-1 rounded-full bg-current opacity-40"></span>
              <a href="#pricing" className="transition-opacity duration-300 hover:opacity-60">Lidmaatschap</a>
              <span className="w-1 h-1 rounded-full bg-current opacity-40"></span>
              <Link to="/auth" className="transition-opacity duration-300 hover:opacity-60">Inloggen</Link>
            </>
          )}
        </div>

        <div className={`hidden md:flex items-center gap-4 ${textColor}`}>
          {user ? (
            <>
              <Link to="/library" className="transition-opacity duration-300 hover:opacity-60" title="Zoeken">
                <Search size={16} />
              </Link>
              <NotificationDropdown />
              <Link to="/profile" className="flex items-center gap-2.5 transition-opacity duration-300 hover:opacity-60">
                <span className="text-[12px] font-mono uppercase tracking-wide">{profile?.full_name?.split(' ')[0] || 'Account'}</span>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center flex-shrink-0 ">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User size={13} className="text-white" />
                  )}
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth?mode=register" className="bg-charcoal-900 text-white px-6 py-2.5 text-[12px] font-mono uppercase tracking-wide hover:bg-charcoal-800 transition-colors duration-300 rounded-[5px]">
                Gratis Deelnemen
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden transition-colors duration-300 ${textColor}`}>
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-sand-50/95 backdrop-blur-lg border-t border-charcoal-100/10 ">
          <div className="flex flex-col px-5 py-6 gap-4 font-mono text-[12px] uppercase tracking-wide text-charcoal-900">
            {user ? (
              <>
                <Link to="/dashboard" className="transition-opacity duration-300 hover:opacity-60">Home</Link>
                <Link to="/library" className="transition-opacity duration-300 hover:opacity-60">Bibliotheek</Link>
                <Link to="/library?category=yoga" className="transition-opacity duration-300 hover:opacity-60">Yoga</Link>
                <Link to="/community" className="transition-opacity duration-300 hover:opacity-60">Gemeenschap</Link>
                <Link to="/profile" className="transition-opacity duration-300 hover:opacity-60">Profiel</Link>
                {(profile?.role === 'admin' || profile?.role === 'facilitator') && (
                  <Link to="/admin" className="transition-opacity duration-300 hover:opacity-60">Admin</Link>
                )}
              </>
            ) : (
              <>
                <a href="#practices" className="transition-opacity duration-300 hover:opacity-60">Praktijken</a>
                <a href="#pricing" className="transition-opacity duration-300 hover:opacity-60">Lidmaatschap</a>
                <Link to="/auth" className="transition-opacity duration-300 hover:opacity-60">Inloggen</Link>
                <Link to="/auth?mode=register" className="bg-charcoal-900 text-white text-center py-2.5 text-[12px] hover:bg-charcoal-800 transition-colors duration-300 uppercase tracking-wide rounded-[5px]">Gratis Deelnemen</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
