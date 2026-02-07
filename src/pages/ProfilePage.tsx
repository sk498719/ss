import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Heart, Clock, CreditCard, ChevronRight, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { SubscriptionPlan, UserFavorite, UserProgress } from '../types';

function ProfileHeader() {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from('profiles').update({ full_name: fullName, updated_at: new Date().toISOString() }).eq('id', user.id);
    setSaving(false);
    setEditing(false);
    window.location.reload();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="bg-white rounded-md p-6 mb-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-sage-100 flex items-center justify-center">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User size={24} className="text-sage-600" />
            )}
          </div>
          <div>
            {editing ? (
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-transparent border-b border-sand-300 py-1 text-charcoal-800 text-lg font-sans
                           focus:outline-none focus:border-charcoal-800 transition-colors"
                />
                <button onClick={handleSave} disabled={saving} className="text-sage-600 hover:text-sage-700 text-sm">
                  {saving ? 'Opslaan...' : 'Opslaan'}
                </button>
                <button onClick={() => setEditing(false)} className="text-charcoal-400 text-sm">Annuleren</button>
              </div>
            ) : (
              <button onClick={() => setEditing(true)} className="group">
                <h2 className="font-mono text-base uppercase tracking-wide text-left group-hover:text-sage-600 transition-colors">
                  {profile?.full_name || 'Stel je naam in'}
                </h2>
              </button>
            )}
            <p className="text-charcoal-400 text-sm mt-0.5">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="btn-ghost gap-2 !text-charcoal-400 hover:!text-charcoal-800"
        >
          <LogOut size={14} />
          <span className="hidden md:inline">Uitloggen</span>
        </button>
      </div>
    </div>
  );
}

function SubscriptionSection() {
  const { subscription, user, refreshProfile } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [yearly, setYearly] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      const { data } = await supabase.from('subscription_plans').select('*').eq('is_active', true).order('price_monthly');
      if (data) setPlans(data);
    };
    fetchPlans();
  }, []);

  const handleSubscribe = async (planId: string) => {
    if (!user) return;
    setSubscribing(true);

    const periodEnd = yearly
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    if (subscription) {
      await supabase
        .from('subscriptions')
        .update({
          plan_id: planId,
          billing_cycle: yearly ? 'yearly' : 'monthly',
          current_period_end: periodEnd,
          status: 'active',
        })
        .eq('id', subscription.id);
    } else {
      await supabase.from('subscriptions').insert({
        user_id: user.id,
        plan_id: planId,
        billing_cycle: yearly ? 'yearly' : 'monthly',
        current_period_end: periodEnd,
      });
    }

    await refreshProfile();
    setSubscribing(false);
  };

  const handleCancel = async () => {
    if (!subscription) return;
    await supabase.from('subscriptions').update({ status: 'cancelled' }).eq('id', subscription.id);
    await refreshProfile();
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard size={16} className="text-charcoal-400" />
        <h3 className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal-400">Lidmaatschap</h3>
      </div>

      {subscription?.status === 'active' && subscription.plan ? (
        <div className="bg-white rounded-md p-6 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h4 className="font-mono text-base uppercase tracking-wide">{(subscription.plan as SubscriptionPlan).name}</h4>
              <p className="text-charcoal-400 text-sm mt-1">
                {subscription.billing_cycle === 'yearly' ? 'Jaarlijkse' : 'Maandelijkse'} facturering
              </p>
            </div>
            <span className="px-3 py-1 bg-sage-100 text-sage-700 text-[11px] rounded-full font-sans">
              Actief
            </span>
          </div>
          <p className="text-charcoal-400 text-sm mb-6">
            Verlengt op {new Date(subscription.current_period_end).toLocaleDateString('nl-NL', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <div className="flex gap-3">
            <button onClick={handleCancel} className="btn-ghost !text-terracotta-500 !px-0">
              Abonnement Opzeggen
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-white rounded-md p-8 shadow-sm max-w-lg mx-auto">
            {plans.filter(p => p.price_monthly > 0).slice(0, 1).map((plan) => {
              const monthlyPrice = plan.price_monthly;
              const yearlyPrice = plan.price_yearly;
              const monthlySavings = Math.round((monthlyPrice * 12 - yearlyPrice) * 100) / 100;
              const percentSavings = Math.round((monthlySavings / (monthlyPrice * 12)) * 100);
              const displayPrice = yearly ? yearlyPrice : monthlyPrice;
              const period = yearly ? '/jaar' : '/maand';

              return (
                <div key={plan.id}>
                  <div className="text-center mb-6">
                    <h4 className="font-mono text-lg uppercase tracking-wide mb-2">{plan.name}</h4>
                    <p className="text-charcoal-400 text-sm font-sans">{plan.description}</p>
                  </div>

                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="inline-flex items-center bg-sand-100 rounded-full p-1">
                      <button
                        onClick={() => setYearly(false)}
                        className={`px-5 py-2 text-[13px] font-sans rounded-full transition-all duration-200 ${!yearly ? 'bg-white shadow-sm text-charcoal-800' : 'text-charcoal-400'}`}
                      >
                        Maandelijks
                      </button>
                      <button
                        onClick={() => setYearly(true)}
                        className={`px-5 py-2 text-[13px] font-sans rounded-full transition-all duration-200 relative ${yearly ? 'bg-white shadow-sm text-charcoal-800' : 'text-charcoal-400'}`}
                      >
                        Jaarlijks
                        {!yearly && (
                          <span className="absolute -top-1 -right-1 bg-sage-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-sans whitespace-nowrap">
                            Bespaar {percentSavings}%
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="font-mono text-4xl text-charcoal-800">€{displayPrice}</span>
                      <span className="text-charcoal-400 text-base font-sans">{period}</span>
                    </div>
                    {yearly && (
                      <p className="text-sage-600 text-sm font-sans">
                        Bespaar €{monthlySavings} per jaar
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {(plan.features as string[]).map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-charcoal-600 font-sans">
                        <Check size={16} className="text-sage-500 mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={subscribing}
                    className="w-full py-3 text-sm font-sans rounded-full bg-charcoal-800 text-white hover:bg-charcoal-700 transition-all duration-200 disabled:opacity-50 shadow-sm"
                  >
                    {subscribing ? 'Verwerken...' : 'Start nu'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function FavoritesSection() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchFavorites = async () => {
      const { data } = await supabase
        .from('user_favorites')
        .select('*, content:content(*, instructor:instructors(*))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6);
      if (data) setFavorites(data);
    };
    fetchFavorites();
  }, [user]);

  if (favorites.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Heart size={16} className="text-charcoal-400" />
        <h3 className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal-400">Opgeslagen Praktijken</h3>
      </div>

      <div className="space-y-2">
        {favorites.map((fav) => {
          if (!fav.content) return null;
          return (
            <Link
              key={fav.id}
              to={`/content/${fav.content.id}`}
              className="flex items-center gap-4 bg-white rounded-md p-4 hover:shadow-sm transition-shadow group"
            >
              <img
                src={fav.content.thumbnail_url}
                alt={fav.content.title}
                className="w-16 h-12 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate group-hover:text-sage-600 transition-colors">
                  {fav.content.title}
                </h4>
                <p className="text-charcoal-400 text-xs capitalize">{fav.content.category} &middot; {fav.content.duration_minutes} min</p>
              </div>
              <ChevronRight size={14} className="text-charcoal-300 group-hover:text-charcoal-600 transition-colors" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function ProgressSection() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchProgress = async () => {
      const { data } = await supabase
        .from('user_progress')
        .select('*, content:content(*, instructor:instructors(*))')
        .eq('user_id', user.id)
        .order('last_played_at', { ascending: false })
        .limit(5);
      if (data) setProgress(data);
    };
    fetchProgress();
  }, [user]);

  if (progress.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Clock size={16} className="text-charcoal-400" />
        <h3 className="font-sans text-[11px] tracking-[0.2em] uppercase text-charcoal-400">Recente Activiteit</h3>
      </div>

      <div className="space-y-2">
        {progress.map((p) => {
          if (!p.content) return null;
          const pct = Math.round((p.progress_seconds / (p.content.duration_minutes * 60)) * 100);
          return (
            <Link
              key={p.id}
              to={`/content/${p.content.id}`}
              className="flex items-center gap-4 bg-white rounded-md p-4 hover:shadow-sm transition-shadow group"
            >
              <img
                src={p.content.thumbnail_url}
                alt={p.content.title}
                className="w-16 h-12 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate group-hover:text-sage-600 transition-colors">
                  {p.content.title}
                </h4>
                <div className="mt-1.5 h-1 bg-sand-200 rounded-full overflow-hidden">
                  <div className="h-full bg-sage-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <span className="text-charcoal-400 text-xs">{p.completed ? 'Voltooid' : `${pct}%`}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="pt-14 min-h-screen">
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-8 md:py-12">
        <div className="mb-10">
          <h1 className="font-mono text-2xl md:text-3xl uppercase tracking-wide mb-1">Profiel</h1>
          <p className="text-charcoal-400 text-sm font-sans">Beheer je account en lidmaatschap.</p>
        </div>

        <ProfileHeader />
        <SubscriptionSection />
        <FavoritesSection />
        <ProgressSection />
      </div>
    </div>
  );
}
