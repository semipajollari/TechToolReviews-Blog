import { useMemo } from 'react';
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

// Hook to get localized articles
export function useLocalizedArticles(): Article[] {
  const { language } = useLanguage();
  
  return useMemo(() => {
    return TRANSLATED_ARTICLES.map(article => getLocalizedArticle(article, language));
  }, [language]);
}

// Hook to get localized categories
export function useLocalizedCategories(): Category[] {
  const { language } = useLanguage();
  const articles = useLocalizedArticles();
  
  return useMemo(() => {
    return TRANSLATED_CATEGORIES.map(category => getLocalizedCategory(category, language, articles));
  }, [language, articles]);
}

// Hook to get a single localized article by ID
export function useLocalizedArticle(id: string): Article | undefined {
  const articles = useLocalizedArticles();
  return useMemo(() => articles.find(a => a.id === id), [articles, id]);
}

// Hook to get a single localized category by slug
export function useLocalizedCategory(slug: string): Category | undefined {
  const categories = useLocalizedCategories();
  return useMemo(() => categories.find(c => c.slug === slug), [categories, slug]);
}
