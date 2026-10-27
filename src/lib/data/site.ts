// src/lib/data/site.ts
export const SITE_URL = 'https://remybourgeois.com';
export const SITE_NAME = 'Portfolio de Rémy Bourgeois';
export const SITE_LOCALE = 'fr_FR';
export const OG_IMAGE = `${SITE_URL}/assets/og-cover.jpg`;
export const EMAIL = 'remy.bourgeois@gmail.com';

/**
 * Lien de prise de rendez-vous (Calendly, cal.com, Google Agenda). Tant qu'il
 * est vide, les blocs de contact gardent « M'écrire » en bouton principal ;
 * renseigné, il devient le premier bouton : un prospect qui arrive de LinkedIn
 * veut un créneau de trente minutes, pas rédiger un courriel.
 */
export const BOOKING_URL = '';

/**
 * Mentions légales. Données du registre du commerce (RCS Lyon), telles que
 * publiées : la page les affiche mot pour mot.
 */
export const LEGAL = {
  company: 'WOO',
  form: 'SARL au capital de 1 000 €',
  siren: '939 432 209',
  siret: '939 432 209 00012',
  rcs: '939 432 209 R.C.S. Lyon',
  vat: 'FR51939432209',
  ape: '74.10Z, activités spécialisées de design',
  address: 'Immeuble Le Brévent, 47 avenue Valioud, 69110 Sainte-Foy-lès-Lyon',
  manager: 'Rémy Bourgeois, gérant',
  host: {
    name: 'Netlify, Inc.',
    address: '512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis',
    url: 'https://www.netlify.com'
  }
};

/**
 * Identifiants stables de l'entité. Tout le JSON-LD du site référence la même
 * personne par `@id` au lieu de redéclarer un objet Person par page : sans ça,
 * chaque page décrit une entité distincte et rien ne se consolide.
 */
export const PERSON_ID = `${SITE_URL}/#remy-bourgeois`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Profils tiers, tous revendiqués. Ils alimentent `sameAs`, qui est le
 * mécanisme par lequel un moteur rattache des présences dispersées à une seule
 * entité. Le versant musique/sound design est volontairement inclus : il est
 * du même auteur et il explique les 7 ans de design sonore en robotique.
 */
export const PROFILES = [
  'https://www.linkedin.com/in/remy-bourgeois/',
  'https://www.behance.net/rembourgeois',
  'https://www.malt.fr/profile/remybourgeois',
  'https://www.collective.work/profile/remy-bourgeois',
  'https://www.groupeonepoint.com/fr/profils/remy-bourgeois/',
  // Appuie le positionnement « design engineer » : le travail est dans le code.
  'https://github.com/remybourgeois',
  'https://remybourgeois.bandcamp.com/',
  'https://soundcloud.com/remybourgeois'
];

/**
 * Date de dernière révision éditoriale du site. Tenue à la main plutôt que
 * calculée depuis la date de build : un redéploiement sans changement de
 * contenu ne doit pas se présenter comme une mise à jour.
 */
export const CONTENT_UPDATED = '2026-10-26';
