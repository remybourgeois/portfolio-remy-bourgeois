// src/lib/data/projects.ts
export interface Project {
  id: number;
  client: string;
  logo: string;
  title: string;
  tags: string[];
  description: string;
  color: string;
  image: string;
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    client: 'iPify',
    logo: '/assets/ipify.png',
    title: 'iPify',
    tags: ['SaaS', 'IA', 'LegalTech', 'B2B', 'Interfaces complexes'],
    description:
      "UX de solutions B2B SaaS complexes en LegalTech. Refonte Design System, IA conversationnelle & features génératives pour optimiser la gestion internationale des brevets.",
    color: '#00857e',
    image: '/assets/portfolio-ipify-interface.png'
  },
  {
    id: 2,
    client: 'iPify',
    logo: '/assets/ipify.png',
    title: 'iPify',
    tags: ['SaaS', 'IA', 'LegalTech', 'B2B', 'Interfaces complexes'],
    description:
      "UX de solutions B2B SaaS complexes en LegalTech. Refonte Design System, IA conversationnelle & features génératives pour optimiser la gestion internationale des brevets.",
    color: '#00857e',
    image: '/assets/portfolio-ipify-ai.png'
  },
  {
    id: 3,
    client: 'Aldebaran',
    logo: '/assets/aldebaran.svg',
    title: 'Aldebaran Robotics',
    tags: ['Robotique Humanoïde', 'IA', 'Interaction H-M'],
    description:
      "Designer d'interaction sur les robots NAO & Pepper, leaders mondiaux de la robotique humanoïde.\nConception d'applications et de parcours multi-langues, utilisés par des millions d'utilisateurs chaque mois dans des environnements variés : magasins, gares, aéroports, événements, intérieur comme extérieur.\nTravail mêlant UX embarquée, comportements interactifs, scénarisation et sound design pour créer des expériences naturelles et engageantes.",
    color: '#00857e',
    image: '/assets/portfolio-aldebaran.png'
  },
  {
    id: 4,
    client: 'Crédit Agricole',
    logo: '/assets/ca.png',
    title: 'Crédit Agricole.fr Portail client',
    tags: ['Site Web', 'Bank', 'B2C'],
    description:
      "Création des maquettes interactives UI pour le site officiel Credit-Agricole.fr. Lead UI, garant de la cohérence et du respect du design system sur les écrans du Crédit Agricole.",
    color: '#00857e',
    image: '/assets/portfolio-ca-portail-client.png'
  },
  {
    id: 5,
    client: 'Crédit Agricole',
    logo: '/assets/ca.png',
    title: 'Crédit Agricole.fr Design System',
    tags: ['Design System', 'Bank', 'Pilotage', 'Design Tokens'],
    description:
      "Lead UI. Amélioration continue du Design System client et collaborateur. Utilisation quotidienne des Design Tokens.",
    color: '#00857e',
    image: '/assets/portfolio-ca-design-system.png'
  },
  {
    id: 6,
    client: 'Crédit Agricole',
    logo: '/assets/ca.png',
    title: 'Crédit Agricole.fr Application mobile "Ma Banque"',
    tags: ['App mobile', 'Bank', 'B2C'],
    description:
      'Création des maquettes interactives de l\'application mobile "Ma Banque" utilisée par des dizaines de millions d\'utilisateurs chaque mois.',
    color: '#00857e',
    image: '/assets/portfolio-ca-app-mobile.png'
  },
  {
    id: 7,
    client: 'Highlight',
    logo: '/assets/highlight.png',
    title: 'Highlight',
    tags: ['SaaS', 'Design System', 'Design Tokens'],
    description:
      "Plateforme SaaS en marque blanche. Création du Design System. Création des modes / variables pour l'entreprise et ses différentes marques blanches.",
    color: '#00857e',
    image: '/assets/portfolio-highlight-design-sytem.png'
  }
];
