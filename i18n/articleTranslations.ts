import { Language } from './translations';

export interface TranslatedArticle {
  id: string;
  slug: string;
  category: string;
  date: string;
  author: string;
  image: string;
  translations: {
    [key in Language]: {
      title: string;
      excerpt: string;
      content: string;
      pros?: string[];
      cons?: string[];
    };
  };
  comparisonTable?: {
    headers: string[];
    rows: string[][];
  };
}

export interface TranslatedCategory {
  id: string;
  slug: string;
  icon: string;
  translations: {
    [key in Language]: {
      name: string;
      description: string;
    };
  };
}

export const TRANSLATED_ARTICLES: TranslatedArticle[] = [
  {
    id: 'pm-software-freelance-2025',
    slug: 'pm-software-freelance-2025',
    category: 'software',
    date: 'May 10, 2025',
    author: 'Jane Doe',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=1200&q=80',
    comparisonTable: { headers: ['Tool', 'Speed', 'Price'], rows: [['Linear', 'Elite', '$0+'], ['Trello', 'Moderate', '$0+'], ['ClickUp', 'Fast', '$5+']] },
    translations: {
      en: {
        title: 'The Best Project Management Software for Freelancers (2025)',
        excerpt: 'Compare the top tools that keep solo entrepreneurs organized without the enterprise bloat. We tested 25+ tools to find the winners.',
        content: `### Why Specialization Matters in 2025\nThe "one-size-fits-all" approach to project management is officially dead. For freelancers, the overhead of managing a tool like Jira or Asana often outweighs the productivity benefits. We need speed, keyboard-first navigation, and zero-latency interfaces.\n\nIn 2025, the shift toward "Craft Software" is real. We are seeing a new wave of tools designed for the individual contributor who handles multiple clients and dozens of context-switches a day.\n\n### The Linear Paradigm: Speed Above All\nLinear has redefined what an engineering tool can be, but it's increasingly being used by technical freelancers for everything from content pipelines to design sprints. Its "cycles" and "backlog" management are remarkably resilient even when used by a solo founder.\n\nLinear's interface is built on the principle of minimal friction. Every action has a keyboard shortcut, and the search functionality (Cmd+K) is instantaneous.\n\n[View Linear Pricing (Partner Link)](https://linear.app/)\n\n### Frictionless Data Collection with Tally\nTally has emerged as the clear winner for freelancers needing to gather client feedback or intake forms. It avoids the "form-builder" feel by adopting a Notion-like slash command interface. It's the most frictionless way to handle data in 2026.\n\n[Try Tally for Free (Partner Link)](https://tally.so/)`,
        pros: ['Ultra-fast performance', 'Minimalist design', 'Great keyboard shortcuts'],
        cons: ['Higher learning curve', 'Expensive for teams'],
      },
      de: {
        title: 'Die beste Projektmanagement-Software für Freelancer (2025)',
        excerpt: 'Vergleichen Sie die besten Tools, die Solo-Unternehmer organisiert halten, ohne den Enterprise-Ballast. Wir haben 25+ Tools getestet.',
        content: `### Warum Spezialisierung 2025 wichtig ist\nDer "One-Size-Fits-All"-Ansatz für Projektmanagement ist offiziell tot. Für Freelancer überwiegt der Overhead bei der Verwaltung eines Tools wie Jira oder Asana oft die Produktivitätsvorteile. Wir brauchen Geschwindigkeit, Tastatur-Navigation und latenzfreie Oberflächen.\n\n2025 ist der Wandel zu "Craft Software" real. Wir sehen eine neue Welle von Tools, die für den einzelnen Beitragenden konzipiert sind, der mehrere Kunden und Dutzende von Kontextwechseln pro Tag handhabt.\n\n### Das Linear-Paradigma: Geschwindigkeit über alles\nLinear hat neu definiert, was ein Engineering-Tool sein kann, wird aber zunehmend von technischen Freelancern für alles von Content-Pipelines bis Design-Sprints genutzt.\n\n[Linear Preise ansehen (Partner-Link)](https://linear.app/)\n\n### Reibungslose Datenerfassung mit Tally\nTally hat sich als klarer Gewinner für Freelancer herausgestellt, die Kundenfeedback oder Intake-Formulare sammeln müssen.\n\n[Tally kostenlos testen (Partner-Link)](https://tally.so/)`,
        pros: ['Ultraschnelle Leistung', 'Minimalistisches Design', 'Tolle Tastaturkürzel'],
        cons: ['Höhere Lernkurve', 'Teuer für Teams'],
      },
      es: {
        title: 'El Mejor Software de Gestión de Proyectos para Freelancers (2025)',
        excerpt: 'Compara las mejores herramientas que mantienen organizados a los emprendedores sin la complejidad empresarial. Probamos más de 25 herramientas.',
        content: `### Por qué la Especialización Importa en 2025\nEl enfoque "talla única" para la gestión de proyectos está oficialmente muerto. Para freelancers, la sobrecarga de gestionar una herramienta como Jira o Asana a menudo supera los beneficios de productividad. Necesitamos velocidad, navegación por teclado e interfaces sin latencia.\n\nEn 2025, el cambio hacia "Software Artesanal" es real. Estamos viendo una nueva ola de herramientas diseñadas para el contribuidor individual que maneja múltiples clientes y docenas de cambios de contexto al día.\n\n### El Paradigma Linear: Velocidad Ante Todo\nLinear ha redefinido lo que puede ser una herramienta de ingeniería, pero cada vez más está siendo utilizada por freelancers técnicos para todo.\n\n[Ver Precios de Linear (Enlace de Socio)](https://linear.app/)\n\n### Recolección de Datos sin Fricción con Tally\nTally ha emergido como el claro ganador para freelancers que necesitan recopilar feedback de clientes.\n\n[Prueba Tally Gratis (Enlace de Socio)](https://tally.so/)`,
        pros: ['Rendimiento ultra-rápido', 'Diseño minimalista', 'Excelentes atajos de teclado'],
        cons: ['Curva de aprendizaje más alta', 'Caro para equipos'],
      },
      fr: {
        title: 'Le Meilleur Logiciel de Gestion de Projet pour Freelances (2025)',
        excerpt: 'Comparez les meilleurs outils qui gardent les entrepreneurs solo organisés sans la lourdeur entreprise. Nous avons testé plus de 25 outils.',
        content: `### Pourquoi la Spécialisation Compte en 2025\nL'approche "taille unique" de la gestion de projet est officiellement morte. Pour les freelances, la charge de gestion d'un outil comme Jira ou Asana dépasse souvent les avantages de productivité. Nous avons besoin de vitesse, de navigation au clavier et d'interfaces sans latence.\n\nEn 2025, le virage vers le "Craft Software" est réel. Nous voyons une nouvelle vague d'outils conçus pour le contributeur individuel qui gère plusieurs clients et des dizaines de changements de contexte par jour.\n\n### Le Paradigme Linear: La Vitesse Avant Tout\nLinear a redéfini ce qu'un outil d'ingénierie peut être, mais il est de plus en plus utilisé par les freelances techniques pour tout.\n\n[Voir les Prix Linear (Lien Partenaire)](https://linear.app/)\n\n### Collecte de Données Sans Friction avec Tally\nTally est devenu le gagnant incontestable pour les freelances ayant besoin de recueillir des retours clients.\n\n[Essayer Tally Gratuitement (Lien Partenaire)](https://tally.so/)`,
        pros: ['Performance ultra-rapide', 'Design minimaliste', 'Excellents raccourcis clavier'],
        cons: ['Courbe d\'apprentissage plus élevée', 'Cher pour les équipes'],
      },
    },
  },
  {
    id: 'billing-apps-2026',
    slug: 'billing-apps-2026',
    category: 'software',
    date: 'May 12, 2025',
    author: 'Mark Smith',
    image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1200&q=80',
    translations: {
      en: {
        title: 'Top 8 Billing & Invoicing Apps for Small Business',
        excerpt: 'Get paid faster with automated systems designed for 2026 workflows and global tax compliance.',
        content: `### Cash Flow is Your Lifeblood\nManaging invoices is often the most tedious part of running a agency. We evaluated the top competitors on automation and international payment processing.\n\n### Stripe Invoicing: The Gold Standard\nStripe remains the undisputed leader for developers. The ability to programmatically handle subscriptions and one-off invoices is unparalleled.\n\n[Explore Stripe (Partner Link)](https://stripe.com/)`,
      },
      de: {
        title: 'Top 8 Abrechnungs- & Rechnungs-Apps für Kleinunternehmen',
        excerpt: 'Schneller bezahlt werden mit automatisierten Systemen für 2026 Workflows und globale Steuerkonformität.',
        content: `### Cashflow ist Ihr Lebenselixier\nDie Verwaltung von Rechnungen ist oft der mühsamste Teil einer Agentur. Wir haben die Top-Konkurrenten nach Automatisierung und internationaler Zahlungsabwicklung bewertet.\n\n### Stripe Invoicing: Der Goldstandard\nStripe bleibt der unangefochtene Marktführer für Entwickler. Die Fähigkeit, Abonnements und Einzelrechnungen programmatisch zu verarbeiten, ist unübertroffen.\n\n[Stripe entdecken (Partner-Link)](https://stripe.com/)`,
      },
      es: {
        title: 'Las 8 Mejores Apps de Facturación para Pequeñas Empresas',
        excerpt: 'Cobra más rápido con sistemas automatizados diseñados para flujos de trabajo 2026 y cumplimiento fiscal global.',
        content: `### El Flujo de Caja es Tu Sustento\nGestionar facturas suele ser la parte más tediosa de dirigir una agencia. Evaluamos los principales competidores en automatización y procesamiento de pagos internacionales.\n\n### Stripe Invoicing: El Estándar de Oro\nStripe sigue siendo el líder indiscutible para desarrolladores. La capacidad de manejar suscripciones y facturas únicas programáticamente no tiene comparación.\n\n[Explorar Stripe (Enlace de Socio)](https://stripe.com/)`,
      },
      fr: {
        title: 'Top 8 des Applications de Facturation pour Petites Entreprises',
        excerpt: 'Soyez payé plus rapidement avec des systèmes automatisés conçus pour les workflows 2026 et la conformité fiscale mondiale.',
        content: `### La Trésorerie est Votre Oxygène\nGérer les factures est souvent la partie la plus fastidieuse de la gestion d'une agence. Nous avons évalué les principaux concurrents sur l'automatisation et le traitement des paiements internationaux.\n\n### Stripe Invoicing: L'Étalon-Or\nStripe reste le leader incontesté pour les développeurs. La capacité de gérer les abonnements et les factures uniques de manière programmatique est inégalée.\n\n[Explorer Stripe (Lien Partenaire)](https://stripe.com/)`,
      },
    },
  },
  {
    id: 'nextjs-supabase-saas',
    slug: 'nextjs-supabase-saas',
    category: 'tech-stacks',
    date: 'June 1, 2025',
    author: 'Sarah Chen',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    translations: {
      en: {
        title: 'The Next.js 16 + Supabase SaaS Blueprint',
        excerpt: 'Build your next SaaS in a weekend with this ultra-efficient production stack.',
        content: `### The Modern Default\nIn 2026, the discussion around tech stacks has settled. For 90% of SaaS applications, Next.js combined with Supabase provides the best balance of speed, cost, and developer experience.`,
      },
      de: {
        title: 'Der Next.js 16 + Supabase SaaS Blueprint',
        excerpt: 'Bauen Sie Ihr nächstes SaaS an einem Wochenende mit diesem ultra-effizienten Produktions-Stack.',
        content: `### Der moderne Standard\n2026 hat sich die Diskussion um Tech-Stacks beruhigt. Für 90% der SaaS-Anwendungen bietet Next.js in Kombination mit Supabase die beste Balance aus Geschwindigkeit, Kosten und Entwicklererfahrung.`,
      },
      es: {
        title: 'El Blueprint de SaaS con Next.js 16 + Supabase',
        excerpt: 'Construye tu próximo SaaS en un fin de semana con este stack de producción ultra-eficiente.',
        content: `### El Estándar Moderno\nEn 2026, la discusión sobre tech stacks se ha estabilizado. Para el 90% de las aplicaciones SaaS, Next.js combinado con Supabase proporciona el mejor equilibrio de velocidad, costo y experiencia de desarrollador.`,
      },
      fr: {
        title: 'Le Blueprint SaaS Next.js 16 + Supabase',
        excerpt: 'Construisez votre prochain SaaS en un week-end avec ce stack de production ultra-efficace.',
        content: `### Le Standard Moderne\nEn 2026, la discussion autour des tech stacks s'est stabilisée. Pour 90% des applications SaaS, Next.js combiné avec Supabase offre le meilleur équilibre entre vitesse, coût et expérience développeur.`,
      },
    },
  },
  {
    id: 'ai-coding-agents-2026',
    slug: 'ai-coding-agents-2026',
    category: 'ai-tools',
    date: 'July 15, 2025',
    author: 'Alex Rivier',
    image: 'https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&w=1200&q=80',
    translations: {
      en: {
        title: 'The Rise of AI Coding Agents: Cursor vs. Windsurf',
        excerpt: 'Deep dive into the 2026 landscape of AI-first IDEs. We built three apps to see which agent is smarter.',
        content: `### Beyond Simple Autocomplete\nAI in coding has moved from simple line completion to full agentic capabilities. Cursor and Windsurf are currently leading the charge with context-aware indexing and multi-file editing.\n\n### The Cursor Advantage\nCursor's deep integration with the LSP (Language Server Protocol) allows it to understand your entire codebase better than a generic plugin ever could.\n\n[Get Cursor Pro (Partner Link)](https://cursor.com/)\n\n### Windsurf: The Visual Coder's Dream\nWindsurf takes a different approach by focusing on visual code manipulation. Its AI can refactor entire components based on high-level instructions, making it ideal for frontend-heavy projects.\n\n[Try Windsurf Now (Partner Link)](https://windsurf.ai/)`,
      },
      de: {
        title: 'Der Aufstieg der KI-Coding-Agenten: Cursor vs. Windsurf',
        excerpt: 'Tieftauchgang in die 2026 Landschaft der KI-first IDEs. Wir haben drei Apps gebaut, um zu sehen, welcher Agent schlauer ist.',
        content: `### Jenseits einfacher Autovervollständigung\nKI beim Programmieren ist von einfacher Zeilenvervollständigung zu vollen agentischen Fähigkeiten übergegangen. Cursor und Windsurf führen derzeit mit kontextbewusster Indexierung und Multi-Datei-Bearbeitung.\n\n### Der Cursor-Vorteil\nCursors tiefe Integration mit dem LSP (Language Server Protocol) ermöglicht es, Ihre gesamte Codebasis besser zu verstehen als jedes generische Plugin.\n\n[Cursor Pro holen (Partner-Link)](https://cursor.com/)\n\n### Windsurf: Der Traum des visuellen Coders\nWindsurf verfolgt einen anderen Ansatz mit Fokus auf visuelle Code-Manipulation. Seine KI kann ganze Komponenten basierend auf High-Level-Anweisungen umstrukturieren.\n\n[Windsurf jetzt testen (Partner-Link)](https://windsurf.ai/)`,
      },
      es: {
        title: 'El Auge de los Agentes de Codificación IA: Cursor vs. Windsurf',
        excerpt: 'Análisis profundo del panorama 2026 de IDEs IA-first. Construimos tres apps para ver qué agente es más inteligente.',
        content: `### Más Allá del Autocompletado Simple\nLa IA en programación ha pasado de simple completado de líneas a capacidades agénticas completas. Cursor y Windsurf lideran actualmente con indexación consciente del contexto y edición multi-archivo.\n\n### La Ventaja de Cursor\nLa profunda integración de Cursor con el LSP (Language Server Protocol) le permite entender toda tu base de código mejor que cualquier plugin genérico.\n\n[Obtener Cursor Pro (Enlace de Socio)](https://cursor.com/)\n\n### Windsurf: El Sueño del Programador Visual\nWindsurf adopta un enfoque diferente centrándose en la manipulación visual del código. Su IA puede refactorizar componentes enteros basándose en instrucciones de alto nivel.\n\n[Probar Windsurf Ahora (Enlace de Socio)](https://windsurf.ai/)`,
      },
      fr: {
        title: 'L\'Essor des Agents de Codage IA: Cursor vs. Windsurf',
        excerpt: 'Plongée profonde dans le paysage 2026 des IDEs IA-first. Nous avons construit trois apps pour voir quel agent est le plus intelligent.',
        content: `### Au-delà de l'Autocomplétion Simple\nL'IA dans le codage est passée de la simple complétion de lignes à des capacités agentiques complètes. Cursor et Windsurf mènent actuellement la charge avec l'indexation contextuelle et l'édition multi-fichiers.\n\n### L'Avantage Cursor\nL'intégration profonde de Cursor avec le LSP (Language Server Protocol) lui permet de comprendre toute votre base de code mieux que n'importe quel plugin générique.\n\n[Obtenir Cursor Pro (Lien Partenaire)](https://cursor.com/)\n\n### Windsurf: Le Rêve du Codeur Visuel\nWindsurf adopte une approche différente en se concentrant sur la manipulation visuelle du code. Son IA peut refactoriser des composants entiers basés sur des instructions de haut niveau.\n\n[Essayer Windsurf Maintenant (Lien Partenaire)](https://windsurf.ai/)`,
      },
    },
  },
  {
    id: 'scale-solo-dev-2026',
    slug: 'scale-solo-dev-2026',
    category: 'guides',
    date: 'August 20, 2025',
    author: 'Founder X',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    translations: {
      en: {
        title: 'How to Scale a Solo Dev Shop to $10k MRR',
        excerpt: 'A practical roadmap for technical founders to move from hourly billing to high-margin productized services.',
        content: `### The Productization Secret\nHourly billing is a trap for talented developers. To scale, you must disconnect your income from your time. We explore the 3-tier productized service model that is dominating the market in 2026.`,
      },
      de: {
        title: 'Wie man ein Solo-Dev-Shop auf $10k MRR skaliert',
        excerpt: 'Ein praktischer Fahrplan für technische Gründer, um von Stundenabrechnungen zu margenstarken produktisierten Diensten zu wechseln.',
        content: `### Das Produktisierungs-Geheimnis\nStundenabrechnung ist eine Falle für talentierte Entwickler. Um zu skalieren, müssen Sie Ihr Einkommen von Ihrer Zeit entkoppeln. Wir erkunden das 3-Stufen-produktisierte Servicemodell, das 2026 den Markt dominiert.`,
      },
      es: {
        title: 'Cómo Escalar un Negocio de Desarrollo Solo a $10k MRR',
        excerpt: 'Una hoja de ruta práctica para fundadores técnicos para pasar de facturación por hora a servicios productizados de alto margen.',
        content: `### El Secreto de la Productización\nLa facturación por hora es una trampa para desarrolladores talentosos. Para escalar, debes desconectar tu ingreso de tu tiempo. Exploramos el modelo de servicio productizado de 3 niveles que domina el mercado en 2026.`,
      },
      fr: {
        title: 'Comment Faire Passer un Studio Dev Solo à $10k MRR',
        excerpt: 'Une feuille de route pratique pour les fondateurs techniques pour passer de la facturation horaire aux services productisés à haute marge.',
        content: `### Le Secret de la Productisation\nLa facturation horaire est un piège pour les développeurs talentueux. Pour évoluer, vous devez déconnecter vos revenus de votre temps. Nous explorons le modèle de service productisé à 3 niveaux qui domine le marché en 2026.`,
      },
    },
  },
  {
    id: 'best-ide-2026',
    slug: 'best-ide-2026',
    category: 'software',
    date: 'September 5, 2025',
    author: 'Jane Doe',
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1200&q=80',
    translations: {
      en: {
        title: 'The Best IDEs for 2026: A Comprehensive Review',
        excerpt: 'A deep dive into the top IDEs for 2026, comparing features, performance, and developer experience.',
        content: `### The IDE Landscape in 2026\nIDEs have evolved from simple text editors to full-fledged development environments. We evaluated the top contenders based on performance, AI integration, and community support.\n\n### VS Code: The Workhorse\nVS Code continues to dominate with its extensive extension ecosystem and robust debugging capabilities.\n\n[Explore VS Code (Partner Link)](https://code.visualstudio.com/)\n\n### JetBrains IDEs: The Power User Choice\nJetBrains products are known for their intelligent code completion and deep integration with frameworks.\n\n[Get JetBrains IDE (Partner Link)](https://www.jetbrains.com/)`,
      },
      de: {
        title: 'Die besten IDEs für 2026: Ein umfassender Test',
        excerpt: 'Ein Tieftauchgang in die besten IDEs für 2026, Vergleich von Funktionen, Leistung und Entwicklererfahrung.',
        content: `### Die IDE-Landschaft 2026\nIDEs haben sich von einfachen Texteditoren zu vollwertigen Entwicklungsumgebungen entwickelt. Wir haben die Top-Kandidaten nach Leistung, KI-Integration und Community-Support bewertet.\n\n### VS Code: Das Arbeitstier\nVS Code dominiert weiterhin mit seinem umfangreichen Erweiterungs-Ökosystem und robusten Debugging-Funktionen.\n\n[VS Code entdecken (Partner-Link)](https://code.visualstudio.com/)\n\n### JetBrains IDEs: Die Power-User-Wahl\nJetBrains-Produkte sind bekannt für ihre intelligente Code-Vervollständigung und tiefe Framework-Integration.\n\n[JetBrains IDE holen (Partner-Link)](https://www.jetbrains.com/)`,
      },
      es: {
        title: 'Los Mejores IDEs para 2026: Una Revisión Completa',
        excerpt: 'Un análisis profundo de los mejores IDEs para 2026, comparando características, rendimiento y experiencia de desarrollador.',
        content: `### El Panorama de IDEs en 2026\nLos IDEs han evolucionado de simples editores de texto a entornos de desarrollo completos. Evaluamos los principales contendientes basándonos en rendimiento, integración de IA y soporte de la comunidad.\n\n### VS Code: El Caballo de Batalla\nVS Code continúa dominando con su extenso ecosistema de extensiones y robustas capacidades de depuración.\n\n[Explorar VS Code (Enlace de Socio)](https://code.visualstudio.com/)\n\n### JetBrains IDEs: La Elección del Usuario Avanzado\nLos productos de JetBrains son conocidos por su completado de código inteligente y profunda integración con frameworks.\n\n[Obtener JetBrains IDE (Enlace de Socio)](https://www.jetbrains.com/)`,
      },
      fr: {
        title: 'Les Meilleurs IDEs pour 2026: Une Revue Complète',
        excerpt: 'Une plongée profonde dans les meilleurs IDEs pour 2026, comparant fonctionnalités, performance et expérience développeur.',
        content: `### Le Paysage des IDEs en 2026\nLes IDEs ont évolué de simples éditeurs de texte à des environnements de développement complets. Nous avons évalué les principaux prétendants sur la performance, l'intégration IA et le support communautaire.\n\n### VS Code: Le Cheval de Trait\nVS Code continue de dominer avec son vaste écosystème d'extensions et ses robustes capacités de débogage.\n\n[Explorer VS Code (Lien Partenaire)](https://code.visualstudio.com/)\n\n### JetBrains IDEs: Le Choix des Power Users\nLes produits JetBrains sont connus pour leur complétion de code intelligente et leur intégration profonde avec les frameworks.\n\n[Obtenir JetBrains IDE (Lien Partenaire)](https://www.jetbrains.com/)`,
      },
    },
  },
];

export const TRANSLATED_CATEGORIES: TranslatedCategory[] = [
  {
    id: 'software',
    slug: 'software',
    icon: 'fa-laptop-code',
    translations: {
      en: {
        name: 'Software Reviews',
        description: 'Deep technical analysis of the tools that power high-efficiency solo businesses.',
      },
      de: {
        name: 'Software-Bewertungen',
        description: 'Tiefgehende technische Analyse der Tools, die hocheffiziente Solo-Unternehmen antreiben.',
      },
      es: {
        name: 'Reseñas de Software',
        description: 'Análisis técnico profundo de las herramientas que impulsan negocios unipersonales de alta eficiencia.',
      },
      fr: {
        name: 'Avis Logiciels',
        description: 'Analyse technique approfondie des outils qui alimentent les entreprises solo haute efficacité.',
      },
    },
  },
  {
    id: 'tech-stacks',
    slug: 'tech-stacks',
    icon: 'fa-layer-group',
    translations: {
      en: {
        name: 'Modern Tech Stacks',
        description: 'Architecture blueprints for performance, scalability, and developer happiness.',
      },
      de: {
        name: 'Moderne Tech-Stacks',
        description: 'Architektur-Blueprints für Performance, Skalierbarkeit und Entwickler-Zufriedenheit.',
      },
      es: {
        name: 'Stacks Tecnológicos Modernos',
        description: 'Blueprints de arquitectura para rendimiento, escalabilidad y felicidad del desarrollador.',
      },
      fr: {
        name: 'Stacks Tech Modernes',
        description: 'Blueprints d\'architecture pour la performance, la scalabilité et le bonheur des développeurs.',
      },
    },
  },
  {
    id: 'ai-tools',
    slug: 'ai-tools',
    icon: 'fa-robot',
    translations: {
      en: {
        name: 'AI Tool Directory',
        description: 'Verified reviews of AI tools that deliver actual ROI, not just hype.',
      },
      de: {
        name: 'KI-Tool-Verzeichnis',
        description: 'Verifizierte Bewertungen von KI-Tools, die echten ROI liefern, nicht nur Hype.',
      },
      es: {
        name: 'Directorio de Herramientas IA',
        description: 'Reseñas verificadas de herramientas IA que entregan ROI real, no solo publicidad.',
      },
      fr: {
        name: 'Répertoire Outils IA',
        description: 'Avis vérifiés des outils IA qui offrent un vrai ROI, pas juste du battage.',
      },
    },
  },
  {
    id: 'guides',
    slug: 'guides',
    icon: 'fa-book',
    translations: {
      en: {
        name: 'Business Guides',
        description: 'Strategic manuals for launching and scaling tech-driven companies.',
      },
      de: {
        name: 'Business-Guides',
        description: 'Strategische Handbücher für den Start und die Skalierung von Tech-Unternehmen.',
      },
      es: {
        name: 'Guías de Negocios',
        description: 'Manuales estratégicos para lanzar y escalar empresas impulsadas por tecnología.',
      },
      fr: {
        name: 'Guides Business',
        description: 'Manuels stratégiques pour lancer et faire évoluer des entreprises tech.',
      },
    },
  },
];
