import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Content } from '../../types';

interface Collection {
  id: string;
  title: string;
  description: string;
  order_index: number;
}

export default function AdminCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order_index: 0,
  });
  const [selectedContent, setSelectedContent] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [collectionsRes, contentRes] = await Promise.all([
      supabase.from('collections').select('*').order('order_index'),
      supabase.from('content').select('*').order('title'),
    ]);
    if (collectionsRes.data) setCollections(collectionsRes.data);
    if (contentRes.data) setContent(contentRes.data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let collectionId = editingId;

    if (editingId) {
      await supabase.from('collections').update(formData).eq('id', editingId);
    } else {
      const { data } = await supabase.from('collections').insert(formData).select().single();
      collectionId = data?.id;
    }

    if (collectionId && selectedContent.length > 0) {
      await supabase.from('collection_items').delete().eq('collection_id', collectionId);

      const items = selectedContent.map((contentId, index) => ({
        collection_id: collectionId,
        content_id: contentId,
        order_index: index,
      }));
      await supabase.from('collection_items').insert(items);
    }

    resetForm();
    fetchData();
  };

  const handleEdit = async (item: Collection) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description,
      order_index: item.order_index,
    });

    const { data } = await supabase
      .from('collection_items')
      .select('content_id')
      .eq('collection_id', item.id)
      .order('order_index');

    if (data) {
      setSelectedContent(data.map(i => i.content_id));
    }
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Weet je zeker dat je deze collectie wilt verwijderen?')) {
      await supabase.from('collections').delete().eq('id', id);
      fetchData();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      order_index: 0,
    });
    setSelectedContent([]);
    setEditingId(null);
    setShowForm(false);
  };

  const toggleContent = (contentId: string) => {
    setSelectedContent(prev =>
      prev.includes(contentId)
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  if (loading) {
    return <div className="text-center py-8 text-charcoal-500">Laden...</div>;
  }

  return (
    <div>
      <div className="flex justify-end items-center mb-6">
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
          <div className="bg-white rounded-[5px] p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-mono text-lg uppercase tracking-wide text-charcoal-900">
                {editingId ? 'Collectie Bewerken' : 'Nieuwe Collectie'}
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
                  Beschrijving
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[14px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-2">
                  Volgorde
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[14px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-3">
                  Content Selecteren ({selectedContent.length} geselecteerd)
                </label>
                <div className="max-h-64 overflow-y-auto border border-sand-200 rounded-[5px] divide-y divide-sand-100">
                  {content.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 p-3 hover:bg-sand-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedContent.includes(item.id)}
                        onChange={() => toggleContent(item.id)}
                        className="rounded"
                      />
                      <span className="text-[13px] text-charcoal-700">{item.title}</span>
                      <span className="text-[11px] text-charcoal-400 ml-auto capitalize">{item.category}</span>
                    </label>
                  ))}
                </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collections.map((collection) => (
          <div key={collection.id} className="bg-white rounded-[5px] border border-sand-200 p-4">
            <h3 className="font-mono text-[13px] uppercase tracking-wide text-charcoal-900 mb-2">
              {collection.title}
            </h3>
            {collection.description && (
              <p className="text-[13px] text-charcoal-600 mb-4">{collection.description}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(collection)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-[11px] font-mono uppercase tracking-wide text-charcoal-600 border border-sand-300 hover:border-charcoal-900 transition-colors rounded-[5px]"
              >
                <Edit size={14} />
                Bewerken
              </button>
              <button
                onClick={() => handleDelete(collection.id)}
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
