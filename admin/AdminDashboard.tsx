import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

interface Article {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  affiliateLink: string;
  slug: string;
  category: string;
  author: string;
  published: boolean;
  createdAt: string;
}

interface FormData {
  title: string;
  description: string;
  imageUrl: string;
  affiliateLink: string;
  category: string;
  author: string;
  published: boolean;
}

const CATEGORIES = [
  { value: 'software', label: 'Software Reviews' },
  { value: 'tech-stacks', label: 'Tech Stacks' },
  { value: 'ai-tools', label: 'AI Tools' },
  { value: 'guides', label: 'Guides & Tutorials' },
];

const initialFormData: FormData = {
  title: '',
  description: '',
  imageUrl: '',
  affiliateLink: '',
  category: 'software',
  author: 'TechToolReviews Team',
  published: false,
};

const AdminDashboard: React.FC = () => {
  const { admin, token, logout, isAuthenticated, isLoading } = useAdminAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [articles, setArticles] = useState<Article[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loadingArticles, setLoadingArticles] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Fetch articles on mount
  useEffect(() => {
    if (token) {
      fetchArticles();
    }
  }, [token]);

  const fetchArticles = async () => {
    setLoadingArticles(true);
    try {
      const response = await fetch('/api/admin?action=articles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setArticles(data.articles);
      }
    } catch (err) {
      console.error('Failed to fetch articles:', err);
    } finally {
      setLoadingArticles(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;

        const response = await fetch('/api/admin?action=upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ image: base64 }),
        });

        const data = await response.json();

        if (data.success && data.imageUrl) {
          setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl }));
          setSuccess('Image uploaded successfully!');
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError(data.message || 'Failed to upload image');
        }
        setIsUploading(false);
      };

      reader.onerror = () => {
        setError('Failed to read image file');
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to upload image');
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    // Validate
    if (!formData.title.trim() || formData.title.length < 5) {
      setError('Title must be at least 5 characters');
      setIsSubmitting(false);
      return;
    }
    if (!formData.description.trim() || formData.description.length < 20) {
      setError('Description must be at least 20 characters');
      setIsSubmitting(false);
      return;
    }
    if (!formData.imageUrl.trim() || !formData.imageUrl.startsWith('https://')) {
      setError('Please upload an image or enter a valid HTTPS image URL');
      setIsSubmitting(false);
      return;
    }
    if (!formData.affiliateLink.trim() || !formData.affiliateLink.startsWith('http')) {
      setError('Please enter a valid affiliate link URL');
      setIsSubmitting(false);
      return;
    }

    try {
      const url = editingId
        ? `/api/admin?action=articles&id=${editingId}`
        : '/api/admin?action=articles';

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(editingId ? 'Article updated successfully!' : 'Article created successfully!');
        setFormData(initialFormData);
        setEditingId(null);
        setShowForm(false);
        fetchArticles();
      } else {
        setError(data.message || data.errors?.join(', ') || 'Failed to save article');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title,
      description: article.description,
      imageUrl: article.imageUrl,
      affiliateLink: article.affiliateLink,
      category: article.category,
      author: article.author,
      published: article.published,
    });
    setEditingId(article._id);
    setShowForm(true);
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const response = await fetch(`/api/admin?action=articles&id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Article deleted successfully!');
        fetchArticles();
      } else {
        setError(data.message || 'Failed to delete article');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const handleTogglePublish = async (article: Article) => {
    try {
      const response = await fetch(`/api/admin?action=articles&id=${article._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ published: !article.published }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(
          article.published
            ? 'Article unpublished'
            : 'Article published! Newsletter sent to subscribers.'
        );
        fetchArticles();
      } else {
        setError(data.message || 'Failed to update article');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const cancelEdit = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 text-white p-2 rounded-lg">
                <i className="fas fa-bolt"></i>
              </div>
              <span className="font-bold text-xl text-white">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm hidden sm:block">
                Welcome, <span className="text-white font-medium">{admin?.username}</span>
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center">
            <i className="fas fa-exclamation-circle text-red-400 mr-3"></i>
            <p className="text-red-400">{error}</p>
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-300">
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center">
            <i className="fas fa-check-circle text-green-400 mr-3"></i>
            <p className="text-green-400">{success}</p>
            <button onClick={() => setSuccess('')} className="ml-auto text-green-400 hover:text-green-300">
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Articles</h1>
            <p className="text-gray-400">Manage your blog articles</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-indigo-600/30 transition-all"
            >
              <i className="fas fa-plus mr-2"></i>
              New Article
            </button>
          )}
        </div>

        {/* Article Form */}
        {showForm && (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Edit Article' : 'Create New Article'}
              </h2>
              <button
                onClick={cancelEdit}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter article title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                  placeholder="Enter article description (supports markdown)"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://... or upload below"
                    />
                  </div>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors disabled:opacity-50 w-full sm:w-auto"
                    >
                      {isUploading ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-upload mr-2"></i>
                          Upload
                        </>
                      )}
                    </button>
                  </div>
                </div>
                {formData.imageUrl && (
                  <div className="mt-3">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="h-32 w-auto rounded-lg object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Affiliate Link */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Affiliate Link <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  value={formData.affiliateLink}
                  onChange={(e) => setFormData((prev) => ({ ...prev, affiliateLink: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://..."
                  required
                />
              </div>

              {/* Category & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Author name"
                  />
                </div>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, published: !prev.published }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.published ? 'bg-indigo-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.published ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-gray-300">
                  {formData.published ? 'Published (will send newsletter)' : 'Draft'}
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Saving...
                    </>
                  ) : editingId ? (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      Update Article
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus mr-2"></i>
                      Create Article
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Articles List */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">
              All Articles ({articles.length})
            </h2>
          </div>

          {loadingArticles ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            </div>
          ) : articles.length === 0 ? (
            <div className="p-8 text-center">
              <i className="fas fa-newspaper text-4xl text-gray-600 mb-4"></i>
              <p className="text-gray-400">No articles yet. Create your first article!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {articles.map((article) => (
                <div
                  key={article._id}
                  className="p-4 sm:p-6 hover:bg-gray-750 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Thumbnail */}
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full sm:w-32 h-24 object-cover rounded-lg flex-shrink-0"
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white truncate">
                            {article.title}
                          </h3>
                          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                            {article.description}
                          </p>
                        </div>
                        <span
                          className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
                            article.published
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {article.published ? 'Published' : 'Draft'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded">
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-500">• {article.author}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        <button
                          onClick={() => handleEdit(article)}
                          className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                        >
                          <i className="fas fa-edit mr-1"></i>
                          Edit
                        </button>
                        <button
                          onClick={() => handleTogglePublish(article)}
                          className={`px-3 py-1.5 text-sm rounded transition-colors ${
                            article.published
                              ? 'bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400'
                              : 'bg-green-600/20 hover:bg-green-600/30 text-green-400'
                          }`}
                        >
                          <i className={`fas ${article.published ? 'fa-eye-slash' : 'fa-eye'} mr-1`}></i>
                          {article.published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleDelete(article._id, article.title)}
                          className="px-3 py-1.5 text-sm bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded transition-colors"
                        >
                          <i className="fas fa-trash mr-1"></i>
                          Delete
                        </button>
                        <a
                          href={`/article/${article.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                        >
                          <i className="fas fa-external-link-alt mr-1"></i>
                          View
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
