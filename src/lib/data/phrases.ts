// src/lib/data/phrases.ts
export interface PoeticPhrase {
  id: number;
  text: string;
  shape: string;
  icon: string;
  anim: string;
}

export const POETIC_PHRASES: PoeticPhrase[] = [
  {
    id: 1,
    text: "Accorder l'humain et l'IA",
    shape: 'torus',
    icon: 'RefreshCw',
    anim: 'animate-spin-slow'
  },
  {
    id: 2,
    text: 'Structurer le chaos en clarté',
    shape: 'cube',
    icon: 'LayoutIcon',
    anim: 'animate-pulse-slow'
  },
  {
    id: 3,
    text: 'Créer des systèmes qui respirent',
    shape: 'breathing',
    icon: 'Activity',
    anim: 'animate-pulse'
  },
  {
    id: 4,
    text: 'Donner forme aux intentions',
    shape: 'spiral',
    icon: 'BrainCircuit',
    anim: 'animate-pulse-slow'
  },
  {
    id: 5,
    text: 'Sculpter la complexité en simplicité',
    shape: 'diamond',
    icon: 'Code',
    anim: ''
  },
  {
    id: 6,
    text: "Rendre l'interaction naturelle",
    shape: 'wave',
    icon: 'Wifi',
    anim: 'animate-pulse'
  },
  {
    id: 7,
    text: "Orchestrer l'intelligence",
    shape: 'ring',
    icon: 'Disc',
    anim: 'animate-spin-slow'
  },
  {
    id: 8,
    text: 'Composer avec la logique et l\'émotion',
    shape: 'heart',
    icon: 'Heart',
    anim: 'animate-pulse'
  },
  {
    id: 9,
    text: "Harmoniser l'intelligence et l'expérience",
    shape: 'cylinder',
    icon: 'Cpu',
    anim: ''
  },
  {
    id: 10,
    text: 'Créer le lien',
    shape: 'infinity',
    icon: 'InfinityIcon',
    anim: 'animate-pulse-slow'
  }
];
