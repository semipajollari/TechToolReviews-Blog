
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS, BRAND_NAME } from '../constants';
import { useLanguage } from '../i18n';
import LanguageSwitcher from './LanguageSwitcher';
import { API_ENDPOINTS, fetchWithTimeout, safeParseJson } from '../config/api';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isSubmitting = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || isSubmitting.current) return;
    
    // Basic client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Invalid email format');
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
        setShowModal(false);
        setEmail('');
        navigate('/insider-list', { 
          state: { email: trimmedEmail, message: 'Subscription successful!' } 
        });
      } else {
        setError(data.message || 'Subscription failed. Please try again.');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(t.subscribe.connectionError || 'Connection error. Please try again.');
      }
    } finally {
      setLoading(false);
      isSubmitting.current = false;
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    
    // Check initial theme
    if (document.documentElement.classList.contains('dark')) {
      setDarkMode(true);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [showModal]);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setDarkMode(true);
    }
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isOpen ? 'glass border-b border-gray-200 dark:border-gray-800' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-indigo-600 text-white p-2 rounded-lg group-hover:rotate-12 transition-transform">
              <i className="fas fa-bolt text-lg"></i>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">
              {BRAND_NAME}<span className="text-indigo-600">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-bold transition-colors hover:text-indigo-600 ${location.pathname === item.path ? 'text-indigo-600 underline decoration-2 underline-offset-8' : 'text-gray-600 dark:text-gray-300'}`}
              >
                {t.nav[item.labelKey]}
              </Link>
            ))}
            
            <LanguageSwitcher />
            
            <button 
              onClick={toggleDarkMode}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              aria-label="Toggle Theme"
            >
              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>

            <button 
              onClick={() => setShowModal(true)}
              className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-all shadow-sm"
            >
              {t.nav.subscribe}
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center space-x-3">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300"
            >
              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} text-xl`}></i>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen opacity-100 py-6 border-t border-gray-100 dark:border-gray-800' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 space-y-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-4 p-4 rounded-2xl text-lg font-bold transition-colors ${location.pathname === item.path ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <i className={`fas ${item.icon} w-6`}></i>
              <span>{t.nav[item.labelKey]}</span>
            </Link>
          ))}
          <div className="pt-4 space-y-3">
            <LanguageSwitcher />
            <button 
              onClick={() => setShowModal(true)}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              {t.nav.subscribeNow}
            </button>
          </div>
        </div>
      </div>

      {/* Subscribe Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-fade-in">
            {/* Close Button - Top Right */}
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-all"
              aria-label="Close modal"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
            
            <div className="mb-6 pr-8">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">{t.subscribe.joinInsiderList}</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t.subscribe.weeklyInsights}</p>
            <form onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder={t.home.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl mb-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <button 
                type="submit"
                disabled={loading || !email}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {loading ? t.subscribe.subscribing : t.nav.subscribe}
              </button>
            </form>
            
            {/* Close Button - Bottom */}
            <button 
              onClick={() => setShowModal(false)}
              className="w-full mt-4 py-3 text-gray-500 dark:text-gray-400 font-medium hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              {t.subscribe.close}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
