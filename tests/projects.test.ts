// tests/projects.test.ts
import { test, expect } from '@playwright/test';

test('projects page shows project cards', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.locator('h1')).toContainText('Projets');
  const cards = page.locator('button[aria-label^="Voir le projet"]');
  await expect(cards).toHaveCount(7);
});

test('clicking a project card opens the modal', async ({ page }) => {
  await page.goto('/projects');
  await page.locator('button[aria-label^="Voir le projet"]').first().click();
  await expect(page.locator('[role="dialog"]')).toBeVisible();
});

test('close button closes the modal', async ({ page }) => {
  await page.goto('/projects');
  await page.locator('button[aria-label^="Voir le projet"]').first().click();
  await expect(page.locator('[role="dialog"]')).toBeVisible();
  await page.locator('button[aria-label="Fermer"]').click();
  await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 3000 });
});

test('back link navigates to home', async ({ page }) => {
  await page.goto('/projects');
  await page.locator('a[href="/"]').first().evaluate((el: HTMLAnchorElement) => el.click());
  await expect(page).toHaveURL('/');
});
