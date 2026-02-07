import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Layout, Users, FolderOpen, FileText, BarChart3, CreditCard, Home } from 'lucide-react';
import LoadingScreen from '../components/ui/LoadingScreen';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminContent from '../components/admin/AdminContent';
import AdminInstructors from '../components/admin/AdminInstructors';
import AdminCollections from '../components/admin/AdminCollections';
import AdminArticles from '../components/admin/AdminArticles';
import AdminMembers from '../components/admin/AdminMembers';
import AdminAnalytics from '../components/admin/AdminAnalytics';
import AdminSubscriptions from '../components/admin/AdminSubscriptions';

type Tab = 'dashboard' | 'content' | 'instructors' | 'collections' | 'articles' | 'members' | 'analytics' | 'subscriptions';

export default function AdminPage() {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  if (loading) return <LoadingScreen />;

  if (!user || (profile?.role !== 'admin' && profile?.role !== 'facilitator')) {
    return <Navigate to="/dashboard" replace />;
  }

  const tabs = [
    { key: 'dashboard' as Tab, label: 'Dashboard', icon: Home },
    { key: 'content' as Tab, label: 'Content', icon: Layout },
    { key: 'articles' as Tab, label: 'Artikelen', icon: FileText },
    { key: 'collections' as Tab, label: 'Collecties', icon: FolderOpen },
    { key: 'instructors' as Tab, label: 'Facilitators', icon: Users },
    { key: 'members' as Tab, label: 'Leden', icon: Users },
    { key: 'subscriptions' as Tab, label: 'Abonnementen', icon: CreditCard },
    { key: 'analytics' as Tab, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="pt-14 min-h-screen bg-sand-50 page-transition flex">
      <aside className="hidden lg:flex flex-col w-64 sticky top-14 h-[calc(100vh-3.5rem)]">
        <div className="m-6 bg-white rounded-[5px] shadow-sm border border-sand-200 flex flex-col overflow-hidden">
          <nav className="p-4 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-[12px] font-mono uppercase tracking-wide rounded-[5px] transition-all duration-200
                    ${activeTab === tab.key
                      ? 'bg-charcoal-900 text-white shadow-sm'
                      : 'text-charcoal-600 hover:bg-sand-50 hover:text-charcoal-900'
                    }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-sand-200 z-40">
        <div className="flex items-center overflow-x-auto px-2 py-2" style={{ scrollbarWidth: 'none' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-col items-center gap-1 px-3 py-2 text-[10px] font-mono uppercase whitespace-nowrap transition-all duration-200 min-w-[80px]
                  ${activeTab === tab.key
                    ? 'text-charcoal-900'
                    : 'text-charcoal-400'
                  }`}
              >
                <Icon size={18} />
                <span className="truncate w-full text-center">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="flex-1 p-6 md:p-8 lg:p-10 pb-24 lg:pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="font-mono text-xl md:text-2xl uppercase tracking-wide text-charcoal-900 mb-2">
              {tabs.find(t => t.key === activeTab)?.label}
            </h1>
            <p className="text-charcoal-600 text-[13px]">
              Beheer je platform effectief
            </p>
          </div>

          <div>
            {activeTab === 'dashboard' && <AdminDashboard />}
            {activeTab === 'content' && <AdminContent />}
            {activeTab === 'instructors' && <AdminInstructors />}
            {activeTab === 'collections' && <AdminCollections />}
            {activeTab === 'articles' && <AdminArticles />}
            {activeTab === 'members' && <AdminMembers />}
            {activeTab === 'analytics' && <AdminAnalytics />}
            {activeTab === 'subscriptions' && <AdminSubscriptions />}
          </div>
        </div>
      </main>
    </div>
  );
}
