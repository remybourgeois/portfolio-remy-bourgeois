import { test, expect } from '@playwright/test';

/**
 * Garde-fous de l'audit SEO/GEO. Tout est vérifié sur le HTML brut servi
 * (`request.get`) et non sur la page hydratée : c'est exactement ce que voit
 * un crawler, et c'est là que les régressions passaient inaperçues.
 */

test('the site root is indexable and is the canonical home', async ({ request }) => {
  const html = await (await request.get('/')).text();
  // La racine portait « noindex, follow » : tous les backlinks externes
  // atterrissaient sur une page que Google ne pouvait pas indexer.
  expect(html).not.toMatch(/name="robots"[^>]*noindex/);
  expect(html).toContain('<link rel="canonical" href="https://remybourgeois.com/"');
});

test('the intro stays out of the index', async ({ request }) => {
  const html = await (await request.get('/intro')).text();
  expect(html).toMatch(/name="robots"[^>]*noindex/);
});

test('impact figures are present in the prerendered HTML', async ({ request }) => {
  const html = await (await request.get('/')).text();
  // Le compteur s'initialisait à 0 : le HTML annonçait « 0+ Années
  // d'expérience » à tous les crawlers et moteurs génératifs.
  for (const value of ['14+', '80+', '10M+', '8+']) {
    expect(html, `valeur ${value} absente du HTML prérendu`).toContain(value);
  }
  expect(html).not.toContain('>0+<');
});

test('the person entity is declared once, with claimed profiles', async ({ request }) => {
  const html = await (await request.get('/')).text();
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
  expect(blocks.length).toBe(1);

  const graph = JSON.parse(blocks[0][1].replace(/\\u003c/g, '<'))['@graph'];
  const person = graph.find((n: { '@type': string }) => n['@type'] === 'Person');

  expect(person['@id']).toBe('https://remybourgeois.com/#remy-bourgeois');
  expect(person.disambiguatingDescription).toBeTruthy();
  // sameAs est le mécanisme de consolidation d'entité : un seul lien ne
  // suffisait pas à distinguer cette personne de ses homonymes.
  expect(person.sameAs.length).toBeGreaterThanOrEqual(5);
  expect(graph.some((n: { '@type': string }) => n['@type'] === 'Review')).toBe(true);
});

test('case studies expose a heading structure and a hand-written description', async ({ request }) => {
  const html = await (await request.get('/projects/ofelia')).text();

  expect(html).toContain('<h1');
  for (const section of ['Contexte', 'Challenge', 'Résultat']) {
    expect(html, `${section} n'est pas un <h2>`).toMatch(
      new RegExp(`<h2[^>]*>${section}</h2>`)
    );
  }

  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  expect(desc.length).toBeGreaterThan(80);
  // L'ancienne description venait d'un slice(0, 160) et coupait en plein mot.
  expect(desc.trim()).toMatch(/[.!?]$/);
});

test('structured data links every page back to the same person', async ({ request }) => {
  for (const route of ['/projects', '/projects/ofelia', '/services', '/a-propos']) {
    const html = await (await request.get(route)).text();
    expect(html, `pas de JSON-LD sur ${route}`).toContain('application/ld+json');
    expect(html, `${route} ne référence pas l'entité`).toContain('remybourgeois.com/#remy-bourgeois');
    expect(html, `pas de fil d'Ariane sur ${route}`).toContain('BreadcrumbList');
  }
});

test('the FAQ answers exist in the HTML, not only once expanded', async ({ request }) => {
  const html = await (await request.get('/services')).text();
  expect(html).toContain('FAQPage');
  // Une FAQPage qui déclare des réponses absentes du DOM est du balisage
  // trompeur au sens des règles Google : les panneaux repliés utilisent donc
  // `hidden`, pas un {#if} qui les retirerait du HTML prérendu.
  const marker = 'ouvre ses propres Pull Requests';
  expect(html.split(marker).length - 1, `« ${marker} » attendu dans le JSON-LD ET dans le DOM`)
    .toBeGreaterThanOrEqual(2);
});

test('sitemap lists the new pages, dates them, and drops the old home', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml).toContain('<loc>https://remybourgeois.com/</loc>');
  expect(xml).toContain('<loc>https://remybourgeois.com/services</loc>');
  expect(xml).toContain('<loc>https://remybourgeois.com/a-propos</loc>');
  expect(xml).not.toContain('/home');
  // /intro est en noindex : la déclarer serait contradictoire.
  expect(xml).not.toContain('/intro');
  expect(xml).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
});

test('llms.txt is served and describes the entity', async ({ request }) => {
  const res = await request.get('/llms.txt');
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain('# Rémy Bourgeois');
  expect(body).toContain('/projects/ofelia');
  expect(body).toContain('Questions fréquentes');
});

test('robots.txt allows generative crawlers and points to the sitemap', async ({ request }) => {
  const body = await (await request.get('/robots.txt')).text();
  for (const bot of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']) {
    expect(body).toContain(bot);
  }
  expect(body).toContain('Sitemap: https://remybourgeois.com/sitemap.xml');
});
