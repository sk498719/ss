import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface Collection {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  order_index: number;
}

export default function CollectionsSection() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    const { data } = await supabase
      .from('collections')
      .select('*')
      .order('order_index', { ascending: true });

    if (data) {
      setCollections(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="mb-16">
        <h2 className="font-mono text-base uppercase tracking-wide mb-6 text-charcoal-900">
          Collecties
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[100px] bg-sand-200 rounded-[5px]" />
          ))}
        </div>
      </section>
    );
  }

  if (collections.length === 0) return null;

  return (
    <section className="mb-16">
      <h2 className="font-mono text-base uppercase tracking-wide mb-6 text-charcoal-900">
        Collecties
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            to={`/collection/${collection.id}`}
            className="group"
          >
            <div className="h-[100px] bg-white border border-sand-200 rounded-[5px] flex items-center justify-center p-6 hover:border-charcoal-300 transition-all duration-300 hover:shadow-lg">
              <h3 className="font-mono text-[11px] md:text-[12px] uppercase tracking-wide text-center text-charcoal-900 group-hover:text-charcoal-700 transition-colors">
                {collection.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
