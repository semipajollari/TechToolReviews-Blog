
import React, { useState } from 'react';
import { getTechStackRecommendation, Recommendation } from '../services/geminiService';

const TechStackAdvisor: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Recommendation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    const recommendation = await getTechStackRecommendation(query);
    if (!recommendation) {
      setError('Failed to generate stack. Please check that your API key is configured correctly.');
    } else {
      setResult(recommendation);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-indigo-100 dark:border-gray-700 p-8 sm:p-12 shadow-xl relative overflow-hidden">
      <div className="absolute -top-10 -right-10 opacity-5 dark:opacity-10 rotate-12">
        <i className="fas fa-brain text-[15rem] text-indigo-600"></i>
      </div>
      
      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1 rounded-full mb-6 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest">
          <i className="fas fa-sparkles"></i>
          <span>Gemini-Powered Engine</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-[900] text-gray-900 dark:text-white mb-6 tracking-tight">AI Stack Builder</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 leading-relaxed font-medium">
          Describe your business idea in a few words. Our AI will analyze the latest 2026 tech trends and generate a production-ready infrastructure blueprint instantly.
        </p>

        <form onSubmit={handleSubmit} className="relative mb-12">
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., 'A video editing SaaS for TikTok creators'"
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl py-5 px-8 pr-40 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 text-lg transition-all dark:text-white"
          />
          <button 
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-8 rounded-xl font-black hover:bg-indigo-700 disabled:bg-indigo-300 transition-all flex items-center shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            {loading ? (
              <i className="fas fa-circle-notch fa-spin"></i>
            ) : (
              <>
                <span className="hidden sm:inline mr-2">Generate Stack</span>
                <i className="fas fa-bolt"></i>
              </>
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-8 text-red-700 dark:text-red-400">
          <p className="font-semibold flex items-center">
            <i className="fas fa-exclamation-circle mr-3"></i>
            {error}
          </p>
        </div>
      )}

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 grid lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <span className="bg-indigo-600 h-6 w-1 rounded-full"></span>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{result.stackName}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl">
                <span className="text-[10px] uppercase text-indigo-500 font-black block mb-2 tracking-[0.2em]">Frontend</span>
                <span className="font-bold text-gray-900 dark:text-white text-lg">{result.frontend}</span>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl">
                <span className="text-[10px] uppercase text-indigo-500 font-black block mb-2 tracking-[0.2em]">Backend</span>
                <span className="font-bold text-gray-900 dark:text-white text-lg">{result.backend}</span>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl">
                <span className="text-[10px] uppercase text-indigo-500 font-black block mb-2 tracking-[0.2em]">Database</span>
                <span className="font-bold text-gray-900 dark:text-white text-lg">{result.database}</span>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl">
                <span className="text-[10px] uppercase text-indigo-500 font-black block mb-2 tracking-[0.2em]">Hosting</span>
                <span className="font-bold text-gray-900 dark:text-white text-lg">{result.hosting}</span>
              </div>
            </div>
          </div>
          <div className="bg-indigo-600 text-white p-10 rounded-[2rem] shadow-2xl relative">
            <h4 className="font-black text-xl mb-6 flex items-center uppercase tracking-widest">
              <i className="fas fa-quote-left mr-4 text-indigo-300"></i>
              The 2026 Strategy
            </h4>
            <p className="text-indigo-50 text-xl leading-relaxed italic font-medium">
              {result.reasoning}
            </p>
            <div className="absolute bottom-6 right-8 opacity-20 text-6xl">
              <i className="fas fa-brain"></i>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechStackAdvisor;
