
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ARTICLES } from '../constants';

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const article = ARTICLES.find(a => a.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
        <h1 className="text-4xl font-black text-gray-900 dark:text-gray-50 mb-4 tracking-tight">Post Not Found</h1>
        <Link to="/" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-indigo-500/20">Back Home</Link>
      </div>
    );
  }

  // Helper to ensure URL safety for Picsum
  const authorSeed = encodeURIComponent(article.author.replace(/\s+/g, '-'));

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen pt-24 sm:pt-32 pb-20">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-[10px] font-black text-indigo-600 dark:text-indigo-400 mb-8 uppercase tracking-widest">
          <Link to="/" className="hover:underline">Home</Link>
          <i className="fas fa-chevron-right text-[8px] text-gray-400"></i>
          <Link to={`/category/${article.category}`} className="hover:underline">{article.category.replace('-', ' ')}</Link>
        </nav>

        <header className="mb-12">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-gray-900 dark:text-gray-50 mb-10 leading-[0.95] tracking-tightest">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 py-10 border-y border-gray-100 dark:border-gray-900">
            <div className="flex items-center space-x-4">
              <img 
                src={`https://picsum.photos/seed/${authorSeed}/100/100`} 
                alt={article.author} 
                className="w-16 h-16 rounded-2xl border-2 border-indigo-50 dark:border-indigo-900 shadow-sm"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'; }}
              />
              <div>
                <span className="block font-black text-lg text-gray-900 dark:text-gray-50">{article.author}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Technical Editor</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-[10px] font-black text-gray-400 dark:text-gray-500 ml-auto uppercase tracking-widest">
              <i className="far fa-clock"></i>
              <span>{article.date}</span>
              <span className="mx-2">•</span>
              <span>12 min read</span>
            </div>
          </div>
        </header>

        <div className="relative mb-20 group">
          <div className="absolute inset-0 bg-indigo-600 rounded-[2.5rem] rotate-1 scale-105 opacity-5 blur-xl group-hover:rotate-0 transition-transform duration-700"></div>
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full aspect-[16/9] object-cover rounded-[2.5rem] shadow-2xl premium-border relative z-10"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80'; }}
          />
          <div className="absolute -bottom-8 right-8 z-20 bg-indigo-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-black text-sm uppercase tracking-widest hidden sm:block">
            Verified for 2026
          </div>
        </div>

        <div className="prose prose-lg sm:prose-xl prose-indigo dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
          {article.content.split('\n\n').map((para, i) => {
            // Internal Subheading
            if (para.startsWith('### ')) {
              return (
                <h2 key={i} className="text-4xl sm:text-5xl font-black text-gray-950 dark:text-white mt-20 mb-8 tracking-tighter leading-tight">
                  {para.replace('### ', '')}
                </h2>
              );
            }
            // Affiliate / Call to Action Box
            if (para.startsWith('[') && para.includes('Link)')) {
               return (
                <div key={i} className="my-16 p-8 sm:p-14 bg-gray-50 dark:bg-brand-dark border-2 border-indigo-600/20 rounded-[2.5rem] relative overflow-hidden group shadow-2xl">
                   <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] dark:opacity-[0.08] group-hover:scale-110 transition-transform">
                      <i className="fas fa-bolt text-[15rem] text-indigo-600"></i>
                   </div>
                   <span className="inline-block bg-indigo-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">Expert Recommendation</span>
                   <div className="relative z-10" dangerouslySetInnerHTML={{ 
                     __html: para.replace(/\[(.*?)\]\((.*?)\)/g, 
                       '<h4 class="text-3xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">$1</h4><a href="$2" class="inline-flex items-center bg-gray-950 dark:bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Secure the 2026 Launch Price <i class="fas fa-external-link-alt ml-4 text-xs"></i></a>') 
                   }}></div>
                </div>
               );
            }
            // Standard Paragraph
            return (
              <p key={i} className="mb-8 text-xl sm:text-2xl leading-relaxed text-gray-600 dark:text-gray-300 tracking-tight font-medium opacity-90">
                {para}
              </p>
            );
          })}
        </div>

        {/* Comparison Table */}
        {article.comparisonTable && (
          <div className="my-24 overflow-hidden rounded-[3rem] premium-border bg-white dark:bg-brand-dark shadow-2xl border-indigo-100 dark:border-gray-800">
            <div className="bg-gray-50 dark:bg-neutral-900 p-10 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
               <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Performance Matrix</h3>
               <i className="fas fa-layer-group text-indigo-600 text-2xl"></i>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-100/30 dark:bg-neutral-900/30">
                    {article.comparisonTable.headers.map((h, i) => (
                      <th key={i} className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.25em] border-b border-gray-100 dark:border-gray-800">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
                  {article.comparisonTable.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-indigo-50/10 dark:hover:bg-indigo-900/5 transition-colors">
                      {row.map((cell, j) => (
                        <td key={j} className={`px-10 py-8 text-lg ${j === 0 ? 'font-black text-gray-950 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400 font-bold'}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Final Conclusion Disclosure */}
        <footer className="mt-32 pt-16 border-t border-gray-100 dark:border-gray-900">
          <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-10 sm:p-16 rounded-[3rem] text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed border border-indigo-100/50 dark:border-indigo-900/30">
            <div className="flex items-center space-x-4 mb-8">
              <div className="bg-indigo-600 text-white p-3 rounded-xl">
                <i className="fas fa-check-double text-xl"></i>
              </div>
              <span className="font-black text-gray-900 dark:text-gray-200 uppercase tracking-[0.2em] text-xs">Technical Accuracy Disclosure</span>
            </div>
            <p className="italic font-medium">
              TechToolReviews maintain editorial independence. Our "2026 Ready" stamp is awarded based on performance under stress-testing, API stability, and long-term roadmap viability. While we may earn a referral fee from some of the links on this page, our reviews are strictly performance-driven.
            </p>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default ArticlePage;
