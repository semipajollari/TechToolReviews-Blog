import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

interface Article {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  affiliateLink: string;
  affiliateName: string;
  merchantLogo: string;
  category: string;
  author: string;
  slug: string;
  published: boolean;
  createdAt: string;
}

const CATEGORIES = [
  { value: 'software', label: 'Software' },
  { value: 'tech-stacks', label: 'Tech Stacks' },
  { value: 'ai-tools', label: 'AI Tools' },
  { value: 'guides', label: 'Guides' },
];

const EDITORS = [
  { value: 'Sarah Chen', label: 'Sarah Chen - Senior Tech Editor' },
  { value: 'Marcus Rodriguez', label: 'Marcus Rodriguez - AI Specialist' },
  { value: 'Emily Watson', label: 'Emily Watson - Software Analyst' },
  { value: 'James Mitchell', label: 'James Mitchell - Dev Tools Expert' },
  { value: 'Priya Sharma', label: 'Priya Sharma - Cloud Architect' },
];

const AdminDashboard: React.FC = () => {
  const { admin, token, logout, isAuthenticated, isLoading } = useAdminAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [articles, setArticles] = useState<Article[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [affiliateLink, setAffiliateLink] = useState('');
  const [merchantLogo, setMerchantLogo] = useState('');
  const [category, setCategory] = useState('software');
  const [author, setAuthor] = useState('Sarah Chen');
  const [affiliateName, setAffiliateName] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  
  // New State for Subscribers & Newsletter
  const [activeTab, setActiveTab] = useState<'articles' | 'subscribers'>('articles');
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [newsletterContent, setNewsletterContent] = useState('');
  const [sendingNewsletter, setSendingNewsletter] = useState(false);
  const [testEmail, setTestEmail] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (token) {
      if (activeTab === 'articles') fetchArticles();
      if (activeTab === 'subscribers') fetchSubscribers();
    }
  }, [token, activeTab]);

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

  const fetchSubscribers = async () => {
    setLoadingSubscribers(true);
    try {
      const response = await fetch('/api/admin?action=subscribers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setSubscribers(data.subscribers || []);
        setStats(data.stats || null);
      }
    } catch (err) {
      setError('Failed to fetch subscribers');
    } finally {
      setLoadingSubscribers(false);
    }
  };

  const verifySubscriber = async (subscriberId: string) => {
    if (!confirm('Manually verify this subscriber?')) return;
    
    try {
      const response = await fetch(`/api/admin?action=verify-subscriber&id=${subscriberId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Subscriber verified!');
        fetchSubscribers(); // Refresh list
      } else {
        setError(data.message || 'Failed to verify subscriber');
      }
    } catch (err) {
      setError('Network error verifying subscriber');
    }
  };

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(testEmail ? 'Send TEST email to yourself?' : 'Send this to ALL verified subscribers? This cannot be undone.')) return;
    
    setSendingNewsletter(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/admin?action=newsletter', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          subject: newsletterSubject,
          content: newsletterContent,
          test: testEmail
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setSuccess(data.message || 'Newsletter sent!');
        if (!testEmail) {
          setNewsletterSubject('');
          setNewsletterContent('');
        }
      } else {
        setError(data.message || 'Failed to send newsletter');
      }
    } catch (err) {
      setError('Network error sending newsletter');
    } finally {
      setSendingNewsletter(false);
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

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setTitle(article.title);
    setDescription(article.description);
    setImageUrl(article.imageUrl);
    setAffiliateLink(article.affiliateLink);
    setAffiliateName(article.affiliateName || '');
    setMerchantLogo(article.merchantLogo || '');
    setCategory(article.category);
    setAuthor(article.author || 'Sarah Chen');
    setError('');
    setSuccess('');
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingArticle(null);
    setTitle('');
    setDescription('');
    setImageUrl('');
    setAffiliateLink('');
    setAffiliateName('');
    setMerchantLogo('');
    setCategory('software');
    setAuthor('Sarah Chen');
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

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
    if (!affiliateName.trim()) {
      setError('Please enter the product/company name for the affiliate');
      return;
    }

    setIsSubmitting(true);

    try {
      const isEditing = !!editingArticle;
      const url = isEditing 
        ? `/api/admin?action=articles&id=${editingArticle._id}`
        : '/api/admin?action=articles';
      
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          imageUrl: imageUrl.trim(),
          affiliateLink: affiliateLink.trim(),
          affiliateName: affiliateName.trim(),
          merchantLogo: merchantLogo.trim(),
          category: category,
          author: author,
          published: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(isEditing ? 'Article updated successfully!' : 'Article created successfully!');
        setTitle('');
        setDescription('');
        setImageUrl('');
        setAffiliateLink('');
        setAffiliateName('');
        setMerchantLogo('');
        setCategory('software');
        setAuthor('Sarah Chen');
        setEditingArticle(null);
        fetchArticles();
      } else {
        setError(data.message || `Failed to ${isEditing ? 'update' : 'create'} article`);
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
        <h1 className="text-white text-2xl font-bold">ADMIN DASHBOARD</h1>
        <div className="ml-4 animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 text-white p-2 rounded-lg">
                <i className="fas fa-shield-alt"></i>
              </div>
              <span className="font-bold text-xl text-white">ADMIN DASHBOARD</span>
            </div>
            
            {/* Navigation Tabs */}
            <div className="hidden sm:flex space-x-4">
              <button 
                onClick={() => setActiveTab('articles')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'articles' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                Articles
              </button>
              <button 
                onClick={() => setActiveTab('subscribers')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'subscribers' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                Subscribers
              </button>
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Tabs */}
        <div className="sm:hidden flex space-x-2 mb-6">
          <button 
            onClick={() => setActiveTab('articles')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-center transition-colors ${
              activeTab === 'articles' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            Articles
          </button>
          <button 
            onClick={() => setActiveTab('subscribers')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-center transition-colors ${
              activeTab === 'subscribers' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            Subscribers
          </button>
        </div>

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

        {/* VIEW: SUBSCRIBERS */}
        {activeTab === 'subscribers' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Stats & List */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Card */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                   <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Total Subscribers</p>
                   <p className="text-3xl font-black text-white">{stats?.total || 0}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                   <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Active</p>
                   <p className="text-3xl font-black text-indigo-400">{stats?.active || 0}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                   <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Pending</p>
                   <p className="text-3xl font-black text-yellow-400">{stats?.pending || 0}</p>
                </div>
              </div>

              {/* List */}
              <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700">
                  <h2 className="text-lg font-semibold text-white">Recent Subscribers</h2>
                </div>
                {loadingSubscribers ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                  </div>
                ) : subscribers.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">No subscribers yet</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-900/50">
                        <tr>
                          <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">Email</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">Status</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">Joined</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {subscribers.map((sub, i) => (
                          <tr key={sub._id || i} className="hover:bg-gray-750">
                            <td className="px-6 py-4 text-sm text-white font-medium">{sub.email}</td>
                            <td className="px-6 py-4 text-sm">
                              {sub.status === 'active' ? (
                                <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs">Active</span>
                              ) : sub.status === 'pending' ? (
                                <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded-full text-xs">Pending</span>
                              ) : (
                                <span className="px-2 py-1 bg-gray-900/30 text-gray-400 rounded-full text-xs">Unsubscribed</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-400">
                              {new Date(sub.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {sub.status === 'pending' && (
                                <button
                                  onClick={() => verifySubscriber(sub._id)}
                                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-lg transition-colors"
                                >
                                  Verify
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Newsletter Composer */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center">
                  <i className="fas fa-paper-plane mr-3 text-indigo-400"></i>
                  Send Newsletter
                </h2>
                
                <form onSubmit={handleSendNewsletter} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                    <input 
                      type="text" 
                      value={newsletterSubject}
                      onChange={e => setNewsletterSubject(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Weekly Tech Update..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">HTML Content</label>
                    <textarea 
                      value={newsletterContent}
                      onChange={e => setNewsletterContent(e.target.value)}
                      rows={8}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="<p>Hello world...</p>"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2">Supports basic HTML tags.</p>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="testMode"
                      checked={testEmail}
                      onChange={e => setTestEmail(e.target.checked)}
                      className="rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="testMode" className="text-sm text-gray-300 select-none">Send test email only (to me)</label>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={sendingNewsletter}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 flex items-center justify-center transition-all"
                  >
                    {sendingNewsletter ? (
                      <i className="fas fa-circle-notch fa-spin"></i>
                    ) : (
                      <>
                        <span>{testEmail ? 'Send Test' : 'Broadcast'}</span>
                        <i className="fas fa-arrow-right ml-2"></i>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: ARTICLES */}
        {activeTab === 'articles' && (
          <>
        {/* Create/Edit Article Form */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {editingArticle ? 'Edit Article' : 'Create New Article'}
            </h2>
            {editingArticle && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                Cancel Edit
              </button>
            )}
          </div>

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

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Text / Description <span className="text-red-400">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={10}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y font-mono text-sm"
                placeholder="Write your article content here...

Use this formatting:
### Heading Title
Creates a bold styled heading with left border

Regular paragraph text goes here. Each paragraph should be separated by a blank line.

Another paragraph with your content..."
                required
              />
              <div className="mt-2 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                <p className="text-xs text-gray-400 font-medium mb-2">📝 Formatting Guide:</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li><code className="bg-gray-600 px-1 rounded">### Your Heading</code> — Creates a bold styled subheading</li>
                  <li>Separate paragraphs with a blank line for proper spacing</li>
                  <li>The affiliate box will be auto-generated from your product name</li>
                </ul>
              </div>
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
                  {isUploading ? 'Uploading...' : 'Upload'}
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

            {/* Affiliate/Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product/Company Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={affiliateName}
                onChange={(e) => setAffiliateName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Notion, Figma, Stripe..."
                required
              />
            </div>

            {/* Merchant Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Merchant Logo URL
              </label>
              <input
                type="url"
                value={merchantLogo}
                onChange={(e) => setMerchantLogo(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://... (optional)"
              />
              {merchantLogo && (
                <img
                  src={merchantLogo}
                  alt="Merchant Logo Preview"
                  className="mt-3 h-12 w-auto rounded object-contain bg-white p-1"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Editor/Author */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Editor <span className="text-red-400">*</span>
              </label>
              <select
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {EDITORS.map((editor) => (
                  <option key={editor.value} value={editor.value}>
                    {editor.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg disabled:opacity-50"
            >
              {isSubmitting 
                ? (editingArticle ? 'Updating...' : 'Creating...') 
                : (editingArticle ? 'Update Article' : 'Create Article')}
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
                    <button
                      onClick={() => handleEdit(article)}
                      className="px-3 py-1.5 text-sm bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded"
                    >
                      Edit
                    </button>
                    <a
                      href={`/article/${article.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(article._id, article.title)}
                      className="px-3 py-1.5 text-sm bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </>
      )}

      </main>
    </div>
  );
};

export default AdminDashboard;
