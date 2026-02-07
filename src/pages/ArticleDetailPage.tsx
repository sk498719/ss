import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Article } from '../types';

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      setLoading(true);

      const { data } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (data) {
        setArticle(data);

        const { data: relatedData } = await supabase
          .from('articles')
          .select('*')
          .eq('category', data.category)
          .neq('id', id)
          .limit(3);
        if (relatedData) setRelated(relatedData);
      }

      setLoading(false);
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-14 min-h-screen bg-sand-50">
        <div className="max-w-4xl mx-auto px-5 md:px-8 py-12">
          <div className="animate-pulse">
            <div className="aspect-[21/9] bg-sand-200 rounded-[5px] mb-8" />
            <div className="h-8 bg-sand-200 rounded-full w-2/3 mb-4" />
            <div className="h-4 bg-sand-100 rounded-full w-1/3 mb-8" />
            <div className="space-y-3">
              <div className="h-3 bg-sand-100 rounded-full w-full" />
              <div className="h-3 bg-sand-100 rounded-full w-full" />
              <div className="h-3 bg-sand-100 rounded-full w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="pt-14 min-h-screen flex items-center justify-center bg-sand-50">
        <div className="text-center">
          <h2 className="font-mono text-base text-charcoal-400 uppercase tracking-wide mb-4">Artikel niet gevonden</h2>
          <Link to="/dashboard" className="text-[13px] text-charcoal-600 hover:text-charcoal-900 transition-colors">Terug naar overzicht</Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(article.published_at).toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="pt-14 min-h-screen bg-sand-50">
      <div className="relative h-screen overflow-hidden">
        <img
          src={article.cover_image_url}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/30 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-between px-5 md:px-8 lg:px-12 py-8 md:py-12">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-white/80 text-[13px] font-mono uppercase tracking-wide hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Terug
          </Link>

          <div className="max-w-4xl mx-auto text-center w-full pb-12">
            <h1 className="font-mono text-2xl md:text-3xl lg:text-5xl uppercase tracking-wide text-white mb-5 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-[12px] text-white/70 font-mono uppercase tracking-wide">
              <span className="flex items-center gap-2">
                <Calendar size={12} />
                {formattedDate}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={12} />
                {article.read_time_minutes} min
              </span>
            </div>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-5 md:px-8 py-12 md:py-16">

        <div className="prose prose-lg max-w-none">
          <div className="text-charcoal-700 text-[17px] leading-relaxed font-sans mb-8 italic pl-6">
            {article.excerpt}
          </div>

          <div
            className="text-charcoal-600 text-[15px] leading-loose font-sans prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </article>

      {related.length > 0 && (
        <section className="max-w-4xl mx-auto px-5 md:px-8 pb-16">
          <div className="border-t border-sand-200 pt-12">
            <h2 className="font-mono text-base uppercase tracking-wide text-charcoal-900 mb-6">Meer Lezen</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((relatedArticle) => (
                <Link key={relatedArticle.id} to={`/article/${relatedArticle.id}`} className="group">
                  <div className="aspect-[16/9] overflow-hidden mb-3 rounded-[5px]">
                    <img
                      src={relatedArticle.cover_image_url}
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                    />
                  </div>
                  <h3 className="font-mono text-[13px] uppercase tracking-wide text-charcoal-900 group-hover:text-charcoal-700 transition-colors duration-300 line-clamp-2 leading-tight">
                    {relatedArticle.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
