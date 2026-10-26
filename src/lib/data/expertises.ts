// src/lib/data/expertises.ts
import type { IconName } from '$lib/components/Icons.svelte';

export interface Expertise {
  id: number;
  title: string;
  icon: IconName;
  desc: string;
}

export const EXPERTISES: Expertise[] = [
  {
    id: 1,
    title: 'Design systems et tokens',
    icon: 'LayoutIcon',
    desc: "Une seule source de vérité : le code. Figma garde sa place, mais ne la définit plus."
  },
  {
    id: 2,
    title: 'Assistants et agents IA',
    icon: 'MessageSquare',
    desc: "Ce qui se passe quand la machine se trompe, et comment l'humain reprend la main."
  },
  {
    id: 3,
    title: 'SaaS B2B complexe',
    icon: 'Activity',
    desc: 'Rendre lisibles des workflows denses, pour des métiers qui les connaissent mieux que moi.'
  },
  {
    id: 4,
    title: 'Design stratégique',
    icon: 'Zap',
    desc: "Passer du « comment on construit » au « est-ce que ça vaut la peine »."
  },
  {
    id: 5,
    title: 'Conception dans le code',
    icon: 'Code',
    desc: 'Git, Storybook, Claude Code. Des règles vérifiées à chaque PR plutôt qu\'une documentation que personne ne relit.'
  },
  {
    id: 6,
    title: 'Interaction homme-machine',
    icon: 'Cpu',
    desc: "Sept ans sur des robots qui devaient se rendre compréhensibles à des gens qui ne les avaient jamais vus."
  }
];
