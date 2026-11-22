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

test('the service cards and the three grounds come in when seen', async ({ page }) => {
  await page.goto('/accompagnement');
  const card = page.locator('#conception');
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute('data-seen', '');
  await expect(card.locator('.list-cascade > *').last()).toHaveCSS('opacity', '1');
  const steps = page.locator('.terrain-step');
  await expect(steps).toHaveCount(3);
  await steps.last().scrollIntoViewIfNeeded();
  await expect(steps.last()).toHaveCSS('opacity', '1');
});
