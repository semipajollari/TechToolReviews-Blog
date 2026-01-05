
import React, { useState, useRef } from 'react';
import { getTechStackRecommendation, Recommendation } from '../services/geminiService';
import { useLanguage } from '../i18n';

const TechStackAdvisor: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Recommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isSubmitting = useRef(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery || isSubmitting.current) return;
    
    if (trimmedQuery.length < 10) {
      setError(t.techAdvisor.minChars);
      return;
    }
    
    isSubmitting.current = true;
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const recommendation = await getTechStackRecommendation(trimmedQuery);
      if (!recommendation) {
        setError(t.techAdvisor.failedGenerate);
      } else {
        setResult(recommendation);
      }
    } catch (err) {
      setError(t.techAdvisor.unexpectedError);
      console.error('TechStackAdvisor error:', err);
    } finally {
      setLoading(false);
      isSubmitting.current = false;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-indigo-100 dark:border-gray-700 p-6 sm:p-8 shadow-xl relative overflow-hidden h-full">
      <div className="absolute -top-10 -right-10 opacity-5 dark:opacity-10 rotate-12">
        <i className="fas fa-brain text-[15rem] text-indigo-600"></i>
      </div>
      
      <div className="relative z-10 w-full text-center lg:text-left">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1 rounded-full mb-6 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest">
          <i className="fas fa-sparkles"></i>
          <span>{t.techAdvisor.poweredBy}</span>
        </div>
        <h2 className="text-3xl font-[900] text-gray-900 dark:text-white mb-4 tracking-tight">{t.techAdvisor.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed font-medium">
          {t.techAdvisor.description}
        </p>

        <form onSubmit={handleSubmit} className="relative mb-8">
          <div className="relative">
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.techAdvisor.placeholder}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl py-4 px-6 pr-14 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 text-base transition-all dark:text-white"
            />
            <button 
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white w-10 md:w-auto md:px-4 rounded-xl font-black hover:bg-indigo-700 disabled:bg-indigo-300 transition-all flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              {loading ? (
                <i className="fas fa-circle-notch fa-spin"></i>
              ) : (
                <i className="fas fa-bolt"></i>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 ml-2 hidden lg:block">Press Enter to generate</p>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-6 text-red-700 dark:text-red-400 text-sm">
          <p className="font-semibold flex items-center">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </p>
        </div>
      )}

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 flex flex-col gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="bg-indigo-600 h-6 w-1 rounded-full"></span>
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{result.stackName}</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl">
                <span className="text-[10px] uppercase text-indigo-500 font-black block mb-1 tracking-[0.2em]">{t.techAdvisor.frontend}</span>
                <span className="font-bold text-gray-900 dark:text-white text-sm">{result.frontend}</span>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl">
                <span className="text-[10px] uppercase text-indigo-500 font-black block mb-1 tracking-[0.2em]">{t.techAdvisor.backend}</span>
                <span className="font-bold text-gray-900 dark:text-white text-sm">{result.backend}</span>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl">
                <span className="text-[10px] uppercase text-indigo-500 font-black block mb-1 tracking-[0.2em]">{t.techAdvisor.database}</span>
                <span className="font-bold text-gray-900 dark:text-white text-sm">{result.database}</span>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl">
                <span className="text-[10px] uppercase text-indigo-500 font-black block mb-1 tracking-[0.2em]">{t.techAdvisor.hosting}</span>
                <span className="font-bold text-gray-900 dark:text-white text-sm">{result.hosting}</span>
              </div>
            </div>
          </div>
          <div className="bg-indigo-600 text-white p-6 rounded-[1.5rem] shadow-xl relative mt-2">
            <h4 className="font-black text-sm mb-3 flex items-center uppercase tracking-widest text-indigo-200">
              <i className="fas fa-quote-left mr-3"></i>
              {t.techAdvisor.strategy}
            </h4>
            <p className="text-indigo-50 text-sm leading-relaxed italic font-medium">
              {result.reasoning}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechStackAdvisor;
