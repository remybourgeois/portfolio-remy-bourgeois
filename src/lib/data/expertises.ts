// src/lib/data/expertises.ts
export interface Expertise {
  id: number;
  title: string;
  icon: string;
  desc: string;
}

export const EXPERTISES: Expertise[] = [
  {
    id: 1,
    title: 'Design System & Tokens',
    icon: 'LayoutIcon',
    desc: 'Architecture scalable pour produits complexes.'
  },
  {
    id: 2,
    title: 'AI Assistants & Conversational UX',
    icon: 'MessageSquare',
    desc: 'Concevoir des assistants et interactions intelligentes pour des workflows métier.'
  },
  {
    id: 3,
    title: 'SaaS B2B Complexe',
    icon: 'Activity',
    desc: 'Simplifier les workflows denses et techniques.'
  },
  {
    id: 4,
    title: 'Strategic Design',
    icon: 'Zap',
    desc: 'Aligner vision produit, enjeux business et expérience utilisateur.'
  },
  {
    id: 5,
    title: 'Vibe Coding & Engineering',
    icon: 'Code',
    desc: 'Supprimer le hand-off et les maquettes mortes en itérant directement dans le code (Git, Claude Code, Storybook).'
  },
  {
    id: 6,
    title: 'Interaction H-M',
    icon: 'Cpu',
    desc: "Créer la symbiose entre l'humain et la machine — héritée de 7 ans en robotique humanoïde."
  }
];
