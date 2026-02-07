import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-charcoal-400">
      <div className="px-5 md:px-8 lg:px-12 py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          <div className="col-span-2 md:col-span-1">
            <img
              src="/687d2a415508bb1c6f510e12_serra-soul_(1).svg"
              alt="Serra & Soul"
              className="h-5 mb-4"
            />
            <p className="text-charcoal-500 text-[13px] leading-relaxed max-w-[220px] font-sans">
              Meditatie, yoga, pilates en masterclasses voor je dagelijkse praktijk.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-[11px] tracking-wide uppercase text-charcoal-500 mb-4">Praktijk</h4>
            <div className="flex flex-col gap-2.5 text-[13px] font-sans">
              <Link to="/library?category=meditation" className="hover:text-white transition-colors">Meditatie</Link>
              <Link to="/library?category=yoga" className="hover:text-white transition-colors">Yoga</Link>
              <Link to="/library?category=pilates" className="hover:text-white transition-colors">Pilates</Link>
              <Link to="/library?category=online_sessie" className="hover:text-white transition-colors">Online Sessies</Link>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-[11px] tracking-wide uppercase text-charcoal-500 mb-4">Account</h4>
            <div className="flex flex-col gap-2.5 text-[13px] font-sans">
              <Link to="/community" className="hover:text-white transition-colors">Gemeenschap</Link>
              <Link to="/auth" className="hover:text-white transition-colors">Inloggen</Link>
              <Link to="/auth?mode=register" className="hover:text-white transition-colors">Aanmelden</Link>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-[11px] tracking-wide uppercase text-charcoal-500 mb-4">Info</h4>
            <div className="flex flex-col gap-2.5 text-[13px] font-sans">
              <span className="cursor-default">Over</span>
              <span className="cursor-default">Privacy</span>
              <span className="cursor-default">Voorwaarden</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-charcoal-800 flex items-center justify-between">
          <p className="text-charcoal-600 text-[11px] font-sans">
            &copy; {new Date().getFullYear()} Serra & Soul
          </p>
          <p className="text-charcoal-600 text-[11px] font-sans">
            Alle rechten voorbehouden
          </p>
        </div>
      </div>
    </footer>
  );
}
