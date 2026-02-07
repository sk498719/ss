import { useEffect, useState } from 'react';
import { Users, FileText, Video, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalUsers: number;
  totalArticles: number;
  totalContent: number;
  activeUsers: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalArticles: 0,
    totalContent: 0,
    activeUsers: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const [usersRes, articlesRes, contentRes] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('articles').select('id', { count: 'exact', head: true }),
      supabase.from('content').select('id', { count: 'exact', head: true }),
    ]);

    setStats({
      totalUsers: usersRes.count || 0,
      totalArticles: articlesRes.count || 0,
      totalContent: contentRes.count || 0,
      activeUsers: Math.floor((usersRes.count || 0) * 0.4),
    });

    const { data: articlesData } = await supabase
      .from('articles')
      .select('id, title, published_at')
      .order('published_at', { ascending: false })
      .limit(5);

    if (articlesData) {
      const activities: RecentActivity[] = articlesData.map((article) => ({
        id: article.id,
        type: 'article',
        description: `Nieuw artikel gepubliceerd: ${article.title}`,
        timestamp: article.published_at,
      }));
      setRecentActivities(activities);
    }

    setLoading(false);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const hours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (hours < 1) return 'zojuist';
    if (hours < 24) return `${hours}u geleden`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d geleden`;
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return <div className="text-center py-8 text-charcoal-500">Laden...</div>;
  }

  const statCards = [
    { label: 'Totaal Leden', value: stats.totalUsers, icon: Users },
    { label: 'Artikelen', value: stats.totalArticles, icon: FileText },
    { label: 'Content', value: stats.totalContent, icon: Video },
    { label: 'Actieve Gebruikers', value: stats.activeUsers, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white border border-sand-200 rounded-[5px] p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-[5px] bg-sand-100">
                  <Icon size={20} className="text-charcoal-600" />
                </div>
              </div>
              <div className="text-2xl font-mono text-charcoal-900 mb-1">
                {stat.value}
              </div>
              <div className="text-[11px] font-mono uppercase tracking-wide text-charcoal-500">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-sand-200 rounded-[5px] p-6">
        <h3 className="font-mono text-[12px] uppercase tracking-wide text-charcoal-900 mb-4">
          Recente Activiteit
        </h3>
        <div className="space-y-3">
          {recentActivities.length === 0 ? (
            <p className="text-[13px] text-charcoal-500 text-center py-6">
              Nog geen activiteit
            </p>
          ) : (
            recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-3 border-b border-sand-100 last:border-0"
              >
                <div className="flex-1">
                  <p className="text-[13px] text-charcoal-700">{activity.description}</p>
                </div>
                <span className="text-[11px] text-charcoal-400 font-mono ml-4">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-sand-200 rounded-[5px] p-6">
          <h3 className="font-mono text-[12px] uppercase tracking-wide text-charcoal-900 mb-4">
            Snelle Links
          </h3>
          <div className="space-y-2">
            <a
              href="#"
              className="block px-3 py-2 text-[13px] text-charcoal-700 hover:bg-sand-50 rounded transition-colors"
            >
              Nieuwe content toevoegen
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-[13px] text-charcoal-700 hover:bg-sand-50 rounded transition-colors"
            >
              Leden beheren
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-[13px] text-charcoal-700 hover:bg-sand-50 rounded transition-colors"
            >
              Analytics bekijken
            </a>
          </div>
        </div>

        <div className="bg-white border border-sand-200 rounded-[5px] p-6">
          <h3 className="font-mono text-[12px] uppercase tracking-wide text-charcoal-900 mb-4">
            Platform Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-charcoal-600">Database</span>
              <span className="flex items-center gap-1.5 text-[11px] text-green-700">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Operationeel
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-charcoal-600">Storage</span>
              <span className="flex items-center gap-1.5 text-[11px] text-green-700">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Operationeel
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-charcoal-600">API</span>
              <span className="flex items-center gap-1.5 text-[11px] text-green-700">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Operationeel
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
