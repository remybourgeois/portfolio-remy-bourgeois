// src/lib/data/site.ts
export const SITE_URL = 'https://remybourgeois.com';
export const SITE_NAME = 'Rémy Bourgeois — Portfolio';
export const SITE_LOCALE = 'fr_FR';
export const OG_IMAGE = `${SITE_URL}/assets/og-cover.jpg`;
export const EMAIL = 'remy.bourgeois@gmail.com';

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
  'https://remybourgeois.bandcamp.com/',
  'https://soundcloud.com/remybourgeois'
];

/**
 * Date de dernière révision éditoriale du site. Tenue à la main plutôt que
 * calculée depuis la date de build : un redéploiement sans changement de
 * contenu ne doit pas se présenter comme une mise à jour.
 */
export const CONTENT_UPDATED = '2026-09-22';
