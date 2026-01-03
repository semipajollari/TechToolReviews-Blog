
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ARTICLES, CATEGORIES, BRAND_NAME } from '../constants';
import ArticleCard from '../components/ArticleCard';
import TechStackAdvisor from '../components/TechStackAdvisor';
import { useLanguage } from '../i18n';
import { API_ENDPOINTS, fetchWithTimeout, safeParseJson } from '../config/api';

const Home: React.FC = () => {
  const latestArticles = ARTICLES.slice(0, 6);
  const featuredArticle = ARTICLES[0];
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isSubmitting = useRef(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || isSubmitting.current) return;
    
    // Basic client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError(t.subscribe?.invalidEmail || 'Invalid email format');
      return;
    }
    
    isSubmitting.current = true;
    setLoading(true);
    setError('');

    try {
      const response = await fetchWithTimeout(API_ENDPOINTS.subscribe, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      }, 15000);

      const data = await safeParseJson(response);

      if (data.success) {
        navigate('/insider-list', { 
          state: { email: trimmedEmail, message: 'Subscription successful! Welcome to the Insider List.' } 
        });
        setEmail('');
      } else {
        setError(data.message || 'Subscription failed. Please try again.');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(t.subscribe?.connectionError || 'Connection error. Please try again.');
      }
    } finally {
      setLoading(false);
      isSubmitting.current = false;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950 transition-colors">
      {/* Immersive Hero */}
      <section className="relative min-h-[95vh] flex items-center pt-24 overflow-hidden hero-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 w-full">
          <div className="text-center md:text-left max-w-5xl">
            <div className="inline-flex items-center space-x-3 bg-indigo-600/20 backdrop-blur-xl border border-indigo-400/30 px-5 py-2.5 rounded-full mb-10">
              <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-400 animate-ping"></span>
              <span className="text-xs sm:text-sm font-black text-indigo-100 uppercase tracking-[0.25em]">2026 Tech Intelligence</span>
            </div>
            
            <h1 className="text-6xl sm:text-8xl lg:text-[9rem] font-black text-white tracking-tightest leading-[0.85] mb-10 drop-shadow-2xl">
              Better tools.<br/>
              <span className="text-indigo-400">Bigger results.</span>
            </h1>
            
            <p className="text-xl sm:text-3xl text-gray-200 leading-relaxed mb-16 max-w-3xl font-medium drop-shadow-xl">
              Unbiased, technical deep-dives into the software and tech stacks driving high-performance digital businesses.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center space-y-5 sm:space-y-0 sm:space-x-8">
              <Link to="/category/software" className="w-full sm:w-auto bg-white text-gray-950 px-12 py-6 rounded-2xl text-xl font-black hover:bg-gray-100 transition-all shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95">
                {t.home.viewAll}
                <i className="fas fa-chevron-right ml-4 text-sm"></i>
              </Link>
              <Link to="/about" className="w-full sm:w-auto bg-transparent border-2 border-white/20 backdrop-blur-md text-white px-12 py-6 rounded-2xl text-xl font-black hover:bg-white/10 transition-all flex items-center justify-center">
                {t.common.learnMore}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Quick Nav Ticker */}
        <div className="absolute bottom-12 left-0 w-full overflow-hidden hidden lg:block">
           <div className="flex space-x-8 px-10 animate-marquee whitespace-nowrap">
              {CATEGORIES.map(cat => (
                <Link key={cat.id} to={`/category/${cat.slug}`} className="text-white/40 hover:text-white transition-colors text-sm font-black uppercase tracking-[0.3em]">
                   {cat.name} // 2026 Edition
                </Link>
              ))}
           </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-6 md:space-y-0">
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-gray-50 mb-4 tracking-tightest uppercase">{t.home.featuredArticles}</h2>
            <div className="h-2 w-32 bg-indigo-600 mb-6 rounded-full"></div>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-xl leading-relaxed">{t.home.latestReviews}</p>
          </div>
          <Link to="/category/guides" className="inline-flex items-center px-8 py-4 bg-gray-50 dark:bg-brand-dark border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
            {t.home.viewAll} <i className="fas fa-arrow-right ml-3"></i>
          </Link>
        </div>
        <ArticleCard article={featuredArticle} featured />
      </section>

      {/* Dynamic Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-gray-100 dark:border-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16">
          {latestArticles.slice(1).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* AI Tool & Footer Prep */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <TechStackAdvisor />
      </section>

      {/* Brand Value CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="bg-gray-950 dark:bg-indigo-950/20 rounded-[3rem] p-12 sm:p-24 text-white relative overflow-hidden shadow-2xl premium-border">
          <div className="md:w-2/3 relative z-10">
            <h2 className="text-5xl sm:text-7xl font-black mb-10 leading-[1.05] tracking-tightest">{t.home.joinNewsletter}</h2>
            <p className="text-xl sm:text-2xl text-indigo-100/70 mb-12 max-w-xl font-medium leading-relaxed">
              {t.home.newsletterDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
               <input 
                 type="email" 
                 placeholder={t.home.emailPlaceholder}
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 disabled={loading}
                 className="bg-white/10 border border-white/20 px-8 py-5 rounded-2xl text-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/50 w-full sm:max-w-md font-bold disabled:opacity-50" 
               />
               <button 
                 onClick={handleSubscribe}
                 disabled={loading || !email}
                 className="bg-white text-gray-950 px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {loading ? t.subscribe.subscribing : t.home.subscribeBtn}
               </button>
            </div>
            {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
          </div>
          <div className="absolute right-[-10%] bottom-[-10%] opacity-5 rotate-12 pointer-events-none">
             <i className="fas fa-bolt text-[40rem]"></i>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
