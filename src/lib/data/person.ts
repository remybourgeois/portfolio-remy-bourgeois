// src/lib/data/person.ts
// Nœuds JSON-LD réutilisables. Toutes les pages pointent vers les mêmes `@id`
// pour décrire une entité unique au lieu de N entités homonymes.
import { SITE_URL, SITE_NAME, PERSON_ID, WEBSITE_ID, PROFILES, EMAIL } from './site';
import { TESTIMONIALS } from './testimonials';

/** Le nœud Person complet. À déclarer une seule fois, sur la home. */
export const personNode = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Rémy Bourgeois',
  givenName: 'Rémy',
  familyName: 'Bourgeois',
  jobTitle: ['Senior Product Designer', 'Product Design Engineer'],
  description:
    "Senior Product Designer et Design Engineer freelance basé à Lyon. 14 ans d'expérience en Design Systems, IA conversationnelle et interfaces SaaS B2B complexes, dont 7 ans en robotique humanoïde.",
  // Champ prévu par Schema.org pour lever une homonymie. Plusieurs personnes
  // partagent ce nom : on dit explicitement laquelle est décrite ici.
  disambiguatingDescription:
    "Product Design Engineer freelance à Lyon, spécialisé en Design Systems, IA conversationnelle et SaaS B2B. Également directeur artistique, musicien et sound designer — ce versant sonore vient de ses 7 ans en robotique humanoïde chez Aldebaran. À ne pas confondre avec l'acteur français homonyme.",
  url: `${SITE_URL}/`,
  mainEntityOfPage: { '@id': `${SITE_URL}/#profilepage` },
  image: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/assets/remy-bourgeois.webp`,
    width: 500,
    height: 500
  },
  email: EMAIL,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lyon',
    addressRegion: 'Auvergne-Rhône-Alpes',
    addressCountry: 'FR'
  },
  sameAs: PROFILES,
  knowsLanguage: ['fr', 'en'],
  knowsAbout: [
    'Product Design',
    'Design System',
    'Design Tokens',
    'IA conversationnelle',
    'UX/UI Design',
    'SaaS B2B',
    'Design Engineering',
    'Interaction homme-machine',
    'Sound design'
  ],
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Product Design Engineer',
    occupationLocation: { '@type': 'City', name: 'Lyon' },
    skills: [
      'Design System',
      'Design Tokens',
      'IA conversationnelle',
      'SaaS B2B',
      'Prototypage en code',
      'Storybook',
      'Figma'
    ]
  }
};

/** Un nœud Review par témoignage, rattaché à la Person par `itemReviewed`. */
export const reviewNodes = TESTIMONIALS.map((t) => ({
  '@type': 'Review',
  '@id': `${SITE_URL}/#review-${t.id}`,
  itemReviewed: { '@id': PERSON_ID },
  author: {
    '@type': 'Person',
    name: t.name,
    jobTitle: t.role,
    worksFor: { '@type': 'Organization', name: t.company }
  },
  reviewBody: t.text,
  inLanguage: t.lang === 'en' ? 'en' : 'fr'
}));

/** Nœud WebSite, référencé par `isPartOf` depuis chaque page. */
export const websiteNode = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE_URL}/`,
  name: SITE_NAME,
  inLanguage: 'fr-FR',
  publisher: { '@id': PERSON_ID }
};

/** Fil d'Ariane : Schema.org attend des positions qui commencent à 1. */
export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`
    }))
  };
}
