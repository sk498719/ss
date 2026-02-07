import { useEffect, useState, useRef, useMemo } from 'react';
import { Plus, Edit, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  category: string;
  tags: string[];
  is_featured: boolean;
  published_at: string;
}

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    cover_image_url: '',
    category: 'wellness',
    tags: '',
    is_featured: false,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const quillRef = useRef<any>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false });
    if (data) setArticles(data);
    setLoading(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.cover_image_url;

    setUploadingImage(true);
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('article-images')
      .upload(filePath, imageFile);

    setUploadingImage(false);

    if (uploadError) {
      alert('Fout bij uploaden afbeelding: ' + uploadError.message);
      return formData.cover_image_url;
    }

    const { data } = supabase.storage
      .from('article-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleEditorImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `editor-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(fileName, file);

      if (uploadError) {
        alert('Fout bij uploaden afbeelding: ' + uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from('article-images')
        .getPublicUrl(fileName);

      const quill = quillRef.current?.getEditor();
      if (quill) {
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', data.publicUrl);
        quill.setSelection(range.index + 1);
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: handleEditorImageUpload
      }
    }
  }), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const coverImageUrl = await uploadImage();

    const data = {
      ...formData,
      cover_image_url: coverImageUrl,
      slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    if (editingId) {
      await supabase.from('articles').update(data).eq('id', editingId);
    } else {
      await supabase.from('articles').insert(data);
      await createNotificationsForNewArticle(formData.title);
    }

    resetForm();
    fetchArticles();
  };

  const createNotificationsForNewArticle = async (title: string) => {
    const { data: users } = await supabase.from('profiles').select('id');
    if (users) {
      const notifications = users.map(user => ({
        user_id: user.id,
        type: 'new_article',
        title: 'Nieuw Artikel',
        message: `${title} is nu beschikbaar`,
        link: '/dashboard',
      }));
      await supabase.from('notifications').insert(notifications);
    }
  };

  const handleEdit = (item: Article) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      cover_image_url: item.cover_image_url,
      category: item.category,
      tags: item.tags.join(', '),
      is_featured: item.is_featured,
    });
    setImagePreview(item.cover_image_url);
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Weet je zeker dat je dit artikel wilt verwijderen?')) {
      await supabase.from('articles').delete().eq('id', id);
      fetchArticles();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      cover_image_url: '',
      category: 'wellness',
      tags: '',
      is_featured: false,
    });
    setEditingId(null);
    setShowForm(false);
    setImageFile(null);
    setImagePreview('');
  };

  if (loading) {
    return <div className="text-center py-8 text-charcoal-500">Laden...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-mono text-lg uppercase tracking-wide text-charcoal-900">
          Artikelen ({articles.length})
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
          <div className="bg-white rounded-[5px] p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-mono text-lg uppercase tracking-wide text-charcoal-900">
                {editingId ? 'Artikel Bewerken' : 'Nieuw Artikel'}
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
                  Samenvatting *
                </label>
                <textarea
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[14px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-2">
                  Inhoud *
                </label>
                <div className="border border-sand-200 rounded-[5px]">
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={formData.content}
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    modules={modules}
                    className="bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-2">
                  Cover Afbeelding
                </label>
                <div className="space-y-3">
                  {imagePreview && (
                    <div className="relative w-full h-48 rounded-[5px] overflow-hidden border border-sand-200">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <label className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-center gap-2 px-4 py-2 border border-sand-300 rounded-[5px] text-[12px] font-mono uppercase tracking-wide text-charcoal-700 hover:border-charcoal-900 transition-colors">
                        <Upload size={16} />
                        {imageFile ? imageFile.name : 'Afbeelding Uploaden'}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.cover_image_url}
                    onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                    className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[12px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                    placeholder="Of plak een afbeelding URL..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wide text-charcoal-600 mb-2">
                  Categorie *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-sand-200 rounded-[5px] text-[14px] focus:outline-none focus:ring-2 focus:ring-sage-700/20"
                  placeholder="wellness, mindfulness, nutrition"
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
                  placeholder="meditatie, stress, energie"
                />
              </div>

              <div>
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
                  disabled={uploadingImage}
                  className="flex-1 px-4 py-2.5 bg-charcoal-900 text-white text-[12px] font-mono uppercase tracking-wide hover:bg-charcoal-800 transition-colors rounded-[5px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingImage ? 'Uploaden...' : editingId ? 'Opslaan' : 'Publiceren'}
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
                <th className="px-4 py-3 text-left text-[11px] font-mono uppercase tracking-wide text-charcoal-600">Datum</th>
                <th className="px-4 py-3 text-right text-[11px] font-mono uppercase tracking-wide text-charcoal-600">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-sand-50 transition-colors">
                  <td className="px-4 py-3 text-[13px] text-charcoal-900">{article.title}</td>
                  <td className="px-4 py-3 text-[13px] text-charcoal-600 capitalize">{article.category}</td>
                  <td className="px-4 py-3 text-[13px] text-charcoal-600">
                    {new Date(article.published_at).toLocaleDateString('nl-NL')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleEdit(article)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] text-charcoal-600 hover:text-charcoal-900 transition-colors"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
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
