// src/lib/data/services.ts
import type { IconName } from '$lib/components/Icons.svelte';

export interface Service {
  id: number;
  title: string;
  icon: IconName;
  /** Résumé court, repris tel quel dans le JSON-LD `Service`. */
  summary: string;
  /** Livrables concrets. Un moteur génératif cite plus volontiers une liste. */
  deliverables: string[];
  /** Étude de cas qui illustre la prestation. */
  caseStudy?: { label: string; slug: string };
}

export const SERVICES: Service[] = [
  {
    id: 1,
    title: 'Design System & Design Tokens',
    icon: 'LayoutIcon',
    summary:
      "Construire ou reprendre un design system qui tient la charge : architecture de tokens sémantiques, composants documentés, gouvernance partagée entre design et ingénierie.",
    deliverables: [
      'Audit de l’existant et plan de convergence',
      'Architecture de design tokens (couleurs, typographie, espacements, élévations)',
      'Bibliothèque de composants Figma alignée sur le code',
      'Documentation et règles de contribution',
      'Déclinaison multi-marques ou multi-thème'
    ],
    caseStudy: { label: 'Highlight — design system multi-thème', slug: 'highlight' }
  },
  {
    id: 2,
    title: 'Assistants IA & UX conversationnelle',
    icon: 'MessageSquare',
    summary:
      "Concevoir des assistants qui s’intègrent aux workflows métier existants plutôt que d’ajouter un outil de plus : parcours conversationnels, états d’incertitude, garde-fous et reprise en main humaine.",
    deliverables: [
      'Cadrage des cas d’usage et des limites de l’agent',
      'Parcours conversationnels et modèles d’interaction agentique',
      'Design des états d’erreur, d’attente et de validation humaine',
      'Intégration dans les outils déjà utilisés (Slack, Teams, portail métier)',
      'Prototypes testables avec de vrais utilisateurs'
    ],
    caseStudy: { label: 'Ofelia — assistant IA agentique', slug: 'ofelia' }
  },
  {
    id: 3,
    title: 'SaaS B2B complexe',
    icon: 'Activity',
    summary:
      "Rendre lisibles des interfaces denses — tableaux massifs, workflows réglementés, back-offices métier — sans sacrifier la puissance dont les utilisateurs experts ont besoin.",
    deliverables: [
      'Recherche utilisateur auprès d’experts métier',
      'Architecture de l’information et modèles de navigation',
      'Design des vues à forte densité de données',
      'Parcours de bout en bout, du prototype à la recette'
    ],
    caseStudy: { label: 'iPify — SaaS B2B LegalTech', slug: 'ipify' }
  },
  {
    id: 4,
    title: 'Design Engineering',
    icon: 'Code',
    summary:
      "Supprimer le hand-off : j’itère directement dans le code de production, j’ouvre mes propres Pull Requests et elles sont revues par un développeur front avant mise en production.",
    deliverables: [
      'Implémentation des composants en code (Storybook, Git)',
      'Pull Requests documentées, revues par l’équipe front',
      'Prototypes fonctionnels plutôt que maquettes statiques',
      'Mise en place du workflow design-dans-le-code avec l’équipe'
    ],
    caseStudy: { label: 'Ofelia — du pixel-perfect aux Pull Requests', slug: 'ofelia' }
  },
  {
    id: 5,
    title: 'Conseil & design stratégique',
    icon: 'Zap',
    summary:
      "Aligner vision produit, contraintes techniques et expérience utilisateur — en amont, quand les décisions coûtent encore peu cher à changer.",
    deliverables: [
      'Audit UX et revue d’architecture produit',
      'Ateliers de cadrage et de priorisation',
      'Recommandations chiffrées et feuille de route design',
      'Accompagnement au recrutement et à la structuration d’une équipe design'
    ]
  },
  {
    id: 6,
    title: 'Interaction homme-machine',
    icon: 'Cpu',
    summary:
      "Concevoir pour des systèmes qui ne sont pas des écrans : robots, voix, son, présence physique. Un terrain rare, hérité de 7 ans en robotique humanoïde.",
    deliverables: [
      'Design d’interactions multimodales (écran, voix, comportement, son)',
      'Scénarisation vocale (VUI) et sound design',
      'UX embarquée sous contraintes matérielles',
      'Tests en environnement réel et bruyant'
    ],
    caseStudy: { label: 'Aldebaran — NAO et Pepper', slug: 'aldebaran' }
  }
];

export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Format Q/R : c'est celui que les moteurs génératifs reprennent le plus
 * volontiers, parce que chaque réponse est autonome et se cite hors contexte.
 * Les réponses restent factuelles — aucune ne promet de délai ou de tarif qui
 * ne soit pas vérifiable.
 */
export const FAQ: FaqItem[] = [
  {
    q: 'Sur quels types de projets Rémy Bourgeois intervient-il ?',
    a: "Principalement des produits SaaS B2B à forte complexité métier : design systems, assistants IA conversationnels, back-offices et interfaces à forte densité de données. Les secteurs couverts incluent la FinTech (Crédit Agricole), la LegalTech (iPify), l’automatisation de processus (Bonitasoft / Ofelia) et la robotique (Aldebaran). Les missions vont de la startup à la grande entreprise."
  },
  {
    q: 'Qu’est-ce qu’un Design Engineer, et en quoi est-ce différent d’un product designer ?',
    a: "Un product designer livre des maquettes qu’une équipe de développement implémente ensuite. Un Design Engineer implémente lui-même dans le code de production : il ouvre ses propres Pull Requests, travaille dans Git et Storybook, et fait relire son code par un développeur front avant la mise en production. L’étape de hand-off — et la perte d’information qu’elle produit — disparaît. Sur le projet Ofelia, ce mode de travail a remplacé intégralement les maquettes statiques."
  },
  {
    q: 'Comment intégrer une IA conversationnelle dans un produit existant ?',
    a: "En partant des workflows déjà en place plutôt que de l’interface. L’approche retenue sur Ofelia comme sur iPify consiste à greffer l’assistant là où les équipes travaillent déjà — Slack, Teams, ou le portail métier — au lieu d’ajouter un outil supplémentaire. Le travail de design porte alors moins sur la bulle de conversation que sur les états d’incertitude, les garde-fous et les points de reprise en main humaine."
  },
  {
    q: 'Travaillez-vous à distance ?',
    a: "Oui. Les missions se font à distance, avec des déplacements sur site selon les besoins du projet. Le point d’attache est Lyon, et les interventions couvrent la France entière ainsi que des équipes distribuées à l’international, en français comme en anglais."
  },
  {
    q: 'Combien de temps faut-il pour mettre en place un design system ?',
    a: "Cela dépend de la maturité de l’existant et du nombre d’équipes à embarquer — il n’y a pas de forfait générique. Ce qui est constant, c’est l’ordre : l’architecture de tokens d’abord, les composants ensuite, la gouvernance en parallèle. Chez Highlight, cette architecture a ramené le déploiement d’une nouvelle marque blanche de plusieurs semaines à quelques jours."
  },
  {
    q: 'Quels sont vos tarifs et comment démarrer ?',
    a: "Le tarif dépend du format — régie ou forfait — et de la durée de la mission. Le plus simple est d’écrire un mot décrivant le contexte et l’objectif : la réponse indique la faisabilité, le format adapté et un devis. Les échanges se font par e-mail ou via LinkedIn."
  }
];
