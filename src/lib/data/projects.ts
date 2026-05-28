// src/lib/data/projects.ts

export interface ProjectMedia {
  type: 'image' | 'video';
  src: string;
  poster?: string;
  span?: 1 | 2;
  caption?: string;
}

export interface Project {
  id: number;
  slug: string;
  client: string;
  logo: string;
  title: string;
  tags: string[];
  description: string;
  color: string;
  image: string;
  video?: string;
  media?: ProjectMedia[];
  challenge?: string;
  outcome?: string;
  role?: string;
  year?: string;
  url?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 8,
    slug: 'ofelia',
    client: 'Ofelia',
    logo: '/assets/ofelia.svg',
    title: 'Ofelia',
    tags: ['IA Conversationnelle', 'Design System', 'SaaS', 'Claude Code', 'Storybook'],
    description:
      'Acteur historique du **BPA** (Business Process Automation) d\'entreprise depuis 15 ans, **Bonitasoft** avait une nouvelle ambition : créer **Ofelia**, une suite logicielle d\'orchestration IA gouvernée.\n\nJe suis intervenu sur ce projet en tant que **Founding Designer**, seul à bord pour tout construire à partir d\'une page blanche. Le cœur du produit, **Ofelia Agentic**, est un assistant IA conçu pour s\'intégrer directement dans **Slack et Teams**. L\'objectif ? Ne pas imposer un énième outil aux équipes, mais faire vivre l\'IA là où elles collaborent déjà au quotidien.',
    challenge:
      'L\'enjeu UX dépassait la simple création d\'écrans. Il ne s\'agissait pas de dessiner un chatbot classique, mais d\'intégrer une véritable **collègue virtuelle** capable d\'**orchestrer des workflows complexes** à partir d\'une simple conversation.\n\nTrès vite, les limites de Figma sont apparues : les **interfaces statiques sont inadaptées** pour modéliser des **interactions agentiques** mouvantes. La tech avançait à toute vitesse, le design devait suivre le même tempo. Il fallait supprimer la friction entre la maquette et l\'ingénierie.',
    outcome:
      'Après avoir posé les bases de l\'UX et du Design System, j\'ai pivoté vers un rôle pur de **Design Engineer** :\n\n• Zéro maquette morte — J\'ai totalement abandonné le **pixel-perfect statique** pour itérer directement dans le code de production.\n• **Workflow Engineering** — J\'utilise désormais **Claude Code** pour travailler directement sur Git et dans Storybook, en ouvrant mes propres Pull Requests.\n• Zéro perte d\'information — Mes PR sont revues par un dev front avant la mise en prod. Le "hand-off" n\'existe plus.\n\nL\'impact ? Notre rythme d\'exécution est devenu **10x plus rapide**. Le produit a été co-construit, testé et validé en temps réel avec nos clients prospects, éliminant l\'effet tunnel specs/design/dev.',
    color: '#706bfe',
    image: '',
    video: '/assets/ofelia.mp4',
    media: [
      { type: 'video', src: '/assets/ofelia-2.mp4' },
      { type: 'video', src: '/assets/ofelia-3.mp4' }
    ],
    role: 'Product Design Engineer (Founding Designer)',
    year: '2025 – 2026'
  },
  {
    id: 1,
    slug: 'ipify',
    client: 'iPify',
    logo: '/assets/ipify.png',
    title: 'iPify',
    tags: ['B2B SaaS', 'LegalTech', 'Design System & Tokens', 'IA Conversationnelle & Générative'],
    description:
      'iPify est une plateforme **SaaS B2B** pointue évoluant dans le secteur de la **LegalTech**, spécifiquement dédiée à la **gestion internationale des portefeuilles de brevets**.\n\nLa plateforme s\'adresse à des professionnels du droit (juristes, avocats) qui manipulent quotidiennement un volume massif de données ultra-complexes et réglementées. Ma mission : **moderniser l\'expérience utilisateur** tout en concevant les nouvelles briques d\'**Intelligence Artificielle** du produit.',
    challenge:
      'Le défi était double : structurer l\'existant pour préparer la croissance, et **intégrer l\'IA de manière transparente** dans des workflows métiers très exigeants.\n\nDans un environnement SaaS B2B aussi dense, l\'interface ne pardonne pas. Il fallait rationaliser la production design et dev, tout en imaginant comment un **"agent IA"** pouvait assister les équipes juridiques sans créer de friction, ni ressembler à un gadget superflu.',
    outcome:
      'J\'ai mené de front l\'architecture de l\'interface et l\'innovation produit en me concentrant sur trois piliers :\n\n• **Scalabilité UI** (Design System & Tokens) — Pilotage de la refonte complète du Design System. Mise en place de l\'architecture des **Design Tokens**, création des composants, rédaction de la documentation et instauration d\'une vraie gouvernance pour aligner le design et la tech.\n• **Recherche augmentée** (IA Conversationnelle) — Conception d\'un agent IA intégré nativement au portail. Il permet désormais aux utilisateurs d\'interroger la totalité de leur base de brevets internationaux en **langage naturel** (Natural Language Query).\n• **Gains de productivité** (IA Générative) — Design de features génératives visant à automatiser les tâches les plus chronophages des juristes : rédaction assistée et traduction de documents légaux complexes.\n\nL\'impact ? Une interface devenue prédictible et scalable grâce aux tokens, et un produit qui ne se contente plus de stocker des brevets, mais qui agit comme un véritable **assistant juridique automatisé**.',
    color: '#00857e',
    image: '',
    role: 'Senior Product Designer',
    year: '2023 – 2024',
    media: [
      { type: 'image', src: '/assets/portfolio-ipify-ai.png', span: 2, caption: 'IA Conversationnelle' },
      { type: 'image', src: '/assets/portfolio-ipify-interface.png', span: 2, caption: 'Portail & Design System' }
    ]
  },
  {
    id: 3,
    slug: 'aldebaran',
    client: 'Aldebaran',
    logo: '/assets/aldebaran.svg',
    title: 'Aldebaran Robotics',
    tags: ['Human-Robot Interaction', 'UX Embarquée', 'VUI (Voice) & Sound Design', 'DeepTech'],
    description:
      'Bien avant que l\'IA ne devienne un standard de l\'industrie logicielle, j\'ai passé **7 ans** au cœur de la **DeepTech** chez Aldebaran. J\'ai conçu les comportements et les interactions de **NAO et Pepper**, les leaders mondiaux de la **robotique humanoïde**.\n\nMon terrain de jeu n\'était pas un navigateur web, mais le **monde physique**. Mes parcours interactifs et multi-langues devaient fonctionner partout : magasins, gares, aéroports, événements, en intérieur comme en extérieur.',
    challenge:
      'Concevoir pour un robot, c\'est concevoir pour l\'imprévisible. L\'interface n\'est plus un écran cliquable, mais un **corps dans l\'espace**.\n\nLe défi quotidien était de créer des **interactions humain-robot (HRI)** qui soient immédiatement compréhensibles et accessibles à tous les publics. Il fallait réussir à engager une **conversation naturelle** dans des environnements bruyants et chaotiques, tout en composant avec les contraintes matérielles strictes et le traitement temps-réel d\'une IA alors à ses balbutiements.',
    outcome:
      'Pour rendre l\'expérience fluide et vivante, j\'ai dû sortir des grilles traditionnelles et orchestrer une **UX multimodale**, mêlant design d\'interface embarquée, comportements physiques, scénarisation voix (**VUI**) et sound design.\n\n• **Déploiement massif** — Mes applications ont été embarquées sur des milliers de robots expédiés dans **plus de 70 pays**.\n• **Traction B2B2C** — Des expériences utilisées par **plusieurs millions de personnes** chaque mois dans des contextes de Retail et d\'Hospitality de pointe.\n• **Pionnier de l\'IA** — Ces 7 années passées à "humaniser" la logique d\'une machine ont posé les fondations de mon expertise actuelle. J\'y ai appris la mécanique profonde du **design conversationnel**, bien avant l\'ère des LLMs.',
    color: '#00857e',
    image: '/assets/portfolio-aldebaran.png',
    role: 'Designer d\'Interaction',
    year: '2013 – 2020'
  },
  {
    id: 4,
    slug: 'credit-agricole',
    client: 'Crédit Agricole',
    logo: '/assets/ca.png',
    title: 'Crédit Agricole',
    tags: ['FinTech', 'App Mobile (30M+ MAU)', 'Design System Multi-Marques', 'Design Tokens'],
    description:
      'Intervenir sur le design du Crédit Agricole pendant **3 ans**, c\'est concevoir à l\'échelle de l\'un des **écosystèmes digitaux les plus massifs d\'Europe**. De 2021 à 2024, j\'ai piloté l\'UI sur les trois piliers de la banque : le site institutionnel, l\'application grand public **"Ma Banque"**, et les outils internes dédiés aux conseillers.\n\nDans ce contexte de haute exigence, j\'ai agi en tant que **Lead UI** et **Référent Design System**, assurant le pont permanent entre les équipes de conception et d\'ingénierie.',
    challenge:
      'Le défi principal n\'était pas seulement esthétique, mais **systémique**. Il fallait maintenir une **cohérence visuelle absolue** sur un écosystème tentaculaire (Web, App, Back-office) opéré par des dizaines d\'équipes distribuées.\n\nLa complexité propre au Crédit Agricole (de multiples caisses régionales avec leurs spécificités) et les contraintes de sécurité bancaire exigeaient une **industrialisation parfaite** du design. Il fallait concevoir vite, bien, et sans jamais casser l\'existant.',
    outcome:
      'Pour soutenir cette échelle, j\'ai axé mon travail sur la gouvernance, la rigueur UI et l\'accompagnement des développeurs :\n\n• **Design System & Tokens** — Pilotage de l\'amélioration continue du Design System groupe. L\'intégration poussée des **Design Tokens** a été la clé pour gérer la déclinaison **multi-marques** régionale et assurer des mises à jour globales sans friction.\n• **Design à grande échelle** — Conception des maquettes interactives et des parcours de l\'application "Ma Banque", avec un niveau d\'exigence (accessibilité, performance) taillé pour le très grand public.\n• **Delivery & QA** — Du prototypage jusqu\'à la mise en production, accompagnement des développeurs au quotidien et recettes fonctionnelles (QA) pour garantir une implémentation au pixel près.\n\nL\'impact ? Un Design System adopté par **plus de 15 équipes produit** et une application **"Ma Banque"** unifiée pour **plus de 30 millions d\'utilisateurs mensuels**.',
    color: '#00857e',
    image: '',
    role: 'Lead UI & Référent Design System',
    year: '2021 – 2024',
    media: [
      { type: 'image', src: '/assets/portfolio-ca-portail-client.png', span: 2, caption: 'Portail client credit-agricole.fr' },
      { type: 'image', src: '/assets/portfolio-ca-app-mobile.png', span: 1, caption: 'App mobile Ma Banque' },
      { type: 'image', src: '/assets/portfolio-ca-design-system.png', span: 1, caption: 'Design System' }
    ]
  },
  {
    id: 7,
    slug: 'highlight',
    client: 'Highlight',
    logo: '/assets/highlight.png',
    title: 'Highlight',
    tags: ['B2B SaaS', 'Marque Blanche (White-label)', 'Design System Multi-thème', 'Variables & Design Tokens'],
    description:
      'Highlight est une plateforme **SaaS B2B** conçue pour être distribuée exclusivement en **marque blanche**. Ma mission : concevoir et implémenter leur **Design System de A à Z**, en partant de l\'idéation jusqu\'à l\'architecture technique exploitable par les développeurs.\n\nDans un modèle économique basé sur la **marque blanche**, l\'interface du produit est le premier argument de vente : elle doit pouvoir s\'effacer totalement pour épouser l\'identité de chaque nouveau client.',
    challenge:
      'Le défi métier et technique était particulièrement complexe : comment créer un **Design System unique**, qui soit suffisamment rigoureux pour éviter la **dette technique**, mais assez élastique pour absorber **N marques blanches** aux identités visuelles radicalement différentes ?\n\nIl fallait à tout prix éviter le piège classique : multiplier les fichiers, dupliquer le code et rendre la maintenance de la plateforme impossible à chaque nouvelle feature.',
    outcome:
      'Pour résoudre cette équation de scalabilité, j\'ai construit une **architecture "multi-thème"** de dernière génération :\n\n• **Architecture orientée Tokens** — Structuration de l\'intégralité de l\'UI autour de **Design Tokens** et de variables sémantiques (couleurs, typographies, espacements, effets/élévations).\n• **Scalabilité par les "Modes"** — Exploitation de la pleine puissance des modes Figma pour créer un système où chaque marque cliente agit comme un **"calque" de personnalisation**. La structure reste identique, seul l\'habillage visuel bascule dynamiquement.\n• **Gouvernance & Implémentation** — Alignement total avec l\'ingénierie pour s\'assurer que l\'architecture des tokens dans Figma reflète exactement l\'architecture du code (CSS/JSON).\n\nL\'impact ? Le **Time-to-Market** pour déployer une nouvelle marque blanche est passé de plusieurs semaines d\'intégration à **quelques jours seulement**.',
    color: '#00857e',
    image: '/assets/portfolio-highlight-design-sytem.png',
    role: 'Senior Product Designer & Architecte Design System',
    year: '2024'
  }
];
