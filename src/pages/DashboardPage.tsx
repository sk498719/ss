import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, ChevronLeft, ChevronRight, Clock, Info, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Content, Collection, CommunityPost, Article } from '../types';

function HeroBanner({ contentList }: { contentList: Content[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (contentList.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % contentList.length);
        setIsTransitioning(false);
      }, 500);
    }, 10000);

    return () => clearInterval(interval);
  }, [contentList.length]);

  if (!contentList || contentList.length === 0) return null;

  const activeContent = contentList[activeIndex];

  const handleIndicatorClick = (idx: number) => {
    if (idx === activeIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(idx);
      setIsTransitioning(false);
    }, 400);
  };

  const isVideo = activeContent.category === 'yoga' || activeContent.category === 'pilates' || activeContent.category === 'meditation';

  return (
    <section className="relative h-[80vh] overflow-hidden">
      <div className="absolute inset-0">
        {isVideo && activeContent.media_url ? (
          <video
            key={activeContent.id}
            autoPlay
            loop
            muted
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-[2000ms] ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
          >
            <source src={activeContent.media_url} type="video/mp4" />
          </video>
        ) : (
          <img
            key={activeContent.id}
            src={activeContent.thumbnail_url}
            alt={activeContent.title}
            className={`w-full h-full object-cover transition-opacity duration-[2000ms] ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/70 via-charcoal-900/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-sand-50 via-transparent to-transparent" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end px-5 md:px-8 lg:px-12 pb-16 md:pb-24 z-10">
        <div className={`max-w-3xl transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-white/50 text-[10px] font-mono uppercase tracking-widest">
              {activeContent.category}
            </span>
            {activeContent.instructor && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="text-white/50 text-[10px] font-mono uppercase tracking-widest">
                  {activeContent.instructor.name}
                </span>
              </>
            )}
          </div>

          <h1 className="font-mono text-lg md:text-2xl lg:text-3xl text-white uppercase tracking-wide leading-[1.05] mb-5">
            {activeContent.title}
          </h1>

          <p className="text-white/80 text-[14px] font-sans leading-relaxed mb-8 max-w-2xl">
            {activeContent.description}
          </p>

          <div className="flex items-center gap-4 mb-10">
            <Link
              to={`/content/${activeContent.id}`}
              className="inline-flex items-center gap-2.5 bg-white text-charcoal-900 px-8 py-3.5 text-[12px] font-mono uppercase tracking-wide font-medium hover:bg-white/90 transition-opacity duration-300 rounded-[5px]"
            >
              <Play size={14} fill="currentColor" />
              Afspelen
            </Link>
            <Link
              to={`/content/${activeContent.id}`}
              className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 text-[12px] font-mono uppercase tracking-wide hover:bg-white/20 transition-all duration-300 rounded-[5px]"
            >
              <Info size={14} />
              Meer Info
            </Link>
          </div>

          <div className="flex items-center gap-1.5">
            {contentList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleIndicatorClick(idx)}
                className="group relative h-[2px] bg-white/20 hover:bg-white/30 transition-colors duration-300 overflow-hidden"
                style={{ width: idx === activeIndex ? '32px' : '16px' }}
              >
                {idx === activeIndex && (
                  <span className="absolute inset-0 bg-white" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContentRow({ title, content, linkTo, aspectRatio = 'landscape' }: { title: string; content: Content[]; linkTo?: string; aspectRatio?: 'square' | 'landscape' }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  if (content.length === 0) return null;

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 10);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const cardWidthClass = aspectRatio === 'square' ? 'w-[calc((100vw-96px)/1.5)] md:w-[calc((100vw-160px)/3.5)]' : 'w-[calc((100vw-96px)/1.5)] md:w-[calc((100vw-160px)/3.5)]';
  const aspectClass = aspectRatio === 'square' ? 'aspect-square' : 'aspect-[16/10]';

  return (
    <section className="mb-10 md:mb-16">
      {title && (
        <div className="flex items-center justify-between mb-6 px-5 md:px-8 lg:px-12">
          <h2 className="font-mono text-lg md:text-xl text-charcoal-900 uppercase tracking-wide">
            {title}
          </h2>
          {linkTo && (
            <Link to={linkTo} className="text-[13px] text-sage-600 font-sans hover:text-sage-800 transition-colors duration-300 flex items-center gap-1">
              Bekijk alles
              <ChevronRight size={14} />
            </Link>
          )}
        </div>
      )}

      <div className="relative group/row">
        {showLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-r from-sand-50 via-sand-50/80 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:opacity-90 transition-opacity duration-300">
              <ChevronLeft size={18} className="text-charcoal-800" />
            </div>
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto px-5 md:px-8 lg:px-12 scroll-smooth pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {content.map((item) => (
            <Link
              key={item.id}
              to={`/content/${item.id}`}
              className={`group flex-shrink-0 ${cardWidthClass}`}
            >
              <div className={`relative ${aspectClass} overflow-hidden mb-3 transition-all duration-300 rounded-[5px]`}>
                <img
                  src={item.thumbnail_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-charcoal-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center transition-opacity group-hover:opacity-90 duration-300">
                    <Play size={18} className="text-charcoal-900 ml-0.5" fill="currentColor" />
                  </div>
                </div>
              </div>
              <h3 className="font-mono text-[13px] text-charcoal-900 leading-tight mb-1 group-hover:text-sage-700 transition-colors duration-300 line-clamp-1 uppercase tracking-wide">
                {item.title}
              </h3>
              <p className="text-charcoal-400 text-[11px] font-sans">
                {item.instructor?.name}
              </p>
              <p className="text-charcoal-400 text-[11px] font-sans flex items-center gap-1.5 mt-0.5">
                <Clock size={10} />
                {item.duration_minutes} min
              </p>
            </Link>
          ))}
        </div>

        {showRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-l from-sand-50 via-sand-50/80 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:opacity-90 transition-opacity duration-300">
              <ChevronRight size={18} className="text-charcoal-800" />
            </div>
          </button>
        )}
      </div>
    </section>
  );
}

function CollectionsRow({ collections }: { collections: Collection[] }) {
  if (collections.length === 0) return null;

  return (
    <section className="mb-10 md:mb-16 px-5 md:px-8 lg:px-12">
      <h2 className="font-mono text-base uppercase tracking-wide mb-4 text-charcoal-900">
        Collecties
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {collections.map((col) => (
          <Link
            key={col.id}
            to={`/collection/${col.id}`}
            className="group"
          >
            <div className="aspect-[4/3] bg-white border border-sand-200 rounded-[5px] flex items-center justify-center p-4 hover:border-charcoal-300 transition-all duration-300 hover:shadow-lg">
              <h3 className="font-mono text-[11px] md:text-[12px] uppercase tracking-wide text-center text-charcoal-900 group-hover:text-charcoal-700 transition-colors">
                {col.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ArticlesPreview({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="mb-10 md:mb-16 px-5 md:px-8 lg:px-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-mono text-lg md:text-xl text-charcoal-900 uppercase tracking-wide">
          Lezen & Ontdekken
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.slice(0, 3).map((article) => (
          <Link key={article.id} to={`/article/${article.id}`} className="group">
            <article>
              <div className="aspect-[16/9] overflow-hidden mb-4 rounded-[5px]">
                <img
                  src={article.cover_image_url}
                  alt={article.title}
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                />
              </div>
              <span className="inline-block text-sage-700 text-[10px] font-mono uppercase tracking-[0.15em] mb-2">
                {article.category}
              </span>
              <h3 className="font-mono text-sm md:text-base uppercase tracking-wide text-charcoal-900 group-hover:text-sage-700 transition-colors duration-300 mb-2 leading-tight">
                {article.title}
              </h3>
              <p className="text-charcoal-400 text-[13px] font-sans line-clamp-2 leading-relaxed">
                {article.excerpt}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}

function AllSessionsBanner() {
  return (
    <section className="mb-10 md:mb-16 px-5 md:px-8 lg:px-12">
      <Link
        to="/library"
        className="group relative block aspect-[21/5] overflow-hidden rounded-[5px]"
      >
        <img
          src="https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Alle Sessies"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/80 via-charcoal-900/60 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8 md:px-12">
          <div>
            <h2 className="font-mono text-xl md:text-2xl text-white uppercase tracking-wide mb-3">
              Alle Sessies
            </h2>
            <p className="text-white/80 text-[14px] font-sans mb-6 max-w-md">
              Ontdek onze volledige collectie van meditaties, yoga, pilates en masterclasses
            </p>
            <span className="inline-flex items-center gap-2 text-white font-mono uppercase text-[12px] tracking-wide group-hover:gap-3 transition-all duration-300">
              Verken Bibliotheek <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}

function CommunityPreview({ posts }: { posts: CommunityPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mb-10 md:mb-16 px-5 md:px-8 lg:px-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-mono text-lg md:text-xl text-charcoal-900 uppercase tracking-wide">
          Gemeenschap
        </h2>
        <Link to="/community" className="text-[13px] text-sage-600 font-sans hover:text-sage-800 transition-colors duration-300 flex items-center gap-1">
          Bekijk alles
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.slice(0, 2).map((post) => (
          <Link key={post.id} to="/community" className="group bg-sand-50 overflow-hidden transition-all duration-300 rounded-[5px]">
            {post.image_url && (
              <div className="aspect-[16/9] overflow-hidden rounded-t-[5px]">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="font-mono text-sm uppercase tracking-wide text-charcoal-900 group-hover:text-sage-700 transition-colors duration-300 mb-2">{post.title}</h3>
              <p className="text-charcoal-400 text-[14px] font-sans line-clamp-2 leading-relaxed mb-3">{post.body}</p>
              <p className="text-charcoal-300 text-[11px] font-sans">
                {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const { profile } = useAuth();
  const [featured, setFeatured] = useState<Content[]>([]);
  const [allContent, setAllContent] = useState<Content[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [featuredRes, allRes, collectionsRes, postsRes, articlesRes] = await Promise.all([
        supabase
          .from('content')
          .select('*, instructor:instructors(*)')
          .eq('is_featured', true)
          .order('sort_order')
          .limit(6),
        supabase
          .from('content')
          .select('*, instructor:instructors(*)')
          .order('sort_order'),
        supabase.from('collections').select('*').limit(4),
        supabase
          .from('community_posts')
          .select('*, author:profiles(*)')
          .order('created_at', { ascending: false })
          .limit(2),
        supabase
          .from('articles')
          .select('*, author:profiles(*)')
          .order('published_at', { ascending: false })
          .limit(3),
      ]);
      if (featuredRes.data) setFeatured(featuredRes.data);
      if (allRes.data) setAllContent(allRes.data);
      if (collectionsRes.data) setCollections(collectionsRes.data);
      if (postsRes.data) setPosts(postsRes.data);
      if (articlesRes.data) setArticles(articlesRes.data);
    };
    fetchData();
  }, []);

  const meditations = allContent.filter(c => c.category === 'meditation');
  const yoga = allContent.filter(c => c.category === 'yoga');
  const firstName = profile?.full_name?.split(' ')[0];

  return (
    <div className="min-h-screen pb-16 page-transition">
      <HeroBanner contentList={featured} />

      <div className="-mt-12 relative z-10">
        {firstName && (
          <div className="px-5 md:px-8 lg:px-12 py-10 md:py-12 mb-2">
            <h2 className="font-mono text-xl md:text-2xl uppercase tracking-wide text-charcoal-900 mb-3">
              Welkom terug, <span className="text-sage-700">{firstName}</span>
            </h2>
            <p className="text-charcoal-500 text-[14px] font-sans max-w-2xl leading-relaxed">
              Kies waar je verder wilt gaan met je reis
            </p>
          </div>
        )}

        <ContentRow title="" content={featured} linkTo="/library" aspectRatio="landscape" />

        {meditations.length > 0 && (
          <section className="relative mb-10 md:mb-16 py-16 md:py-20 overflow-hidden">
            <div className="absolute inset-0">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover blur-lg scale-110"
              >
                <source src="https://pub-661756f17ee54ab9a3f1511a1362c7bc.r2.dev/1448735-uhd_4096_2160_24fps_1_1-transcode.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-charcoal-900/60" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8 px-5 md:px-8 lg:px-12">
                <h2 className="font-mono text-lg md:text-xl text-white uppercase tracking-wide">
                  Meditaties
                </h2>
                <Link to="/library?category=meditation" className="text-[13px] text-white/80 font-sans hover:text-white transition-colors duration-300 flex items-center gap-1">
                  Bekijk alles
                  <ChevronRight size={14} />
                </Link>
              </div>

              <div className="flex gap-4 overflow-x-auto px-5 md:px-8 lg:px-12 scroll-smooth pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {meditations.map((item) => (
                  <Link
                    key={item.id}
                    to={`/content/${item.id}`}
                    className="group flex-shrink-0 w-[calc((100vw-96px)/2.5)] md:w-[calc((100vw-160px)/5.5)]"
                  >
                    <div className="relative aspect-square overflow-hidden mb-3 transition-all duration-300 rounded-[5px]">
                      <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center transition-opacity group-hover:opacity-90 duration-300">
                          <Play size={16} className="text-charcoal-900 ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    <h3 className="font-mono text-[13px] text-white leading-tight mb-1 group-hover:text-sage-300 transition-colors duration-300 line-clamp-1 uppercase tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-white/60 text-[11px] font-sans">
                      {item.instructor?.name}
                    </p>
                    <p className="text-white/60 text-[11px] font-sans flex items-center gap-1.5 mt-0.5">
                      <Clock size={10} />
                      {item.duration_minutes} min
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <ContentRow title="Yoga Flows" content={yoga} linkTo="/library?category=yoga" aspectRatio="landscape" />
        <CollectionsRow collections={collections} />
        <AllSessionsBanner />
        <ArticlesPreview articles={articles} />
        <CommunityPreview posts={posts} />
      </div>
    </div>
  );
}
