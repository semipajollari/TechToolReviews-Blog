export type Language = 'en' | 'de' | 'es' | 'fr';

export interface Translations {
  // Navigation
  nav: {
    home: string;
    software: string;
    techStacks: string;
    aiTools: string;
    architecture: string;
    about: string;
    subscribe: string;
    subscribeNow: string;
  };
  // Home page
  home: {
    heroTitle: string;
    heroSubtitle: string;
    featuredArticles: string;
    viewAll: string;
    readMore: string;
    latestReviews: string;
    joinNewsletter: string;
    newsletterDesc: string;
    emailPlaceholder: string;
    subscribeBtn: string;
    categories: string;
  };
  // Article page
  article: {
    backHome: string;
    minRead: string;
    technicalEditor: string;
    verifiedFor: string;
    partnerRecommendation: string;
    staffPick: string;
    specialDeal: string;
    editorsTopPick: string;
    limitedOffer: string;
    freeTrial: string;
    noCreditCard: string;
    cancelAnytime: string;
    claimFreeTrial: string;
    watchDemo: string;
    reviews: string;
    professionalsStarted: string;
    peopleViewing: string;
    moneyBackGuarantee: string;
    performanceMatrix: string;
    pros: string;
    cons: string;
    postNotFound: string;
  };
  // Subscribe modal
  subscribe: {
    joinInsiderList: string;
    weeklyInsights: string;
    subscribing: string;
    subscribeSuccess: string;
    close: string;
    connectionError: string;
    invalidEmail: string;
  };
  // Footer
  footer: {
    description: string;
    quickLinks: string;
    resources: string;
    blog: string;
    newsletter: string;
    documentation: string;
    support: string;
    legal: string;
    privacy: string;
    terms: string;
    cookies: string;
    allRightsReserved: string;
  };
  // About page
  about: {
    title: string;
    subtitle: string;
    mission: string;
    missionText: string;
    team: string;
    contact: string;
    whyWeStarted: string;
    whyWeStartedText1: string;
    whyWeStartedText2: string;
    toolsTested: string;
    monthlyReaders: string;
    techToolStandard: string;
    rigorousTesting: string;
    rigorousTestingText: string;
    unbiasedReviews: string;
    unbiasedReviewsText: string;
    constantUpdates: string;
    constantUpdatesText: string;
  };
  // Category page
  category: {
    notFound: string;
    notFoundText: string;
    returnHome: string;
    database: string;
    sector: string;
    activeBenchmarks: string;
    reviewsVerified: string;
    pendingTitle: string;
    pendingText: string;
    getNotified: string;
    alternativeSectors: string;
    exploreDatabase: string;
  };
  // Common
  common: {
    loading: string;
    error: string;
    tryAgain: string;
    learnMore: string;
    getStarted: string;
    seeAll: string;
    readAnalysis: string;
  };
  // Tech Stack Advisor
  techAdvisor: {
    poweredBy: string;
    title: string;
    description: string;
    placeholder: string;
    generateStack: string;
    minChars: string;
    failedGenerate: string;
    unexpectedError: string;
    strategy: string;
    frontend: string;
    backend: string;
    database: string;
    hosting: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'Home',
      software: 'Software',
      techStacks: 'Tech Stacks',
      aiTools: 'AI Tools',
      architecture: 'Architecture',
      about: 'About',
      subscribe: 'Subscribe',
      subscribeNow: 'Subscribe Now',
    },
    home: {
      heroTitle: 'The Future of Tech Reviews',
      heroSubtitle: 'In-depth analysis and comparisons of the tools shaping the 2026 digital landscape.',
      featuredArticles: 'Featured Articles',
      viewAll: 'View All',
      readMore: 'Read More',
      latestReviews: 'Latest Reviews',
      joinNewsletter: 'Join Our Newsletter',
      newsletterDesc: 'Get weekly technical tool audits and exclusive insights delivered to your inbox.',
      emailPlaceholder: 'your@email.com',
      subscribeBtn: 'Subscribe',
      categories: 'Categories',
    },
    article: {
      backHome: 'Back Home',
      minRead: 'min read',
      technicalEditor: 'Technical Editor',
      verifiedFor: 'Verified for 2026',
      partnerRecommendation: 'Partner Recommendation',
      staffPick: 'Staff Pick',
      specialDeal: 'Special Deal',
      editorsTopPick: "Editor's Top Pick 2026",
      limitedOffer: 'Limited Offer',
      freeTrial: 'Free Trial',
      noCreditCard: 'No Credit Card',
      cancelAnytime: 'Cancel Anytime',
      claimFreeTrial: 'Claim Your Free Trial',
      watchDemo: 'Watch Demo',
      reviews: 'reviews',
      professionalsStarted: 'professionals started this week',
      peopleViewing: 'people viewing this offer right now',
      moneyBackGuarantee: '30-day money-back guarantee',
      performanceMatrix: 'Performance Matrix',
      pros: 'Pros',
      cons: 'Cons',
      postNotFound: 'Post Not Found',
    },
    subscribe: {
      joinInsiderList: 'Join Insider List',
      weeklyInsights: 'Get weekly technical tool audits and exclusive insights.',
      subscribing: 'Subscribing...',
      subscribeSuccess: 'Subscription successful!',
      close: 'Close',
      connectionError: 'Connection error. Please try again.',
      invalidEmail: 'Please enter a valid email address.',
    },
    footer: {
      description: 'The global authority on technical toolsets and software comparisons for the 2026 digital landscape.',
      quickLinks: 'Quick Links',
      resources: 'Resources',
      blog: 'Blog',
      newsletter: 'Newsletter',
      documentation: 'Documentation',
      support: 'Support',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookies: 'Cookie Policy',
      allRightsReserved: 'All rights reserved.',
    },
    about: {
      title: 'About Us',
      subtitle: 'We are passionate about technology and committed to providing honest, in-depth reviews.',
      mission: 'Our Mission',
      missionText: 'To help developers and teams make informed decisions about the tools they use.',
      team: 'Our Team',
      contact: 'Contact Us',
      whyWeStarted: 'Why we started this platform',
      whyWeStartedText1: 'Founded in 2024 by a group of developers and digital strategists, TechToolReviews was born out of frustration. The "best software" lists we saw online were filled with outdated recommendations and low-quality affiliate filler.',
      whyWeStartedText2: 'We decided to build the resource we wanted to see: deeply technical, rigorously tested, and always focused on the "2026 perspective"—looking at where tools are going, not just where they\'ve been.',
      toolsTested: 'Tools Tested',
      monthlyReaders: 'Monthly Readers',
      techToolStandard: 'The TechTool Standard',
      rigorousTesting: 'Rigorous Testing',
      rigorousTestingText: 'We don\'t just read the marketing copy. We set up real production environments and test workflows for at least 30 days before publishing.',
      unbiasedReviews: 'Unbiased Reviews',
      unbiasedReviewsText: 'Our editorial team is separate from our business team. Our ratings cannot be bought or influenced by external partners.',
      constantUpdates: 'Constant Updates',
      constantUpdatesText: 'Software moves fast. We update our major guides every 90 days to ensure you\'re never reading outdated or legacy advice.',
    },
    category: {
      notFound: 'Category Not Found',
      notFoundText: 'The requested architectural sector does not exist.',
      returnHome: 'Return to Mission Control',
      database: 'Database',
      sector: 'Sector',
      activeBenchmarks: 'Active Benchmarks',
      reviewsVerified: 'REVIEWS VERIFIED',
      pendingTitle: 'Editorial Deep Dives Pending',
      pendingText: 'Our engineering team is currently stress-testing tools in this sector. 2026 reports are scheduled for release next quarter.',
      getNotified: 'Get Notified of Release',
      alternativeSectors: 'Alternative Sectors',
      exploreDatabase: 'Explore Database',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      tryAgain: 'Try Again',
      learnMore: 'Learn More',
      getStarted: 'Get Started',
      seeAll: 'See All',
      readAnalysis: 'Read Technical Analysis',
    },
    techAdvisor: {
      poweredBy: 'Gemini-Powered Engine',
      title: 'AI Stack Builder',
      description: 'Describe your business idea in a few words. Our AI will analyze the latest 2026 tech trends and generate a production-ready infrastructure blueprint instantly.',
      placeholder: "e.g., 'A video editing SaaS for TikTok creators'",
      generateStack: 'Generate Stack',
      minChars: 'Please provide a more detailed description (at least 10 characters).',
      failedGenerate: 'Failed to generate stack. The AI service may be temporarily unavailable.',
      unexpectedError: 'An unexpected error occurred. Please try again.',
      strategy: 'The 2026 Strategy',
      frontend: 'Frontend',
      backend: 'Backend',
      database: 'Database',
      hosting: 'Hosting',
    },
  },
  de: {
    nav: {
      home: 'Startseite',
      software: 'Software',
      techStacks: 'Tech-Stacks',
      aiTools: 'KI-Tools',
      architecture: 'Architektur',
      about: 'Über uns',
      subscribe: 'Abonnieren',
      subscribeNow: 'Jetzt abonnieren',
    },
    home: {
      heroTitle: 'Die Zukunft der Tech-Bewertungen',
      heroSubtitle: 'Tiefgehende Analysen und Vergleiche der Tools, die die digitale Landschaft 2026 prägen.',
      featuredArticles: 'Empfohlene Artikel',
      viewAll: 'Alle anzeigen',
      readMore: 'Weiterlesen',
      latestReviews: 'Neueste Bewertungen',
      joinNewsletter: 'Newsletter abonnieren',
      newsletterDesc: 'Erhalten Sie wöchentliche technische Tool-Audits und exklusive Einblicke.',
      emailPlaceholder: 'ihre@email.de',
      subscribeBtn: 'Abonnieren',
      categories: 'Kategorien',
    },
    article: {
      backHome: 'Zurück zur Startseite',
      minRead: 'Min. Lesezeit',
      technicalEditor: 'Technischer Redakteur',
      verifiedFor: 'Verifiziert für 2026',
      partnerRecommendation: 'Partner-Empfehlung',
      staffPick: 'Redaktionsempfehlung',
      specialDeal: 'Sonderangebot',
      editorsTopPick: 'Top-Auswahl der Redaktion 2026',
      limitedOffer: 'Begrenztes Angebot',
      freeTrial: 'Kostenlose Testversion',
      noCreditCard: 'Keine Kreditkarte',
      cancelAnytime: 'Jederzeit kündbar',
      claimFreeTrial: 'Kostenlos testen',
      watchDemo: 'Demo ansehen',
      reviews: 'Bewertungen',
      professionalsStarted: 'Profis haben diese Woche begonnen',
      peopleViewing: 'Personen sehen sich dieses Angebot gerade an',
      moneyBackGuarantee: '30-Tage-Geld-zurück-Garantie',
      performanceMatrix: 'Leistungsmatrix',
      pros: 'Vorteile',
      cons: 'Nachteile',
      postNotFound: 'Beitrag nicht gefunden',
    },
    subscribe: {
      joinInsiderList: 'Insider-Liste beitreten',
      weeklyInsights: 'Erhalten Sie wöchentliche technische Tool-Audits und exklusive Einblicke.',
      subscribing: 'Wird abonniert...',
      subscribeSuccess: 'Erfolgreich abonniert!',
      close: 'Schließen',
      connectionError: 'Verbindungsfehler. Bitte versuchen Sie es erneut.',
      invalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
    },
    footer: {
      description: 'Die globale Autorität für technische Toolsets und Software-Vergleiche für die digitale Landschaft 2026.',
      quickLinks: 'Schnelllinks',
      resources: 'Ressourcen',
      blog: 'Blog',
      newsletter: 'Newsletter',
      documentation: 'Dokumentation',
      support: 'Support',
      legal: 'Rechtliches',
      privacy: 'Datenschutz',
      terms: 'Nutzungsbedingungen',
      cookies: 'Cookie-Richtlinie',
      allRightsReserved: 'Alle Rechte vorbehalten.',
    },
    about: {
      title: 'Über uns',
      subtitle: 'Wir sind leidenschaftlich an Technologie interessiert und engagieren uns für ehrliche, tiefgehende Bewertungen.',
      mission: 'Unsere Mission',
      missionText: 'Entwicklern und Teams zu helfen, fundierte Entscheidungen über ihre Tools zu treffen.',
      team: 'Unser Team',
      contact: 'Kontakt',
      whyWeStarted: 'Warum wir diese Plattform gestartet haben',
      whyWeStartedText1: 'Gegründet 2024 von einer Gruppe von Entwicklern und digitalen Strategen, entstand TechToolReviews aus Frustration. Die "beste Software"-Listen, die wir online sahen, waren voller veralteter Empfehlungen und minderwertiger Affiliate-Inhalte.',
      whyWeStartedText2: 'Wir beschlossen, die Ressource zu erstellen, die wir sehen wollten: technisch tiefgehend, rigoros getestet und immer mit Blick auf die "2026-Perspektive"—nicht wo Tools waren, sondern wohin sie gehen.',
      toolsTested: 'Getestete Tools',
      monthlyReaders: 'Monatliche Leser',
      techToolStandard: 'Der TechTool-Standard',
      rigorousTesting: 'Rigoroses Testen',
      rigorousTestingText: 'Wir lesen nicht nur das Marketing. Wir richten echte Produktionsumgebungen ein und testen Workflows mindestens 30 Tage vor der Veröffentlichung.',
      unbiasedReviews: 'Unvoreingenommene Bewertungen',
      unbiasedReviewsText: 'Unser Redaktionsteam ist getrennt von unserem Geschäftsteam. Unsere Bewertungen können nicht gekauft oder beeinflusst werden.',
      constantUpdates: 'Ständige Updates',
      constantUpdatesText: 'Software entwickelt sich schnell. Wir aktualisieren unsere wichtigsten Guides alle 90 Tage, damit Sie nie veraltete Ratschläge lesen.',
    },
    category: {
      notFound: 'Kategorie nicht gefunden',
      notFoundText: 'Der angeforderte Architektursektor existiert nicht.',
      returnHome: 'Zurück zur Startseite',
      database: 'Datenbank',
      sector: 'Sektor',
      activeBenchmarks: 'Aktive Benchmarks',
      reviewsVerified: 'BEWERTUNGEN VERIFIZIERT',
      pendingTitle: 'Redaktionelle Tiefenanalysen ausstehend',
      pendingText: 'Unser Ingenieurteam testet derzeit Tools in diesem Sektor. 2026-Berichte sind für das nächste Quartal geplant.',
      getNotified: 'Benachrichtigung erhalten',
      alternativeSectors: 'Alternative Sektoren',
      exploreDatabase: 'Datenbank erkunden',
    },
    common: {
      loading: 'Wird geladen...',
      error: 'Fehler',
      tryAgain: 'Erneut versuchen',
      learnMore: 'Mehr erfahren',
      getStarted: 'Loslegen',
      seeAll: 'Alle anzeigen',
      readAnalysis: 'Technische Analyse lesen',
    },
    techAdvisor: {
      poweredBy: 'Gemini-Powered Engine',
      title: 'KI Stack Builder',
      description: 'Beschreiben Sie Ihre Geschäftsidee in wenigen Worten. Unsere KI analysiert die neuesten 2026 Tech-Trends und erstellt sofort einen produktionsbereiten Infrastruktur-Blueprint.',
      placeholder: "z.B. 'Eine Videobearbeitungs-SaaS für TikTok-Creator'",
      generateStack: 'Stack generieren',
      minChars: 'Bitte geben Sie eine detailliertere Beschreibung (mindestens 10 Zeichen).',
      failedGenerate: 'Stack-Generierung fehlgeschlagen. Der KI-Dienst ist möglicherweise vorübergehend nicht verfügbar.',
      unexpectedError: 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
      strategy: 'Die 2026 Strategie',
      frontend: 'Frontend',
      backend: 'Backend',
      database: 'Datenbank',
      hosting: 'Hosting',
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      software: 'Software',
      techStacks: 'Stacks Tecnológicos',
      aiTools: 'Herramientas IA',
      architecture: 'Arquitectura',
      about: 'Nosotros',
      subscribe: 'Suscribirse',
      subscribeNow: 'Suscribirse ahora',
    },
    home: {
      heroTitle: 'El Futuro de las Reseñas Tech',
      heroSubtitle: 'Análisis profundos y comparaciones de las herramientas que definen el panorama digital de 2026.',
      featuredArticles: 'Artículos Destacados',
      viewAll: 'Ver todo',
      readMore: 'Leer más',
      latestReviews: 'Últimas Reseñas',
      joinNewsletter: 'Únete a nuestro boletín',
      newsletterDesc: 'Recibe auditorías semanales de herramientas técnicas e información exclusiva.',
      emailPlaceholder: 'tu@email.com',
      subscribeBtn: 'Suscribirse',
      categories: 'Categorías',
    },
    article: {
      backHome: 'Volver al inicio',
      minRead: 'min de lectura',
      technicalEditor: 'Editor Técnico',
      verifiedFor: 'Verificado para 2026',
      partnerRecommendation: 'Recomendación de Socio',
      staffPick: 'Selección del Equipo',
      specialDeal: 'Oferta Especial',
      editorsTopPick: 'Selección Top del Editor 2026',
      limitedOffer: 'Oferta Limitada',
      freeTrial: 'Prueba Gratis',
      noCreditCard: 'Sin Tarjeta de Crédito',
      cancelAnytime: 'Cancela Cuando Quieras',
      claimFreeTrial: 'Obtén tu Prueba Gratis',
      watchDemo: 'Ver Demo',
      reviews: 'reseñas',
      professionalsStarted: 'profesionales comenzaron esta semana',
      peopleViewing: 'personas viendo esta oferta ahora mismo',
      moneyBackGuarantee: 'Garantía de devolución de 30 días',
      performanceMatrix: 'Matriz de Rendimiento',
      pros: 'Ventajas',
      cons: 'Desventajas',
      postNotFound: 'Publicación no encontrada',
    },
    subscribe: {
      joinInsiderList: 'Únete a la Lista Insider',
      weeklyInsights: 'Recibe auditorías semanales de herramientas técnicas e información exclusiva.',
      subscribing: 'Suscribiendo...',
      subscribeSuccess: '¡Suscripción exitosa!',
      close: 'Cerrar',
      connectionError: 'Error de conexión. Por favor, inténtalo de nuevo.',
      invalidEmail: 'Por favor, introduce una dirección de correo válida.',
    },
    footer: {
      description: 'La autoridad global en conjuntos de herramientas técnicas y comparaciones de software para el panorama digital de 2026.',
      quickLinks: 'Enlaces Rápidos',
      resources: 'Recursos',
      blog: 'Blog',
      newsletter: 'Boletín',
      documentation: 'Documentación',
      support: 'Soporte',
      legal: 'Legal',
      privacy: 'Política de Privacidad',
      terms: 'Términos de Servicio',
      cookies: 'Política de Cookies',
      allRightsReserved: 'Todos los derechos reservados.',
    },
    about: {
      title: 'Sobre Nosotros',
      subtitle: 'Nos apasiona la tecnología y estamos comprometidos a proporcionar reseñas honestas y profundas.',
      mission: 'Nuestra Misión',
      missionText: 'Ayudar a desarrolladores y equipos a tomar decisiones informadas sobre las herramientas que usan.',
      team: 'Nuestro Equipo',
      contact: 'Contáctanos',
      whyWeStarted: 'Por qué creamos esta plataforma',
      whyWeStartedText1: 'Fundada en 2024 por un grupo de desarrolladores y estrategas digitales, TechToolReviews nació de la frustración. Las listas de "mejor software" que vimos en línea estaban llenas de recomendaciones obsoletas y contenido de afiliados de baja calidad.',
      whyWeStartedText2: 'Decidimos construir el recurso que queríamos ver: técnicamente profundo, rigurosamente probado, y siempre enfocado en la "perspectiva 2026"—mirando hacia dónde van las herramientas, no solo dónde han estado.',
      toolsTested: 'Herramientas Probadas',
      monthlyReaders: 'Lectores Mensuales',
      techToolStandard: 'El Estándar TechTool',
      rigorousTesting: 'Pruebas Rigurosas',
      rigorousTestingText: 'No solo leemos el marketing. Configuramos entornos de producción reales y probamos flujos de trabajo durante al menos 30 días antes de publicar.',
      unbiasedReviews: 'Reseñas Imparciales',
      unbiasedReviewsText: 'Nuestro equipo editorial está separado de nuestro equipo de negocios. Nuestras calificaciones no pueden ser compradas ni influenciadas por socios externos.',
      constantUpdates: 'Actualizaciones Constantes',
      constantUpdatesText: 'El software se mueve rápido. Actualizamos nuestras guías principales cada 90 días para asegurar que nunca leas consejos obsoletos.',
    },
    category: {
      notFound: 'Categoría No Encontrada',
      notFoundText: 'El sector arquitectónico solicitado no existe.',
      returnHome: 'Volver al Centro de Control',
      database: 'Base de Datos',
      sector: 'Sector',
      activeBenchmarks: 'Benchmarks Activos',
      reviewsVerified: 'RESEÑAS VERIFICADAS',
      pendingTitle: 'Análisis Profundos Pendientes',
      pendingText: 'Nuestro equipo de ingeniería está probando herramientas en este sector. Los informes 2026 están programados para el próximo trimestre.',
      getNotified: 'Recibir Notificación',
      alternativeSectors: 'Sectores Alternativos',
      exploreDatabase: 'Explorar Base de Datos',
    },
    common: {
      loading: 'Cargando...',
      error: 'Error',
      tryAgain: 'Intentar de nuevo',
      learnMore: 'Saber más',
      getStarted: 'Comenzar',
      seeAll: 'Ver todo',
      readAnalysis: 'Leer Análisis Técnico',
    },
    techAdvisor: {
      poweredBy: 'Motor Impulsado por Gemini',
      title: 'Constructor de Stack IA',
      description: 'Describe tu idea de negocio en pocas palabras. Nuestra IA analizará las últimas tendencias tech de 2026 y generará un blueprint de infraestructura listo para producción al instante.',
      placeholder: "ej., 'Un SaaS de edición de video para creadores de TikTok'",
      generateStack: 'Generar Stack',
      minChars: 'Por favor proporciona una descripción más detallada (al menos 10 caracteres).',
      failedGenerate: 'Error al generar el stack. El servicio de IA puede estar temporalmente no disponible.',
      unexpectedError: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.',
      strategy: 'La Estrategia 2026',
      frontend: 'Frontend',
      backend: 'Backend',
      database: 'Base de Datos',
      hosting: 'Hosting',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      software: 'Logiciels',
      techStacks: 'Stacks Tech',
      aiTools: 'Outils IA',
      architecture: 'Architecture',
      about: 'À propos',
      subscribe: "S'abonner",
      subscribeNow: "S'abonner maintenant",
    },
    home: {
      heroTitle: "L'Avenir des Avis Tech",
      heroSubtitle: 'Analyses approfondies et comparaisons des outils qui façonnent le paysage numérique de 2026.',
      featuredArticles: 'Articles en Vedette',
      viewAll: 'Voir tout',
      readMore: 'Lire la suite',
      latestReviews: 'Derniers Avis',
      joinNewsletter: 'Rejoignez notre newsletter',
      newsletterDesc: 'Recevez des audits hebdomadaires d\'outils techniques et des informations exclusives.',
      emailPlaceholder: 'votre@email.fr',
      subscribeBtn: "S'abonner",
      categories: 'Catégories',
    },
    article: {
      backHome: "Retour à l'accueil",
      minRead: 'min de lecture',
      technicalEditor: 'Éditeur Technique',
      verifiedFor: 'Vérifié pour 2026',
      partnerRecommendation: 'Recommandation Partenaire',
      staffPick: 'Choix de la Rédaction',
      specialDeal: 'Offre Spéciale',
      editorsTopPick: 'Top Choix de l\'Éditeur 2026',
      limitedOffer: 'Offre Limitée',
      freeTrial: 'Essai Gratuit',
      noCreditCard: 'Sans Carte Bancaire',
      cancelAnytime: 'Annulez à Tout Moment',
      claimFreeTrial: 'Obtenez Votre Essai Gratuit',
      watchDemo: 'Voir la Démo',
      reviews: 'avis',
      professionalsStarted: 'professionnels ont commencé cette semaine',
      peopleViewing: 'personnes consultent cette offre en ce moment',
      moneyBackGuarantee: 'Garantie satisfait ou remboursé de 30 jours',
      performanceMatrix: 'Matrice de Performance',
      pros: 'Avantages',
      cons: 'Inconvénients',
      postNotFound: 'Article non trouvé',
    },
    subscribe: {
      joinInsiderList: 'Rejoindre la Liste Insider',
      weeklyInsights: 'Recevez des audits hebdomadaires d\'outils techniques et des informations exclusives.',
      subscribing: 'Abonnement en cours...',
      subscribeSuccess: 'Abonnement réussi !',
      close: 'Fermer',
      connectionError: 'Erreur de connexion. Veuillez réessayer.',
      invalidEmail: 'Veuillez entrer une adresse e-mail valide.',
    },
    footer: {
      description: 'L\'autorité mondiale sur les outils techniques et les comparaisons de logiciels pour le paysage numérique de 2026.',
      quickLinks: 'Liens Rapides',
      resources: 'Ressources',
      blog: 'Blog',
      newsletter: 'Newsletter',
      documentation: 'Documentation',
      support: 'Support',
      legal: 'Mentions Légales',
      privacy: 'Politique de Confidentialité',
      terms: 'Conditions d\'Utilisation',
      cookies: 'Politique des Cookies',
      allRightsReserved: 'Tous droits réservés.',
    },
    about: {
      title: 'À Propos de Nous',
      subtitle: 'Nous sommes passionnés par la technologie et engagés à fournir des avis honnêtes et approfondis.',
      mission: 'Notre Mission',
      missionText: 'Aider les développeurs et les équipes à prendre des décisions éclairées sur leurs outils.',
      team: 'Notre Équipe',
      contact: 'Contactez-nous',
      whyWeStarted: 'Pourquoi nous avons créé cette plateforme',
      whyWeStartedText1: 'Fondée en 2024 par un groupe de développeurs et stratèges numériques, TechToolReviews est née de la frustration. Les listes "meilleurs logiciels" que nous voyions en ligne étaient remplies de recommandations obsolètes et de contenu affilié de mauvaise qualité.',
      whyWeStartedText2: 'Nous avons décidé de créer la ressource que nous voulions voir : techniquement approfondie, rigoureusement testée, et toujours axée sur la "perspective 2026"—regardant où vont les outils, pas seulement où ils ont été.',
      toolsTested: 'Outils Testés',
      monthlyReaders: 'Lecteurs Mensuels',
      techToolStandard: 'Le Standard TechTool',
      rigorousTesting: 'Tests Rigoureux',
      rigorousTestingText: 'Nous ne lisons pas que le marketing. Nous configurons de vrais environnements de production et testons les workflows pendant au moins 30 jours avant de publier.',
      unbiasedReviews: 'Avis Impartiaux',
      unbiasedReviewsText: 'Notre équipe éditoriale est séparée de notre équipe commerciale. Nos notes ne peuvent être achetées ni influencées par des partenaires externes.',
      constantUpdates: 'Mises à Jour Constantes',
      constantUpdatesText: 'Le logiciel évolue vite. Nous mettons à jour nos guides principaux tous les 90 jours pour que vous ne lisiez jamais de conseils obsolètes.',
    },
    category: {
      notFound: 'Catégorie Non Trouvée',
      notFoundText: 'Le secteur architectural demandé n\'existe pas.',
      returnHome: 'Retour au Centre de Contrôle',
      database: 'Base de Données',
      sector: 'Secteur',
      activeBenchmarks: 'Benchmarks Actifs',
      reviewsVerified: 'AVIS VÉRIFIÉS',
      pendingTitle: 'Analyses Approfondies en Attente',
      pendingText: 'Notre équipe d\'ingénierie teste actuellement des outils dans ce secteur. Les rapports 2026 sont prévus pour le prochain trimestre.',
      getNotified: 'Être Notifié',
      alternativeSectors: 'Secteurs Alternatifs',
      exploreDatabase: 'Explorer la Base de Données',
    },
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      tryAgain: 'Réessayer',
      learnMore: 'En savoir plus',
      getStarted: 'Commencer',
      seeAll: 'Voir tout',
      readAnalysis: 'Lire l\'Analyse Technique',
    },
    techAdvisor: {
      poweredBy: 'Moteur Propulsé par Gemini',
      title: 'Constructeur de Stack IA',
      description: 'Décrivez votre idée d\'entreprise en quelques mots. Notre IA analysera les dernières tendances tech de 2026 et générera instantanément un blueprint d\'infrastructure prêt pour la production.',
      placeholder: "ex., 'Un SaaS de montage vidéo pour les créateurs TikTok'",
      generateStack: 'Générer le Stack',
      minChars: 'Veuillez fournir une description plus détaillée (au moins 10 caractères).',
      failedGenerate: 'Échec de la génération du stack. Le service IA peut être temporairement indisponible.',
      unexpectedError: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
      strategy: 'La Stratégie 2026',
      frontend: 'Frontend',
      backend: 'Backend',
      database: 'Base de Données',
      hosting: 'Hébergement',
    },
  },
};

export const languageNames: Record<Language, string> = {
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
};

export const languageFlags: Record<Language, string> = {
  en: '🇬🇧',
  de: '🇩🇪',
  es: '🇪🇸',
  fr: '🇫🇷',
};
