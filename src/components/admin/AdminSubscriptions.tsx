import { useEffect, useState } from 'react';
import { CreditCard, Calendar, DollarSign } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Subscription {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  status: string;
  plan: string;
  amount: number;
  start_date: string;
  end_date: string;
}

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    const { data: profiles } = await supabase.from('profiles').select('*');

    if (profiles) {
      const subs: Subscription[] = profiles.map((profile) => ({
        id: profile.id,
        user_id: profile.id,
        user_name: profile.full_name || 'Naamloos',
        user_email: 'member@example.com',
        status: profile.subscription_status || 'free',
        plan: profile.subscription_status === 'active' ? 'Premium' : 'Free',
        amount: profile.subscription_status === 'active' ? 29.99 : 0,
        start_date: profile.created_at,
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }));
      setSubscriptions(subs);
    }
    setLoading(false);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-900';
      case 'cancelled':
        return 'bg-red-100 text-red-900';
      case 'past_due':
        return 'bg-yellow-100 text-yellow-900';
      default:
        return 'bg-sand-200 text-charcoal-700';
    }
  };

  const filteredSubscriptions = subscriptions.filter(
    (sub) => filterStatus === 'all' || sub.status === filterStatus
  );

  const totalRevenue = subscriptions
    .filter((sub) => sub.status === 'active')
    .reduce((sum, sub) => sum + sub.amount, 0);

  const activeCount = subscriptions.filter((sub) => sub.status === 'active').length;
  const cancelledCount = subscriptions.filter((sub) => sub.status === 'cancelled').length;

  if (loading) {
    return <div className="text-center py-8 text-charcoal-500">Laden...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-mono text-lg uppercase tracking-wide text-charcoal-900 mb-1">
          Abonnementen
        </h2>
        <p className="text-[13px] text-charcoal-600">Beheer lidmaatschappen en betalingen</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-sand-200 rounded-[5px] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-[5px] bg-green-100">
              <DollarSign size={20} className="text-green-700" />
            </div>
          </div>
          <div className="text-2xl font-mono text-charcoal-900 mb-1">
            €{totalRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] font-mono uppercase tracking-wide text-charcoal-500">
            Maandelijkse Omzet
          </div>
        </div>

        <div className="bg-white border border-sand-200 rounded-[5px] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-[5px] bg-sage-100">
              <CreditCard size={20} className="text-sage-700" />
            </div>
          </div>
          <div className="text-2xl font-mono text-charcoal-900 mb-1">{activeCount}</div>
          <div className="text-[11px] font-mono uppercase tracking-wide text-charcoal-500">
            Actieve Abonnementen
          </div>
        </div>

        <div className="bg-white border border-sand-200 rounded-[5px] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-[5px] bg-red-100">
              <Calendar size={20} className="text-red-700" />
            </div>
          </div>
          <div className="text-2xl font-mono text-charcoal-900 mb-1">{cancelledCount}</div>
          <div className="text-[11px] font-mono uppercase tracking-wide text-charcoal-500">
            Geannuleerd
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wide rounded transition-colors ${
            filterStatus === 'all'
              ? 'bg-charcoal-900 text-white'
              : 'bg-sand-100 text-charcoal-600 hover:bg-sand-200'
          }`}
        >
          Alles
        </button>
        <button
          onClick={() => setFilterStatus('active')}
          className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wide rounded transition-colors ${
            filterStatus === 'active'
              ? 'bg-charcoal-900 text-white'
              : 'bg-sand-100 text-charcoal-600 hover:bg-sand-200'
          }`}
        >
          Actief
        </button>
        <button
          onClick={() => setFilterStatus('cancelled')}
          className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wide rounded transition-colors ${
            filterStatus === 'cancelled'
              ? 'bg-charcoal-900 text-white'
              : 'bg-sand-100 text-charcoal-600 hover:bg-sand-200'
          }`}
        >
          Geannuleerd
        </button>
        <button
          onClick={() => setFilterStatus('free')}
          className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wide rounded transition-colors ${
            filterStatus === 'free'
              ? 'bg-charcoal-900 text-white'
              : 'bg-sand-100 text-charcoal-600 hover:bg-sand-200'
          }`}
        >
          Gratis
        </button>
      </div>

      <div className="bg-white rounded-[5px] border border-sand-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sand-50 border-b border-sand-200">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wide text-charcoal-600">
                  Gebruiker
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wide text-charcoal-600">
                  Plan
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wide text-charcoal-600">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wide text-charcoal-600">
                  Bedrag
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wide text-charcoal-600">
                  Startdatum
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wide text-charcoal-600">
                  Einddatum
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {filteredSubscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-sand-50 transition-colors">
                  <td className="px-4 py-3 text-[13px] text-charcoal-900">{sub.user_name}</td>
                  <td className="px-4 py-3 text-[13px] text-charcoal-600">{sub.plan}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-[10px] font-mono uppercase tracking-wide ${getStatusBadgeColor(
                        sub.status
                      )}`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-charcoal-900 font-mono">
                    €{sub.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-charcoal-600">
                    {new Date(sub.start_date).toLocaleDateString('nl-NL')}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-charcoal-600">
                    {new Date(sub.end_date).toLocaleDateString('nl-NL')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
