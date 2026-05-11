// tests/home.test.ts
import { test, expect } from '@playwright/test';

test('home page loads with intro scene', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Rémy Bourgeois/);
  // The intro scene wrapper is always present in the DOM
  await expect(page.locator('[aria-label="Expérience immersive portfolio"]')).toBeVisible();
});

test('home page has DESIGNING INTENTIONS heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('DESIGNING');
});

test('projects route is accessible', async ({ page }) => {
  await page.goto('/projects');
  await expect(page).toHaveURL('/projects');
  await expect(page.locator('h1')).toContainText('Projets');
});
