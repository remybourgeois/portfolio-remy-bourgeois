import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Audit automatisé sur les quatre gabarits. Cible la famille de régressions
 * trouvée en revue manuelle : huit valeurs de texte sous le seuil WCAG AA.
 */
const ROUTES = ['/home', '/projects', '/projects/ofelia', '/projects/aldebaran'];

/**
 * Fait défiler toute la page par pas d'un écran pour déclencher chaque
 * IntersectionObserver de révélation, puis remonte. Sans ça, axe mesure le
 * texte à travers un parent encore à opacity-0 et remonte une centaine de
 * faux positifs de contraste.
 */
async function revealAll(page: Page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  const step = await page.evaluate(() => window.innerHeight);
  for (let y = 0; y < height; y += step) {
    await page.evaluate((to) => window.scrollTo(0, to), y);
    await page.waitForTimeout(150);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  // Laisse les transitions de révélation (1 s) se terminer.
  await page.waitForTimeout(1200);
}

for (const route of ROUTES) {
  test(`${route} has no detectable WCAG A/AA violation`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'networkidle' });
    await revealAll(page);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const summary = results.violations.map(
      (v) => `${v.id} (${v.impact}) x${v.nodes.length}: ${v.help}`
    );
    expect(summary, `Violations sur ${route}`).toEqual([]);
  });
}

test('revealed sections actually reach full opacity', async ({ page }) => {
  // Garde-fou sur le motif de révélation : un contenu qui resterait bloqué à
  // opacity-0 serait invisible tout en passant les assertions de visibilité.
  await page.goto('/home');
  await revealAll(page);
  const faded = await page.evaluate(() =>
    [...document.querySelectorAll('main *')].filter(
      (el) => Number(getComputedStyle(el).opacity) === 0 && (el as HTMLElement).offsetHeight > 0
    ).length
  );
  expect(faded).toBe(0);
});
