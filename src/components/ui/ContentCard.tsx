import { Link } from 'react-router-dom';
import { Play, Clock } from 'lucide-react';
import type { Content } from '../../types';

interface ContentCardProps {
  content: Content;
  variant?: 'default' | 'square';
}

export default function ContentCard({ content, variant = 'default' }: ContentCardProps) {
  const isSquare = variant === 'square';

  return (
    <Link
      to={`/content/${content.id}`}
      className="group block"
    >
      <div className={`relative overflow-hidden transition-all duration-300 mb-3 rounded-[5px] ${isSquare ? 'aspect-square' : 'aspect-[16/10]'}`}>
        <img
          src={content.thumbnail_url}
          alt={content.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center transition-opacity duration-300 group-hover:opacity-90">
            <Play size={18} className="text-charcoal-900 ml-0.5" fill="currentColor" />
          </div>
        </div>
      </div>
      <h3 className="font-mono text-[13px] text-charcoal-900 leading-tight mb-1 group-hover:text-sage-700 transition-colors duration-300 line-clamp-1 uppercase tracking-wide">
        {content.title}
      </h3>
      <p className="text-charcoal-400 text-[11px] font-sans">
        {content.instructor?.name}
      </p>
      <p className="text-charcoal-400 text-[11px] font-sans flex items-center gap-1 mt-0.5">
        <Clock size={10} />
        {content.duration_minutes} min
      </p>
    </Link>
  );
}
