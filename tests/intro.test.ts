import { test, expect } from '@playwright/test';

// L'intro vit sur /intro depuis que « / » sert le contenu indexable.

test('intro can be skipped with a visible link', async ({ page }) => {
  await page.goto('/intro');
  const skip = page.getByRole('link', { name: /Passer l'intro/ });
  await expect(skip).toBeVisible();
  await skip.click();
  await page.waitForURL((url) => url.pathname === '/');
});

test('ten steps lead to the portfolio', async ({ page }) => {
  await page.goto('/intro');
  const surface = page.getByRole('button', { name: /Commencer l'expérience/ });
  await expect(surface).toBeVisible();

  const { width, height } = page.viewportSize()!;
  const click = () => page.mouse.click(width / 2, height / 2);

  // `toBeVisible` passe déjà sur le HTML prérendu, avant que l'hydratation
  // n'ait attaché les handlers : une salve de clics à intervalle fixe en perd
  // les premiers, et l'intro n'atteignait alors jamais l'étape 10 (test
  // instable en CI). On réémet donc chaque clic jusqu'à ce que le compteur
  // l'ait bien enregistré.
  const advanceTo = (step: number) =>
    expect(async () => {
      await click();
      await expect(
        page.getByRole('button', { name: new RegExp(`Progression ${step} sur 10`) })
      ).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 15000 });

  // 1 appui pour démarrer l'expérience, puis les 10 étapes.
  await advanceTo(1);
  for (let step = 2; step <= 10; step++) {
    await click();
    await expect(
      page.getByRole('button', { name: new RegExp(`Progression ${step} sur 10`) })
    ).toBeVisible({ timeout: 5000 });
  }

  await page.waitForURL((url) => url.pathname === '/', { timeout: 15000 });
});

test('the interaction surface is a real keyboard-operable control', async ({ page }) => {
  await page.goto('/intro');
  // Un <button> plutôt qu'une <div tabindex> : le clavier fonctionne nativement.
  const surface = page.getByRole('button', { name: /Commencer l'expérience/ });
  await surface.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: /Progression 0 sur 10/ })).toBeVisible();
});
