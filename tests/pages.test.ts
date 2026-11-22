// tests/pages.test.ts
import { test, expect } from '@playwright/test';

test('the career timeline draws itself as the page scrolls', async ({ page }) => {
  await page.goto('/a-propos');
  const timeline = page.locator('.timeline');
  await expect(timeline).toHaveAttribute('data-progress', '');
  const progress = () =>
    timeline.evaluate((el) => Number((el as HTMLElement).style.getPropertyValue('--p')));
  const reached = () => timeline.locator('[data-reached]').count();
  const before = { progress: await progress(), reached: await reached() };
  await timeline.locator('.timeline-step').last().scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 400);
  await expect.poll(progress).toBeGreaterThan(before.progress);
  await expect.poll(reached).toBeGreaterThan(before.reached);
});

test('the timeline is fully drawn when motion is reduced', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/a-propos');
  // Sans l'action, pas d'attribut : le trait est entier et les étapes allumées.
  await expect(page.locator('.timeline')).not.toHaveAttribute('data-progress', '');
});

test('a profile link sinks while pressed', async ({ page }) => {
  await page.goto('/a-propos');
  const link = page.getByRole('link', { name: /linkedin\.com/ });
  await link.scrollIntoViewIfNeeded();
  const box = (await link.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(link).toHaveAttribute('data-pressed', '');
  // On quitte le lien sans relâcher dessus : relâcher l'ouvrirait.
  await page.mouse.move(0, 0);
  await expect(link).not.toHaveAttribute('data-pressed', '');
  await page.mouse.up();
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test('the service lists and the three grounds come in when seen', async ({ page }) => {
    await page.goto('/accompagnement');
    // Le déclenchement porte sur la liste elle-même : posée en bas d'une haute
    // carte, elle jouait son entrée avant qu'on n'arrive dessus.
    const list = page.locator('#mise-en-place .list-cascade');
    await expect(list).toHaveAttribute('data-seen-pending', '');
    await list.scrollIntoViewIfNeeded();
    await expect(list).toHaveAttribute('data-seen', '');
    await expect(list.locator('> *').last()).toHaveCSS('opacity', '1');
    const steps = page.locator('.terrain-step');
    await expect(steps).toHaveCount(3);
    await expect(steps.last()).toHaveAttribute('data-seen-pending', '');
    await steps.last().scrollIntoViewIfNeeded();
    await expect(steps.last()).toHaveAttribute('data-seen', '');
    await expect(steps.last()).toHaveCSS('opacity', '1');
  });
});

test.describe('text appearing while reading', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  for (const route of [
    '/accompagnement',
    '/a-propos',
    '/projects',
    '/projects/ofelia',
    '/mentions-legales'
  ]) {
    test(`${route}: text waits below the fold, and none of it stays hidden`, async ({ page }) => {
      await page.goto(route);
      const pending = page.locator('[data-appear="pending"]');
      // L'action s'installe à l'hydratation, après l'événement `load` : on
      // attend qu'elle ait marqué le texte situé sous l'écran.
      await expect.poll(() => pending.count()).toBeGreaterThan(3);
      // Ce qui est à l'écran au chargement n'est jamais masqué.
      const hiddenOnScreen = await page.evaluate(
        () =>
          [...document.querySelectorAll<HTMLElement>('[data-appear="pending"]')].filter(
            (el) => el.getBoundingClientRect().top < window.innerHeight
          ).length
      );
      expect(hiddenOnScreen).toBe(0);

      // On lit la page jusqu'en bas, écran par écran.
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y <= height; y += 500) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        await page.waitForTimeout(60);
      }
      // Garde-fou : un texte resté masqué serait un contenu perdu.
      await expect(pending).toHaveCount(0);
      // Les derniers éléments finissent leur entrée : on attend qu'aucun ne
      // soit plus transparent.
      const invisible = () =>
        page.evaluate(
          () =>
            [...document.querySelectorAll<HTMLElement>('[data-appear]')].filter(
              (el) => el.offsetParent !== null && getComputedStyle(el).opacity === '0'
            ).length
        );
      await expect.poll(invisible).toBe(0);
    });
  }
});

test('an inner page opens in a cascade, without waiting for scripts', async ({ browser }) => {
  // JavaScript coupé : la cascade d'ouverture est en CSS, elle doit jouer
  // quand même, et tout doit finir pleinement visible.
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/accompagnement');
  const title = page.getByRole('heading', { level: 1 });
  const crumbs = page.getByRole('navigation', { name: "Fil d'Ariane" });
  await expect(title).toHaveCSS('animation-name', 'load-rise');
  await expect(crumbs).toHaveCSS('animation-name', 'load-rise');
  // Le titre part après le fil d'Ariane.
  const delay = (el: typeof title) =>
    el.evaluate((node) => parseFloat(getComputedStyle(node).animationDelay));
  expect(await delay(title)).toBeGreaterThan(await delay(crumbs));
  await expect(title).toHaveCSS('opacity', '1');
  await expect(page.locator('#conception')).toBeVisible();
  await context.close();
});
