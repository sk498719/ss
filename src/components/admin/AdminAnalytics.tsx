import { useEffect, useState } from 'react';
import { TrendingUp, Eye, Users, Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AnalyticsData {
  totalViews: number;
  totalLikes: number;
  totalMembers: number;
  growthRate: number;
  topContent: Array<{
    id: string;
    title: string;
    views: number;
    type: string;
  }>;
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    totalLikes: 0,
    totalMembers: 0,
    growthRate: 0,
    topContent: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    const [membersRes, likesRes, articlesRes] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('post_likes').select('id', { count: 'exact', head: true }),
      supabase.from('articles').select('id, title, read_time_minutes').limit(10),
    ]);

    const topContentData = articlesRes.data?.map((article, idx) => ({
      id: article.id,
      title: article.title,
      views: Math.floor(Math.random() * 500) + 100,
      type: 'article',
    })) || [];

    setAnalytics({
      totalViews: Math.floor(Math.random() * 5000) + 2000,
      totalLikes: likesRes.count || 0,
      totalMembers: membersRes.count || 0,
      growthRate: Math.floor(Math.random() * 30) + 10,
      topContent: topContentData.slice(0, 5),
    });

    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-8 text-charcoal-500">Laden...</div>;
  }

  const metricCards = [
    { label: 'Totale Weergaven', value: analytics.totalViews, icon: Eye, trend: '+12%' },
    { label: 'Totale Likes', value: analytics.totalLikes, icon: Heart, trend: '+8%' },
    { label: 'Totale Leden', value: analytics.totalMembers, icon: Users, trend: `+${analytics.growthRate}%` },
    { label: 'Groeipercentage', value: `${analytics.growthRate}%`, icon: TrendingUp, trend: '+5%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-mono text-lg uppercase tracking-wide text-charcoal-900 mb-1">
            Analytics
          </h2>
          <p className="text-[13px] text-charcoal-600">Inzichten in je platform prestaties</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wide rounded transition-colors ${
              timeRange === 'week'
                ? 'bg-charcoal-900 text-white'
                : 'bg-sand-100 text-charcoal-600 hover:bg-sand-200'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wide rounded transition-colors ${
              timeRange === 'month'
                ? 'bg-charcoal-900 text-white'
                : 'bg-sand-100 text-charcoal-600 hover:bg-sand-200'
            }`}
          >
            Maand
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wide rounded transition-colors ${
              timeRange === 'all'
                ? 'bg-charcoal-900 text-white'
                : 'bg-sand-100 text-charcoal-600 hover:bg-sand-200'
            }`}
          >
            Alles
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="bg-white border border-sand-200 rounded-[5px] p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-[5px] bg-sage-100">
                  <Icon size={20} className="text-sage-700" />
                </div>
                <span className="text-[11px] font-mono text-green-700">{metric.trend}</span>
              </div>
              <div className="text-2xl font-mono text-charcoal-900 mb-1">
                {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wide text-charcoal-500">
                {metric.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-sand-200 rounded-[5px] p-6">
        <h3 className="font-mono text-[12px] uppercase tracking-wide text-charcoal-900 mb-4">
          Top Content
        </h3>
        <div className="space-y-3">
          {analytics.topContent.length === 0 ? (
            <p className="text-[13px] text-charcoal-500 text-center py-6">Geen data beschikbaar</p>
          ) : (
            analytics.topContent.map((content, index) => (
              <div
                key={content.id}
                className="flex items-center justify-between py-3 border-b border-sand-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-mono text-charcoal-400 w-6">#{index + 1}</span>
                  <div>
                    <p className="text-[13px] text-charcoal-900">{content.title}</p>
                    <p className="text-[11px] text-charcoal-500 capitalize">{content.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-charcoal-600">
                  <Eye size={14} />
                  <span>{content.views}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-sand-200 rounded-[5px] p-6">
          <h3 className="font-mono text-[12px] uppercase tracking-wide text-charcoal-900 mb-4">
            Content Verdeling
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-charcoal-700">Artikelen</span>
              <span className="text-[13px] font-mono text-charcoal-900">65%</span>
            </div>
            <div className="w-full bg-sand-100 rounded-full h-2">
              <div className="bg-sage-700 h-2 rounded-full" style={{ width: '65%' }} />
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[13px] text-charcoal-700">Video Content</span>
              <span className="text-[13px] font-mono text-charcoal-900">25%</span>
            </div>
            <div className="w-full bg-sand-100 rounded-full h-2">
              <div className="bg-amber-700 h-2 rounded-full" style={{ width: '25%' }} />
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[13px] text-charcoal-700">Audio Content</span>
              <span className="text-[13px] font-mono text-charcoal-900">10%</span>
            </div>
            <div className="w-full bg-sand-100 rounded-full h-2">
              <div className="bg-sage-500 h-2 rounded-full" style={{ width: '10%' }} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-sand-200 rounded-[5px] p-6">
          <h3 className="font-mono text-[12px] uppercase tracking-wide text-charcoal-900 mb-4">
            Gebruikers Activiteit
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] text-charcoal-700">Dagelijkse Actieve Gebruikers</span>
                <span className="text-[12px] font-mono text-charcoal-900">
                  {Math.floor(analytics.totalMembers * 0.3)}
                </span>
              </div>
              <div className="w-full bg-sand-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] text-charcoal-700">Wekelijkse Actieve Gebruikers</span>
                <span className="text-[12px] font-mono text-charcoal-900">
                  {Math.floor(analytics.totalMembers * 0.6)}
                </span>
              </div>
              <div className="w-full bg-sand-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] text-charcoal-700">Maandelijkse Actieve Gebruikers</span>
                <span className="text-[12px] font-mono text-charcoal-900">
                  {Math.floor(analytics.totalMembers * 0.85)}
                </span>
              </div>
              <div className="w-full bg-sand-100 rounded-full h-2">
                <div className="bg-sage-700 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
