// src/lib/data/audit.ts
// Textes de l'offre « Audit design system », partagés entre la page dédiée et
// le bloc d'appel de l'accueil : une seule rédaction, deux emplacements.
import { EMAIL } from './site';

export const AUDIT_PATH = '/audit-design-system';
export const AUDIT_TITLE = 'Audit design system';
export const AUDIT_HOOK = "Votre design system est-il prêt pour l'IA ?";

export const AUDIT_PROBLEM =
  'Quand Figma et le code racontent deux histoires différentes, les équipes perdent du temps à se synchroniser et les agents IA produisent des interfaces incohérentes.';
export const AUDIT_PROMISE = 'Je mesure cet écart et je vous donne un plan pour le réduire.';
export const AUDIT_STANCE =
  "Il ne s'agit pas de supprimer Figma, mais de déplacer la source de vérité vers le code.";

export const AUDIT_DELIVERABLES = [
  'Une cartographie des écarts entre Figma et le code',
  'Un score de maturité de votre design system',
  'Une estimation du coût de la désynchronisation',
  'Une feuille de route en trois scénarios'
];

export const AUDIT_WHY =
  "J'ai travaillé sur trois niveaux de maturité : le design system d'un grand groupe (Crédit Agricole, adopté par plus de 15 équipes produit), une refonte avec design tokens (iPify) et une création complète dans le code (Ofelia).";

/** Les trois études de cas citées dans « Pourquoi moi ». */
export const AUDIT_CASES = [
  { client: 'Crédit Agricole', slug: 'credit-agricole' },
  { client: 'iPify', slug: 'ipify' },
  { client: 'Ofelia', slug: 'ofelia' }
];

export const AUDIT_CTA = 'Parlons de votre design system';
export const AUDIT_MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(AUDIT_TITLE)}`;
