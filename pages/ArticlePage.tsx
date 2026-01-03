
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ARTICLES } from '../constants';
import { useLanguage } from '../i18n';

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const article = ARTICLES.find(a => a.id === id);
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
        <h1 className="text-4xl font-black text-gray-900 dark:text-gray-50 mb-4 tracking-tight">{t.article.postNotFound}</h1>
        <Link to="/" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-indigo-500/20">{t.article.backHome}</Link>
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
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-gray-50 mb-10 leading-tight tracking-tight">
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
              <span>12 {t.article.minRead}</span>
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
            {t.article.verifiedFor}
          </div>
        </div>

        <div className="prose prose-lg sm:prose-xl prose-indigo dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
          {article.content.split('\n\n').map((para, i) => {
            // Internal Subheading
            if (para.startsWith('### ')) {
              return (
                <h2 key={i} className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-16 mb-6 tracking-tight leading-snug border-l-4 border-indigo-600 pl-6">
                  {para.replace('### ', '')}
                </h2>
              );
            }
            // Affiliate / Call to Action Box
            if (para.startsWith('[') && para.includes('Link)')) {
               // Extract product/company name and URL from the link
               const linkMatch = para.match(/\[(.*?)\]\((.*?)\)/);
               const linkText = linkMatch ? linkMatch[1] : '';
               const linkUrl = linkMatch ? linkMatch[2] : '';
               
               // Try to get domain from URL first, fallback to extracting from link text
               let logoDomain = '';
               if (linkUrl && linkUrl !== '#') {
                 try {
                   const url = new URL(linkUrl);
                   logoDomain = url.hostname.replace('www.', '');
                 } catch {
                   logoDomain = '';
                 }
               }
               
               // If no URL domain, extract product name from link text
               if (!logoDomain) {
                 // Common product names to domain mapping
                 const productMappings: { [key: string]: string } = {
                   'linear': 'linear.app',
                   'tally': 'tally.so',
                   'stripe': 'stripe.com',
                   'notion': 'notion.so',
                   'figma': 'figma.com',
                   'cursor': 'cursor.com',
                   'windsurf': 'codeium.com',
                   'supabase': 'supabase.com',
                   'vercel': 'vercel.com',
                   'github': 'github.com',
                   'vscode': 'code.visualstudio.com',
                   'slack': 'slack.com',
                   'discord': 'discord.com',
                   'trello': 'trello.com',
                   'asana': 'asana.com',
                   'jira': 'atlassian.com',
                   'clickup': 'clickup.com',
                 };
                 
                 const textLower = linkText.toLowerCase();
                 for (const [key, domain] of Object.entries(productMappings)) {
                   if (textLower.includes(key)) {
                     logoDomain = domain;
                     break;
                   }
                 }
               }
               
               // Fallback domain extraction from link text
               if (!logoDomain) {
                 const words = linkText.split(/\s+/);
                 const productWord = words.find(w => w.length > 2 && !['the', 'for', 'and', 'try', 'get', 'view', 'free', 'pro', 'now', 'pricing', 'partner', 'link'].includes(w.toLowerCase()));
                 logoDomain = productWord ? `${productWord.toLowerCase()}.com` : '';
               }

               // Product name for display
               const displayName = linkText.replace(/\s*\(Partner Link\)/i, '').replace(/\s*(Pricing|Free|Pro|Now)/gi, '').trim();
               const productNameOnly = displayName.split(' ')[0];
               
               return (
                <div key={i} className="my-16 relative">
                  {/* Attention-grabbing banner */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-red-500 via-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-lg animate-pulse flex items-center gap-2">
                      <i className="fas fa-fire"></i>
                      <span>{t.article.editorsTopPick}</span>
                      <i className="fas fa-fire"></i>
                    </div>
                  </div>
                  
                  <div className="p-8 sm:p-10 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 border-2 border-indigo-200 dark:border-indigo-800 rounded-3xl relative overflow-hidden shadow-2xl hover:shadow-indigo-200/50 dark:hover:shadow-indigo-900/50 transition-all duration-500 group">
                    
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                    
                    {/* Limited time offer badge */}
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide shadow-lg flex items-center gap-1.5 animate-bounce">
                      <i className="fas fa-clock"></i>
                      <span>{t.article.limitedOffer}</span>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row gap-8 items-center relative z-10">
                      {/* Product Logo/Image - Enhanced */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                          <div className="relative w-28 h-28 md:w-36 md:h-36 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-indigo-100 dark:border-indigo-800 flex items-center justify-center overflow-hidden p-5 group-hover:scale-105 transition-transform duration-300">
                            {logoDomain ? (
                              <img 
                                src={`https://logo.clearbit.com/${logoDomain}`}
                                alt={displayName}
                                className="w-full h-full object-contain"
                                onError={(e) => { 
                                  const img = e.target as HTMLImageElement;
                                  if (!img.src.includes('favicon')) {
                                    img.src = `https://www.google.com/s2/favicons?domain=${logoDomain}&sz=128`;
                                  } else {
                                    img.style.display = 'none';
                                    img.parentElement!.innerHTML = `<div class="text-center"><i class="fas fa-rocket text-4xl text-indigo-600 mb-2"></i><span class="block text-sm font-black text-indigo-600 uppercase">${productNameOnly}</span></div>`;
                                  }
                                }}
                              />
                            ) : (
                              <div className="text-center">
                                <i className="fas fa-rocket text-4xl text-indigo-600 mb-2"></i>
                                <span className="block text-sm font-black text-indigo-600 uppercase">{productNameOnly}</span>
                              </div>
                            )}
                          </div>
                          {/* Verified badge */}
                          <div className="absolute -bottom-2 -right-2 bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                            <i className="fas fa-check text-sm"></i>
                          </div>
                        </div>
                      </div>
                      
                      {/* Content - Enhanced */}
                      <div className="flex-1 text-center lg:text-left">
                        {/* Badges row */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4">
                          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                            <i className="fas fa-crown"></i>
                            <span>{t.article.staffPick}</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 bg-green-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <i className="fas fa-percentage"></i>
                            <span>{t.article.specialDeal}</span>
                          </span>
                        </div>
                        
                        {/* Product name */}
                        <h4 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
                          {displayName.replace(/\s*(Pricing|Free|Pro|Now|View|Try|Get|Explore)/gi, '').trim() || productNameOnly}
                        </h4>
                        
                        {/* Rating */}
                        <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                          <div className="flex text-yellow-400">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                          </div>
                          <span className="text-sm font-bold text-gray-600 dark:text-gray-400">4.9/5</span>
                          <span className="text-xs text-gray-500 dark:text-gray-500">(2,847 {t.article.reviews})</span>
                        </div>
                        
                        {/* Benefits */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                            <i className="fas fa-check-circle text-green-500"></i>
                            <span>{t.article.freeTrial}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                            <i className="fas fa-check-circle text-green-500"></i>
                            <span>{t.article.noCreditCard}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                            <i className="fas fa-check-circle text-green-500"></i>
                            <span>{t.article.cancelAnytime}</span>
                          </div>
                        </div>
                        
                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                          <a 
                            href={linkUrl || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="group/btn inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_100%] hover:bg-[position:100%_0] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wide hover:scale-105 transition-all duration-300 shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50"
                          >
                            <i className="fas fa-bolt mr-2 group-hover/btn:animate-pulse"></i>
                            {t.article.claimFreeTrial}
                            <i className="fas fa-arrow-right ml-3 group-hover/btn:translate-x-1 transition-transform"></i>
                          </a>
                          <a 
                            href={linkUrl || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center justify-center bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 px-6 py-4 rounded-2xl font-bold text-sm hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                          >
                            <i className="fas fa-play-circle mr-2"></i>
                            {t.article.watchDemo}
                          </a>
                        </div>
                        
                        {/* Social proof */}
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-center lg:justify-start gap-4">
                            <div className="flex -space-x-2">
                              <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold">JD</div>
                              <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold">MK</div>
                              <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold">AS</div>
                              <div className="w-8 h-8 rounded-full bg-gray-800 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold">+5k</div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-bold text-gray-700 dark:text-gray-300">5,000+ {t.article.professionalsStarted}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom urgency bar */}
                    <div className="mt-8 pt-6 border-t border-indigo-100 dark:border-indigo-900/50">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                          </span>
                          <span className="text-green-600 dark:text-green-400 font-bold">247 {t.article.peopleViewing}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <i className="fas fa-shield-alt text-indigo-500"></i>
                          <span>{t.article.moneyBackGuarantee}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
               );
            }
            // Standard Paragraph
            return (
              <p key={i} className="mb-6 text-lg sm:text-xl leading-loose text-gray-600 dark:text-gray-400 tracking-normal font-normal">
                {para}
              </p>
            );
          })}
        </div>

        {/* Comparison Table */}
        {article.comparisonTable && (
          <div className="my-24 overflow-hidden rounded-[3rem] premium-border bg-white dark:bg-brand-dark shadow-2xl border-indigo-100 dark:border-gray-800">
            <div className="bg-gray-50 dark:bg-neutral-900 p-10 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
               <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">{t.article.performanceMatrix}</h3>
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
