
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import ArticleCard from '../components/ArticleCard';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = CATEGORIES.find(c => c.slug === slug);

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
        <h1 className="text-4xl font-black text-gray-900 dark:text-gray-50 mb-4 uppercase tracking-tighter">Category Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 font-bold">The requested architectural sector does not exist.</p>
        <Link to="/" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all">Return to Mission Control</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 space-y-16 bg-gray-50 dark:bg-gray-950 transition-colors">
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-900 p-8 sm:p-20 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 dark:opacity-10">
             <i className={`fas ${category.icon} text-[18rem] text-indigo-600`}></i>
          </div>
          <nav className="flex items-center space-x-3 text-[10px] font-black text-indigo-600 dark:text-indigo-400 mb-10 uppercase tracking-[0.3em]">
            <Link to="/" className="hover:underline">Home</Link>
            <i className="fas fa-chevron-right text-[8px] text-gray-400"></i>
            <span className="text-gray-400 dark:text-gray-600">Database</span>
            <i className="fas fa-chevron-right text-[8px] text-gray-400"></i>
            <span className="text-gray-900 dark:text-gray-200">Sector {category.id.slice(0,3)}</span>
          </nav>
          <h1 className="text-5xl sm:text-8xl font-black text-gray-900 dark:text-gray-50 mb-10 tracking-tightest leading-[0.85]">{category.name}</h1>
          <p className="text-2xl text-gray-500 dark:text-gray-400 max-w-3xl leading-relaxed font-bold">
            {category.description}
          </p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center space-x-4">
             <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></div>
             <h2 className="text-xl font-black text-gray-950 dark:text-gray-50 uppercase tracking-tight">Active Benchmarks</h2>
          </div>
          <span className="bg-gray-950 dark:bg-indigo-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
            {category.articles.length} REVIEWS VERIFIED
          </span>
        </div>
        
        {category.articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16">
            {category.articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-16 sm:p-32 text-center border border-gray-100 dark:border-gray-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-inner relative z-10">
              <i className="fas fa-microscope text-4xl animate-bounce"></i>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-gray-50 mb-6 tracking-tighter relative z-10">Editorial Deep Dives Pending</h3>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-bold leading-relaxed relative z-10">
              Our engineering team is currently stress-testing tools in this sector. 2026 reports are scheduled for release next quarter.
            </p>
            <div className="mt-12 relative z-10">
               <button className="bg-gray-950 dark:bg-white dark:text-gray-950 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                 Get Notified of Release
               </button>
            </div>
          </div>
        )}
      </section>

      {/* Internal Linking */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="bg-gray-950 dark:bg-brand-dark rounded-[4rem] p-12 sm:p-24 text-white border border-gray-800 shadow-3xl relative overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] opacity-10 pointer-events-none">
             <i className="fas fa-layer-group text-[30rem]"></i>
          </div>
          <h3 className="text-3xl sm:text-5xl font-black mb-16 uppercase tracking-tightest relative z-10">Alternative Sectors</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
            {CATEGORIES.filter(c => c.id !== category.id).map(other => (
              <Link 
                key={other.id} 
                to={`/category/${other.slug}`}
                className="group bg-white/5 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10 hover:border-indigo-500 hover:bg-white/10 transition-all duration-500"
              >
                <div className="w-16 h-16 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                  <i className={`fas ${other.icon} text-2xl`}></i>
                </div>
                <span className="font-black block text-xl group-hover:text-indigo-400 transition-colors uppercase tracking-tight mb-2">{other.name}</span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Explore Database <i className="fas fa-arrow-right ml-2 text-[10px] group-hover:translate-x-2 transition-transform"></i></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
