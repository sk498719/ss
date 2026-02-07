import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, Lock, Play } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Content } from '../types';

interface Collection {
  id: string;
  title: string;
  description: string;
}

interface ContentWithProgress extends Content {
  completed: boolean;
  locked: boolean;
  progress_seconds: number;
}

export default function CollectionPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [content, setContent] = useState<ContentWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollection();
  }, [id, user]);

  const fetchCollection = async () => {
    if (!id) return;

    const { data: collectionData } = await supabase
      .from('collections')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (collectionData) {
      setCollection(collectionData);

      const { data: itemsData } = await supabase
        .from('collection_items')
        .select('content_id, order_index, content:content(*)')
        .eq('collection_id', id)
        .order('order_index', { ascending: true });

      if (itemsData && user) {
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('content_id, completed, progress_seconds')
          .eq('user_id', user.id);

        const progressMap = new Map(
          progressData?.map((p) => [p.content_id, p]) || []
        );

        let previousCompleted = true;
        const contentWithProgress = itemsData.map((item: any, index) => {
          const progress = progressMap.get(item.content.id);
          const completed = progress?.completed || false;
          const locked = index > 0 && !previousCompleted;

          if (completed) previousCompleted = true;
          else previousCompleted = false;

          return {
            ...item.content,
            completed,
            locked,
            progress_seconds: progress?.progress_seconds || 0,
          };
        });

        setContent(contentWithProgress);
      } else if (itemsData) {
        const contentItems = itemsData.map((item: any, index) => ({
          ...item.content,
          completed: false,
          locked: index > 0,
          progress_seconds: 0,
        }));
        setContent(contentItems);
      }
    }

    setLoading(false);
  };

  const completedCount = content.filter((c) => c.completed).length;
  const progressPercent = content.length > 0 ? (completedCount / content.length) * 100 : 0;

  if (loading) {
    return (
      <div className="pt-14 min-h-screen bg-sand-50">
        <div className="max-w-4xl mx-auto px-5 md:px-8 lg:px-12 py-10 md:py-14">
          <div className="animate-pulse">
            <div className="h-8 bg-sand-200 rounded-full w-1/3 mb-8" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-sand-200 rounded-[5px]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="pt-14 min-h-screen flex items-center justify-center bg-sand-50">
        <div className="text-center">
          <h2 className="font-mono text-base text-charcoal-400 uppercase tracking-wide mb-4">
            Collectie niet gevonden
          </h2>
          <Link
            to="/dashboard"
            className="text-[13px] text-charcoal-600 hover:text-charcoal-900 transition-colors"
          >
            Terug naar Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-14 min-h-screen bg-sand-50 page-transition">
      <div className="max-w-4xl mx-auto px-5 md:px-8 lg:px-12 py-10 md:py-14">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-charcoal-400 text-[13px] font-mono uppercase tracking-wide hover:text-charcoal-900 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Terug
        </Link>

        <div className="mb-10">
          <h1 className="font-mono text-2xl md:text-3xl uppercase tracking-wide text-charcoal-900 mb-4">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="text-charcoal-600 text-[15px] mb-6 leading-relaxed">
              {collection.description}
            </p>
          )}

          <div className="bg-white border border-sand-200 rounded-[5px] p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wide text-charcoal-500">
                Voortgang
              </span>
              <span className="text-[13px] font-mono text-charcoal-900">
                {completedCount} van {content.length} voltooid
              </span>
            </div>
            <div className="h-2 bg-sand-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-charcoal-900 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {content.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-charcoal-500 text-[15px]">
              Deze collectie bevat nog geen content
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {content.map((item, index) => (
              <div
                key={item.id}
                className={`bg-white border border-sand-200 rounded-[5px] overflow-hidden transition-all duration-300 ${
                  item.locked ? 'opacity-60' : 'hover:border-charcoal-300 hover:shadow-lg'
                }`}
              >
                <Link
                  to={item.locked ? '#' : `/content/${item.id}`}
                  className={`flex items-center gap-4 p-5 ${item.locked ? 'cursor-not-allowed' : ''}`}
                  onClick={(e) => item.locked && e.preventDefault()}
                >
                  <div className="flex-shrink-0 w-20 h-20 rounded-[5px] overflow-hidden">
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wide text-charcoal-400">
                        {index + 1}
                      </span>
                      {item.completed && (
                        <CheckCircle size={14} className="text-green-600" />
                      )}
                      {item.locked && (
                        <Lock size={14} className="text-charcoal-400" />
                      )}
                    </div>
                    <h3 className="font-mono text-[13px] uppercase tracking-wide text-charcoal-900 mb-1 line-clamp-1">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-charcoal-500">
                      {item.instructor?.name && (
                        <span>{item.instructor.name}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {item.duration_minutes} min
                      </span>
                    </div>
                  </div>

                  {!item.locked && (
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-charcoal-900 flex items-center justify-center text-white hover:bg-charcoal-800 transition-colors">
                        <Play size={14} fill="currentColor" />
                      </div>
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
