
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  image: string;
  images?: string[];
  tags?: string[];
  pros?: string[];
  cons?: string[];
  affiliateLinks?: AffiliateLink[];
  seoMeta?: {
    title: string;
    description: string;
  };
  comparisonTable?: {
    headers: string[];
    rows: string[][];
  };
  isPublished?: boolean;
}

export interface AffiliateLink {
  label: string;
  url: string;
  position: 'top' | 'middle' | 'bottom' | 'cta-box';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  articles: Article[];
}

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

export interface BackendSpec {
  section: string;
  title: string;
  details: any;
}
