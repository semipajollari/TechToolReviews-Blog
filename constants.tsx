
import { Article, Category, NavItem } from './types';

export const BRAND_NAME = "TechToolReviews";

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/', icon: 'fa-home' },
  { label: 'Software', path: '/category/software', icon: 'fa-laptop-code' },
  { label: 'Tech Stacks', path: '/category/tech-stacks', icon: 'fa-layer-group' },
  { label: 'AI Tools', path: '/category/ai-tools', icon: 'fa-robot' },
  { label: 'Architecture', path: '/architecture', icon: 'fa-server' },
  { label: 'About', path: '/about', icon: 'fa-info-circle' },
];

const generateArticles = (): Article[] => {
  return [
    {
      id: 'pm-software-freelance-2025',
      title: 'The Best Project Management Software for Freelancers (2025)',
      slug: 'pm-software-freelance-2025',
      category: 'software',
      date: 'May 10, 2025',
      author: 'Jane Doe',
      excerpt: 'Compare the top tools that keep solo entrepreneurs organized without the enterprise bloat. We tested 25+ tools to find the winners.',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      content: `### Why Specialization Matters in 2025\nThe "one-size-fits-all" approach to project management is officially dead. For freelancers, the overhead of managing a tool like Jira or Asana often outweighs the productivity benefits. We need speed, keyboard-first navigation, and zero-latency interfaces.\n\nIn 2025, the shift toward "Craft Software" is real. We are seeing a new wave of tools designed for the individual contributor who handles multiple clients and dozens of context-switches a day.\n\n### The Linear Paradigm: Speed Above All\nLinear has redefined what an engineering tool can be, but it's increasingly being used by technical freelancers for everything from content pipelines to design sprints. Its "cycles" and "backlog" management are remarkably resilient even when used by a solo founder.\n\nLinear's interface is built on the principle of minimal friction. Every action has a keyboard shortcut, and the search functionality (Cmd+K) is instantaneous.\n\n[View Linear Pricing (Partner Link)](#)\n\n### Frictionless Data Collection with Tally\nTally has emerged as the clear winner for freelancers needing to gather client feedback or intake forms. It avoids the "form-builder" feel by adopting a Notion-like slash command interface. It's the most frictionless way to handle data in 2026.\n\n[Try Tally for Free (Partner Link)](#)`,
      pros: ['Ultra-fast performance', 'Minimalist design', 'Great keyboard shortcuts'],
      cons: ['Higher learning curve', 'Expensive for teams'],
      comparisonTable: { headers: ['Tool', 'Speed', 'Price'], rows: [['Linear', 'Elite', '$0+'], ['Trello', 'Moderate', '$0+'], ['ClickUp', 'Fast', '$5+']] }
    },
    { 
      id: 'billing-apps-2026', 
      title: 'Top 8 Billing & Invoicing Apps for Small Business', 
      slug: 'billing-apps-2026',
      category: 'software', 
      date: 'May 12, 2025', 
      author: 'Mark Smith', 
      excerpt: 'Get paid faster with automated systems designed for 2026 workflows and global tax compliance.', 
      image: 'https://images.unsplash.com/photo-1554224155-8d041c21755a?auto=format&fit=crop&w=1200&q=80', 
      content: `### Cash Flow is Your Lifeblood\nManaging invoices is often the most tedious part of running a agency. We evaluated the top competitors on automation and international payment processing.\n\n### Stripe Invoicing: The Gold Standard\nStripe remains the undisputed leader for developers. The ability to programmatically handle subscriptions and one-off invoices is unparalleled.\n\n[Explore Stripe (Partner Link)](#)` 
    },
    { 
      id: 'nextjs-supabase-saas', 
      title: 'The Next.js 16 + Supabase SaaS Blueprint', 
      slug: 'nextjs-supabase-saas',
      category: 'tech-stacks', 
      date: 'June 1, 2025', 
      author: 'Sarah Chen', 
      excerpt: 'Build your next SaaS in a weekend with this ultra-efficient production stack.', 
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=1200&q=80', 
      content: `### The Modern Default\nIn 2026, the discussion around tech stacks has settled. For 90% of SaaS applications, Next.js combined with Supabase provides the best balance of speed, cost, and developer experience.` 
    },
    {
      id: 'ai-coding-agents-2026',
      title: 'The Rise of AI Coding Agents: Cursor vs. Windsurf',
      slug: 'ai-coding-agents-2026',
      category: 'ai-tools',
      date: 'July 15, 2025',
      author: 'Alex Rivier',
      excerpt: 'Deep dive into the 2026 landscape of AI-first IDEs. We built three apps to see which agent is smarter.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
      content: `### Beyond Simple Autocomplete\nAI in coding has moved from simple line completion to full agentic capabilities. Cursor and Windsurf are currently leading the charge with context-aware indexing and multi-file editing.\n\n### The Cursor Advantage\nCursor's deep integration with the LSP (Language Server Protocol) allows it to understand your entire codebase better than a generic plugin ever could.\n\n[Get Cursor Pro (Partner Link)](#)`
    },
    {
      id: 'scale-solo-dev-2026',
      title: 'How to Scale a Solo Dev Shop to $10k MRR',
      slug: 'scale-solo-dev-2026',
      category: 'guides',
      date: 'August 20, 2025',
      author: 'Founder X',
      excerpt: 'A practical roadmap for technical founders to move from hourly billing to high-margin productized services.',
      image: 'https://images.unsplash.com/photo-1551288049-bbbda536ad0a?auto=format&fit=crop&w=1200&q=80',
      content: `### The Productization Secret\nHourly billing is a trap for talented developers. To scale, you must disconnect your income from your time. We explore the 3-tier productized service model that is dominating the market in 2026.`
    }
  ];
};

export const ARTICLES: Article[] = generateArticles();

export const CATEGORIES: Category[] = [
  {
    id: 'software',
    name: 'Software Reviews',
    slug: 'software',
    description: 'Deep technical analysis of the tools that power high-efficiency solo businesses.',
    icon: 'fa-laptop-code',
    articles: ARTICLES.filter(a => a.category === 'software')
  },
  {
    id: 'tech-stacks',
    name: 'Modern Tech Stacks',
    slug: 'tech-stacks',
    description: 'Architecture blueprints for performance, scalability, and developer happiness.',
    icon: 'fa-layer-group',
    articles: ARTICLES.filter(a => a.category === 'tech-stacks')
  },
  {
    id: 'ai-tools',
    name: 'AI Tool Directory',
    slug: 'ai-tools',
    description: 'Verified reviews of AI tools that deliver actual ROI, not just hype.',
    icon: 'fa-robot',
    articles: ARTICLES.filter(a => a.category === 'ai-tools')
  },
  {
    id: 'guides',
    name: 'Business Guides',
    slug: 'guides',
    description: 'Strategic manuals for launching and scaling tech-driven companies.',
    icon: 'fa-book',
    articles: ARTICLES.filter(a => a.category === 'guides')
  }
];
