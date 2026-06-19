// Sitemap généré depuis les données projet — reste à jour automatiquement.
import { PROJECTS } from '$lib/data/projects';
import { SITE_URL } from '$lib/data/site';

export const prerender = true;

type Entry = { loc: string; priority: string };

export function GET() {
  const entries: Entry[] = [
    { loc: '/home', priority: '1.0' },
    { loc: '/projects', priority: '0.8' },
    ...PROJECTS.map((p) => ({ loc: `/projects/${p.slug}`, priority: '0.7' }))
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${SITE_URL}${e.loc}</loc>
    <changefreq>monthly</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' }
  });
}
