import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Content, ContentCategory } from '../types';
import ContentCard from '../components/ui/ContentCard';

const CATEGORIES: { key: ContentCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Alle' },
  { key: 'meditation', label: 'Meditatie' },
  { key: 'yoga', label: 'Yoga' },
  { key: 'pilates', label: 'Pilates' },
  { key: 'online_sessie', label: 'Online Sessies' },
];

export default function LibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const activeCategory = (searchParams.get('category') || 'all') as ContentCategory | 'all';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('content')
        .select('*, instructor:instructors(*)')
        .order('sort_order');
      if (data) setContent(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return content.filter((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some(t => t.toLowerCase().includes(q)) ||
          item.instructor?.name.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [content, activeCategory, search]);

  const groupedByCategory = useMemo(() => {
    const groups: Record<ContentCategory, Content[]> = {
      meditation: [],
      yoga: [],
      pilates: [],
      online_sessie: [],
    };
    filtered.forEach((item) => {
      if (groups[item.category]) {
        groups[item.category].push(item);
      }
    });
    return groups;
  }, [filtered]);

  const setCategory = (key: string) => {
    const params = new URLSearchParams(searchParams);
    if (key === 'all') params.delete('category');
    else params.set('category', key);
    setSearchParams(params);
  };

  return (
    <div className="pt-14 min-h-screen bg-sand-50 page-transition">
      <div className="px-5 md:px-8 lg:px-12 pt-8 md:pt-12 pb-20">
        <div className="mb-8">
          <h1 className="font-mono text-2xl md:text-3xl uppercase tracking-wide mb-6 text-charcoal-900">
            Bibliotheek
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Zoeken..."
                className="w-full bg-sand-50 border border-sand-200 pl-10 pr-10 py-2.5 text-[13px] text-charcoal-800 font-sans rounded-[5px]
                         focus:outline-none focus:ring-2 focus:ring-sage-700/20 focus:border-sage-700 transition-all placeholder:text-charcoal-300"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600 transition-colors duration-300">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`px-5 py-2.5 text-[12px] font-mono uppercase whitespace-nowrap transition-all duration-200 rounded-[5px]
                  ${activeCategory === cat.key
                    ? 'bg-charcoal-900 text-white shadow-sm'
                    : 'bg-sand-100 text-charcoal-600 hover:bg-sand-200'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/10] bg-sand-200 rounded-[5px]" />
                <div className="mt-2.5 h-3 bg-sand-200 rounded-full w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-mono text-base text-charcoal-400 uppercase tracking-wide mb-2">Geen praktijken gevonden</p>
            <p className="text-charcoal-400 text-[13px] font-sans">Probeer je zoekopdracht of filters aan te passen.</p>
          </div>
        ) : activeCategory === 'all' && !search ? (
          <div className="space-y-12">
            {CATEGORIES.filter(cat => cat.key !== 'all').map((cat) => {
              const items = groupedByCategory[cat.key as ContentCategory];
              if (!items || items.length === 0) return null;

              return (
                <section key={cat.key}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-mono text-lg uppercase tracking-wide text-charcoal-900">
                      {cat.label}
                    </h2>
                    <button
                      onClick={() => setCategory(cat.key)}
                      className="text-[12px] text-charcoal-600 font-mono uppercase tracking-wide hover:text-charcoal-900 transition-colors duration-300"
                    >
                      Bekijk Alles ({items.length})
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {items.slice(0, 8).map((item) => (
                      <ContentCard key={item.id} content={item} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
            {filtered.length > 0 && (
              <div className="mt-8 text-center text-charcoal-400 text-[12px] font-mono uppercase tracking-wide">
                {filtered.length} {filtered.length === 1 ? 'Praktijk' : 'Praktijken'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
