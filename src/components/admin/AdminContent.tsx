import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Content, Instructor } from '../../types';

export default function AdminContent() {
  const [content, setContent] = useState<Content[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'yoga' as 'yoga' | 'pilates' | 'meditation' | 'online_sessie',
    thumbnail_url: '',
    media_url: '',
    duration_minutes: 30,
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    instructor_id: '',
    is_premium: false,
    is_featured: false,
    tags: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [contentRes, instructorsRes] = await Promise.all([
      supabase.from('content').select('*, instructor:instructors(*)').order('created_at', { ascending: false }),
      supabase.from('instructors').select('*').order('name'),
    ]);
    if (contentRes.data) setContent(contentRes.data);
    if (instructorsRes.data) setInstructors(instructorsRes.data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    if (editingId) {
      await supabase.from('content').update(data).eq('id', editingId);
    } else {
      await supabase.from('content').insert(data);
      await createNotificationsForNewContent(formData.title, data.category);
    }

    resetForm();
    fetchData();
  };

  const createNotificationsForNewContent = async (title: string, category: string) => {
    const { data: users } = await supabase.from('profiles').select('id');
    if (users) {
      const notifications = users.map(user => ({
        user_id: user.id,
        type: 'new_content',
        title: 'Nieuwe Content',
        message: `${title} is nu beschikbaar in ${category}`,
        link: '/library',
      }));
      await supabase.from('notifications').insert(notifications);
    }
  };

  const handleEdit = (item: Content) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      thumbnail_url: item.thumbnail_url || '',
      media_url: item.media_url || '',
      duration_minutes: item.duration_minutes,
      difficulty: item.difficulty,
      instructor_id: item.instructor_id || '',
      is_premium: item.is_premium,
      is_featured: item.is_featured,
      tags: item.tags.join(', '),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Weet je zeker dat je deze content wilt verwijderen?')) {
      await supabase.from('content').delete().eq('id', id);
      fetchData();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'yoga',
      thumbnail_url: '',
      media_url: '',
      duration_minutes: 30,
      difficulty: 'beginner',
      instructor_id: '',
      is_premium: false,
      is_featured: false,
      tags: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="text-center py-8 text-charcoal-500">Laden...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-mono text-lg uppercase tracking-wide text-charcoal-900">
          Content ({content.length})
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-charcoal-900 text-white text-[12px] font-mono uppercase tracking-wide hover:bg-charcoal-800 transition-colors rounded-[5px]"
        >
          <Plus size={16} />
          Toevoegen
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-charcoal-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[5px] p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-mono text-lg uppercase tracking-wide text-charcoal-900">
                {editingId ? 'Content Bewerken' : 'Nieuwe Content'}
              </h3>
              <button onClick={resetForm} className="text-charcoal-400 hover:text-charcoal-900">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-2">
                  Titel *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[14px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-2">
                  Beschrijving *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[14px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-2">
                    Categorie *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[14px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                  >
                    <option value="yoga">Yoga</option>
                    <option value="pilates">Pilates</option>
                    <option value="meditation">Meditatie</option>
                    <option value="online_sessie">Online Sessies</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-2">
                    Niveau *
                  </label>
                  <select
                    required
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[14px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Gemiddeld</option>
                    <option value="advanced">Gevorderd</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-2">
                    Duur (minuten) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[14px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-2">
                    Facilitator
                  </label>
                  <select
                    value={formData.instructor_id}
                    onChange={(e) => setFormData({ ...formData, instructor_id: e.target.value })}
                    className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[14px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                  >
                    <option value="">Geen</option>
                    {instructors.map((inst) => (
                      <option key={inst.id} value={inst.id}>{inst.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-2">
                  Thumbnail URL
                </label>
                <input
                  type="text"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[14px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-2">
                  Media URL (Video/Audio)
                </label>
                <input
                  type="text"
                  value={formData.media_url}
                  onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                  className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[14px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-2">
                  Tags (komma gescheiden)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[14px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                  placeholder="rust, energie, focus"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-[13px] text-charcoal-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_premium}
                    onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
                    className="rounded"
                  />
                  Premium Content
                </label>

                <label className="flex items-center gap-2 text-[13px] text-charcoal-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded"
                  />
                  Uitgelicht
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-charcoal-900 text-white text-[12px] font-mono uppercase tracking-wide hover:bg-charcoal-800 transition-colors rounded-[5px]"
                >
                  {editingId ? 'Opslaan' : 'Toevoegen'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 border border-sand-300 text-charcoal-700 text-[12px] font-mono uppercase tracking-wide hover:border-charcoal-900 transition-colors rounded-[5px]"
                >
                  Annuleren
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[5px] border border-sand-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sand-50 border-b border-sand-200">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wide text-charcoal-600">Titel</th>
                <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wide text-charcoal-600">Categorie</th>
                <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wide text-charcoal-600">Facilitator</th>
                <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wide text-charcoal-600">Duur</th>
                <th className="px-4 py-3 text-right text-[11px] font-mono uppercase tracking-wide text-charcoal-600">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {content.map((item) => (
                <tr key={item.id} className="hover:bg-sand-50 transition-colors">
                  <td className="px-4 py-3 text-[13px] text-charcoal-900">{item.title}</td>
                  <td className="px-4 py-3 text-[13px] text-charcoal-600 capitalize">{item.category}</td>
                  <td className="px-4 py-3 text-[13px] text-charcoal-600">{item.instructor?.name || '-'}</td>
                  <td className="px-4 py-3 text-[13px] text-charcoal-600">{item.duration_minutes} min</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleEdit(item)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] text-charcoal-600 hover:text-charcoal-900 transition-colors"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
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
