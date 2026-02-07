import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Play, Pause, Clock, ArrowLeft, Heart, Maximize2, Minimize2, Volume2, VolumeX
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Content } from '../types';
import ContentCard from '../components/ui/ContentCard';

export default function ContentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, subscription } = useAuth();
  const [content, setContent] = useState<Content | null>(null);
  const [related, setRelated] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) return;
      setLoading(true);
      setIsPlaying(false);
      setProgress(0);
      setIsFocusMode(false);

      const { data } = await supabase
        .from('content')
        .select('*, instructor:instructors(*)')
        .eq('id', id)
        .maybeSingle();

      if (data) {
        setContent(data);
        const { data: relatedData } = await supabase
          .from('content')
          .select('*, instructor:instructors(*)')
          .eq('category', data.category)
          .neq('id', id)
          .limit(4);
        if (relatedData) setRelated(relatedData);
      }

      if (user) {
        const { data: fav } = await supabase
          .from('user_favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('content_id', id)
          .maybeSingle();
        setIsFavorite(!!fav);
      }

      setLoading(false);
    };
    fetchContent();
  }, [id, user]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setProgress(Math.floor(video.currentTime));
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [content]);

  const toggleFavorite = async () => {
    if (!user || !id) return;
    if (isFavorite) {
      await supabase.from('user_favorites').delete().eq('user_id', user.id).eq('content_id', id);
      setIsFavorite(false);
    } else {
      await supabase.from('user_favorites').insert({ user_id: user.id, content_id: id });
      setIsFavorite(true);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const canAccess = !content?.is_premium || subscription?.status === 'active';
  const isMeditation = content?.category === 'meditation';

  if (loading) {
    return (
      <div className="pt-14 min-h-screen bg-sand-50">
        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 py-12">
          <div className="animate-pulse">
            <div className="aspect-[16/7] bg-sand-200 rounded-[5px] mb-8" />
            <div className="h-8 bg-sand-200 rounded-full w-1/3 mb-4" />
            <div className="h-4 bg-sand-100 rounded-full w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="pt-14 min-h-screen flex items-center justify-center bg-sand-50">
        <div className="text-center">
          <h2 className="font-mono text-base text-charcoal-400 uppercase tracking-wide mb-4">Inhoud niet gevonden</h2>
          <Link to="/library" className="text-[13px] text-charcoal-600 hover:text-charcoal-900 transition-colors">Terug naar Bibliotheek</Link>
        </div>
      </div>
    );
  }

  const totalSeconds = content.duration_minutes * 60;
  const progressPercent = (progress / totalSeconds) * 100;

  if (isFocusMode && isMeditation) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover blur-3xl scale-110"
          >
            <source src="https://pub-661756f17ee54ab9a3f1511a1362c7bc.r2.dev/1448735-uhd_4096_2160_24fps_1_1-transcode.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-charcoal-900/70" />
        </div>

        <button
          onClick={() => setIsFocusMode(false)}
          className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10"
        >
          <Minimize2 size={20} />
        </button>

        <div className="relative z-10 text-center px-6 max-w-3xl">
          <div className="mb-10">
            <img
              src={content.thumbnail_url}
              alt={content.title}
              className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-[5px] object-cover shadow-2xl"
            />
          </div>

          <h1 className="font-mono text-2xl md:text-3xl text-white uppercase tracking-wide mb-3">
            {content.title}
          </h1>
          <p className="text-white/60 text-sm mb-12">{content.instructor?.name}</p>

          <div className="mb-12">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-all mx-auto border border-white/20"
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" fill="currentColor" />}
            </button>
          </div>

          <div className="max-w-md mx-auto">
            <div className="h-1 bg-white/10 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-white/60 transition-all duration-1000 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-white/60 text-xs font-mono">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(totalSeconds)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isVideo = content.category === 'yoga' || content.category === 'pilates';
  const hasVideo = isVideo && content.media_url;

  if (isMeditation) {
    return (
      <div className="pt-14 min-h-screen bg-sand-50 page-transition">
        <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-charcoal-900">
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover blur-3xl scale-110"
            >
              <source src="https://pub-661756f17ee54ab9a3f1511a1362c7bc.r2.dev/1448735-uhd_4096_2160_24fps_1_1-transcode.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-charcoal-900/70" />
          </div>

          <div className="absolute top-6 left-6 md:top-8 md:left-12 z-20">
            <Link
              to="/library"
              className="inline-flex items-center gap-2 text-white/80 text-[13px] font-mono uppercase tracking-wide hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              Terug
            </Link>
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
            <div className="mb-8">
              <img
                src={content.thumbnail_url}
                alt={content.title}
                className="w-48 h-48 md:w-64 md:h-64 mx-auto rounded-[5px] object-cover shadow-2xl"
              />
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-white/70 text-[11px] font-mono uppercase tracking-widest">
                Meditatie
              </span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="text-white/70 text-[11px] font-mono uppercase tracking-wide capitalize">{content.difficulty}</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="text-white/70 text-[11px] font-mono uppercase tracking-wide">{content.duration_minutes} min</span>
            </div>

            <h1 className="font-mono text-2xl md:text-4xl text-white uppercase tracking-wide mb-3 max-w-3xl">
              {content.title}
            </h1>

            {content.instructor && (
              <p className="text-white/70 text-[15px] mb-8">begeleid door {content.instructor.name}</p>
            )}

            {canAccess && (
              <div className="mb-8">
                <button
                  onClick={() => {
                    if (!isPlaying) {
                      setIsFocusMode(true);
                    }
                    setIsPlaying(!isPlaying);
                  }}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-all mx-auto border border-white/20"
                >
                  {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" fill="currentColor" />}
                </button>
              </div>
            )}

            <div className="max-w-md w-full mx-auto">
              <div className="h-1 bg-white/10 rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full bg-white/60 transition-all duration-1000 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-white/60 text-xs font-mono">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(totalSeconds)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={toggleFavorite}
                className="flex items-center gap-2 px-4 py-2.5 text-[12px] font-mono uppercase tracking-wide transition-all rounded-[5px] border border-white/20 text-white hover:bg-white/10"
              >
                <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
                {isFavorite ? 'Opgeslagen' : 'Opslaan'}
              </button>
              <button
                onClick={() => setIsFocusMode(true)}
                className="flex items-center gap-2 px-4 py-2.5 border border-white/20 text-white text-[12px] font-mono uppercase tracking-wide rounded-[5px] hover:bg-white/10 transition-all"
              >
                <Maximize2 size={14} />
                Focus Modus
              </button>
            </div>
          </div>
        </div>

        <div className="w-full bg-sand-50">
          <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 py-16 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
              <div className="md:col-span-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-6">
                  Details
                </p>

                <div className="space-y-6">
                  <div>
                    <p className="text-[12px] text-charcoal-900 mb-1">{content.duration_minutes} min</p>
                    <p className="font-mono text-[10px] uppercase tracking-wide text-charcoal-400">
                      {content.category === 'meditation' ? 'Meditatie' : content.category}
                    </p>
                  </div>

                  {content.instructor && (
                    <div className="flex items-center gap-3 pt-4">
                      <img
                        src={content.instructor.avatar_url}
                        alt={content.instructor.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-[12px] text-charcoal-900 mb-0.5">
                          {content.instructor.name}
                        </p>
                        <p className="font-mono text-[10px] uppercase tracking-wide text-charcoal-400">
                          Facilitator
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-9">
                <p className="text-charcoal-700 leading-relaxed text-[12px] mb-8">
                  {content.description}
                </p>

                {content.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {content.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1.5 bg-sand-100 text-charcoal-600 text-[10px] font-mono uppercase tracking-wide rounded-[5px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="border-t border-sand-200 pt-12 pb-12">
              <div className="max-w-7xl mx-auto px-5 md:px-8">
                <h2 className="font-mono text-base uppercase tracking-wide text-charcoal-900 mb-6">Meer Meditaties</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {related.map((item) => (
                    <ContentCard key={item.id} content={item} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-14 min-h-screen bg-sand-50 page-transition">
      <div
        className="relative aspect-[16/9] overflow-hidden bg-charcoal-900 group cursor-pointer"
        onClick={() => canAccess && setIsPlaying(!isPlaying)}
      >
        {hasVideo ? (
          <video
            ref={videoRef}
            src={content.media_url}
            className="w-full h-full object-cover"
            playsInline
            preload="auto"
            onClick={(e) => {
              e.stopPropagation();
              if (canAccess) setIsPlaying(!isPlaying);
            }}
          />
        ) : (
          <>
            <img
              src={content.thumbnail_url}
              alt={content.title}
              className={`w-full h-full object-cover transition-all duration-700 ${isPlaying ? 'scale-105 opacity-40' : 'scale-100 opacity-100'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/40 to-transparent" />
          </>
        )}

        <div className="absolute top-6 left-6 md:top-8 md:left-12 z-20">
          <Link
            to="/library"
            className="inline-flex items-center gap-2 text-white/80 text-[13px] font-mono uppercase tracking-wide hover:text-white transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ArrowLeft size={16} />
            Terug
          </Link>
        </div>

        {canAccess && (
          <>
            <div
              className={`absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
              }}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/95 text-charcoal-900 flex items-center justify-center hover:scale-105 hover:bg-white transition-all duration-300 shadow-2xl">
                {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" fill="currentColor" />}
              </div>
            </div>

            <div
              className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12 z-10 bg-gradient-to-t from-charcoal-900 via-charcoal-900/80 to-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-end justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-white/80 text-[11px] font-mono uppercase tracking-widest">
                      {content.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span className="text-white/70 text-[11px] font-mono uppercase tracking-wide capitalize">{content.difficulty}</span>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span className="text-white/70 text-[11px] font-mono uppercase tracking-wide">{content.duration_minutes} min</span>
                  </div>
                  <h1 className="font-mono text-lg md:text-xl lg:text-2xl text-white uppercase tracking-wide mb-2">
                    {content.title}
                  </h1>
                  {content.instructor && (
                    <p className="text-white/70 text-[13px] font-sans">met {content.instructor.name}</p>
                  )}
                </div>

                <div className="hidden md:flex items-center gap-3">
                  <button
                    onClick={toggleFavorite}
                    className="text-white hover:text-white/70 transition-all duration-300"
                  >
                    <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={isFavorite ? 0 : 2} />
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white hover:text-white/70 transition-all duration-300"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <div className="h-1 bg-white/20 relative rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-white/60 font-mono">{formatTime(progress)}</span>
                  <span className="text-xs text-white/60 font-mono">{formatTime(totalSeconds)}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="w-full bg-sand-50">
        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
            <div className="md:col-span-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal-400 mb-6">
                Details
              </p>

              <div className="space-y-6">
                <div>
                  <p className="text-[12px] text-charcoal-900 mb-1">{content.duration_minutes} min</p>
                  <p className="font-mono text-[10px] uppercase tracking-wide text-charcoal-400">
                    {content.category === 'yoga' ? 'Yoga' : content.category === 'pilates' ? 'Pilates' : content.category}
                  </p>
                </div>

                <div>
                  <p className="text-[12px] text-charcoal-900 mb-1 capitalize">
                    {content.difficulty === 'beginner' ? 'Beginner' : content.difficulty === 'intermediate' ? 'Gemiddeld' : 'Gevorderd'}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-wide text-charcoal-400">
                    Niveau
                  </p>
                </div>

                {content.instructor && (
                  <div className="flex items-center gap-3 pt-4">
                    <img
                      src={content.instructor.avatar_url}
                      alt={content.instructor.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-[12px] text-charcoal-900 mb-0.5">
                        {content.instructor.name}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-wide text-charcoal-400">
                        Facilitator
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-9">
              <p className="text-charcoal-700 leading-relaxed text-[12px] mb-8">
                {content.description}
              </p>

              {content.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {content.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-sand-100 text-charcoal-600 text-[10px] font-mono uppercase tracking-wide rounded-[5px]">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="w-full px-5 md:px-8 lg:px-12 py-12 bg-sand-50 border-t border-sand-200">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-mono text-base uppercase tracking-wide text-charcoal-900 mb-6">
              Meer {content.category === 'yoga' ? 'Yoga' : content.category === 'pilates' ? 'Pilates' : content.category === 'online_sessie' ? 'Online Sessies' : content.category}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
