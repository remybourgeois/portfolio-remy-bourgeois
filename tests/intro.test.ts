import { test, expect } from '@playwright/test';

test('intro can be skipped with a visible link', async ({ page }) => {
  await page.goto('/');
  const skip = page.getByRole('link', { name: /Passer l'intro/ });
  await expect(skip).toBeVisible();
  await skip.click();
  await page.waitForURL(/\/home$/);
});

test('ten steps lead to the portfolio', async ({ page }) => {
  await page.goto('/');
  const surface = page.getByRole('button', { name: /Commencer l'expérience/ });
  await expect(surface).toBeVisible();
  // 1 appui pour démarrer, puis 10 étapes.
  for (let i = 0; i < 11; i++) {
    await page.mouse.click(page.viewportSize()!.width / 2, page.viewportSize()!.height / 2);
    await page.waitForTimeout(120);
  }
  await page.waitForURL(/\/home$/, { timeout: 15000 });
});

test('the interaction surface is a real keyboard-operable control', async ({ page }) => {
  await page.goto('/');
  // Un <button> plutôt qu'une <div tabindex> : le clavier fonctionne nativement.
  const surface = page.getByRole('button', { name: /Commencer l'expérience/ });
  await surface.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: /Progression 0 sur 10/ })).toBeVisible();
});
