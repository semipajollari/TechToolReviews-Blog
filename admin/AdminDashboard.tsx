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
  published: boolean;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const { admin, token, logout, isAuthenticated, isLoading } = useAdminAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [affiliateLink, setAffiliateLink] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
        headers: { Authorization: `Bearer ${token}` },
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

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError('');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;

      try {
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
          setImageUrl(data.imageUrl);
          setSuccess('Image uploaded!');
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError(data.message || 'Failed to upload image');
        }
      } catch (err) {
        setError('Failed to upload image');
      }
      setIsUploading(false);
    };

    reader.onerror = () => {
      setError('Failed to read image file');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!title.trim() || title.length < 5) {
      setError('Title must be at least 5 characters');
      return;
    }
    if (!description.trim() || description.length < 20) {
      setError('Description must be at least 20 characters');
      return;
    }
    if (!imageUrl.trim() || !imageUrl.startsWith('https://')) {
      setError('Please upload an image or enter a valid HTTPS image URL');
      return;
    }
    if (!affiliateLink.trim() || !affiliateLink.startsWith('http')) {
      setError('Please enter a valid affiliate link URL');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin?action=articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          imageUrl: imageUrl.trim(),
          affiliateLink: affiliateLink.trim(),
          published: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Article created successfully! It will appear on the blog.');
        setTitle('');
        setDescription('');
        setImageUrl('');
        setAffiliateLink('');
        fetchArticles();
      } else {
        setError(data.message || 'Failed to create article');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, articleTitle: string) => {
    if (!confirm(`Delete "${articleTitle}"?`)) return;

    try {
      const response = await fetch(`/api/admin?action=articles&id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Article deleted');
        fetchArticles();
      } else {
        setError(data.message || 'Failed to delete');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 text-white p-2 rounded-lg">
                <i className="fas fa-bolt"></i>
              </div>
              <span className="font-bold text-xl text-white">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm hidden sm:block">
                {admin?.username}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center">
            <i className="fas fa-exclamation-circle text-red-400 mr-3"></i>
            <p className="text-red-400 flex-1">{error}</p>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-300">
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center">
            <i className="fas fa-check-circle text-green-400 mr-3"></i>
            <p className="text-green-400 flex-1">{success}</p>
            <button onClick={() => setSuccess('')} className="text-green-400 hover:text-green-300">
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {/* Create Article Form */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Create New Article</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter article title"
                required
              />
            </div>

            {/* Description / Text */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Text / Description <span className="text-red-400">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                placeholder="Enter article content..."
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Image <span className="text-red-400">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://... or upload below"
                />
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
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg disabled:opacity-50"
                >
                  {isUploading ? (
                    <><i className="fas fa-spinner fa-spin mr-2"></i>Uploading...</>
                  ) : (
                    <><i className="fas fa-upload mr-2"></i>Upload</>
                  )}
                </button>
              </div>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="mt-3 h-32 w-auto rounded-lg object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
            </div>

            {/* Affiliate Link */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Affiliate Link <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                value={affiliateLink}
                onChange={(e) => setAffiliateLink(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://..."
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <><i className="fas fa-spinner fa-spin mr-2"></i>Creating...</>
              ) : (
                <><i className="fas fa-plus mr-2"></i>Create Article</>
              )}
            </button>
          </form>
        </div>

        {/* Articles List */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">
              Articles ({articles.length})
            </h2>
          </div>

          {loadingArticles ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            </div>
          ) : articles.length === 0 ? (
            <div className="p-8 text-center">
              <i className="fas fa-newspaper text-4xl text-gray-600 mb-4"></i>
              <p className="text-gray-400">No articles yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {articles.map((article) => (
                <div key={article._id} className="p-4 flex items-center gap-4">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{article.title}</h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`/article/${article.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded"
                    >
                      <i className="fas fa-external-link-alt"></i>
                    </a>
                    <button
                      onClick={() => handleDelete(article._id, article.title)}
                      className="px-3 py-1.5 text-sm bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
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
