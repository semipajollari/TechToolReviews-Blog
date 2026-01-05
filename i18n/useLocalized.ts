import { useMemo, useState, useEffect } from 'react';
import { useLanguage, Language } from './index';
import { TRANSLATED_ARTICLES, TRANSLATED_CATEGORIES, TranslatedArticle, TranslatedCategory } from './articleTranslations';
import { Article, Category } from '../types';

// Convert translated article to the standard Article format based on current language
function getLocalizedArticle(translatedArticle: TranslatedArticle, language: Language): Article {
  const translation = translatedArticle.translations[language];
  return {
    id: translatedArticle.id,
    slug: translatedArticle.slug,
    category: translatedArticle.category,
    date: translatedArticle.date,
    author: translatedArticle.author,
    image: translatedArticle.image,
    title: translation.title,
    excerpt: translation.excerpt,
    content: translation.content,
    pros: translation.pros,
    cons: translation.cons,
    comparisonTable: translatedArticle.comparisonTable,
  };
}

// Convert DB article to frontend Article format
function convertDbArticle(dbArticle: any): Article {
  return {
    id: dbArticle.slug,
    slug: dbArticle.slug,
    category: dbArticle.category,
    date: new Date(dbArticle.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    author: dbArticle.author || 'TechToolReviews Team',
    image: dbArticle.imageUrl,
    title: dbArticle.title,
    excerpt: dbArticle.description.substring(0, 200) + '...',
    content: dbArticle.description,
    affiliateLinks: dbArticle.affiliateLink ? [{ label: 'Get It Now', url: dbArticle.affiliateLink, position: 'top' as const }] : [],
    merchantLogo: dbArticle.merchantLogo,
  };
}

// Convert translated category to the standard Category format based on current language
function getLocalizedCategory(translatedCategory: TranslatedCategory, language: Language, articles: Article[]): Category {
  const translation = translatedCategory.translations[language];
  return {
    id: translatedCategory.id,
    slug: translatedCategory.slug,
    icon: translatedCategory.icon,
    name: translation.name,
    description: translation.description,
    articles: articles.filter(a => a.category === translatedCategory.id),
  };
}

// Hook to get localized articles (static + database)
export function useLocalizedArticles(): Article[] {
  const { language } = useLanguage();
  const [dbArticles, setDbArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.articles) {
          setDbArticles(data.articles.map(convertDbArticle));
        }
      })
      .catch(err => console.error('Failed to fetch articles:', err));
  }, []);
  
  return useMemo(() => {
    const staticArticles = TRANSLATED_ARTICLES.map(article => getLocalizedArticle(article, language));
    // DB articles first (newest), then static articles
    return [...dbArticles, ...staticArticles];
  }, [language, dbArticles]);
}

// Hook to get localized categories
export function useLocalizedCategories(): Category[] {
  const { language } = useLanguage();
  const articles = useLocalizedArticles();
  
  return useMemo(() => {
    return TRANSLATED_CATEGORIES.map(category => getLocalizedCategory(category, language, articles));
  }, [language, articles]);
}

// Hook to get a single localized article by ID (slug)
export function useLocalizedArticle(id: string): Article | undefined {
  const articles = useLocalizedArticles();
  return useMemo(() => articles.find(a => a.id === id || a.slug === id), [articles, id]);
}

// Hook to get a single localized category by slug
export function useLocalizedCategory(slug: string): Category | undefined {
  const categories = useLocalizedCategories();
  return useMemo(() => categories.find(c => c.slug === slug), [categories, slug]);
}
