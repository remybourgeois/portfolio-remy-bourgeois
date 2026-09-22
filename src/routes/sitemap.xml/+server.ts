// Sitemap généré depuis les données projet — reste à jour automatiquement.
import { PROJECTS } from '$lib/data/projects';
import { SITE_URL, CONTENT_UPDATED } from '$lib/data/site';

export const prerender = true;

/**
 * `changefreq` et `priority` ont été retirés : Google les ignore depuis 2023.
 * `lastmod` est en revanche le seul signal de fraîcheur réellement exploité,
 * et il manquait. `/intro` reste hors sitemap — la page est en noindex.
 */
const PATHS = [
  '/',
  '/services',
  '/a-propos',
  '/projects',
  ...PROJECTS.map((p) => `/projects/${p.slug}`)
];

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PATHS.map(
  (loc) => `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${CONTENT_UPDATED}</lastmod>
  </url>`
).join('\n')}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' }
  });
}
