
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';

interface Props {
  article: Article;
  featured?: boolean;
}

const ArticleCard: React.FC<Props> = ({ article, featured }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80';
  };

  return (
    <Link 
      to={`/article/${article.id}`}
      className={`group block bg-white dark:bg-brand-dark rounded-3xl overflow-hidden premium-border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${featured ? 'md:flex md:items-stretch' : ''}`}
    >
      <div className={`relative overflow-hidden bg-gray-100 dark:bg-gray-900 ${featured ? 'md:w-1/2 min-h-[300px]' : 'aspect-[16/10]'}`}>
        {/* Shimmer Placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 animate-pulse"></div>
        )}
        <img 
          src={article.image} 
          alt={article.title} 
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
        />
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-indigo-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
            {article.category.replace('-', ' ')}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
      
      <div className={`p-8 sm:p-12 flex flex-col justify-center ${featured ? 'md:w-1/2' : ''}`}>
        <div className="flex items-center text-[10px] font-black text-gray-400 dark:text-gray-500 mb-6 uppercase tracking-[0.3em]">
          <span>{article.date}</span>
          <span className="mx-3 w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
          <span>{article.author}</span>
        </div>
        
        <h3 className={`font-black text-gray-900 dark:text-gray-50 tracking-tightest transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400 ${featured ? 'text-4xl sm:text-6xl lg:text-7xl leading-[0.9]' : 'text-2xl sm:text-3xl leading-[1.1]'}`}>
          {article.title}
        </h3>
        
        <p className={`mt-8 text-gray-500 dark:text-gray-400 leading-relaxed font-bold line-clamp-3 ${featured ? 'text-xl' : 'text-base'}`}>
          {article.excerpt}
        </p>
        
        <div className="mt-12 flex items-center font-black text-indigo-600 dark:text-indigo-400 transition-all">
          <span className="text-xs uppercase tracking-[0.2em]">Read Technical Analysis</span>
          <i className="fas fa-arrow-right ml-3 text-sm group-hover:translate-x-2 transition-transform"></i>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
