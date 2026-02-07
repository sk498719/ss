import { useEffect, useState } from 'react';
import { Search, Edit, Trash2, X, Shield, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Member {
  id: string;
  email: string;
  full_name: string;
  role: string;
  subscription_status: string;
  created_at: string;
}

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [newRole, setNewRole] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('member');
  const [newMemberPassword, setNewMemberPassword] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = members.filter(
        (member) =>
          member.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers(members);
    }
  }, [searchQuery, members]);

  const fetchMembers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      const membersWithEmails = await Promise.all(
        data.map(async (profile) => {
          const { data: userData } = await supabase.auth.admin.getUserById(profile.id);
          return {
            ...profile,
            email: userData?.user?.email || 'N/A',
          };
        })
      );
      setMembers(membersWithEmails);
      setFilteredMembers(membersWithEmails);
    }
    setLoading(false);
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setNewRole(member.role);
    setNewEmail(member.email);
    setNewName(member.full_name);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editingMember) return;

    await supabase
      .from('profiles')
      .update({
        role: newRole,
        full_name: newName
      })
      .eq('id', editingMember.id);

    if (newEmail !== editingMember.email) {
      await supabase.auth.admin.updateUserById(
        editingMember.id,
        { email: newEmail }
      );
    }

    setShowEditModal(false);
    setEditingMember(null);
    fetchMembers();
  };

  const handleAddMember = async () => {
    if (!newMemberEmail || !newMemberPassword || !newMemberName) {
      alert('Vul alle velden in');
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newMemberEmail,
        password: newMemberPassword,
        email_confirm: true
      });

      if (authError) throw authError;

      if (authData.user) {
        await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            full_name: newMemberName,
            role: newMemberRole,
          });
      }

      setShowAddModal(false);
      setNewMemberEmail('');
      setNewMemberName('');
      setNewMemberPassword('');
      setNewMemberRole('member');
      fetchMembers();
    } catch (error: any) {
      alert('Fout bij toevoegen lid: ' + error.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Weet je zeker dat je ${name} wilt verwijderen?`)) {
      await supabase.from('profiles').delete().eq('id', id);
      fetchMembers();
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-amber-100 text-amber-900';
      case 'instructor':
        return 'bg-sage-100 text-sage-900';
      default:
        return 'bg-sand-200 text-charcoal-700';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-900';
      case 'cancelled':
        return 'bg-red-100 text-red-900';
      default:
        return 'bg-sand-200 text-charcoal-700';
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-charcoal-500">Laden...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-[12px] text-charcoal-600">Beheer platformleden en hun rollen</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-charcoal-900 text-white text-[12px] font-mono uppercase tracking-wide hover:bg-charcoal-800 transition-colors rounded-[5px]"
        >
          <Plus size={16} />
          Lid Toevoegen
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400"
          />
          <input
            type="text"
            placeholder="Zoek op naam of email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-sand-200 rounded-[5px] text-[13px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
          />
        </div>
      </div>

      {showEditModal && editingMember && (
        <div className="fixed inset-0 bg-charcoal-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[5px] p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-mono text-lg uppercase tracking-wide text-charcoal-900">
                Lid Bewerken
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-charcoal-400 hover:text-charcoal-900"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-2">
                  Naam *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[12px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[12px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-2">
                  Rol *
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[12px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                >
                  <option value="member">Lid</option>
                  <option value="instructor">Instructeur</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdate}
                  className="flex-1 px-4 py-2.5 bg-charcoal-900 text-white text-[12px] font-mono uppercase tracking-wide hover:bg-charcoal-800 transition-colors rounded-[5px]"
                >
                  Opslaan
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 border border-sand-300 text-charcoal-700 text-[12px] font-mono uppercase tracking-wide hover:border-charcoal-900 transition-colors rounded-[5px]"
                >
                  Annuleren
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-charcoal-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[5px] p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-mono text-lg uppercase tracking-wide text-charcoal-900">
                Nieuw Lid Toevoegen
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-charcoal-400 hover:text-charcoal-900"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-2">
                  Naam *
                </label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[12px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[12px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-2">
                  Wachtwoord *
                </label>
                <input
                  type="password"
                  value={newMemberPassword}
                  onChange={(e) => setNewMemberPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[12px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                  placeholder="Min. 6 tekens"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-2">
                  Rol *
                </label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[12px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                >
                  <option value="member">Lid</option>
                  <option value="instructor">Instructeur</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddMember}
                  className="flex-1 px-4 py-2.5 bg-charcoal-900 text-white text-[12px] font-mono uppercase tracking-wide hover:bg-charcoal-800 transition-colors rounded-[5px]"
                >
                  Toevoegen
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 border border-sand-300 text-charcoal-700 text-[12px] font-mono uppercase tracking-wide hover:border-charcoal-900 transition-colors rounded-[5px]"
                >
                  Annuleren
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[5px] border border-sand-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sand-50 border-b border-sand-200">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wide text-charcoal-600">
                  Naam
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wide text-charcoal-600">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wide text-charcoal-600">
                  Rol
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wide text-charcoal-600">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wide text-charcoal-600">
                  Sinds
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-mono uppercase tracking-wide text-charcoal-600">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-sand-50 transition-colors">
                  <td className="px-4 py-3 text-[13px] text-charcoal-900">
                    {member.full_name || 'Naamloos'}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-charcoal-600">{member.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-mono uppercase tracking-wide ${getRoleBadgeColor(
                        member.role
                      )}`}
                    >
                      {member.role === 'admin' && <Shield size={10} />}
                      {member.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-[10px] font-mono uppercase tracking-wide ${getStatusBadgeColor(
                        member.subscription_status
                      )}`}
                    >
                      {member.subscription_status || 'free'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-charcoal-600">
                    {new Date(member.created_at).toLocaleDateString('nl-NL')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleEdit(member)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] text-charcoal-600 hover:text-charcoal-900 transition-colors"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id, member.full_name || member.email)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
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
