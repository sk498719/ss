import { useEffect, useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { CommunityPost } from '../types';

const PLACEHOLDER_POST = {
  id: 'placeholder-1',
  title: 'Welkom bij de Serra & Soul Gemeenschap',
  body: 'Hier delen we updates, inspiratie en reflecties over onze praktijken. Verbind met ons via de WhatsApp community om deel te nemen aan discussies en je reis met anderen te delen.\n\nWe kijken ernaar uit om met je te verbinden!',
  author: { full_name: 'Serra & Soul Team', avatar_url: null },
  created_at: new Date().toISOString(),
  image_url: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg',
  likes_count: 0,
};

function PostCard({ post, userLiked, onLikeToggle, isLoggedIn }: {
  post: CommunityPost | typeof PLACEHOLDER_POST;
  userLiked: boolean;
  onLikeToggle: () => void;
  isLoggedIn: boolean;
}) {
  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Vandaag';
    if (days === 1) return 'Gisteren';
    if (days < 7) return `${days} dagen geleden`;
    if (days < 30) return `${Math.floor(days / 7)} weken geleden`;
    return new Date(date).toLocaleDateString('nl-NL', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <article className="bg-sand-50 border border-sand-200 rounded-[5px] overflow-hidden transition-all duration-300">
      {post.image_url && (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-300 to-sage-500 flex items-center justify-center overflow-hidden">
            {post.author?.avatar_url ? (
              <img src={post.author.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-sm font-medium font-mono">
                {post.author?.full_name?.charAt(0) || 'S'}
              </span>
            )}
          </div>
          <div>
            <p className="text-[13px] font-sans font-medium text-charcoal-900">{post.author?.full_name || 'Serra & Soul'}</p>
            <p className="text-charcoal-400 text-[11px] font-sans">{timeAgo(post.created_at)}</p>
          </div>
        </div>

        <h3 className="font-mono text-base uppercase tracking-wide mb-3 text-charcoal-900">{post.title}</h3>
        <p className="text-charcoal-500 text-[13px] font-sans leading-relaxed whitespace-pre-line mb-6">{post.body}</p>

        <div className="flex items-center gap-4 pt-4 border-t border-sand-200">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isLoggedIn) {
                onLikeToggle();
              } else {
                alert('Log in om deze post te liken');
              }
            }}
            disabled={!isLoggedIn}
            className={`flex items-center gap-2 text-[13px] font-sans transition-all duration-300 ${
              userLiked
                ? 'text-sage-700'
                : 'text-charcoal-400 hover:text-sage-700'
            } ${!isLoggedIn ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
            title={!isLoggedIn ? 'Log in om te liken' : ''}
          >
            <Heart
              size={18}
              className={`transition-all duration-300 ${userLiked ? 'fill-current' : ''}`}
            />
            <span>{post.likes_count || 0}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function WhatsAppBanner() {
  return (
    <div className="bg-white border border-sand-200 rounded-[5px] p-6 sticky top-20">
      <h3 className="font-mono text-[12px] uppercase tracking-wide text-charcoal-900 mb-3">
        WhatsApp Community
      </h3>
      <p className="text-charcoal-600 text-[13px] font-sans leading-relaxed mb-6">
        Verbind met medeleden en ontvang updates over live sessies en events.
      </p>
      <a
        href="https://chat.whatsapp.com/serra-soul-community"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-full gap-2 bg-charcoal-900 text-white px-4 py-2.5 rounded-[5px] text-[11px] font-mono uppercase tracking-wide hover:bg-charcoal-800 transition-all duration-300"
      >
        <MessageCircle size={16} />
        Lid Worden
      </a>
    </div>
  );
}

export default function CommunityPage() {
  const { user } = useAuth();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [userLiked, setUserLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('community_posts')
      .select('*, author:profiles(*)')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setPost(data);

      if (user) {
        const { data: likeData } = await supabase
          .from('post_likes')
          .select('id')
          .eq('post_id', data.id)
          .eq('user_id', user.id)
          .maybeSingle();

        setUserLiked(!!likeData);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPost();
  }, [user]);

  const handleLikeToggle = async () => {
    if (!user || !post) return;

    if (userLiked) {
      await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', post.id)
        .eq('user_id', user.id);

      setUserLiked(false);
      setPost({ ...post, likes_count: (post.likes_count || 1) - 1 });
    } else {
      await supabase
        .from('post_likes')
        .insert({ post_id: post.id, user_id: user.id });

      setUserLiked(true);
      setPost({ ...post, likes_count: (post.likes_count || 0) + 1 });
    }
  };

  const displayPost = post || PLACEHOLDER_POST;

  return (
    <div className="pt-14 min-h-screen bg-sand-50 page-transition">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="font-mono text-2xl md:text-3xl uppercase tracking-wide mb-2 text-charcoal-900">Gemeenschap</h1>
          <p className="text-charcoal-400 text-[13px] font-sans leading-relaxed">
            Updates en inspiratie van het Serra & Soul team.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 max-w-2xl">
            {loading ? (
              <div className="animate-pulse bg-sand-50 border border-sand-200 rounded-[5px] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-sand-200" />
                  <div className="flex-1">
                    <div className="h-3 bg-sand-200 rounded-full w-24 mb-2" />
                    <div className="h-2 bg-sand-100 rounded-full w-16" />
                  </div>
                </div>
                <div className="h-4 bg-sand-200 rounded-full w-2/3 mb-3" />
                <div className="h-3 bg-sand-100 rounded-full w-full mb-2" />
                <div className="h-3 bg-sand-100 rounded-full w-3/4" />
              </div>
            ) : (
              <PostCard
                post={displayPost}
                userLiked={userLiked}
                onLikeToggle={handleLikeToggle}
                isLoggedIn={!!user}
              />
            )}
          </div>

          <aside className="hidden lg:block w-80">
            <WhatsAppBanner />
          </aside>
        </div>
      </div>
    </div>
  );
}
