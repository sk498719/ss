import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Instructor } from '../../types';

export default function AdminInstructors() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar_url: '',
    specialty: '',
  });

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    const { data } = await supabase
      .from('instructors')
      .select('*')
      .order('name');
    if (data) setInstructors(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      await supabase.from('instructors').update(formData).eq('id', editingId);
    } else {
      await supabase.from('instructors').insert(formData);
    }

    resetForm();
    fetchInstructors();
  };

  const handleEdit = (item: Instructor) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      bio: item.bio,
      avatar_url: item.avatar_url || '',
      specialty: item.specialty,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Weet je zeker dat je deze facilitator wilt verwijderen?')) {
      await supabase.from('instructors').delete().eq('id', id);
      fetchInstructors();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      bio: '',
      avatar_url: '',
      specialty: '',
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
          Facilitators ({instructors.length})
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
          <div className="bg-white rounded-[5px] p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-mono text-lg uppercase tracking-wide text-charcoal-900">
                {editingId ? 'Facilitator Bewerken' : 'Nieuwe Facilitator'}
              </h3>
              <button onClick={resetForm} className="text-charcoal-400 hover:text-charcoal-900">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-2">
                  Naam *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[14px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-2">
                  Bio *
                </label>
                <textarea
                  required
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[14px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-2">
                  Specialiteit
                </label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[14px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                  placeholder="Yoga, Pilates, Meditatie"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-2">
                  Avatar URL
                </label>
                <input
                  type="text"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[14px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                  placeholder="https://..."
                />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {instructors.map((instructor) => (
          <div key={instructor.id} className="bg-white rounded-[5px] border border-sand-200 p-4">
            <div className="flex items-start gap-3 mb-3">
              {instructor.avatar_url && (
                <img
                  src={instructor.avatar_url}
                  alt={instructor.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-mono text-[13px] uppercase tracking-wide text-charcoal-900 mb-1">
                  {instructor.name}
                </h3>
                {instructor.specialty && (
                  <p className="text-[11px] text-charcoal-500">{instructor.specialty}</p>
                )}
              </div>
            </div>
            <p className="text-[13px] text-charcoal-600 mb-4 line-clamp-3">{instructor.bio}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(instructor)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-[11px] font-mono uppercase tracking-wide text-charcoal-600 border border-sand-300 hover:border-charcoal-900 transition-colors rounded-[5px]"
              >
                <Edit size={14} />
                Bewerken
              </button>
              <button
                onClick={() => handleDelete(instructor.id)}
                className="px-3 py-2 text-[11px] text-red-600 border border-red-200 hover:border-red-600 transition-colors rounded-[5px]"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
