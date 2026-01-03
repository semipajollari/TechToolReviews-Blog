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
  };
  // Common
  common: {
    loading: string;
    error: string;
    tryAgain: string;
    learnMore: string;
    getStarted: string;
    seeAll: string;
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
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      tryAgain: 'Try Again',
      learnMore: 'Learn More',
      getStarted: 'Get Started',
      seeAll: 'See All',
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
    },
    common: {
      loading: 'Wird geladen...',
      error: 'Fehler',
      tryAgain: 'Erneut versuchen',
      learnMore: 'Mehr erfahren',
      getStarted: 'Loslegen',
      seeAll: 'Alle anzeigen',
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
    },
    common: {
      loading: 'Cargando...',
      error: 'Error',
      tryAgain: 'Intentar de nuevo',
      learnMore: 'Saber más',
      getStarted: 'Comenzar',
      seeAll: 'Ver todo',
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
    },
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      tryAgain: 'Réessayer',
      learnMore: 'En savoir plus',
      getStarted: 'Commencer',
      seeAll: 'Voir tout',
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
